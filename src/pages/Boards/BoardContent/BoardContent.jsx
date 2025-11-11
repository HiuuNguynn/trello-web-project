import React from 'react';
import Box from '@mui/material/Box';
import ListColumns from '~/pages/Boards/BoardContent/ListColumns/ListColumns';
import { mapOrder } from '~/utils/sorts';
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision,
} from '@dnd-kit/core';
import { useEffect, useState, useCallback, useRef } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep, isEmpty } from 'lodash';
import { generatePlaceholderCard } from '~/utils/formatter'

import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';
// useRef is used to track the last over id during custom collision detection
// Định nghĩa các kiểu phần tử đang được kéo
const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD',
}
function BoardContent({board}) {

  // Yêu cầu chuột di chuyển 10px mới kích hoạt drag
  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 } });
  // Nhấn giữ 250ms mới kích hoạt drag trên cảm ứng
  const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 250, tolerance:5} });
  // ưu tiên sử dụng 2 sensors là mouse và touch để có trải nhiệm trên mobile tố nhất và không bị bug
  const sensors = useSensors(mouseSensor, touchSensor);

  const [orderedColumns, setOrderedColumns] = useState([])

  // Cùng một thời điểm chỉ có phần tử đang được kéo (column hoặc card)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragData, setActiveDragData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  
  // Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm cuối cùng trước đó vd 137)
  const lastOverId  = useRef(null)

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  // Tìm một cái Column theo CardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Function chunng xử lý việc cập nhật lại State trong trường hợp di chuyển Card giữa các Column khác nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumns(prevColumns => {
      // Tìm vị trí (index) của cái overCard trong column đích (nơi card sắp được thả)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      
      // Logic tính toán "cardIndex mới" trên hoặc dưới overCard được lấy ra từ thư viện
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      
      // Clone mảng OrderdColumnState cũ ra một cái mới để xử lý data rồi return - cập nhật lại OrderdColumnState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // Column cũ
      if (nextActiveColumn) {
        // Xóa card ở cái column active (cũng có thể hiểu là column cũ, cái lúc mà kéo card ra khoeir nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Thêm Placeholder Card nếu Column rỗng
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      // Column mới
      if (nextOverColumn) {
        // Kiểm tra xem card đang kéo nó có tồn tạo ở overCoulmn chưa, nếu có thì xóa nó trước
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phải cập nhật lại chuẩn dữ liệu columnId trong card khi kéo card giữa 2 clumn khác nhau
        const rebuild_activeDraggingCardata = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardata)

        // Xóa Placeholder Card đi nếu nó đnag tồn tại
        nextOverColumn.cards =  nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }
      
      return nextColumns
    })
  }

  // Trigger khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ?
      ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragData(event?.active?.data?.current);

    // Nếu là kéo card thì mới thực hiện hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // Không làm gì cả nếu mà kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    
    // Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    const { active, over } = event

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra ngoài phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return
    
    // activeDraggingCard: Là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over

    // Tìm ra 2 columns theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    
    // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
    if (!activeColumn || !overColumn) return

    // Xử lý logic ở đay chỉ khi kéo card qua 2 column khác nhau, còn nếu kéo card trong chính column ban đầu của nó thì không làm gì
    // Vì ở đây là đoạn xử lý lúc kéo (handleDragOver), còn xử lý kéo xong thì nó lại là vấn đề khác ở (handleDragEnd)
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }
  // Trigger khi kết thúc kéo một phần tử
  const handleDragEnd = (event) => {
    const {active, over} = event;

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra ngoài phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return

    //  Xử lý kéo thả card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
       // activeDraggingCard: Là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over

      // Tìm ra 2 columns theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      
      // Nếu không tồn tại 1 trong 2 column thì không làm gì hết, tránh crash trang web
      if (!activeColumn || !overColumn) return

      
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns (
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData
        )
      } else {
        // Hành động kéo thả card trong cùng 1 cái column

        const oldColumnIndex = oldColumnWhenDraggingCard?.cards.findIndex(c => c._id === activeDragItemId);
        const newColumnIndex = overColumn?.cards.findIndex(c => c._id === overCardId);

        // Dùng arrayMove vì kéo card trong 1 column thì tương tự với logic kéo column trong 1 cái board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldColumnIndex, newColumnIndex);
        setOrderedColumns(prevColumns => {
          // Clone manrg OrderdColumnState cũ ra một cái mảng để xử lý data rồi return - cập nhật lại OrderdColumnState mới
          const nextColumns = cloneDeep(prevColumns);

          // Tìm tới column mà chúng ta đang thả
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)

          // Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id )

          return nextColumns

        });
      }
    }

    // Xử lý kéo thả column trong một cái boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN && active.id != over.id) {
      // Nếu vị trí sau khi kéo thẻ khác với vị trí ban đầu
        const oldIndex = orderedColumns.findIndex(c => c._id === active.id);
        const newIndex = orderedColumns.findIndex(c => c._id === over.id);
    
        // cái này được dùng để sắp xếp lại mảng Columns ban đầu
        const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
        // Cập nhật state để phản ánh thay đổi vị trí của columns
        setOrderedColumns(dndOrderedColumns)
    }

    // Những dữ liệu sau khi kéo thả luôn phải đưa về giá trị ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Amimation khi thả phần tử - Test bằng cách kéo thả trực tiếp và nhìn phần tử giữ chỗ Overlay
  const dropAnimation = {
   sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        }
      }
    })
  }

  const collisionDetectionStrategy = useCallback((args) => {

    // Trường hợp kéo column thì dùng closestCorners là chuẩn nhất
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN ) {
      return closestCorners({...args})
    }

    // Tìm các điểm giao nhau, va chạm - intersection với con trỏ
    const pointerIntersections = pointerWithin(args)
    
    if (!pointerIntersections?.length) return
    
    // Tìm overId đầu tiên trong pointerIntersections phía trên
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      const checkColumn = orderedColumns.find(column => column._id === overId)

      if (checkColumn) {
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
      }
      lastOverId.current = overId
      return [{ id: overId }]
    }
    // Nếu overId là nul thì trả về mảng rỗng - tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])
 

  return (
    <DndContext
      collisionDetection={collisionDetectionStrategy}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      // cảm biến đã giải thích ở video số 30
      sensors = {sensors}>
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34496e' : '#F4F6F8',
        padding: '10px 0',
      }}>
      <ListColumns columns = {orderedColumns} />
      <DragOverlay dropAnimation={dropAnimation} >
        {!activeDragItemType && null}
        {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragData} />}
        {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragData} />}
      </DragOverlay>
    </Box>
    </DndContext>
  )
}

export default BoardContent
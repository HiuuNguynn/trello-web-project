import React, { useEffect } from 'react';
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
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { useState } from 'react';
import { arrayMove, defaultAnimateLayoutChanges } from '@dnd-kit/sortable';

import Column from './ListColumns/Column/Column';
import Card from './ListColumns/Column/ListCards/Card/Card';
import { cloneDeep } from 'lodash';
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
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  // Tìm một cái Column theo CardId
  const findColumnByCardId = (cardId) => {
    // Đoạn này cần lưu ý, nên dùng c.cards thay vì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước rồi mới tạo ra cardOrderIds mới.
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Trigger khi bắt đầu kéo một phần tử
  const handleDragStart = (event) => {
    const {active} = event;
    console.log('Drag started:', active);
    setActiveDragItemId(event?.active?.id);
    setActiveDragItemType(
      event?.active?.data?.current?.columnId ?
      ACTIVE_DRAG_ITEM_TYPE.CARD :
      ACTIVE_DRAG_ITEM_TYPE.COLUMN
    );
    setActiveDragData(event?.active?.data?.current);
  }

  // Trigger trong quá trình kéo (drag) một phần tử
  const handleDragOver = (event) => {
    // Không làm gì cả nếu mà kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    
    // Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    // console.log('handleDragOver: ', event)
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
      setOrderedColumns(prevColumns => {
        // Tìm vị trí (index) của cái overCard trong column đích (nơi card sắp được thả)
        const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
        
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

          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
        }
        // Column mới
        if (nextOverColumn) {
          // Kiểm tra xem card đang kéo nó có tồn tạo ở overCoulmn chưa, nếu có thì xóa nó trước
          nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

          // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới
          nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, activeDraggingCardData)

          // Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
          nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
        }
        
        console.log('nextColumns', nextColumns);
        
        return nextColumns
      })
    }
  }
  // Trigger khi kết thúc kéo một phần tử
  const handleDragEnd = (event) => {

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // console.log('Hành động kéo thả Card - Tạm thời không làm gì cả');
      return
    }

    const {active, over} = event;

    // Cần đảm bảo nếu không tồn tại active hoặc over (khi kéo ra ngoài phạm vi container) thì không làm gì (tránh crash trang)
    if (!active || !over) return

    // Nếu vị trí sau khi kéo thẻ khác với vị trí ban đầu
    if(active.id != over.id) {

      console.log('Drag and drop:', event);
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id);
      const newIndex = orderedColumns.findIndex(c => c._id === over.id);
  
      // cái này được dùng để sắp xếp lại mảng Columns ban đầu
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex); 
      
      // 2 cái console.log dữ liệu này sau dùng để gọi API
      // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);
      // console.log('dndOrderedColumns:', dndOrderedColumns);
      // console.log('dndOrderedColumnsIds:', dndOrderedColumnsIds);
      setOrderedColumns(dndOrderedColumns);
    }
    
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragData(null)
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

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors = {sensors}>
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34496e' : '#1976d2',
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
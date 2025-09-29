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

  // Trigger khi bắt đầy kéo một phần tử
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

  // Trigger khi kết thúc kéo một phần tử
  const handleDragEnd = (event) => {
    const {active, over} = event;

    if(!over) return; // nếu không có over thì không làm gì cả
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
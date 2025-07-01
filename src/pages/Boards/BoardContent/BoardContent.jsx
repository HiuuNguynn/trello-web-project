import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import ListColumns from '~/pages/Boards/BoardContent/ListColumns/ListColumns';
import { mapOrder } from '~/utils/sorts';
import { DndContext,  useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
function BoardContent({board}) {

  const mouseSensor = useSensor(MouseSensor, {activationConstraint: { distance: 10 } });
  const touchSensor = useSensor(TouchSensor, {activationConstraint: {delay: 250, tolerance:5} });
  // ưu tiên sử dụng 2 sensors là mouse và touch để có trải nhiệm trên mobile tố nhất và không bị bug
  const sensors = useSensors(mouseSensor, touchSensor);


  const [orderedColumns, setOrderedColumns] = useState([])
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'));
  }, [board]);

  const handleDragEnd = (event) => {
    const {active, over} = event;

    if(!over) return; // nếu không có over thì không làm gì cả
    if(active.id != over.id) console.log('Drag and drop:', event);

    const oldIndex = orderedColumns.findIndex(c => c._id === active.id);
    const newIndex = orderedColumns.findIndex(c => c._id === over.id);

    // cái này được dùng để sắp xếp lại mảng Columns ban đầu
    const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex); 
    
    // // 2 cái console.log dữ liệu này sau dùng để gọi API
    // const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id);
    // console.log('dndOrderedColumns:', dndOrderedColumns);
    // console.log('dndOrderedColumnsIds:', dndOrderedColumnsIds);
    // console.log('test');
    
    // setOrderedColumns(dndOrderedColumns);
  };
  return (
    <DndContext onDragEnd={handleDragEnd} sensors = {sensors}>
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#34496e' : '#1976d2',
        padding: '10px 0',
      }}>
      <ListColumns columns = {orderedColumns} />
    </Box>
    </DndContext>
  )
}

export default BoardContent
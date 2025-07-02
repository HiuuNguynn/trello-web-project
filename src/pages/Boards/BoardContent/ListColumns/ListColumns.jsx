import React from 'react'
import Box from '@mui/material/Box';
import Column from './Column/Column'
import Button from '@mui/material/Button';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
  /**
   * Thằng SortableContext yêu câu items là một mảng dạng ['id-1', 'id-2', ...] chứ không phải là mảng đối tượng [{_id: 'id-1', ...}, {_id: 'id-2', ...}]
   * Nếu không đúng thì vẫn kéo thả được nhưng sẽ không có hiệu ứng kéo thả animation
   */
function ListColumns({columns}) {
  return (
    <SortableContext items = {columns?.map(c => c?._id)} strategy={horizontalListSortingStrategy}>
    <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'inherit',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': {m:2}
        }}>
        {/* Box column Test 01 */}
        {columns?.map(column => <Column key = {column._id} column = {column}/>)}

         <Box sx={{
            maxWidth: '200px',
            minWidth: '200px',
            mx:2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
           
          }}>
            <Button
              startIcon = {<NoteAddIcon/>}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl:2.5,
                py:1
              }}
            >
              Add new column</Button>
         </Box>
    </Box>
    </SortableContext>
  )
}
// console.log('columns:', columns);
console.log('test-commit01');
console.log('test-commit02');
<<<<<<< HEAD
=======
console.log('test-commit03');

>>>>>>> test02
export default ListColumns
import React from 'react'
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Cloud from '@mui/icons-material/Cloud';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Tooltip from '@mui/material/Tooltip';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddCardIcon from '@mui/icons-material/AddCard';
import Button from '@mui/material/Button';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCard from './ListCards/ListCards';
import { mapOrder } from '~/utils/sorts';
import Box from '@mui/material/Box';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
function Column({ column }) {

    const { attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({ 
        id: column._id,
        data: { ...column }
     });
    
    const dndKitColumnStyle = {
        touchAction:'none',
        transform: CSS.Translate.toString(transform),
        transition,
        height: '100%',
        opacity: isDragging ? 0.5 : undefined,
    };


    const orderedCards = mapOrder(column?.cards, column?.cardOrderIds, '_id');
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => { setAnchorEl(event.currentTarget) };
    const handleClose = () => { setAnchorEl(null) };

    return (
    <div ref = {setNodeRef} style={dndKitColumnStyle} {...attributes}>
        <Box
            {...listeners}
            sx={{
                maxWidth: '300px',
                minWidth: '300px',
                bgcolor: (theme) => theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
                ml: 2,
                borderRadius: '6px',
                height: 'fit-content',
                maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)} )`,
            }}>
            {/* Box Column Header */}
            <Box
                sx={{
                    height: (theme) => theme.trello.columnHeaderHeight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                }}>
                <Typography variant='h6' sx={{
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '1rem'
                }}
                >
                    {column?.title}
                </Typography>
                <Box>
                    <Tooltip title="More actions">
                        <ExpandMoreIcon
                            sx={{ color: 'text.primary', cursor: 'pointer' }}
                            id="basic-button-workspace"
                            aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        // endIcon={<ExpandMoreIcon />}
                        />
                    </Tooltip>
                    <Menu
                        id="basic-menu-column-dropdown"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button-workspace"',
                        }}
                    >
                        <MenuItem>
                            <ListItemIcon><AddCardIcon fontSize="small" /></ListItemIcon>
                            <ListItemText >Add new card</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                            <ListItemText >Cut</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon><ContentCopy fontSize="small" /></ListItemIcon>
                            <ListItemText >Copy</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon><ContentPaste fontSize="small" /></ListItemIcon>
                            <ListItemText >Paste</ListItemText>
                        </MenuItem>
                        <Divider />
                        <MenuItem>
                            <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                            <ListItemText>Archive this column</ListItemText>
                        </MenuItem>
                        <MenuItem>
                            <ListItemIcon><DeleteForeverIcon fontSize="small" /></ListItemIcon>
                            <ListItemText>Remove this column</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            {/* Box List Card  */}
            <ListCard cards = {orderedCards}/>

            {/* Box Column Footer */}
            <Box sx={{
                height: (theme) => theme.trello.columnFooterHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                p: 2,
            }}>
                <Button startIcon={<AddCardIcon />}> Add new card</Button>
                <Tooltip title='Drag to move' >
                    <DragHandleIcon sx={{ cursor: 'pointer' }} />
                </Tooltip>
            </Box>
        </Box>
    </div>
    )
}

export default Column
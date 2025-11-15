import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material'
import { getAllBoardsAPI, createNewBoardAPI } from '~/apis'
import { toast } from 'react-toastify'
import AddIcon from '@mui/icons-material/Add'

function BoardsList() {
  const navigate = useNavigate()
  const [boards, setBoards] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'private'
  })
  const [errors, setErrors] = useState({})
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const data = await getAllBoardsAPI()
        setBoards(data || [])
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to load boards'
        toast.error(errorMessage)
        if (error.response?.status === 401) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchBoards()
  }, [navigate])

  const handleBoardClick = (boardId) => {
    navigate(`/boards/${boardId}`)
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
    setFormData({ title: '', description: '', type: 'private' })
    setErrors({})
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setFormData({ title: '', description: '', type: 'private' })
    setErrors({})
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const newErrors = {}
    
    if (!formData.title) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    } else if (formData.title.length > 50) {
      newErrors.title = 'Title must be less than 50 characters'
    }
    
    if (!formData.description) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 3) {
      newErrors.description = 'Description must be at least 3 characters'
    } else if (formData.description.length > 256) {
      newErrors.description = 'Description must be less than 256 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreateBoard = async () => {
    if (!validate()) {
      return
    }

    setCreating(true)
    try {
      // Lấy userId từ localStorage (từ login response)
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      
      // Tạo payload với userId (ObjectId)
      const payload = {
        ...formData,
        ...(user?._id && { userId: user._id })
      }
      
      const response = await createNewBoardAPI(payload)
      toast.success(response.message || 'Board created successfully!')
      
      handleCloseDialog()
      
      // Navigate to the new board if we have the board data
      const newBoard = response.data || response
      if (newBoard?._id) {
        navigate(`/boards/${newBoard._id}`)
      } else {
        // Fallback: refresh boards list
        const data = await getAllBoardsAPI()
        setBoards(data || [])
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create board'
      toast.error(errorMessage)
    } finally {
      setCreating(false)
    }
  }

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        width: '100vw',
        height: '100vh'
      }}>
        <CircularProgress />
        <Typography>Loading boards...</Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          My Boards
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
          sx={{ textTransform: 'none' }}
        >
          Create Board
        </Button>
      </Box>
      
      {boards.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            You don't have any boards yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Create your first board to get started!
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenDialog}
            sx={{ textTransform: 'none' }}
          >
            Create Board
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {boards.map((board) => (
            <Grid item xs={12} sm={6} md={4} key={board._id}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  cursor: 'pointer',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    elevation: 4,
                    transform: 'translateY(-4px)',
                    transition: 'all 0.2s'
                  }
                }}
                onClick={() => handleBoardClick(board._id)}
              >
                <Typography variant="h6" gutterBottom>
                  {board.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                  {board.description}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 2 }}>
                  {board.type === 'public' ? 'Public' : 'Private'}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Board Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Board</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              margin="dense"
              id="title"
              label="Board Title"
              name="title"
              type="text"
              fullWidth
              variant="outlined"
              required
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
              inputProps={{ maxLength: 50 }}
            />
            <TextField
              margin="dense"
              id="description"
              label="Description"
              name="description"
              type="text"
              fullWidth
              variant="outlined"
              required
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
              inputProps={{ maxLength: 256 }}
            />
            <FormControl fullWidth>
              <InputLabel id="type-label">Board Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formData.type}
                label="Board Type"
                onChange={handleChange}
              >
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="public">Public</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={creating}>
            Cancel
          </Button>
          <Button onClick={handleCreateBoard} variant="contained" disabled={creating}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default BoardsList


import axios from 'axios'
import { API_ROOT } from '~/utils/constants'

axios.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_ROOT}/v1/auth/refresh-token`, {
            refreshToken
          })
          
          const newAccessToken = response.data.data?.accessToken
          if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken)
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
            return axios(originalRequest)
          }
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

/** Authentication */
export const registerAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/register`, data)
  return response.data
}

export const loginAPI = async (data) => {
  const response = await axios.post(`${API_ROOT}/v1/auth/login`, data)
  return response.data
}

export const logoutAPI = async () => {
  const response = await axios.delete(`${API_ROOT}/v1/auth/logout`)
  return response.data
}

export const refreshTokenAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/auth/refresh-token`)
  return response.data
}

/** Boards */
export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`)
  return response.data.data
}

export const getAllBoardsAPI = async () => {
  const response = await axios.get(`${API_ROOT}/v1/boards`)
  return response.data.data
}

export const createNewBoardAPI = async (newBoardData) => {
  const response = await axios.post(`${API_ROOT}/v1/boards`, newBoardData)
  return response.data
}

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/${boardId}`, updateData)
  return response.data
}

export const moveCardToDifferentColumnAPI = async (updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/boards/supports/moving_card`, updateData)
  return response.data
}

/** Columns */
export const createNewColumnAPI = async (newColumnData) => {
  const response = await axios.post(`${API_ROOT}/v1/columns`, newColumnData)
  return response.data
}

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await axios.put(`${API_ROOT}/v1/columns/${columnId}`, updateData)
  return response.data
}

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await axios.delete(`${API_ROOT}/v1/columns/${columnId}`)
  return response.data
}

/** Cards */
export const createNewCardAPI = async (newCardData) => {
  const response = await axios.post(`${API_ROOT}/v1/cards`, newCardData)
 
  return response.data
}

let apiRoot = ''
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:8017'
} else {
  // Production API URL - thay bằng URL thực tế của bạn
  apiRoot = import.meta.env.VITE_API_URL || 'https://trello-ykqa.onrender.com'
}
export const API_ROOT = apiRoot

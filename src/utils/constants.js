let apiRoot = ''
if (import.meta.env.DEV || import.meta.env.MODE === 'development') {
  apiRoot = 'http://localhost:8017'
} else {
  apiRoot = 'https://trello-api-ebon.vercel.app'
}
export const API_ROOT = apiRoot

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    svgr()

  ],
   resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }, 
  server: {
    port: 4000,   // ✅ Đổi cổng tại đây
    host: true    // ✅ Cho phép truy cập từ các thiết bị trong mạng LAN
  }

})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/bigdata-swoc-dam': {
        target: 'https://bigdata-swoc.rid.go.th',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bigdata-swoc-dam/, '/api/ma/dashboard/get_dam'),
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      },
      '/api/thaiwater-rain': {
        target: 'https://api-v3.thaiwater.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/thaiwater-rain/, '/api/v1/thaiwater30/public/rain_24h'),
        headers: {
          'Referer': 'https://www.thaiwater.net/',
          'User-Agent': 'Mozilla/5.0'
        }
      },
      '/api/thaiwater-waterlevel': {
        target: 'https://api-v3.thaiwater.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/thaiwater-waterlevel/, '/api/v1/thaiwater30/public/waterlevel_load'),
        headers: {
          'Referer': 'https://www.thaiwater.net/',
          'User-Agent': 'Mozilla/5.0'
        }
      },
      '/api': {
        target: 'https://prachin.space',
        changeOrigin: true,
      },
    },
  },
})

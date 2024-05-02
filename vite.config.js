import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    // proxy:{
    //   '/api':{
    //     target:"http://localhost:3000",
    //     secure:false
    //   },
    // },
  },
  plugins: [react()],
})

// each time you see /api ,add the localhost 300 at the beginning
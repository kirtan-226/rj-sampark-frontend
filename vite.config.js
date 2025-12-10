import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: "/",  // Ensures correct base path
    server: {
        historyApiFallback: true,  // Fixes 404 issues on refresh
    },
})
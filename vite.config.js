import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // Nếu bạn dùng React

export default defineConfig({
  plugins: [react()], // Thêm plugin React nếu cần

  define: {
    global: 'globalThis', // Định nghĩa biến global nếu cần
  },

  server: {
    port: 3000, // Cổng mặc định là 3000
    open: true, // Tự động mở trình duyệt
    proxy: {
      '/ws': {
        target: 'http://localhost:8080',
        ws: true,
        changeOrigin: true,
      }
    }
  },

  build: {
    outDir: "build", // Thư mục đầu ra khi build (tương tự như CRA)
  },
});

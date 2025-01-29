import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";
import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement // Ép kiểu rõ ràng cho phần tử HTML
);
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

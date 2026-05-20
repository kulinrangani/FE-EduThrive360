import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { getStoredToken, setAuthToken } from "./api/client.js";

const stored = getStoredToken();
if (stored) setAuthToken(stored);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

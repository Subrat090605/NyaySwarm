// main.tsx - Replace your existing src/main.tsx with this
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./auth.css";
import RootApp from "./RootApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);

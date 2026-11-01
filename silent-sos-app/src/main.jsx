import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./styles.css";
import "./components/Sidebar.css";
import "./components/Enhancements.css";
import "./components/Refinements.css";
import "./components/Signal.css";
import "./components/Position.css";
import "./components/Essentials.css";
import "./components/LivePosition.css";
import "./Theme.css";
import "./Editorial.css";
import "./LiquidGlass.css";
import "./components/NavigationChrome.css";
import "./components/InterfaceRefinements.css";
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
);

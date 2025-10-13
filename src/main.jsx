import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { WeatherProvider } from "./context/WeatherContext";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <WeatherProvider>
      <App />
    </WeatherProvider>
  </React.StrictMode>
);

import React, { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(WeatherContext);
  return (
    <button className="btn small ghost" onClick={toggleTheme}>
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}

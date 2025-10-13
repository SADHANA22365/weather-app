import React, { useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";

export default function History() {
  const { history, fetchWeatherByCity } = useContext(WeatherContext);
  if (!history || history.length === 0) return null;
  return (
    <div className="history card">
      <h4>Recent</h4>
      <div className="history-list">
        {history.map((c) => (
          <button key={c} className="chip" onClick={() => fetchWeatherByCity(c)}>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

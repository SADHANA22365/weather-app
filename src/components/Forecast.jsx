import React from "react";
import { motion } from "framer-motion";

function dayLabel(dt, tz) {
  const d = new Date((dt + tz) * 1000);
  const names = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return names[d.getUTCDay()];
}

export default function Forecast({ data }) {
  if (!data?.list) return null;
  const tz = data.city?.timezone || 0;
  return (
    <aside className="card forecast">
      <h4>5-Day Forecast</h4>
      <div className="forecast-list">
        {data.list.map((item) => (
          <motion.div key={item.dt} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="forecast-item">
            <div className="forecast-day">{dayLabel(item.dt, tz)}</div>
            <img src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`} alt={item.weather[0].description} />
            <div className="forecast-temp">{Math.round(item.main.temp)}°</div>
            <div className="muted small">{item.weather[0].main}</div>
          </motion.div>
        ))}
      </div>
    </aside>
  );
}

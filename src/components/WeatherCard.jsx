import React from "react";
import { motion } from "framer-motion";

function pad(n) {
  return String(n).padStart(2, "0");
}

function formatTimeHm(dt, tz) {
  const d = new Date((dt + tz) * 1000);
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  return `${hh}:${mm}`;
}

function formatLocalDateTime(dt, tz) {
  const d = new Date((dt + tz) * 1000);
  const weekday = d.toUTCString().split(",")[0];
  const day = d.getUTCDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getUTCMonth()];
  const hh = pad(d.getUTCHours());
  const mm = pad(d.getUTCMinutes());
  return `${weekday} ${day} ${month} • ${hh}:${mm}`;
}

export default function WeatherCard({ data, units = "metric" }) {
  if (!data) return null;
  const w = data.weather?.[0];
  const icon = w ? `https://openweathermap.org/img/wn/${w.icon}@4x.png` : "";
  const temp = Math.round(data.main.temp);
  const feels = Math.round(data.main.feels_like);
  const unitSymbol = units === "metric" ? "°C" : units === "imperial" ? "°F" : "K";
  const tz = data.timezone || 0;

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="card weather-card">
      <div className="weather-top">
        <div>
          <h2>{data.name}, {data.sys?.country}</h2>
          <p className="muted">{w?.main} — {w?.description}</p>
          <p className="muted small">{formatLocalDateTime(data.dt, tz)}</p>
        </div>
        <div className="weather-right">
          {icon && <img alt={w?.description} src={icon} className="big-icon" />}
          <div className="temp">
            <span className="temp-val">{temp}</span>
            <span className="temp-unit">{unitSymbol}</span>
          </div>
        </div>
      </div>

      <div className="weather-details">
        <div>Feels like: <strong>{feels}{unitSymbol}</strong></div>
        <div>Humidity: <strong>{data.main.humidity}%</strong></div>
        <div>Wind: <strong>{data.wind?.speed} m/s</strong></div>
        <div>Sunrise: <strong>{formatTimeHm(data.sys?.sunrise, tz)}</strong></div>
        <div>Sunset: <strong>{formatTimeHm(data.sys?.sunset, tz)}</strong></div>
      </div>
    </motion.div>
  );
}

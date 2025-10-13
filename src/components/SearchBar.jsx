import React, { useState, useContext } from "react";
import { WeatherContext } from "../context/WeatherContext";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

export default function SearchBar() {
  const [q, setQ] = useState("");
  const { fetchWeatherByCity, fetchByGeolocation, toggleUnits, units } = useContext(WeatherContext);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!q.trim()) return;
    fetchWeatherByCity(q.trim());
    setQ("");
  };

  return (
    <form className="search" onSubmit={onSubmit}>
      <div className="search-left">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search city, e.g., Chennai"
          aria-label="search"
        />
        <button className="icon-btn" title="Search" type="submit"><FaSearch /></button>
      </div>

      <div className="search-right">
        <button
          type="button"
          className="btn small"
          onClick={() => fetchByGeolocation()}
          title="Use my location"
        >
          <FaMapMarkerAlt /> My location
        </button>

        <button
          type="button"
          className="btn small ghost"
          onClick={toggleUnits}
          title="Toggle °C / °F"
        >
          {units === "metric" ? "°C" : "°F"}
        </button>
      </div>
    </form>
  );
}

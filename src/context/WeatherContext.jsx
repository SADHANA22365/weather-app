import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const WeatherContext = createContext();

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE = "https://api.openweathermap.org/data/2.5";

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(null); // current weather
  const [forecast, setForecast] = useState(null); // 5-day forecast processed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState("metric"); // metric or imperial
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("wf_history") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("wf_history", JSON.stringify(history));
  }, [history]);

  const addToHistory = (q) => {
    if (!q) return;
    setHistory((prev) => {
      const filtered = prev.filter((x) => x.toLowerCase() !== q.toLowerCase());
      const next = [q, ...filtered].slice(0, 6);
      return next;
    });
  };

  const handleError = (err) => {
    if (err?.response?.data?.message) setError(err.response.data.message);
    else setError(err.message || "Something went wrong");
  };

  const fetchWeatherByCity = async (city) => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast(null);
    try {
      const curRes = await axios.get(`${BASE}/weather`, {
        params: { q: city, appid: API_KEY, units },
      });
      setWeather(curRes.data);
      addToHistory(curRes.data.name);
      await fetchForecastByCoords(curRes.data.coord.lat, curRes.data.coord.lon);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

const fetchForecastByCoords = async (lat, lon) => {
  try {
    const res = await axios.get(`${BASE}/forecast`, {
      params: { lat, lon, appid: API_KEY, units },
    });

    const tz = res.data.city.timezone || 0;
    const list = res.data.list;
    const byLocalDate = {};

    list.forEach((entry) => {
      const localMs = (entry.dt + tz) * 1000;
      const local = new Date(localMs);
      const y = local.getUTCFullYear();
      const m = String(local.getUTCMonth() + 1).padStart(2, "0");
      const d = String(local.getUTCDate()).padStart(2, "0");
      const dayKey = `${y}-${m}-${d}`;
      if (!byLocalDate[dayKey]) byLocalDate[dayKey] = [];
      byLocalDate[dayKey].push(entry);
    });

    const selected = Object.keys(byLocalDate)
      .sort()
      .map((dayKey) => {
        const entries = byLocalDate[dayKey];
        let best = entries[0];
        let bestDiff = Infinity;
        entries.forEach((e) => {
          const localMs = (e.dt + tz) * 1000;
          const hour = new Date(localMs).getUTCHours();
          const diff = Math.abs(hour - 12);
          if (diff < bestDiff) {
            bestDiff = diff;
            best = e;
          }
        });
        return best;
      });

    const processed = selected.slice(0, 5);
    setForecast({ city: res.data.city, list: processed });
  } catch (err) {
    console.warn("Forecast error", err);
  }
};

  const fetchByGeolocation = () => {
    if (!navigator.geolocation) return;
    setLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lon } = pos.coords;
          const curRes = await axios.get(`${BASE}/weather`, {
            params: { lat, lon, appid: API_KEY, units },
          });
          setWeather(curRes.data);
          addToHistory(curRes.data.name);
          await fetchForecastByCoords(lat, lon);
        } catch (err) {
          handleError(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setLoading(false);
        // silently fail — user can search manually
        if (err.code === 1) setError("Geolocation permission denied");
        else setError("Unable to access location");
      },
      { timeout: 8000 }
    );
  };

  const toggleUnits = () => {
    setUnits((u) => (u === "metric" ? "imperial" : "metric"));
  };

  // When units change, refetch current city data if exists
  useEffect(() => {
    if (!weather?.name) return;
    fetchWeatherByCity(weather.name);
    // eslint-disable-next-line
  }, [units]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <WeatherContext.Provider
      value={{
        weather,
        forecast,
        loading,
        error,
        fetchWeatherByCity,
        fetchByGeolocation,
        addToHistory,
        history,
        toggleUnits,
        units,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

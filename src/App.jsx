import React, { useContext, useEffect } from "react";
import { WeatherContext } from "./context/WeatherContext";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import Forecast from "./components/Forecast";
import History from "./components/History";
import ThemeToggle from "./components/ThemeToggle";
import Spinner from "./components/Spinner";

export default function App() {
  const { loading, weather, forecast, error, fetchByGeolocation, theme, units } = useContext(WeatherContext);

  // ask for permission to auto-locate on first load
  useEffect(() => {
    // don't force — but attempt once
    fetchByGeolocation();
    // eslint-disable-next-line
  }, []);

  // dynamic background class based on weather
  const bgClass = weather ? `bg-${(weather.weather?.[0]?.main || "Clear").toLowerCase()}` : "bg-clear";

  return (
    <div className={`app ${bgClass}`}>
     <header className="topbar">
       <h1 className="title">🌦️ WeatherFlow</h1>
       <div className="top-actions">
         <ThemeToggle />
       </div>
     </header>

      <main className="main container">
        <section className="left-col">
          <SearchBar />
          <History />
          {loading && <Spinner />}
          {error && <p className="error">{error}</p>}
          {weather && <WeatherCard data={weather} units={units} />}
        </section>

        <aside className="right-col">
          {forecast && <Forecast data={forecast} />}
        </aside>
      </main>
    </div>
  );
}

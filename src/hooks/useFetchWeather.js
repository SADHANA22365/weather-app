// src/hooks/useFetchWeather.js
import { useContext } from 'react'
import { WeatherContext } from '../context/WeatherContext'

/*
  Convenience hook for components to access weather context.
  Keeps components concise:
    const { weather, loading, error, fetchWeather, units, toggleUnits } = useFetchWeather()
*/
export default function useFetchWeather() {
  const ctx = useContext(WeatherContext)
  if (!ctx) throw new Error('useFetchWeather must be used inside a WeatherProvider')
  return ctx
}

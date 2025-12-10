import { useState, useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setUnit } from './features/unitsSlice'
import { toggleFavorite } from './features/favoritesSlice'
import './App.css'

function WeatherIcon({ condition, size = 48 }) {
  const c = (condition || '').toLowerCase()
  
  const isThunder = c.includes('burz') || c.includes('thunder') || c.includes('storm')
  const isSnow = c.includes('śnieg') || c.includes('snow') || c.includes('ice')
  const isRain = c.includes('deszcz') || c.includes('rain') || c.includes('drizzle') || c.includes('shower')
  const isFog = c.includes('mgła') || c.includes('fog') || c.includes('mist') || c.includes('haze')
  const isCloud = c.includes('pochm') || c.includes('cloud') || c.includes('overcast')
  const isSunny = c.includes('słone') || c.includes('clear') || c.includes('sunny')
  const isPartly = c.includes('częściowo') || c.includes('part') || c.includes('few') || c.includes('scattered')

  if (isThunder) {
    return (
      <svg className="wx-icon wx-thunder" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gCloud3" x1="0" x2="1">
            <stop offset="0%" stopColor="#4a5568"/>
            <stop offset="100%" stopColor="#2d3748"/>
          </linearGradient>
        </defs>
        <g transform="translate(4 8)">
          <path d="M18 34h24a8 8 0 0 0 0-16 12 12 0 0 0-23-3 8 8 0 0 0-1 19z" fill="url(#gCloud3)"/>
          <path d="M30 30l-8 12h6l-8 12" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" fill="none"/>
        </g>
      </svg>
    )
  }

  if (isSnow) {
    return (
      <svg className="wx-icon wx-snow" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gCloud4" x1="0" x2="1">
            <stop offset="0%" stopColor="#d1d9e6"/>
            <stop offset="100%" stopColor="#a8b6d1"/>
          </linearGradient>
        </defs>
        <g transform="translate(4 8)">
          <path d="M18 34h24a8 8 0 0 0 0-16 12 12 0 0 0-23-3 8 8 0 0 0-1 19z" fill="url(#gCloud4)"/>
          <g>
            {[...Array(6)].map((_, i) => (
              <circle
                key={i}
                cx={20 + i * 8}
                cy="44"
                r="2.5"
                fill="#ffffff"
                opacity="0.9"
              />
            ))}
          </g>
        </g>
      </svg>
    )
  }

  if (isRain) {
    return (
      <svg className="wx-icon wx-rain" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gCloud2" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c8ca5"/>
            <stop offset="100%" stopColor="#5a6b8a"/>
          </linearGradient>
        </defs>
        <g transform="translate(4 8)">
          <path d="M18 34h24a8 8 0 0 0 0-16 12 12 0 0 0-23-3 8 8 0 0 0-1 19z" fill="url(#gCloud2)"/>
          <g className="drops">
            {[...Array(4)].map((_, i) => (
              <line
                key={i}
                x1={16 + i * 10}
                y1="40"
                x2={13 + i * 10}
                y2="48"
                stroke="#3b82f6"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>
      </svg>
    )
  }

  if (isFog) {
    return (
      <svg className="wx-icon wx-fog" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gFog" x1="0" x2="1">
            <stop offset="0%" stopColor="#cbd5e1"/>
            <stop offset="100%" stopColor="#94a3b8"/>
          </linearGradient>
        </defs>
        <g transform="translate(4 8)">
          <path d="M16 36h28a10 10 0 0 0 0-20 14 14 0 0 0-27-3 10 10 0 0 0-1 23z" fill="url(#gFog)"/>
          <line x1="10" y1="42" x2="54" y2="42" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"/>
          <line x1="15" y1="46" x2="49" y2="46" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"/>
          <line x1="20" y1="50" x2="44" y2="50" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round"/>
        </g>
      </svg>
    )
  }

  if (isSunny && !isPartly) {
    return (
      <svg className="wx-icon wx-sun" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <radialGradient id="gSun" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd86b"/>
            <stop offset="100%" stopColor="#ff9f3e"/>
          </radialGradient>
        </defs>
        <circle cx="32" cy="32" r="18" fill="url(#gSun)" stroke="#ffb25a" strokeWidth="2"/>
        <g className="rays" stroke="#ffb25a" strokeWidth="2" strokeLinecap="round">
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1="32"
              y1="32"
              x2={32 + 28 * Math.cos((i * Math.PI) / 4)}
              y2={32 + 28 * Math.sin((i * Math.PI) / 4)}
            />
          ))}
        </g>
      </svg>
    )
  }

  if (isPartly) {
    return (
      <svg className="wx-icon wx-partly" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gCloud" x1="0" x2="1">
            <stop offset="0%" stopColor="#a0aec0"/>
            <stop offset="100%" stopColor="#718096"/>
          </linearGradient>
        </defs>
        <g transform="translate(4 6)">
          <circle cx="22" cy="18" r="8" fill="#ffb25a"/>
          <path d="M18 40h22a8 8 0 0 0 0-16 12 12 0 0 0-23-3 8 8 0 0 0 1 19z" fill="url(#gCloud)"/>
        </g>
      </svg>
    )
  }

  if (isCloud) {
    return (
      <svg className="wx-icon wx-cloud" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
        <defs>
          <linearGradient id="gCloudMain" x1="0" x2="1">
            <stop offset="0%" stopColor="#718096"/>
            <stop offset="100%" stopColor="#4a5568"/>
          </linearGradient>
        </defs>
        <g transform="translate(4 10)">
          <path d="M16 36h28a10 10 0 0 0 0-20 14 14 0 0 0-27-3 10 10 0 0 0-1 23z" fill="url(#gCloudMain)"/>
        </g>
      </svg>
    )
  }

  return (
    <svg className="wx-icon wx-cloud" width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id="gCloudDefault" x1="0" x2="1">
          <stop offset="0%" stopColor="#718096"/>
          <stop offset="100%" stopColor="#4a5568"/>
        </linearGradient>
      </defs>
      <g transform="translate(4 10)">
        <path d="M16 36h28a10 10 0 0 0 0-20 14 14 0 0 0-27-3 10 10 0 0 0-1 23z" fill="url(#gCloudDefault)"/>
      </g>
    </svg>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selected, setSelected] = useState(() => {
    const saved = localStorage.getItem('lastSelectedCity')
    return saved || 'Warszawa'
  })
  const [query, setQuery] = useState('')
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [forecast, setForecast] = useState([])
  const [forecastLoading, setForecastLoading] = useState(false)
  const [forecastError, setForecastError] = useState('')
  const [headerScrolled, setHeaderScrolled] = useState(false)
  const [recentCities, setRecentCities] = useState(() => {
    const saved = localStorage.getItem('recentCities')
    return saved ? JSON.parse(saved) : ['Warszawa', 'Kraków', 'Wrocław']
  })
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  
  const cities = ['Wrocław', 'Warszawa', 'Kraków', 'Gdańsk', 'Poznań', 'Łódź', 'Szczecin', 'Bydgoszcz', 'Katowice', 'Gdynia', 'Sopot', 'Zakopane']
  const unit = useSelector(state => state.units.unit)
  const favorites = useSelector(state => state.favorites.items)
  const dispatch = useDispatch()
  const searchRef = useRef(null)

  const API_KEY = import.meta.env?.VITE_OWM_API_KEY || process.env.REACT_APP_OWM_API_KEY

  useEffect(() => {
    localStorage.setItem('lastSelectedCity', selected)
  }, [selected])

  useEffect(() => {
    localStorage.setItem('recentCities', JSON.stringify(recentCities))
  }, [recentCities])

  const showNotification = useCallback((message) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setHeaderScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMenuOpen(false)
        if (searchRef.current) searchRef.current.blur()
      }
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        if (searchRef.current) searchRef.current.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const fetchWeatherData = useCallback(async (controller) => {
    if (!selected || !API_KEY) return
    
    setLoading(true)
    setError('')
    setWeather(null)
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(selected)}&units=metric&lang=pl&appid=${API_KEY}`
      const res = await fetch(url, { signal: controller.signal })
      
      if (!res.ok) {
        throw new Error(res.status === 404 ? 'Nie znaleziono miasta' : `Błąd API (${res.status})`)
      }
      
      const data = await res.json()
      const w = data.weather?.[0]
      
      setWeather({
        name: data.name,
        country: data.sys?.country,
        temp: Math.round(data.main?.temp),
        feels: Math.round(data.main?.feels_like),
        humidity: data.main?.humidity,
        pressure: data.main?.pressure,
        wind: Math.round((data.wind?.speed ?? 0) * 3.6),
        windDeg: data.wind?.deg,
        visibility: data.visibility ? (data.visibility / 1000).toFixed(1) : null,
        sunrise: data.sys?.sunrise,
        sunset: data.sys?.sunset,
        desc: w?.description || '',
        main: w?.main || '',
        icon: w?.icon || ''
      })
      
      setRecentCities(prev => {
        const filtered = prev.filter(city => city.toLowerCase() !== selected.toLowerCase())
        return [selected, ...filtered].slice(0, 5)
      })
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Wystąpił błąd podczas pobierania danych')
        showNotification(`Błąd: ${err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }, [selected, API_KEY, showNotification])

  const fetchForecastData = useCallback(async (controller) => {
    if (!selected || !API_KEY) return
    
    setForecastLoading(true)
    setForecastError('')
    setForecast([])
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(selected)}&units=metric&lang=pl&appid=${API_KEY}`
      const res = await fetch(url, { signal: controller.signal })
      
      if (!res.ok) {
        throw new Error(`Błąd prognozy (${res.status})`)
      }
      
      const data = await res.json()
      const list = Array.isArray(data.list) ? data.list : []
      const today = new Date().toISOString().split('T')[0]
      
      const dailyForecast = {}
      list.forEach(item => {
        const date = new Date(item.dt * 1000).toISOString().split('T')[0]
        if (date === today) return
        
        if (!dailyForecast[date]) {
          dailyForecast[date] = {
            temps: [],
            weather: [],
            humidity: [],
            wind: []
          }
        }
        
        dailyForecast[date].temps.push(item.main?.temp)
        dailyForecast[date].weather.push(item.weather?.[0])
        dailyForecast[date].humidity.push(item.main?.humidity)
        dailyForecast[date].wind.push(item.wind?.speed * 3.6)
      })
      
      const dayNames = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota']
      const shortDayNames = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'Sb']
      const forecastData = Object.entries(dailyForecast)
        .slice(0, 5)
        .map(([date, data]) => {
          const avgTemp = Math.round(data.temps.reduce((a, b) => a + b, 0) / data.temps.length)
          const maxTemp = Math.round(Math.max(...data.temps))
          const minTemp = Math.round(Math.min(...data.temps))
          const avgHumidity = Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length)
          const avgWind = Math.round(data.wind.reduce((a, b) => a + b, 0) / data.wind.length)
          const mainWeather = data.weather[Math.floor(data.weather.length / 2)] || {}
          const dateObj = new Date(date)
          const dayName = shortDayNames[dateObj.getDay()]
          const fullDayName = dayNames[dateObj.getDay()]
          const formattedDate = dateObj.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' })
          
          return {
            date,
            day: dayName,
            fullDay: fullDayName,
            formattedDate,
            temp: avgTemp,
            maxTemp,
            minTemp,
            humidity: avgHumidity,
            wind: avgWind,
            desc: mainWeather.description || '',
            main: mainWeather.main || '',
            icon: mainWeather.icon || ''
          }
        })
      
      setForecast(forecastData)
      
    } catch (err) {
      if (err.name !== 'AbortError') {
        setForecastError(err.message || 'Błąd pobierania prognozy')
      }
    } finally {
      setForecastLoading(false)
    }
  }, [selected, API_KEY])

  useEffect(() => {
    const controller = new AbortController()
    
    if (selected && API_KEY) {
      fetchWeatherData(controller)
      fetchForecastData(controller)
    } else if (!API_KEY) {
      setError('Brak klucza API. Skonfiguruj VITE_OWM_API_KEY w pliku .env')
    }
    
    return () => {
      controller.abort()
    }
  }, [selected, API_KEY, fetchWeatherData, fetchForecastData])

  const convertTemp = (celsius, unit) => {
    if (celsius == null || isNaN(celsius)) return '--'
    switch(unit) {
      case 'F': return `${Math.round(celsius * 9/5 + 32)}°F`
      case 'K': return `${Math.round(celsius + 273.15)}K`
      default: return `${Math.round(celsius)}°C`
    }
  }

  const getWindDirection = (deg) => {
    if (deg == null) return ''
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
    const index = Math.round(deg / 22.5) % 16
    return directions[index]
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return ''
    return new Date(timestamp * 1000).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })
  }

  const UnitSwitcher = () => (
    <div className="unit-switcher" role="group" aria-label="Jednostki temperatury">
      {['C', 'F', 'K'].map(u => (
        <button
          key={u}
          type="button"
          className={`unit-btn ${unit === u ? 'active' : ''}`}
          onClick={() => {
            dispatch(setUnit(u))
            showNotification(`Zmieniono jednostki na °${u}`)
          }}
          title={`Stopnie ${u === 'C' ? 'Celsjusza' : u === 'F' ? 'Fahrenheita' : 'Kelvina'}`}
        >
          {u === 'K' ? 'K' : `°${u}`}
        </button>
      ))}
    </div>
  )

  const CityItem = ({ name, recent = false }) => {
    const isFavorite = favorites.includes(name)
    const isSelected = selected === name
    
    return (
      <li className={`city-item ${isFavorite ? 'fav' : ''} ${isSelected ? 'active' : ''}`}>
        <button
          type="button"
          className="city-link"
          onClick={() => {
            setSelected(name)
            setMenuOpen(false)
            showNotification(`Wyświetlam pogodę dla: ${name}`)
          }}
          aria-label={`Wybierz miasto ${name}`}
        >
          <span className="city-name">{name}</span>
          {recent && <span className="recent-badge">Ostatnie</span>}
        </button>
        <button
          type="button"
          className={`star-btn ${isFavorite ? 'on' : ''}`}
          title={isFavorite ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
          aria-label={isFavorite ? `Usuń ${name} z ulubionych` : `Dodaj ${name} do ulubionych`}
          aria-pressed={isFavorite}
          onClick={(e) => {
            e.stopPropagation()
            dispatch(toggleFavorite(name))
            showNotification(isFavorite ? `Usunięto ${name} z ulubionych` : `Dodano ${name} do ulubionych`)
          }}
        >
          <span className="star-icon">★</span>
        </button>
      </li>
    )
  }

  const handleSearch = () => {
    if (query.trim()) {
      setSelected(query.trim())
      setQuery('')
      setMenuOpen(false)
    }
  }

  return (
    <>
      <header className={`header ${headerScrolled ? 'scrolled' : ''}`}>
        <div className="header-content">
          <div className="header-left">
            <h1 className="app-title">
              {selected ? (
                <>
                  <span className="city-name">{weather?.name || selected}</span>
                  {weather?.country && <span className="country-flag"> {weather.country === 'PL' ? '🇵🇱' : ''}</span>}
                </>
              ) : '🌤️ PogodaPL'}
            </h1>
          </div>

          <div className="header-center">
            <div className="search-bar">
              <div className="search-input-wrapper">
                <input
                  ref={searchRef}
                  type="search"
                  placeholder="Szukaj miasta (Ctrl+K)..."
                  aria-label="Wyszukaj miasto"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch()
                    }
                  }}
                  className="search-input"
                />
                <button
                  type="button"
                  className="search-btn"
                  onClick={handleSearch}
                  aria-label="Wyszukaj"
                  disabled={!query.trim()}
                >
                  🔍
                </button>
              </div>
            </div>
          </div>

          <div className="header-right">
            <UnitSwitcher />
            
            <button
              type="button"
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              aria-label={menuOpen ? 'Zamknij menu' : 'Otwórz menu'}
              aria-controls="primary-navigation"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      <div
        className={`backdrop ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <nav
        id="primary-navigation"
        className={`nav-menu ${menuOpen ? 'open' : ''}`}
        aria-hidden={!menuOpen}
      >
        <div className="nav-header">
          <h3>🌍 Wybierz miasto</h3>
          <button
            type="button"
            className="close-menu-btn"
            onClick={() => setMenuOpen(false)}
            aria-label="Zamknij menu"
          >
            ×
          </button>
        </div>
        
        <div className="nav-sections">
          {favorites.length > 0 && (
            <div className="nav-section">
              <h4>⭐ Ulubione</h4>
              <ul className="city-list">
                {favorites.map((city) => (
                  <CityItem key={`fav-${city}`} name={city} />
                ))}
              </ul>
            </div>
          )}

          <div className="nav-section">
            <h4>🕒 Ostatnio przeglądane</h4>
            <ul className="city-list">
              {recentCities.map((city) => (
                <CityItem key={`recent-${city}`} name={city} recent />
              ))}
            </ul>
          </div>

          <div className="nav-section">
            <h4>🏙️ Główne miasta</h4>
            <ul className="city-list">
              {cities.map((city) => (
                <CityItem key={city} name={city} />
              ))}
            </ul>
          </div>
        </div>
      </nav>

      <main className="main-content">
        {!selected ? (
          <section className="welcome-section fade-in">
            <div className="welcome-card">
              <h2>🌤️ Witaj w PogodaPL</h2>
              <p className="welcome-text">
                Wybierz miasto z menu, wyszukaj lub wybierz jedno z ostatnio przeglądanych<br/>
                aby zobaczyć aktualną pogodę i 5-dniową prognozę.
              </p>
              <div className="welcome-features">
                <div className="feature">
                  <span className="feature-icon">⭐</span>
                  <p>Dodawaj miasta do ulubionych</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">🔄</span>
                  <p>Przełączaj jednostki temperatury</p>
                </div>
                <div className="feature">
                  <span className="feature-icon">📱</span>
                  <p>Responsywny design</p>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="weather-section fade-in">
            <div className="weather-header">
              <div>
                <h2 className="current-city">
                  {weather?.name || selected}
                  {weather?.country && (
                    <span className="country-badge">
                      {weather.country}
                      {weather.country === 'PL' && ' 🇵🇱'}
                    </span>
                  )}
                </h2>
                <p className="last-updated">
                  {weather && `Aktualizacja: ${new Date().toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}`}
                </p>
              </div>
              <button
                type="button"
                className={`favorite-main-btn ${favorites.includes(selected) ? 'active' : ''}`}
                onClick={() => {
                  dispatch(toggleFavorite(selected))
                  showNotification(favorites.includes(selected) ? `Usunięto z ulubionych` : `Dodano do ulubionych`)
                }}
                title={favorites.includes(selected) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                aria-label={favorites.includes(selected) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
              >
                {favorites.includes(selected) ? '★' : '☆'}
              </button>
            </div>

            {loading && (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Pobieranie danych pogodowych...</p>
              </div>
            )}
            
            {error && (
              <div className="error-card">
                <div className="error-icon">⚠️</div>
                <h3>Błąd</h3>
                <p>{error}</p>
                <button
                  type="button"
                  className="retry-btn"
                  onClick={() => {
                    const controller = new AbortController()
                    fetchWeatherData(controller)
                    fetchForecastData(controller)
                  }}
                >
                  Spróbuj ponownie
                </button>
              </div>
            )}

            {!loading && !error && weather && (
              <>
                <div className="current-weather-card">
                  <div className="weather-hero">
                    <div className="weather-icon-large">
                      <WeatherIcon condition={weather.main} size={140} />
                    </div>
                    <div className="weather-main-info">
                      <div className="current-temp">{convertTemp(weather.temp, unit)}</div>
                      <div className="weather-desc">{weather.desc}</div>
                      <div className="feels-like">
                        Odczuwalna: {convertTemp(weather.feels, unit)}
                      </div>
                    </div>
                  </div>

                  <div className="weather-details-grid">
                    <div className="detail-card">
                      <div className="detail-icon">💧</div>
                      <div className="detail-content">
                        <div className="detail-label">Wilgotność</div>
                        <div className="detail-value">{weather.humidity}%</div>
                      </div>
                    </div>
                    
                    <div className="detail-card">
                      <div className="detail-icon">🎯</div>
                      <div className="detail-content">
                        <div className="detail-label">Ciśnienie</div>
                        <div className="detail-value">{weather.pressure} hPa</div>
                      </div>
                    </div>
                    
                    <div className="detail-card">
                      <div className="detail-icon">💨</div>
                      <div className="detail-content">
                        <div className="detail-label">Wiatr</div>
                        <div className="detail-value">
                          {weather.wind} km/h {weather.windDeg && getWindDirection(weather.windDeg)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="detail-card">
                      <div className="detail-icon">👁️</div>
                      <div className="detail-content">
                        <div className="detail-label">Widoczność</div>
                        <div className="detail-value">{weather.visibility || '--'} km</div>
                      </div>
                    </div>

                    {weather.sunrise && (
                      <div className="detail-card">
                        <div className="detail-icon">🌅</div>
                        <div className="detail-content">
                          <div className="detail-label">Wschód słońca</div>
                          <div className="detail-value">{formatTime(weather.sunrise)}</div>
                        </div>
                      </div>
                    )}

                    {weather.sunset && (
                      <div className="detail-card">
                        <div className="detail-icon">🌇</div>
                        <div className="detail-content">
                          <div className="detail-label">Zachód słońca</div>
                          <div className="detail-value">{formatTime(weather.sunset)}</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="forecast-section">
                  <h3 className="section-title">
                    <span className="title-icon">📅</span>
                    5-dniowa prognoza
                  </h3>
                  
                  {forecastLoading && (
                    <div className="loading-forecast">
                      <div className="small-spinner"></div>
                      <p>Ładuję prognozę...</p>
                    </div>
                  )}
                  
                  {forecastError && (
                    <div className="forecast-error">
                      <p>❌ {forecastError}</p>
                    </div>
                  )}
                  
                  {!forecastLoading && !forecastError && forecast.length > 0 && (
                    <div className="forecast-cards">
                      {forecast.map((day, index) => (
                        <div key={index} className="forecast-card">
                          <div className="forecast-header">
                            <h4 className="forecast-day">{day.fullDay}</h4>
                            <div className="forecast-date">{day.formattedDate}</div>
                          </div>
                          <div className="forecast-icon">
                            <WeatherIcon condition={day.main} size={48} />
                          </div>
                          <div className="forecast-temp">
                            <div className="temp-max">{convertTemp(day.maxTemp, unit)}</div>
                            <div className="temp-min">{convertTemp(day.minTemp, unit)}</div>
                          </div>
                          <div className="forecast-desc">{day.desc}</div>
                          <div className="forecast-details">
                            <div className="forecast-detail">
                              <span>💧</span>
                              <span>{day.humidity}%</span>
                            </div>
                            <div className="forecast-detail">
                              <span>💨</span>
                              <span>{Math.round(day.wind)} km/h</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p className="footer-text">
            © {new Date().getFullYear()} PogodaPL • Dane: <a href="https://openweathermap.org" target="_blank" rel="noopener noreferrer">OpenWeatherMap</a>
          </p>
          <p className="footer-note">
            Aplikacja stworzona w React • Ostatnia aktualizacja danych: {weather ? new Date().toLocaleTimeString('pl-PL') : '--'}
          </p>
        </div>
      </footer>

      {showToast && (
        <div className="toast">
          <div className="toast-content">
            <span className="toast-icon">💡</span>
            <span className="toast-message">{toastMessage}</span>
          </div>
        </div>
      )}
    </>
  )
}

export default App
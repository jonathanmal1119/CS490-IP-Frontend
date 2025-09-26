import { useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { api } from './api'
import FilmDetails from './FilmDetails'
import ActorDetails from './ActorDetails'
import './App.css'

function App() {
  const [topFilms, setTopFilms] = useState([])
  const [topActors, setTopActors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        const filmsResult = await api.getTopRentedFilms(5)
        const actorsResult = await api.getTopActors(5)
        
        setTopFilms(filmsResult)
        setTopActors(actorsResult)
      } catch (e) {
        setError(e?.message || 'Failed to load data')
        console.error('Error loading data:', e)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/film/:id" element={<FilmDetails />} />
      <Route path="/actor/:id" element={<ActorDetails />} />
    </Routes>
  )
}

function HomePage() {
  const [topFilms, setTopFilms] = useState([])
  const [topActors, setTopActors] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const viewDetails = (filmId) => {
    navigate(`/film/${filmId}`)
  }

  const viewActorDetails = (actorId) => {
    navigate(`/actor/${actorId}`)
  }

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        const filmsResult = await api.getTopRentedFilms(5)
        const actorsResult = await api.getTopActors(5)
        
        setTopFilms(filmsResult)
        setTopActors(actorsResult)
      } catch (e) {
        setError(e?.message || 'Failed to load data')
        console.error('Error loading data:', e)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading Sakila Database...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sakila Film Database</h1>
      </header>

      <main className="main-content">
        <div className="columns-container">
          <section className="data-section">
            <h2>Top 5 Rented Films</h2>
            <div className="cards-grid">
              {topFilms.map((film) => (
                <div key={film.id} className="card film-card">
                  <h3>{film.title}</h3>
                  <p className="genre">{film.genre}</p>
                  <p className="year">Released: {film.releaseYear}</p>
                  <p className="rental-count">
                    <strong>{film.rentalCount}</strong> rentals
                  </p>
                  <p className="description">{film.description}</p>
                  <button className="view-details-btn" onClick={() => viewDetails(film.id)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="data-section">
            <h2>Top 5 Actors</h2>
            <div className="cards-grid">
              {topActors.map((actor) => (
                <div key={actor.id} className="card actor-card">
                  <h3>{actor.name}</h3>
                  <p className="film-count">
                    <strong>{actor.filmCount}</strong> films
                  </p>
                  <button className="view-details-btn" onClick={() => viewActorDetails(actor.id)}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <footer className="app-footer">
      </footer>
    </div>
  )
}

export default App
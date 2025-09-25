import { useEffect, useState } from 'react'
import { api } from './api'
import './App.css'

function App() {
  const [topFilms, setTopFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true)
        
        // Load top 5 rented films
        const filmsResult = await api.getTopRentedFilms(5)
        
        setTopFilms(filmsResult)
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
        <p>Top 5 Rented Films from MySQL Sakila Database</p>
      </header>

      <main className="main-content">
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
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2025 Sakila Database - MySQL Sample Database</p>
      </footer>
    </div>
  )
}

export default App
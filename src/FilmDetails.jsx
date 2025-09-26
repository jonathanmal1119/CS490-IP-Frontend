import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { api } from './api'
import './App.css'

function FilmDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [filmDetails, setFilmDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadFilmDetails() {
      try {
        setLoading(true)
        const details = await api.getFilmDetails(id)
        setFilmDetails(details)
      } catch (e) {
        setError(e?.message || 'Failed to load film details')
        console.error('Error loading film details:', e)
      } finally {
        setLoading(false)
      }
    }
    
    loadFilmDetails()
  }, [id])

  const goBack = () => {
    // Check if we came from the films page
    const fromFilms = location.state?.from === 'films' || 
                     document.referrer.includes('/films') ||
                     sessionStorage.getItem('lastPage') === '/films'
    
    if (fromFilms) {
      navigate('/films')
    } else {
      navigate('/')
    }
  }

  // Determine back button text based on where we came from
  const getBackButtonText = () => {
    const fromFilms = location.state?.from === 'films' || 
                     document.referrer.includes('/films') ||
                     sessionStorage.getItem('lastPage') === '/films'
    
    return fromFilms ? '← Back to Films' : '← Back to Homepage'
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading film details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
        <button onClick={goBack} className="back-button">Go Back</button>
      </div>
    )
  }

  if (!filmDetails) {
    return (
      <div className="app">
        <div className="error">Film not found</div>
        <button onClick={goBack} className="back-button">Go Back</button>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sakila Film Database</h1>
        <button onClick={goBack} className="back-button">{getBackButtonText()}</button>
      </header>

      <main className="main-content">
        <div className="film-details-page">
          <div className="film-details-card">
            <h2 className="film-title">{filmDetails.title}</h2>
            
            <div className="film-info-grid">
              <div className="info-section">
                <h3>Film Information</h3>
                <div className="info-item">
                  <strong>Description:</strong>
                  <p>{filmDetails.description}</p>
                </div>
                <div className="info-item">
                  <strong>Release Year:</strong>
                  <span>{filmDetails.releaseYear}</span>
                </div>
                <div className="info-item">
                  <strong>Rating:</strong>
                  <span>{filmDetails.rating}</span>
                </div>
                <div className="info-item">
                  <strong>Length:</strong>
                  <span>{filmDetails.length} minutes</span>
                </div>
                <div className="info-item">
                  <strong>Category:</strong>
                  <span className="category-tag">{filmDetails.category}</span>
                </div>
                <div className="info-item">
                  <strong>Language:</strong>
                  <span>{filmDetails.language}</span>
                </div>
              </div>

              <div className="info-section">
                <h3>Rental Information</h3>
                <div className="info-item">
                  <strong>Rental Rate:</strong>
                  <span>${filmDetails.rentalRate}</span>
                </div>
                <div className="info-item">
                  <strong>Rental Duration:</strong>
                  <span>{filmDetails.rentalDuration} days</span>
                </div>
                <div className="info-item">
                  <strong>Replacement Cost:</strong>
                  <span>${filmDetails.replacementCost}</span>
                </div>
              </div>
            </div>

            <div className="actors-section">
              <h3>Cast</h3>
              <div className="actors-list">
                {filmDetails.actors.map((actor) => (
                  <span key={actor.id} className="actor-tag">{actor.name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="app-footer">
      </footer>
    </div>
  )
}

export default FilmDetails

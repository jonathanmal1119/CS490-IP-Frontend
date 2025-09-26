import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'

function ActorDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [actorDetails, setActorDetails] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadActorDetails() {
      try {
        setLoading(true)
        const details = await api.getActorDetails(id)
        setActorDetails(details)
      } catch (e) {
        setError(e?.message || 'Failed to load actor details')
        console.error('Error loading actor details:', e)
      } finally {
        setLoading(false)
      }
    }
    
    loadActorDetails()
  }, [id])

  const goBack = () => {
    navigate('/')
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading actor details...</div>
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

  if (!actorDetails) {
    return (
      <div className="app">
        <div className="error">Actor not found</div>
        <button onClick={goBack} className="back-button">Go Back</button>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Sakila Film Database</h1>
        <button onClick={goBack} className="back-button">← Back to Actors</button>
      </header>

      <main className="main-content">
        <div className="actor-details-page">
          <div className="actor-details-card">
            <h2 className="actor-title">{actorDetails.name}</h2>
            
            <div className="actor-info-section">
              <h3>Actor Information</h3>
              <div className="info-item">
                <strong>First Name:</strong>
                <span>{actorDetails.first_name}</span>
              </div>
              <div className="info-item">
                <strong>Last Name:</strong>
                <span>{actorDetails.last_name}</span>
              </div>
              <div className="info-item">
                <strong>Total Films:</strong>
                <span>{actorDetails.films.length} films</span>
              </div>
            </div>

            <div className="films-section">
              <h3>Top 5 Recent Films</h3>
              <div className="films-grid">
                {actorDetails.films.map((film) => (
                  <div key={film.id} className="film-card-small">
                    <h4>{film.title}</h4>
                    <p className="film-year">{film.releaseYear}</p>
                    <p className="film-category">{film.category}</p>
                    <p className="film-rating">Rating: {film.rating}</p>
                    <p className="film-length">{film.length} min</p>
                    <p className="film-description">{film.description}</p>
                  </div>
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

export default ActorDetails


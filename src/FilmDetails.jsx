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
  const [customerId, setCustomerId] = useState('')
  const [renting, setRenting] = useState(false)
  const [rentalError, setRentalError] = useState(null)
  const [rentalSuccess, setRentalSuccess] = useState(null)
  const [inventoryAvailable, setInventoryAvailable] = useState(null)

  useEffect(() => {
    async function loadFilmDetails() {
      try {
        setLoading(true)
        const details = await api.getFilmDetails(id)
        setFilmDetails(details)
        
        // Check inventory availability
        const inventory = await api.checkFilmInventory(id)
        setInventoryAvailable(inventory.available)
      } catch (e) {
        setError(e?.message || 'Failed to load film details')
        console.error('Error loading film details:', e)
      } finally {
        setLoading(false)
      }
    }
    
    loadFilmDetails()
  }, [id])

  const handleRentFilm = async (e) => {
    e.preventDefault()
    
    setRentalError(null)
    setRentalSuccess(null)
    
    if (!customerId || !customerId.trim()) {
      setRentalError('Please enter a customer ID')
      return
    }
    
    const customerIdNum = parseInt(customerId)
    if (isNaN(customerIdNum) || customerIdNum <= 0) {
      setRentalError('Please enter a valid customer ID')
      return
    }
    
    try {
      setRenting(true)
      const result = await api.rentFilm(id, customerIdNum)
      setRentalSuccess(`Film rented successfully! Rental ID: ${result.rental_id}`)
      setCustomerId('')
      
      // Refresh inventory status
      const inventory = await api.checkFilmInventory(id)
      setInventoryAvailable(inventory.available)
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setRentalSuccess(null)
      }, 5000)
    } catch (e) {
      setRentalError(e?.message || 'Failed to rent film')
      console.error('Error renting film:', e)
    } finally {
      setRenting(false)
    }
  }

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
    <main className="main-content">
      <div className="film-details-page">
        <div className="film-details-card">
          <div className="details-header">
            <button onClick={goBack} className="back-button">{getBackButtonText()}</button>
            <h2 className="film-title">{filmDetails.title}</h2>
          </div>
          
          <div className="film-info-grid">
            <div className="info-section">
              <h3>Film Information</h3>
              <div className="info-item-desc">
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

          <div className="rental-section">
            <div className="rental-title-section">
              <h3>Rent This Film</h3>
              
              {inventoryAvailable !== null && (
                <div className={`availability-status ${inventoryAvailable ? 'available' : 'unavailable'}`}>
                  {inventoryAvailable ? 'Available to Rent' : 'Unavailable to Rent'}
                </div>
              )}
            
            </div>
            
            {rentalError && <div className="error-message">{rentalError}</div>}
            {rentalSuccess && <div className="success-message">{rentalSuccess}</div>}
            
            <form onSubmit={handleRentFilm} className="rental-form">
              <div className="form-group">
                <label htmlFor="customerId">Customer ID:</label>
                <input
                  type="number"
                  id="customerId"
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  placeholder="Enter customer ID"
                  className="form-input"
                  disabled={!inventoryAvailable || renting}
                  min="1"
                />
              </div>
              <button
                type="submit"
                className="rent-button"
                disabled={!inventoryAvailable || renting}
              >
                {renting ? 'Processing...' : 'Rent Film'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default FilmDetails

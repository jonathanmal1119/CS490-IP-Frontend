import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'

function RentalHistory() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [rentalHistory, setRentalHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadCustomerAndHistory()
  }, [id])

  const loadCustomerAndHistory = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [customerData, historyData] = await Promise.all([
        api.getCustomerById(id),
        api.getCustomerRentalHistory(id)
      ])
      
      setCustomer(customerData)
      setRentalHistory(historyData)
    } catch (e) {
      setError(e?.message || 'Failed to load rental history')
      console.error('Error loading data:', e)
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    navigate('/customers')
  }

  const goToEdit = () => {
    navigate(`/customer/${id}/edit`)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading rental history...</div>
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

  if (!customer) {
    return (
      <div className="app">
        <div className="error">Customer not found</div>
        <button onClick={goBack} className="back-button">Go Back</button>
      </div>
    )
  }

  const activeRentals = rentalHistory.filter(r => r.status === 'Active')
  const pastRentals = rentalHistory.filter(r => r.status === 'Returned')

  return (
    <main className="main-content">
      <div className="rental-history-page">
        <div className="rental-history-header">
          <h2>Rental History</h2>
          <button onClick={goBack} className="back-button">
            ← Back to Customers
          </button>
        </div>

        {/* Customer Details */}
        <div className="customer-summary-card">
          <h3>Customer Information</h3>
          <div className="customer-summary-grid">
            <div className="summary-item">
              <span className="summary-label">Name:</span>
              <span className="summary-value">{customer.first_name} {customer.last_name}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Email:</span>
              <span className="summary-value">{customer.email}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Customer ID:</span>
              <span className="summary-value">{customer.id}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Phone:</span>
              <span className="summary-value">{customer.phone || 'N/A'}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Address:</span>
              <span className="summary-value">
                {customer.address}, {customer.city}, {customer.district}, {customer.country}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Status:</span>
              <span className={`summary-value ${customer.active ? 'active' : 'inactive'}`}>
                {customer.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>

        {/* Active Rentals */}
        {activeRentals.length > 0 && (
          <div className="rentals-section active-rentals">
            <h3>Active Rentals ({activeRentals.length})</h3>
            <div className="rental-history-table-container">
              <table className="rental-history-table">
                <thead>
                  <tr>
                    <th>Film</th>
                    <th>Rental Date</th>
                    <th>Days Out</th>
                    <th>Expected Duration</th>
                    <th>Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeRentals.map((rental) => (
                    <tr key={rental.rental_id}>
                      <td className="film-title">{rental.film_title}</td>
                      <td>{formatDate(rental.rental_date)}</td>
                      <td>{rental.days_rented} days</td>
                      <td>{rental.rental_duration} days</td>
                      <td>${rental.rental_rate}</td>
                      <td>
                        <span className="status-badge active">
                          {rental.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Past Rentals */}
        <div className="rentals-section past-rentals">
          <h3>Past Rentals ({pastRentals.length})</h3>
          {pastRentals.length === 0 ? (
            <div className="no-rentals">No past rentals.</div>
          ) : (
            <div className="rental-history-table-container">
              <table className="rental-history-table">
                <thead>
                  <tr>
                    <th>Film</th>
                    <th>Rental Date</th>
                    <th>Return Date</th>
                    <th>Days Rented</th>
                    <th>Rate</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pastRentals.map((rental) => (
                    <tr key={rental.rental_id}>
                      <td className="film-title">{rental.film_title}</td>
                      <td>{formatDate(rental.rental_date)}</td>
                      <td>{formatDate(rental.return_date)}</td>
                      <td>{rental.days_rented} days</td>
                      <td>${rental.rental_rate}</td>
                      <td>
                        <span className="status-badge returned">
                          {rental.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}

export default RentalHistory


import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'

function CustomerAdd() {
  const navigate = useNavigate()
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    district: '',
    city: '',
    country_id: '',
    active: true
  })

  useEffect(() => {
    loadCountries()
  }, [])

  const loadCountries = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getCountries()
      console.log('Loaded countries:', data) // Debug log
      
      if (data && data.length > 0) {
        setCountries(data)
      } else {
        // Fallback to common countries if database is empty
        const fallbackCountries = [
          { country_id: 1, country: 'United States' },
          { country_id: 2, country: 'Canada' },
          { country_id: 3, country: 'United Kingdom' },
          { country_id: 4, country: 'Germany' },
          { country_id: 5, country: 'France' },
          { country_id: 6, country: 'Australia' },
          { country_id: 7, country: 'Japan' },
          { country_id: 8, country: 'China' },
          { country_id: 9, country: 'India' },
          { country_id: 10, country: 'Brazil' }
        ]
        console.log('Using fallback countries')
        setCountries(fallbackCountries)
      }
    } catch (e) {
      // Don't show error to user for country loading failure
      // Just log it and continue with fallback countries
      console.error('Error loading countries:', e)
      
      // Use fallback countries on error
      const fallbackCountries = [
        { country_id: 1, country: 'United States' },
        { country_id: 2, country: 'Canada' },
        { country_id: 3, country: 'United Kingdom' },
        { country_id: 4, country: 'Germany' },
        { country_id: 5, country: 'France' },
        { country_id: 6, country: 'Australia' },
        { country_id: 7, country: 'Japan' },
        { country_id: 8, country: 'China' },
        { country_id: 9, country: 'India' },
        { country_id: 10, country: 'Brazil' }
      ]
      setCountries(fallbackCountries)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    // Clear error message when user starts typing
    if (error) {
      setError(null)
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Clear any previous error messages
    setError(null)
    
    // Validate required fields
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim() ||
        !formData.address.trim() || !formData.district.trim() || !formData.city.trim() || !formData.country_id) {
      setError('All fields except phone are required')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return
    }

    try {
      setSaving(true)
      setSuccessMessage('')
      
      await api.createCustomer({
        ...formData,
        country_id: parseInt(formData.country_id)
      })
      
      setSuccessMessage('Customer created successfully!')
      
      // Redirect to customers page after a short delay
      setTimeout(() => {
        navigate('/customers')
      }, 2000)
      
    } catch (e) {
      setError(e?.message || 'Failed to create customer')
      console.error('Error creating customer:', e)
    } finally {
      setSaving(false)
    }
  }

  const goBack = () => {
    navigate('/customers')
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  return (
    <main className="main-content">
      <div className="customer-add-page">
        <div className="customer-add-header">
          <h2>Add New Customer</h2>
          <button onClick={goBack} className="back-button">
            ← Back to Customers
          </button>
        </div>

        <div className="customer-add-container">
          <div className="customer-add-form-section">
            <h3>Customer Details</h3>
            
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <form onSubmit={handleSubmit} className="customer-add-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">First Name *</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter first name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name *</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter email address"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Enter phone number (optional)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="address">Street Address *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                  placeholder="Enter street address"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="district">District/State *</label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter district or state"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                    placeholder="Enter city name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="country_id">Country *</label>
                <select
                  id="country_id"
                  name="country_id"
                  value={formData.country_id}
                  onChange={handleInputChange}
                  required
                  className="form-select"
                >
                  <option value="">Select a country</option>
                  {countries.map((country) => (
                    <option key={country.country_id} value={country.country_id}>
                      {country.country}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group checkbox-group">
                <label htmlFor="active" className="checkbox-label">
                  <input
                    type="checkbox"
                    id="active"
                    name="active"
                    checked={formData.active}
                    onChange={handleInputChange}
                    className="form-checkbox"
                  />
                  Active Customer
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  disabled={saving}
                  className="save-button"
                >
                  {saving ? 'Creating Customer...' : 'Create Customer'}
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  className="cancel-button"
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default CustomerAdd

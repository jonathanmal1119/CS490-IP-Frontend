import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'

function CustomerEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [countries, setCountries] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [rentalCheck, setRentalCheck] = useState(null)
  
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
    loadCustomer()
    loadCountries()
  }, [id])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Loading customer data for ID:', id)
      const data = await api.getCustomerById(id)
      console.log('Received customer data:', data)
      setCustomer(data)
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || '',
        address: data.address || '',
        district: data.district || '',
        city: data.city || '',
        country_id: data.country_id || '',
        active: Boolean(data.active)
      })
    } catch (e) {
      setError(e?.message || 'Failed to load customer')
      console.error('Error loading customer:', e)
    } finally {
      setLoading(false)
    }
  }

  const loadCountries = async () => {
    try {
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
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
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
      
      const updateData = {
        ...formData,
        country_id: parseInt(formData.country_id)
      }
      
      console.log('Sending update data:', updateData)
      
      await api.updateCustomer(id, updateData)
      setSuccessMessage('Customer updated successfully!')
      
      console.log('Update successful, reloading customer data...')
      
      // Reload customer data to show updated info
      setTimeout(() => {
        loadCustomer()
        setSuccessMessage('')
      }, 2000)
      
    } catch (e) {
      setError(e?.message || 'Failed to update customer')
      console.error('Error updating customer:', e)
    } finally {
      setSaving(false)
    }
  }

  const goBack = () => {
    navigate('/customers')
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const checkRentals = async () => {
    try {
      const rentalData = await api.checkCustomerRentals(id)
      setRentalCheck(rentalData)
      return rentalData
    } catch (e) {
      console.error('Error checking rentals:', e)
      setError('Failed to check customer rentals')
      return null
    }
  }

  const handleDeleteClick = async () => {
    try {
      setError(null)
      const rentalData = await checkRentals()
      
      if (rentalData && rentalData.hasActiveRentals) {
        setError(`Cannot delete customer. Customer has ${rentalData.activeRentalCount} active rental(s).`)
        return
      }
      
      setShowDeleteConfirm(true)
    } catch (e) {
      setError(e?.message || 'Failed to check customer rentals')
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true)
      setError(null)
      
      await api.deleteCustomer(id)
      setSuccessMessage('Customer deleted successfully!')
      
      // Navigate back to customers list after a short delay
      setTimeout(() => {
        navigate('/customers')
      }, 1500)
      
    } catch (e) {
      setError(e?.message || 'Failed to delete customer')
      console.error('Error deleting customer:', e)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
    setRentalCheck(null)
  }

  if (loading) {
    return (
      <div className="app">
        <div className="loading">Loading customer...</div>
      </div>
    )
  }

  if (error && !customer) {
    return (
      <div className="app">
        <div className="error">Error: {error}</div>
        <button onClick={goBack} className="back-button">Go Back</button>
      </div>
    )
  }

  return (
    <main className="main-content">
      <div className="customer-edit-page">
        <div className="customer-edit-header">
          <h2>Edit Customer</h2>
          <button onClick={goBack} className="back-button">
            ← Back to Customers
          </button>
        </div>

        {customer && (
          <div className="customer-edit-container">
            <div className="customer-info-section">
              <h3>Customer Information</h3>
              <div className="customer-info-grid">
                <div className="info-item">
                  <span className="info-label">Customer ID:</span>
                  <span className="info-value">{customer.id}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{customer.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">District/State:</span>
                  <span className="info-value">{customer.district}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">City:</span>
                  <span className="info-value">{customer.city}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Country:</span>
                  <span className="info-value">{customer.country}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Member Since:</span>
                  <span className="info-value">{formatDate(customer.create_date)}</span>
                </div>
              </div>
            </div>

            <div className="customer-edit-form-section">
              <h3>Editable Details</h3>
              
              {error && <div className="error-message">{error}</div>}
              {successMessage && <div className="success-message">{successMessage}</div>}
              
              <form onSubmit={handleSubmit} className="customer-edit-form">
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
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    onClick={goBack}
                    className="cancel-button"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={deleting}
                    className="delete-button"
                  >
                    {deleting ? 'Deleting...' : 'Delete Customer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Confirm Customer Deletion</h3>
            <p>
              Are you sure you want to delete customer <strong>{customer?.first_name} {customer?.last_name}</strong>?
            </p>
            <p className="warning-text">
              This action cannot be undone. All customer data will be permanently removed.
            </p>
            <div className="modal-actions">
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="confirm-delete-button"
              >
                {deleting ? 'Deleting...' : 'Yes, Delete Customer'}
              </button>
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="cancel-delete-button"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

export default CustomerEdit


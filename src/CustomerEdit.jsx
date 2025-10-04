import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from './api'
import './App.css'

function CustomerEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    active: true
  })

  useEffect(() => {
    loadCustomer()
  }, [id])

  const loadCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await api.getCustomerById(id)
      setCustomer(data)
      setFormData({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        active: Boolean(data.active)
      })
    } catch (e) {
      setError(e?.message || 'Failed to load customer')
      console.error('Error loading customer:', e)
    } finally {
      setLoading(false)
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
    
    if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
      setError('First name, last name, and email are required')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage('')
      
      await api.updateCustomer(id, formData)
      setSuccessMessage('Customer updated successfully!')
      
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
                  <span className="info-label">District:</span>
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
                <div className="form-group">
                  <label htmlFor="first_name">First Name:</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="last_name">Last Name:</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="form-input"
                  />
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
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default CustomerEdit


// Date formatting utilities (UK format)
export const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
  
  export const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    
    const date = new Date(dateString)
    return date.toLocaleString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Currency formatting (UK pounds)
  export const formatPrice = (price) => {
    if (!price || price === 0) return '£0.00'
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP'
    }).format(price)
  }
  
  // Auction specific helpers
  export const getTimeRemaining = (closingDate) => {
    if (!closingDate) return 'No closing date'
    
    const now = new Date()
    const close = new Date(closingDate)
    const diff = close - now
    
    if (diff <= 0) return 'Auction closed'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }
  
  export const isAuctionActive = (closingDate) => {
    if (!closingDate) return false
    return new Date(closingDate) > new Date()
  }
  
  // String utilities
  export const truncateText = (text, maxLength = 100) => {
    if (!text) return 'No description available'
    return text.length > maxLength 
      ? text.substring(0, maxLength) + '...' 
      : text
  }
  
  export const capitaliseFirst = (str) => {
    if (!str) return ''
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
  
  // Form validation (UK specific)
  export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }
  
  export const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/
    return passwordRegex.test(password)
  }
  
  export const validateUKPhone = (phone) => {
    const ukPhoneRegex = /^(\+44|0)[1-9]\d{8,9}$/
    return ukPhoneRegex.test(phone.replace(/\s/g, ''))
  }
  
  export const validatePostcode = (postcode) => {
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i
    return postcodeRegex.test(postcode.replace(/\s/g, ''))
  }
  
  export const validateRequired = (value) => {
    return value !== null && value !== undefined && value.toString().trim() !== ''
  }
  
  // Image utilities
  export const getImageUrl = (imagePath, fallback = '/placeholder-watch.jpg') => {
    if (!imagePath) return fallback
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath
    
    // If it's a relative path, prepend base URL
    return `${process.env.VUE_APP_BASE_URL || ''}${imagePath}`
  }
  
  // Debounce utility
  export const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
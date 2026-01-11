<template>
    <div class="loading-spinner" :class="sizeClass">
      <div class="spinner"></div>
      <p v-if="text" class="spinner-text">{{ text }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'LoadingSpinner',
    props: {
      size: {
        type: String,
        default: 'medium'
      },
      text: {
        type: String,
        default: ''
      },
      color: {
        type: String,
        default: '#f4d03f'
      }
    },
    computed: {
      sizeClass() {
        return `spinner-${this.size}`
      }
    }
  }
  </script>
  
  <style scoped>
  .loading-spinner {
    text-align: center;
    padding: 2rem;
  }
  
  .spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid var(--color, #f4d03f);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto;
  }
  
  .spinner-small .spinner {
    width: 20px;
    height: 20px;
    border-width: 2px;
  }
  
  .spinner-medium .spinner {
    width: 40px;
    height: 40px;
    border-width: 4px;
  }
  
  .spinner-large .spinner {
    width: 60px;
    height: 60px;
    border-width: 6px;
  }
  
  .spinner-text {
    margin-top: 1rem;
    color: #6c757d;
    font-size: 0.9rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
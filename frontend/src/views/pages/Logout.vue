<template>
  <div class="items-page">
    <div class="items-container">
      <div class="logout-content">
        <h1 class="logout-page-title">Logging Out...</h1>
        
        <div class="loading">
          <div class="spinner"></div>
          <p>Please wait while we securely log you out</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'

export default {
  name: 'Logout',
  created() {
    this.performLogout()
  },
  methods: {
    async performLogout() {
      try {
        // Add a minimum delay to show the logout message
        await new Promise(resolve => setTimeout(resolve, 1000))
        await coreService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        // Clear local storage
        localStorage.removeItem('session_token')
        localStorage.removeItem('user_id')
        
        // Redirect to login page with a delay to show the message
        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
/* Override the global styles with a more specific class */
.logout-page-title {
  font-size: 2.5rem;
  color: white !important;
  margin-bottom: 3rem;
  text-align: center;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.logout-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.loading p {
  color: #2c3e50 !important;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .logout-page-title {
    font-size: 2rem;
  }

  .loading {
    padding: 3rem 1.5rem;
    margin: 0 1rem;
  }
}

@media (max-width: 480px) {
  .logout-page-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .loading {
    padding: 2rem 1rem;
  }
}
</style>
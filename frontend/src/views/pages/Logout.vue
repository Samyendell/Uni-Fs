<template>
  <div class="min-vh-100 gradient-backgroud d-flex align-items-center justify-content-center p-3">
    <div class="text-center logout-container">
      <h1 class="display-4 fw-bold text-white mb-5 logout-title">Logging Out...</h1>

      <div class="bg-white rounded p-5 shadow-lg">
        <LoadingSpinner text="Please wait while we securely log you out" />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import LoadingSpinner from '../components/atoms/LoadingSpinner.vue'

export default {
  name: 'Logout',
  components: {
    LoadingSpinner
  },
  created() {
    this.performLogout()
  },
  methods: {
    async performLogout() {
      try {
        await coreService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        localStorage.removeItem('session_token')
        localStorage.removeItem('user_id')

        setTimeout(() => {
          this.$router.push('/login')
        }, 2000)
      }
    }
  }
}
</script>

<style scoped>
.logout-container {
  max-width: 500px;
  width: 100%;
}

.logout-title {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
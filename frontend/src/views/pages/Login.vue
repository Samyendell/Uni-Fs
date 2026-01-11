<template>
  <div class="account-page">
    <div class="account-card">
      <div class="account-header">
        <h1 class="brand-logo">TickTokTwo</h1>
        <p>Welcome back</p>
      </div>

      <div class="account-content">
        <LoginForm :loading="loading" :error="error" :submitted="submitted" @submit="handleLogin" />

        <div class="account-link">
          <p>Don't have an account?</p>
          <router-link to="/register">
            Join <span class="brand-logo">TickTokTwo</span> today
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../../services/userService'
import LoginForm from '../components/molecules/LoginForm.vue'

export default {
  name: 'Login',
  components: {
    LoginForm
  },
  data() {
    return {
      loading: false,
      error: '',
      submitted: false
    }
  },
  methods: {
    async handleLogin(formData) {
      this.submitted = true
      this.error = ''

      const { email, password } = formData

      if (!(email && password)) {
        return
      }

      const password_pattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/
      if (!password_pattern.test(password)) {
        this.error = "Password must be at least 8 characters with uppercase and lowercase letters."
        return
      }

      this.loading = true

      try {
        const data = await userService.login(email, password)
        this.$router.push('/')
      } catch (error) {
        this.error = error || 'Login failed. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

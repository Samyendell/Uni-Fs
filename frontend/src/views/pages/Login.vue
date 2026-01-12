<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center gradient-backgroud py-5">
    <div class="card border-0 shadow-lg auth-card">
      <div class="card-body p-0">
        <div class="gradient-backgroud text-center text-white py-4 rounded-top">
          <h1 class="brand-logo mb-2">TickTokTwo</h1>
          <p class="mb-0">Welcome back</p>
        </div>

        <div class="p-4 p-md-5">
          <LoginForm :loading="loading" :error="error" :submitted="submitted" @submit="handleLogin" />

          <div class="text-center mt-4 pt-4 border-top">
            <p class="text-muted mb-2">Don't have an account?</p>
            <router-link to="/register" class="text-decoration-none fw-semibold">
              Join <span class="brand-logo">TickTokTwo</span> today
            </router-link>
          </div>
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
        this.error = error || 'Login failed, Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
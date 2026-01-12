<template>
  <div class="min-vh-100 d-flex align-items-center justify-content-center gradient-backgroud py-5">
    <div class="card border-0 shadow-lg auth-card">
      <div class="gradient-backgroud text-center text-white py-4 rounded-top">
        <h1 class="brand-logo mb-2">TickTokTwo</h1>
        <p class="mb-0">Join the billion watch collectors worldwide</p>
      </div>

      <div class="p-4 p-md-5">
        <RegisterForm :loading="loading" :error="error" :submitted="submitted" @submit="handleSignup" />

        <div class="text-center mt-4 pt-4 border-top">
          <p class="text-muted mb-2">Already have an account?</p>
          <router-link to="/login" class="text-decoration-none fw-semibold">
            Sign in here
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../../services/userService'
import RegisterForm from '../components/molecules/RegisterForm.vue'

export default {
  name: 'Register',
  components: { RegisterForm },

  data() {
    return {
      loading: false,
      error: '',
      submitted: false
    }
  },

  methods: {
    async handleSignup(formData) {
      this.submitted = true
      this.error = ''

      const { firstName, lastName, email, password } = formData

      if (!firstName || !lastName || !email || !password) {
        return
      }

      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      if (!passwordPattern.test(password)) {
        this.error = 'Password must be at least 8 characters with uppercase and lowercase letters, a number and a special character.'
        return
      }

      this.loading = true
      try {
        await userService.register(firstName, lastName, email, password)
        this.$router.push('/login')
      } catch (error) {
        this.error = error || 'Signup failed. Please try again.'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
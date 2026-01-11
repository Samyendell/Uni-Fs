<template>
    <div class="account-page">
      <div class="account-card register-card">
        <div class="account-header">
          <h1 class="brand-logo">TickTokTwo</h1>
          <p>Join the billion watch collectors worldwide</p>
        </div>
  
        <div class="account-content">
          <RegisterForm 
            :loading="loading" 
            :error="error" 
            :submitted="submitted"
            @submit="handleSignup" 
          />
  
          <div class="account-link">
            <p>Already have an account?</p>
            <router-link to="/login">
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
    components: {
        RegisterForm
    },
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

            if (!(firstName && lastName && email && password)) {
                return
            }

            const password_pattern = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/
            if (!password_pattern.test(password)) {
                this.error = "Password must be at least 8 characters with uppercase and lowercase letters."
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

<style scoped>
.register-card {
    max-width: 450px;
}

</style>
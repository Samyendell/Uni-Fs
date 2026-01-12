<template>
  <div>
    <h2 class="h4 fw-semibold text-dark mb-4 text-center">Login to Your Account</h2>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <Input
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="Enter your email"
          :error="submitted && !formData.email ? 'Email is required' : ''"
        />
      </div>

      <div class="mb-3">
        <Input
          v-model="formData.password"
          type="password"
          label="Password"
          placeholder="Enter your password"
          :error="submitted && !formData.password ? 'Password is required' : ''"
        />
      </div>

      <div class="d-grid mt-4">
        <Button 
          type="submit" 
          :text="loading ? 'Signing In...' : 'Sign In'"
          :disabled="loading"
          class="w-100"
        />
      </div>
      
      <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
    </form>
  </div>
</template>

<script>
import Button from '../atoms/Button.vue'
import Input from '../atoms/Input.vue'

export default {
  name: 'LoginForm',
  components: {
    Button,
    Input
  },
  props: {
    loading: Boolean,
    error: String,
    submitted: Boolean
  },
  emits: ['submit'],
  data() {
    return {
      formData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.formData)
    }
  }
}
</script>
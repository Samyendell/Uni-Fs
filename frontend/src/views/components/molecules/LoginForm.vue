<template>
  <div>
    <h2>Login to Your Account</h2>
    
    <form @submit.prevent="handleSubmit" class="form-content">
      <Input
        v-model="formData.email"
        type="email"
        label="Email"
        placeholder="Enter your email"
        :error="submitted && !formData.email ? 'Email is required' : ''"
      />

      <Input
        v-model="formData.password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        :error="submitted && !formData.password ? 'Password is required' : ''"
      />

      <div class="form-submit">
        <Button 
          type="submit" 
          :text="loading ? 'Signing In...' : 'Sign In'"
          :disabled="loading"
          class="w-full"
        />
      </div>
      
      <div v-if="error" class="form-error">{{ error }}</div>
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

<!-- No styles - all moved to main.css -->
<template>
  <div>
    <h2 class="h4 fw-semibold text-dark mb-4 text-center">Create Your Account</h2>

    <form @submit.prevent="$emit('submit', formData)">
      <div class="row g-3 mb-3">
        <div class="col-md-6">
          <Input v-model="formData.firstName" label="First Name" placeholder="First name"
            :error="submitted && !formData.firstName ? 'First name is required' : ''" />
        </div>

        <div class="col-md-6">
          <Input v-model="formData.lastName" label="Last Name" placeholder="Last name"
            :error="submitted && !formData.lastName ? 'Last name is required' : ''" />
        </div>
      </div>

      <div class="mb-3">
        <Input v-model="formData.email" type="email" label="Email" placeholder="Choose an email"
          :error="submitted && !formData.email ? 'Email is required' : ''" />
      </div>

      <div class="mb-3">
        <Input v-model="formData.password" type="password" label="Password" placeholder="Create a password"
          :error="submitted && !formData.password ? 'Password is required' : ''" />
      </div>

      <div class="d-grid mt-4">
        <Button type="submit" :text="loading ? 'Creating Account...' : 'Create Account'" :disabled="loading" />
      </div>

      <div style="min-height: 58px; max-width: 100%;">
        <div v-if="error" class="alert alert-danger mt-3 mb-0 text-center" style="word-wrap: break-word; overflow-wrap: break-word; white-space: normal;">{{ error }}</div>
      </div>
    </form>
  </div>
</template>

<script>
import Button from '../atoms/Button.vue'
import Input from '../atoms/Input.vue'

export default {
  name: 'RegisterForm',
  components: { Button, Input },

  props: {
    loading: Boolean,
    error: String,
    submitted: Boolean
  },

  emits: ['submit'],

  data() {
    return {
      formData: {
        firstName: '',
        lastName: '',
        email: '',
        password: ''
      }
    }
  }
}
</script>
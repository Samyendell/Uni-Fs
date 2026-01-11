<template>
  <div class="account-page">
    <div class="account-card create-card">
      <div class="account-header">
        <h1 class="brand-logo">TickTokTwo</h1>
        <p>List your watch for sale</p>
      </div>

      <div class="account-content">
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
        
        <CreateItemForm 
          :loading="loading"
          :error="error"
          @submit="handleCreateItem"
          @draft-saved="handleDraftSaved"
          @draft-error="handleDraftError"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import CreateItemForm from '../components/molecules/CreateItemForm.vue'

export default {
  name: 'CreateItem',
  components: {
    CreateItemForm
  },
  data() {
    return {
      loading: false,
      error: '',
      successMessage: ''
    }
  },
  methods: {
    async handleCreateItem(formData) {
      this.error = ''
      this.successMessage = ''
      this.loading = true

      try {
        await coreService.createItem(formData)
        this.$router.push('/items')
      } catch (error) {
        this.error = error.error_message
      } finally {
        this.loading = false
      }
    },
    
    handleDraftSaved(message) {
      this.successMessage = message
      this.error = ''
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    },
    
    handleDraftError(message) {
      this.error = message
      this.successMessage = ''
    }
  }
}
</script>

<style scoped>
.create-card {
  max-width: 600px;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 20px;
  border: 1px solid #c3e6cb;
}
</style>
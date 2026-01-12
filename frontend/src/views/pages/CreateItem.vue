<template>
  <div class="min-vh-100 gradient-backgroud d-flex align-items-center justify-content-center py-5 px-3">
    <div class="card border-0 shadow-lg create-card">
      <div class="card-body p-0">
        <div class="gradient-backgroud text-center text-white py-4 rounded-top">
          <h1 class="brand-logo mb-2">TickTokTwo</h1>
          <p class="mb-0">List your watch for sale</p>
        </div>

        <div class="p-4 p-md-5">
          <div v-if="successMessage" class="alert alert-success mb-4">
            {{ successMessage }}
          </div>

          <CreateItemForm :loading="loading" :error="error" @submit="handleCreateItem" @draft-saved="handleDraftSaved"
            @draft-error="handleDraftError" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import CreateItemForm from '../components/molecules/CreateItemForm.vue'

export default {
  name: 'CreateItem',
  components: { CreateItemForm },

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
        this.error = error.error_message || 'Failed to create item'
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
  width: 100%;
}

@media (max-width: 768px) {
  .create-card {
    margin: 12px;
    max-width: 100%;
  }
}
</style>
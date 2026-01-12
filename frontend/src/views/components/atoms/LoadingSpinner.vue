<template>
  <div class="text-center p-4">
    <div class="spinner mx-auto mb-3" :class="sizeClass"></div>
    <p v-if="text" class="text-muted mb-0">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    text: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: '#d4af37'
    }
  },
  computed: {
    sizeClass() {
      return `spinner-${this.size}`
    }
  }
}
</script>

<style scoped>
.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.spinner-medium {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.spinner-large {
  width: 60px;
  height: 60px;
  border-width: 6px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
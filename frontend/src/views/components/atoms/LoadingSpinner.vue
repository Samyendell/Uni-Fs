<template>
  <div class="text-center p-4">
    <div class="spinner mx-auto mb-3"></div>
    <p v-if="text" class="text-white mb-0">{{ text }}</p>
  </div>
</template>

<script>
export default {
  name: 'LoadingSpinner',

  props: {
    text: String
  }
}
</script>

<style scoped>
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
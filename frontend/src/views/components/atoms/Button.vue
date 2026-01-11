<template>
  <button 
    class="btn btn-warning btn-lg"
    @click="$emit('click')"
  >
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'Button',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.btn-warning {
  background: #d4af37;
  border: none;
  color: #1a252f;
  font-weight: 600;
  text-transform: uppercase;
}

.btn-warning:hover:not(:disabled) {
  background: #b8941f;
  transform: translateY(-4px);
}
</style>
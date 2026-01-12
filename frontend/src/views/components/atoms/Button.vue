<template>
  <button class="btn btn-lg fw-semibold text-uppercase custom-btn" :disabled="disabled" :type="type"
    @click="$emit('click')">
    {{ text }}
  </button>
</template>

<script>
export default {
  name: 'Button',

  props: {
    text: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    type: { type: String, default: 'button' }
  },

  emits: ['click']
}
</script>

<style scoped>
.custom-btn {
  background: #d4af37 !important;
  border: none !important;
  color: #1a252f !important;
}

.custom-btn:hover {
  background: #b8941f !important;
  color: #1a252f !important;
  transform: translateY(-1px);
}

.custom-btn:active,
.custom-btn:focus,
.custom-btn:focus-visible {
  background: #b8941f !important;
  color: #1a252f !important;
  border-color: transparent !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>
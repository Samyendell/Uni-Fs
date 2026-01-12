<template>
  <div class="mb-3">
    <label v-if="label" class="form-label text-dark">{{ label }}</label>
    <input :type="type" :value="modelValue" :placeholder="placeholder" :min="min" class="form-control custom-input"
      :class="{ 'is-invalid': error }" @input="$emit('update:modelValue', $event.target.value)" />
    <div v-if="error" class="invalid-feedback d-block">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'Input',

  props: {
    label: String,
    type: { type: String, default: 'text' },
    modelValue: [String, Number],
    placeholder: String,
    error: String,
    min: [String, Number]
  },

  emits: ['update:modelValue']
}
</script>
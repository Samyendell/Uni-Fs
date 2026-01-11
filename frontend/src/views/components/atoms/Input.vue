<template>
  <div>
    <label v-if="label">{{ label }}</label>
    <input 
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :class="error ? 'error' : ''"
      :min="min"
      :max="max"
      :step="step"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <div v-if="error" class="error-text">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'Input',
  props: {
    label: String,
    type: String,
    modelValue: [String, Number],
    placeholder: String,
    error: String,
    min: [String, Number],
    max: [String, Number],
    step: [String, Number]
  },
  emits: ['update:modelValue']
}
</script>

<style scoped>
label {
  color: #2c3e50;
  margin-bottom: 4px;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #000000;
  border-radius: 14px;
}

input:focus {
  outline: none;
  border-color: #d4af37;
}

input.error {
  border-color: #ff0000;
}

.error-text {
  color: #ff0000;
  font-size: 14px;
  margin-top: 6px;
}
</style>
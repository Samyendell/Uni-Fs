<template>
  <div>
    <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search items..." class="form-control custom-input" :class="{ 'is-invalid': error }" />
    <div v-if="error" class="alert alert-danger mt-2 mb-0 text-center">{{ error }}</div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',

  props: {
    modelValue: String,
    error: String
  },

  emits: ['update:modelValue']
}
</script>
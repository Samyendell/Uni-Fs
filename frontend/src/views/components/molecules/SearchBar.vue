<template>
  <div>
    <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
      placeholder="Search items..." class="form-control custom-input" />
  </div>
</template>

<script>
export default {
  name: 'SearchBar',

  props: {
    modelValue: String
  },

  emits: ['update:modelValue']
}
</script>
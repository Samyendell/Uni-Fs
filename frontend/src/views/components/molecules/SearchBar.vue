<template>
  <div>
    <input 
      type="text" 
      v-model="searchQuery"
      @input="emitSearch"
      placeholder="Search items..."
      class="form-control custom-input"
    />
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  emits: ['search'],
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    emitSearch() {
      this.$emit('search', this.searchQuery)
    }
  }
}
</script>
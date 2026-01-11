<template>
  <div class="search-bar">
    <input 
      type="text" 
      v-model="searchQuery"
      @input="handleInput"
      placeholder="Search items..."
      class="search-input"
    />
    <button @click="performSearch" class="search-btn">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.35-4.35"></path>
      </svg>
    </button>
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
    handleInput() {
      this.$emit('search', this.searchQuery)
    },
    performSearch() {
      this.$emit('search', this.searchQuery)
    }
  }
}
</script>

<style scoped>
.search-bar {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  padding-right: 3rem; /* Override for search button space */
}

.search-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  padding: 0.5rem;
  border-radius: 50%;
  transition: color 0.3s ease;
}

.search-btn:hover {
  color: #d4af37;
}
</style>
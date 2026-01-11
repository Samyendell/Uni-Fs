<template>
  <div class="items-page">
    <div class="items-container">
      <h1 class="page-title">Browse Items</h1>

      <div class="search-section">
        <SearchBar @search="handleSearch" />
      </div>

      <div class="filters-section">
        <select v-model="selectedFilter" @change="applyFilter">
          <option value="">All Items</option>
          <option value="BID">Items I've Bid On</option>
          <option value="OPEN">My Active Items</option>
          <option value="ARCHIVE">My Closed Items</option>
        </select>

        <select v-model="sortBy" @change="applySorting">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>

        <select v-model="selectedCategory" @change="applyCategoryFilter">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading items...</p>
      </div>

      <div v-else-if="items.length === 0" class="no-items">
        <p>{{ getNoItemsMessage() }}</p>
      </div>

      <div v-else class="items-grid">
        <ItemCard v-for="item in items" :key="item.id || item.item_id || item._id" :item="item"
          @click="viewItem(item.item_id)" />
      </div>

      <div v-if="items.length > 0" class="pagination-controls">
        <Button text="Previous" @click="previousPage" :class="{ 'invisible': currentOffset === 0 }"
          class="pagination-btn" />
        <span class="pagination-info">
          Page {{ currentPage }}
        </span>
        <Button text="Next" @click="nextPage" :class="{ 'invisible': !hasMoreItems }" class="pagination-btn" />
      </div>

      <div class="items-actions">
        <Button text="Add New Item" @click="createItem" class="w-full" />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import { categoryService } from '../../services/categoryService'
import SearchBar from '../components/molecules/SearchBar.vue'
import ItemCard from '../components/molecules/ItemCard.vue'
import Button from '../components/atoms/Button.vue'

export default {
  name: 'ItemsView',
  components: {
    SearchBar,
    ItemCard,
    Button
  },
  data() {
    return {
      items: [],
      loading: false,
      searchQuery: '',
      selectedFilter: '',
      sortBy: 'newest',
      categories: [],
      selectedCategory: '',
      loadingCategories: false,
      limit: 12,
      currentOffset: 0,
      hasMoreItems: false
    }
  },
  computed: {
    currentPage() {
      return Math.floor(this.currentOffset / this.limit) + 1
    },
    hasSearchOrFilter() {
      return this.searchQuery.trim() || this.selectedFilter || this.selectedCategory
    }
  },
  created() {
    this.loadCategories()
    this.loadItems()
  },
  methods: {
    async loadCategories() {
      this.loadingCategories = true
      try {
        this.categories = await categoryService.getCategories()
      } catch (error) {
        console.error('Error loading categories:', error)
      } finally {
        this.loadingCategories = false
      }
    },

    async loadItems() {
      this.loading = true

      try {
        const params = {
          limit: this.limit + 1,
          offset: this.currentOffset
        }

        if (this.searchQuery.trim()) {
          params.q = this.searchQuery.trim()
        }

        if (this.selectedFilter) {
          params.status = this.selectedFilter
        }

        if (this.selectedCategory) {
          params.category = [parseInt(this.selectedCategory)]
        }

        const response = await coreService.searchItems(params)
        const allItems = Array.isArray(response) ? response : []

        if (allItems.length > 0) {
          console.log('First item structure:', allItems[0])
          console.log('Available properties:', Object.keys(allItems[0]))
        }

        this.hasMoreItems = allItems.length > this.limit
        this.items = this.hasMoreItems ? allItems.slice(0, this.limit) : allItems

        this.applySorting()

      } catch (error) {
        console.error('Error loading items:', error)
        this.items = []
        this.hasMoreItems = false
      } finally {
        this.loading = false
      }
    },

    applyCategoryFilter() {
      this.currentOffset = 0
      this.loadItems()
    },

    getNoItemsMessage() {
      if (this.searchQuery.trim()) {
        return `No items found for "${this.searchQuery}"`
      }

      if (this.selectedFilter) {
        return `No ${this.getSimpleFilterLabel()} found`
      }

      if (this.selectedCategory) {
        const category = this.categories.find(c => c.category_id === parseInt(this.selectedCategory))
        return `No items found in ${category ? category.name : 'selected category'}`
      }

      return 'No items available'
    },

    getSimpleFilterLabel() {
      switch (this.selectedFilter) {
        case 'BID': return 'items you\'ve bid on'
        case 'OPEN': return 'active items'
        case 'ARCHIVE': return 'closed items'
        default: return 'items'
      }
    },

    createItem() {
      this.$router.push('/create-item')
    },

    handleSearch(query) {
      this.searchQuery = query
      this.currentOffset = 0
      this.loadItems()
    },

    applyFilter() {
      this.currentOffset = 0
      this.loadItems()
    },

    applySorting() {
      const items = [...this.items]

      switch (this.sortBy) {
        case 'newest':
          items.sort((a, b) => {
            const aTime = this.parseTimestamp(a.start_date)
            const bTime = this.parseTimestamp(b.start_date)
            return bTime - aTime
          })
          break
        case 'oldest':
          items.sort((a, b) => {
            const aTime = this.parseTimestamp(a.start_date)
            const bTime = this.parseTimestamp(b.start_date)
            return aTime - bTime
          })
          break
        case 'price-low':
          items.sort((a, b) => {
            const aPrice = parseFloat(a.current_bid || a.starting_bid || 0)
            const bPrice = parseFloat(b.current_bid || b.starting_bid || 0)
            return aPrice - bPrice
          })
          break
        case 'price-high':
          items.sort((a, b) => {
            const aPrice = parseFloat(a.current_bid || a.starting_bid || 0)
            const bPrice = parseFloat(b.current_bid || b.starting_bid || 0)
            return bPrice - aPrice
          })
          break
      }

      this.items = items
    },

    parseTimestamp(timestamp) {
      if (!timestamp) return 0

      if (typeof timestamp === 'string') {
        const parsed = new Date(timestamp).getTime()
        return isNaN(parsed) ? 0 : parsed
      } else if (typeof timestamp === 'number') {
        return timestamp
      }

      return 0
    },

    nextPage() {
      this.currentOffset += this.limit
      this.loadItems()
    },

    previousPage() {
      this.currentOffset = Math.max(0, this.currentOffset - this.limit)
      this.loadItems()
    },

    viewItem(id) {
      console.log('Navigating to item ID:', id)
      this.$router.push(`/items/${id}`)
    }
  }
}
</script>

<style scoped>
.items-page {
  padding: 2rem 0;
}

.items-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  text-align: center;
  margin-bottom: 3rem;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 700;
}

.search-section {
  max-width: 500px;
  margin: 0 auto 2rem;
}

.filters-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.filters-section select {
  padding: 0.75rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background: white;
  font-size: 0.95rem;
  min-width: 180px;
}

.filters-section select:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.no-items {
  text-align: center;
  padding: 4rem 2rem;
  color: #6c757d;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.pagination-btn {
  min-width: 100px;
}

.pagination-btn.invisible {
  visibility: hidden;
}

.pagination-info {
  font-weight: 600;
  color: #495057;
  padding: 0 1rem;
}

.items-actions {
  text-align: center;
  max-width: 300px;
  margin: 0 auto;
}

.w-full {
  width: 100%;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .items-container {
    padding: 0 1rem;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  .filters-section {
    flex-direction: column;
    align-items: center;
  }

  .filters-section select {
    min-width: 250px;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .filters-section select {
    min-width: 100%;
  }
}
</style>
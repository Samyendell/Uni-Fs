<template>
  <div class="min-vh-100 gradient-backgroud py-4">
    <div class="container items-container">
      <h1 class="display-4 fw-bold text-white text-center mb-5">Browse Items</h1>

      <div class="search-section mx-auto mb-4">
        <SearchBar @search="handleSearch" />
      </div>

      <div class="d-flex gap-3 justify-content-center mb-5 flex-wrap">
        <select v-model="selectedFilter" @change="applyFilter" class="form-select filter-select">
          <option value="">All Items</option>
          <option value="BID">Items I've Bid On</option>
          <option value="OPEN">My Active Items</option>
          <option value="ARCHIVE">My Closed Items</option>
        </select>

        <select v-model="sortBy" @change="applySorting" class="form-select filter-select">
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
        </select>

        <select v-model="selectedCategory" @change="applyCategoryFilter" class="form-select filter-select">
          <option value="">All Categories</option>
          <option v-for="category in categories" :key="category.category_id" :value="category.category_id">
            {{ category.name }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-5">
        <LoadingSpinner text="Loading items..." />
      </div>

      <div v-else-if="items.length === 0" class="text-center py-5">
        <p class="text-white fs-5">{{ getNoItemsMessage() }}</p>
      </div>

      <ItemGrid 
        v-else 
        :items="items" 
        @item-click="viewItem" 
      />

      <div v-if="items.length > 0" class="d-flex justify-content-center align-items-center gap-4 mb-5">
        <Button 
          text="Previous" 
          @click="previousPage" 
          :class="{ 'invisible': currentOffset === 0 }" 
          class="pagination-btn" 
        />
        <span class="fw-semibold text-white">Page {{ currentPage }}</span>
        <Button 
          text="Next" 
          @click="nextPage" 
          :class="{ 'invisible': !hasMoreItems }" 
          class="pagination-btn" 
        />
      </div>

      <div class="text-center items-actions">
        <Button text="Add New Item" @click="createItem" />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import { categoryService } from '../../services/categoryService'
import SearchBar from '../components/molecules/SearchBar.vue'
import ItemGrid from '../components/organisms/ItemGrid.vue'
import Button from '../components/atoms/Button.vue'
import LoadingSpinner from '../components/atoms/LoadingSpinner.vue'

export default {
  name: 'ItemsView',
  components: {
    SearchBar,
    ItemGrid,
    Button,
    LoadingSpinner
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

    viewItem(item) {
      console.log('Navigating to item:', item)
      this.$router.push(`/items/${item.item_id}`)
    }
  }
}
</script>

<style scoped>
  .items-container {
    max-width: 1200px;
  }
  
  .search-section {
    max-width: 500px;
  }
  
  .filter-select {
    min-width: 180px;
    max-width: 220px;
  }
  
  .filter-select:focus {
    border-color: #d4af37;
    box-shadow: 0 0 0 0.25rem rgba(212, 175, 55, 0.25);
  }
  
  .pagination-btn {
    min-width: 120px;
  }
  
  .items-actions {
    max-width: 300px;
    margin: 0 auto;
  }
  </style>
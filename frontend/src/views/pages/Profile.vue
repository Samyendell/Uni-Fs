<template>
  <div class="items-page">
    <div class="items-container">
      <div class="profile-header">
        <h1 class="page-title">{{ user ? `${user.first_name} ${user.last_name}` : 'Profile' }}</h1>
        <p v-if="user" class="user-subtitle">User ID: {{ user.user_id }}</p>
      </div>

      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading profile...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="user" class="profile-container">
        <!-- Profile Tabs using Button component -->
        <div class="filters-section">
          <Button text="Selling" @click="activeTab = 'selling'" :class="{ 'tab-active': activeTab === 'selling' }" />
          <Button text="Bidding On" @click="activeTab = 'bidding'" :class="{ 'tab-active': activeTab === 'bidding' }" />
          <Button text="Ended Auctions" @click="activeTab = 'ended'" :class="{ 'tab-active': activeTab === 'ended' }" />
        </div>

        <!-- Tab Content -->
        <!-- Selling Tab -->
        <div v-if="activeTab === 'selling'">
          <div v-if="!user.selling || user.selling.length === 0" class="no-items">
            <p>No items currently for sale</p>
          </div>

          <div v-else class="items-grid">
            <ItemCard v-for="item in user.selling" :key="item.item_id" :item="item" @click="viewItem(item.item_id)" />
          </div>
        </div>

        <!-- Bidding On Tab -->
        <div v-if="activeTab === 'bidding'">
          <div v-if="!user.bidding_on || user.bidding_on.length === 0" class="no-items">
            <p>Not currently bidding on any items</p>
          </div>

          <div v-else class="items-grid">
            <ItemCard v-for="item in user.bidding_on" :key="item.item_id" :item="item"
              @click="viewItem(item.item_id)" />
          </div>
        </div>

        <div v-if="activeTab === 'ended'">
          <div v-if="!endedAuctions || endedAuctions.length === 0" class="no-items">
            <p>No ended auctions</p>
          </div>

          <div v-else class="items-grid">
            <ItemCard v-for="item in endedAuctions" :key="item.item_id" :item="item" @click="viewItem(item.item_id)" />
          </div>
        </div>
      </div>

      <div v-else class="not-found">
        <h1 class="page-title">User Not Found</h1>
        <p>The user you're looking for doesn't exist or has been removed.</p>
        <Button text="Browse Items" @click="$router.push('/items')" />
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../../services/userService'
import ItemCard from '../components/molecules/ItemCard.vue'
import Button from '../components/atoms/Button.vue'

export default {
  name: 'Profile',
  components: {
    ItemCard,
    Button
  },
  data() {
    return {
      user: null,
      loading: true,
      error: null,
      activeTab: 'selling'
    }
  },
  computed: {
    userId() {
      return this.$route.params.id || localStorage.getItem('user_id')
    },
    endedAuctions() {
      if (!this.user) return []

      // Check multiple possible property names for ended auctions
      return this.user.auctions_ended ||
        this.user.ended_auctions ||
        this.user.ended ||
        []
    }
  },
  async created() {
    await this.loadProfile()
  },
  methods: {
    async loadProfile() {
      this.loading = true
      this.error = null

      try {
        console.log('Loading profile for user ID:', this.userId)
        this.user = await userService.getUserProfile(this.userId)
        console.log('Loaded user profile:', this.user)

        // Debug log to see what properties are available
        console.log('User properties:', Object.keys(this.user))
        console.log('Selling items:', this.user.selling?.length || 0)
        console.log('Bidding on items:', this.user.bidding_on?.length || 0)
        console.log('Ended auctions:', this.endedAuctions?.length || 0)
        console.log('All ended auction properties:', {
          auctions_ended: this.user.auctions_ended,
          ended_auctions: this.user.ended_auctions,
          ended: this.user.ended
        })

      } catch (error) {
        console.error('Error loading profile:', error)
        this.error = error || 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },

    viewItem(itemId) {
      console.log('Navigating to item ID:', itemId)
      this.$router.push(`/items/${itemId}`)
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

.profile-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.user-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
}

.filters-section {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

/* Active state styling for Button components */
.filters-section .tab-active {
  background: #d4af37 !important;
  border-color: #d4af37 !important;
  color: #ffffff !important;
}

.filters-section .tab-active:hover {
  background: #c19b26 !important;
  border-color: #c19b26 !important;
  color: #ffffff !important;
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

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin: 2rem 0;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }

  .user-subtitle {
    font-size: 1rem;
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
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .user-subtitle {
    font-size: 0.95rem;
  }

  .items-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
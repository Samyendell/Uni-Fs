<template>
  <div class="min-vh-100 gradient-backgroud py-4">
    <div class="container profile-container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-white mb-2">
          {{ user ? `${user.first_name} ${user.last_name}` : 'Profile' }}
        </h1>
        <p v-if="user" class="text-white fs-5 fw-medium mb-0">User ID: {{ user.user_id }}</p>
      </div>

      <LoadingSpinner v-if="loading" text="Loading profile..." class="text-center py-5" />

      <div v-else-if="error" class="alert alert-danger text-center error-container">
        {{ error }}
      </div>

      <div v-else-if="user">
        <div class="d-flex gap-3 justify-content-center mb-5 flex-wrap">
          <Button v-for="tab in tabs" :key="tab.id" :text="tab.label" @click="activeTab = tab.id"
            :class="{ 'tab-active': activeTab === tab.id }" />
        </div>

        <div v-if="currentTabItems.length === 0" class="text-center py-5">
          <div class="no-items-box">
            <p class="text-white fs-5 mb-0">{{ emptyMessage }}</p>
          </div>
        </div>

        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
          <div v-for="item in currentTabItems" :key="item.item_id" class="col">
            <ItemCard :item="item" @click="$router.push(`/items/${item.item_id}`)" />
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h1 class="display-4 fw-bold text-white mb-3">User Not Found</h1>
        <p class="text-white fs-5 mb-4">The user you're looking for doesn't exist or has been removed.</p>
        <Button text="Browse Items" @click="$router.push('/items')" />
      </div>
    </div>
  </div>
</template>

<script>
import { userService } from '../../services/userService'
import ItemCard from '../components/molecules/ItemCard.vue'
import Button from '../components/atoms/Button.vue'
import LoadingSpinner from '../components/atoms/LoadingSpinner.vue'

export default {
  name: 'Profile',
  components: { ItemCard, Button, LoadingSpinner },

  data() {
    return {
      user: null,
      loading: true,
      error: null,
      activeTab: 'selling',
      tabs: [
        { id: 'selling', label: 'Selling' },
        { id: 'bidding', label: 'Bidding On' },
        { id: 'ended', label: 'Ended Auctions' }
      ]
    }
  },

  computed: {
    userId() {
      return this.$route.params.id || localStorage.getItem('user_id')
    },

    currentTabItems() {
      if (!this.user) return []

      const tabMap = {
        selling: this.user.selling || [],
        bidding: (this.user.bidding_on || []).map(item => ({
          ...item,
          current_bid: item.user_bid_amount
        })),
        ended: (this.user.auctions_ended || []).map(item => ({
          ...item,
          current_bid: item.highest_bid
        }))
      }

      return tabMap[this.activeTab] || []
    },

    emptyMessage() {
      const messages = {
        selling: 'No items currently for sale',
        bidding: 'Not currently bidding on any items',
        ended: 'No ended auctions'
      }

      return messages[this.activeTab] || 'No items found'
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
        this.user = await userService.getUserProfile(this.userId)
      } catch (error) {
        this.error = error || 'Failed to load profile'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.profile-container {
  max-width: 1200px;
}

.error-container {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
</style>
<template>
  <div class="min-vh-100 gradient-backgroud py-4">
    <div class="container profile-container">
      <div class="text-center mb-5">
        <h1 class="display-4 fw-bold text-white mb-2">{{ user ? `${user.first_name} ${user.last_name}` : 'Profile' }}</h1>
        <p v-if="user" class="text-muted fs-5 fw-medium mb-0">User ID: {{ user.user_id }}</p>
      </div>

      <div v-if="loading" class="text-center py-5">
        <LoadingSpinner text="Loading profile..." />
      </div>

      <div v-else-if="error" class="alert alert-danger text-center error-container">
        <p class="mb-0">{{ error }}</p>
      </div>

      <div v-else-if="user">
        <div class="d-flex gap-3 justify-content-center mb-5 flex-wrap">
          <Button text="Selling" @click="activeTab = 'selling'" :class="{ 'tab-active': activeTab === 'selling' }" />
          <Button text="Bidding On" @click="activeTab = 'bidding'" :class="{ 'tab-active': activeTab === 'bidding' }" />
          <Button text="Ended Auctions" @click="activeTab = 'ended'" :class="{ 'tab-active': activeTab === 'ended' }" />
        </div>

        <div v-if="activeTab === 'selling'">
          <div v-if="!user.selling || user.selling.length === 0" class="text-center py-5">
            <div class="no-items-box">
              <p class="text-white fs-5 mb-0">No items currently for sale</p>
            </div>
          </div>

          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
            <div v-for="item in user.selling" :key="item.item_id" class="col">
              <ItemCard :item="item" @click="viewItem(item.item_id)" />
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'bidding'">
          <div v-if="!user.bidding_on || user.bidding_on.length === 0" class="text-center py-5">
            <div class="no-items-box">
              <p class="text-white fs-5 mb-0">Not currently bidding on any items</p>
            </div>
          </div>

          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
            <div v-for="item in user.bidding_on" :key="item.item_id" class="col">
              <ItemCard :item="item" @click="viewItem(item.item_id)" />
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'ended'">
          <div v-if="!endedAuctions || endedAuctions.length === 0" class="text-center py-5">
            <div class="no-items-box">
              <p class="text-white fs-5 mb-0">No ended auctions</p>
            </div>
          </div>

          <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
            <div v-for="item in endedAuctions" :key="item.item_id" class="col">
              <ItemCard :item="item" @click="viewItem(item.item_id)" />
            </div>
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
  components: {
    ItemCard,
    Button,
    LoadingSpinner
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
        this.user = await userService.getUserProfile(this.userId)
      } catch (error) {
        this.error = error || 'Failed to load profile'
      } finally {
        this.loading = false
      }
    },

    viewItem(itemId) {
      this.$router.push(`/items/${itemId}`)
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
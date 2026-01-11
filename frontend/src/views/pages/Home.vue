<template>
  <div class="home">
    <section class="gradient-backgroud">
      <div class="container text-center text-white">
        <div class="hero-content">
          <h1 class="display-3 fw-bold mb-5">Welcome to <span class="brand-logo">TickTokTwo</span> Auctions</h1>
          <p class="fw-semibold mb-5">
            Find a range of luxury and unique pieces from trust sellers ready for purchase today
          </p>
          <div class="d-flex justify-content-center align-items-center gap-4 mb-4 flex-wrap">
            <router-link to="/items">
              <Button text="Browse Pieces" />
            </router-link>
            <router-link v-if="isLoggedIn" to="/item">
              <Button text="List Your Watch" />
            </router-link>
            <router-link v-else to="/register">
              <Button text="Join Today" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <div class="col-md-4" v-for="feature in features" :key="feature.title">
            <div class="card h-100 border-0 shadow-sm custom-card">
              <div class="card-body text-center p-4">
                <h5 class="card-title fw-semibold mb-3">{{ feature.title }}</h5>
                <p class="card-text">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2 class="text-center display-5 fw-bold text-dark mb-5">Brands We Feature</h2>
          </div>
        </div>
        <div class="row g-3">
          <div class="col-6 col-md-4 col-lg-2" v-for="brand in brands" :key="brand">
            <div class="card border-0 shadow-sm custom-card h-100">
              <div class="card-body text-center p-3">
                <h6 class="card-title fw-semibold mb-1">{{ brand }}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="gradient-backgroud">
      <div class="container text-center text-white">
        <h2 class="display-5 fw-bold mb-4">
          {{ isLoggedIn ? 'Ready to List Your Watch?' : 'Ready to Join' }} <span v-if="!isLoggedIn"
            class="brand-logo">TickTokTwo</span>{{ !isLoggedIn ? '?' : '' }}
        </h2>
        <p class="fw-semibold mb-5">
          {{ isLoggedIn
            ? 'List a watch now and gain exposure to our vast user base'
            : 'Join the billion watch collectors currently using ' }}<span v-if="!isLoggedIn"
            class="brand-logo">TickTokTwo</span>
        </p>
        <router-link :to="isLoggedIn ? '/item' : '/register'">
          <Button :text="ctaButtonText" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import Button from '../components/atoms/Button.vue'

export default {
  name: 'Home',
  components: {
    Button
  },
  data() {
    return {
      brands: ['Rolex', 'Omega', 'Patek Philippe', 'Cartier', 'TAG Heuer', 'Breitling'],
      features: [
        {
          title: 'Guaranteed Authenticity',
          description: 'We check every watch that is sold on the platform twice, just to make sure'
        },
        {
          title: 'Secure Transactions',
          description: 'We securely handle thousands of payments a day using state of the art technology to ensure your money is safe'
        },
        {
          title: 'Established Platform',
          description: 'We have over 1 billion members and are growing exponentially'
        }
      ]
    }
  },
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('session_token')
    },
    ctaTitle() {
      return this.isLoggedIn
        ? 'Ready to List Your Watch?'
        : `Ready to Join TickTokTwo?`
    },
    ctaText() {
      return this.isLoggedIn
        ? 'List a watch now and gain exposure to our vast user base'
        : 'Join the billion watch collectors currently using TickTokTwo'
    },
    ctaButtonText() {
      return this.isLoggedIn ? 'Add a Watch' : 'Join the crew'
    }
  }
}
</script>

<style scoped>
.gradient-backgroud {
  min-height: 60vh;
  display: flex;
  align-items: center;
}
</style>
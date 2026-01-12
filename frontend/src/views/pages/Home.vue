<template>
  <div class="home">
    <section class="gradient-backgroud py-5">
      <div class="container text-center text-white py-5">
        <h1 class="display-3 fw-bold mb-4">
          Welcome to <span class="brand-logo">TickTokTwo</span> Auctions
        </h1>
        <p class="lead fw-semibold mb-5 px-3">
          Find a range of luxury and unique pieces from trusted sellers ready for purchase today
        </p>
        <div class="d-flex justify-content-center gap-4 flex-wrap">
          <router-link to="/items" class="text-decoration-none">
            <Button text="Browse Pieces" />
          </router-link>
          <router-link :to="isLoggedIn ? '/create-item' : '/register'" class="text-decoration-none">
            <Button :text="isLoggedIn ? 'List Your Watch' : 'Join Today'" />
          </router-link>
        </div>
      </div>
    </section>

    <section class="py-5 bg-white">
      <div class="container">
        <div class="row g-4">
          <div v-for="feature in features" :key="feature.title" class="col-md-4">
            <div class="card h-100 border-0 shadow-sm custom-card">
              <div class="card-body text-center p-4">
                <h5 class="card-title fw-semibold mb-3">{{ feature.title }}</h5>
                <p class="card-text text-muted mb-0">{{ feature.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="display-5 fw-bold text-dark text-center mb-5">Brands</h2>
        <div class="row g-3">
          <div v-for="brand in brands" :key="brand" class="col-6 col-md-4 col-lg-2">
            <div class="card border-0 shadow-sm custom-card h-100">
              <div class="card-body text-center p-3">
                <h6 class="card-title fw-semibold mb-0">{{ brand }}</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="gradient-backgroud py-5">
      <div class="container text-center text-white py-5">
        <h2 class="display-5 fw-bold mb-4">
          {{ isLoggedIn ? 'Ready to List Your Watch?' : 'Ready to Join' }}
          <span v-if="!isLoggedIn" class="brand-logo">TickTokTwo</span>{{ isLoggedIn ? '' : '?' }}
        </h2>
        <p class="lead fw-semibold mb-5 px-3">
          {{ isLoggedIn
            ? 'List a watch now and gain exposure to our vast user base'
            : 'Join the billion watch collectors currently using' }}
          <span v-if="!isLoggedIn" class="brand-logo">TickTokTwo</span>
        </p>
        <router-link :to="isLoggedIn ? '/create-item' : '/register'" class="text-decoration-none">
          <Button :text="isLoggedIn ? 'Add a Watch' : 'Join the Crew'" />
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
import Button from '../components/atoms/Button.vue'

export default {
  name: 'Home',
  components: { Button },

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
    }
  }
}
</script>
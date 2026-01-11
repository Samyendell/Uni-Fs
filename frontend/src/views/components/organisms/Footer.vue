<template>
  <footer class="gradient-backgroud py-5">
    <div class="container">
      <div class="row g-4">
        <div class="col-lg-4 col-md-6">
          <h3 class="brand-logo mb-3">TickTokTwo</h3>
          <p class="text-white-50">
              Possibly the best website to buy watches in the world, just ask our 1 BILLION members
            </p>
          </div>

        <div class="col-lg-2 col-md-6">
          <h5 class="text-white mb-3">Quick Links</h5>
          <ul class="footer-links">
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/items">Browse Watches</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/create-item">List Watch</router-link></li>
          </ul>
        </div>

        <div class="col-lg-2 col-md-6">
          <h5 class="text-white mb-3">Account</h5>
          <ul class="footer-links">
            <li v-if="!isLoggedIn"><router-link to="/login">Login</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/profile">Profile</router-link></li>
            <li v-if="isLoggedIn"><router-link to="/logout">Logout</router-link></li>
          </ul>
        </div>

        <div class="col-lg-4 col-md-6">
            <h5 class="text-white mb-3">Get In Touch</h5>
            <p class="text-white-50 mb-2">
              <strong>Email:</strong> support@<span class="brand-logo">TickTokTwo</span>.com
            </p>
            <p class="text-white-50 mb-2">
              <strong>Phone:</strong> 07462 461487
            </p>
            <p class="text-white-50">
              <strong>Hours:</strong> Mon-Sun 4AM-11PM
            </p>
          </div>
      </div>

      <hr class="border-secondary my-4">
      <div class="row">
        <div class="col-12 text-center">
          <p class="text-white-50 mb-0">
            &copy; 2026 <span class="brand-logo">TickTokTwo</span> Auctions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    isLoggedIn() {
      return !!localStorage.getItem('session_token')
    }
  }
}
</script>

<style scoped>
  .gradient-backgroud {
    margin-top: auto;
    border-top: 3px solid #000;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .footer-links li {
    margin-bottom: 0.5rem;
  }
  
  .footer-links a {
    color: #c3c7ca;
    text-decoration: none;
  }
  
  .footer-links a:hover {
    color: #d4af37;
    text-decoration: underline;
  }
  
  @media (max-width: 768px) {
    h5 {
      margin-top: 1.5rem;
    }
  
    h3.brand-logo {
      margin-top: 0;
    }
  }
  </style>
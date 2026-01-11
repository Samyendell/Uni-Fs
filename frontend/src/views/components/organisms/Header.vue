<template>
  <header class="header">
    <div class="container">
      <div class="row align-items-center py-3">
        <div class="col-6 col-lg-3">
          <router-link to="/" class="text-decoration-none">
            <h2 class="brand-logo mb-0">TickTokTwo</h2>
          </router-link>
        </div>
        
        <div class="col-lg-6 d-none d-lg-block">
          <nav class="d-flex justify-content-center gap-3">
            <router-link to="/" class="nav-link">Home</router-link>
            <router-link to="/items" class="nav-link">Browse</router-link>
            <router-link v-if="isLoggedIn" to="/create-item" class="nav-link">List</router-link>
          </nav>
        </div>
        
        <div class="col-lg-3 d-none d-lg-block text-end">
          <div v-if="isLoggedIn" class="d-flex justify-content-end gap-2">
            <router-link to="/profile" class="nav-link">Profile</router-link>
            <router-link to="/logout" class="nav-link logout">Logout</router-link>
          </div>
          <div v-else class="d-flex justify-content-end gap-2">
            <router-link to="/login" class="nav-link">Login</router-link>
            <router-link to="/register" class="nav-link">Join</router-link>
          </div>
        </div>

        <div class="col-6 d-lg-none text-end">
          <button class="burger-btn" @click="showMobile = !showMobile">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <div v-show="showMobile" class="mobile-menu d-lg-none">
        <router-link to="/" class="mobile-link" @click="showMobile = false">Home</router-link>
        <router-link to="/items" class="mobile-link" @click="showMobile = false">Browse</router-link>
        <router-link v-if="isLoggedIn" to="/create-item" class="mobile-link" @click="showMobile = false">List</router-link>
        <hr>
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="mobile-link" @click="showMobile = false">Profile</router-link>
          <router-link to="/logout" class="mobile-link logout" @click="showMobile = false">Logout</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="mobile-link" @click="showMobile = false">Login</router-link>
          <router-link to="/register" class="mobile-link" @click="showMobile = false">Join</router-link>
        </template>
      </div>
    </div>
  </header>
</template>

<script>
  export default {
    name: 'Header',
    data() {
      return { 
        showMobile: false
      }
    },
    computed: {
      isLoggedIn() {
        // Force reactivity on route change
        this.$route
        return !!localStorage.getItem('session_token')
      }
    }
  }
  </script>

<style scoped>
.header {
  background: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

/* Links */
.nav-link, .mobile-link {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover,
.nav-link.router-link-active,
.mobile-link:hover,
.mobile-link.router-link-active {
  background: #d4af37;
  color: #1a252f;
}

.logout {
  color: #dc3545 !important;
}

.logout:hover {
  background: #dc3545 !important;
  color: white !important;
}

/* Burger */
.burger-btn {
  background: none;
  border: none;
  width: 30px;
  height: 24px;
  cursor: pointer;
  padding: 0;
}

.burger-btn span {
  display: block;
  height: 3px;
  width: 100%;
  background: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
  transition: 0.3s;
}

/* Mobile menu */
.mobile-menu {
  background: white;
  border-top: 1px solid #eee;
  padding: 1rem;
}

.mobile-link {
  display: block;
  margin-bottom: 0.5rem;
}
</style>
<template>
  <header class="bg-white shadow-sm sticky-top">
    <div class="container">
      <div class="row align-items-center py-3">
        <div class="col-6 col-lg-3">
          <router-link to="/" class="text-decoration-none">
            <h2 class="brand-logo mb-0">TickTokTwo</h2>
          </router-link>
        </div>

        <div class="col-lg-6 d-none d-lg-block">
          <nav class="d-flex justify-content-center gap-3">
            <router-link to="/" class="nav-link text-dark fw-medium px-3 py-2 rounded">Home</router-link>
            <router-link to="/items" class="nav-link text-dark fw-medium px-3 py-2 rounded">Browse</router-link>
            <router-link v-if="isLoggedIn" to="/create-item"
              class="nav-link text-dark fw-medium px-3 py-2 rounded">List</router-link>
          </nav>
        </div>

        <div class="col-lg-3 d-none d-lg-block text-end">
          <div v-if="isLoggedIn" class="d-flex justify-content-end gap-2">
            <router-link to="/profile" class="nav-link text-dark fw-medium px-3 py-2 rounded">Profile</router-link>
            <router-link to="/logout" class="nav-link text-danger fw-medium px-3 py-2 rounded">Logout</router-link>
          </div>
          <div v-else class="d-flex justify-content-end gap-2">
            <router-link to="/login" class="nav-link text-dark fw-medium px-3 py-2 rounded">Login</router-link>
            <router-link to="/register" class="nav-link text-dark fw-medium px-3 py-2 rounded">Join</router-link>
          </div>
        </div>

        <div class="col-6 d-lg-none text-end">
          <button class="btn btn-link p-0 burger-btn" @click="showMobile = !showMobile" aria-label="Toggle menu">
            <span class="burger-line"></span>
            <span class="burger-line"></span>
            <span class="burger-line"></span>
          </button>
        </div>
      </div>

      <div v-show="showMobile" class="d-lg-none bg-white border-top p-3">
        <router-link to="/" class="d-block mb-2 nav-link text-dark fw-medium px-3 py-2 rounded"
          @click="showMobile = false">Home</router-link>
        <router-link to="/items" class="d-block mb-2 nav-link text-dark fw-medium px-3 py-2 rounded"
          @click="showMobile = false">Browse</router-link>
        <router-link v-if="isLoggedIn" to="/create-item"
          class="d-block mb-2 nav-link text-dark fw-medium px-3 py-2 rounded"
          @click="showMobile = false">List</router-link>
        <hr class="my-2">
        <template v-if="isLoggedIn">
          <router-link to="/profile" class="d-block mb-2 nav-link text-dark fw-medium px-3 py-2 rounded"
            @click="showMobile = false">Profile</router-link>
          <router-link to="/logout" class="d-block mb-2 nav-link text-danger fw-medium px-3 py-2 rounded"
            @click="showMobile = false">Logout</router-link>
        </template>
        <template v-else>
          <router-link to="/login" class="d-block mb-2 nav-link text-dark fw-medium px-3 py-2 rounded"
            @click="showMobile = false">Login</router-link>
          <router-link to="/register" class="d-block mb-2 nav-link text-dark fw-medium px-3 py-2 rounded"
            @click="showMobile = false">Join</router-link>
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
      this.$route
      return !!localStorage.getItem('session_token')
    }
  }
}
</script>

<style scoped>
.burger-btn {
  width: 30px;
  height: 24px;
}

.burger-line {
  display: block;
  height: 3px;
  width: 100%;
  background-color: #2c3e50;
  margin: 5px 0;
  border-radius: 3px;
}

.nav-link:hover,
.nav-link.router-link-active {
  background-color: #d4af37 !important;
  color: #1a252f !important;
}
</style>
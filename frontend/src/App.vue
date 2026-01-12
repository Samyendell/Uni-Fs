<template>
  <div id="app" class="d-flex flex-column min-vh-100">
    <Header />
    <main class="flex-grow-1">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from './views/components/organisms/Header.vue'
import Footer from './views/components/organisms/Footer.vue'

export default {
  name: 'App',
  components: {
    Header,
    Footer
  }
}
</script>
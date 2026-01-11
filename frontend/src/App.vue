<template>
  <div id="app">
    <Header />
    <main class="main-content">
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

<style>
.main-content {
  flex: 1;
  min-height: calc(100vh - 200px);
}
</style>

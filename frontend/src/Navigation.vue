<!-- <template>
    <nav class="navigation">
      <router-link to="/" class="nav-link">Home</router-link>
      <router-link to="/items" class="nav-link">Browse Items</router-link>
      <router-link v-if="isLoggedIn" to="/create-item" class="nav-link">Add Item</router-link>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Navigation',
    computed: {
      isLoggedIn() {
        return !!localStorage.getItem('session_token')
      }
    }
  }
  </script>
  
  <style scoped>
  .navigation {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .nav-link {
    text-decoration: none;
    color: #2c3e50;
    font-weight: 600;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .nav-link:hover {
    background: #f8f9fa;
  }
  
  .nav-link.router-link-active {
    background: #f4d03f;
    color: #1a1a2e;
  }
  
  @media (max-width: 768px) {
    .navigation {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
  </style> -->
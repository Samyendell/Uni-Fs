<template>
    <div class="logo" :class="sizeClass">
      <span class="logo-icon">⌚</span>
      <span v-if="showText" class="logo-text">{{ text }}</span>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Logo',
    props: {
      size: {
        type: String,
        default: 'medium'
      },
      text: {
        type: String,
        default: 'TimeKeeper'
      },
      showText: {
        type: Boolean,
        default: true
      }
    },
    computed: {
      sizeClass() {
        return `logo-${this.size}`
      }
    }
  }
  </script>
  
  <style scoped>
  .logo {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 700;
    color: #2c3e50;
  }
  
  .logo-small {
    font-size: 1rem;
  }
  
  .logo-medium {
    font-size: 1.5rem;
  }
  
  .logo-large {
    font-size: 2rem;
  }
  
  .logo-icon {
    font-size: 1.2em;
  }
  
  .logo-text {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  </style>
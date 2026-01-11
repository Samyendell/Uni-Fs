<template>
    <div class="item-grid">
      <div 
        v-for="item in items" 
        :key="item.id"
        class="item-grid-slot"
      >
        <ItemCard 
          :item="item" 
          @click="$emit('item-click', item)"
        />
      </div>
    </div>
  </template>
  
  <script>
  import ItemCard from '../molecules/ItemCard.vue'
  
  export default {
    name: 'ItemGrid',
    components: {
      ItemCard
    },
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    emits: ['item-click']
  }
  </script>
  
  <style scoped>
  .item-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    padding: 1rem 0;
  }
  
  @media (max-width: 768px) {
    .item-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }
  }
  </style>
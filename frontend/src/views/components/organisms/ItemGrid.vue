<template>
  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 mb-5">
    <div v-for="item in items" :key="item.id" class="col">
      <ItemCard :item="item" @click="$emit('item-click', item)" />
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
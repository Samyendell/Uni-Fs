<template>
  <div class="card border-0 custom-card h-100" @click="$emit('click')" role="button">
    <div class="card-body d-flex flex-column p-4">
      <h3 class="h5 fw-semibold text-dark mb-3">{{ item.name }}</h3>
      <p class="text-muted lh-base flex-grow-1 mb-0">{{ item.description }}</p>

      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <span v-if="item.current_bid !== undefined && item.current_bid !== null" class="fs-5 fw-bold text-dark">£{{ item.current_bid }}</span>
        <span v-else></span>
        <span class="badge" :class="isActive ? 'bg-success' : 'bg-danger'">
          {{ isActive ? 'Active' : 'Ended' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemCard',

  props: {
    item: { type: Object, required: true }
  },

  emits: ['click'],

  computed: {
    isActive() {
      return this.item?.end_date && Date.now() < this.item.end_date
    }
  }
}
</script>
<template>
  <div class="card border-0 custom-card h-100" @click="$emit('click')" role="button">
    <div class="card-body d-flex flex-column p-4">
      <h3 class="h5 fw-semibold text-dark mb-3">{{ item.name }}</h3>
      <p class="text-muted lh-base flex-grow-1 mb-0">{{ item.description }}</p>
      
      <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
        <span class="fs-5 fw-bold text-dark">£ {{ item.starting_bid }}</span>
        <span class="badge" :class="getStatusClass()">
          {{ getStatusText() }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  methods: {
    getStatusClass() {
      if (!this.item || !this.item.end_date) return 'bg-success'
      
      const now = Date.now()
      const endTime = this.item.end_date
      
      return now < endTime ? 'bg-success' : 'bg-danger'
    },
    
    getStatusText() {
      if (!this.item || !this.item.end_date) return 'Active'
      
      const now = Date.now()
      const endTime = this.item.end_date
      
      return now < endTime ? 'Active' : 'Ended'
    }
  }
}
</script>
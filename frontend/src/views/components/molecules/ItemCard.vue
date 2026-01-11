<template>
  <div class="item-card custom-card" @click="$emit('click')">
    <div class="item-content">
      <h3 class="item-name">{{ item.name }}</h3>
      <p class="item-description">{{ item.description }}</p>
      
      <div class="item-footer">
        <span class="item-price">£ {{ item.starting_bid }}</span>
        <span class="item-status" :class="getStatusClass()">
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
      if (!this.item || !this.item.end_date) return 'active'
      
      const now = Date.now()
      const endTime = this.item.end_date
      
      console.log('ItemCard Status Check:', {
        itemName: this.item.name,
        now: now,
        endTime: endTime,
        nowFormatted: new Date(now).toLocaleString(),
        endTimeFormatted: new Date(endTime).toLocaleString(),
        isActive: now < endTime
      })
      
      return now < endTime ? 'active' : 'ended'
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

<style scoped>
.item-card {
  background: white;
  height: 100%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.item-content {
  padding: 1.5rem;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.item-name {
  font-size: 1.25rem;
  color: #2c3e50;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.item-description {
  color: #6c757d;
  line-height: 1.5;
  margin-bottom: auto;
  flex-grow: 1;
}

.item-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.item-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
}

.item-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
}

.item-status.active {
  background: #d4edda;
  color: #155724;
}

.item-status.ended {
  background: #f8d7da;
  color: #721c24;
}
</style>
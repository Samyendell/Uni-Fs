<template>
  <div>
    <h2 class="h4 fw-semibold text-dark mb-4 text-center">List Your Watch</h2>

    <div v-if="currentDraftId" class="alert alert-info d-flex justify-content-between align-items-center mb-4">
      <span>Currently editing draft</span>
      <button @click="clearDraft" type="button" class="btn-close" aria-label="Clear draft"></button>
    </div>

    <form @submit.prevent="handleSubmit">
      <Input v-model="formData.name" label="Item Name" placeholder="Enter watch name"
        :error="submitted && !formData.name ? 'Item name is required' : ''" />

      <div class="mb-3">
        <label class="form-label text-dark">Description</label>
        <textarea v-model="formData.description" placeholder="Describe your watch" class="form-control custom-input"
          rows="4" />
      </div>

      <Input v-model.number="formData.starting_bid" type="number" label="Starting Bid" placeholder="0" min="0"
        :error="submitted && !formData.starting_bid ? 'Starting bid is required' : ''" />

      <div class="mb-3">
        <label class="form-label text-dark">Auction End Date</label>
        <input v-model="formData.end_date" type="datetime-local" class="form-control custom-input"
          :class="{ 'is-invalid': submitted && endDateError }" :min="minDateTime" />
        <div v-if="submitted && endDateError" class="invalid-feedback d-block">{{ endDateError }}</div>
      </div>

      <div class="mb-3">
        <label class="form-label text-dark">Categories</label>
        <div v-if="loadingCategories" class="text-muted small">Loading categories...</div>
        <div v-else class="row row-cols-1 row-cols-md-2 g-2 mt-2">
          <div v-for="category in categories" :key="category.category_id" class="col">
            <label class="category-checkbox d-flex align-items-center gap-2 p-2 border border-2 border-dark rounded-2">
              <input type="checkbox" :value="category.category_id" v-model="formData.category_id"
                class="form-check-input m-0" />
              <span class="small user-select-none">{{ category.name }}</span>
            </label>
          </div>
        </div>
      </div>

      <div v-if="error" class="alert alert-danger mb-4">{{ error }}</div>

      <div class="d-grid mb-3">
        <Button type="submit" :text="loading ? 'Creating...' : 'Create Listing'" :disabled="loading" />
      </div>

      <div v-if="showDraftControls" class="d-flex gap-2">
        <Button class="flex-fill" text="Save Draft" @click="saveDraft" :disabled="loading" type="button" />
        <Button class="flex-fill" text="Load Draft" @click="showDraftModal = true" :disabled="loading" type="button" />
      </div>
    </form>

    <div v-if="showDraftModal" class="modal-overlay" @click="showDraftModal = false">
      <div class="modal-content bg-white rounded shadow-lg" @click.stop>
        <div class="border-bottom p-4 d-flex justify-content-between align-items-center">
          <h3 class="h5 mb-0">Load Draft</h3>
          <button @click="showDraftModal = false" type="button" class="btn-close" aria-label="Close"></button>
        </div>
        <div class="p-4">
          <div v-if="drafts.length === 0" class="text-center text-muted py-4">
            No drafts saved
          </div>
          <div v-else>
            <div v-for="draft in drafts" :key="draft.id" class="card mb-3 border">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <h4 class="h6 mb-2">{{ draft.name || 'Untitled Draft' }}</h4>
                    <p class="text-muted small mb-1">{{ formatDate(draft.lastModified) }}</p>
                    <p v-if="draft.starting_bid" class="text-muted small mb-0">Starting bid: £{{ draft.starting_bid }}
                    </p>
                  </div>
                  <div class="d-flex gap-2">
                    <button @click="loadDraft(draft)" type="button" class="btn btn-sm btn-primary">Load</button>
                    <button @click="deleteDraft(draft.id)" type="button" class="btn btn-sm btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Input from '../atoms/Input.vue'
import Button from '../atoms/Button.vue'
import { draftService } from '../../../services/draftService'
import { categoryService } from '../../../services/categoryService'

export default {
  name: 'CreateItemForm',
  components: { Input, Button },

  props: {
    loading: Boolean,
    error: String,
    showDraftControls: { type: Boolean, default: true }
  },

  emits: ['submit', 'draft-saved', 'draft-error'],

  data() {
    return {
      submitted: false,
      formData: {
        name: '',
        description: '',
        starting_bid: '',
        end_date: '',
        category_id: []
      },
      categories: [],
      loadingCategories: false,
      currentDraftId: null,
      showDraftModal: false,
      drafts: []
    }
  },

  computed: {
    minDateTime() {
      return new Date().toISOString().slice(0, 16)
    },

    endDateError() {
      if (!this.formData.end_date) return 'End date is required'
      if (new Date(this.formData.end_date) <= new Date()) return 'End date must be in the future'
      return ''
    }
  },

  mounted() {
    this.loadCategories()
    this.loadDrafts()
    if (this.$route.params.draftId) {
      this.loadSpecificDraft(this.$route.params.draftId)
    }
  },

  methods: {
    async loadCategories() {
      this.loadingCategories = true
      try {
        this.categories = await categoryService.getCategories()
      } catch (error) {
        this.$emit('draft-error', 'Failed to load categories')
      } finally {
        this.loadingCategories = false
      }
    },

    saveDraft() {
      try {
        const draftData = {
          id: this.currentDraftId,
          ...this.formData,
          isAutoSaved: false
        }

        const savedDraft = draftService.saveDraft(draftData)
        this.currentDraftId = savedDraft.id
        this.loadDrafts()

        this.$emit('draft-saved', 'Draft saved successfully')
      } catch (error) {
        this.$emit('draft-error', error.message)
      }
    },

    loadDrafts() {
      this.drafts = draftService.getDrafts()
    },

    loadDraft(draft) {
      this.formData = {
        name: draft.name || '',
        description: draft.description || '',
        starting_bid: draft.starting_bid || '',
        end_date: draft.end_date || '',
        category_id: draft.category_id || []
      }
      this.currentDraftId = draft.id
      this.showDraftModal = false
      this.submitted = false
    },

    loadSpecificDraft(draftId) {
      const draft = draftService.getDraft(draftId)
      if (draft) {
        this.loadDraft(draft)
      }
    },

    deleteDraft(draftId) {
      try {
        draftService.deleteDraft(draftId)
        this.loadDrafts()

        if (this.currentDraftId === draftId) {
          this.clearDraft()
        }

        this.$emit('draft-saved', 'Draft deleted successfully')
      } catch (error) {
        this.$emit('draft-error', error.message)
      }
    },

    clearDraft() {
      this.currentDraftId = null
      this.formData = {
        name: '',
        description: '',
        starting_bid: '',
        end_date: '',
        category_id: []
      }
      this.submitted = false
    },

    formatDate(dateString) {
      if (!dateString) return 'Unknown'
      return new Date(dateString).toLocaleString('en-GB')
    },

    handleSubmit() {
      this.submitted = true

      if (!this.formData.name || !this.formData.starting_bid || !this.formData.end_date || this.endDateError) {
        return
      }

      const itemData = {
        name: this.formData.name,
        description: this.formData.description,
        starting_bid: Number(this.formData.starting_bid),
        end_date: new Date(this.formData.end_date).getTime(),
        category_id: this.formData.category_id
      }

      if (this.currentDraftId) {
        draftService.deleteDraft(this.currentDraftId).catch(() => { })
      }

      this.$emit('submit', itemData)
    }
  }
}
</script>

<style scoped>
.category-checkbox {
  cursor: pointer;
  transition: all 0.2s;
}

.category-checkbox:hover {
  background-color: #f8f9fa;
  border-color: #d4af37 !important;
}

.category-checkbox input[type="checkbox"] {
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}
</style>
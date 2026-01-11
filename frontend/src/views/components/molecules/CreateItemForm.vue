<template>
  <div>
    <form @submit.prevent="handleSubmit" class="form-content">
      <h2>List Your Watch</h2>

      <div v-if="currentDraftId" class="draft-status">
        <span>Currently editing draft</span>
        <button @click="clearDraft" type="button" class="clear-draft">×</button>
      </div>

      <Input v-model="formData.name" label="Item Name" placeholder="Enter watch name"
        :error="submitted && !formData.name ? 'Item name is required' : ''" />

      <div class="form-group">
        <label>Description</label>
        <textarea v-model="formData.description" placeholder="Describe your watch" class="description-input"
          rows="4"></textarea>
      </div>

      <Input v-model="formData.starting_bid" type="number" label="Starting Bid" placeholder="0" min="0"
        :error="submitted && !formData.starting_bid ? 'Starting bid is required' : ''" />

      <div class="form-group">
        <label>Auction End Date</label>
        <input v-model="formData.end_date" type="datetime-local" class="form-input"
          :class="{ error: submitted && endDateError }" :min="minDateTime" />
        <div v-if="submitted && endDateError" class="error-text">{{ endDateError }}</div>
      </div>

      <div class="form-group">
        <label>Categories (Select at least one)</label>
        <div v-if="loadingCategories" class="loading-text">Loading categories...</div>
        <div v-else class="category-grid">
          <label v-for="category in categories" :key="category.category_id" class="category-checkbox">
            <input type="checkbox" :value="category.category_id" v-model="formData.category_id" />
            <span>{{ category.name }}</span>
          </label>
        </div>
        <div v-if="submitted && categoryError" class="error-text">{{ categoryError }}</div>
      </div>

      <div v-if="error" class="form-error">{{ error }}</div>

      <div class="form-submit">
        <Button type="submit" :text="loading ? 'Creating...' : 'Create Listing'" :disabled="loading" class="w-full" />
      </div>

      <div class="draft-controls" v-if="showDraftControls">
        <Button text="Save Draft" @click="saveDraft" :disabled="loading" class="w-full draft-btn" type="button" />
        <Button text="Load Draft" @click="showDraftModal = true" :disabled="loading" class="w-full draft-btn"
          type="button" />
      </div>
    </form>

    <div v-if="showDraftModal" class="modal-overlay" @click="showDraftModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Load Draft</h3>
          <button @click="showDraftModal = false" type="button" class="close-btn">×</button>
        </div>
        <div class="draft-list">
          <div v-if="drafts.length === 0" class="no-drafts">
            No drafts saved
          </div>
          <div v-for="draft in drafts" :key="draft.id" class="draft-item">
            <div class="draft-info">
              <h4>{{ draft.name || 'Untitled Draft' }}</h4>
              <p>{{ formatDate(draft.lastModified) }}</p>
              <p v-if="draft.starting_bid">Starting bid: ${{ draft.starting_bid }}</p>
            </div>
            <div class="draft-actions">
              <Button text="Load" @click="loadDraft(draft)" type="button" />
              <Button text="Delete" @click="deleteDraft(draft.id, $event)" class="danger" type="button" />
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
    components: {
      Input,
      Button
    },
    props: {
      loading: Boolean,
      error: String,
      showDraftControls: {
        type: Boolean,
        default: true
      }
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
      },
      categoryError() {
        if (!this.formData.category_id || this.formData.category_id.length === 0) {
          return 'Please select at least one category'
        }
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
            name: this.formData.name,
            description: this.formData.description,
            starting_bid: this.formData.starting_bid,
            end_date: this.formData.end_date,
            category_id: this.formData.category_id,
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
  
      deleteDraft(draftId, event) {
        if (event) {
          event.stopPropagation()
          event.preventDefault()
        }
  
        try {
          draftService.deleteDraft(draftId)
          this.loadDrafts()
  
          if (this.currentDraftId === draftId) {
            this.clearDraft()
          }
  
          this.$emit('draft-saved', 'Draft deleted successfully')
        } catch (error) {
          console.error('Error in deleteDraft:', error)
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
        return new Date(dateString).toLocaleString()
      },
  
      handleSubmit() {
        this.submitted = true
  
        if (!(this.formData.name && this.formData.starting_bid && this.formData.end_date) ||
          this.endDateError || this.categoryError) {
          return
        }
  
        const endDateTimestamp = new Date(this.formData.end_date).getTime()
  
        const itemData = {
          name: this.formData.name,
          description: this.formData.description,
          starting_bid: parseFloat(this.formData.starting_bid),
          end_date: endDateTimestamp,
          category_id: this.formData.category_id
        }
  
        if (this.currentDraftId) {
          try {
            draftService.deleteDraft(this.currentDraftId)
          } catch (error) {
            console.error('Failed to delete draft after submission:', error)
          }
        }
  
        this.$emit('submit', itemData)
      }
    }
  }
  </script>

<style scoped>
.draft-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  background: #e7f3ff;
  color: #0066cc;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 14px;
}

.clear-draft {
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  font-size: 18px;
  padding: 0;
}

.draft-controls {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.draft-btn {
  flex: 1;
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
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6c757d;
}

.draft-list {
  padding: 20px;
}

.no-drafts {
  text-align: center;
  color: #6c757d;
  padding: 20px;
}

.draft-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  margin-bottom: 10px;
}

.draft-info h4 {
  margin: 0 0 5px 0;
  color: #212529;
}

.draft-info p {
  margin: 2px 0;
  font-size: 14px;
  color: #6c757d;
}

.draft-actions {
  display: flex;
  gap: 8px;
}

.description-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #000000;
  border-radius: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
}

.description-input:focus {
  outline: none;
  border-color: #d4af37;
}

.loading-text {
  color: #6c757d;
  font-size: 14px;
  padding: 10px 0;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 10px;
}

.category-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 2px solid #000000;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.category-checkbox:hover {
  background-color: #f8f9fa;
  border-color: #d4af37;
}

.category-checkbox input[type="checkbox"] {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.category-checkbox span {
  font-size: 14px;
  user-select: none;
}

.error-text {
  color: #ff0000;
  font-size: 14px;
  margin-top: 6px;
}

.form-input.error {
  border-color: #ff0000;
}
</style>
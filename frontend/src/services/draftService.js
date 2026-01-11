class DraftService {
    constructor() {
      this.storageKey = 'item_drafts'
    }
  
    // Get all drafts from localStorage
    getDrafts() {
      try {
        const drafts = localStorage.getItem(this.storageKey)
        return drafts ? JSON.parse(drafts) : []
      } catch (error) {
        console.error('Error loading drafts:', error)
        return []
      }
    }
  
    // Save a draft
    saveDraft(draftData) {
      try {
        const drafts = this.getDrafts()
        const draftId = draftData.id || Date.now().toString()
        
        const draft = {
          id: draftId,
          ...draftData,
          lastModified: new Date().toISOString(),
          created: draftData.created || new Date().toISOString()
        }
  
        const existingIndex = drafts.findIndex(d => d.id === draftId)
        
        if (existingIndex >= 0) {
          drafts[existingIndex] = draft
        } else {
          drafts.push(draft)
        }
  
        localStorage.setItem(this.storageKey, JSON.stringify(drafts))
        return draft
      } catch (error) {
        console.error('Error saving draft:', error)
        throw new Error('Failed to save draft')
      }
    }
  
    // Get a specific draft by ID
    getDraft(id) {
      const drafts = this.getDrafts()
      return drafts.find(draft => draft.id === id)
    }
  
    // Delete a draft
    deleteDraft(id) {
      try {
        const drafts = this.getDrafts()
        const filteredDrafts = drafts.filter(draft => draft.id !== id)
        localStorage.setItem(this.storageKey, JSON.stringify(filteredDrafts))
        return true
      } catch (error) {
        console.error('Error deleting draft:', error)
        throw new Error('Failed to delete draft')
      }
    }
  
    // Clear all drafts
    clearAllDrafts() {
      try {
        localStorage.removeItem(this.storageKey)
        return true
      } catch (error) {
        console.error('Error clearing drafts:', error)
        throw new Error('Failed to clear drafts')
      }
    }
  
    // Auto-save functionality
    autoSave(formData, draftId = null) {
      // Only auto-save if there's meaningful content
      if (!formData.name && !formData.description && !formData.starting_bid && !formData.end_date) {
        return null
      }
  
      const draftData = {
        id: draftId,
        name: formData.name || '',
        description: formData.description || '',
        starting_bid: formData.starting_bid || '',
        end_date: formData.end_date || '',
        isAutoSaved: true
      }
  
      return this.saveDraft(draftData)
    }
  }
  
  export const draftService = new DraftService()
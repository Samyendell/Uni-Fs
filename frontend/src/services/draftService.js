class DraftService {
  constructor() {
    this.storageKey = 'item_drafts'
  }

  generateId() {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9)
  }

  getDrafts() {
    try {
      const drafts = localStorage.getItem(this.storageKey)
      return drafts ? JSON.parse(drafts) : []
    } catch (error) {
      console.error('Error loading drafts:', error)
      return []
    }
  }

  saveDraft(draftData) {
    try {
      const drafts = this.getDrafts()
      const now = new Date().toISOString()
      
      if (!draftData.id || draftData.id === null) {
        draftData.id = this.generateId()
      }
      
      const draft = {
        ...draftData,
        lastModified: now,
        created: draftData.created || now
      }

      const existingIndex = drafts.findIndex(d => d.id === draftData.id)
      
      if (existingIndex >= 0) {
        draft.created = drafts[existingIndex].created
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

  getDraft(id) {
    const drafts = this.getDrafts()
    return drafts.find(draft => draft.id === id)
  }

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

  clearAllDrafts() {
    try {
      localStorage.removeItem(this.storageKey)
      return true
    } catch (error) {
      console.error('Error clearing drafts:', error)
      throw new Error('Failed to clear drafts')
    }
  }
}

export const draftService = new DraftService()
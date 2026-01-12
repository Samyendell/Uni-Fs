<template>
  <div class="min-vh-100 gradient-backgroud py-4">
    <div class="container item-container-wrapper">
      <div v-if="loading" class="text-center py-5">
        <LoadingSpinner text="Loading item details..." />
      </div>

      <div v-else-if="error" class="alert alert-danger text-center mx-auto error-container">
        <p class="mb-0">{{ error }}</p>
      </div>

      <div v-else-if="item">
        <div class="mb-4">
          <Button text="← Back to Items" @click="goBack" />
        </div>

        <div class="text-center mb-5">
          <h1 class="display-4 fw-bold text-white">{{ item.name }}</h1>
        </div>

        <div class="row g-4 mb-4">
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm p-3">
              <img :src="getImageUrl(item.image)" :alt="item.name" class="img-fluid rounded" />
            </div>
          </div>

          <div class="col-lg-6">
            <div class="d-flex flex-column gap-3">
              <!-- Price Section -->
              <div class="card border-0 shadow-sm p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">Current Bid:</span>
                  <span class="fs-4 fw-bold text-warning">£{{ item.current_bid || item.starting_bid }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">Starting Price:</span>
                  <span class="fw-bold text-warning">£{{ item.starting_bid }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">Listed by:</span>
                  <span class="fw-semibold">{{ item.first_name + ' ' + item.last_name }}</span>
                </div>
              </div>

              <!-- Categories -->
              <div v-if="item.categories && item.categories.length > 0" class="card border-0 shadow-sm p-4">
                <h3 class="h5 fw-semibold mb-2">Categories</h3>
                <p class="text-muted mb-0">{{ getCategoryNames() }}</p>
              </div>

              <!-- Auction Status -->
              <div class="card border-0 shadow-sm p-4">
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">Started:</span>
                  <span class="small">{{ formatStartDate(item.start_date) }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <span class="text-muted">Ends:</span>
                  <span class="small">{{ formatEndDate(item.end_date) }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <span class="text-muted">Total Bids:</span>
                  <span class="fw-semibold">{{ bidHistory.length }}</span>
                </div>
              </div>

              <!-- Bidding Section -->
              <div v-if="isAuctionActive && isLoggedIn && !isOwnItem" class="card border-0 shadow-sm p-4">
                <h3 class="h5 fw-semibold mb-3">Place Your Bid</h3>
                <div class="d-flex flex-column gap-3">
                  <input 
                    type="number" 
                    v-model="newBid" 
                    :min="minimumBid" 
                    placeholder="Enter your bid amount"
                    class="form-control custom-input" 
                    :class="{ 'is-invalid': bidError }" 
                  />
                  <Button 
                    :text="bidLoading ? 'Placing Bid...' : 'Place Bid'" 
                    @click="placeBid" 
                    :disabled="bidLoading" 
                  />
                </div>
                <p class="text-muted small mb-0 mt-2">Minimum bid: £{{ minimumBid }}</p>
                <div v-if="bidError" class="alert alert-danger mt-3 mb-0">{{ bidError }}</div>
              </div>

              <div v-else-if="isAuctionActive && !isLoggedIn" class="card border-0 shadow-sm p-4 text-center">
                <p class="mb-0">Please <router-link to="/login" class="link-warning fw-semibold">log in</router-link> to place a bid</p>
              </div>

              <div v-else-if="isOwnItem" class="card border-0 shadow-sm p-4 text-center">
                <p class="mb-0 text-muted">This is your item - you cannot bid on it</p>
              </div>

              <div v-else class="card border-0 shadow-sm p-4 text-center">
                <p class="mb-0 text-muted">This auction has ended</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="card border-0 shadow-sm p-4 mb-4">
          <h3 class="h4 fw-semibold mb-3">Description</h3>
          <p class="mb-0">{{ item.description || 'No description provided' }}</p>
        </div>

        <!-- Bid History -->
        <div class="card border-0 shadow-sm p-4 mb-4">
          <h3 class="h4 fw-semibold mb-3">Bid History</h3>
          <div v-if="bidHistory.length === 0" class="text-center py-4">
            <p class="text-muted fst-italic mb-0">No bids yet. Be the first!</p>
          </div>
          <div v-else class="d-flex flex-column gap-2">
            <div 
              v-for="bid in bidHistory" 
              :key="bid.id" 
              class="d-flex justify-content-between align-items-center p-3 bg-light rounded border"
            >
              <span class="fw-bold text-success fs-5">£{{ bid.amount }}</span>
              <span class="text-muted small">{{ formatDateTime(bid.timestamp) }}</span>
              <span class="fw-semibold">{{ bid.first_name + ' ' + bid.last_name }}</span>
            </div>
          </div>
        </div>

        <!-- Questions Section -->
        <div class="card border-0 shadow-sm p-4 mb-4">
          <h3 class="h4 fw-semibold mb-4">Questions & Answers</h3>

          <!-- Ask Question Form -->
          <div v-if="isLoggedIn && !isOwnItem" class="mb-4 pb-4 border-bottom">
            <h4 class="h5 fw-semibold mb-3">Ask a Question</h4>
            <div class="d-flex flex-column gap-3">
              <textarea 
                v-model="newQuestion" 
                placeholder="Ask the seller a question about this item..."
                class="form-control custom-input" 
                rows="3" 
                :class="{ 'is-invalid': questionError }"
              ></textarea>
              <Button 
                :text="questionLoading ? 'Asking...' : 'Ask Question'" 
                @click="askQuestion"
                :disabled="questionLoading" 
              />
            </div>
            <div v-if="questionError" class="alert alert-danger mt-3 mb-0">{{ questionError }}</div>
          </div>

          <div v-if="questions.length === 0" class="text-center py-4">
            <p class="text-muted fst-italic mb-0">No questions yet. Be the first to ask!</p>
          </div>
          <div v-else class="d-flex flex-column gap-3">
            <div v-for="question in questions" :key="question.question_id" class="card border">
              <div class="card-header bg-light">
                <p class="fw-semibold mb-2">{{ question.question_text }}</p>
                <span class="text-muted small fw-semibold">Customer</span>
              </div>

              <div v-if="question.answer_text" class="card-body">
                <p class="mb-2">{{ question.answer_text }}</p>
                <span class="text-muted small fw-semibold">Seller</span>
              </div>

              <div v-else-if="isOwnItem" class="card-body bg-light">
                <div class="d-flex flex-column gap-3">
                  <textarea 
                    v-model="answerTexts[question.question_id]" 
                    placeholder="Answer this question..."
                    class="form-control custom-input" 
                    rows="2"
                    :class="{ 'is-invalid': answerErrors[question.question_id] }"
                  ></textarea>
                  <Button 
                    :text="answerLoading[question.question_id] ? 'Answering...' : 'Answer'"
                    @click="answerQuestion(question.question_id)" 
                    :disabled="answerLoading[question.question_id]" 
                  />
                  <div v-if="answerErrors[question.question_id]" class="alert alert-danger mb-0">
                    {{ answerErrors[question.question_id] }}
                  </div>
                </div>
              </div>

              <div v-else class="card-body bg-light text-center">
                <p class="text-muted fst-italic mb-0">Waiting for seller to respond...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h1 class="display-4 fw-bold text-white mb-3">Item Not Found</h1>
        <p class="text-white fs-5 mb-4">The item you're looking for doesn't exist or has been removed.</p>
        <Button text="Browse Items" @click="$router.push('/items')" />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import { questionService } from '../../services/questionService'
import Button from '../components/atoms/Button.vue'
import LoadingSpinner from '../components/atoms/LoadingSpinner.vue'

export default {
  name: 'SingleItem',
  components: {
    Button,
    LoadingSpinner
  },
  data() {
    return {
      item: null,
      bidHistory: [],
      questions: [],
      loading: true,
      error: null,
      newBid: '',
      bidLoading: false,
      bidError: '',
      newQuestion: '',
      questionLoading: false,
      questionError: '',
      answerTexts: {},
      answerLoading: {},
      answerErrors: {}
    }
  },
  computed: {
    itemId() {
      return this.$route.params.id
    },
    isLoggedIn() {
      return !!localStorage.getItem('session_token')
    },
    currentUserId() {
      return localStorage.getItem('user_id')
    },
    isOwnItem() {
      return this.item && this.currentUserId && this.item.creator_id === parseInt(this.currentUserId)
    },
    isAuctionActive() {
      if (!this.item || !this.item.end_date) return false
      const endTime = this.item.end_date
      return Date.now() < endTime
    },
    minimumBid() {
      if (!this.item) return 0
      const currentHighest = this.item.current_bid || this.item.starting_bid || 0
      return currentHighest + 1
    }
  },
  async created() {
    await this.loadItem()
    await this.loadBidHistory()
    await this.loadQuestions()
  },
  methods: {
    async loadItem() {
      this.loading = true
      this.error = null

      try {
        console.log('Loading item with ID:', this.itemId)
        this.item = await coreService.getSingleItem(this.itemId)
        console.log('Loaded item:', this.item)
      } catch (error) {
        console.error('Error loading item:', error)
        this.error = error || 'Failed to load item'
      } finally {
        this.loading = false
      }
    },

    async loadBidHistory() {
      try {
        this.bidHistory = await coreService.getBidHistory(this.itemId)
      } catch (error) {
        console.error('Failed to load bid history:', error)
        this.bidHistory = []
      }
    },

    async loadQuestions() {
      try {
        this.questions = await questionService.getQuestions(this.itemId)
      } catch (error) {
        console.error('Failed to load questions:', error)
        this.questions = []
      }
    },

    async placeBid() {
      this.bidError = ''

      if (!this.newBid || this.newBid === '') {
        this.bidError = 'Please enter a bid amount'
        return
      }

      const bidAmount = parseFloat(this.newBid)
      if (isNaN(bidAmount) || bidAmount <= 0) {
        this.bidError = 'Please enter a valid bid amount'
        return
      }

      if (bidAmount < this.minimumBid) {
        this.bidError = `Minimum bid is £${this.minimumBid}`
        return
      }

      this.bidLoading = true

      try {
        const bidResponse = await coreService.placeBid(this.itemId, { amount: bidAmount })

        this.item.current_bid = bidAmount

        const currentUserId = parseInt(this.currentUserId)
        const newBid = {
          id: Date.now(),
          amount: bidAmount,
          timestamp: Date.now(),
          first_name: 'You',
          last_name: '',
          user_id: currentUserId
        }

        this.bidHistory.unshift(newBid)

        this.newBid = ''
        this.bidError = ''

      } catch (error) {
        console.error('Failed to place bid:', error)
        this.bidError = error || 'Failed to place bid'
      } finally {
        this.bidLoading = false
      }
    },

    async askQuestion() {
      this.questionError = ''

      if (!this.newQuestion || !this.newQuestion.trim()) {
        this.questionError = 'Please enter a question'
        return
      }

      if (this.newQuestion.trim().length < 5) {
        this.questionError = 'Question must be at least 5 characters long'
        return
      }

      this.questionLoading = true

      try {
        await questionService.askQuestion(this.itemId, { question_text: this.newQuestion.trim() })
        await this.loadQuestions()
        this.newQuestion = ''
        this.questionError = ''
      } catch (error) {
        console.error('Failed to ask question:', error)
        this.questionError = error || 'Failed to ask question'
      } finally {
        this.questionLoading = false
      }
    },

    async answerQuestion(questionId) {
      this.answerErrors = { ...this.answerErrors, [questionId]: '' }
      const answerText = this.answerTexts[questionId]

      if (!answerText || !answerText.trim()) {
        this.answerErrors = { ...this.answerErrors, [questionId]: 'Please enter an answer' }
        return
      }

      if (answerText.trim().length < 3) {
        this.answerErrors = { ...this.answerErrors, [questionId]: 'Answer must be at least 3 characters long' }
        return
      }

      this.answerLoading = { ...this.answerLoading, [questionId]: true }

      try {
        await questionService.answerQuestion(questionId, { answer_text: answerText.trim() })
        await this.loadQuestions()
        this.answerTexts = { ...this.answerTexts, [questionId]: '' }
        this.answerErrors = { ...this.answerErrors, [questionId]: '' }
      } catch (error) {
        console.error('Failed to answer question:', error)
        this.answerErrors = { ...this.answerErrors, [questionId]: error || 'Failed to answer question' }
      } finally {
        this.answerLoading = { ...this.answerLoading, [questionId]: false }
      }
    },

    goBack() {
      this.$router.push('/items')
    },

    getImageUrl(imagePath) {
      if (!imagePath) return '/placeholder-watch.jpg'
      if (imagePath.startsWith('http')) return imagePath
      return `${process.env.VUE_APP_BASE_URL || ''}${imagePath}`
    },

    formatStartDate(timestamp) {
      if (!timestamp) return 'Unknown start date'
      const date = new Date(timestamp)

      const ukDateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/London'
      }

      const ukTimeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/London'
      }

      const ukDate = date.toLocaleDateString('en-GB', ukDateOptions)
      const ukTime = date.toLocaleTimeString('en-GB', ukTimeOptions)

      return `${ukDate} at ${ukTime}`
    },

    formatEndDate(timestamp) {
      if (!timestamp) return 'No end date'
      const date = new Date(timestamp)

      const ukDateOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        timeZone: 'Europe/London'
      }

      const ukTimeOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/London'
      }

      const ukDate = date.toLocaleDateString('en-GB', ukDateOptions)
      const ukTime = date.toLocaleTimeString('en-GB', ukTimeOptions)

      return `${ukDate} at ${ukTime}`
    },

    formatDateTime(timestamp) {
      if (!timestamp) return 'Unknown'
      const date = new Date(timestamp)

      const ukOptions = {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Europe/London'
      }

      return date.toLocaleString('en-GB', ukOptions)
    },
    
    getCategoryNames() {
      if (!this.item.categories || this.item.categories.length === 0) return ''
      return this.item.categories.map(cat => cat.name).join(', ')
    }
  }
}
</script>

<style scoped>
  .item-container-wrapper {
    max-width: 1200px;
  }
  
  .error-container {
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
  </style>
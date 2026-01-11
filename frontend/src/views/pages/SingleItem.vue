<template>
  <div class="items-page">
    <div class="items-container">
      <div v-if="loading" class="loading">
        <div class="spinner"></div>
        <p>Loading item details...</p>
      </div>

      <div v-else-if="error" class="error">
        <p>{{ error }}</p>
      </div>

      <div v-else-if="item" class="item-container">
        <!-- Back Button -->
        <div class="back-section">
          <Button text="Back to Items" @click="goBack" />
        </div>

        <!-- Item Header -->
        <div class="item-header">
          <h1 class="page-title">{{ item.name }}</h1>
        </div>

        <!-- Main Content Grid -->
        <div class="item-content">
          <!-- Image Section -->
          <div class="item-image custom-card">
            <img :src="getImageUrl(item.image)" :alt="item.name" />
          </div>

          <!-- Item Details -->
          <div class="item-details">
            <div class="price-section custom-card">
              <div class="current-bid">
                <span class="label">Current Bid:</span>
                <span class="amount">£{{ item.current_bid || item.starting_bid }}</span>
              </div>
              <div class="starting-price">
                <span class="label">Starting Price:</span>
                <span class="amount">£{{ item.starting_bid }}</span>
              </div>
              <div class="seller-info">
                <span class="label">Listed by:</span>
                <span class="seller-name">{{ item.first_name + ' ' + item.last_name }}</span>
              </div>
            </div>

            <!-- Auction Status -->
            <div class="auction-status custom-card">
              <div class="time-started">
                <span class="label">Started:</span>
                <span class="time">{{ formatStartDate(item.start_date) }}</span>
              </div>
              <div class="time-remaining">
                <span class="label">Ends:</span>
                <span class="time">{{ formatEndDate(item.end_date) }}</span>
              </div>
              <div class="total-bids">
                <span class="label">Total Bids:</span>
                <span class="count">{{ bidHistory.length }}</span>
              </div>
            </div>

            <!-- Bidding Section -->
            <div class="bidding-section custom-card" v-if="isAuctionActive && isLoggedIn && !isOwnItem">
              <h3>Place Your Bid</h3>
              <div class="bid-form">
                <input type="number" v-model="newBid" :min="minimumBid" placeholder="Enter your bid amount"
                  class="form-input" :class="{ 'input-error': bidError }" />
                <Button :text="bidLoading ? 'Placing Bid...' : 'Place Bid'" @click="placeBid" :disabled="bidLoading" />
              </div>
              <p class="min-bid-note">Minimum bid: £{{ minimumBid }}</p>
              <div v-if="bidError" class="error-message">{{ bidError }}</div>
            </div>

            <!-- Status Messages -->
            <div v-else-if="isAuctionActive && !isLoggedIn" class="status-message custom-card">
              <p>Please <router-link to="/login" class="login-link">log in</router-link> to place a bid</p>
            </div>

            <div v-else-if="isOwnItem" class="status-message custom-card">
              <p>This is your item - you cannot bid on it</p>
            </div>

            <div v-else class="status-message custom-card">
              <p>This auction has ended</p>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="item-description custom-card">
          <h3>Description</h3>
          <p>{{ item.description || 'No description provided' }}</p>
        </div>

        <!-- Bid History -->
        <div class="bid-history custom-card">
          <h3>Bid History</h3>
          <div v-if="bidHistory.length === 0" class="no-bids">
            <p>No bids yet. Be the first!</p>
          </div>
          <div v-else class="bid-list">
            <div v-for="bid in bidHistory" :key="bid.id" class="bid-item">
              <span class="bid-amount">£{{ bid.amount }}</span>
              <span class="bid-time">{{ formatDateTime(bid.timestamp) }}</span>
              <span class="bidder">{{ bid.first_name + ' ' + bid.last_name }}</span>
            </div>
          </div>
        </div>

        <!-- Questions Section -->
        <div class="questions-section custom-card">
          <h3>Questions & Answers</h3>

          <!-- Ask Question Form (only if logged in and not own item) -->
          <div v-if="isLoggedIn && !isOwnItem" class="ask-question-form">
            <h4>Ask a Question</h4>
            <div class="question-form">
              <textarea v-model="newQuestion" placeholder="Ask the seller a question about this item..."
                class="form-input question-textarea" rows="3" :class="{ 'input-error': questionError }"></textarea>
              <Button :text="questionLoading ? 'Asking...' : 'Ask Question'" @click="askQuestion"
                :disabled="questionLoading" />
            </div>
            <div v-if="questionError" class="error-message">{{ questionError }}</div>
          </div>

          <div v-if="questions.length === 0" class="no-questions">
            <p>No questions yet. Be the first to ask!</p>
          </div>
          <div v-else class="questions-list">
            <div v-for="question in questions" :key="question.question_id" class="question-item">
              <!-- Question -->
              <div class="question">
                <p class="question-text">{{ question.question_text }}</p>
                <div class="question-meta">
                  <span class="questioner">Customer</span>
                </div>
              </div>

              <!-- Answer -->
              <div v-if="question.answer_text" class="answer">
                <p class="answer-text">{{ question.answer_text }}</p>
                <div class="answer-meta">
                  <span class="answerer">Seller</span>
                </div>
              </div>

              <!-- Answer Form (only for item owner) -->
              <div v-else-if="isOwnItem" class="answer-form">
                <textarea v-model="answerTexts[question.question_id]" placeholder="Answer this question..."
                  class="form-input answer-textarea" rows="2"
                  :class="{ 'input-error': answerErrors[question.question_id] }"></textarea>
                <Button :text="answerLoading[question.question_id] ? 'Answering...' : 'Answer'"
                  @click="answerQuestion(question.question_id)" :disabled="answerLoading[question.question_id]" />
                <div v-if="answerErrors[question.question_id]" class="error-message">{{
                  answerErrors[question.question_id] }}</div>
              </div>

              <!-- No Answer Yet -->
              <div v-else class="no-answer">
                <p>Waiting for seller to respond...</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else class="not-found">
        <h1 class="page-title">Item Not Found</h1>
        <p>The item you're looking for doesn't exist or has been removed.</p>
        <Button text="Browse Items" @click="$router.push('/items')" />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import { questionService } from '../../services/questionService'
import Button from '../components/atoms/Button.vue'

export default {
  name: 'SingleItem',
  components: {
    Button
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

        // Update item data locally instead of reloading
        this.item.current_bid = bidAmount

        // Add new bid to history locally
        const currentUserId = parseInt(this.currentUserId)
        const newBid = {
          id: Date.now(), // temporary ID
          amount: bidAmount,
          timestamp: Date.now(),
          first_name: 'You', // or get from user data
          last_name: '',
          user_id: currentUserId
        }

        // Add to beginning of bid history (most recent first)
        this.bidHistory.unshift(newBid)

        // Clear form
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
    }
  }
}
</script>

<style scoped>
.bid-form,
.question-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1rem 0;
}

.answer-form {
  padding: 1.5rem;
  background: #f8f9fa;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.question-textarea,
.answer-textarea {
  width: 100%;
  resize: vertical;
  min-height: 80px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.75rem;
  font-family: inherit;
  font-size: 0.9rem;
}

.question-textarea:focus,
.answer-textarea:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

.error-message {
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
}

.input-error {
  border-color: #dc3545 !important;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.2) !important;
}

.back-section {
  margin-bottom: 2rem;
}

.item-header {
  text-align: center;
  margin-bottom: 3rem;
}

.item-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.item-image {
  padding: 1rem;
}

.item-image img {
  width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.item-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.price-section,
.auction-status,
.bidding-section,
.status-message,
.questions-section {
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.current-bid,
.starting-price,
.seller-info,
.time-started,
.time-remaining,
.total-bids {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.current-bid:last-child,
.starting-price:last-child,
.seller-info:last-child,
.time-started:last-child,
.time-remaining:last-child,
.total-bids:last-child {
  margin-bottom: 0;
}

.current-bid {
  font-size: 1.25rem;
  font-weight: 700;
}

.amount {
  color: #d4af37;
  font-weight: 700;
}

.seller-name {
  color: #2c3e50;
  font-weight: 600;
}

.min-bid-note {
  font-size: 0.875rem;
  color: #6c757d;
  margin: 0;
}

.status-message {
  text-align: center;
  color: #6c757d;
}

.login-link {
  color: #d4af37;
  text-decoration: none;
  font-weight: 600;
}

.login-link:hover {
  text-decoration: underline;
}

.item-description,
.bid-history,
.questions-section {
  background: white;
  padding: 2rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-description h3,
.bid-history h3,
.questions-section h3 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
}

.ask-question-form {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;
}

.ask-question-form h4 {
  color: #2c3e50;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  font-weight: 600;
}

.no-bids,
.no-questions {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-style: italic;
}

.bid-list,
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.bid-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.question-item {
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  background: #fff;
}

.question {
  background: #f8f9fa;
  padding: 1.5rem;
  border-bottom: 1px solid #e9ecef;
}

.question-text {
  margin: 0 0 0.75rem 0;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
  line-height: 1.5;
}

.question-meta,
.answer-meta {
  font-size: 0.875rem;
  color: #6c757d;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.questioner,
.answerer {
  font-weight: 600;
}

.answer {
  padding: 1.5rem;
  background: #fff;
}

.answer-text {
  margin: 0 0 0.75rem 0;
  color: #495057;
  font-size: 0.95rem;
  line-height: 1.5;
}

.no-answer {
  padding: 1.5rem;
  text-align: center;
  color: #6c757d;
  font-style: italic;
  background: #f8f9fa;
}

.bid-amount {
  font-weight: 700;
  color: #28a745;
  font-size: 1.1rem;
}

.bid-time {
  color: #6c757d;
  font-size: 0.875rem;
}

.bidder {
  font-weight: 600;
  color: #495057;
}

.not-found {
  text-align: center;
  padding: 4rem 2rem;
}

.loading {
  text-align: center;
  padding: 4rem 2rem;
}

.spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #d4af37;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.error {
  text-align: center;
  padding: 2rem;
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 8px;
  margin: 2rem 0;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-input:focus {
  outline: none;
  border-color: #d4af37;
  box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2);
}

@media (max-width: 768px) {
  .item-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .bid-item {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 0.5rem;
  }

  .question-meta,
  .answer-meta {
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-start;
  }

  .price-section,
  .auction-status,
  .bidding-section,
  .status-message,
  .questions-section,
  .item-description,
  .bid-history {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .item-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .price-section,
  .auction-status,
  .bidding-section,
  .status-message,
  .questions-section,
  .item-description,
  .bid-history {
    padding: 1rem;
  }

  .current-bid,
  .starting-price,
  .seller-info,
  .time-started,
  .time-remaining,
  .total-bids {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
<template>
  <div class="min-vh-100 gradient-backgroud py-4">
    <div class="container item-container-wrapper">
      <LoadingSpinner v-if="loading" text="Loading item details..." class="text-center py-5" />

      <div v-else-if="error" class="alert alert-danger text-center mx-auto error-container">
        {{ error }}
      </div>

      <div v-else-if="item">
        <Button text="Back to Items" @click="$router.push('/items')" class="mb-4" />

        <h1 class="display-4 fw-bold text-white text-center mb-5">{{ item.name }}</h1>

        <div class="row g-4 mb-4">
          <div class="col-lg-6">
            <div class="card border-0 shadow-sm p-3 h-100">
              <img src="/placeholder-watch.jpg" :alt="item.name" class="img-fluid rounded h-100"
                style="object-fit: cover;" />
            </div>
          </div>

          <div class="col-lg-6 d-flex flex-column gap-3">
            <div class="card border-0 shadow-sm p-4">
              <div class="d-flex justify-content-between align-items-center p-3 bg-light rounded border mb-2">
                <span class="text-muted">Current Bid:</span>
                <span class="fs-4 fw-bold text-warning">£{{ item.current_bid }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Starting Price:</span>
                <span class="fw-bold text-warning">£{{ item.starting_bid }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted">Listed by:</span>
                <span class="fw-semibold">{{ item.first_name }} {{ item.last_name }}</span>
              </div>
            </div>

            <div v-if="item.categories?.length" class="card border-0 shadow-sm p-4">
              <h3 class="h5 fw-semibold mb-2">Categories</h3>
              <p class="text-muted mb-0">{{item.categories.map(c => c.name).join(', ')}}</p>
            </div>

            <div class="card border-0 shadow-sm p-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Started:</span>
                <span class="small">{{ formatDate(item.start_date) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Ends:</span>
                <span class="small">{{ formatDate(item.end_date) }}</span>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <span class="text-muted">Total Bids:</span>
                <span class="fw-semibold">{{ bidHistory.length }}</span>
              </div>
            </div>

            <div v-if="canBid" class="card border-0 shadow-sm p-4">
              <h3 class="h5 fw-semibold mb-3">Place Your Bid</h3>
              <Input v-model.number="newBid" type="number" :min="minimumBid" placeholder="Enter your bid amount"
                :error="bidError" />
              <Button :text="bidLoading ? 'Placing Bid...' : 'Place Bid'" @click="placeBid" :disabled="bidLoading" />
              <p class="text-muted small mb-0 mt-2">Minimum bid: £{{ minimumBid }}</p>
            </div>

            <div v-else-if="!isLoggedIn && isAuctionActive" class="card border-0 shadow-sm p-4 text-center">
              Please <router-link to="/login" class="link-warning fw-semibold">log in</router-link> to place a bid
            </div>
            <div v-else-if="isOwnItem" class="card border-0 shadow-sm p-4 text-center text-muted">
              This is your item - you cannot bid on it
            </div>
            <div v-else class="card border-0 shadow-sm p-4 text-center text-muted">
              This auction has ended
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm p-4 mb-4">
          <h3 class="h4 fw-semibold mb-3">Description</h3>
          <p class="mb-0">{{ item.description || 'No description provided' }}</p>
        </div>

        <div class="card border-0 shadow-sm p-4 mb-4">
          <h3 class="h4 fw-semibold mb-3">Bid History</h3>
          <p v-if="!bidHistory.length" class="text-center py-4 text-muted fst-italic mb-0">
            There are no bids on this item
          </p>
          <div v-else class="overflow-auto" style="max-height: 400px;">
            <div v-for="bid in bidHistory" :key="bid.id"
              class="d-flex justify-content-between align-items-center p-3 bg-light rounded border">
              <span class="fw-bold text-success fs-5">£{{ bid.amount }}</span>
              <span class="text-muted small">{{ formatDate(bid.timestamp) }}</span>
              <span class="fw-semibold">{{ bid.first_name }} {{ bid.last_name }}</span>
            </div>
          </div>
        </div>

        <div class="card border-0 shadow-sm p-4 mb-4">
          <h3 class="h4 fw-semibold mb-4">Questions & Answers</h3>

          <div v-if="isLoggedIn && !isOwnItem" class="mb-4 pb-4 border-bottom">
            <h4 class="h5 fw-semibold mb-3">Ask a Question</h4>
            <textarea v-model="newQuestion" placeholder="Ask the seller a question about this item..."
              class="form-control custom-input mb-3" rows="3" :class="{ 'is-invalid': questionError }" />
            <Button :text="questionLoading ? 'Asking...' : 'Ask Question'" @click="askQuestion"
              :disabled="questionLoading" />
            <div v-if="questionError" class="alert alert-danger mt-3 mb-0">{{ questionError }}</div>
          </div>

          <p v-if="!questions.length" class="text-center py-4 text-muted fst-italic mb-0">
            There are no questions on this item
          </p>
          <div v-else class="d-flex flex-column gap-3">
            <div v-for="question in questions" :key="question.question_id" class="card border">
              <div class="card-header bg-light">
                <p class="fw-semibold mb-2">{{ question.question_text }}</p>
                <span class="text-muted small fw-semibold">Buyer</span>
              </div>

              <div v-if="question.answer_text" class="card-body">
                <p class="mb-2">{{ question.answer_text }}</p>
                <span class="text-muted small fw-semibold">Seller</span>
              </div>

              <div v-else-if="isOwnItem" class="card-body bg-light">
                <textarea v-model="answerTexts[question.question_id]" placeholder="Answer this question..."
                  class="form-control custom-input mb-3" rows="2"
                  :class="{ 'is-invalid': answerErrors[question.question_id] }" />
                <Button :text="answerLoading[question.question_id] ? 'Answering...' : 'Answer'"
                  @click="answerQuestion(question.question_id)" :disabled="answerLoading[question.question_id]" />
                <div v-if="answerErrors[question.question_id]" class="alert alert-danger mt-3 mb-0">
                  {{ answerErrors[question.question_id] }}
                </div>
              </div>

              <div v-else class="card-body bg-light text-center text-muted fst-italic">
                Waiting for seller to respond
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-5">
        <h1 class="display-4 fw-bold text-white mb-3">Item Not Found</h1>
        <p class="text-white fs-5 mb-4">This item doesn't exist</p>
        <Button text="Browse Items" @click="$router.push('/items')" />
      </div>
    </div>
  </div>
</template>

<script>
import { coreService } from '../../services/coreService'
import { questionService } from '../../services/questionService'
import Button from '../components/atoms/Button.vue'
import Input from '../components/atoms/Input.vue'
import LoadingSpinner from '../components/atoms/LoadingSpinner.vue'

export default {
  name: 'SingleItem',
  components: { Button, Input, LoadingSpinner },

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
      return this.item?.end_date && Date.now() < this.item.end_date
    },

    canBid() {
      return this.isAuctionActive && this.isLoggedIn && !this.isOwnItem
    },

    minimumBid() {
      if (!this.item) return 0
      return this.item.current_bid + 1
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
        this.item = await coreService.getSingleItem(this.itemId)
      } catch (error) {
        this.error = error || 'Failed to load item'
      } finally {
        this.loading = false
      }
    },

    async loadBidHistory() {
      try {
        this.bidHistory = await coreService.getBidHistory(this.itemId)
      } catch {
        this.bidHistory = []
      }
    },

    async loadQuestions() {
      try {
        this.questions = await questionService.getQuestions(this.itemId)
      } catch {
        this.questions = []
      }
    },

    async placeBid() {
      this.bidError = ''

      if (!this.newBid) {
        this.bidError = 'Please enter a bid amount'
        return
      }

      if (this.newBid < this.minimumBid) {
        this.bidError = `Minimum bid is £${this.minimumBid}`
        return
      }

      this.bidLoading = true
      try {
        await coreService.placeBid(this.itemId, { amount: this.newBid })

        await this.loadItem()
        await this.loadBidHistory()

        this.newBid = ''
      } catch (error) {
        this.bidError = error || 'Failed to place bid'
      } finally {
        this.bidLoading = false
      }
    },

    async askQuestion() {
      const trimmed = this.newQuestion?.trim()
      this.questionError = ''

      if (!trimmed) {
        this.questionError = 'Please enter a question'
        return
      }

      if (trimmed.length < 5) {
        this.questionError = 'Question must be at least 5 characters long'
        return
      }

      this.questionLoading = true
      try {
        await questionService.askQuestion(this.itemId, { question_text: trimmed })
        await this.loadQuestions()
        this.newQuestion = ''
      } catch (error) {
        this.questionError = error || 'Failed to ask question'
      } finally {
        this.questionLoading = false
      }
    },

    async answerQuestion(questionId) {
      const trimmed = this.answerTexts[questionId]?.trim()
      this.answerErrors = { ...this.answerErrors, [questionId]: '' }

      if (!trimmed) {
        this.answerErrors[questionId] = 'Please enter an answer'
        return
      }

      if (trimmed.length < 3) {
        this.answerErrors[questionId] = 'Answer must be at least 3 characters long'
        return
      }

      this.answerLoading = { ...this.answerLoading, [questionId]: true }
      try {
        await questionService.answerQuestion(questionId, { answer_text: trimmed })
        await this.loadQuestions()
        this.answerTexts[questionId] = ''
      } catch (error) {
        this.answerErrors[questionId] = error || 'Failed to answer question'
      } finally {
        this.answerLoading[questionId] = false
      }
    },

    formatDate(timestamp) {
      if (!timestamp) return 'Unknown'
      return new Date(timestamp).toLocaleString('en-GB')
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
}
</style>
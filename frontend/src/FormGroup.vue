<!-- <template>
    <div class="form-group">
      <label v-if="label" :for="inputId" class="form-label">
        {{ label }}
        <span v-if="required" class="required-asterisk">*</span>
      </label>
      
      <input 
        v-if="type !== 'textarea' && type !== 'select'"
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />
      
      <textarea 
        v-else-if="type === 'textarea'"
        :id="inputId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      ></textarea>
      
      <select 
        v-else-if="type === 'select'"
        :id="inputId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @change="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      >
        <option value="" disabled>{{ placeholder }}</option>
        <option 
          v-for="option in options" 
          :key="option.value" 
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
      
      <div v-if="error" class="form-error">{{ error }}</div>
      <div v-if="hint" class="form-hint">{{ hint }}</div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormGroup',
    props: {
      inputId: {
        type: String,
        required: true
      },
      label: String,
      type: {
        type: String,
        default: 'text'
      },
      modelValue: {
        type: [String, Number],
        default: ''
      },
      placeholder: String,
      disabled: {
        type: Boolean,
        default: false
      },
      required: {
        type: Boolean,
        default: false
      },
      error: String,
      hint: String,
      rows: {
        type: Number,
        default: 4
      },
      options: {
        type: Array,
        default: () => []
      }
    },
    emits: ['update:modelValue', 'blur', 'focus'],
    computed: {
      inputClasses() {
        return [
          'form-input',
          {
            'form-input-error': !!this.error,
            'form-input-disabled': this.disabled
          }
        ]
      }
    }
  }
  </script>
  
  <style scoped>
  .form-group {
    margin-bottom: 1.5rem;
  }
  
  .form-label {
    display: block;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
  
  .required-asterisk {
    color: #d63384;
    margin-left: 0.25rem;
  }
  
  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 2px solid #e1e8ed;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    box-sizing: border-box;
    font-family: inherit;
  }
  
  .form-input:focus {
    outline: none;
    border-color: #f4d03f;
  }
  
  .form-input-error {
    border-color: #d63384;
  }
  
  .form-input-disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.7;
  }
  
  .form-error {
    color: #d63384;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  .form-hint {
    color: #6c757d;
    font-size: 0.8rem;
    margin-top: 0.25rem;
  }
  
  select.form-input {
    cursor: pointer;
  }
  
  textarea.form-input {
    resize: vertical;
  }
  </style> -->
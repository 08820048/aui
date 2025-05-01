<script setup>
import { ref, onMounted, watch } from 'vue';
import StyleCard from './StyleCard.vue';
import { styleOptions, getDefaultStyle } from '../../config/styles';

const props = defineProps({
  styles: {
    type: Array,
    default: () => styleOptions
  },
  modelValue: {
    type: [String, Object],
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// 当前选中的风格
const selectedStyle = ref(null);

// 自定义风格 ID
const customStyleId = ref('');

/**
 * 选择风格
 * @param {Object} style 选中的风格对象
 */
const selectStyle = (style) => {
  selectedStyle.value = style;
  customStyleId.value = ''; // 清空自定义输入
  emit('update:modelValue', style.id);
  emit('change', style);
};

/**
 * 处理自定义风格 ID 输入
 */
const handleCustomStyleInput = () => {
  if (customStyleId.value.trim()) {
    // 如果有自定义输入，则使用该值作为风格 ID
    selectedStyle.value = null; // 清除已选风格
    emit('update:modelValue', customStyleId.value.trim());
    emit('change', { id: customStyleId.value.trim(), name: '自定义风格' });
  } else if (selectedStyle.value) {
    // 如果清空了自定义输入但有选中的风格，则使用选中的风格
    emit('update:modelValue', selectedStyle.value.id);
    emit('change', selectedStyle.value);
  }
};

/**
 * 初始化默认选中的风格
 */
const initDefaultStyle = () => {
  // 如果有传入的modelValue，则使用它
  if (props.modelValue) {
    const styleId = typeof props.modelValue === 'string' ? props.modelValue : props.modelValue.id;
    const style = props.styles.find(s => s.id === styleId);
    if (style) {
      selectedStyle.value = style;
      return;
    }
  }

  // 否则使用配置中标记为默认的风格
  const defaultStyle = props.styles.find(style => style.isDefault);
  if (defaultStyle) {
    selectedStyle.value = defaultStyle;
    emit('update:modelValue', defaultStyle.id);
    emit('change', defaultStyle);
  } else if (props.styles.length > 0) {
    // 如果没有默认风格，则使用第一个
    selectedStyle.value = props.styles[0];
    emit('update:modelValue', props.styles[0].id);
    emit('change', props.styles[0]);
  }
};

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    const styleId = typeof newValue === 'string' ? newValue : newValue.id;
    const style = props.styles.find(s => s.id === styleId);
    if (style && (!selectedStyle.value || selectedStyle.value.id !== style.id)) {
      selectedStyle.value = style;
    }
  }
});

// 组件挂载时初始化
onMounted(initDefaultStyle);
</script>

<template>
  <div class="style-selector">
    <!-- 添加测试用的唯一标识符输入框 -->
    <div class="custom-style-input">
      <label for="customStyleId">测试用唯一标识符：</label>
      <input
        id="customStyleId"
        v-model="customStyleId"
        type="text"
        placeholder="例如：3477a7ee-25d8-11f0-9e00-f7073c18c697"
        @input="handleCustomStyleInput"
        class="custom-style-input-field"
      />
    </div>

    <div class="style-selector-container">
      <StyleCard
        v-for="style in styles"
        :key="style.id"
        :style="style"
        :isSelected="selectedStyle && selectedStyle.id === style.id"
        @select="selectStyle"
      />
    </div>
  </div>
</template>

<style scoped>
.style-selector {
  width: 100%;
  overflow: hidden;
  padding: 1rem 0;
}

/* 自定义风格输入框样式 */
.custom-style-input {
  margin-bottom: 1.5rem;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.custom-style-input label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--neu-text-color);
}

.custom-style-input-field {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--neu-border-color);
  background-color: var(--neu-background);
  color: var(--neu-text-color);
  font-size: 0.9rem;
  width: 100%;
  box-shadow: inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
  transition: all 0.3s ease;
}

.custom-style-input-field:focus {
  outline: none;
  border-color: var(--neu-primary-color);
  box-shadow: 0 0 0 2px rgba(var(--neu-primary-color-rgb), 0.2), inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
}

.custom-style-input-field::placeholder {
  color: rgba(var(--neu-text-color), 0.5);
  opacity: 0.7;
}

.style-selector-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 1.25rem;
  padding: 0.5rem 0.25rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: var(--neu-primary-color) transparent;
}

.style-selector-container::-webkit-scrollbar {
  height: 6px;
}

.style-selector-container::-webkit-scrollbar-track {
  background: transparent;
}

.style-selector-container::-webkit-scrollbar-thumb {
  background-color: var(--neu-primary-color);
  border-radius: 20px;
}

@media (max-width: 768px) {
  .style-selector-container {
    padding-bottom: 1rem;
  }
}

@media (min-width: 768px) {
  .style-selector-container {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>

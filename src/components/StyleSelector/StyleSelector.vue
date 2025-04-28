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

/**
 * 选择风格
 * @param {Object} style 选中的风格对象
 */
const selectStyle = (style) => {
  selectedStyle.value = style;
  emit('update:modelValue', style.id);
  emit('change', style);
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

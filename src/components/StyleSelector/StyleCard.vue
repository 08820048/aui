<script setup>
import { computed } from 'vue';
import StyleIcon from './StyleIcon.vue';

const props = defineProps({
  style: {
    type: Object,
    required: true
  },
  isSelected: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['select']);

/**
 * 选择当前风格
 */
const selectStyle = () => {
  emit('select', props.style);
};

/**
 * 计算卡片的类名
 */
const cardClasses = computed(() => {
  return {
    'style-card': true,
    'style-card-selected': props.isSelected
  };
});
</script>

<template>
  <div 
    :class="cardClasses"
    @click="selectStyle"
  >
    <div class="style-card-icon">
      <StyleIcon :icon="style.previewIcon" size="36px" />
    </div>
    <div class="style-card-content">
      <h3 class="style-card-title">{{ style.name }}</h3>
      <p class="style-card-description">{{ style.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.style-card {
  width: 180px;
  padding: 1.25rem;
  border-radius: 0.75rem;
  background-color: var(--neu-background);
  box-shadow: 3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light);
  border: 1px solid var(--neu-border-color);
  transition: all 0.3s ease;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.style-card:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 5px 5px 10px var(--neu-shadow-dark), -5px -5px 10px var(--neu-shadow-light);
}

.style-card-selected {
  border: 2px solid var(--neu-primary-color);
  box-shadow: 0 0 15px var(--neu-primary-color);
}

.style-card-icon {
  margin-bottom: 1rem;
  color: var(--neu-primary-color);
  background-color: rgba(var(--neu-primary-color-rgb), 0.1);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.style-card:hover .style-card-icon {
  transform: scale(1.1);
}

.style-card-content {
  width: 100%;
}

.style-card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--neu-text-color);
}

.style-card-description {
  font-size: 0.875rem;
  color: var(--neu-text-color);
  opacity: 0.8;
}

/* 未来流光主题下的特殊样式 */
.theme-future-glow .style-card-selected {
  border: 2px solid transparent;
  background-image: var(--future-button-gradient);
  box-shadow: var(--future-button-hover-shadow);
}

.theme-future-glow .style-card-selected .style-card-title,
.theme-future-glow .style-card-selected .style-card-description {
  color: white;
}

.theme-future-glow .style-card:hover {
  box-shadow: 0 0 20px rgba(0, 209, 255, 0.3);
}
</style>

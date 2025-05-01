<script setup>
import { ref, watch, onMounted } from 'vue';
import StyleSelector from './StyleSelector.vue';
import { getDefaultStyle } from '../../config/styles';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'confirm']);

// 当前选中的风格
const selectedStyle = ref(getDefaultStyle().id);

// 关闭对话框
const closeDialog = () => {
  emit('close');
};

// 确认选择
const confirmStyle = () => {
  emit('confirm', {
    code: props.code,
    style: selectedStyle.value
  });
};

// 处理风格变化
const handleStyleChange = (style) => {
  // 如果是对象，使用id属性，否则直接使用值（可能是自定义输入的字符串）
  selectedStyle.value = typeof style === 'object' ? style.id : style;
};

// 点击遮罩层关闭对话框
const handleOverlayClick = (event) => {
  // 只有当点击的是遮罩层本身时才关闭对话框
  if (event.target.classList.contains('dialog-overlay')) {
    closeDialog();
  }
};

// 按ESC键关闭对话框
const handleKeyDown = (event) => {
  if (event.key === 'Escape') {
    closeDialog();
  }
};

// 监听键盘事件
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
});

// 组件卸载时移除事件监听
const onUnmounted = () => {
  document.removeEventListener('keydown', handleKeyDown);
};
</script>

<template>
  <div v-if="visible" class="dialog-overlay" @click="handleOverlayClick">
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">选择美化风格</h2>
        <button class="dialog-close-btn" @click="closeDialog">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="dialog-content">
        <p class="dialog-description">请选择您喜欢的美化风格，我们将根据您的选择对代码进行美化处理。</p>

        <StyleSelector v-model="selectedStyle" @change="handleStyleChange" />
      </div>

      <div class="dialog-footer">
        <button class="dialog-btn dialog-cancel-btn" @click="closeDialog">取消</button>
        <button class="dialog-btn dialog-confirm-btn" @click="confirmStyle">开始美化</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

.dialog-container {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background-color: var(--neu-background);
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.3s ease;
  border: 1px solid var(--neu-border-color);
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--neu-border-color);
}

.dialog-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--neu-text-color);
  margin: 0;
}

.dialog-close-btn {
  background: transparent;
  border: none;
  color: var(--neu-text-color);
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.dialog-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.dialog-content {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.dialog-description {
  margin-bottom: 1.5rem;
  color: var(--neu-text-color);
  font-size: 0.95rem;
  line-height: 1.5;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid var(--neu-border-color);
  gap: 1rem;
}

.dialog-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.dialog-cancel-btn {
  background-color: transparent;
  border: 1px solid var(--neu-border-color);
  color: var(--neu-text-color);
}

.dialog-cancel-btn:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dialog-confirm-btn {
  background-color: var(--neu-primary-color);
  border: none;
  color: white;
}

.dialog-confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 未来流光主题下的特殊样式 */
.theme-future-glow .dialog-confirm-btn {
  background-image: var(--future-button-gradient);
  box-shadow: 0 0 10px rgba(0, 209, 255, 0.2);
}

.theme-future-glow .dialog-confirm-btn:hover {
  box-shadow: var(--future-button-hover-shadow);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 640px) {
  .dialog-container {
    width: 95%;
    max-height: 95vh;
  }

  .dialog-header,
  .dialog-content,
  .dialog-footer {
    padding: 1rem;
  }
}
</style>

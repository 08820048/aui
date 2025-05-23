<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { highlightCode } from '../../utils/highlighter';
import CodeHighlight from './CodeHighlight.vue';
import StyleDialog from '../StyleSelector/StyleDialog.vue';

// 接收父组件传递的属性
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  beautifyLoading: {
    type: Boolean,
    default: false
  },
  beautifyError: {
    type: String,
    default: ''
  },
  beautifySuccess: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['update:modelValue', 'beautify', 'styleChange']);

// 本地代码内容
const localCode = ref(props.modelValue);

// 当前激活的标签页（编辑/预览）
const activeTab = ref('edit');

// 风格选择对话框状态
const styleDialogVisible = ref(false);

// 打开风格选择对话框
const openStyleDialog = () => {
  styleDialogVisible.value = true;
};

// 关闭风格选择对话框
const closeStyleDialog = () => {
  styleDialogVisible.value = false;
};

// 确认选择风格并美化代码
const confirmStyle = (data) => {
  emit('beautify', data);
  closeStyleDialog();
};

// 监听父组件传递的值变化
watch(() => props.modelValue, (newValue) => {
  localCode.value = newValue;
});

// 更新代码内容
const updateCode = (event) => {
  localCode.value = event.target.value;
  emit('update:modelValue', localCode.value);
};

// 美化代码 - 打开风格选择对话框
const beautifyCode = () => {
  if (!localCode.value.trim()) {
    return;
  }
  openStyleDialog();
};

// 示例代码
const insertExampleCode = () => {
  const exampleCode = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>示例页面</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    h1 { color: #333; }
    p { line-height: 1.6; }
    .container { max-width: 800px; margin: 0 auto; }
    .btn {
      display: inline-block;
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn:hover { background-color: #45a049; }
  </style>
</head>
<body>
  <div class="container">
    <h1>欢迎使用网页美化工具</h1>
    <p>这是一个示例HTML页面，您可以修改这段代码，然后点击"开始美化"按钮查看效果。</p>
    <button class="btn">点击我</button>
  </div>
</body>
</html>`;

  localCode.value = exampleCode;
  emit('update:modelValue', exampleCode);
};

// 清空代码
const clearCode = () => {
  localCode.value = '';
  emit('update:modelValue', '');
};
</script>

<template>
  <div class="code-editor-container">
    <div class="editor-header">
      <h2 class="editor-title">编辑区</h2>
      <div class="editor-actions">
        <button
          class="action-btn neu-flat-sm"
          @click="insertExampleCode"
          title="插入示例代码"
          style="height: 28px; font-size: 12px; padding: 4px 10px; color: var(--neu-text-color);"
        >
          <svg xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <span style="margin-left: 4px;">示例</span>
        </button>

        <button
          class="action-btn neu-flat-sm"
          @click="clearCode"
          title="清空代码"
          style="height: 28px; font-size: 12px; padding: 4px 10px; color: var(--neu-text-color);"
        >
          <svg xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
          <span style="margin-left: 4px;">清空</span>
        </button>

        <button
          class="action-btn neu-flat-sm"
          @click="beautifyCode"
          :disabled="props.beautifyLoading"
          :class="{ 'loading': props.beautifyLoading, 'error': props.beautifyError }"
          title="美化代码"
          style="height: 28px; font-size: 12px; padding: 4px 10px;"
        >
          <svg v-if="!props.beautifyLoading && !props.beautifyError" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
          <svg v-else-if="props.beautifyError" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="15" y1="9" x2="9" y2="15"></line>
            <line x1="9" y1="9" x2="15" y2="15"></line>
          </svg>
          <span v-else class="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </span>
          <span style="margin-left: 4px;">
            {{ props.beautifyLoading ? '美化中...' : props.beautifyError ? '已终止' : '开始美化' }}
          </span>
        </button>
      </div>
    </div>

    <!-- 风格选择对话框 -->
    <StyleDialog
      :visible="styleDialogVisible"
      :code="localCode"
      @close="closeStyleDialog"
      @confirm="confirmStyle"
    />

    <div class="editor-content neu-pressed">
      <div class="editor-tabs">
        <button
          class="editor-tab"
          :class="{ 'active': activeTab === 'edit' }"
          @click="activeTab = 'edit'"
        >
          编辑
        </button>
        <button
          class="editor-tab"
          :class="{ 'active': activeTab === 'preview' }"
          @click="activeTab = 'preview'"
        >
          预览
        </button>
      </div>
      <div class="editor-panels">
        <textarea
          v-show="activeTab === 'edit'"
          class="code-textarea"
          :value="localCode"
          @input="updateCode"
          placeholder="在此输入HTML代码..."
          spellcheck="false"
        ></textarea>
        <div v-show="activeTab === 'preview'" class="code-preview-panel">
          <CodeHighlight :code="localCode" language="html" />
        </div>
      </div>
    </div>
  </div>

  <!-- 轻提示 -->
  <transition name="fade">
    <div v-if="props.beautifyLoading" class="beautify-toast">正在美化，请稍候...</div>
    <div v-else-if="props.beautifyError && props.beautifyError !== '用户终止了美化'" class="beautify-toast error">{{ props.beautifyError }}</div>
    <div v-else-if="props.beautifyError === '用户终止了美化'" class="beautify-toast warning">用户终止了美化</div>
    <div v-else-if="props.beautifySuccess" class="beautify-toast success">美化完成！</div>
  </transition>
</template>

<style scoped>
.code-editor-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 1.25rem 2rem; /* 左右内边距调整为 2rem，与分隔条对齐 */
  box-sizing: border-box; /* 确保内边距不会增加元素宽度 */
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem; /* 增加底部边距 */
  padding: 0 0.5rem 0.25rem 0.5rem; /* 增加底部内边距 */
  z-index: 5;
  position: relative; /* 添加相对定位 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05); /* 添加淡色底部边框 */
}

.editor-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-left: 0.5rem; /* 添加左边距，与容器边缘保持适当距离 */
  letter-spacing: 0.02em; /* 增加字间距 */
  position: relative; /* 添加相对定位，为下划线做准备 */
  padding-bottom: 0.25rem; /* 为下划线留出空间 */
}

.editor-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2rem;
  height: 2px;
  background-color: #aaa;
  border-radius: 1px;
}

.editor-actions {
  display: flex;
  gap: 0.5rem;
  position: absolute; /* 绝对定位 */
  right: 1rem; /* 调整位置，与容器边缘保持适当距离 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中 */
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center; /* 水平居中 */
  padding: 0.35rem 0.8rem; /* 进一步减小内边距，与图标大小协调 */
  font-size: 0.75rem; /* 进一步缩小字体，与图标协调 */
  font-weight: 500; /* 增加字重 */
  border: none;
  outline: none;
  color: var(--neu-text-color);
  border-radius: 0.75rem; /* 增大圆角半径 */
  background-color: var(--neu-background);
  background-image: var(--neu-background-gradient);
  box-shadow: 3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light);
  transition: all var(--transition-time) ease;
  border: 1px solid var(--neu-border-color);
  margin-left: 0.75rem; /* 增加按钮间距 */
  min-width: 5.5rem; /* 增加最小宽度，使按钮更长 */
  white-space: nowrap; /* 防止文本换行 */
  height: 2rem; /* 进一步减小高度，与图标大小协调 */
}

.action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 4px 4px 8px var(--neu-shadow-dark), -4px -4px 8px var(--neu-shadow-light);
  color: var(--neu-primary-color); /* 使用主题主色 */
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light);
  color: var(--neu-primary-color); /* 使用主题主色 */
}

.action-btn.loading {
  background-color: rgba(var(--neu-primary-color-rgb), 0.1);
  color: var(--neu-primary-color);
}

.action-btn.error {
  background-color: rgba(211, 47, 47, 0.1);
  color: #d32f2f;
}

.loading-dots {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 14px;
  width: 14px;
}

.loading-dots span {
  display: inline-block;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background-color: var(--neu-primary-color);
  margin: 0 1px;
  animation: loadingDots 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes loadingDots {
  0%, 80%, 100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1.0);
  }
}

.action-btn > * {
  margin-right: 0.4rem; /* 调整图标和文本间距，与图标大小协调 */
}

.action-btn svg {
  margin-top: 0; /* 移除垂直偏移 */
  flex-shrink: 0; /* 防止图标缩小 */
  display: block; /* 确保图标正确显示 */
  overflow: visible; /* 防止图标被裁剪 */
}

/* 移除美化按钮的特殊样式，使其与其他按钮保持一致 */

.editor-content {
  flex: 1;
  overflow: hidden;
  margin: 0; /* 移除左右边距，与分隔条对齐 */
  border-radius: 0.5rem; /* 统一圆角大小 */
  position: relative;
  width: calc(100% - 0px); /* 确保宽度与分隔条一致 */
}

.editor-tabs {
  display: flex;
  border-bottom: 1px solid var(--neu-border-color);
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
}

.editor-tab {
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--neu-text-color);
  transition: all 0.3s ease;
  margin-right: 0.5rem;
}

.editor-tab.active {
  border-bottom: 2px solid var(--neu-primary-color);
  color: var(--neu-primary-color);
  font-weight: 500;
}

.editor-tab:hover {
  color: var(--neu-primary-color);
}

.editor-panels {
  position: relative;
  flex: 1;
  overflow: hidden;
  height: calc(100% - 40px);
}

.code-textarea {
  width: 100%;
  height: 100%;
  resize: none;
  padding: 1rem;
  background: transparent;
  border: none;
  outline: none;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
  color: var(--neu-text-color);
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light);
  border-radius: 0.5rem; /* 统一圆角大小 */
}

.code-preview-panel {
  width: 100%;
  height: 100%;
  overflow: auto;
  padding: 0;
  background: transparent;
  border-radius: 0.5rem;
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light);
}

.beautify-toast {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(60, 60, 60, 0.9);
  color: #fff;
  padding: 10px 28px;
  border-radius: 12px;
  font-size: 15px;
  z-index: 9999;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
  pointer-events: none;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: toastIn 0.3s ease-in-out, toastOut 0.5s ease-in-out 2.5s forwards;
}

.beautify-toast.error {
  background: rgba(211, 47, 47, 0.9);
  color: #fff;
  box-shadow: 0 5px 20px rgba(211, 47, 47, 0.3);
}

.beautify-toast.warning {
  background: rgba(255, 152, 0, 0.9);
  color: #fff;
  box-shadow: 0 5px 20px rgba(255, 152, 0, 0.3);
}

.beautify-toast.success {
  background: rgba(67, 160, 71, 0.9);
  color: #fff;
  box-shadow: 0 5px 20px rgba(67, 160, 71, 0.3);
}

@keyframes toastIn {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%);
  }
}

@keyframes toastOut {
  from {
    opacity: 1;
    transform: translateX(-50%);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>

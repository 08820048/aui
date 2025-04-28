<script setup>
import { ref, watch, onMounted } from 'vue';
import { highlightCode } from '../../utils/highlighter';
import { nextTick } from 'vue';

// 接收代码内容
const props = defineProps({
  code: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    default: 'html'
  }
});

// 高亮后的代码
const highlightedCode = ref('');

// 更新高亮代码
const updateHighlight = () => {
  if (props.code) {
    highlightedCode.value = highlightCode(props.code, props.language);
  } else {
    highlightedCode.value = '';
  }
};

// 监听代码变化
watch(() => props.code, updateHighlight, { immediate: true });

// 复制状态
const isCopied = ref(false);
const showCopyButton = ref(false);

// 复制代码到剪贴板
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    isCopied.value = true;

    // 3秒后重置复制状态
    setTimeout(() => {
      isCopied.value = false;
    }, 3000);
  } catch (error) {
    console.error('复制失败:', error);
  }
};

// 显示/隐藏复制按钮
const handleMouseEnter = () => {
  showCopyButton.value = true;
};

const handleMouseLeave = () => {
  showCopyButton.value = false;
};

// 组件挂载时初始化
onMounted(() => {
  updateHighlight();
});
</script>

<template>
  <div
    class="code-highlight-container"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- 复制按钮 -->
    <button
      v-show="showCopyButton || isCopied"
      class="copy-button"
      @click="copyCode"
      :class="{ 'copied': isCopied }"
    >
      <!-- 复制图标 -->
      <svg v-if="!isCopied" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <!-- 复制成功图标 -->
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>{{ isCopied ? '已复制' : '复制' }}</span>
    </button>

    <!-- 代码高亮区域 -->
    <div class="code-highlight">
      <pre><code v-html="highlightedCode" class="language-html"></code></pre>
    </div>
  </div>
</template>

<style>
/* 这些样式不使用 scoped，以便覆盖 highlight.js 的默认样式 */
.code-highlight-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.copy-button {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem 0.75rem;
  background-color: var(--neu-background);
  border: 1px solid var(--neu-border-color);
  border-radius: 0.375rem;
  color: var(--neu-text-color);
  font-size: 0.75rem;
  cursor: pointer;
  z-index: 10;
  opacity: 0.9;
  transition: all 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.copy-button:hover {
  opacity: 1;
  transform: translateY(-1px);
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
}

.copy-button.copied {
  background-color: var(--neu-primary-color);
  color: white;
}

/* 浅灰玻璃主题下的复制按钮 */
.theme-light-glass .copy-button {
  background-color: rgba(79, 79, 79, 0.1);
  color: #4f4f4f;
  border: 1px solid rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
}

.theme-light-glass .copy-button:hover {
  background-color: rgba(79, 79, 79, 0.2);
}

.theme-light-glass .copy-button.copied {
  background-color: #4f4f4f;
  color: white;
}

/* 冰蓝科技主题下的复制按钮 */
.theme-ice-blue .copy-button {
  background-color: rgba(33, 150, 243, 0.2);
  color: #0d47a1;
  border: 1px solid rgba(33, 150, 243, 0.3);
}

.theme-ice-blue .copy-button:hover {
  background-color: rgba(33, 150, 243, 0.3);
}

.theme-ice-blue .copy-button.copied {
  background-color: #2196f3;
  color: white;
}

/* 幻彩渐变主题下的复制按钮 */
.theme-gradient .copy-button {
  background: linear-gradient(135deg, rgba(196, 113, 237, 0.3), rgba(246, 79, 89, 0.3));
  color: white;
  border: 1px solid rgba(246, 79, 89, 0.3);
}

.theme-gradient .copy-button:hover {
  background: linear-gradient(135deg, rgba(196, 113, 237, 0.4), rgba(246, 79, 89, 0.4));
}

.theme-gradient .copy-button.copied {
  background: linear-gradient(135deg, rgba(196, 113, 237, 0.8), rgba(246, 79, 89, 0.8));
}

/* 未来流光科技风主题下的复制按钮 */
.theme-future-glow .copy-button {
  background-image: var(--future-button-gradient);
  color: white;
  border: none;
  box-shadow: 0 0 10px rgba(0, 209, 255, 0.2);
}

.theme-future-glow .copy-button:hover {
  box-shadow: var(--future-button-hover-shadow);
}

.theme-future-glow .copy-button.copied {
  background-image: linear-gradient(135deg, #00D1FF, #00FFA3);
}

.code-highlight {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: transparent !important;
  margin: 0;
  padding: 0;
}

.code-highlight pre {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1rem;
  background-color: transparent !important;
  border-radius: 0.5rem;
  overflow: auto;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

.code-highlight code {
  background-color: transparent !important;
  font-family: inherit;
  padding: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* 自定义高亮样式，适应主题 */
.code-highlight .hljs {
  background-color: transparent !important;
  color: var(--neu-text-color);
}

/* 暗色主题适配 */
.theme-dark-frost .code-highlight .hljs {
  color: #e0e0e0;
}

.theme-dark-frost .code-highlight .hljs-tag,
.theme-dark-frost .code-highlight .hljs-name,
.theme-dark-frost .code-highlight .hljs-attribute {
  color: #00bcd4;
}

.theme-dark-frost .code-highlight .hljs-string {
  color: #ff9800;
}

.theme-dark-frost .code-highlight .hljs-comment {
  color: #9e9e9e;
}

/* 冰蓝主题适配 */
.theme-ice-blue .code-highlight .hljs-tag,
.theme-ice-blue .code-highlight .hljs-name,
.theme-ice-blue .code-highlight .hljs-attribute {
  color: #2196f3;
}

.theme-ice-blue .code-highlight .hljs-string {
  color: #ff5722;
}

/* 幻彩主题适配 */
.theme-gradient .code-highlight .hljs-tag,
.theme-gradient .code-highlight .hljs-name,
.theme-gradient .code-highlight .hljs-attribute {
  color: #f64f59;
}

.theme-gradient .code-highlight .hljs-string {
  color: #c471ed;
}
</style>

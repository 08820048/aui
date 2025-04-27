<script setup>
import { ref, watch, onMounted } from 'vue';
import { highlightCode } from '../../utils/highlighter';

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

// 组件挂载时初始化
onMounted(updateHighlight);
</script>

<template>
  <div class="code-highlight">
    <pre><code v-html="highlightedCode" class="language-html"></code></pre>
  </div>
</template>

<style>
/* 这些样式不使用 scoped，以便覆盖 highlight.js 的默认样式 */
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

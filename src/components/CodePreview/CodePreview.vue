<script setup>
import { ref, watch } from 'vue';
import CodeHighlight from '../CodeEditor/CodeHighlight.vue';

// 接收父组件传递的属性
const props = defineProps({
  html: {
    type: String,
    default: ''
  },
  isDark: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['toggle-theme']);

// 预览框架引用
const previewFrame = ref(null);

// 当前激活的标签页（渲染/代码）
const activeTab = ref('render');

// 切换主题
const toggleTheme = () => {
  emit('toggle-theme');
};

// 监听HTML内容变化，更新预览
watch(() => props.html, (newHtml) => {
  if (previewFrame.value) {
    const frameDoc = previewFrame.value.contentDocument || previewFrame.value.contentWindow.document;
    frameDoc.open();
    frameDoc.write(newHtml);
    frameDoc.close();
  }
}, { immediate: true });
</script>

<template>
  <div class="preview-container">
    <div class="preview-header">
      <h2 class="preview-title">实时预览</h2>
      <div class="preview-actions">
        <button
          class="theme-toggle neu-flat-sm"
          @click="toggleTheme"
          :title="isDark ? '切换为浅色主题' : '切换为深色主题'"
          style="height: 28px; font-size: 12px; padding: 4px 10px; color: var(--neu-text-color);"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
          <svg v-else xmlns="http://www.w3.org/2000/svg" style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span style="margin-left: 4px;">{{ isDark ? '浅色' : '深色' }}</span>
        </button>
      </div>
    </div>

    <div class="preview-tabs">
      <button
        class="preview-tab"
        :class="{ 'active': activeTab === 'render' }"
        @click="activeTab = 'render'"
      >
        渲染结果
      </button>
      <button
        class="preview-tab"
        :class="{ 'active': activeTab === 'code' }"
        @click="activeTab = 'code'"
      >
        代码高亮
      </button>
    </div>

    <div class="preview-panels">
      <div
        v-show="activeTab === 'render'"
        class="preview-content neu-pressed"
        :class="{ 'preview-dark': isDark }"
      >
        <iframe
          ref="previewFrame"
          class="preview-frame"
          sandbox="allow-same-origin allow-scripts"
          title="代码预览"
        ></iframe>
      </div>

      <div v-show="activeTab === 'code'" class="code-highlight-container neu-pressed">
        <CodeHighlight :code="html" language="html" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  padding: 0 2rem 1.5rem 2rem; /* 左右内边距调整为 2rem，与分隔条对齐 */
  box-sizing: border-box; /* 确保内边距不会增加元素宽度 */
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem; /* 增加底部边距 */
  padding: 0 0.5rem 0.25rem 0.5rem; /* 增加底部内边距 */
  z-index: 5;
  position: relative; /* 添加相对定位 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05); /* 添加淡色底部边框 */
}

.preview-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-left: 0.5rem; /* 添加左边距，与容器边缘保持适当距离 */
  letter-spacing: 0.02em; /* 增加字间距 */
  position: relative; /* 添加相对定位，为下划线做准备 */
  padding-bottom: 0.25rem; /* 为下划线留出空间 */
}

.preview-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 2rem;
  height: 2px;
  background-color: #aaa;
  border-radius: 1px;
}

.preview-actions {
  display: flex;
  gap: 0.5rem;
  position: absolute; /* 绝对定位 */
  right: 1rem; /* 调整位置，与容器边缘保持适当距离 */
  top: 50%; /* 垂直居中 */
  transform: translateY(-50%); /* 垂直居中 */
}

.theme-toggle {
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
  min-width: 6rem; /* 增加最小宽度，使按钮更长 */
  white-space: nowrap; /* 防止文本换行 */
  height: 2rem; /* 进一步减小高度，与图标大小协调 */
  position: relative; /* 添加相对定位 */
}

.theme-toggle:hover {
  transform: translateY(-1px);
  box-shadow: 4px 4px 8px var(--neu-shadow-dark), -4px -4px 8px var(--neu-shadow-light);
  color: var(--neu-primary-color); /* 使用主题主色 */
}

.theme-toggle:active {
  transform: translateY(0);
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light);
  color: var(--neu-primary-color); /* 使用主题主色 */
}

.theme-toggle > * {
  margin-right: 0.4rem; /* 调整图标和文本间距，与图标大小协调 */
}

.theme-toggle svg {
  margin-top: 0; /* 移除垂直偏移 */
  flex-shrink: 0; /* 防止图标缩小 */
  display: block; /* 确保图标正确显示 */
  overflow: visible; /* 防止图标被裁剪 */
}

.preview-tabs {
  display: flex;
  border-bottom: 1px solid var(--neu-border-color);
  padding: 0 0.5rem;
  margin-bottom: 0.5rem;
}

.preview-tab {
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

.preview-tab.active {
  border-bottom: 2px solid var(--neu-primary-color);
  color: var(--neu-primary-color);
  font-weight: 500;
}

.preview-tab:hover {
  color: var(--neu-primary-color);
}

.preview-panels {
  position: relative;
  flex: 1;
  overflow: hidden;
  height: calc(100% - 40px);
}

.preview-content {
  flex: 1;
  overflow: hidden;
  margin: 0; /* 移除左右边距，与分隔条对齐 */
  border-radius: 0.5rem; /* 统一圆角大小 */
  background-color: #ffffff;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.7);
  transition: all var(--transition-time) ease;
  border: 1px solid var(--neu-border-color);
  position: relative;
  width: 100%; /* 确保宽度与分隔条一致 */
  height: 100%;
}

.code-highlight-container {
  flex: 1;
  overflow: hidden;
  margin: 0;
  border-radius: 0.5rem;
  background-color: #ffffff;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.1), inset -3px -3px 6px rgba(255, 255, 255, 0.7);
  transition: all var(--transition-time) ease;
  border: 1px solid var(--neu-border-color);
  position: relative;
  width: 100%;
  height: 100%;
}

.preview-dark {
  background-color: #1a1a1a;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(50, 50, 50, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.theme-dark-frost .code-highlight-container {
  background-color: #1a1a1a;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(50, 50, 50, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  padding: 1rem; /* 与代码输入区内边距一致 */
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem; /* 统一圆角大小 */
}
</style>

<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';
import CodeHighlight from '../CodeEditor/CodeHighlight.vue'; // 你的代码高亮组件

// 接收父组件传来的html内容和暗黑模式开关
const props = defineProps({
  html: {
    type: String,
    default: ''
  },
  isDark: {
    type: Boolean,
    default: false
  },
  beautifyLoading: { 
    type: Boolean, 
    default: false 
  }
});

// 定义事件
const emit = defineEmits(['toggle-theme']);

// iframe框架引用
const previewFrame = ref(null);

// 当前选中的tab
const activeTab = ref('render');

// 打字机式高亮显示
const displayedCode = ref('');
let typingTimer = null;

watch(
  () => props.html,
  (newVal, oldVal) => {
    if (props.beautifyLoading) {
      clearInterval(typingTimer);
      let i = oldVal ? oldVal.length : 0;
      typingTimer = setInterval(() => {
        if (i < newVal.length) {
          displayedCode.value = newVal.slice(0, i + 1);
          i++;
        } else {
          clearInterval(typingTimer);
        }
      }, 8); // 可调速度
    } else {
      displayedCode.value = newVal || '';
    }
  },
  { immediate: true }
);

watch(
  () => props.beautifyLoading,
  (loading) => {
    if (!loading) {
      clearInterval(typingTimer);
      displayedCode.value = props.html || '';
    }
  }
);

onBeforeUnmount(() => {
  clearInterval(typingTimer);
});

// 流式美化时自动切到代码高亮tab
watch(() => props.beautifyLoading, (loading) => {
  if (loading) {
    activeTab.value = 'code';
  }
});

// 监听html变化，动态刷新iframe内容
watch(() => props.html, (newHtml) => {
  if (previewFrame.value) {
    previewFrame.value.srcdoc = '';      // 先清空，防止浏览器缓存
    previewFrame.value.srcdoc = newHtml || ''; // 再赋值新的HTML内容
  }
}, { immediate: true });
</script>

<template>
  <div class="preview-container">
    <!-- 顶部标题+切换主题按钮 -->
    <div class="preview-header">
      <h2 class="preview-title">预览区</h2>
      <div class="preview-actions">
        <button
            class="theme-toggle neu-flat-sm"
            @click="() => emit('toggle-theme')"
            :title="isDark ? '切换为浅色主题' : '切换为深色主题'"
        >
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
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
          <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="width: 14px; height: 14px;">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
          <span style="margin-left: 4px;">{{ isDark ? '浅色' : '深色' }}</span>
        </button>
      </div>
    </div>

    <!-- Tabs：渲染/代码 -->
    <div class="preview-tabs">
      <button
          class="preview-tab"
          :class="{ 'active': activeTab === 'render' }"
          @click="activeTab = 'render'"
          :disabled="props.beautifyLoading"
      >
        渲染结果
      </button>
      <button
          class="preview-tab"
          :class="{ 'active': activeTab === 'code' }"
          @click="activeTab = 'code'"
          :disabled="props.beautifyLoading"
      >
        代码高亮
      </button>
    </div>

    <!-- 内容区 -->
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

      <div v-show="activeTab === 'code'" class="code-highlight-container neu-pressed" style="position:relative;">
        <CodeHighlight :code="displayedCode" language="html" />
        <div v-if="props.beautifyLoading" class="stream-loading">代码生成中...</div>
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
  padding: 0 2rem 1.5rem 2rem;
  box-sizing: border-box;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  padding: 0 0.5rem 0.25rem 0.5rem;
  position: relative;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.preview-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin-left: 0.5rem;
  letter-spacing: 0.02em;
  position: relative;
  padding-bottom: 0.25rem;
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
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
}

.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.8rem;
  font-size: 0.75rem;
  font-weight: 500;
  border: none;
  outline: none;
  color: var(--neu-text-color);
  border-radius: 0.75rem;
  background-color: var(--neu-background);
  box-shadow: 3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light);
  border: 1px solid var(--neu-border-color);
  min-width: 6rem;
  white-space: nowrap;
  height: 2rem;
}

.theme-toggle:hover {
  transform: translateY(-1px);
}

.theme-toggle:active {
  transform: translateY(0);
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
  flex: 1;
  overflow: hidden;
  height: calc(100% - 40px);
}

.preview-content {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid var(--neu-border-color);
  border-radius: 0.5rem;
}

.preview-dark {
  background-color: #1a1a1a;
  box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.3), inset -3px -3px 6px rgba(50, 50, 50, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.preview-frame {
  width: 100%;
  height: 100%;
  border: none;
  padding: 1rem;
  background-color: transparent;
  box-sizing: border-box;
}

.code-highlight-container {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: #fff;
  border: 1px solid var(--neu-border-color);
  border-radius: 0.5rem;
}

.stream-loading {
  position: absolute;
  top: 12px;
  right: 24px;
  color: #888;
  font-size: 13px;
  z-index: 2;
  pointer-events: none;
}
</style>
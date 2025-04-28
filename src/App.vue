<script setup>
import { ref, onMounted, watch } from 'vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import CodeEditor from './components/CodeEditor/CodeEditor.vue';
import CodePreview from './components/CodePreview/CodePreview.vue';
import Resizer from './components/Resizer/Resizer.vue';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher.vue';
import Particles from './components/Effects/Particles.vue';

// 侧边栏状态
const isSidebarCollapsed = ref(false);
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// 代码编辑器内容
const htmlCode = ref('');
const beautifiedHtml = ref('');

// 分割区域高度比例
const splitRatio = ref(0.5);
const updateSplitRatio = (newRatio) => {
  splitRatio.value = newRatio;
};

// 美化代码
const beautifyCode = async () => {
  try {
    // 如果代码为空，直接返回
    if (!htmlCode.value.trim()) {
      beautifiedHtml.value = '';
      return;
    }

    const response = await fetch('http://127.0.0.1:3000/api/code/beautify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code: htmlCode.value }),
    });

    if (!response.ok) {
      throw new Error('网络请求失败');
    }

    const data = await response.json();
    beautifiedHtml.value = data.beautifiedCode || htmlCode.value;
  } catch (error) {
    console.error('美化代码失败:', error);
    // 如果API不可用，至少显示原始代码
    beautifiedHtml.value = htmlCode.value;
  }
};

// 监听代码变化，自动更新预览
watch(htmlCode, (newCode) => {
  if (newCode.trim()) {
    beautifiedHtml.value = newCode;
  } else {
    beautifiedHtml.value = '';
  }
});

// 预览区域背景颜色
const isDarkPreview = ref(false);
const togglePreviewTheme = () => {
  isDarkPreview.value = !isDarkPreview.value;
};

// 当前主题
const currentTheme = ref('');

// 监听主题变化
const updateTheme = () => {
  // 从 localStorage 获取当前主题
  const theme = localStorage.getItem('selected-theme') || 'default';
  currentTheme.value = theme;
};

// 窗口调整时确保布局正确
onMounted(() => {
  window.addEventListener('resize', handleResize);
  updateTheme();

  // 监听主题变化事件
  window.addEventListener('storage', (event) => {
    if (event.key === 'selected-theme') {
      updateTheme();
    }
  });
});

const handleResize = () => {
  // 如果窗口高度过小，调整分割比例
  if (window.innerHeight < 600 && splitRatio.value > 0.6) {
    splitRatio.value = 0.6;
  }
};
</script>

<template>
  <div class="app-container transition-500">
    <!-- 粒子效果 -->
    <Particles :theme="currentTheme" />
    <!-- 侧边栏 -->
    <Sidebar
      :is-collapsed="isSidebarCollapsed"
      @toggle="toggleSidebar"
    />

    <!-- 主题切换器 -->
    <div class="theme-switcher-container">
      <ThemeSwitcher />
    </div>

    <!-- 主内容区域 -->
    <main
      class="main-content transition-300"
      :class="{ 'main-content-expanded': isSidebarCollapsed }"
    >
      <div class="content-wrapper">
        <!-- 代码编辑区域 -->
        <div class="editor-section" :style="{ height: `${splitRatio * 100}%` }">
          <CodeEditor
            v-model="htmlCode"
            @beautify="beautifyCode"
          />
        </div>

        <!-- 分隔条 -->
        <div class="resizer-container">
          <Resizer
            @update="updateSplitRatio"
            :initial-ratio="splitRatio"
            :min-ratio="0.2"
            :max-ratio="0.8"
          />
        </div>

        <!-- 预览区域 -->
        <div class="preview-section" :style="{ height: `${(1 - splitRatio) * 100}%` }">
          <CodePreview
            :html="beautifiedHtml"
            :is-dark="isDarkPreview"
            @toggle-theme="togglePreviewTheme"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: var(--neu-background-gradient);
}

.theme-switcher-container {
  position: fixed;
  top: 1.25rem;
  right: 1.5rem;
  z-index: 100;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin-left: 256px; /* 240px + 16px gap */
  transition: all 0.3s ease-in-out;
  padding: 1.25rem 1.5rem 1.5rem 1.5rem; /* 增加内边距，特别是左右内边距 */
}

.main-content-expanded {
  margin-left: 88px; /* 72px + 16px gap */
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem; /* 统一圆角大小 */
  box-shadow: 5px 5px 15px var(--neu-shadow-dark), -5px -5px 15px var(--neu-shadow-light);
  position: relative; /* 添加相对定位，作为分隔条的定位参考 */
  margin-left: 0.5rem; /* 添加左边距，增加与左侧菜单栏的间距 */
}

.resizer-container {
  width: 100%;
  overflow: visible; /* 允许内容可见 */
  position: relative;
  z-index: 15; /* 提高层级 */
  height: 8px;
  margin: 0;
  padding: 0;
  user-select: none; /* 防止文本选中 */
  touch-action: none; /* 防止触摸事件 */
  display: flex; /* 使用弹性盒子布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.editor-section, .preview-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: height 0.1s ease-out;
  box-sizing: border-box; /* 确保内边距不会增加元素宽度 */
}

.editor-section {
  min-height: 20%;
  max-height: 80%;
}

.preview-section {
  min-height: 20%;
  max-height: 80%;
}
</style>

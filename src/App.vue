<script setup>
import { ref, watch } from 'vue';
import Sidebar from './components/Sidebar/Sidebar.vue';
import CodeEditor from './components/CodeEditor/CodeEditor.vue';
import CodePreview from './components/CodePreview/CodePreview.vue';
import Resizer from './components/Resizer/Resizer.vue';
import ThemeSwitcher from './components/ThemeSwitcher/ThemeSwitcher.vue';
import Particles from './components/Effects/Particles.vue';
import TypewriterModal from './components/Modal/TypewriterModal.vue';
import { beautifyHtml, beautifyHtmlStream } from './api/beautify';

// 侧边栏状态
const isSidebarCollapsed = ref(false);
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

// 代码编辑器内容
const htmlCode = ref('');
const beautifiedHtml = ref('');

// 当前选中的风格
const currentStyle = ref(null);

// 分割区域高度比例
const splitRatio = ref(0.5);
const updateSplitRatio = (newRatio) => {
  splitRatio.value = newRatio;
};

// 预览区域主题
const isDarkPreview = ref(false);
const togglePreviewTheme = () => {
  isDarkPreview.value = !isDarkPreview.value;
};

// 美化状态
const beautifyLoading = ref(false);
const beautifyError = ref('');
const beautifySuccess = ref(false);

// 打字机模态框状态
const typewriterModalVisible = ref(false);

// 当前请求控制器
let currentAbortController = null;

// 请求美化网页（流式）
const beautifyCode = async (data) => {
  beautifyLoading.value = true;
  beautifyError.value = '';
  beautifySuccess.value = false;
  beautifiedHtml.value = '';

  // 创建新的中止控制器
  currentAbortController = new AbortController();
  const signal = currentAbortController.signal;

  // 显示打字机模态框
  typewriterModalVisible.value = true;

  try {
    await beautifyHtmlStream(
      { html_code: data.code, style: data.style },
      {
        signal,
        onContent: (chunk) => {
          // 逐步追加到已美化内容，实现逐字刷出
          beautifiedHtml.value += chunk;
        },
        onDone: () => {
          beautifyLoading.value = false;
          beautifySuccess.value = true;
          currentAbortController = null;

          // 3秒后自动重置成功状态
          setTimeout(() => {
            beautifySuccess.value = false;
          }, 3000);
        },
        onError: (msg) => {
          beautifyLoading.value = false;
          beautifyError.value = msg || '美化失败';
          currentAbortController = null;
        },
      }
    );
  } catch (error) {
    // 如果是用户主动取消，不显示错误
    if (error.name === 'AbortError') {
      beautifyError.value = '用户终止了美化';
    } else {
      beautifyError.value = error?.message || '美化失败';
    }
    beautifyLoading.value = false;
    currentAbortController = null;
  }
};

// 关闭打字机模态框
const closeTypewriterModal = () => {
  typewriterModalVisible.value = false;
};

// 停止生成
const stopBeautifyGeneration = () => {
  if (currentAbortController) {
    currentAbortController.abort();
    currentAbortController = null;

    // 立即更新状态，不等待错误回调
    beautifyLoading.value = false;
    beautifyError.value = '用户终止了美化';
    beautifySuccess.value = false;

    // 3秒后自动清除错误提示
    setTimeout(() => {
      beautifyError.value = '';
    }, 3000);
  }
};

watch(htmlCode, (newCode) => {
  if (newCode.trim()) {
    beautifiedHtml.value = newCode;
  } else {
    beautifiedHtml.value = '';
  }
});
</script>

<template>
  <div class="app-container transition-500">
    <!-- 网格背景 -->
    <div class="grid-background">
      <div class="grid-lines"></div>
      <div class="grid-lines-large"></div>
      <div class="grid-glow"></div>
      <div class="grid-animated"></div>
    </div>

    <!-- 粒子效果 -->
    <Particles />

    <!-- 顶部标题栏 -->
    <div class="app-header neu-flat">
      <div class="app-logo">
        <img src="./assets/logo_b.png" alt="LumaCraft Logo" class="header-logo" />
        <h1 class="app-title">LumaCraft</h1>
      </div>
    </div>

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
            :beautify-loading="beautifyLoading"
            :beautify-error="beautifyError"
            :beautify-success="beautifySuccess"
            @beautify="beautifyCode"
            @styleChange="style => currentStyle = style"
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
            :beautify-loading="beautifyLoading"
            @toggle-theme="togglePreviewTheme"
          />
        </div>
      </div>
    </main>
    <!-- 打字机模态框 -->
    <TypewriterModal
      :visible="typewriterModalVisible"
      :code="beautifiedHtml"
      :loading="beautifyLoading"
      language="html"
      @close="closeTypewriterModal"
      @stop="stopBeautifyGeneration"
    />
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-image: var(--neu-background-gradient);
  position: relative; /* 确保定位上下文正确 */
}

/* 标题栏样式 */
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  z-index: 100;
  background-color: rgba(var(--neu-background-rgb), 0.9);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-logo {
  width: 36px;
  height: 36px;
  object-fit: contain;
}

.app-title {
  font-size: 1.5rem;
  font-weight: bold;
  background: linear-gradient(135deg, var(--neu-primary-color), #00e676);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.theme-switcher-container {
  position: fixed;
  top: 12px; /* 调整为与标题栏对齐 */
  right: 1.5rem;
  z-index: 110; /* 确保在标题栏之上 */
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  margin-left: 256px;
  margin-top: 70px; /* 为顶部标题栏留出空间 */
  transition: all 0.3s ease-in-out;
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
  z-index: 10; /* 确保内容在网格之上 */
}

.main-content-expanded {
  margin-left: 88px;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5rem;
  box-shadow: 5px 5px 15px var(--neu-shadow-dark), -5px -5px 15px var(--neu-shadow-light);
  position: relative;
  margin-left: 0.5rem;
}

.resizer-container {
  width: 100%;
  overflow: visible;
  position: relative;
  z-index: 15;
  height: 8px;
  margin: 0;
  padding: 0;
  user-select: none;
  touch-action: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.editor-section, .preview-section {
  position: relative;
  width: 100%;
  overflow: hidden;
  transition: height 0.1s ease-out;
  box-sizing: border-box;
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

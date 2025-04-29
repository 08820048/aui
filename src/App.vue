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
    <!-- 粒子效果 -->
    <Particles />
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
  margin-left: 256px;
  transition: all 0.3s ease-in-out;
  padding: 1.25rem 1.5rem 1.5rem 1.5rem;
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

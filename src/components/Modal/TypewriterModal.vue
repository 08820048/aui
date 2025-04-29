<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { highlightCode } from '../../utils/highlighter';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  code: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    default: 'html'
  }
});

const emit = defineEmits(['close', 'stop']);

// 显示的代码内容（打字效果）
const displayedCode = ref('');
// 高亮后的代码
const highlightedCode = ref('');
// 打字效果计时器
let typingTimer = null;
// 复制状态
const isCopied = ref(false);
// 代码容器引用
const codeContainer = ref(null);

// 自动滚动控制
const shouldAutoScroll = ref(true);
const isUserScrolling = ref(false);
const hasNewContent = ref(false);
let scrollTimer = null;
let userScrollTimer = null;

// 音效控制
const audioElement = ref(null);
const successAudioElement = ref(null);
let fadeOutTimer = null;
const isAudioPlaying = ref(false);

// 关闭模态框
const closeModal = () => {
  emit('close');
};

// 停止生成
const stopGeneration = () => {
  emit('stop');
};

// 点击遮罩层关闭模态框
const handleOverlayClick = (event) => {
  // 只有当点击的是遮罩层本身时才关闭模态框
  if (event.target.classList.contains('modal-overlay')) {
    closeModal();
  }
};

// 按ESC键关闭模态框
const handleKeyDown = (event) => {
  if (event.key === 'Escape' && !props.loading) {
    closeModal();
  }
};

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

// 更新高亮代码
const updateHighlight = () => {
  if (displayedCode.value) {
    highlightedCode.value = highlightCode(displayedCode.value, props.language);
  } else {
    highlightedCode.value = '';
  }
};

// 检查是否在底部
const isAtBottom = () => {
  if (!codeContainer.value) return true;

  const container = codeContainer.value;
  const scrollPosition = container.scrollTop + container.clientHeight;
  // 添加一个小的容差值(20px)，使判断更加灵活
  return scrollPosition >= (container.scrollHeight - 20);
};

// 自动滚动到底部
const scrollToBottom = async (force = false) => {
  if (!codeContainer.value) return;

  // 如果用户手动滚动且不是强制滚动，则显示新内容提示
  if (!shouldAutoScroll.value && !force) {
    hasNewContent.value = true;
    return;
  }

  await nextTick();
  const container = codeContainer.value;

  // 防抖：清除之前的定时器
  clearTimeout(scrollTimer);

  // 设置新的定时器，延迟执行滚动
  scrollTimer = setTimeout(() => {
    // 使用平滑滚动
    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth'
    });

    // 滚动后重置新内容标志
    hasNewContent.value = false;
  }, 50);
};

// 处理用户滚动事件
const handleScroll = () => {
  if (!codeContainer.value || isUserScrolling.value) return;

  // 标记用户正在滚动
  isUserScrolling.value = true;

  // 清除之前的用户滚动定时器
  clearTimeout(userScrollTimer);

  // 设置新的定时器，延迟检测滚动结束
  userScrollTimer = setTimeout(() => {
    // 检查滚动结束后是否在底部
    shouldAutoScroll.value = isAtBottom();
    isUserScrolling.value = false;

    // 如果用户滚动到底部，重置新内容标志
    if (shouldAutoScroll.value) {
      hasNewContent.value = false;
    }
  }, 150);
};

// 点击新内容提示，强制滚动到底部
const scrollToNewContent = () => {
  shouldAutoScroll.value = true;
  scrollToBottom(true);
  hasNewContent.value = false;
};

// 播放代码输出音效
const playCodeSound = () => {
  if (!audioElement.value) return;

  // 重置音频并设置循环
  audioElement.value.currentTime = 0;
  audioElement.value.loop = true;

  // 渐入播放
  audioElement.value.volume = 0;
  audioElement.value.play().then(() => {
    isAudioPlaying.value = true;
    // 渐入效果
    let volume = 0;
    const fadeIn = setInterval(() => {
      if (volume < 0.5) { // 最大音量设置为0.5
        volume += 0.05;
        audioElement.value.volume = volume;
      } else {
        clearInterval(fadeIn);
      }
    }, 100);
  }).catch(err => {
    console.error('音频播放失败:', err);
  });
};

// 停止代码输出音效
const stopCodeSound = () => {
  if (!audioElement.value || !isAudioPlaying.value) return;

  // 清除之前的渐出定时器
  clearTimeout(fadeOutTimer);

  // 渐出效果
  let volume = audioElement.value.volume;
  const fadeOut = setInterval(() => {
    if (volume > 0.05) {
      volume -= 0.05;
      audioElement.value.volume = volume;
    } else {
      clearInterval(fadeOut);
      audioElement.value.pause();
      isAudioPlaying.value = false;
    }
  }, 100);
};

// 监听代码变化，实现打字效果
watch(
  () => props.code,
  (newVal, oldVal) => {
    if (props.loading) {
      // 开始打字时播放音效
      if (newVal && newVal.length > 0 && !isAudioPlaying.value) {
        playCodeSound();
      }

      clearInterval(typingTimer);
      let i = oldVal ? oldVal.length : 0;
      typingTimer = setInterval(() => {
        if (i < newVal.length) {
          displayedCode.value = newVal.slice(0, i + 1);
          i++;
          updateHighlight();
          // 每20个字符滚动一次，避免过于频繁的滚动
          if (i % 20 === 0 || i === newVal.length) {
            scrollToBottom();
          }
        } else {
          clearInterval(typingTimer);
          // 确保最后一次滚动到底部
          scrollToBottom();
        }
      }, 8); // 可调速度
    } else {
      displayedCode.value = newVal || '';
      updateHighlight();
      scrollToBottom();
    }
  },
  { immediate: true }
);

// 监听loading状态变化
watch(
  () => props.loading,
  (loading) => {
    if (!loading) {
      clearInterval(typingTimer);
      displayedCode.value = props.code || '';
      updateHighlight();
      scrollToBottom();

      // 当loading结束时，停止代码音效并播放成功音效
      if (isAudioPlaying.value) {
        // 等待一小段时间再停止音效，使过渡更自然
        fadeOutTimer = setTimeout(() => {
          stopCodeSound();
          // 如果不是用户终止的，则播放成功音效
          if (!props.code.includes('用户终止了美化') && successAudioElement.value) {
            // 设置适当的音量
            successAudioElement.value.volume = 0.6;
            successAudioElement.value.play().catch(err => {
              console.error('成功音效播放失败:', err);
            });
          }
        }, 800);
      }
    }
  }
);

// 组件挂载时初始化
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown);
  updateHighlight();

  // 初始化时重置自动滚动状态
  shouldAutoScroll.value = true;
  hasNewContent.value = false;

  // 添加滚动事件监听
  if (codeContainer.value) {
    codeContainer.value.addEventListener('scroll', handleScroll);
  }
});

// 组件卸载时清理
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeyDown);
  clearInterval(typingTimer);
  clearTimeout(scrollTimer);
  clearTimeout(userScrollTimer);
  clearTimeout(fadeOutTimer);

  // 停止音频播放
  if (audioElement.value && isAudioPlaying.value) {
    audioElement.value.pause();
    isAudioPlaying.value = false;
  }

  // 停止成功音效
  if (successAudioElement.value) {
    successAudioElement.value.pause();
  }

  // 移除滚动事件监听
  if (codeContainer.value) {
    codeContainer.value.removeEventListener('scroll', handleScroll);
  }
});
</script>

<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <!-- 音频元素 -->
    <audio ref="audioElement" src="/sound/code.mp3" preload="auto"></audio>
    <audio ref="successAudioElement" src="/sound/success.mp3" preload="auto"></audio>
    <!-- 顶部悬浮提示区域 -->
    <div v-if="loading" class="floating-progress-container">
      <div class="progress-text">正在美化，请稍候...</div>
      <div class="progress-bar">
        <div class="progress-bar-inner"></div>
      </div>
    </div>

    <div class="modal-container" :class="{ 'loading': loading }">
      <!-- 模态框标题区 -->
      <div class="modal-header">
        <h2 class="modal-title">{{ loading ? '代码美化中' : '美化完成' }}</h2>
        <div class="modal-header-actions">
          <button v-if="loading" class="modal-stop-btn" @click="stopGeneration" title="停止生成">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
              <rect x="6" y="6" width="12" height="12" rx="1"></rect>
            </svg>
          </button>
          <button class="modal-close-btn" @click="closeModal">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- 代码卡片区域 -->
      <div class="modal-content">
        <div class="code-card">
          <!-- 复制按钮 -->
          <button
            class="copy-button"
            @click="copyCode"
            :class="{ 'copied': isCopied }"
            :disabled="!props.code || props.loading"
          >
            <svg v-if="!isCopied" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>{{ isCopied ? '已复制' : '复制' }}</span>
          </button>

          <!-- 代码高亮区域 -->
          <div class="code-highlight-wrapper">
            <div class="code-highlight" ref="codeContainer" @scroll="handleScroll">
              <pre><code v-html="highlightedCode" class="language-html"></code></pre>
            </div>

            <!-- 新内容提示 -->
            <div
              v-if="hasNewContent && !isUserScrolling"
              class="new-content-indicator"
              @click="scrollToNewContent"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              <span>新内容</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 底部状态区 -->
      <div class="modal-footer">
        <div class="ai-thinking" v-if="loading">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p v-else class="modal-status" :class="{ 'success': !props.code.includes('用户终止了美化'), 'warning': props.code.includes('用户终止了美化') }">
          <template v-if="props.code.includes('用户终止了美化')">用户终止了美化</template>
          <template v-else>代码生成完成！</template>
        </p>
        <button class="modal-btn modal-confirm-btn" @click="closeModal">关闭</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 基础样式 */
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap');

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.4s ease-in-out;
  padding: 20px;
}

/* 顶部悬浮进度条 */
.floating-progress-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 30px;
  padding: 10px 20px;
  box-shadow: 0 0 20px rgba(0, 150, 255, 0.3);
  z-index: 1100;
  display: flex;
  flex-direction: column;
  align-items: center;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: floatIn 0.5s ease-in-out;
}

.progress-text {
  color: white;
  font-size: 14px;
  margin-bottom: 8px;
  font-weight: 500;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  width: 30%;
  background-color: #00a8ff;
  border-radius: 2px;
  animation: progressAnimation 2s ease-in-out infinite;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.7);
}

/* 主容器样式 */
.modal-container {
  width: 90%;
  max-width: 900px;
  height: 80vh;
  max-height: 800px;
  background-color: rgba(248, 249, 250, 0.9);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 150, 255, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideUp 0.5s ease-in-out;
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.4s ease-in-out;
  position: relative;
}

.modal-container.loading {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 0 0 30px rgba(0, 150, 255, 0.4);
}

.modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #00a8ff, #00e676, #00a8ff);
  background-size: 200% 100%;
  animation: gradientBorder 3s ease-in-out infinite;
  border-radius: 16px 16px 0 0;
}

/* 头部样式 */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.8);
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  position: relative;
  padding-left: 15px;
}

.modal-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 20px;
  background: linear-gradient(to bottom, #00a8ff, #00e676);
  border-radius: 3px;
}

.modal-close-btn, .modal-stop-btn {
  background: transparent;
  border: none;
  color: #2c3e50;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
}

.modal-close-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
  transform: rotate(90deg);
}

.modal-stop-btn {
  color: #e53935;
  background-color: rgba(229, 57, 53, 0.1);
}

.modal-stop-btn:hover {
  background-color: rgba(229, 57, 53, 0.2);
  transform: scale(1.1);
}

/* 内容区域样式 */
.modal-content {
  padding: 1.5rem;
  overflow: hidden;
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgba(245, 247, 250, 0.7);
}

.code-card {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  padding: 0;
  background-color: rgba(241, 243, 245, 0.8);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05), 0 0 10px rgba(0, 0, 0, 0.03) inset;
  transition: all 0.3s ease-in-out;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.code-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08), 0 0 10px rgba(0, 0, 0, 0.03) inset;
}

.code-highlight-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.code-highlight {
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(241, 243, 245, 0.5) !important;
  margin: 0;
  padding: 0;
  border-radius: 12px;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

/* 新内容提示样式 */
.new-content-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 168, 255, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  display: flex;
  align-items: center;
  gap: 6px;
  box-shadow: 0 4px 12px rgba(0, 168, 255, 0.4);
  cursor: pointer;
  z-index: 10;
  animation: bounceIn 0.5s ease-in-out, pulse 2s infinite ease-in-out;
  transition: all 0.3s ease-in-out;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.new-content-indicator:hover {
  background: rgba(0, 168, 255, 1);
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 168, 255, 0.5);
}

.new-content-indicator svg {
  animation: bounce 1.5s infinite ease-in-out;
}

@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: translateX(-50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translateX(-50%) scale(1.05);
  }
  100% {
    transform: translateX(-50%) scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    box-shadow: 0 4px 12px rgba(0, 168, 255, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(0, 168, 255, 0.7);
  }
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

.code-highlight::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.code-highlight::-webkit-scrollbar-track {
  background: transparent;
}

.code-highlight::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.code-highlight::-webkit-scrollbar-thumb:hover {
  background-color: rgba(0, 0, 0, 0.25);
}

.code-highlight pre {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 1.5rem 2rem 2rem 1.5rem;
  background-color: transparent !important;
  border-radius: 12px;
  overflow: auto;
  font-family: 'Fira Code', 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  line-height: 1.6;
  color: #2c3e50;
}

/* 复制按钮样式 */
.copy-button {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background-color: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 20px;
  color: #2c3e50;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.copy-button:hover {
  background-color: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
}

.copy-button.copied {
  background-color: #00a8ff;
  color: white;
}

/* 底部AI思考动画 */
.ai-thinking {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.ai-thinking span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: linear-gradient(135deg, #00a8ff, #00e676);
  animation: aiThinking 1.4s infinite ease-in-out both;
  box-shadow: 0 0 10px rgba(0, 168, 255, 0.5);
}

.ai-thinking span:nth-child(1) {
  animation-delay: -0.32s;
}

.ai-thinking span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes aiThinking {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1.0);
    opacity: 1;
  }
}

/* 底部区域样式 */
.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  background-color: rgba(255, 255, 255, 0.8);
}

.modal-status {
  margin: 0;
  font-size: 0.9rem;
  color: #2c3e50;
  font-weight: 500;
}

.modal-status.success {
  color: #00c853;
}

.modal-status.warning {
  color: #ff9800;
}

.modal-btn {
  padding: 0.6rem 1.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  border: none;
  outline: none;
}

.modal-confirm-btn {
  background: linear-gradient(135deg, #00a8ff, #00e676);
  color: white;
  box-shadow: 0 4px 10px rgba(0, 168, 255, 0.3);
}

.modal-confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 168, 255, 0.4);
}

/* 动画效果 */
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
    transform: translateY(30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes floatIn {
  from {
    transform: translate(-50%, -20px);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

@keyframes progressAnimation {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(300%);
  }
}

@keyframes gradientBorder {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* 响应式样式 */
@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    height: 85vh;
  }

  .floating-progress-container {
    width: 250px;
  }

  .modal-header,
  .modal-content,
  .modal-footer {
    padding: 1rem;
  }

  .code-highlight pre {
    font-size: 13px;
    padding: 1rem 1.5rem 1.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .modal-container {
    width: 100%;
    height: 90vh;
    border-radius: 12px;
  }

  .floating-progress-container {
    width: 200px;
    padding: 8px 15px;
  }

  .progress-text {
    font-size: 12px;
  }

  .modal-title {
    font-size: 1.1rem;
  }

  .copy-button {
    padding: 6px 10px;
    font-size: 11px;
  }

  .code-highlight pre {
    font-size: 12px;
    padding: 1rem;
  }
}
</style>

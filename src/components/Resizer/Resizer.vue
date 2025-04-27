<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 接收父组件传递的属性
const props = defineProps({
  initialRatio: {
    type: Number,
    default: 0.5
  },
  minRatio: {
    type: Number,
    default: 0.2
  },
  maxRatio: {
    type: Number,
    default: 0.8
  }
});

// 定义事件
const emit = defineEmits(['update']);

// 是否正在拖拽
const isDragging = ref(false);
// 分隔条引用
const resizerRef = ref(null);
// 存储当前比例值
const currentRatio = ref(props.initialRatio);

// 处理拖拽开始
const handleMouseDown = (event) => {
  isDragging.value = true;
  document.body.style.cursor = 'row-resize';
  document.body.style.userSelect = 'none';

  // 阻止默认行为和冒泡
  event.preventDefault();
  event.stopPropagation();
};

// 处理拖拽移动
const handleMouseMove = (event) => {
  if (!isDragging.value) return;

  // 获取内容包装器的位置和尺寸
  const contentWrapper = document.querySelector('.content-wrapper');
  if (!contentWrapper) return;

  const wrapperRect = contentWrapper.getBoundingClientRect();
  const wrapperTop = wrapperRect.top;
  const wrapperHeight = wrapperRect.height;

  // 计算相对于内容包装器的位置
  const relativeY = event.clientY - wrapperTop;
  const newRatio = relativeY / wrapperHeight;

  // 限制比例范围
  const clampedRatio = Math.max(props.minRatio, Math.min(props.maxRatio, newRatio));

  // 只有当比例发生变化时才触发更新
  if (Math.abs(clampedRatio - currentRatio.value) > 0.001) {
    currentRatio.value = clampedRatio;
    // 更新比例，使用 requestAnimationFrame 提高性能
    requestAnimationFrame(() => {
      emit('update', clampedRatio);
    });
  }
};

// 处理拖拽结束
const handleMouseUp = () => {
  isDragging.value = false;
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// 组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('mousemove', handleMouseMove);
  document.addEventListener('mouseup', handleMouseUp);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('mousemove', handleMouseMove);
  document.removeEventListener('mouseup', handleMouseUp);
});
</script>

<template>
  <div
    ref="resizerRef"
    class="resizer"
    @mousedown="handleMouseDown"
    :class="{ 'resizer-active': isDragging }"
  >
    <div class="resizer-handle"></div>
  </div>
</template>

<style scoped>
.resizer {
  width: calc(100% - 4rem); /* 减去左右内边距，确保与容器对齐 */
  height: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: row-resize;
  z-index: 20; /* 提高层级，确保在最上层 */
  margin: 0 2rem; /* 左右各添加 2rem 的边距，与容器对齐 */
  padding: 0;
  box-shadow: inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
  background-color: var(--neu-background);
  border-radius: 0.5rem; /* 统一圆角大小 */
  position: relative;
  overflow: visible; /* 允许手柄可见 */
  user-select: none; /* 防止文本选中 */
  touch-action: none; /* 防止触摸事件 */
}

.resizer-active {
  background-color: #d8d8d8;
}

.resizer-handle {
  width: 3rem;
  height: 3px;
  border-radius: 9999px;
  background-color: #999;
  pointer-events: none; /* 确保手柄不会干扰鼠标事件 */
}

.resizer:hover .resizer-handle {
  width: 4rem;
  background-color: #777;
}

.resizer-active .resizer-handle {
  width: 5rem;
  background-color: #666;
}
</style>

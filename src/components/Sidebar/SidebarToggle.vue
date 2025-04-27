<script setup>
// 接收父组件传递的属性
const props = defineProps({
  isCollapsed: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['toggle']);

// 切换侧边栏状态
const toggleSidebar = () => {
  emit('toggle');
};
</script>

<template>
  <button
    class="toggle-btn neu-flat-sm transition-300"
    :class="{ 'toggle-btn-collapsed': isCollapsed }"
    @click="toggleSidebar"
    :title="isCollapsed ? '展开菜单' : '收起菜单'"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="icon"
      :class="{ 'rotate-180': isCollapsed }"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline v-if="isCollapsed" points="9 18 15 12 9 6"></polyline>
      <polyline v-else points="15 18 9 12 15 6"></polyline>
    </svg>
  </button>
</template>

<style scoped>
.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  cursor: pointer;
  width: 36px;
  height: 36px;
  border: none;
  outline: none;
  transition: all 0.3s ease;
  color: var(--neu-text-color);
  background-color: var(--neu-background);
  border: 1px solid var(--neu-border-color);
}

.toggle-btn-collapsed {
  width: 32px;
  height: 32px;
  padding: 0.4rem;
  margin: 0 auto;
}

.toggle-btn:active {
  box-shadow: inset 3px 3px 6px var(--neu-shadow-dark), inset -3px -3px 6px var(--neu-shadow-light);
  border-radius: 0.5rem;
  background-color: var(--neu-background);
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
  transition: transform 0.3s ease;
}
</style>

<script setup>
import { ref } from 'vue';
import SidebarToggle from './SidebarToggle.vue';
import SidebarMenu from './SidebarMenu.vue';

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

// 菜单项数据
const menuItems = ref([
  {
    id: 1,
    title: '网页美化',
    icon: 'code',
    active: true
  },
  // 隐藏文件上传和风格选择按钮
  /*
  {
    id: 2,
    title: '文件上传',
    icon: 'upload',
    active: false
  },
  {
    id: 3,
    title: '风格选择',
    icon: 'palette',
    active: false
  },
  */
]);

// 激活菜单项
const activateMenuItem = (id) => {
  menuItems.value.forEach(item => {
    item.active = item.id === id;
  });
};
</script>

<template>
  <aside
    class="sidebar neu-flat transition-300"
    :class="{ 'sidebar-collapsed': isCollapsed }"
  >
    <!-- 侧边栏头部 -->
    <div class="sidebar-header" :class="{ 'sidebar-header-collapsed': isCollapsed }">
      <SidebarToggle
        :is-collapsed="isCollapsed"
        @toggle="toggleSidebar"
        class="toggle-button"
      />
    </div>

    <!-- 侧边栏菜单 -->
    <SidebarMenu
      :items="menuItems"
      :is-collapsed="isCollapsed"
      @activate="activateMenuItem"
    />

    <!-- 侧边栏底部 -->
    <div class="sidebar-footer">
      <!-- 设置图标按钮 -->
      <div class="settings-button" @click="activateMenuItem(4)">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 70px; /* 为顶部标题栏留出空间 */
  left: 1rem; /* 在左侧留出一定距离 */
  height: calc(100% - 80px); /* 调整高度以适应标题栏 */
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 240px;
  padding: 1.5rem 1rem;
  transition: all var(--transition-time) ease;
  background-color: var(--neu-background);
  background-image: var(--neu-background-gradient);
  box-shadow: 5px 5px 15px var(--neu-shadow-dark), -5px -5px 15px var(--neu-shadow-light);
  border-radius: 0.5rem; /* 四个角都有圆角 */
  box-sizing: border-box; /* 确保内边距不会增加元素宽度 */
  border: 1px solid var(--neu-border-color);
  color: var(--neu-text-color);
}

.sidebar-collapsed {
  width: 72px;
  padding: 1.5rem 0.5rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: flex-end; /* 按钮靠右对齐 */
  margin-bottom: 1.5rem;
  padding: 0 0.5rem;
  position: relative;
}

.sidebar-header-collapsed {
  justify-content: center; /* 收起时按钮居中 */
  padding: 0;
}

/* 已移除不需要的样式 */

.toggle-button {
  position: relative;
  z-index: 5;
  margin-right: 0.5rem; /* 展开时的右侧距离 */
}

.sidebar-header-collapsed .toggle-button {
  margin-right: 0; /* 收起时去掉右侧距离 */
}

.sidebar-title {
  font-size: 1.25rem;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #333;
}

.sidebar-logo {
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
}

.sidebar-footer {
  margin-top: auto;
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 左对齐 */
  font-size: 0.875rem;
  color: #6b7280;
  width: 100%;
  padding-left: 0.5rem;
}

.settings-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--neu-background);
  color: var(--neu-text-color);
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 3px 3px 6px var(--neu-shadow-dark), -3px -3px 6px var(--neu-shadow-light);
  margin-left: 0.5rem; /* 左侧距离 */
}

.settings-button:hover {
  color: var(--neu-primary-color);
  transform: translateY(-2px);
}

.settings-button:active {
  box-shadow: inset 2px 2px 5px var(--neu-shadow-dark), inset -2px -2px 5px var(--neu-shadow-light);
  transform: translateY(0);
}

/* 移除版本文本样式 */

/* 折叠状态下的设置按钮样式 */
.sidebar-collapsed .sidebar-footer {
  align-items: center;
  padding-left: 0;
}

.sidebar-collapsed .settings-button {
  margin-left: 0;
}
</style>

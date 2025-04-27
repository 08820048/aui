<script setup>
import SidebarMenuItem from './SidebarMenuItem.vue';

// 接收父组件传递的属性
const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
});

// 定义事件
const emit = defineEmits(['activate']);

// 激活菜单项
const activateItem = (id) => {
  emit('activate', id);
};
</script>

<template>
  <nav class="sidebar-menu">
    <SidebarMenuItem
      v-for="item in items"
      :key="item.id"
      :item="item"
      :is-collapsed="isCollapsed"
      @click="activateItem(item.id)"
    />
  </nav>
</template>

<style scoped>
.sidebar-menu {
  display: flex;
  flex-direction: column;
}

.sidebar-menu > * {
  margin-bottom: 0.5rem;
}

.sidebar-menu > *:last-child {
  margin-bottom: 0;
}
</style>

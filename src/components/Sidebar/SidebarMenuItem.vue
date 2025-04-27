<script setup>
// 接收父组件传递的属性
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  isCollapsed: {
    type: Boolean,
    default: false
  }
});

// 图标映射
const iconMap = {
  code: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
  upload: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>`,
  palette: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"></circle><circle cx="19" cy="13" r="2.5"></circle><circle cx="6" cy="12" r="2.5"></circle><circle cx="10" cy="18.5" r="2.5"></circle><path d="M13.5 9L19 10.5"></path><path d="M13.5 9L6 12"></path><path d="M6 12L10 16"></path><path d="M19 10.5L10 16"></path></svg>`,
  settings: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>`
};
</script>

<template>
  <div
    class="menu-item transition-300"
    :class="{
      'menu-item-active': item.active,
      'menu-item-collapsed': isCollapsed
    }"
  >
    <div class="menu-icon" v-html="iconMap[item.icon]"></div>
    <span class="menu-title" v-if="!isCollapsed">{{ item.title }}</span>
  </div>
</template>

<style scoped>
.menu-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  cursor: pointer;
  color: var(--neu-text-color);
  background-color: var(--neu-background);
  background-image: var(--neu-background-gradient);
  box-shadow: 3px 3px 7px var(--neu-shadow-dark), -3px -3px 7px var(--neu-shadow-light);
  margin-bottom: 0.75rem;
  transition: all var(--transition-time) ease;
  border: 1px solid var(--neu-border-color);
}

.menu-item:hover {
  transform: translateY(-2px);
  box-shadow: 4px 4px 8px var(--neu-shadow-dark), -4px -4px 8px var(--neu-shadow-light);
  color: var(--neu-primary-color);
}

.menu-item:active {
  transform: translateY(0);
  box-shadow: inset 3px 3px 7px var(--neu-shadow-dark), inset -3px -3px 7px var(--neu-shadow-light);
}

.menu-item-active {
  box-shadow: inset 3px 3px 7px var(--neu-shadow-dark), inset -3px -3px 7px var(--neu-shadow-light);
  color: var(--neu-primary-color);
  transform: translateY(0);
  font-weight: 500;
}

.menu-item-collapsed {
  justify-content: center;
  padding: 0.75rem 0.5rem;
  width: 100%;
  box-sizing: border-box;
}

.menu-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
}

.menu-title {
  margin-left: 0.75rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<script setup>
import { ref, onMounted, watch } from 'vue';

// 主题列表
const themes = [
  { id: 'default', name: '默认主题', icon: 'circle' },
  { id: 'theme-light-glass', name: '浅灰玻璃', icon: 'sun' },
  { id: 'theme-ice-blue', name: '冰蓝科技', icon: 'cloud' },
  { id: 'theme-dark-frost', name: '暗黑磨砂', icon: 'moon' },
  { id: 'theme-gradient', name: '幻彩渐变', icon: 'palette' }
];

// 当前主题
const currentTheme = ref('default');
// 下拉菜单状态
const isOpen = ref(false);

// 切换下拉菜单
const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

// 关闭下拉菜单
const closeDropdown = () => {
  isOpen.value = false;
};

// 切换主题
const switchTheme = (themeId) => {
  // 移除所有主题类
  document.documentElement.classList.remove(...themes.map(t => t.id));
  
  // 如果不是默认主题，添加新主题类
  if (themeId !== 'default') {
    document.documentElement.classList.add(themeId);
  }
  
  // 更新当前主题
  currentTheme.value = themeId;
  
  // 保存到本地存储
  localStorage.setItem('selected-theme', themeId);
  
  // 关闭下拉菜单
  closeDropdown();
};

// 获取当前主题对象
const getCurrentTheme = () => {
  return themes.find(t => t.id === currentTheme.value) || themes[0];
};

// 监听点击事件，点击外部时关闭下拉菜单
onMounted(() => {
  // 从本地存储加载主题
  const savedTheme = localStorage.getItem('selected-theme');
  if (savedTheme) {
    switchTheme(savedTheme);
  }
  
  document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.theme-dropdown');
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown();
    }
  });
});

// 图标映射
const getIcon = (iconName) => {
  const icons = {
    circle: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>`,
    sun: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    moon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    cloud: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>`,
    palette: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r="2.5"></circle><circle cx="19" cy="13" r="2.5"></circle><circle cx="6" cy="12" r="2.5"></circle><circle cx="10" cy="18.5" r="2.5"></circle><path d="M13.5 9L19 10.5"></path><path d="M13.5 9L6 12"></path><path d="M6 12L10 16"></path><path d="M19 10.5L10 16"></path></svg>`
  };
  
  return icons[iconName] || icons.circle;
};
</script>

<template>
  <div class="theme-dropdown" @click.stop>
    <!-- 主题切换按钮 -->
    <button 
      class="theme-toggle-btn neu-flat-sm transition-500"
      @click="toggleDropdown"
      :title="'当前主题: ' + getCurrentTheme().name"
    >
      <span v-html="getIcon(getCurrentTheme().icon)" class="theme-icon"></span>
      <span class="theme-name">{{ getCurrentTheme().name }}</span>
      <span class="dropdown-arrow" :class="{ 'arrow-up': isOpen }">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </span>
    </button>
    
    <!-- 主题下拉菜单 -->
    <div class="theme-menu neu-flat transition-300" v-if="isOpen">
      <div 
        v-for="theme in themes" 
        :key="theme.id"
        class="theme-item transition-300"
        :class="{ 'active': currentTheme === theme.id }"
        @click="switchTheme(theme.id)"
      >
        <span v-html="getIcon(theme.icon)" class="theme-icon"></span>
        <span class="theme-item-name">{{ theme.name }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.theme-dropdown {
  position: relative;
  z-index: 100;
}

.theme-toggle-btn {
  display: flex;
  align-items: center;
  padding: 0.4rem 0.8rem;
  font-size: 0.75rem;
  border: none;
  outline: none;
  cursor: pointer;
  min-width: 6.5rem;
  height: 2rem;
  white-space: nowrap;
  position: relative;
}

.theme-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.4rem;
}

.theme-name {
  flex: 1;
}

.dropdown-arrow {
  margin-left: 0.3rem;
  transition: transform 0.3s ease;
}

.arrow-up {
  transform: rotate(180deg);
}

.theme-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 10rem;
  padding: 0.5rem;
  z-index: 101;
}

.theme-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  margin-bottom: 0.25rem;
  cursor: pointer;
  border-radius: 0.375rem;
  font-size: 0.75rem;
}

.theme-item:last-child {
  margin-bottom: 0;
}

.theme-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.theme-item.active {
  background-color: rgba(0, 0, 0, 0.1);
  font-weight: 500;
}

.theme-item-name {
  margin-left: 0.5rem;
}
</style>

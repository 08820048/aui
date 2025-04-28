/**
 * 风格配置文件
 * 定义所有可用的美化风格选项
 */
export const styleOptions = [
  {
    id: 'minimal-glass',
    name: '简约玻璃',
    description: '清爽通透的玻璃感设计',
    previewIcon: 'glass',
    isDefault: true
  },
  {
    id: 'tech-blue',
    name: '科技蓝',
    description: '现代科技感蓝色主题',
    previewIcon: 'tech',
    isDefault: false
  },
  {
    id: 'future-glow',
    name: '未来流光',
    description: '未来感科技流光效果',
    previewIcon: 'glow',
    isDefault: false
  },
  {
    id: 'dark-elegant',
    name: '暗黑优雅',
    description: '高端沉稳的暗色主题',
    previewIcon: 'dark',
    isDefault: false
  },
  {
    id: 'gradient-dream',
    name: '梦幻渐变',
    description: '柔和多彩的渐变风格',
    previewIcon: 'gradient',
    isDefault: false
  },
  {
    id: 'nature-fresh',
    name: '自然清新',
    description: '灵感源于自然的清新设计',
    previewIcon: 'nature',
    isDefault: false
  }
];

/**
 * 获取默认风格
 * @returns {Object} 默认风格配置
 */
export const getDefaultStyle = () => {
  return styleOptions.find(style => style.isDefault) || styleOptions[0];
};

/**
 * 根据ID获取风格
 * @param {string} id 风格ID
 * @returns {Object|null} 风格配置或null
 */
export const getStyleById = (id) => {
  return styleOptions.find(style => style.id === id) || null;
};

export default styleOptions;

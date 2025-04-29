import hljs from 'highlight.js/lib/core';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
// 使用自定义样式，不再导入预设样式
// import 'highlight.js/styles/atom-one-light.css';

// 注册需要的语言
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('javascript', javascript);

// 高亮函数
export const highlightCode = (code, language = 'html') => {
  if (!code) return '';

  try {
    if (language) {
      return hljs.highlight(code, { language }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  } catch (error) {
    console.error('Highlight error:', error);
    return code;
  }
};

// 创建一个Vue指令
export const highlightDirective = {
  mounted(el, binding) {
    const code = binding.value || el.textContent;
    const language = binding.arg || 'html';

    if (code) {
      el.innerHTML = highlightCode(code, language);
      el.classList.add('hljs');
    }
  },
  updated(el, binding) {
    const code = binding.value || el.textContent;
    const language = binding.arg || 'html';

    if (code) {
      el.innerHTML = highlightCode(code, language);
      el.classList.add('hljs');
    }
  }
};

// 创建一个Vue插件
export const highlightPlugin = {
  install(app) {
    app.directive('highlight', highlightDirective);
  }
};

export default highlightPlugin;

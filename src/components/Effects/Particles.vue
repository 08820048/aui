<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// 接收主题名称
const props = defineProps({
  theme: {
    type: String,
    default: ''
  }
});

// 粒子画布引用
const canvasRef = ref(null);
// 是否显示粒子
const showParticles = ref(false);
// 动画帧ID
let animationFrameId = null;
// 粒子数组
let particles = [];
// 画布上下文
let ctx = null;

// 粒子类
class Particle {
  constructor(canvas) {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = Math.random() * 0.5 - 0.25;
    this.speedY = Math.random() * 0.5 - 0.25;
    this.color = '#00D1FF';
    this.alpha = Math.random() * 0.5 + 0.1;
  }

  update(canvas) {
    this.x += this.speedX;
    this.y += this.speedY;

    // 边界检查
    if (this.x < 0 || this.x > canvas.width) {
      this.speedX = -this.speedX;
    }
    if (this.y < 0 || this.y > canvas.height) {
      this.speedY = -this.speedY;
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

// 初始化粒子
const initParticles = () => {
  if (!canvasRef.value) return;
  
  const canvas = canvasRef.value;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  ctx = canvas.getContext('2d');
  particles = [];
  
  // 创建粒子
  const particleCount = Math.floor((canvas.width * canvas.height) / 20000);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas));
  }
};

// 动画循环
const animate = () => {
  if (!ctx || !canvasRef.value) return;
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  particles.forEach(particle => {
    particle.update(canvasRef.value);
    particle.draw(ctx);
  });
  
  animationFrameId = requestAnimationFrame(animate);
};

// 调整画布大小
const handleResize = () => {
  if (!canvasRef.value) return;
  
  canvasRef.value.width = window.innerWidth;
  canvasRef.value.height = window.innerHeight;
  
  initParticles();
};

// 监听主题变化
watch(() => props.theme, (newTheme) => {
  showParticles.value = newTheme === 'theme-future-glow';
  
  if (showParticles.value) {
    initParticles();
    animate();
  } else if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}, { immediate: true });

// 组件挂载时初始化
onMounted(() => {
  window.addEventListener('resize', handleResize);
  
  if (props.theme === 'theme-future-glow') {
    showParticles.value = true;
    initParticles();
    animate();
  }
});

// 组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
});
</script>

<template>
  <canvas 
    v-if="showParticles" 
    ref="canvasRef" 
    class="particles"
  ></canvas>
</template>

<style scoped>
.particles {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}
</style>

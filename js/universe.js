(function () {
  // 1. 检测是否是暗色模式
  const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

  // 2. 核心星空逻辑
  function initUniverse() {
    // 移除旧的 canvas 防止重复生成
    let oldCanvas = document.getElementById('universe-canvas');
    if (oldCanvas) oldCanvas.remove();

    let canvas = document.createElement('canvas');
    canvas.id = 'universe-canvas';
    // 关键：设置样式确保铺满全屏且不挡鼠标
    canvas.style.cssText = 'position:fixed;top:0;left:0;z-index:-1;width:100%;height:100%;pointer-events:none;';
    document.body.appendChild(canvas);

    let ctx = canvas.getContext('2d');
    let width, height, stars = [];

    // 颜色配置
    let config = {
      starColor: isDark() ? '255, 255, 255' : '0, 0, 0', // 暗色模式白星星，亮色模式黑星星
      count: window.innerWidth * 0.1 // 星星数量
    };

    function resize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    }

    function initStars() {
      stars = [];
      for (let i = 0; i < config.count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 1.5, // 半径
          dx: (Math.random() - 0.5) * 0.5, // x速度
          dy: (Math.random() - 0.5) * 0.5, // y速度
          alpha: Math.random() // 透明度
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      // 更新颜色（为了响应主题切换）
      let color = isDark() ? '255, 255, 255' : '100, 100, 100';

      stars.forEach(star => {
        star.x += star.dx;
        star.y += star.dy;

        // 边界检测
        if (star.x < 0) star.x = width;
        if (star.x > width) star.x = 0;
        if (star.y < 0) star.y = height;
        if (star.y > height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${star.alpha})`;
        ctx.fill();
      });

      requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
    console.log('Universe active. Mode:', isDark() ? 'Dark' : 'Light');
  }

  // 3. 流星雨逻辑
  function initMeteors() {
    const header = document.getElementById('page-header');
    if (!header || !header.classList.contains('full_page')) return;

    // 清除旧的
    let oldField = document.getElementById('star-field');
    if (oldField) oldField.remove();

    const starField = document.createElement('div');
    starField.id = 'star-field';
    starField.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:2;overflow:hidden;';
    header.appendChild(starField);

    // 生成流星
    for (let i = 0; i < 5; i++) {
      let star = document.createElement('div');
      star.className = 'star-meteor';
      star.style.top = Math.random() * 60 + '%';
      star.style.left = Math.random() * 100 + '%';
      star.style.animationDelay = (Math.random() * 3) + 's';
      star.style.transform = `rotate(-45deg) scale(${0.5 + Math.random()})`;
      starField.appendChild(star);
    }
  }

  // 4. 启动函数
  function init() {
    initUniverse();
    initMeteors();
  }

  // 监听加载和 PJAX
  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
  // 监听主题切换（Butterfly 自带切换事件）
  window.addEventListener('theme-change', init);

})();

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const rightsideLabels = {
    'rightside-config': '侧栏设置',
    readmode: '沉浸阅读',
    'mobile-toc-button': '文章目录',
    darkmode: '明暗模式',
    'go-up': '返回顶部',
    'hide-aside-btn': '切换侧栏'
  };

  function enhanceRightside() {
    Object.entries(rightsideLabels).forEach(function ([id, text]) {
      const control = document.getElementById(id);
      if (!control || control.querySelector('.rightside-label')) return;

      const label = document.createElement('span');
      label.className = 'rightside-label';
      label.textContent = text;
      label.setAttribute('aria-hidden', 'true');
      control.appendChild(label);
      control.setAttribute('aria-label', text);
    });
  }

  function initRevealMotion() {
    const targets = document.querySelectorAll(
      '#recent-posts > .recent-post-item, .resource-card, .article-sort-item'
    );
    if (!targets.length) return;

    if (reduceMotion.matches || !('IntersectionObserver' in window)) {
      targets.forEach(function (target) {
        target.classList.add('motion-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-visible');
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: '0px 0px -7% 0px',
      threshold: 0.06
    });

    targets.forEach(function (target) {
      target.classList.add('motion-reveal');
      if (target.getBoundingClientRect().top < window.innerHeight * 0.94) {
        target.classList.add('motion-visible');
      } else {
        observer.observe(target);
      }
    });
  }

  function initSignalCanvas() {
    const header = document.querySelector('#page-header.full_page');
    if (!header || header.querySelector('#signal-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'signal-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    header.appendChild(canvas);

    const context = canvas.getContext('2d', { alpha: true });
    if (!context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let pointerTarget = 0.5;
    let pointerCurrent = 0.5;

    function resize() {
      const bounds = header.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(Math.round(bounds.width), 1);
      height = Math.max(Math.round(bounds.height), 1);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(performance.now());
    }

    function draw(time) {
      context.clearRect(0, 0, width, height);
      pointerCurrent += (pointerTarget - pointerCurrent) * 0.045;

      const baseY = height * 0.83;
      const phase = time * 0.0011;
      const pointerX = pointerCurrent * width;
      const line = new Path2D();

      for (let x = 0; x <= width + 6; x += 6) {
        const distance = Math.abs(x - pointerX);
        const influence = Math.max(0, 1 - distance / Math.max(width * 0.22, 1));
        const wave = Math.sin(x * 0.018 + phase) * 3.2;
        const detail = Math.sin(x * 0.006 - phase * 0.7) * 2;
        const response = Math.sin(influence * Math.PI) * 9;
        const y = baseY + wave + detail - response;
        if (x === 0) line.moveTo(x, y);
        else line.lineTo(x, y);
      }

      const gradient = context.createLinearGradient(0, 0, width, 0);
      gradient.addColorStop(0, 'rgba(126, 231, 135, 0)');
      gradient.addColorStop(0.16, 'rgba(126, 231, 135, 0.34)');
      gradient.addColorStop(0.68, 'rgba(121, 192, 255, 0.28)');
      gradient.addColorStop(1, 'rgba(121, 192, 255, 0)');

      context.strokeStyle = gradient;
      context.lineWidth = 1;
      context.stroke(line);

      context.beginPath();
      context.moveTo(0, baseY + 17.5);
      context.lineTo(width, baseY + 17.5);
      context.strokeStyle = 'rgba(139, 148, 158, 0.09)';
      context.stroke();

      const markerX = reduceMotion.matches ? width * 0.72 : (time * 0.055) % (width + 100) - 50;
      context.fillStyle = 'rgba(126, 231, 135, 0.66)';
      context.fillRect(markerX, baseY + 14, 18, 1);
    }

    function animate(time) {
      draw(time);
      frame = window.requestAnimationFrame(animate);
    }

    header.addEventListener('pointermove', function (event) {
      const bounds = header.getBoundingClientRect();
      pointerTarget = Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1);
    }, { passive: true });

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(header);

    document.addEventListener('visibilitychange', function () {
      window.cancelAnimationFrame(frame);
      if (!document.hidden && !reduceMotion.matches) frame = window.requestAnimationFrame(animate);
    });

    resize();
    if (!reduceMotion.matches) frame = window.requestAnimationFrame(animate);
  }

  function init() {
    enhanceRightside();
    initRevealMotion();
    initSignalCanvas();
  }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('pjax:complete', init);
})();

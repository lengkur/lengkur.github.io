(function () {
  const MIN_FONT_SIZE = 14;
  const MAX_FONT_SIZE = 21;
  const DEFAULT_FONT_SIZE = 17;
  const STORAGE_KEY = 'lengkur-reading-font-size-v2';

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getSavedFontSize() {
    const saved = Number(window.localStorage.getItem(STORAGE_KEY));
    return Number.isFinite(saved) && saved >= MIN_FONT_SIZE && saved <= MAX_FONT_SIZE
      ? saved
      : DEFAULT_FONT_SIZE;
  }

  function initReadingTools() {
    const post = document.getElementById('post');
    const content = post && post.querySelector('.post-content');
    if (!post || !content || document.getElementById('reading-toolbar')) return;

    let fontSize = getSavedFontSize();
    document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`);

    const progressBar = document.createElement('div');
    progressBar.id = 'reading-progress-bar';
    progressBar.setAttribute('aria-hidden', 'true');

    const toolbar = document.createElement('div');
    toolbar.id = 'reading-toolbar';
    toolbar.setAttribute('aria-label', '阅读工具');
    toolbar.innerHTML = `
      <span class="reading-status">
        <i class="fas fa-chart-line" aria-hidden="true"></i>
        阅读进度 <strong data-reading-progress>0%</strong>
      </span>
      <div class="reading-actions" role="group" aria-label="正文显示设置">
        <button type="button" data-font-step="-1" title="减小正文字号" aria-label="减小正文字号">A-</button>
        <button type="button" data-font-reset title="恢复默认字号" aria-label="恢复默认字号">
          <span class="font-size-label">${fontSize}px</span>
        </button>
        <button type="button" data-font-step="1" title="增大正文字号" aria-label="增大正文字号">A+</button>
        <button type="button" class="reading-mode-button" data-read-mode title="进入沉浸阅读" aria-label="进入沉浸阅读">
          <i class="fas fa-book-open" aria-hidden="true"></i>
          <span>沉浸阅读</span>
        </button>
      </div>
    `;

    document.body.appendChild(progressBar);
    post.insertBefore(toolbar, content);

    const progressText = toolbar.querySelector('[data-reading-progress]');
    const fontSizeLabel = toolbar.querySelector('.font-size-label');

    function applyFontSize(nextSize) {
      fontSize = clamp(nextSize, MIN_FONT_SIZE, MAX_FONT_SIZE);
      document.documentElement.style.setProperty('--reading-font-size', `${fontSize}px`);
      window.localStorage.setItem(STORAGE_KEY, String(fontSize));
      if (fontSizeLabel) fontSizeLabel.textContent = `${fontSize}px`;
    }

    function updateProgress() {
      const rect = content.getBoundingClientRect();
      const start = window.scrollY + rect.top - window.innerHeight * 0.28;
      const distance = Math.max(content.offsetHeight - window.innerHeight * 0.5, 1);
      const percentage = clamp(Math.round(((window.scrollY - start) / distance) * 100), 0, 100);
      progressBar.style.width = `${percentage}%`;
      progressText.textContent = `${percentage}%`;
    }

    toolbar.addEventListener('click', function (event) {
      const stepButton = event.target.closest('[data-font-step]');
      const resetButton = event.target.closest('[data-font-reset]');
      const readModeButton = event.target.closest('[data-read-mode]');

      if (stepButton) applyFontSize(fontSize + Number(stepButton.dataset.fontStep));
      if (resetButton) applyFontSize(DEFAULT_FONT_SIZE);
      if (readModeButton) {
        const nativeReadModeButton = document.getElementById('readmode');
        if (nativeReadModeButton) nativeReadModeButton.click();
      }
    });

    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

  document.addEventListener('DOMContentLoaded', initReadingTools);
  document.addEventListener('pjax:complete', initReadingTools);
})();

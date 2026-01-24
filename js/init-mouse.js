function isMobile() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function initCursor() {
  if (isMobile()) return;

  if (window._mf) {
    window._mf.destroy();
  }

  window._mf = new MouseFollower({
    speed: 0.45,
    skewing: 4,
    stateDetection: {
      '-pointer': 'a,button,code',
      '-hidden': 'iframe'
    }
  });
}

document.addEventListener('DOMContentLoaded', initCursor);
document.addEventListener('pjax:complete', initCursor);

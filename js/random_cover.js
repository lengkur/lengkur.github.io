// source/js/random_cover.js

(function () {
  // 1. 定义你喜欢的颜色列表 (这里选了一组好看的 Material Design 配色)
  // 你可以随意增删改这些颜色代码
  const coverColors = [
    '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5',
    '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50',
    '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800',
    '#FF5722', '#795548', '#9E9E9E', '#607D8B', '#2c3e50',
    '#e74c3c', '#3498db', '#8e44ad', '#16a085', '#f39c12'
  ];

  function getRandomColor() {
    return coverColors[Math.floor(Math.random() * coverColors.length)];
  }

  function setRandomCover() {
    // 选出所有文章封面图的元素
    // 包括：首页文章卡片、侧边栏最新文章、归档页面缩略图
    const imgs = document.querySelectorAll('.recent-post-item .post_cover img, .article-sort-item-img img, .aside-content .item-thumbnail img');

    imgs.forEach(img => {
      // 1. 找到图片的父容器
      const parent = img.parentElement;

      // 2. 如果父容器还没上色，就上个色 (防止 PJAX 重复上色)
      if (!parent.getAttribute('data-colored')) {
        const color = getRandomColor();

        // 设置父容器背景色
        parent.style.backgroundColor = color;
        parent.style.backgroundImage = 'none'; // 移除可能存在的背景图

        // 标记已处理
        parent.setAttribute('data-colored', 'true');

        // 3. 关键：把图片变成完全透明，但保留占位，这样高度不会塌陷
        img.style.opacity = '0';
      }
    });
  }

  // 这里的逻辑确保脚本在页面加载和切换时都运行
  document.addEventListener('DOMContentLoaded', setRandomCover);
  document.addEventListener('pjax:complete', setRandomCover);

})();

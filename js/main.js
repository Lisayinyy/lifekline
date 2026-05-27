// main.js - 应用入口
// version: 20260527-4

import { renderApp, state } from './pages.js?v=20260527-4';

console.log('[lifekline] main.js loaded');

document.addEventListener('DOMContentLoaded', () => {
  console.log('[lifekline] DOMContentLoaded');
  const app = document.getElementById('app');
  if (!app) {
    console.error('[lifekline] #app not found');
    return;
  }

  try {
    // 初始化路由
    renderApp(app);
    console.log('[lifekline] renderApp done');
  } catch (err) {
    console.error('[lifekline] renderApp failed:', err);
    app.innerHTML = `<div style="padding:20px;color:#dc2626;">初始化失败: ${err.message}</div>`;
  }

  // 处理浏览器前进后退
  window.addEventListener('popstate', () => {
    renderApp(app);
  });
});

// 暴露到全局方便调试
window.__lifekline = { state, renderApp };

// kline.js - Canvas K线图绘制

import { TIANGAN, DIZHI, WUXING, WUXING_COLOR } from './bazi.js?v=20260527-4';

export class KlineChart {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.data = [];
    this.dayunList = [];
    this.tooltip = null;
    this.dpr = window.devicePixelRatio || 1;
    this.birthYear = 2003;
    this.currentYear = new Date().getFullYear();

    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    canvas.addEventListener('mousemove', this.handleMouseMove);
    canvas.addEventListener('mouseleave', this.handleMouseLeave);
  }

  setData(data, dayunList, birthYear) {
    this.data = data;
    this.dayunList = dayunList;
    this.birthYear = birthYear;
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height || 500;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    // 每次 resize 重置 transform 避免累积缩放
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.draw();
  }

  // 计算每个柱子的X位置
  getBarLayout() {
    const padding = { left: 50, right: 20, top: 60, bottom: 50 };
    const innerW = this.width - padding.left - padding.right;
    const innerH = this.height - padding.top - padding.bottom;
    const n = this.data.length;
    const barWidth = Math.max(2, Math.min(12, innerW / n * 0.7));
    const slotWidth = innerW / n;

    return { padding, innerW, innerH, barWidth, slotWidth };
  }

  ageToX(age, layout) {
    const { padding, slotWidth } = layout;
    return padding.left + (age - 1 + 0.5) * slotWidth;
  }

  scoreToY(score, layout) {
    const { padding, innerH } = layout;
    // score 0~100 -> y 100~0
    return padding.top + innerH - (score / 100) * innerH;
  }

  draw() {
    if (!this.data.length) return;
    const ctx = this.ctx;
    const layout = this.getBarLayout();

    ctx.clearRect(0, 0, this.width, this.height);

    this.drawTitle();
    this.drawGrid(layout);
    this.drawDayunAreas(layout);
    this.drawDayunLabels(layout);
    this.drawBars(layout);
    this.drawAxes(layout);
    this.drawLegend();
    this.drawCurrentYearMarker(layout);
  }

  drawTitle() {
    const ctx = this.ctx;
    ctx.fillStyle = '#1f2937';
    ctx.font = '600 14px "Noto Serif SC", serif';
    ctx.textAlign = 'left';
    ctx.fillText('百岁流年走势图 (100年)', 20, 22);

    ctx.fillStyle = '#9ca3af';
    ctx.font = '11px "Inter", sans-serif';
    ctx.fillText('绿色K线代表运势上涨（吉），红色K线代表运势下跌（凶）', 20, 40);
  }

  drawGrid(layout) {
    const ctx = this.ctx;
    const { padding, innerW, innerH } = layout;

    // 水平网格线（0, 25, 50, 75, 100）
    ctx.strokeStyle = '#f3f4f6';
    ctx.lineWidth = 1;
    ctx.font = '10px "Inter", sans-serif';
    ctx.fillStyle = '#9ca3af';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    [0, 25, 50, 75, 100].forEach(s => {
      const y = this.scoreToY(s, layout);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(padding.left + innerW, y);
      ctx.stroke();
      ctx.fillText(String(s), padding.left - 8, y);
    });

    // 50分中线
    ctx.strokeStyle = '#e5e7eb';
    ctx.setLineDash([4, 4]);
    const y50 = this.scoreToY(50, layout);
    ctx.beginPath();
    ctx.moveTo(padding.left, y50);
    ctx.lineTo(padding.left + innerW, y50);
    ctx.stroke();
    ctx.setLineDash([]);

    // 垂直虚线标记大运更替
    ctx.strokeStyle = '#e5e7eb';
    ctx.setLineDash([2, 4]);
    this.dayunList.forEach(d => {
      if (d.startAge > 1 && d.startAge <= 100) {
        const x = this.ageToX(d.startAge, layout) - layout.slotWidth / 2;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + innerH);
        ctx.stroke();
      }
    });
    ctx.setLineDash([]);
  }

  drawDayunAreas(layout) {
    const ctx = this.ctx;
    const { padding, innerH } = layout;

    // 大运更替用浅色背景区
    const colors = ['#fef3c7', '#fce7f3', '#ddd6fe', '#bfdbfe', '#a7f3d0',
                    '#fed7aa', '#e0e7ff', '#fde68a', '#fbcfe8', '#c7d2fe'];
    let prevEnd = 1;
    this.dayunList.forEach((d, i) => {
      if (d.startAge > 100) return;
      const startX = this.ageToX(Math.max(d.startAge, prevEnd), layout) - layout.slotWidth / 2;
      const endAge = Math.min(d.endAge, 100);
      const endX = this.ageToX(endAge, layout) + layout.slotWidth / 2;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(99, 102, 241, 0.04)' : 'rgba(99, 102, 241, 0.02)';
      ctx.fillRect(startX, padding.top, endX - startX, innerH);
    });
  }

  drawDayunLabels(layout) {
    const ctx = this.ctx;
    const { padding } = layout;

    ctx.font = '500 11px "Noto Serif SC", serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    this.dayunList.forEach(d => {
      if (d.startAge > 100) return;
      const centerAge = Math.min(d.startAge + 4, 100);
      const x = this.ageToX(centerAge, layout);
      // 大运天干
      const tg = d.gz.charAt(0);
      const tgWx = WUXING[tg];
      ctx.fillStyle = WUXING_COLOR[tgWx] || '#374151';
      ctx.fillText(d.gz, x, padding.top - 28);
      // 起止年龄
      ctx.fillStyle = '#9ca3af';
      ctx.font = '9px "Inter", sans-serif';
      const endA = Math.min(d.endAge, 100);
      ctx.fillText(`${d.startAge}-${endA}岁`, x, padding.top - 14);
      ctx.font = '500 11px "Noto Serif SC", serif';
    });
  }

  drawBars(layout) {
    const ctx = this.ctx;
    const { barWidth } = layout;

    this.data.forEach(d => {
      const x = this.ageToX(d.age, layout);
      const isBullish = d.isBullish;
      const color = isBullish ? '#16a34a' : '#dc2626';

      const yHigh = this.scoreToY(d.high, layout);
      const yLow = this.scoreToY(d.low, layout);
      const yOpen = this.scoreToY(d.open, layout);
      const yClose = this.scoreToY(d.close, layout);

      // 影线
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // 实体
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(1, Math.abs(yOpen - yClose));
      ctx.fillStyle = isBullish ? '#16a34a' : '#dc2626';
      ctx.fillRect(x - barWidth / 2, bodyTop, barWidth, bodyHeight);
    });
  }

  drawAxes(layout) {
    const ctx = this.ctx;
    const { padding, innerH, slotWidth } = layout;

    // Y轴
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, padding.top + innerH);
    ctx.lineTo(padding.left + this.width - padding.left - padding.right, padding.top + innerH);
    ctx.stroke();

    // Y轴标签
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px "Inter", sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.save();
    ctx.translate(14, padding.top + innerH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('运势分', 0, 0);
    ctx.restore();

    // X轴年龄刻度（每10岁）
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#9ca3af';
    for (let age = 1; age <= 100; age += 10) {
      const x = this.ageToX(age, layout);
      ctx.fillText(String(age), x, padding.top + innerH + 6);
    }

    // X轴标签
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px "Noto Serif SC", serif';
    ctx.fillText('年龄', padding.left + (this.width - padding.left - padding.right) / 2, padding.top + innerH + 28);
  }

  drawLegend() {
    const ctx = this.ctx;
    const x = this.width - 160;
    const y = 16;

    ctx.font = '11px "Inter", sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // 吉
    ctx.fillStyle = '#16a34a';
    ctx.beginPath();
    ctx.arc(x + 6, y + 6, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#374151';
    ctx.fillText('吉运 (涨)', x + 16, y + 6);

    // 凶
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(x + 6, y + 24, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#374151';
    ctx.fillText('凶运 (跌)', x + 16, y + 24);
  }

  drawCurrentYearMarker(layout) {
    const currentAge = this.currentYear - this.birthYear + 1;
    if (currentAge < 1 || currentAge > 100) return;
    const ctx = this.ctx;
    const { padding, innerH } = layout;
    const x = this.ageToX(currentAge, layout);

    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(x, padding.top);
    ctx.lineTo(x, padding.top + innerH);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#1e3a8a';
    ctx.font = '500 10px "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('今', x, padding.top - 4);
  }

  handleMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const layout = this.getBarLayout();
    const { padding, slotWidth } = layout;

    if (x < padding.left || x > padding.left + layout.innerW) {
      this.hideTooltip();
      return;
    }

    const age = Math.floor((x - padding.left) / slotWidth) + 1;
    if (age < 1 || age > 100) {
      this.hideTooltip();
      return;
    }
    const d = this.data[age - 1];
    if (!d) return;

    this.showTooltip(d, e.clientX, e.clientY, rect);
  }

  handleMouseLeave() {
    this.hideTooltip();
  }

  showTooltip(d, clientX, clientY, rect) {
    let tooltip = this.tooltip;
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'chart-tooltip';
      this.canvas.parentElement.appendChild(tooltip);
      this.tooltip = tooltip;
    }
    const isBullish = d.isBullish;
    const color = isBullish ? '#16a34a' : '#dc2626';
    const arrow = isBullish ? '▲' : '▼';
    const status = isBullish ? '吉' : '凶';

    tooltip.innerHTML = `
      <div style="font-weight: 600; color: #111827; font-size: 13px; margin-bottom: 6px;">
        ${d.yearGz}年 · ${d.age}岁
      </div>
      <div style="color: #6b7280; font-size: 11px; margin-bottom: 8px;">
        大运：${d.dayun} · 流年：${d.yearGz}
      </div>
      <div style="color: ${color}; font-weight: 600; font-size: 13px; margin-bottom: 6px;">
        ${status} ${arrow} (${d.score}分)
      </div>
      <div style="display: grid; grid-template-columns: auto 1fr; gap: 4px 12px; font-size: 11px; color: #4b5563;">
        <span>开盘</span><span style="font-weight: 500;">${d.open}</span>
        <span>收盘</span><span style="font-weight: 500;">${d.close}</span>
        <span>最高</span><span style="font-weight: 500;">${d.high}</span>
        <span>最低</span><span style="font-weight: 500;">${d.low}</span>
      </div>
      <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6; font-size: 11px; color: #6b7280; line-height: 1.5;">
        ${this.getYearAnalysis(d)}
      </div>
    `;

    let left = clientX + 14;
    let top = clientY + 14;
    const tw = tooltip.offsetWidth || 240;
    const th = tooltip.offsetHeight || 200;
    if (left + tw + 10 > window.innerWidth) left = clientX - tw - 14;
    if (top + th + 10 > window.innerHeight) top = clientY - th - 14;
    if (left < 4) left = 4;
    if (top < 4) top = 4;

    tooltip.style.left = (left + window.scrollX) + 'px';
    tooltip.style.top = (top + window.scrollY) + 'px';
    tooltip.classList.add('visible');
  }

  hideTooltip() {
    if (this.tooltip) {
      this.tooltip.classList.remove('visible');
    }
  }

  getYearAnalysis(d) {
    // 简单的流年分析
    const gz = d.yearGz;
    const tg = gz.charAt(0);
    const dz = gz.charAt(1);
    const wx = WUXING[tg];
    const dayunTg = d.dayun.charAt(0);
    const dayunWx = WUXING[dayunTg];

    if (d.isBullish) {
      const intros = [
        `${tg}${dz}年，${wx}气流通，主积极进取，贵人相助。`,
        `流年${tg}${dz}，大运${d.dayun}扶持，运势上扬，宜把握机遇。`,
        `${wx}旺相，诸事顺遂，可大胆规划，谋定而后动。`,
        `大运流年相生，主喜事临门，利学业、事业开拓。`,
      ];
      return intros[d.age % intros.length];
    } else {
      const intros = [
        `${tg}${dz}年，${wx}气受制，宜守不宜攻，稳中求进。`,
        `流年${tg}${dz}克泄交加，主波折，需谨慎决策。`,
        `运势走低，凡事宜低调处理，注意健康与人际。`,
        `大运流年不和，宜修身养性，等待时机。`,
      ];
      return intros[d.age % intros.length];
    }
  }

  destroy() {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mouseleave', this.handleMouseLeave);
    if (this.tooltip) this.tooltip.remove();
  }
}

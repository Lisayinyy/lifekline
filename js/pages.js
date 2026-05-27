// pages.js - 输入页与结果页渲染

import {
  TIANGAN, DIZHI, JIAZI, WUXING, NAYIN, DIZHI_CANGGAN,
  getShishen, buildDayunList, generateKlineData, parseGanZhi,
  getYearGzBySolar, getMonthGzBySolar, getHourZhi,
  lookupBaziBySolarPrecise
} from './bazi.js?v=20260527-4';
import { generateAnalysis } from './analysis.js?v=20260527-4';
import { KlineChart } from './kline.js?v=20260527-4';

// 全局状态
export const state = {
  view: 'landing',  // landing | result
  form: {
    name: '我',
    gender: '男',
    birthYear: 2003,
    yearGz: '癸未',
    monthGz: '丙辰',
    dayGz: '己未',
    hourGz: '丙寅',
    qiyunAge: 3,
    firstDayun: '丁卯',
    dayunDirection: '顺',
  },
  result: null,
};

// 渲染入口
export function renderApp(container) {
  if (state.view === 'landing') {
    renderLanding(container);
  } else if (state.view === 'result') {
    renderResult(container);
  }
}

// ============================================================
// 输入页
// ============================================================
function renderLanding(container) {
  container.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <!-- Header -->
      <header class="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <div class="flex items-center gap-2">
          <div class="relative w-8 h-8">
            <svg viewBox="0 0 32 32" class="w-8 h-8">
              <path d="M16 4 L18 14 L28 16 L18 18 L16 28 L14 18 L4 16 L14 14 Z" fill="#1e3a8a"/>
              <circle cx="16" cy="16" r="2" fill="#fbbf24"/>
            </svg>
          </div>
          <div>
            <div class="font-semibold text-gray-900 text-base leading-tight">人生K线</div>
            <div class="text-[10px] text-gray-400 tracking-wider uppercase">Life Destiny K-Line</div>
          </div>
        </div>
        <div class="px-3 py-1.5 bg-gray-100 rounded-md text-xs text-gray-500 hidden sm:block">
          基于 AI 大模型驱动
        </div>
      </header>

      <!-- Hero -->
      <section class="px-6 pt-8 pb-12 text-center max-w-3xl mx-auto">
        <h1 class="hero-title text-4xl sm:text-5xl font-serif-sc font-semibold leading-tight gradient-text mb-6">
          洞悉命运起伏<br/>预见人生轨迹
        </h1>
        <p class="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
          将传统八字命理与金融数据可视化结合，<br/>
          把人生运势比作股票K线图，让命运起伏一目了然。<br/>
          帮您发现「人生牛市」，规避「风险熊市」。
        </p>
        <div class="mt-6">
          <button id="btn-tutorial" class="tutorial-btn inline-flex items-center gap-2 px-4 py-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
            </svg>
            查看使用教程
          </button>
        </div>
      </section>

      <!-- Main Card -->
      <section class="px-4 pb-16 flex-1">
        <div class="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Card Header -->
          <div class="px-6 sm:px-8 pt-8 pb-6 border-b border-gray-100">
            <div class="flex items-center gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-xl font-semibold text-gray-900">八字排盘</h2>
                <p class="text-xs text-gray-400">请输入四柱与大运信息以生成分析</p>
              </div>
            </div>
          </div>

          <!-- Form -->
          <form id="bazi-form" class="p-6 sm:p-8 space-y-6">
            <!-- 基础信息 -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">姓名 (可选)</label>
                <input id="input-name" type="text" value="${state.form.name}" placeholder="我"
                  class="input-field w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">性别</label>
                <div class="flex gap-2">
                  <button type="button" data-gender="男"
                    class="toggle-btn flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${state.form.gender === '男' ? 'active border-blue-300' : 'border-gray-300 text-gray-500'}">
                    乾造 (男)
                  </button>
                  <button type="button" data-gender="女"
                    class="toggle-btn flex-1 px-4 py-2 border rounded-lg text-sm font-medium ${state.form.gender === '女' ? 'active border-blue-300' : 'border-gray-300 text-gray-500'}">
                    坤造 (女)
                  </button>
                </div>
              </div>
            </div>

            <!-- 干支速查助手 -->
            <div class="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <div class="flex items-center gap-2 mb-3">
                <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                <span class="text-sm font-medium text-gray-800">干支速查助手</span>
                <span class="ml-auto text-[10px] text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">不会八字也能用</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-3">
                <div>
                  <label class="block text-xs text-gray-600 mb-1">阳历年</label>
                  <input id="lookup-year" type="number" min="1900" max="2100" value="${state.form.birthYear}"
                    class="lookup-input w-full px-2 py-1.5 border border-purple-200 rounded text-sm bg-white text-center" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">月</label>
                  <input id="lookup-month" type="number" min="1" max="12" value="1"
                    class="lookup-input w-full px-2 py-1.5 border border-purple-200 rounded text-sm bg-white text-center" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">日</label>
                  <input id="lookup-day" type="number" min="1" max="31" value="1"
                    class="lookup-input w-full px-2 py-1.5 border border-purple-200 rounded text-sm bg-white text-center" />
                </div>
                <div>
                  <label class="block text-xs text-gray-600 mb-1">出生时辰</label>
                  <select id="lookup-hour" class="lookup-input w-full px-2 py-1.5 border border-purple-200 rounded text-sm bg-white text-center">
                    <option value="">不详</option>
                    ${Array.from({length: 24}, (_, h) => `<option value="${h}">${h.toString().padStart(2,'0')}:00</option>`).join('')}
                  </select>
                </div>
              </div>

              <button type="button" id="btn-lookup" class="w-full py-2 mb-3 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition">
                ⚡ 一键查询年柱、月柱、时支
              </button>

              <div id="lookup-result" class="hidden bg-white rounded-lg p-3 border border-purple-200 text-xs space-y-1.5">
                <div class="flex justify-between"><span class="text-gray-500">年柱</span><span id="lookup-year-gz" class="font-semibold text-gray-900 font-serif-sc">--</span></div>
                <div class="flex justify-between"><span class="text-gray-500">月柱（参考）</span><span id="lookup-month-gz" class="font-semibold text-gray-900 font-serif-sc">--</span></div>
                <div class="flex justify-between"><span class="text-gray-500"><strong>日柱（自动）</strong></span><span id="lookup-day-gz" class="font-semibold text-green-700 font-serif-sc">--</span></div>
                <div class="flex justify-between"><span class="text-gray-500">时支（按时辰）</span><span id="lookup-hour-zhi" class="font-semibold text-gray-900 font-serif-sc">--</span></div>
                <div class="mt-2 pt-2 border-t border-dashed border-purple-200 text-[10px] text-emerald-700 bg-emerald-50 -mx-3 -mb-3 px-3 py-2 rounded-b-lg">
                  ✅ <strong>日柱已自动反查</strong>（基准 1900-01-01 = 甲戌日，60天循环，1900-2100 有效）。<br/>
                  ℹ️ 年柱按立春、月柱按节气、时支按出生时辰，均为参考值；<strong>时干需按"日上起时"口诀补全</strong>：甲己还加甲，乙庚丙作初，丙辛从戊起，丁壬庚子居，戊癸壬子起。
                </div>
              </div>
            </div>

            <!-- 四柱干支 -->
            <div class="bg-orange-50 rounded-xl p-5 border border-orange-200">
              <!-- 八字科普卡：告诉用户怎么从公历日期对应到四柱 -->
              <div class="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border border-amber-200">
                <div class="flex items-start gap-2 mb-2">
                  <span class="text-base">📖</span>
                  <div class="flex-1">
                    <div class="text-sm font-semibold text-gray-800 mb-1">什么是四柱八字？怎么查？</div>
                    <div class="text-xs text-gray-600 leading-relaxed space-y-1">
                      <p><strong>四柱 = 出生时间的 4 组干支</strong>，共 8 个字，所以叫"八字"：</p>
                      <ul class="ml-4 space-y-0.5 text-[11px]">
                        <li>• <strong>年柱</strong>：出生<em>年份</em>对应的干支（按立春划分）</li>
                        <li>• <strong>月柱</strong>：出生<em>月份</em>对应的干支（按节气，非公历月份）</li>
                        <li>• <strong>日柱</strong>：出生<em>日</em>对应的干支（60 天一循环）</li>
                        <li>• <strong>时柱</strong>：出生<em>时辰</em>对应的干支（2 小时一个时辰）</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div class="mt-3 pt-3 border-t border-amber-200">
                  <div class="text-xs text-gray-700 mb-2"><strong>🔍 不知道怎么查？两种方法：</strong></div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div class="bg-white/70 rounded p-2">
                      <div class="font-medium text-gray-800 mb-1">方法 1：百度搜索（最快）</div>
                      <div class="text-gray-600">搜索 <code class="bg-amber-100 px-1 rounded">"1985年6月15日 八字"</code> → 找到结果中的"年柱 月柱 日柱 时柱"4 个词</div>
                    </div>
                    <div class="bg-white/70 rounded p-2">
                      <div class="font-medium text-gray-800 mb-1">方法 2：万年历 APP</div>
                      <div class="text-gray-600">下载"问真八字""玄奥八字""排盘大师"任一 APP，输入阳历生日即可看到四柱</div>
                    </div>
                  </div>
                  <div class="mt-2 text-[11px] text-gray-600 bg-white/70 rounded p-2">
                    <strong>💡 示例对照</strong>：阳历 <strong>2003年1月15日 上午10点</strong>生 → 八字为 <span class="font-serif-sc font-semibold text-gray-900">壬午 癸丑 甲子 己巳</span>
                    <br/>对照填写：年柱=<code class="bg-amber-100 px-1 rounded">壬午</code> 月柱=<code class="bg-amber-100 px-1 rounded">癸丑</code> 日柱=<code class="bg-amber-100 px-1 rounded">甲子</code> 时柱=<code class="bg-amber-100 px-1 rounded">己巳</code>
                  </div>
                </div>
              </div>
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="text-sm font-medium text-gray-800">请输入四柱干支</span>
              </div>

              <div class="mb-4">
                <label class="block text-xs font-medium text-gray-600 mb-1.5">出生年份 (阳历)</label>
                <input id="input-birth-year" type="number" value="${state.form.birthYear}" min="1900" max="2100"
                  class="input-field w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white" />
              </div>

              <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                ${[
                  { label: '年柱', field: 'yearGz', tip: '出生年的干支，如甲子', ph: '甲子' },
                  { label: '月柱', field: 'monthGz', tip: '出生月的干支（按节气分月）', ph: '丙寅' },
                  { label: '日柱', field: 'dayGz', tip: '⚠️ 必须查万年历，本工具无法推算', ph: '戊辰' },
                  { label: '时柱', field: 'hourGz', tip: '出生时辰的干支', ph: '庚午' },
                ].map(({label, field, tip, ph}) => `
                  <div>
                    <label class="block text-xs font-medium text-gray-600 mb-1.5">${label}</label>
                    <input data-pillar="${field}" type="text" value="${state.form[field]}"
                      placeholder="${ph}" maxlength="2" title="${tip}"
                      class="input-field pillar-input w-full px-3 py-2 border border-orange-200 rounded-lg text-sm bg-white text-center font-serif-sc" />
                    <p class="text-[10px] text-gray-400 mt-1 leading-tight">${tip}</p>
                  </div>
                `).join('')}
              </div>

              <div class="mt-3 flex items-center gap-2 text-[11px] text-amber-700 bg-amber-50 rounded-lg px-3 py-2 border border-amber-200">
                <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
                </svg>
                <span>不知道自己的八字？用上方「干支速查助手」可获取年柱/月柱，<strong>日柱需查万年历</strong>（百度搜"X年X月X日 八字"即可）</span>
              </div>

              <div id="pillar-preview" class="mt-4 grid grid-cols-4 gap-2 text-center text-xs text-gray-500">
                ${renderPillarPreview()}
              </div>
            </div>

            <!-- 大运信息 -->
            <div class="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div class="flex items-center gap-2 mb-4">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
                <span class="text-sm font-medium text-gray-800">大运排盘信息 (必填)</span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">起运年龄 (虚岁)</label>
                  <input id="input-qiyun-age" type="number" value="${state.form.qiyunAge}" min="0" max="20"
                    class="input-field w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white" />
                </div>
                <div>
                  <label class="block text-xs font-medium text-gray-600 mb-1.5">第一步大运</label>
                  <input id="input-first-dayun" type="text" value="${state.form.firstDayun}" maxlength="2"
                    placeholder="如：丁卯"
                    class="input-field w-full px-3 py-2 border border-blue-200 rounded-lg text-sm bg-white text-center font-serif-sc" />
                </div>
              </div>

              <div class="mt-3 flex items-center gap-2 text-xs">
                <span class="text-gray-500">大运排序：</span>
                <div class="flex gap-1">
                  <button type="button" data-direction="顺"
                    class="toggle-btn px-3 py-1 border rounded text-xs ${state.form.dayunDirection === '顺' ? 'active border-blue-300' : 'border-gray-300 text-gray-500'}">
                    顺排
                  </button>
                  <button type="button" data-direction="逆"
                    class="toggle-btn px-3 py-1 border rounded text-xs ${state.form.dayunDirection === '逆' ? 'active border-blue-300' : 'border-gray-300 text-gray-500'}">
                    逆排
                  </button>
                </div>
                <span id="dayun-hint" class="ml-auto text-blue-600"></span>
              </div>
            </div>

            <!-- Submit -->
            <button id="btn-generate" type="submit"
              class="cta-button w-full py-3.5 rounded-xl text-white font-medium flex items-center justify-center gap-2 text-base">
              <svg class="w-5 h-5 star-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              生成人生K线
            </button>

            <p class="text-xs text-center text-gray-400">
              仅供娱乐学习 · 切勿迷信
            </p>
          </form>
        </div>
      </section>

      <footer class="px-6 py-6 text-center text-xs text-gray-400">
        <p>人生K线 · 命运可视化 · AI + 八字命理</p>
      </footer>
    </div>
  `;

  attachLandingHandlers(container);
}

function renderPillarPreview() {
  const fields = ['yearGz', 'monthGz', 'dayGz', 'hourGz'];
  const labels = ['年柱', '月柱', '日柱', '时柱'];
  const dayMaster = state.form.dayGz.charAt(0);
  return fields.map((f, i) => {
    const gz = state.form[f];
    const tg = gz.charAt(0);
    const ss = i === 2 ? '日主' : getShishen(dayMaster, tg);
    return `
      <div class="bg-white/60 rounded p-2">
        <div class="text-[10px] text-gray-400 mb-0.5">${labels[i]}</div>
        <div class="font-serif-sc text-base text-gray-800 font-semibold">${gz || '--'}</div>
        <div class="text-[10px] text-blue-600">${ss}</div>
      </div>
    `;
  }).join('');
}

function attachLandingHandlers(container) {
  const form = container.querySelector('#bazi-form');
  const nameInput = container.querySelector('#input-name');
  const birthYearInput = container.querySelector('#input-birth-year');
  const qiyunAgeInput = container.querySelector('#input-qiyun-age');
  const firstDayunInput = container.querySelector('#input-first-dayun');
  const pillarPreview = container.querySelector('#pillar-preview');
  const lookupBtn = container.querySelector('#btn-lookup');
  const lookupYear = container.querySelector('#lookup-year');
  const lookupMonth = container.querySelector('#lookup-month');
  const lookupDay = container.querySelector('#lookup-day');
  const lookupHour = container.querySelector('#lookup-hour');
  const lookupResult = container.querySelector('#lookup-result');
  const lookupYearGzEl = container.querySelector('#lookup-year-gz');
  const lookupMonthGzEl = container.querySelector('#lookup-month-gz');
  const lookupDayGzEl = container.querySelector('#lookup-day-gz');
  const lookupHourZhiEl = container.querySelector('#lookup-hour-zhi');

  // 干支速查按钮（精确反查）
  if (lookupBtn) {
    lookupBtn.addEventListener('click', () => {
      const y = parseInt(lookupYear.value);
      const m = parseInt(lookupMonth.value);
      const d = parseInt(lookupDay.value);
      const h = lookupHour.value === '' ? null : parseInt(lookupHour.value);
      if (!y || !m || !d || y < 1900 || y > 2100 || m < 1 || m > 12 || d < 1 || d > 31) {
        alert('请填写有效的阳历日期（1900-2100）');
        return;
      }
      if (h !== null && (h < 0 || h > 23)) {
        alert('时辰应在 0-23 之间');
        return;
      }

      // 使用精确反查（基于 1900-01-01 = 甲戌日 基准 + JS Date 计算天数差）
      const result = lookupBaziBySolarPrecise(y, m, d, h);

      lookupYearGzEl.textContent = result.yearGz;
      lookupMonthGzEl.textContent = result.monthGz;
      lookupDayGzEl.textContent = result.dayGz;
      lookupHourZhiEl.textContent = result.hourZhi || '--';
      lookupResult.classList.remove('hidden');

      // 自动填入四个输入框（仅在空白时填入，不覆盖用户已输入的值）
      const yearInput = container.querySelector('[data-pillar="yearGz"]');
      const monthInput = container.querySelector('[data-pillar="monthGz"]');
      const dayInput = container.querySelector('[data-pillar="dayGz"]');
      const hourInput = container.querySelector('[data-pillar="hourGz"]');

      if (yearInput && !yearInput.value) {
        yearInput.value = result.yearGz;
        state.form.yearGz = result.yearGz;
      }
      if (monthInput && !monthInput.value) {
        monthInput.value = result.monthGz;
        state.form.monthGz = result.monthGz;
      }
      if (dayInput && !dayInput.value) {
        dayInput.value = result.dayGz;
        state.form.dayGz = result.dayGz;
      }
      if (hourInput && !hourInput.value && result.hourZhi) {
        // 时柱只填了时支，时干需要日干推算
        hourInput.value = result.hourZhi + '?';
        // 提示用户补时干
        hourInput.placeholder = '时干+?';
        state.form.hourGz = hourInput.value;
      }
      pillarPreview.innerHTML = renderPillarPreview();
    });
  }

  // 性别切换
  container.querySelectorAll('[data-gender]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-gender]').forEach(b => {
        b.classList.remove('active', 'border-blue-300');
        b.classList.add('border-gray-300', 'text-gray-500');
      });
      btn.classList.add('active', 'border-blue-300');
      btn.classList.remove('border-gray-300', 'text-gray-500');
      state.form.gender = btn.dataset.gender;
    });
  });

  // 大运顺逆（自动判断：阳男阴女顺排，阴男阳女逆排）
  const updateDayunDirection = () => {
    const yearGan = state.form.yearGz.charAt(0);
    const yangStem = ['甲', '丙', '戊', '庚', '壬'].includes(yearGan);
    let autoDir;
    if (state.form.gender === '男') {
      autoDir = yangStem ? '顺' : '逆';
    } else {
      autoDir = yangStem ? '逆' : '顺';
    }
    state.form.dayunDirection = autoDir;
    container.querySelectorAll('[data-direction]').forEach(b => {
      if (b.dataset.direction === autoDir) {
        b.classList.add('active', 'border-blue-300');
        b.classList.remove('border-gray-300', 'text-gray-500');
      } else {
        b.classList.remove('active', 'border-blue-300');
        b.classList.add('border-gray-300', 'text-gray-500');
      }
    });
  };

  // 监听四柱/性别变化自动更新顺逆
  container.querySelectorAll('[data-direction]').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('[data-direction]').forEach(b => {
        b.classList.remove('active', 'border-blue-300');
        b.classList.add('border-gray-300', 'text-gray-500');
      });
      btn.classList.add('active', 'border-blue-300');
      btn.classList.remove('border-gray-300', 'text-gray-500');
      state.form.dayunDirection = btn.dataset.direction;
    });
  });

  // 姓名
  nameInput.addEventListener('input', e => {
    state.form.name = e.target.value || '我';
  });

  // 出生年份
  birthYearInput.addEventListener('input', e => {
    const v = parseInt(e.target.value);
    if (!isNaN(v) && v >= 1900 && v <= 2100) state.form.birthYear = v;
  });

  // 四柱输入
  container.querySelectorAll('.pillar-input').forEach(input => {
    input.addEventListener('input', e => {
      const field = e.target.dataset.pillar;
      let v = e.target.value;
      // 简单验证：必须是天干地支
      if (v.length === 2) {
        const tg = v.charAt(0);
        const dz = v.charAt(1);
        if (!TIANGAN.includes(tg) || !DIZHI.includes(dz)) {
          e.target.classList.add('border-red-400');
        } else {
          e.target.classList.remove('border-red-400');
          state.form[field] = v;
          pillarPreview.innerHTML = renderPillarPreview();
        }
      } else if (v.length === 0) {
        e.target.classList.remove('border-red-400');
      }
    });
  });

  // 起运年龄
  qiyunAgeInput.addEventListener('input', e => {
    const v = parseInt(e.target.value);
    if (!isNaN(v) && v >= 0 && v <= 20) state.form.qiyunAge = v;
  });

  // 第一步大运
  firstDayunInput.addEventListener('input', e => {
    const v = e.target.value;
    if (v.length === 2) {
      const tg = v.charAt(0);
      const dz = v.charAt(1);
      if (TIANGAN.includes(tg) && DIZHI.includes(dz)) {
        state.form.firstDayun = v;
        e.target.classList.remove('border-red-400');
      } else {
        e.target.classList.add('border-red-400');
      }
    }
  });

  // 提交
  form.addEventListener('submit', e => {
    e.preventDefault();
    generateResult();
  });

  // 教程按钮
  container.querySelector('#btn-tutorial').addEventListener('click', () => {
    alert(`使用教程：

1. 输入姓名（可选）和性别
2. 输入阳历出生年份
3. 输入四柱干支（年柱、月柱、日柱、时柱）
   - 可通过万年历或八字排盘工具查询
4. 输入起运年龄和第一步大运
5. 点击「生成人生K线」查看结果

提示：准确的八字信息是分析的基础，建议使用专业排盘工具获取。`);
  });
}

function generateResult() {
  console.log('[lifekline] generateResult 开始', state.form);

  // 验证
  const fields = ['yearGz', 'monthGz', 'dayGz', 'hourGz'];
  for (const f of fields) {
    const v = state.form[f];
    if (!v || v.length !== 2) {
      console.warn('[lifekline] 验证失败: ' + f + ' = ' + v);
      alert('请填写完整的四柱干支（' + f + '）');
      return;
    }
    const tg = v.charAt(0);
    const dz = v.charAt(1);
    if (!TIANGAN.includes(tg) || !DIZHI.includes(dz)) {
      console.warn('[lifekline] 干支不合法: ' + v);
      alert('干支格式不正确，请检查输入：' + v);
      return;
    }
  }

  if (!state.form.firstDayun || state.form.firstDayun.length !== 2) {
    alert('请填写第一步大运');
    return;
  }

  // 显示 loading
  showLoading('正在排盘分析...');

  setTimeout(() => {
    try {
      const dayMaster = state.form.dayGz.charAt(0);
      const dayMasterWx = WUXING[dayMaster];
      console.log('[lifekline] 日主:', dayMaster, '五行:', dayMasterWx);

      const pillars = fields.map(f => parseGanZhi(state.form[f]));

      const dayunList = buildDayunList(
        state.form.firstDayun,
        state.form.qiyunAge,
        10,
        state.form.dayunDirection
      );

      const klineData = generateKlineData({
        dayMaster,
        dayMasterWx,
        birthYear: state.form.birthYear,
        birthYearGz: state.form.yearGz,
        dayunList,
        qiyunAge: state.form.qiyunAge,
      });

      const analysis = generateAnalysis(pillars, dayMaster, klineData, dayunList);

      state.result = {
        analysis,
        klineData,
        dayunList,
        pillars,
        dayMaster,
        birthYear: state.form.birthYear,
      };

      state.view = 'result';
      hideLoading();
      renderApp(document.getElementById('app'));
    } catch (err) {
      hideLoading();
      alert('分析出错：' + err.message);
      console.error(err);
    }
  }, 600);
}

// ============================================================
// 结果页
// ============================================================
function renderResult(container) {
  const { analysis, klineData, dayunList, pillars, dayMaster, birthYear } = state.result;

  container.innerHTML = `
    <div class="min-h-screen bg-gray-50/50">
      <!-- Header -->
      <header class="px-6 py-4 bg-white border-b border-gray-200 sticky top-0 z-30">
        <div class="max-w-7xl mx-auto flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8">
              <svg viewBox="0 0 32 32" class="w-8 h-8">
                <path d="M16 4 L18 14 L28 16 L18 18 L16 28 L14 18 L4 16 L14 14 Z" fill="#1e3a8a"/>
                <circle cx="16" cy="16" r="2" fill="#fbbf24"/>
              </svg>
            </div>
            <div>
              <div class="font-semibold text-gray-900 text-sm leading-tight">人生K线</div>
              <div class="text-[10px] text-gray-400 tracking-wider uppercase">Life Destiny K-Line</div>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <div class="px-3 py-1.5 bg-gray-100 rounded-md text-xs text-gray-500 hidden sm:block">
              基于 AI 大模型驱动
            </div>
            <button id="btn-back" class="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              重新排盘
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <!-- 报告标题 -->
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-serif-sc font-semibold text-gray-900">命盘分析报告</h1>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400">${state.form.name} · ${state.form.gender} · ${birthYear}年生</span>
          </div>
        </div>

        <!-- 八字核心展示 -->
        ${renderBaziCore(pillars, dayMaster)}

        <!-- K线图 -->
        <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-100">
            <h2 class="text-lg font-semibold text-gray-900">百岁流年走势图</h2>
            <p class="text-xs text-gray-400 mt-1">绿色K线代表运势上涨（吉），红色K线代表运势下跌（凶）。悬停查看详情。</p>
          </div>
          <div class="p-4 relative" style="height: 500px;">
            <canvas id="kline-chart" class="w-full h-full"></canvas>
          </div>
        </div>

        <!-- 命理总评 -->
        ${renderOverallAssessment(analysis)}

        <!-- 大运总览 -->
        ${renderDayunSummary(analysis.dayunSummary)}

        <!-- 关键流年 -->
        ${renderKeyYears(analysis.keyYears)}

        <!-- 详细分析 -->
        ${renderDetailAnalysis(analysis)}

        <!-- 免责声明 -->
        <div class="bg-amber-50 border border-amber-200 rounded-xl p-5 text-xs text-amber-800 leading-relaxed">
          <div class="font-semibold mb-1">⚠️ 免责声明</div>
          <p>本工具基于传统八字命理与现代数据可视化技术，仅供娱乐学习参考。命理分析并非绝对科学预测，人生的每一次选择都掌握在您自己手中。请理性看待，切勿迷信，亦请勿用于任何商业欺诈或伤害他人的行为。</p>
        </div>
      </main>

      <footer class="px-6 py-6 text-center text-xs text-gray-400">
        <p>人生K线 · 命运可视化 · 仅供娱乐学习</p>
      </footer>
    </div>
  `;

  attachResultHandlers(container);

  // 初始化 K 线图
  setTimeout(() => {
    const canvas = container.querySelector('#kline-chart');
    if (canvas) {
      const chart = new KlineChart(canvas);
      chart.setData(klineData, dayunList, birthYear);
      window.__klineChart = chart;
      // 处理窗口大小变化
      window.__resizeHandler = () => chart.resize();
      window.addEventListener('resize', window.__resizeHandler);
    }
  }, 100);
}

function renderBaziCore(pillars, dayMaster) {
  const labels = ['年柱', '月柱', '日柱', '时柱'];
  const wxColor = {
    '木': 'text-emerald-700',
    '火': 'text-red-600',
    '土': 'text-yellow-700',
    '金': 'text-gray-700',
    '水': 'text-blue-700',
  };
  return `
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 shadow-lg">
      <div class="grid grid-cols-4 gap-4">
        ${pillars.map((p, i) => {
          const tgWx = WUXING[p.gan];
          const dzWx = WUXING[p.zhi];
          const ss = i === 2 ? '日主' : getShishen(dayMaster, p.gan);
          return `
            <div class="text-center">
              <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-2">${labels[i]}</div>
              <div class="font-serif-sc text-3xl sm:text-4xl font-semibold text-white mb-1">${p.gan}</div>
              <div class="font-serif-sc text-3xl sm:text-4xl font-semibold text-white mb-2">${p.zhi}</div>
              <div class="text-[10px] ${wxColor[tgWx] || 'text-slate-300'}">${ss}</div>
              <div class="text-[10px] text-slate-500 mt-1">${tgWx} / ${dzWx}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderOverallAssessment(analysis) {
  return `
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <h2 class="text-lg font-semibold text-gray-900">命理总评</h2>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <div class="text-xs text-gray-400">综合评分</div>
            <div class="text-2xl font-bold text-indigo-600">${analysis.overallScore} <span class="text-sm text-gray-400 font-normal">/ 10</span></div>
          </div>
          <div class="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-600" style="width: ${analysis.overallScore * 10}%"></div>
          </div>
        </div>
      </div>
      <div class="p-6 space-y-4 text-sm leading-relaxed text-gray-700">
        <div>
          <span class="font-semibold text-gray-900">【格局】</span>${analysis.geju.name}：${analysis.geju.desc}
        </div>
        <div>
          <span class="font-semibold text-gray-900">【日主强弱】</span>
          ${analysis.strength.level}（月令得${analysis.strength.monthScore > 0 ? '令' : '令'}、地支得${analysis.strength.diScore}分、天干得${analysis.strength.shiScore}分）。
          ${analysis.yongshen.desc}
        </div>
        <div>
          <span class="font-semibold text-gray-900">【喜用神】</span>
          喜：${analysis.yongshen.xi}；忌：${analysis.yongshen.ji}。
        </div>
        <div>
          <span class="font-semibold text-gray-900">【性格特质】</span>${analysis.personality}
        </div>
        <div>
          <span class="font-semibold text-gray-900">【事业方向】</span>${analysis.career}。
        </div>
        ${analysis.lifeAdvice.map(a => `
          <div><span class="font-semibold text-gray-900">【建议】</span>${a}</div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderDayunSummary(dayunSummary) {
  return `
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">大运总览</h2>
        <p class="text-xs text-gray-400 mt-1">每步大运十年，整体运势起伏一目了然。</p>
      </div>
      <div class="p-6">
        <div class="space-y-3">
          ${dayunSummary.map((d, i) => {
            const colorClass = d.level === '吉' ? 'bg-emerald-50 border-emerald-200' :
                               d.level === '凶' ? 'bg-red-50 border-red-200' :
                               'bg-gray-50 border-gray-200';
            const textClass = d.level === '吉' ? 'text-emerald-700' :
                              d.level === '凶' ? 'text-red-700' :
                              'text-gray-700';
            return `
              <div class="flex items-center gap-4 p-4 rounded-lg border ${colorClass}">
                <div class="flex-shrink-0 w-20 text-center">
                  <div class="font-serif-sc text-2xl font-semibold ${textClass}">${d.gz}</div>
                  <div class="text-xs text-gray-500 mt-1">${d.startAge}-${d.endAge}岁</div>
                </div>
                <div class="flex-1">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-xs font-semibold ${textClass}">${d.level === '吉' ? '▲ 吉运' : d.level === '凶' ? '▼ 凶运' : '─ 平运'}</span>
                    <span class="text-xs text-gray-500">均分 ${d.avg}</span>
                  </div>
                  <div class="w-full h-2 bg-white/60 rounded-full overflow-hidden">
                    <div class="h-full ${d.level === '吉' ? 'bg-emerald-500' : d.level === '凶' ? 'bg-red-500' : 'bg-gray-400'}"
                      style="width: ${d.avg}%"></div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">最高 ${d.peak} · 最低 ${d.low}</div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderKeyYears(keyYears) {
  return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-emerald-700 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
            人生高峰
          </h2>
        </div>
        <div class="p-4 space-y-2">
          ${keyYears.peaks.map(d => `
            <div class="flex items-center justify-between p-3 bg-emerald-50 rounded-lg border border-emerald-200">
              <div>
                <div class="font-serif-sc text-base font-semibold text-emerald-700">${d.yearGz}年</div>
                <div class="text-xs text-gray-500">${d.age}岁 · 大运 ${d.dayun}</div>
              </div>
              <div class="text-xl font-bold text-emerald-600">${d.score}</div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100">
          <h2 class="text-base font-semibold text-red-700 flex items-center gap-2">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
            </svg>
            需谨慎年份
          </h2>
        </div>
        <div class="p-4 space-y-2">
          ${keyYears.troughs.map(d => `
            <div class="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
              <div>
                <div class="font-serif-sc text-base font-semibold text-red-700">${d.yearGz}年</div>
                <div class="text-xs text-gray-500">${d.age}岁 · 大运 ${d.dayun}</div>
              </div>
              <div class="text-xl font-bold text-red-600">${d.score}</div>
            </div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderDetailAnalysis(analysis) {
  return `
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-100">
        <h2 class="text-lg font-semibold text-gray-900">详细命理分析</h2>
      </div>
      <div class="p-6 space-y-4 text-sm leading-relaxed text-gray-700">
        ${generateDetailedParagraphs(analysis).map(p => `
          <p>${p}</p>
        `).join('')}
      </div>
    </div>
  `;
}

function generateDetailedParagraphs(analysis) {
  const paragraphs = [];
  const { pillars, dayMaster, dayunList, strength, yongshen } = analysis;

  // 四柱概述
  const nayin = pillars.map(p => NAYIN[p.gan + p.zhi]).join('、');
  paragraphs.push(`命主出生于 ${state.form.birthYear} 年，四柱分别为 ${pillars.map(p => p.gan + p.zhi).join('、')}，纳音分别为 ${nayin}。日主为 ${dayMaster}，五行属 ${WUXING[dayMaster]}。`);

  // 强弱分析
  paragraphs.push(`经分析，日主 ${dayMaster} ${strength.level}。月令${strength.monthScore > 0 ? '得令' : '不得令'}，地支有 ${strength.diScore} 处得根，天干得 ${strength.shiScore} 分助益，整体 ${strength.level}。${yongshen.desc}`);

  // 格局详述
  paragraphs.push(`此命为${analysis.geju.name}。${analysis.geju.desc}`);

  // 大运分析
  const dayunText = dayunList.slice(0, 10).map((d, i) => {
    return `${d.startAge}-${d.endAge}岁 ${d.gz}运`;
  }).join('，');
  paragraphs.push(`大运依次为：${dayunText}。每步大运十年，分别主导不同的人生阶段与运势起伏。`);

  // 五行喜忌
  paragraphs.push(`命局五行分布为：木${Math.round(analysis.wxDist.木)}、火${Math.round(analysis.wxDist.火)}、土${Math.round(analysis.wxDist.土)}、金${Math.round(analysis.wxDist.金)}、水${Math.round(analysis.wxDist.水)}。${yongshen.xi}为喜用神，${yongshen.ji}为忌神。`);

  // 性格详述
  paragraphs.push(`日主 ${dayMaster} 之人，${analysis.personality}`);

  // 事业
  paragraphs.push(`事业方向上，${analysis.career}。结合大运走势，前期打基础，中期求发展，后期享收获。`);

  // 感情
  paragraphs.push(`感情方面，结合日主强弱与用神，${strength.level === '身旺' ? '日主身旺，能任财星，异性缘佳，但宜专一' : strength.level === '身弱' ? '日主身弱，感情上宜被动等待，贵人相助更易成功' : '日主中和，感情平稳，宜顺其自然'}`);

  // 健康
  const healthWx = strength.level === '身旺' ? '火' : strength.level === '身弱' ? '水' : '土';
  paragraphs.push(`健康方面，需注意与 ${WUXING[dayMaster]} 相关的部位，${strength.level === '身旺' ? '金' : '木'}所主的脏腑亦需关注。保持规律作息，适度运动。`);

  return paragraphs;
}

function attachResultHandlers(container) {
  container.querySelector('#btn-back').addEventListener('click', () => {
    state.view = 'landing';
    if (window.__klineChart) {
      window.__klineChart.destroy();
      window.__klineChart = null;
    }
    if (window.__resizeHandler) {
      window.removeEventListener('resize', window.__resizeHandler);
      window.__resizeHandler = null;
    }
    renderApp(document.getElementById('app'));
  });
}

// ============================================================
// Loading
// ============================================================
function showLoading(text) {
  const el = document.getElementById('loading');
  const txt = document.getElementById('loading-text');
  if (el) {
    if (txt) txt.textContent = text;
    el.style.display = 'flex';
  }
}

function hideLoading() {
  const el = document.getElementById('loading');
  if (el) el.style.display = 'none';
}

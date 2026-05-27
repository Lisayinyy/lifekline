// analysis.js - 命理分析生成

import {
  TIANGAN, DIZHI, WUXING, DIZHI_CANGGAN, JIAZI, NAYIN,
  TIANGAN_YINYANG, getShishen, parseGanZhi
} from './bazi.js?v=20260527-4';

// 生成完整命理分析
export function generateAnalysis(pillars, dayMaster, klineData, dayunList) {
  const dayMasterWx = WUXING[dayMaster];
  const monthZhi = pillars[1].zhi;
  const monthGan = pillars[1].gan;

  // 计算日主强弱
  const strength = analyzeStrength(pillars, dayMaster);

  // 用神喜神
  const yongshen = getYongshen(dayMasterWx, strength);

  // 格局
  const geju = determineGeju(pillars, dayMaster, strength, dayunList);

  // 性格
  const personality = getPersonality(dayMaster, dayMasterWx);

  // 五行分布
  const wxDist = getWuxingDistribution(pillars);

  // 十神分布
  const shishenDist = getShishenDistribution(pillars, dayMaster);

  // 事业建议
  const career = getCareerSuggestion(dayMasterWx, yongshen, strength);

  // 大运总评
  const dayunSummary = summarizeDayun(dayunList, klineData, dayMaster, dayMasterWx);

  // 总体评分
  const overallScore = calculateOverallScore(klineData, wxDist, strength);

  // 人生建议
  const lifeAdvice = generateLifeAdvice(dayMaster, dayMasterWx, strength, yongshen, klineData);

  // 关键流年
  const keyYears = findKeyYears(klineData);

  return {
    strength,
    yongshen,
    geju,
    personality,
    wxDist,
    shishenDist,
    career,
    dayunSummary,
    dayunList,
    overallScore,
    lifeAdvice,
    keyYears,
    pillars,
    dayMaster,
  };
}

function analyzeStrength(pillars, dayMaster) {
  const dayMasterWx = WUXING[dayMaster];
  const monthZhi = pillars[1].zhi;

  const wang = {
    '木': ['寅', '卯'],
    '火': ['巳', '午'],
    '土': ['辰', '戌', '丑', '未'],
    '金': ['申', '酉'],
    '水': ['子', '亥'],
  };

  let monthScore = 0;
  if (wang[dayMasterWx] && wang[dayMasterWx].includes(monthZhi)) {
    monthScore = 3;
  } else {
    monthScore = -1;
  }

  let diScore = 0;
  pillars.forEach(p => {
    const cang = DIZHI_CANGGAN[p.zhi] || [];
    if (cang.includes(dayMaster)) diScore += 1;
  });

  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  let shiScore = 0;
  pillars.forEach(p => {
    if (WUXING[p.gan] === dayMasterWx) shiScore += 1;
    else if (WUXING[p.gan] === shengWo[dayMasterWx]) shiScore += 1;
  });

  const total = monthScore + diScore + shiScore;
  let level = '中和';
  if (total >= 5) level = '身旺';
  else if (total <= 1) level = '身弱';

  return { level, score: total, monthScore, diScore, shiScore };
}

function getYongshen(dayMasterWx, strength) {
  const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const keWo = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };

  if (strength.level === '身旺') {
    return {
      xi: `${ke[dayMasterWx]}（财星）、${sheng[dayMasterWx]}（食伤）`,
      ji: `${shengWo[dayMasterWx]}（印星）、${dayMasterWx}（比劫）`,
      yong: ke[dayMasterWx],
      desc: '日主身旺，能任财官，宜行财运、官运，忌印比过旺。',
    };
  } else if (strength.level === '身弱') {
    return {
      xi: `${shengWo[dayMasterWx]}（印星）、${dayMasterWx}（比劫）`,
      ji: `${ke[dayMasterWx]}（财星）、${keWo[dayMasterWx]}（官杀）、${sheng[dayMasterWx]}（食伤）`,
      yong: shengWo[dayMasterWx],
      desc: '日主身弱，宜生扶为先，忌财官食伤克泄太过。',
    };
  }
  return {
    xi: '中和为贵',
    ji: '无特殊',
    yong: '平衡',
    desc: '日主中和，格局平衡，喜忌看大运流年引动。',
  };
}

function determineGeju(pillars, dayMaster, strength, dayunList) {
  const dayMasterWx = WUXING[dayMaster];
  const monthGan = pillars[1].gan;

  // 检测常见格局
  const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };

  // 食神格
  if (WUXING[monthGan] === sheng[dayMasterWx]) {
    return {
      name: '食神格',
      desc: '月令食神当令，主才情横溢，温和善良，利文艺、餐饮、教育等行业。食神制杀，格局清奇。',
    };
  }

  // 正官格
  if (WUXING[monthGan] === '金' && dayMasterWx === '木') {
    return {
      name: '正官格',
      desc: '月令正官透出，主品行端正，利仕途发展，贵人相助，适合体制内或管理岗位。',
    };
  }

  // 偏财格
  if (WUXING[monthGan] === ke[dayMasterWx]) {
    return {
      name: '偏财格',
      desc: '月令偏财当令，主财源广进，善于把握机会，灵活多变，宜商业经营。',
    };
  }

  // 正印格
  if (WUXING[monthGan] === shengWo[dayMasterWx]) {
    return {
      name: '正印格',
      desc: '月令正印当令，主学识深厚，仁慈善良，利学术研究、文化教育。',
    };
  }

  // 比肩格
  if (WUXING[monthGan] === dayMasterWx) {
    return {
      name: '比肩格',
      desc: '月令比肩当令，主意志坚定，独立自主，自力更生。',
    };
  }

  return {
    name: `${dayMaster}日主 · ${strength.level}`,
    desc: `${dayMaster}日主，${strength.level}格局，需结合大运流年综合判断。`,
  };
}

function getPersonality(dayMaster, dayMasterWx) {
  const traits = {
    '木': {
      '甲': '参天大木，刚健挺拔，志向高远，意志坚定，具备开拓精神和领袖气质。性格仁厚，能包容万物，有主见但不失灵活性。',
      '乙': '花草藤萝，外柔内刚，善于适应环境。性格温婉，反应敏捷，有很强的可塑性和适应能力，善于借力使力。',
    },
    '火': {
      '丙': '太阳之火，光明磊落，热情大方。性格外向，慷慨仗义，有很强的表现欲和感染力，能鼓舞他人。',
      '丁': '灯烛之火，文雅细腻，温和内敛。洞察力强，重情重义，善于照顾他人，富有同情心和艺术气质。',
    },
    '土': {
      '戊': '城墙大地，沉稳厚重，包容大度。信守承诺，可托付重任，做事踏实，有很强的责任感和稳定性。',
      '己': '田园沃土，温和平易。勤劳务实，注重积累，善于滋养万物，能包容不同意见，理财有道。',
    },
    '金': {
      '庚': '刀剑斧钺，刚毅果决，锐意进取。性格直爽，重义轻利，具领导魄力和决断力。',
      '辛': '珠玉宝石，温润内秀。审美独到，敏感细腻，追求完美，有很强的艺术鉴赏力。',
    },
    '水': {
      '壬': '江河湖海，气势磅礴，智慧深沉。善于谋略，应变能力强，能屈能伸，包容万象。',
      '癸': '雨露甘霖，柔和细腻，聪慧过人。善于滋养他人，内敛含蓄，有很强的直觉力和第六感。',
    },
  };
  return traits[dayMasterWx]?.[dayMaster] || '命主性格独特，需结合八字全局判断。';
}

function getWuxingDistribution(pillars) {
  const dist = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
  pillars.forEach(p => {
    [p.gan, p.zhi].forEach(c => {
      const wx = WUXING[c];
      if (wx) dist[wx]++;
    });
  });
  // 加上藏干
  pillars.forEach(p => {
    const cang = DIZHI_CANGGAN[p.zhi] || [];
    cang.forEach(g => {
      const wx = WUXING[g];
      if (wx) dist[wx] += 0.3;
    });
  });
  return dist;
}

function getShishenDistribution(pillars, dayMaster) {
  const dist = {};
  pillars.forEach(p => {
    const ss = getShishen(dayMaster, p.gan);
    if (ss) dist[ss] = (dist[ss] || 0) + 1;
    // 藏干十神
    const cang = DIZHI_CANGGAN[p.zhi] || [];
    cang.forEach(g => {
      const ss2 = getShishen(dayMaster, g);
      if (ss2) dist[ss2] = (dist[ss2] || 0) + 0.5;
    });
  });
  return dist;
}

function getCareerSuggestion(dayMasterWx, yongshen, strength) {
  const wxCareer = {
    '木': '文化教育、出版、中医、纺织、服装、家具、园林绿化、文创产业',
    '火': '互联网、科技、电子、能源、餐饮、影视、文化传媒、表演艺术',
    '土': '房地产、建筑、农业、矿业、仓储、物流、土地规划、中介',
    '金': '金融、银行、证券、机械、金属、汽车制造、法律、外科医疗',
    '水': '物流、航运、旅游、水利、外贸、自由职业、哲学研究、IT',
  };
  return wxCareer[dayMasterWx] || '结合命局喜忌，扬长避短';
}

function summarizeDayun(dayunList, klineData, dayMaster, dayMasterWx) {
  const summary = [];
  const dayuns = dayunList.filter(d => d.startAge <= 100).slice(0, 10);
  dayuns.forEach((d, i) => {
    const inRange = klineData.filter(k => k.age >= d.startAge && k.age <= Math.min(d.endAge, 100));
    if (!inRange.length) return;
    const avg = inRange.reduce((s, k) => s + k.score, 0) / inRange.length;
    const peak = Math.max(...inRange.map(k => k.score));
    const low = Math.min(...inRange.map(k => k.score));
    const level = avg > 60 ? '吉' : avg < 45 ? '凶' : '平';

    summary.push({
      ...d,
      avg: Math.round(avg * 10) / 10,
      peak,
      low,
      level,
    });
  });
  return summary;
}

function calculateOverallScore(klineData, wxDist, strength) {
  let score = 6.0;

  // 五行平衡
  const counts = Object.values(wxDist).map(v => Math.round(v));
  const max = Math.max(...counts);
  const min = Math.min(...counts);
  if (max - min <= 2) score += 0.6;
  else if (max - min <= 4) score += 0.3;

  // K线整体水平
  const avgScore = klineData.reduce((s, d) => s + d.score, 0) / klineData.length;
  if (avgScore > 60) score += 0.7;
  else if (avgScore > 52) score += 0.4;

  // 高峰数量
  const peaks = klineData.filter(d => d.score > 75).length;
  if (peaks >= 20) score += 0.4;
  else if (peaks >= 10) score += 0.2;

  // 大运分布
  const ups = klineData.filter(d => d.isBullish).length;
  const upRatio = ups / klineData.length;
  if (upRatio > 0.55) score += 0.3;
  else if (upRatio < 0.4) score -= 0.2;

  return Math.min(9.9, Math.max(4.0, Math.round(score * 10) / 10));
}

function generateLifeAdvice(dayMaster, dayMasterWx, strength, yongshen, klineData) {
  const advices = [];

  // 性格建议
  if (dayMasterWx === '木') {
    advices.push('性格仁厚，但有时过于理想化，宜务实规划，脚踏实地。');
  } else if (dayMasterWx === '火') {
    advices.push('热情奔放，但易冲动，宜三思后行，培养耐心。');
  } else if (dayMasterWx === '土') {
    advices.push('稳重可靠，但有时过于保守，宜适度开放，拥抱变化。');
  } else if (dayMasterWx === '金') {
    advices.push('果断刚毅，但易得罪人，宜柔和处世，广结善缘。');
  } else if (dayMasterWx === '水') {
    advices.push('智慧灵活，但有时多变，宜坚定目标，持之以恒。');
  }

  // 强弱建议
  if (strength.level === '身旺') {
    advices.push('日主身旺，精力充沛，能承担重任，宜积极进取，开创事业。');
  } else if (strength.level === '身弱') {
    advices.push('日主身弱，宜循序渐进，不可冒进，多借贵人之力，稳中求胜。');
  }

  // 大运起伏
  const peaks = klineData.filter(d => d.score > 75);
  const lows = klineData.filter(d => d.score < 35);
  if (peaks.length > 0) {
    const peakAges = peaks.map(p => p.age);
    const peakRange = `${Math.min(...peakAges)}-${Math.max(...peakAges)}岁`;
    advices.push(`一生中 ${peakRange} 是关键高峰期，宜把握机遇，乘势而上。`);
  }
  if (lows.length > 0) {
    const lowAges = lows.map(p => p.age);
    const lowRange = `${Math.min(...lowAges)}-${Math.max(...lowAges)}岁`;
    advices.push(`${lowRange} 期间需谨慎保守，守成为主，厚积薄发。`);
  }

  return advices;
}

function findKeyYears(klineData) {
  // 找最高点和最低点
  const sorted = [...klineData].sort((a, b) => b.score - a.score);
  const top3 = sorted.slice(0, 3);
  const bottom3 = sorted.slice(-3).reverse();

  return {
    peaks: top3.map(d => ({
      age: d.age,
      year: d.year,
      yearGz: d.yearGz,
      dayun: d.dayun,
      score: d.score,
    })),
    troughs: bottom3.map(d => ({
      age: d.age,
      year: d.year,
      yearGz: d.yearGz,
      dayun: d.dayun,
      score: d.score,
    })),
  };
}

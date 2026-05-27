// bazi.js - 八字命理核心数据与算法

// 天干地支
export const TIANGAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const DIZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// 五行
export const WUXING = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
  '子': '水', '亥': '水',
  '寅': '木', '卯': '木',
  '巳': '火', '午': '火',
  '申': '金', '酉': '金',
  '辰': '土', '戌': '土', '丑': '土', '未': '土',
};

// 五行颜色
export const WUXING_COLOR = {
  '木': '#16a34a',
  '火': '#dc2626',
  '土': '#ca8a04',
  '金': '#6b7280',
  '水': '#2563eb',
};

// 天干阴阳
export const TIANGAN_YINYANG = {
  '甲': '阳', '乙': '阴',
  '丙': '阳', '丁': '阴',
  '戊': '阳', '己': '阴',
  '庚': '阳', '辛': '阴',
  '壬': '阳', '癸': '阴',
};

// 地支阴阳
export const DIZHI_YINYANG = {
  '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴',
  '辰': '阳', '巳': '阴', '午': '阳', '未': '阴',
  '申': '阳', '酉': '阴', '戌': '阳', '亥': '阴',
};

// 地支藏干
export const DIZHI_CANGGAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '戊', '庚'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲'],
};

// 十神（基于日主）
// 比肩 劫财 食神 伤官 偏财 正财 七杀 正官 偏印 正印
export function getShishen(dayMaster, target) {
  if (!dayMaster || !target) return '';
  const dmWx = WUXING[dayMaster];
  const tgWx = WUXING[target];
  if (!dmWx || !tgWx) return '';

  const same = dmWx === tgWx;
  const dmYinYang = TIANGAN_YINYANG[dayMaster];
  const tgYinYang = TIANGAN_YINYANG[target];
  const yinYangSame = dmYinYang === tgYinYang;

  // 生克关系
  const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const keWo = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };

  if (same) return yinYangSame ? '比肩' : '劫财';
  if (sheng[dmWx] === tgWx) return yinYangSame ? '食神' : '伤官';   // 我生
  if (ke[dmWx] === tgWx) return yinYangSame ? '偏财' : '正财';     // 我克
  if (shengWo[dmWx] === tgWx) return yinYangSame ? '偏印' : '正印'; // 生我
  if (keWo[dmWx] === tgWx) return yinYangSame ? '七杀' : '正官';   // 克我
  return '';
}

// 60甲子
export const JIAZI = (() => {
  const arr = [];
  for (let i = 0; i < 60; i++) {
    const tg = TIANGAN[i % 10];
    const dz = DIZHI[i % 12];
    arr.push(tg + dz);
  }
  return arr;
})();

// 纳音五行
export const NAYIN = {
  '甲子': '海中金', '乙丑': '海中金',
  '丙寅': '炉中火', '丁卯': '炉中火',
  '戊辰': '大林木', '己巳': '大林木',
  '庚午': '路旁土', '辛未': '路旁土',
  '壬申': '剑锋金', '癸酉': '剑锋金',
  '甲戌': '山头火', '乙亥': '山头火',
  '丙子': '涧下水', '丁丑': '涧下水',
  '戊寅': '城头土', '己卯': '城头土',
  '庚辰': '白蜡金', '辛巳': '白蜡金',
  '壬午': '杨柳木', '癸未': '杨柳木',
  '甲申': '泉中水', '乙酉': '泉中水',
  '丙戌': '屋上土', '丁亥': '屋上土',
  '戊子': '霹雳火', '己丑': '霹雳火',
  '庚寅': '松柏木', '辛卯': '松柏木',
  '壬辰': '长流水', '癸巳': '长流水',
  '甲午': '砂石金', '乙未': '砂石金',
  '丙申': '山下火', '丁酉': '山下火',
  '戊戌': '平地木', '己亥': '平地木',
  '庚子': '壁上土', '辛丑': '壁上土',
  '壬寅': '金箔金', '癸卯': '金箔金',
  '甲辰': '覆灯火', '乙巳': '覆灯火',
  '丙午': '天河水', '丁未': '天河水',
  '戊申': '大驿土', '己酉': '大驿土',
  '庚戌': '钗钏金', '辛亥': '钗钏金',
  '壬子': '桑柘木', '癸丑': '桑柘木',
  '甲寅': '大溪水', '乙卯': '大溪水',
  '丙辰': '沙中土', '丁巳': '沙中土',
  '戊午': '天上火', '己未': '天上火',
  '庚申': '石榴木', '辛酉': '石榴木',
  '壬戌': '大海水', '癸亥': '大海水',
};

// 月支对照表（节气月）
export const YUEZHI_MONTH = {
  '寅': 1, '卯': 2, '辰': 3, '巳': 4, '午': 5, '未': 6,
  '申': 7, '酉': 8, '戌': 9, '亥': 10, '子': 11, '丑': 12,
};

// 大运干支生成（顺排或逆排）
export function generateDayunSequence(firstDayunGanZhi, count, direction = '顺') {
  const result = [];
  const startIdx = JIAZI.indexOf(firstDayunGanZhi);
  if (startIdx === -1) return result;
  const step = direction === '顺' ? 1 : -1;
  for (let i = 0; i < count; i++) {
    const idx = (startIdx + i * step + 60) % 60;
    result.push(JIAZI[idx]);
  }
  return result;
}

// 根据年干性别自动判断大运顺逆
// 阳年（甲丙戊庚壬）男命顺、女命逆
// 阴年（乙丁己辛癸）男命逆、女命顺
export function getDayunDirection(yearGz, gender) {
  const yearGan = yearGz.charAt(0);
  const yangStem = ['甲', '丙', '戊', '庚', '壬'].includes(yearGan);
  if (gender === '男') {
    return yangStem ? '顺' : '逆';
  } else {
    return yangStem ? '逆' : '顺';
  }
}

// 五行生克打分（用于运势K线生成）
function wuxingScore(dayMasterWx, yearGanZhi) {
  const tg = yearGanZhi.charAt(0);
  const dz = yearGanZhi.charAt(1);
  const tgWx = WUXING[tg];
  const dzWx = WUXING[dz];

  // 综合天干地支的生克关系
  const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const keWo = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };

  let score = 50;
  // 天干地支各 50%
  [tgWx, dzWx].forEach(wx => {
    if (!wx) return;
    if (wx === dayMasterWx) score += 4;          // 比和
    else if (sheng[dayMasterWx] === wx) score += 6;  // 我生泄气（食伤，利才华）
    else if (ke[dayMasterWx] === wx) score += 8;     // 我克（财星，利求财）
    else if (shengWo[dayMasterWx] === wx) score += 10; // 生我（印星，利学业贵人）
    else if (keWo[dayMasterWx] === wx) score -= 8;    // 克我（官杀，压力）
  });
  return score;
}

// 详细的流年十神分析得分
function liunianDetailedScore(dayMaster, dayMasterWx, dayunGz, yearGz, age) {
  // 流年十神
  const yearTg = yearGz.charAt(0);
  const yearDz = yearGz.charAt(1);
  const yearTgShishen = getShishen(dayMaster, yearTg);

  // 大运十神
  const dayunTg = dayunGz.charAt(0);
  const dayunTgShishen = getShishen(dayMaster, dayunTg);

  let score = 50;

  // 大运影响（30%）
  if (dayunTgShishen === '正印' || dayunTgShishen === '偏印') score += 8;
  else if (dayunTgShishen === '正官' || dayunTgShishen === '七杀') score += 4;
  else if (dayunTgShishen === '正财' || dayunTgShishen === '偏财') score += 5;
  else if (dayunTgShishen === '食神' || dayunTgShishen === '伤官') score += 6;
  else if (dayunTgShishen === '比肩' || dayunTgShishen === '劫财') score += 2;

  // 流年影响（40%）
  if (yearTgShishen === '正印' || yearTgShishen === '偏印') score += 12;
  else if (yearTgShishen === '正官' || yearTgShishen === '七杀') score += 6;
  else if (yearTgShishen === '正财' || yearTgShishen === '偏财') score += 10;
  else if (yearTgShishen === '食神' || yearTgShishen === '伤官') score += 8;
  else if (yearTgShishen === '比肩' || yearTgShishen === '劫财') score += 4;

  // 地支影响（30%）
  const yearDzWx = WUXING[yearDz];
  const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const keWo = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };

  if (yearDzWx === dayMasterWx) score += 5;
  else if (shengWo[dayMasterWx] === yearDzWx) score += 8;
  else if (sheng[dayMasterWx] === yearDzWx) score += 4;
  else if (ke[dayMasterWx] === yearDzWx) score += 6;
  else if (keWo[dayMasterWx] === yearDzWx) score -= 4;

  // 特殊：冲合
  const dzChong = {
    '子': '午', '午': '子',
    '丑': '未', '未': '丑',
    '寅': '申', '申': '寅',
    '卯': '酉', '酉': '卯',
    '辰': '戌', '戌': '辰',
    '巳': '亥', '亥': '巳',
  };
  // 检查是否与大运地支冲
  const dayunDz = dayunGz.charAt(1);
  if (dzChong[yearDz] === dayunDz) score -= 5;

  // 合化（地支六合）
  const dzHe = {
    '子': '丑', '丑': '子',
    '寅': '亥', '亥': '寅',
    '卯': '戌', '戌': '卯',
    '辰': '酉', '酉': '辰',
    '巳': '申', '申': '巳',
    '午': '未', '未': '午',
  };
  if (dzHe[yearDz] === dayunDz) score += 3;

  return score;
}

// 解析干支
export function parseGanZhi(gz) {
  if (!gz || gz.length < 2) return { gan: '', zhi: '' };
  return { gan: gz.charAt(0), zhi: gz.charAt(1) };
}

// 大运+流年组合权重
function combinedScore(dayMasterWx, dayunGz, liunianGz) {
  const base = wuxingScore(dayMasterWx, liunianGz);
  // 大运加分
  const dyTg = dayunGz.charAt(0);
  const dyDz = dayunGz.charAt(1);
  const dyTgWx = WUXING[dyTg];
  const dyDzWx = WUXING[dyDz];

  const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const keWo = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };

  let dyBonus = 0;
  [dyTgWx, dyDzWx].forEach(wx => {
    if (!wx) return;
    if (wx === dayMasterWx) dyBonus += 1;
    else if (shengWo[dayMasterWx] === wx) dyBonus += 2;
    else if (keWo[dayMasterWx] === wx) dyBonus -= 2;
    else if (sheng[dayMasterWx] === wx) dyBonus += 1;
    else if (ke[dayMasterWx] === wx) dyBonus += 1;
  });

  return base + dyBonus;
}

// 大运干支序列（从起运年龄起，每10年一步）
export function buildDayunList(firstDayun, qiyunAge, count = 10, direction = '顺') {
  const sequence = generateDayunSequence(firstDayun, count, direction);
  const result = [];
  for (let i = 0; i < sequence.length; i++) {
    result.push({
      gz: sequence[i],
      startAge: qiyunAge + i * 10,
      endAge: qiyunAge + i * 10 + 9,
    });
  }
  return result;
}

// 计算某年流年干支
// 简化：以出生年干支为基础，逐年顺推
export function getLiunianGanZhi(birthYearGz, age) {
  const startIdx = JIAZI.indexOf(birthYearGz);
  if (startIdx === -1) return '甲子';
  const idx = (startIdx + age - 1 + 60) % 60;
  return JIAZI[idx];
}

// 生成100年K线数据
export function generateKlineData(opts) {
  const { dayMaster, dayMasterWx, birthYear, birthYearGz, dayunList, qiyunAge } = opts;
  const data = [];
  for (let age = 1; age <= 100; age++) {
    const yearGz = getLiunianGanZhi(birthYearGz, age);
    // 找到对应的大运
    const dayun = dayunList.find(d => age >= d.startAge && age <= d.endAge) ||
                  dayunList[dayunList.length - 1];

    // 详细十神评分
    const base = liunianDetailedScore(dayMaster, dayMasterWx, dayun.gz, yearGz, age);

    // 确定性扰动
    const seed = (age * 17 + yearGz.charCodeAt(0) * 3 + yearGz.charCodeAt(1) * 7) % 100;
    const noise = (seed - 50) * 0.25;

    // 时间惯性（动量）
    let trend = 0;
    if (data.length > 0) {
      const prev = data[data.length - 1];
      trend = (prev.close - 50) * 0.15;
    }

    // 大运切换时强制回归（避免惯性跨度过大）
    let score = base + noise + trend;
    if (data.length > 0 && data[data.length - 1].dayun !== dayun.gz) {
      // 大运切换，强制让分数回归到基础分附近
      score = (score * 0.6) + (base * 0.4);
    }

    score = Math.max(8, Math.min(95, score));

    // 开盘：上一年的收盘附近
    const prevClose = data.length > 0 ? data[data.length - 1].close : 50;
    const openJitter = (seed % 11) - 5;
    const open = Math.max(5, Math.min(98, prevClose + openJitter));

    const close = Math.round(score);
    const highExtra = Math.floor((seed * 13) % 9);
    const lowExtra = Math.floor((seed * 11) % 8);
    const high = Math.min(100, Math.max(open, close) + highExtra);
    const low = Math.max(0, Math.min(open, close) - lowExtra);

    data.push({
      age,
      year: birthYear + age - 1,
      yearGz,
      dayun: dayun.gz,
      dayunStartAge: dayun.startAge,
      dayunEndAge: dayun.endAge,
      open: Math.round(open),
      close,
      high,
      low,
      score: close,
      isBullish: close >= open,
    });
  }
  return data;
}

// 计算日主强弱
export function analyzeDayMasterStrength(pillars) {
  // pillars: [year, month, day, hour] 各为 {gan, zhi}
  const dayMaster = pillars[2].gan;
  const dayMasterWx = WUXING[dayMaster];
  const monthZhi = pillars[1].zhi;

  // 月令旺衰
  const wang = {
    '木': ['寅', '卯'],
    '火': ['巳', '午'],
    '土': ['辰', '戌', '丑', '未'],
    '金': ['申', '酉'],
    '水': ['子', '亥'],
  };

  let monthScore = 0;
  if (wang[dayMasterWx] && wang[dayMasterWx].includes(monthZhi)) {
    monthScore = 3;  // 得令
  } else {
    monthScore = -1; // 失令
  }

  // 得地（地支有根）
  let diScore = 0;
  pillars.forEach(p => {
    const cang = DIZHI_CANGGAN[p.zhi] || [];
    if (cang.includes(dayMaster)) diScore += 1;
  });

  // 得势（天干有比劫印星）
  let shiScore = 0;
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  pillars.forEach(p => {
    if (WUXING[p.gan] === dayMasterWx) shiScore += 1;
    else if (WUXING[p.gan] === shengWo[dayMasterWx]) shiScore += 1;
  });

  const total = monthScore + diScore + shiScore;
  if (total >= 5) return { level: '身旺', score: total };
  if (total <= 1) return { level: '身弱', score: total };
  return { level: '中和', score: total };
}

// 用神喜神推断
export function getYongshen(dayMasterWx, strength) {
  const sheng = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  const ke = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  const shengWo = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  const keWo = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };

  if (strength.level === '身旺') {
    // 喜克泄耗
    return {
      xi: [ke[dayMasterWx], sheng[dayMasterWx]].join('、'),
      ji: [shengWo[dayMasterWx], dayMasterWx].join('、'),
      yong: ke[dayMasterWx],
    };
  } else if (strength.level === '身弱') {
    // 喜生扶
    return {
      xi: [shengWo[dayMasterWx], dayMasterWx].join('、'),
      ji: [ke[dayMasterWx], sheng[dayMasterWx]].join('、'),
      yong: shengWo[dayMasterWx],
    };
  }
  return {
    xi: '中和',
    ji: '无特殊',
    yong: '平衡',
  };
}

// 性格特征推断
export function getPersonality(dayMaster, dayMasterWx) {
  const traits = {
    '木': {
      甲: '参天大树，刚健不屈，志向高远，仁慈宽厚，善于开创大局。',
      乙: '花草藤萝，柔韧灵活，外表温和内心坚韧，善于适应环境。',
    },
    '火': {
      丙: '太阳之火，光明磊落，热情大方，积极进取，领袖气质。',
      丁: '灯烛之火，文雅细腻，温和内敛，洞察力强，重情重义。',
    },
    '土': {
      戊: '城墙大地，沉稳厚重，包容大度，信守承诺，可托付重任。',
      己: '田园沃土，温和平易，善于滋养万物，勤劳务实，注重积累。',
    },
    '金': {
      庚: '刀剑斧钺，刚毅果决，锐意进取，重义轻利，具领导魄力。',
      辛: '珠玉宝石，温润内秀，审美独到，敏感细腻，追求完美。',
    },
    '水': {
      壬: '江河湖海，气势磅礴，智慧深沉，善于谋略，应变能力强。',
      癸: '雨露甘霖，柔和细腻，聪慧过人，内敛含蓄，善于滋养他人。',
    },
  };
  return traits[dayMasterWx]?.[dayMaster] || '命主性格独特，自有天赋。';
}

// 综合评分
export function calculateOverallScore(pillars, dayunList, klineData) {
  // 基础分 6 分
  let score = 6.0;

  // 五行平衡加分
  const wxCount = {};
  pillars.forEach(p => {
    [p.gan, p.zhi].forEach(c => {
      const wx = WUXING[c];
      if (wx) wxCount[wx] = (wxCount[wx] || 0) + 1;
    });
  });
  const counts = Object.values(wxCount);
  const maxCount = Math.max(...counts, 1);
  const minCount = Math.min(...counts, 1);
  if (maxCount - minCount <= 2) score += 0.6;
  else if (maxCount - minCount <= 4) score += 0.3;

  // K线走势加分
  const avgScore = klineData.reduce((s, d) => s + d.score, 0) / klineData.length;
  if (avgScore > 60) score += 0.8;
  else if (avgScore > 50) score += 0.4;

  // 高点数量
  const peaks = klineData.filter(d => d.score > 75).length;
  if (peaks >= 15) score += 0.4;
  else if (peaks >= 8) score += 0.2;

  return Math.min(9.9, Math.max(4.0, Math.round(score * 10) / 10));
}

// 行业/方向建议
export function getCareerSuggestion(dayMasterWx, yongshen) {
  const wxCareer = {
    '木': '宜从事文教、文化、出版、中医、纺织、服装、家具、园林等与木相关的行业；或向东方发展。',
    '火': '宜从事科技、IT、互联网、电子、能源、餐饮、影视、文化传媒等与火相关的行业；或向南方发展。',
    '土': '宜从事房地产、建筑、农业、矿业、仓储、土地规划等与土相关的行业；本地或中部地区发展。',
    '金': '宜从事金融、银行、证券、机械、金属、汽车、法律、外科等与金相关的行业；西方发展。',
    '水': '宜从事物流、航运、旅游、水利、外贸、自由职业、哲学研究等与水相关的行业；北方发展。',
  };
  return wxCareer[dayMasterWx] || '结合命局喜忌，扬长避短。';
}

// 格局描述
export function getGeju(pillars, dayMaster, strength) {
  // 简化格局判断
  const dayMasterWx = WUXING[dayMaster];
  const monthGan = pillars[1].gan;

  // 简单判断
  if (strength.level === '身旺') {
    return `${dayMaster}日主身旺，能任财官，主进取有为。`;
  } else if (strength.level === '身弱') {
    return `${dayMaster}日主身弱，宜以印比扶助，稳中求进。`;
  }
  return `${dayMaster}日主中和，运势平稳，需看大运流年催发。`;
}

// ============ 八字反查辅助（给输入页用） ============

/**
 * 阳历年份 → 年柱干支（粗略，假设 2/4 前后立春）
 * @param {number} year 阳历年份
 * @param {number} month 阳历月份 1-12（可选，2月立春前用上一年）
 * @param {number} day 阳历日（可选）
 * @returns {string} 年柱干支
 */
export function getYearGzBySolar(year, month = 2, day = 5) {
  // 立春通常在 2/4 左右，简化为：2月4日及以前用上一年，2月5日及以后用本年
  let effectiveYear = year;
  if (month < 2 || (month === 2 && day < 4)) {
    effectiveYear = year - 1;
  }
  // 已知 1984 = 甲子年（JIAZI[0]）
  // 甲子年是 4 的倍数：1984, 1994(甲戌)... 实际：1984 甲子, 1994 甲戌, 1985 乙丑
  // 用更可靠的方法：年干 = (year - 4) % 10, 年支 = (year - 4) % 12
  // 例：1984 → (1984-4)%10 = 0 → 甲 ✓
  // 例：1985 → (1985-4)%10 = 1 → 乙 ✓
  // 例：1984 → (1984-4)%12 = 0 → 子 ✓
  const ganIdx = ((effectiveYear - 4) % 10 + 10) % 10;
  const zhiIdx = ((effectiveYear - 4) % 12 + 12) % 12;
  return TIANGAN[ganIdx] + DIZHI[zhiIdx];
}

/**
 * 阳历月份 → 月柱干支（粗略，按节气简化为公历月份对应）
 * 注意：精确月柱需节气时刻（如立春/惊蛰），这里给出参考值
 * @param {number} month 阳历月份 1-12
 * @returns {string} 月柱干支（参考）
 */
export function getMonthGzBySolar(month) {
  // 简化规则（按节气粗略划分，误差可能 1-2 天）：
  // 寅月(正月) = 2/4 ~ 3/5 (公历 2月)
  // 卯月 = 3/5 ~ 4/4 (3月)
  // 辰月 = 4/4 ~ 5/5 (4月)
  // 巳月 = 5/5 ~ 6/5 (5月)
  // 午月 = 6/5 ~ 7/7 (6月)
  // 未月 = 7/7 ~ 8/7 (7月)
  // 申月 = 8/7 ~ 9/7 (8月)
  // 酉月 = 9/7 ~ 10/8 (9月)
  // 戌月 = 10/8 ~ 11/7 (10月)
  // 亥月 = 11/7 ~ 12/7 (11月)
  // 子月 = 12/7 ~ 1/5 (12月)
  // 丑月 = 1/5 ~ 2/4 (1月)
  const monthMap = {
    1: '丑', 2: '寅', 3: '卯', 4: '辰', 5: '巳', 6: '午',
    7: '未', 8: '申', 9: '酉', 10: '戌', 11: '亥', 12: '子'
  };
  return monthMap[month] || '寅';
}

/**
 * 时辰 → 时支
 * @param {number} hour 0-23
 * @returns {string} 时支
 */
export function getHourZhi(hour) {
  // 子时 23-01, 丑时 01-03, 寅时 03-05, ...
  const zhiIdx = Math.floor((hour + 1) / 2) % 12;
  return DIZHI[zhiIdx];
}

/**
 * 完整反查：阳历日期+时辰 → 八字四柱（粗略）
 * @param {number} year 阳历年
 * @param {number} month 阳历月
 * @param {number} day 阳历日
 * @param {number} hour 阳历时 0-23
 * @param {string} dayGz 已知日柱（必须用户提供，万年历反推日柱需 200+ 年日历表）
 * @returns {object} {yearGz, monthGz, dayGz, hourGz, dayMaster}
 */
export function lookupBaziBySolar(year, month, day, hour, dayGz) {
  const yearGz = getYearGzBySolar(year, month, day);
  const monthZhi = getMonthGzBySolar(month);
  // 月干根据年干推算：甲己之年丙作首
  const yearGan = yearGz.charAt(0);
  const yearGanIdx = TIANGAN.indexOf(yearGan);
  const monthGanStart = [0, 2, 4, 6, 8].indexOf(yearGanIdx % 5);
  // 寅月起丙，卯月起丁... 丑月起己
  const zhiToIdx = { '寅': 2, '卯': 3, '辰': 4, '巳': 5, '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11, '子': 0, '丑': 1 };
  const zhiIdx = zhiToIdx[monthZhi];
  const monthGanIdx = (monthGanStart + zhiIdx) % 10;
  const monthGz = TIANGAN[monthGanIdx] + monthZhi;

  // 时支
  const hourZhi = getHourZhi(hour);
  const hourZhiIdx = DIZHI.indexOf(hourZhi);
  // 时干根据日干推算：甲己还加甲
  const dayGan = dayGz.charAt(0);
  const dayGanIdx = TIANGAN.indexOf(dayGan);
  const hourGanStart = [0, 2, 4, 6, 8].indexOf(dayGanIdx % 5);
  const hourGanIdx = (hourGanStart + hourZhiIdx) % 10;
  const hourGz = TIANGAN[hourGanIdx] + hourZhi;

  return {
    yearGz,
    monthGz,
    dayGz: dayGz || '??',
    hourGz,
    dayMaster: dayGz ? dayGz.charAt(0) : '?',
    precision: 'rough',
    notes: '年柱/时柱按公历推算（误差±1天），月柱按节气粗略划分，**日柱需查万年历**'
  };
}

// ============ 日柱精确反查（基于基准日 1900-01-01 = 甲戌日） ============

/**
 * 阳历日期 → 日柱干支（精确到日，1900-2100 有效）
 * 基准日：1900年1月1日 = 甲戌日（60甲子序号 11，0-indexed=10）
 * 注意：日干支是 60 天一循环的"儒略日"传统，无需节气校正
 * @param {number} year 阳历年 1900-2100
 * @param {number} month 阳历月 1-12
 * @param {number} day 阳历日 1-31
 * @returns {string} 日柱干支
 */
export function getDayGzBySolar(year, month, day) {
  // 用 UTC 计算天数差，避免时区影响
  const target = Date.UTC(year, month - 1, day);
  const base = Date.UTC(1900, 0, 1);
  const diffDays = Math.round((target - base) / 86400000);
  // 1900-01-01 是 JIAZI[10] = 甲戌
  const idx = ((10 + diffDays) % 60 + 60) % 60;
  return JIAZI[idx];
}

/**
 * 完整反查 v2：含精确日柱
 * @param {number} year 阳历年
 * @param {number} month 阳历月
 * @param {number} day 阳历日
 * @param {number} hour 阳历时 0-23（可选，null 表示不详）
 * @returns {object} { yearGz, monthGz, dayGz, hourZhi, dayMaster, precision, notes }
 */
export function lookupBaziBySolarPrecise(year, month, day, hour = null) {
  // 1. 年柱（仍按立春粗略规则，2/4 前用上年）
  const yearGz = getYearGzBySolar(year, month, day);

  // 2. 月柱（仍按节气粗略分月，误差 ±1-2 天）
  const monthZhi = getMonthGzBySolar(month);
  const yearGan = yearGz.charAt(0);
  const yangStemStart = { '甲': 2, '己': 2, '乙': 4, '庚': 4, '丙': 6, '辛': 6, '丁': 8, '壬': 8, '戊': 0, '癸': 0 };
  const startGanIdx = yangStemStart[yearGan] ?? 0;
  const zhiToIdx = { '寅': 2, '卯': 3, '辰': 4, '巳': 5, '午': 6, '未': 7, '申': 8, '酉': 9, '戌': 10, '亥': 11, '子': 0, '丑': 1 };
  const monthGanIdx = (startGanIdx + zhiToIdx[monthZhi]) % 10;
  const monthGz = TIANGAN[monthGanIdx] + monthZhi;

  // 3. 日柱（精确，按儒略日推算）
  const dayGz = getDayGzBySolar(year, month, day);
  const dayMaster = dayGz.charAt(0);

  // 4. 时支（按时辰表）
  const hourZhi = (hour !== null) ? getHourZhi(hour) : null;

  return {
    yearGz,
    monthGz,
    dayGz,
    hourZhi,
    dayMaster,
    precision: 'precise-day',
    notes: '日柱按儒略日精确推算（误差 0），年柱/时柱/时支按公历换算（误差±1天），月柱按节气粗略划分（误差±2天）'
  };
}

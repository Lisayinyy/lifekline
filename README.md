# 人生K线 - 命运可视化

基于传统八字命理 + AI 思路的人生运势 K 线图生成器。输入八字与大运信息，生成 100 年人生运势走势图，并附命理分析报告。

> **声明**：本项目仅供娱乐学习，命理分析并非绝对科学预测，请理性看待。

## 快速开始

由于使用了 ES Module，启动时需要通过 HTTP 服务器访问（不能直接双击 HTML 文件）。

### 方法 1：Python 内置服务器

```bash
cd lifekline
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

### 方法 2：Node.js

```bash
cd lifekline
npx serve .
# 或
npx http-server -p 8000
```

### 方法 3：VS Code Live Server

安装 Live Server 插件，右键 `index.html` → Open with Live Server。

## 使用说明

1. **输入姓名和性别**
2. **输入阳历出生年份**
3. **输入四柱干支**（年柱、月柱、日柱、时柱）
   - 可通过万年历或八字排盘工具查询
4. **输入起运年龄**（虚岁）和**第一步大运**
5. 点击 **生成人生K线** 查看结果

## 大运顺逆规则

- **阳年男命**、**阴年女命**：顺排
- **阴年男命**、**阳年女命**：逆排

阳年 = 年干为甲丙戊庚壬；阴年 = 年干为乙丁己辛癸。

## 示例数据

软件默认填入示例数据（2003 年生，癸未年，乾造），可直接点击"生成人生K线"查看效果。

## 技术栈

- 纯 HTML / CSS / JavaScript（无构建步骤）
- Tailwind CSS（CDN）
- Canvas 2D 绘制 K 线图
- ES Modules

## 文件结构

```
lifekline/
├── index.html           # 入口 HTML
├── js/
│   ├── main.js          # 应用入口
│   ├── pages.js         # 输入页/结果页渲染
│   ├── bazi.js          # 八字命理数据与算法
│   ├── kline.js         # Canvas K 线图绘制
│   └── analysis.js      # 命理分析生成
└── README.md
```

## 功能特性

- ✅ 100 年 K 线走势图
- ✅ 大运分区背景
- ✅ 悬停查看流年详情（开盘/收盘/最高/最低 + 命理解析）
- ✅ 标记当前年龄
- ✅ 八字核心展示（含十神）
- ✅ 命理总评（格局、强弱、喜忌神、性格、事业）
- ✅ 大运总览
- ✅ 人生高峰 / 需谨慎年份
- ✅ 详细命理分析
- ✅ 移动端响应式

## 致谢

本项目参考了 [lifekline.0xsakura.me](https://lifekline.0xsakura.me/) 的产品设计思路，仅作技术学习使用。

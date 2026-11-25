import type { StudyDay, WorkbenchData } from '../types';

function addDaysIso(baseIso: string, offset: number): string {
  const [y, m, d] = baseIso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + offset));
  const yy = dt.getUTCFullYear();
  const mm = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(dt.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dd}`;
}

function build17DayPlan(startIso = '2026-11-25'): StudyDay[] {
  const blueprint: Array<{
    phase: string;
    focusTheme: string;
    oneJob: string;
    oneJobSection: 'listening' | 'reading' | 'writing';
    tasks: Array<{
      section: 'listening' | 'reading' | 'writing';
      title: string;
      minutes: number;
      priority: 'core' | 'secondary' | 'protect';
    }>;
  }> = [
    {
      phase: 'Phase 1 · 听力破冰与写作建框',
      focusTheme: '摸清听力失分点 + 确立作文三段骨架',
      oneJob: '完成 1 套真题听力长对话+篇章计时训练，并精听复盘 1 篇讲座',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '真题 Section A+B 计时训练（18分钟）并核对转折题错因', minutes: 25, priority: 'core' },
        { section: 'listening', title: '精听 1 篇 Section C 讲座：盲听2遍 → 对原文标同义替换', minutes: 20, priority: 'core' },
        { section: 'writing', title: '熟记“观点论证三段式”骨架，套写 1 篇 AI 主题首尾段', minutes: 25, priority: 'secondary' },
        { section: 'reading', title: '仔细阅读 1 篇限时 9 分钟（保持 200+ 手感）', minutes: 15, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 1 · 听力破冰与写作建框',
      focusTheme: '攻克讲座单题 14.2 分 + 翻译主干拆句',
      oneJob: '限时刷完 3 篇 Section C 讲座（12分钟），吃透首尾句与举例题',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: 'Section C 讲座 3 篇连刷（12分钟）+ 逐题标注陷阱类型', minutes: 30, priority: 'core' },
        { section: 'listening', title: '跟读今日讲座中听糊的 5 个连读/弱读长句', minutes: 15, priority: 'core' },
        { section: 'writing', title: '限时 25 分钟完成“新能源绿色转型”段落翻译并对照改错', minutes: 30, priority: 'secondary' },
        { section: 'reading', title: '长篇信息匹配 1 篇限时 12 分钟（练扫读定位）', minutes: 15, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 1 · 听力破冰与写作建框',
      focusTheme: '听前 30 秒选项预读法 + 完整作文首稿',
      oneJob: '用“划动词+预测主题”法完成 1 套完整真题听力（25分钟）',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '完整真题听力 1 套（25分钟，严禁暂停）并登记听力日志', minutes: 30, priority: 'core' },
        { section: 'listening', title: '错题归类进错题本，重点复盘 2 篇得分最低的片段', minutes: 20, priority: 'core' },
        { section: 'writing', title: '限时 30 分钟写完 1 篇 170 词议论文并用官方自检表打分', minutes: 35, priority: 'secondary' },
        { section: 'reading', title: '仔细阅读 1 篇限时 9 分钟 + 复盘干扰项特征', minutes: 15, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 1 · 听力破冰与写作建框',
      focusTheme: '听力同义替换高频库 + 翻译民生文化句型',
      oneJob: '整理近 3 天听力所有同义替换词组，再刷 1 组篇章+讲座',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: 'Section B + Section C 组合限时刷题（22分钟）', minutes: 25, priority: 'core' },
        { section: 'listening', title: '录入 10 组今日高频同义替换词进语料库并遮挡自测', minutes: 20, priority: 'core' },
        { section: 'writing', title: '完成“公共图书馆/全民阅读”翻译练习，练无主句转被动', minutes: 30, priority: 'secondary' },
        { section: 'reading', title: '选词填空 1 篇严控 7 分钟（只练词性秒判，绝不超时）', minutes: 12, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 1 · 听力破冰与写作建框',
      focusTheme: '态度题与隐性否定专项 + 写作亮点句式',
      oneJob: '专攻长对话/讲座态度题，完成 1 套真题听力冲刺 145+ 估算分',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '完整真题听力 1 套（计时25分钟）重点标记 + / - / ± 态度', minutes: 30, priority: 'core' },
        { section: 'listening', title: '精听 1 篇错题最多的讲座，补齐速记符号短板', minutes: 20, priority: 'core' },
        { section: 'writing', title: '整理 6 个万能高分功能句（让步/因果/倒装收尾）并造句', minutes: 25, priority: 'secondary' },
        { section: 'reading', title: '仔细阅读 2 篇连刷（18分钟），守住 80%+ 正确率', minutes: 22, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 1 · 听力破冰与写作建框',
      focusTheme: '第一阶段微模考检验（看听力是否逼近 150）',
      oneJob: '完成首次阶段全真模考（130分钟），把分项成绩录入模考追踪',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '全真模拟 1（严格按 15:00 考场节奏做听力+涂卡）', minutes: 30, priority: 'core' },
        { section: 'writing', title: '模考内限时完成作文 30 分钟 + 翻译 30 分钟（不查词典）', minutes: 60, priority: 'secondary' },
        { section: 'reading', title: '模考内限时 40 分钟完成阅读三板块并记录各段耗时', minutes: 40, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 2 · 真题提速与分数爬坡',
      focusTheme: '模考 1 深度复盘 + 清理写作低级语法错',
      oneJob: '逐题复盘模考 1 听力失分点，并重写模考作文的薄弱中段',
      oneJobSection: 'writing',
      tasks: [
        { section: 'listening', title: '复盘模考 1 听力所有错题，精听错得最惨的 1 篇讲座', minutes: 30, priority: 'core' },
        { section: 'writing', title: '逐句精修模考 1 作文与翻译，记录 3 类常犯语法/搭配错', minutes: 35, priority: 'secondary' },
        { section: 'reading', title: '复盘模考 1 阅读错题，提炼 1 条定位防坑规则', minutes: 15, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 2 · 真题提速与分数爬坡',
      focusTheme: '听力稳定 150+ 攻坚日',
      oneJob: '完成 1 套最新年份真题听力（目标对 ≥16/25，估算 ≥150）',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '最新年份真题听力完整 1 套（25分钟）并记录日志', minutes: 30, priority: 'core' },
        { section: 'listening', title: '对标陷阱清单复盘错题，勾选自己最常踩的 2 个陷阱', minutes: 20, priority: 'core' },
        { section: 'writing', title: '限时 30 分钟练习“问题解决型”作文（碎片化注意力主题）', minutes: 35, priority: 'secondary' },
        { section: 'reading', title: '长篇信息匹配 1 篇限时 11 分钟提速训练', minutes: 15, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 2 · 真题提速与分数爬坡',
      focusTheme: '翻译中国主题词汇冲刺 + 听力盲听耐力',
      oneJob: '连续完成 2 篇不同题材六级翻译（科技+文化），提炼 15 个高频词',
      oneJobSection: 'writing',
      tasks: [
        { section: 'listening', title: 'Section C 讲座 3 篇计时（12分钟）+ 1 篇逐句精听', minutes: 30, priority: 'core' },
        { section: 'writing', title: '2 篇六级真题翻译定时演练（每篇 22 分钟）+ 译文对照', minutes: 45, priority: 'secondary' },
        { section: 'reading', title: '仔细阅读 1 篇限时 9 分钟保持手感', minutes: 12, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 2 · 真题提速与分数爬坡',
      focusTheme: '听力倍速脱敏训练 + 写作提速到 25 分钟',
      oneJob: '用 1.1x 语速刷 1 篇讲座脱敏，再用原速完成 1 套真题听力',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '1.1x 语速热身 1 篇讲座 + 原速完成真题 Section A/B/C', minutes: 35, priority: 'core' },
        { section: 'listening', title: '复盘今日错题，整理听力高频场景词进语料库', minutes: 15, priority: 'core' },
        { section: 'writing', title: '限时 25 分钟完成“终身学习”主题作文并做 5 分钟语法自检', minutes: 30, priority: 'secondary' },
        { section: 'reading', title: '仔细阅读 2 篇 + 选词填空 1 篇（总控 25 分钟）', minutes: 25, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 2 · 真题提速与分数爬坡',
      focusTheme: '第二阶段全真模考（瞄准总分 475+ / 听力 ≥155）',
      oneJob: '下午 15:00 全真模考 2，严格卡死每个板块时间并记录轨迹',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '全真模拟 2 听力实战（无回放，当场涂完答题卡）', minutes: 30, priority: 'core' },
        { section: 'writing', title: '全真模拟 2 写作与翻译（双板块严格控制在 58 分钟内）', minutes: 60, priority: 'secondary' },
        { section: 'reading', title: '全真模拟 2 阅读三板块（40 分钟稳保 200+）', minutes: 40, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 2 · 真题提速与分数爬坡',
      focusTheme: '模考 2 错题大扫除 + 写作模板定型',
      oneJob: '把模考 2 听力与写作所有扣分点清零，固化个人万能写作模板',
      oneJobSection: 'writing',
      tasks: [
        { section: 'listening', title: '精听模考 2 听力所有错题段，核实是否稳过 150 分底线', minutes: 30, priority: 'core' },
        { section: 'writing', title: '整合自己的 2 套终极作文模板（议论文+问题解决）各背默 1 遍', minutes: 35, priority: 'secondary' },
        { section: 'reading', title: '错题本全量过一遍阅读错题，标记“已掌握”项', minutes: 20, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 3 · 全真模考与考前稳态',
      focusTheme: '听力高分冲刺（长对话满血 + 讲座保 7/10）',
      oneJob: '完成 1 套高难度真题听力，确保 Section A 错 ≤1 且讲座对 ≥7',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '高难度真题听力 1 套（25分钟）并记录日志对比均值', minutes: 30, priority: 'core' },
        { section: 'listening', title: '专项复盘讲座漏听句，巩固笔记符号节奏', minutes: 15, priority: 'core' },
        { section: 'writing', title: '高频翻译主题词速背（经济/生态/传统工艺/数字中国）+ 练 1 篇', minutes: 30, priority: 'secondary' },
        { section: 'reading', title: '阅读全套（选词+匹配+2篇仔阅）限时 38 分钟压测', minutes: 40, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 3 · 全真模考与考前稳态',
      focusTheme: '第三阶段全真模考（冲击 500 目标线）',
      oneJob: '下午 15:00 全真模考 3，验证“听力 ≥155 + 阅读 205 + 写译 140”配比',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '全真模拟 3 听力实战（测试耳机与预读节奏）', minutes: 30, priority: 'core' },
        { section: 'writing', title: '全真模拟 3 写作+翻译（预留 3 分钟专查拼写和主谓一致）', minutes: 60, priority: 'secondary' },
        { section: 'reading', title: '全真模拟 3 阅读（先仔阅 → 再匹配 → 最后选词）', minutes: 40, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 3 · 全真模考与考前稳态',
      focusTheme: '错题本清零 + 写作/翻译查漏补缺',
      oneJob: '清空错题本所有“待复盘”条目，默写 1 篇完整范文结构',
      oneJobSection: 'writing',
      tasks: [
        { section: 'listening', title: '重听过去 14 天错题最集中的 3 段真题音频（磨耳朵）', minutes: 25, priority: 'core' },
        { section: 'writing', title: '背默自定作文模板 + 重做 2 篇之前翻译卡壳的段落', minutes: 35, priority: 'secondary' },
        { section: 'reading', title: '遮挡自测语料库中全部高频词汇与同义替换', minutes: 20, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 3 · 全真模考与考前稳态',
      focusTheme: '轻量化保温（不刷偏题怪题）',
      oneJob: '只做 1 套听力保温 + 过一遍作文亮点句与翻译核心词',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '真题听力 1 套保温（保持耳感，不纠结单题）', minutes: 25, priority: 'core' },
        { section: 'writing', title: '快扫作文三段框架、过渡句与 30 个翻译核心词', minutes: 25, priority: 'secondary' },
        { section: 'reading', title: '仔细阅读 1 篇轻松限时 9 分钟稳信心', minutes: 12, priority: 'protect' },
      ],
    },
    {
      phase: 'Phase 3 · 全真模考与考前稳态',
      focusTheme: '考前一天：调作息 + 备考具 + 心理定锚',
      oneJob: '试听 15 分钟熟悉真题音频、检查准考证与耳机，23:00 前入睡',
      oneJobSection: 'listening',
      tasks: [
        { section: 'listening', title: '试听 1 篇熟悉真题讲座 + 检查考试调频耳机/电池', minutes: 20, priority: 'core' },
        { section: 'writing', title: '轻扫一遍作文模板首尾句与避坑自检表（绝不熬夜背新词）', minutes: 20, priority: 'secondary' },
        { section: 'reading', title: '核对考场路线、准考证、身份证、2B铅笔与黑色签字笔', minutes: 10, priority: 'protect' },
      ],
    },
  ];

  return blueprint.map((item, idx) => ({
    dayIndex: idx + 1,
    date: addDaysIso(startIso, idx),
    phase: item.phase,
    focusTheme: item.focusTheme,
    oneJob: item.oneJob,
    oneJobSection: item.oneJobSection,
    tasks: item.tasks.map((t, tIdx) => ({
      id: `d${idx + 1}-t${tIdx + 1}`,
      section: t.section,
      title: t.title,
      minutes: t.minutes,
      priority: t.priority,
      completed: false,
    })),
  }));
}

export const DEFAULT_WORKBENCH_DATA: WorkbenchData = {
  version: 1,
  profile: {
    userName: 'kevion',
    examDate: '2026-12-12',
    recentRefLabel: '研二英语期末 68/100',
    baselineTotal: 417,
    baseline: {
      listening: 130,
      reading: 200,
      writing: 60,
    },
    targetTotal: 500,
    target: {
      listening: 155,
      reading: 205,
      writing: 140,
    },
    listeningFloor: 150,
  },
  days: build17DayPlan('2026-11-25'),
  listeningLogs: [
    {
      id: 'll-seed-1',
      date: '2026-11-24',
      drillType: '基线诊断（历史实考参考）',
      minutes: 25,
      correctCount: 13,
      totalQuestions: 25,
      estimatedScore: 130,
      note: '长对话尚可，但 Section C 讲座信息密度高，容易漏掉转折后的同义替换。',
    },
  ],
  flaggedTraps: ['trap-turn', 'trap-lecture-frame'],
  wrongBook: [
    {
      id: 'wb-seed-1',
      date: '2026-11-24',
      section: 'listening',
      source: '基线诊断 · Section C 讲座示例',
      questionType: '转折细节题',
      mistakeSummary: '听到前句原词就仓促选了 B，忽略了后面 “actually / however” 引出的相反结论。',
      trapReason: '视听一致原词陷阱 + 转折后走神',
      fixRule: '凡是选项出现原文一字不差的短语，多留半拍听完下一句转折。',
      mastered: false,
    },
    {
      id: 'wb-seed-2',
      date: '2026-11-24',
      section: 'writing',
      source: '历史实考复盘 · 写作短板',
      questionType: '结构与表达单薄',
      mistakeSummary: '临场现编导致前松后紧，字数勉强达标但句式单一、连接词少且出现时态混用。',
      trapReason: '缺少固化三段骨架与交卷前 3 分钟语法核查',
      fixRule: '固定 3 分钟列提纲 + 22 分钟套骨架写 170 词 + 5 分钟专查时态/主谓一致。',
      mastered: false,
    },
    {
      id: 'wb-seed-3',
      date: '2026-11-24',
      section: 'translation',
      source: '历史实考复盘 · 段落翻译',
      questionType: '中式流水句硬译',
      mistakeSummary: '按中文语序逐字直译，把无主句硬翻导致一句出现两个谓语动词。',
      trapReason: '未先提取主干与切分长短句',
      fixRule: '动笔前先圈出每句“谁做了什么”，修饰成分降维为介词短语或分词。',
      mastered: false,
    },
    {
      id: 'wb-seed-4',
      date: '2026-11-24',
      section: 'reading',
      source: '阅读优势维护 · 仔阅推理题',
      questionType: '过度推断',
      mistakeSummary: '文章只说某研究存在局限，误选了“该理论已被彻底推翻”的绝对化选项。',
      trapReason: '未警惕 completely / exclusively 等极端副词',
      fixRule: '六级推理题答案高度克制，优先选含 may / tend to / partially 的温和表达。',
      mastered: true,
    },
  ],
  vocabBank: [
    {
      id: 'vc-1',
      term: 'attribute A to B',
      meaning: '把 A 归因于 B（听力因果题高频同义替换：owe to / stem from）',
      tag: 'listening',
      example: 'Researchers attribute the decline in focus to constant notifications.',
      mastered: false,
      addedAt: '2026-11-25',
    },
    {
      id: 'vc-2',
      term: 'skeptical / cautious about',
      meaning: '持怀疑/谨慎态度（听力态度题高频正确选项）',
      tag: 'listening',
      example: 'The speaker remains cautious about the short-term commercial impact.',
      mastered: false,
      addedAt: '2026-11-25',
    },
    {
      id: 'vc-3',
      term: 'strike a balance between A and B',
      meaning: '在 A 与 B 之间取得平衡（写作首段/末段万能表达）',
      tag: 'writing',
      example: 'Students must strike a balance between efficiency and deep thinking.',
      mastered: false,
      addedAt: '2026-11-25',
    },
    {
      id: 'vc-4',
      term: 'indispensable catalyst',
      meaning: '不可或缺的推动力量 / 催化剂（写作升华替换 important）',
      tag: 'writing',
      example: 'Lifelong learning serves as an indispensable catalyst for career resilience.',
      mastered: false,
      addedAt: '2026-11-25',
    },
    {
      id: 'vc-5',
      term: 'high-quality development',
      meaning: '高质量发展（翻译高频政策/经济表达）',
      tag: 'translation',
      example: 'Green innovation has become a key driver of high-quality development.',
      mastered: false,
      addedAt: '2026-11-25',
    },
    {
      id: 'vc-6',
      term: 'undermine / erode',
      meaning: '削弱、侵蚀（阅读态度与因果句高频动词）',
      tag: 'reading',
      example: 'Over-reliance on shortcuts may gradually erode analytical skills.',
      mastered: true,
      addedAt: '2026-11-25',
    },
  ],
  mocks: [
    {
      id: 'mock-baseline',
      date: '2025-06-14',
      label: '本科六级历史实考（基线）',
      listening: 130,
      reading: 200,
      writing: 60,
      total: 417,
      notes: '历史实考总分 417（分项为估算记忆值；近期研二英语期末 68/100）。目标：总分 500，听力守住 ≥150。',
      isBaseline: true,
    },
  ],
  writingState: {
    activeMode: 'essay',
    selectedPromptId: 'essay-ai-learning',
    draftsByPrompt: {
      'essay-ai-learning':
        'As generative AI becomes increasingly accessible on campus, students must strike a balance between leveraging smart tools and preserving independent thinking. ',
    },
    rubricChecksByPrompt: {},
  },
};

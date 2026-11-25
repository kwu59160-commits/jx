export interface ListeningTrap {
  id: string;
  code: string;
  title: string;
  signalWords: string[];
  detail: string;
  counterMove: string;
}

export interface NoteSymbol {
  symbol: string;
  meaning: string;
  example: string;
}

export interface WritingPrompt {
  id: string;
  mode: 'essay' | 'translation';
  yearTag: string;
  title: string;
  topicTag: string;
  promptText: string;
  keyVocab: string[];
  sampleOutline: string[];
  referenceSnippet: string;
}

export interface OutlineTemplate {
  id: string;
  name: string;
  bestFor: string;
  structure: {
    para: string;
    role: string;
    frame: string;
  }[];
}

export interface RubricItem {
  id: string;
  category: string;
  label: string;
  weight: number; // sums to 15 raw points -> maps to 106.5
}

export const CET6_LISTENING_TRAPS: ListeningTrap[] = [
  {
    id: 'trap-turn',
    code: 'T-01',
    title: '转折后才是真实考点',
    signalWords: ['but', 'however', 'actually', 'in fact', 'nevertheless', 'yet'],
    detail: '前句往往给出干扰选项的原词，真正答案藏在转折词之后的重读短语里。',
    counterMove: '听到转折词立刻竖起耳朵，把前一句划掉，只记后半句核心动词与态度。',
  },
  {
    id: 'trap-synonym',
    code: 'T-02',
    title: '视听一致陷阱 vs 同义替换',
    signalWords: ['原词重现', '偷换主语', '时态错位'],
    detail: '六级讲座和篇章高频使用“原词拼凑假选项”，正确选项通常是对原文的同义改写。',
    counterMove: '选项中出现一字不差的原文生词时先核对主语和否定词；优先锁定语义同义改写项。',
  },
  {
    id: 'trap-lecture-frame',
    code: 'T-03',
    title: '讲座首尾句与举例题',
    signalWords: ['today we will examine', 'for instance', 'to illustrate', 'the key takeaway'],
    detail: 'Section C 讲座第1题常考开头主旨，中间考例子所支撑的观点，末题常考结论或建议。',
    counterMove: '放音前30秒先扫4个选项的共有名词预测主题；听到例子时重点记例子前的一句论点。',
  },
  {
    id: 'trap-negation',
    code: 'T-04',
    title: '隐性否定与虚拟语气',
    signalWords: ['hardly', 'far from', 'rather than', 'if only', 'would have'],
    detail: '不直接出现 not，却表达完全相反的意思或未发生的遗憾。',
    counterMove: '笔记里遇到隐性否定直接画大叉 ×，防止顺着正面词汇误选。',
  },
  {
    id: 'trap-number-compare',
    code: 'T-05',
    title: '比较级、最高级与因果链',
    signalWords: ['more than', 'the primary cause', 'lead to', 'attributed to', 'unlike'],
    detail: '细节题常把 A 导致 B 反向改成 B 导致 A，或把次要原因说成首要原因。',
    counterMove: '用箭头速记方向（A → B），遇到 the most / primarily 圈星号。',
  },
  {
    id: 'trap-attitude',
    code: 'T-06',
    title: '说话人态度与语气重音',
    signalWords: ['skeptical', 'cautious', 'optimistic', 'dismissive', 'surprisingly'],
    detail: '态度题常出现在长对话和讲座末尾，答案藏在形容词、副词和声调起伏中。',
    counterMove: '边听边在题号旁标 +（赞同）、-（质疑）、±（辩证客观看待）。',
  },
];

export const NOTE_TAKING_SYMBOLS: NoteSymbol[] = [
  { symbol: '→ / ←', meaning: '导致 / 源于', example: 'AI → prod↑ (AI提升效率)' },
  { symbol: '↑ / ↓', meaning: '上升 / 下降', example: 'cost↓, enroll↑' },
  { symbol: '∵ / ∴', meaning: '因为 / 所以', example: '∵ budget cut ∴ delay' },
  { symbol: '≠ / vs', meaning: '不同 / 对比转折', example: 'theory ≠ practice' },
  { symbol: '★', meaning: '最高级 / 核心结论', example: '★ key = habit' },
  { symbol: '+ / - / ±', meaning: '支持 / 反对 / 辩证', example: 'prof: ± (cautious)' },
];

export const LISTENING_DRILL_PRESETS = [
  {
    id: 'long-conv',
    name: 'Section A 长对话',
    minutes: 8,
    questions: 8,
    materialLabel: '科研汇报 / 夜市调查',
    weightNote: '每题 7.1 分 · 共 56.8 分（最容易稳拿分）',
    tip: '预览选项抓“人物关系 + 核心矛盾”，重点听第二人回应与转折。',
  },
  {
    id: 'passages',
    name: 'Section B 听力篇章',
    minutes: 10,
    questions: 7,
    materialLabel: '工具图书馆 / 无聊与创意',
    weightNote: '每题 7.1 分 · 共 49.7 分',
    tip: '边听边按题序推进，切忌在一道漏听题上停留超过 3 秒。',
  },
  {
    id: 'lectures',
    name: 'Section C 讲座讲话',
    minutes: 12,
    questions: 10,
    materialLabel: '珊瑚苗圃 / 笔记 / 夜火车',
    weightNote: '每题 14.2 分 · 共 142 分（上 150 分决胜区）',
    tip: '单题分值翻倍！前瞻选项划动词与抽象名词，死守开头、转折、举例、结尾。',
  },
  {
    id: 'intensive',
    name: '精听盲听复盘',
    minutes: 15,
    questions: 5,
    materialLabel: '博物馆说明牌 · 盲听',
    weightNote: '不看原文听 2 遍 → 对照原文标连读弱读与同义替换',
    tip: '每天只精听 1 篇讲座或 1 篇篇章，把听不出的连读记进错题语料库。',
  },
];

export const READING_DRILL_PRESETS = [
  {
    id: 'careful-reading',
    name: 'Section C 仔细阅读 (2篇)',
    minutes: 18,
    targetPerUnit: '9 分钟 / 篇',
    weightNote: '每题 14.2 分 · 共 142 分（你的核心得分护城河）',
    strategy: '题文同序：先看题干划定位词，回原文锁定出题句及其上下一句，警惕过度推断。',
  },
  {
    id: 'matching',
    name: 'Section B 长篇信息匹配',
    minutes: 12,
    targetPerUnit: '1.2 分钟 / 题',
    weightNote: '每题 7.1 分 · 共 71 分（扫描定位提速区）',
    strategy: '先扫 10 个句子划专有名词/数字/独特动词，再按段落首尾与高频实词逆向匹配。',
  },
  {
    id: 'banked-cloze',
    name: 'Section A 选词填空',
    minutes: 7,
    targetPerUnit: '40 秒 / 空',
    weightNote: '每题 3.55 分 · 共 35.5 分（限时收口，绝不超时）',
    strategy: '先给 15 个词标词性 (n./v./adj./adv.)，按句法成分缩小到 2-3 个词再看搭配；超时即停。',
  },
];

export const WRITING_PROMPTS: WritingPrompt[] = [
  {
    id: 'essay-ai-learning',
    mode: 'essay',
    yearTag: '高频预测 · 议论文',
    title: 'AI 工具与大学生自主思考能力',
    topicTag: '科技与教育',
    promptText:
      'Directions: For this part, you are allowed 30 minutes to write an essay that begins with the sentence "As generative AI becomes increasingly accessible on campus, students must strike a balance between leveraging smart tools and preserving independent thinking." You can make comments, cite examples or use your personal experiences to develop your essay. You should write at least 150 words but no more than 200 words.',
    keyVocab: [
      'cognitive offloading (认知卸载)',
      'critical scrutiny (批判性审视)',
      'indispensable catalyst (不可或缺的催化剂)',
      'over-reliance (过度依赖)',
      'intellectual autonomy (思维自主性)',
    ],
    sampleOutline: [
      '第一段：承接给定首句，指出 AI 提高检索与起草效率，但盲目代写会削弱问题拆解能力。',
      '第二段：双面论证（正向：辅助梳理框架、提供反馈；风险：跳过深度阅读与推理过程）。',
      '第三段：提出可行建议——将 AI 定位为“思维陪练”而非“答案替代品”，先独立构思再校验。',
    ],
    referenceSnippet:
      'Admittedly, intelligent assistants dramatically reduce the friction of information gathering and language polishing. Yet when convenience turns into passive outsourcing, learners forfeit the very struggle through which analytical judgment is forged.',
  },
  {
    id: 'essay-lifelong-learning',
    mode: 'essay',
    yearTag: '真题母题 · 观点论证',
    title: '快速变化时代下的终身学习',
    topicTag: '个人成长',
    promptText:
      'Directions: For this part, you are allowed 30 minutes to write an essay on the importance of cultivating lifelong learning habits in an era of rapid technological change. You should write at least 150 words but no more than 200 words.',
    keyVocab: [
      'obsolescence of skills (技能过时)',
      'adaptability (适应力)',
      'sustained competitiveness (持续竞争力)',
      'deliberate practice (刻意练习)',
      'broaden one’s intellectual horizon (拓宽认知视野)',
    ],
    sampleOutline: [
      '第一段：背景引入（行业迭代加速，文凭不再一劳永逸），亮明核心论点：终身学习是底气。',
      '第二段：两条并列论据（职业维度：跨界适应新工具；个人维度：保持思维敏锐与开放）。',
      '第三段：收束落脚到日常微习惯（固定复盘、主动输出），呼吁持续更新知识结构。',
    ],
    referenceSnippet:
      'In a labor market reshaped by automation every few years, static credentials quickly lose their edge; only those who treat learning as a continuous discipline remain resilient.',
  },
  {
    id: 'essay-digital-minimalism',
    mode: 'essay',
    yearTag: '热点话题 · 问题解决',
    title: '碎片化信息与深度专注力保护',
    topicTag: '社会生活',
    promptText:
      'Directions: For this part, you are allowed 30 minutes to write an essay discussing why young adults struggle to maintain deep focus in the digital age and what practical measures can be taken. Write 150–200 words.',
    keyVocab: [
      'fragmented attention (碎片化注意力)',
      'algorithmic feeds (算法推送)',
      'instant gratification (即时满足)',
      'deliberate boundaries (有意识的边界)',
      'reclaim mental clarity (重获思绪清明)',
    ],
    sampleOutline: [
      '第一段：描述现象（高频通知与短视频切割时间），提出核心问题：深度专注正成为稀缺能力。',
      '第二段：剖析成因（算法设计迎合即时反馈 + 缺乏无干扰学习时段）。',
      '第三段：给出 2 条具体对策（设定定时免打扰区间、用长文本阅读替代无意识刷屏）。',
    ],
    referenceSnippet:
      'To reclaim mental clarity, individuals need not abandon technology altogether; rather, setting deliberate notification-free blocks each day suffices to restore sustained concentration.',
  },
  {
    id: 'trans-green-energy',
    mode: 'translation',
    yearTag: '高频翻译 · 生态与科技',
    title: '中国新能源发展与绿色转型',
    topicTag: '绿色发展',
    promptText:
      '请将下面一段话翻译成英文（建议用时 25–30 分钟）：\n近年来，中国加快了能源结构绿色转型的步伐。随着光伏和风电技术的不断突破，清洁能源的发电成本显著下降，在电力供应中所占比例稳步提升。如今，新能源汽车不仅走进了千家万户，也在全球市场上展现出强劲的竞争力。绿色发展正逐步成为推动经济高质量增长的新引擎。',
    keyVocab: [
      'green transition of the energy mix (能源结构绿色转型)',
      'photovoltaic and wind power (光伏和风电)',
      'power generation costs (发电成本)',
      'new energy vehicles / NEVs (新能源汽车)',
      'high-quality economic growth (经济高质量增长)',
    ],
    sampleOutline: [
      '主干拆分：先抓每句主谓宾（中国加快步伐 / 成本下降、比例提升 / NEVs 走进家庭并展现竞争力 / 绿色发展成为新引擎）。',
      '时态统一：第一句与末句用现在完成时/现在进行时（has accelerated / is becoming），中间用 with 介词短语降维避免中式流水句。',
    ],
    referenceSnippet:
      'In recent years, China has accelerated the green transition of its energy mix. With continuous breakthroughs in photovoltaic and wind power technologies, the cost of clean power generation has dropped markedly, while its share in electricity supply has risen steadily. Today, new energy vehicles have not only entered millions of households but also demonstrated strong competitiveness in the global market. Green development is gradually becoming a new engine driving high-quality economic growth.',
  },
  {
    id: 'trans-library-culture',
    mode: 'translation',
    yearTag: '高频翻译 · 文化与民生',
    title: '城市公共图书馆与全民阅读',
    topicTag: '文化民生',
    promptText:
      '请将下面一段话翻译成英文（建议用时 25–30 分钟）：\n如今，越来越多的中国城市在社区和公园旁建起了风格各异的公共书房。这些阅读空间不仅免费向市民开放，还配备了便捷的自助借还设备，让人们在家门口就能享受安静的阅读时光。许多年轻人习惯在周末走进图书馆学习或参加文化讲座。浓郁的书香正悄悄提升着城市的温度与活力。',
    keyVocab: [
      'public study rooms / community libraries (公共书房)',
      'free of charge (免费)',
      'self-service borrowing and returning facilities (自助借还设备)',
      'right on one’s doorstep (在家门口)',
      'cultural lectures (文化讲座)',
    ],
    sampleOutline: [
      '处理“风格各异”：distinctively styled / of diverse architectural styles。',
      '处理“浓郁的书香正悄悄提升着城市的温度与活力”：意译更地道，如 A rich culture of reading is quietly enhancing the warmth and vitality of urban life。',
    ],
    referenceSnippet:
      'Nowadays, an increasing number of Chinese cities have built distinctively styled public study rooms beside residential communities and parks. Open to residents free of charge, these spaces are equipped with convenient self-service borrowing and returning facilities, allowing people to enjoy quiet reading right on their doorstep. Many young people make it a habit to visit libraries on weekends to study or attend cultural lectures. A rich reading atmosphere is quietly enriching the warmth and vitality of cities.',
  },
];

export const OUTLINE_TEMPLATES: OutlineTemplate[] = [
  {
    id: 'tpl-argument',
    name: '观点论证三段式（稳过 11–13 分）',
    bestFor: '给定首句 / 观点评述 / 重要性论述',
    structure: [
      {
        para: 'Para 1 · 引出与立场 (35–45词)',
        role: '现象背景 + 明确中心句',
        frame:
          'In an era marked by [核心背景], [主题] has drawn growing attention. From my perspective, [核心立场] plays an indispensable role in [目标价值].',
      },
      {
        para: 'Para 2 · 双维展开 (85–100词)',
        role: '论点一 + 阐释 + 论点二 + 举例/让步',
        frame:
          'First and foremost, [论点1], enabling individuals to [具体益处]. Equally important is that [论点2]. Admittedly, some may worry that [轻微让步]; yet when approached wisely, [回扣核心优势].',
      },
      {
        para: 'Para 3 · 行动收束 (35–45词)',
        role: '总结升华 + 务实建议',
        frame:
          'To sum up, [重申核心观点]. Only by [具体做法] can we truly harness its potential and achieve lasting progress.',
      },
    ],
  },
  {
    id: 'tpl-problem-solution',
    name: '现象剖析与对策式（适合社会热点）',
    bestFor: '问题解决 / 现状反思类作文',
    structure: [
      {
        para: 'Para 1 · 锚定痛点 (35–45词)',
        role: '直切现实矛盾，避免空泛套话',
        frame:
          'A striking trend in contemporary life is that [具体现象]. While this brings undeniable convenience, it has also sparked concern over [核心问题].',
      },
      {
        para: 'Para 2 · 成因与路径 (85–100词)',
        role: '剖析主因 + 两个层次的对策',
        frame:
          'Several factors account for this dilemma, foremost among them [主要原因]. Addressing it calls for coordinated effort. At the personal level, [个人措施]. Meanwhile, institutions and platforms should [外部措施].',
      },
      {
        para: 'Para 3 · 前景展望 (35–45词)',
        role: '凝练结语，倒装/强调句收尾',
        frame:
          'Ultimately, resolving [问题] hinges not on rejecting progress, but on cultivating disciplined habits that serve our long-term well-being.',
      },
    ],
  },
  {
    id: 'tpl-translation-checklist',
    name: '翻译四步拆句法（防漏译与硬译）',
    bestFor: 'CET-6 段落汉译英（中国文化/科技/民生）',
    structure: [
      {
        para: 'Step 1 · 定主干与时态',
        role: '先找真正的主语和谓语，切分长流水句',
        frame: '历史事实用过去时；“近年来/已经”用现在完成时；现状与趋势用一般现在/进行时。',
      },
      {
        para: 'Step 2 · 化无主句为被动或 There be',
        role: '中文常省略主语，英文必须补全',
        frame: '“建起了很多书房” → Many study rooms have been built / Cities have built...',
      },
      {
        para: 'Step 3 · 修饰语降维（分词 / 介词短语 / 定从）',
        role: '避免一口气堆三个 and',
        frame: '“随着……的突破” → With continuous breakthroughs in...; “不仅……而且……” → not only ... but also ...',
      },
    ],
  },
];

export const CET6_RUBRIC: RubricItem[] = [
  { id: 'r-relevance', category: '内容切题', label: '完整回应题干/首句要求，论点清晰不跑题', weight: 3 },
  { id: 'r-structure', category: '段落结构', label: '三段比例均衡（首尾简洁、中段充实），每段有明确主题句', weight: 2.5 },
  { id: 'r-cohesion', category: '衔接连贯', label: '自然使用过渡词（Admittedly / Equally important / Rather than），逻辑递进顺畅', weight: 2 },
  { id: 'r-variety', category: '词汇句式', label: '至少包含 2 处非简单句（定语从句/分词作状语/倒装）与 4 个六级精准表达', weight: 2.5 },
  { id: 'r-accuracy', category: '语言准确', label: '逐句核查主谓一致、时态统一、单复数、介词搭配与零拼写硬伤', weight: 3 },
  { id: 'r-length', category: '篇幅控制', label: '作文严格落在 150–200 词（或翻译无整句漏译/核心专词准确）', weight: 2 },
];

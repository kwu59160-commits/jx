export type ListeningSpeaker = 'W' | 'M' | 'N';

export interface ListeningLine {
  speaker: ListeningSpeaker;
  text: string;
}

export interface ListeningQuestion {
  id: string;
  stem: string;
  options: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  why: string;
}

export interface SpeechNote {
  phrase: string;
  hear: string;
  note: string;
}

export interface ListeningPiece {
  id: string;
  title: string;
  scene: string;
  lines: ListeningLine[];
  questions: ListeningQuestion[];
  speechNotes?: SpeechNote[];
}

export interface ListeningSet {
  presetId: string;
  title: string;
  blindFirst: boolean;
  pieces: ListeningPiece[];
}

const longConversations: ListeningSet = {
  presetId: 'long-conv',
  title: 'Section A · 两篇长对话',
  blindFirst: false,
  pieces: [
    {
      id: 'conv-symposium',
      title: 'Conversation 1 · 研讨会改题',
      scene: '学生想改研讨会题目，导师要求把论点收窄到一个具体机制。',
      lines: [
        {
          speaker: 'W',
          text: 'Professor Hale, do you have a minute? I was going to present my symposium paper on how campus cafés influence group study, but the interviews keep falling through.',
        },
        {
          speaker: 'M',
          text: 'Falling through how? You had eight students lined up last week.',
        },
        {
          speaker: 'W',
          text: 'Three cancelled after midterms, and the ones who stayed mostly talked about prices, not about how they actually use the space. If I force that into a paper about study behavior, the evidence will look thinner than the claim.',
        },
        {
          speaker: 'M',
          text: "Then don't stretch it. A narrower question is often stronger. What did they actually keep returning to?",
        },
        {
          speaker: 'W',
          text: "Whether the café's two-hour laptop limit pushes groups to book library rooms instead. Two people even described sharing a single table in shifts.",
        },
        {
          speaker: 'M',
          text: "That's a concrete mechanism. Reframe the title around the time limit and where the work goes afterward. You only need four solid interviews if they point the same direction. Drop the price comments unless they explain why someone leaves.",
        },
        {
          speaker: 'W',
          text: 'The abstract is due Friday. Is a revised title going to be a problem for the program?',
        },
        {
          speaker: 'M',
          text: "Send me the new title by Thursday noon and I'll forward it. Just don't change the argument again after that. And quote the students on the shift-taking. That's the detail a listener will remember.",
        },
      ],
      questions: [
        {
          id: 'conv-symposium-q1',
          stem: 'Why does the woman want to change her topic?',
          options: [
            'The café raised its prices before she could finish the interviews.',
            'Several interviews collapsed, and the remaining comments do not support her original claim.',
            'Professor Hale has already rejected her abstract as too informal.',
            'She has been reassigned to a paper about library booking software.',
          ],
          answer: 1,
          why: '她说三人在期中后取消，留下的人多在谈价格，硬写成 study behavior 会证据撑不起论点。价格本身不是改题原因。',
        },
        {
          id: 'conv-symposium-q2',
          stem: 'What does the man suggest she do with the comments about prices?',
          options: [
            'Open the paper with them as her strongest example.',
            'Compare them with a survey from the previous year.',
            'Leave them out unless they explain why someone leaves.',
            'Turn them into a separate chart for the symposium.',
          ],
          answer: 2,
          why: '原句 Drop the price comments unless they explain why someone leaves。除非解释“为什么离开”，否则丢掉。',
        },
        {
          id: 'conv-symposium-q3',
          stem: 'What new focus do they settle on?',
          options: [
            'How a laptop time limit moves group work into the library.',
            'Why students prefer café noise to the silence of the library.',
            'How midterms reduce the number of group projects.',
            'Whether four interviews are enough for a full thesis.',
          ],
          answer: 0,
          why: '两小时电脑时限把小组赶到图书馆、甚至轮流占一张桌子。导师让她围绕 time limit 和 afterward 改标题。',
        },
        {
          id: 'conv-symposium-q4',
          stem: 'What must the woman do before Thursday noon?',
          options: [
            'Complete the remaining eight interviews.',
            'Submit a full draft of the symposium paper.',
            'Send the revised title to the professor.',
            'Book a library room for the presentation.',
          ],
          answer: 2,
          why: 'Send me the new title by Thursday noon。摘要周五才交，周四中午前要先把新标题给导师转发。',
        },
      ],
    },
    {
      id: 'conv-market',
      title: 'Conversation 2 · 夜市观察',
      scene: '两名学生获准做夜市观察，但不能录音，还要避免把一次下雨的样本当成结论。',
      lines: [
        {
          speaker: 'M',
          text: "Lena, did you get the department's reply about our night-market observation?",
        },
        {
          speaker: 'W',
          text: "Yes. They approved the site, but we can't record audio. The stall owners said microphones make customers uneasy. We can take notes and count, that's it.",
        },
        {
          speaker: 'M',
          text: "That's annoying, but it still works for what we proposed. We wanted to see how long people stay at food stalls versus craft stalls, not collect quotes.",
        },
        {
          speaker: 'W',
          text: 'Right. I walked through last Saturday and the craft end was almost empty after nine, while the noodle stalls had queues. If we only go once, though, that might just be the weather. It rained after eight.',
        },
        {
          speaker: 'M',
          text: "Then we go twice. Friday and Saturday, same two hours, and we note the weather in the margin. I'll take the craft end. You stay with the food stalls, since you already know the layout.",
        },
        {
          speaker: 'W',
          text: 'Can we still ask two owners why they close early? That is not recording.',
        },
        {
          speaker: 'M',
          text: 'A short question is fine if they agree. Write it as a reported reason, not as a quotation you can analyze word for word. And we submit the count sheet on Monday, even if the comments are thin.',
        },
      ],
      questions: [
        {
          id: 'conv-market-q1',
          stem: 'Why are the students not allowed to record audio?',
          options: [
            'Stall owners worry that microphones will make customers uneasy.',
            'The department has lost the only recorder the course owns.',
            'The market bans written notes after nine in the evening.',
            'Rain last Saturday damaged their equipment.',
          ],
          answer: 0,
          why: '摊主认为麦克风会让顾客不自在。院系批准了场地，禁的是录音，不是笔记。',
        },
        {
          id: 'conv-market-q2',
          stem: 'What do they still plan to measure?',
          options: [
            'How owners describe the recipes they sell.',
            'How much money each stall earns on a rainy night.',
            'How long people stay at food stalls compared with craft stalls.',
            'Which classmates visit the market after class.',
          ],
          answer: 2,
          why: '原计划就是比较 food stalls 与 craft stalls 的停留时间，不是收集引语。',
        },
        {
          id: 'conv-market-q3',
          stem: 'Why does the woman distrust a single visit?',
          options: [
            'She arrived too late to see the craft stalls open.',
            'The department accepts observations only on weekdays.',
            'The noodle stalls refused to let her count the queue.',
            'The rain may have produced the pattern she noticed.',
          ],
          answer: 3,
          why: '她看见手作区九点后几乎没人，但八点后下了雨，所以一次观察可能只是天气造成的。',
        },
        {
          id: 'conv-market-q4',
          stem: 'What does the man say about talking to the owners?',
          options: [
            'They should avoid speaking to owners altogether.',
            'A short agreed question is fine if written as a reported reason, not a quotation.',
            'They should record the exact wording and analyze it word for word.',
            'They should interview owners only when they submit the sheet on Monday.',
          ],
          answer: 1,
          why: '对方同意就可以短问，但要写成 reported reason，不能当逐字引语分析。计数表周一照交。',
        },
      ],
    },
  ],
};

const passages: ListeningSet = {
  presetId: 'passages',
  title: 'Section B · 两篇短文',
  blindFirst: false,
  pieces: [
    {
      id: 'passage-tools',
      title: 'Passage 1 · 图书馆出借工具',
      scene: '一些城市图书馆开始外借电钻和清洗机。讲话重点不是“替代五金店”，而是这项服务靠什么才能持续。',
      lines: [
        {
          speaker: 'N',
          text: 'Public libraries in several mid-sized cities have started lending more than books. Beside the usual shelves, a growing number now keep a tool library: drills, carpet cleaners, and even pressure washers that residents can borrow with a library card. The idea is simple. Many household tools are used once or twice a year, yet they are expensive to buy and awkward to store.',
        },
        {
          speaker: 'N',
          text: 'Librarians did not invent the practice to compete with hardware stores. They noticed that new branches were already being asked for meeting rooms, sewing machines, and help with tax forms. Lending tools was a further step in treating the library as a shared utility rather than a quiet reading room. Early surveys suggest the people who borrow tools are not only the households with the lowest incomes. Apartment renters who lack a garage, and newer residents who have not yet bought equipment, use the service just as often.',
        },
        {
          speaker: 'N',
          text: 'The constraint is maintenance. A damaged drill removes that item for weeks, and staff who were trained to catalogue books now have to test batteries and replace blades. Cities that treat the tool collection as a small extra, without a repair budget, see the shelves thin out within a year. Where the service lasts, it is because the library budgets for upkeep the way it budgets for replacing worn paperbacks.',
        },
      ],
      questions: [
        {
          id: 'passage-tools-q1',
          stem: 'What is the passage mainly about?',
          options: [
            'Why hardware stores are losing customers to public libraries.',
            'How tool lending extends what a library is, and what keeps the service alive.',
            'How librarians are being retrained as full-time repair technicians.',
            'Why only low-income households borrow household tools.',
          ],
          answer: 1,
          why: '主旨是工具外借把图书馆变成 shared utility，以及没有维修预算服务就会在一年内变薄。不是和五金店竞争。',
        },
        {
          id: 'passage-tools-q2',
          stem: 'What do the early surveys suggest about the borrowers?',
          options: [
            'They are almost entirely households with the lowest incomes.',
            'They rarely include people who live in apartments.',
            'Renters without garages, and newer residents, use it as often as low-income households.',
            'Most of them already own a full set of tools at home.',
          ],
          answer: 2,
          why: 'not only the lowest incomes。没车库的租房者和还没置办工具的新居民同样常借。视听一致的“只有低收入”是干扰项。',
        },
        {
          id: 'passage-tools-q3',
          stem: 'Under what condition does the service last?',
          options: [
            'When staff would rather repair tools than catalogue books.',
            'When the library funds upkeep instead of treating the tools as a small extra.',
            'When the city stops replacing worn paperbacks.',
            'When borrowers agree to repair damaged drills themselves.',
          ],
          answer: 1,
          why: '能持续是因为把 upkeep 像更换旧书一样写进预算。没有维修预算的城市，架子一年内就空了。',
        },
      ],
    },
    {
      id: 'passage-boredom',
      title: 'Passage 2 · 无聊与新想法',
      scene: '实验说短暂无聊可能让想法更不寻常，但只在很窄的条件下成立，而且会损害需要准确性的任务。',
      lines: [
        {
          speaker: 'N',
          text: 'A series of laboratory studies has revived an old suspicion: a short spell of boredom may help people produce more original ideas, but only under a narrow condition. When participants were asked to copy phone numbers, or to sit with nothing to do, and were then given a creative task, the bored group often listed more unusual uses for an everyday object. The advantage disappeared if the empty interval was filled with a video, even a dull one.',
        },
        {
          speaker: 'N',
          text: 'The researchers argue that the mind, denied an easy external task, starts to wander toward distant associations. That wandering is useful when the later task rewards novelty. It is not useful when the later task rewards accuracy. In a follow-up, the same bored participants made more errors on a proofreading exercise than people who had spent the interval reading. Boredom, in other words, loosened attention rather than sharpening it.',
        },
        {
          speaker: 'N',
          text: 'The practical implication is easy to overstate. The empty interval in the successful trials lasted about twelve minutes, and participants could not reach for a phone. Advising students to be bored more often misses that detail. What the studies actually support is a protected gap before work that depends on unusual combinations, not a general claim that distraction is harmless. A feed that looks boring can still occupy the very associations the empty gap was meant to free.',
        },
      ],
      questions: [
        {
          id: 'passage-boredom-q1',
          stem: 'When did the creative advantage of boredom appear?',
          options: [
            'When the empty interval was filled with a dull video.',
            'When the later task rewarded accuracy rather than novelty.',
            'When people copied numbers or sat idle before a task that rewarded unusual ideas.',
            'When participants were free to check their phones for twelve minutes.',
          ],
          answer: 2,
          why: '抄号码或干坐之后做创意任务才出现优势。哪怕无聊的视频填上这段空档，优势就消失。',
        },
        {
          id: 'passage-boredom-q2',
          stem: 'What do the researchers think the mind does during the empty interval?',
          options: [
            'It wanders toward distant associations because no easy task is available.',
            'It becomes sharper at catching small printed errors.',
            'It stores the video more firmly than the later task.',
            'It stops wandering once the interval reaches twelve minutes.',
          ],
          answer: 0,
          why: '没有现成的外部任务时，思维走向远距离联想。这种游走只对奖励新奇的任务有用。',
        },
        {
          id: 'passage-boredom-q3',
          stem: 'What did the proofreading follow-up show?',
          options: [
            'Boredom improves careful checking.',
            'Boredom loosens attention instead of sharpening it.',
            'Reading and boredom produce the same number of errors.',
            'The effect appears only in people who dislike videos.',
          ],
          answer: 1,
          why: '无聊组校对错误更多。讲话人的结论是 loosened attention rather than sharpening it。',
        },
        {
          id: 'passage-boredom-q4',
          stem: 'What would overstate the finding?',
          options: [
            'Telling students to be bored more often, without a phone-free gap of a set length.',
            'Noting that even a dull video removed the creative advantage.',
            'Limiting the claim to tasks that reward unusual combinations.',
            'Remembering that the successful interval lasted about twelve minutes.',
          ],
          answer: 0,
          why: '成功条件是约十二分钟且不能拿手机。泛泛建议“多无聊一会儿”漏掉了这个限定。看起来无聊的信息流仍会占住那些联想。',
        },
      ],
    },
  ],
};

const lectures: ListeningSet = {
  presetId: 'lectures',
  title: 'Section C · 三篇讲座',
  blindFirst: false,
  pieces: [
    {
      id: 'lecture-coral',
      title: 'Lecture 1 · 珊瑚苗圃',
      scene: '讲座把珊瑚苗圃说成争取时间的办法，并强调碎片来源比种植速度更重要。',
      lines: [
        {
          speaker: 'N',
          text: 'Today I want to look at coral nurseries, not as a miracle cure for reefs, but as a way to buy time. When a reef is damaged by heat, the surviving colonies are often too scattered to reproduce well. A nursery gathers small fragments from those survivors, grows them on underwater frames or in sheltered tanks, and returns them to the reef once they are large enough to withstand grazing fish.',
        },
        {
          speaker: 'N',
          text: 'The detail that matters is where the fragments come from. Teams that collect only from the hottest, shallowest edge of a reef are selecting corals that have already lived through stress. Teams that collect whatever is easiest to reach may restore cover quickly and still plant corals that bleach again the next summer. So the nursery is only as useful as its source list.',
        },
        {
          speaker: 'N',
          text: 'There is a limit you should not slide past. Nursery-grown corals can rebuild structure, the branches and nooks that fish use, but they do not by themselves cool the water or stop the next marine heat wave. Projects that report success after one planting season are measuring cover, not long-term survival. The honest claim is narrower: nurseries can put heat-tolerant fragments back in useful densities, if the site is still habitable at all.',
        },
      ],
      questions: [
        {
          id: 'lecture-coral-q1',
          stem: 'How does the speaker want nurseries to be understood?',
          options: [
            'As a miracle cure that can replace other reef protection.',
            'As a way to buy time, not as a cure for heat.',
            'As a method that works only in laboratory tanks on land.',
            'As a project whose main purpose is to feed grazing fish.',
          ],
          answer: 1,
          why: '开头就否定 miracle cure，定义为 a way to buy time。鱼只是幼体长到能扛啃食之后才回植。',
        },
        {
          id: 'lecture-coral-q2',
          stem: 'What does the speaker say makes a nursery useful?',
          options: [
            'How quickly any available fragments can be planted.',
            'Whether the fragments come from corals that have already survived stress.',
            'How many visitors the reef receives the following summer.',
            'Whether the frames are built only in the hottest shallow water.',
          ],
          answer: 1,
          why: '有用程度取决于 source list。从最热浅水边缘取碎片，才是在选已经扛过压力的珊瑚。图方便则会种下明年再白化的珊瑚。',
        },
        {
          id: 'lecture-coral-q3',
          stem: 'What are one-season success reports often measuring?',
          options: [
            'Whether the surrounding water has cooled.',
            'Cover, rather than whether the corals survive in the long run.',
            'How many fish have permanently left the reef.',
            'The financial cost of the next marine heat wave.',
          ],
          answer: 1,
          why: '一个种植季后的“成功”量的是 cover，不是 long-term survival。苗圃不能自己给海水降温。',
        },
      ],
    },
    {
      id: 'lecture-notes',
      title: 'Lecture 2 · 为什么全抄反而记不住',
      scene: '讲座用 generation effect 说明：笔记要自己生成缺口，而不是把每句话打全。',
      lines: [
        {
          speaker: 'N',
          text: 'When students tell me they understand a lecture because they typed every sentence, I ask them to close the laptop and explain the argument without looking. Many cannot. The notes are complete, and the understanding is thin. Psychologists call one reason the generation effect: we remember material better when we produce a piece of it ourselves than when we only receive it.',
        },
        {
          speaker: 'N',
          text: 'Producing, here, does not mean writing more. It means transforming. A student who pauses twice in a lecture to write a single question the speaker has not answered is generating. A student who highlights the slide headings is mostly receiving. The second record looks fuller. On a test a week later, the first student usually retains the structure, because each question forced a decision about what was still missing.',
        },
        {
          speaker: 'N',
          text: 'This is not an argument against slides or against laptops as such. If the course exam rewards exact wording, a fuller transcript helps. Most university exams do not. They reward whether you can restate a claim, name its limit, and apply it to a new case. Notes built for that exam can be shorter on purpose. Leave gaps. The gap is the part your memory has to supply, and supplying it is what makes the idea stay.',
        },
      ],
      questions: [
        {
          id: 'lecture-notes-q1',
          stem: 'What problem does the speaker describe at the start?',
          options: [
            'Students who type every sentence still cannot explain the argument.',
            'Laptops have been banned in most of the lecture halls.',
            'Slide headings are too few to highlight usefully.',
            'University exams now require a word-for-word transcript.',
          ],
          answer: 0,
          why: '笔记是全的，理解是薄的。合上电脑就讲不出论证。',
        },
        {
          id: 'lecture-notes-q2',
          stem: 'What does the speaker count as generating?',
          options: [
            'Highlighting the heading on every slide.',
            'Producing a longer transcript than other students.',
            'Pausing to write a question the speaker has not answered.',
            'Typing each sentence so that nothing is missed.',
          ],
          answer: 2,
          why: 'Producing 不是写得更多，而是 transforming。记下讲者没回答的问题，才是在生成。划标题主要是在接收。',
        },
        {
          id: 'lecture-notes-q3',
          stem: 'When does a fuller transcript actually help?',
          options: [
            'When the exam rewards exact wording.',
            'When the exam asks you to apply a claim to a new case.',
            'When notes are shortened on purpose.',
            'When the test a week later rewards structure rather than gaps.',
          ],
          answer: 0,
          why: '只有考试奖励 exact wording 时，更全的逐字稿才有帮助。多数大学考试要的是复述、指出限度、迁移到新情境。',
        },
      ],
    },
    {
      id: 'lecture-trains',
      title: 'Lecture 3 · 夜火车并没有全面回来',
      scene: '讲座拆开“夜火车回归”的口号：回来的只是能和短途飞行竞争的少量线路。',
      lines: [
        {
          speaker: 'N',
          text: 'If you have read that night trains are coming back across Europe, treat the slogan carefully. The services being celebrated are real, but they are not a return to the dense network of the nineteen-eighties. What has returned is a smaller set of routes where a sleeper can compete with a short flight: city pairs roughly between seven hundred and a thousand kilometres apart, especially where a morning arrival saves a hotel night.',
        },
        {
          speaker: 'N',
          text: 'The economics are awkward. A seat on a night train earns less per hour than a seat on a day train, because the same carriage is moving while the passenger is asleep and cannot be turned over to a second customer. Operators therefore rely on two supports. One is the sleeper supplement, the extra fee for a bed. The other, on several new routes, is a public subsidy justified as an alternative to flying. Remove either, and the route becomes a press release rather than a timetable.',
        },
        {
          speaker: 'N',
          text: 'Passengers, meanwhile, are not buying nostalgia. Surveys of the new services find that the decisive factors are a reliable arrival and a bed that is private enough to work or sleep. The dining car, so prominent in older advertising, ranks far below punctuality. A revived night train that reaches the platform twenty minutes late has already lost the advantage it was sold on: the morning that begins in the right city, with the night already paid for.',
        },
      ],
      questions: [
        {
          id: 'lecture-trains-q1',
          stem: 'What does the speaker say is actually returning?',
          options: [
            'The dense night-train network of the nineteen-eighties.',
            'A smaller set of routes on which a sleeper can compete with a short flight.',
            'A dining car on every European sleeper service.',
            'Day trains that continue overnight without offering beds.',
          ],
          answer: 1,
          why: '口号要小心。回来的不是八十年代的密集网络，而是大约 700 到 1000 公里、清晨到达能省一晚酒店的少量线路。',
        },
        {
          id: 'lecture-trains-q2',
          stem: 'Why does a night-train seat earn less per hour?',
          options: [
            'Night tickets are legally required to undercut airfares.',
            'The sleeping passenger occupies a carriage that cannot be sold again that night.',
            'Public subsidies force the operator to charge nothing.',
            'Passengers refuse every journey longer than seven hundred kilometres.',
          ],
          answer: 1,
          why: '车厢在乘客睡觉时不能再卖给下一位顾客，所以每小时收入低于日间列车。',
        },
        {
          id: 'lecture-trains-q3',
          stem: 'What two supports do the operators rely on?',
          options: [
            'Nostalgia advertising and a staffed dining car.',
            'A sleeper supplement and, on some new routes, a public subsidy.',
            'Higher daytime fares and partnerships with hotels.',
            'Punctuality bonuses paid by the passengers themselves.',
          ],
          answer: 1,
          why: '两个支撑：卧铺附加费，以及若干新线路上作为飞行替代方案的公共补贴。拿掉任意一个，线路就只剩新闻稿。',
        },
        {
          id: 'lecture-trains-q4',
          stem: 'What do passenger surveys treat as decisive?',
          options: [
            'A reliable arrival and a bed private enough for work or sleep.',
            'A dining car of the kind older advertisements featured.',
            'How closely the design copies trains from the nineteen-eighties.',
            'Whether the route is receiving a subsidy.',
          ],
          answer: 0,
          why: '乘客买的不是怀旧。准点到达和够私密的床位才是决定因素，餐车远低于准点。迟到二十分钟就丢掉了卖点。',
        },
      ],
    },
  ],
};

const intensive: ListeningSet = {
  presetId: 'intensive',
  title: '精听 · 博物馆说明牌',
  blindFirst: true,
  pieces: [
    {
      id: 'intensive-labels',
      title: 'Blind listen · 说明牌为什么留不住人',
      scene: '先盲听两遍再做题。对答案后对照连读、弱读和句末重音，不要一上来看原文。',
      lines: [
        {
          speaker: 'N',
          text: 'Walk through a crowded museum and watch where people stop. They stop at objects, and they glance at the label beside them. Most labels fail that glance. They open with the object\'s catalogue number, or with a date the visitor cannot place, and the one sentence that would make the object matter is buried in the third line.',
        },
        {
          speaker: 'N',
          text: 'Curators defend the long label as a way to be precise. Precision is not the problem. Order is. A visitor who is standing up, often with someone talking beside them, will read about twenty words before moving on. If those twenty words are a title and a reason to care, the rest of the label can carry the scholarship. If those twenty words are a tomb number and a dynasty, the scholarship is never reached.',
        },
        {
          speaker: 'N',
          text: 'A useful test is to read the label aloud from two metres away. If a companion cannot repeat the point, the label is written for the catalogue, not for the room. Museums that have tried a first line limited to one plain claim, and moved the accession details to the bottom in smaller type, report longer stops. Not because the objects changed. Because the sentence that earned the stop was allowed to come first.',
        },
      ],
      speechNotes: [
        {
          phrase: 'and they glance',
          hear: 'and 读成很轻的 /ən/，几乎贴在 they 前面',
          note: '不要等一个咬得很清楚的 and。弱读一滑过去，真正的动作是 glance。',
        },
        {
          phrase: 'make the object matter',
          hear: 'matter 重读，catalogue number 一带而过',
          note: '埋在第三行的那句才是“让文物变得要紧”的句子。开篇的编号是诱饵。',
        },
        {
          phrase: 'Precision is not the problem. Order is.',
          hear: 'not the problem 下沉，Order is 抬起来',
          note: '转折后才是论点。策展人谈精确，是为了被后一句否定。',
        },
        {
          phrase: 'about twenty words',
          hear: 'twenty 清楚，about 很轻',
          note: '数字题。twenty words 不是 third line，也不是 two metres。',
        },
        {
          phrase: 'two metres away',
          hear: 'two metres 连读，away 重读',
          note: '两米是朗读测试的距离，不是标签的长度。',
        },
        {
          phrase: 'Not because the objects changed.',
          hear: 'Not because 先否定，后面的 Because 才给原因',
          note: '停留变长不是因为文物换了，而是因为那句值得停的话被放到了最前面。',
        },
      ],
      questions: [
        {
          id: 'intensive-labels-q1',
          stem: 'In a crowded museum, where does the speaker say people stop?',
          options: [
            'At the catalogue desk, before they look at any object.',
            'At the objects, with a glance at the label beside them.',
            'At labels that open with the name of a dynasty.',
            'At the shop, after they have read every panel.',
          ],
          answer: 1,
          why: 'They stop at objects, and they glance at the label。停的是文物，说明牌只是被瞥一眼。',
        },
        {
          id: 'intensive-labels-q2',
          stem: 'What do failing labels tend to open with?',
          options: [
            'A plain claim about why the object matters.',
            'A catalogue number, or a date the visitor cannot place.',
            'A twenty-word title written for a companion.',
            'The accession details already set in smaller type.',
          ],
          answer: 1,
          why: '失败的说明牌用 catalogue number 或访客无法定位的日期开头，真正有用的句子埋在第三行。',
        },
        {
          id: 'intensive-labels-q3',
          stem: 'How many words will a standing visitor read, according to the speaker?',
          options: [
            'About three full lines, however long they are.',
            'About twenty.',
            'The entire label, provided it is precise.',
            'Two metres of text.',
          ],
          answer: 1,
          why: '站着、旁边还有人说话时，大约二十个词就会走开。two metres 是后面朗读测试的距离。',
        },
        {
          id: 'intensive-labels-q4',
          stem: 'What is the aloud test meant to reveal?',
          options: [
            'Whether a companion two metres away can repeat the point.',
            'Whether the curator can pronounce the catalogue number.',
            'Whether the label matches a tomb number exactly.',
            'Whether the object can be seen from the catalogue room.',
          ],
          answer: 0,
          why: '两米外朗读，同伴如果复述不出要点，说明这张牌子是写给目录的，不是写给展厅的。',
        },
        {
          id: 'intensive-labels-q5',
          stem: 'Why do the museums report longer stops after the change?',
          options: [
            'The objects themselves were replaced with clearer ones.',
            'Visitors began arriving in smaller and quieter groups.',
            'The sentence that earns the stop was placed first.',
            'Accession details were removed from the label entirely.',
          ],
          answer: 2,
          why: 'Not because the objects changed。原因是那句值得停下的话被允许出现在第一行。登录号只是挪到下方小字，没有删掉。',
        },
      ],
    },
  ],
};

export const LISTENING_SETS: ListeningSet[] = [
  longConversations,
  passages,
  lectures,
  intensive,
];

export function getListeningSet(presetId: string): ListeningSet | undefined {
  return LISTENING_SETS.find((set) => set.presetId === presetId);
}

export function countListeningQuestions(set: ListeningSet): number {
  return set.pieces.reduce((sum, piece) => sum + piece.questions.length, 0);
}

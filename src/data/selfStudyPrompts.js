export const selfStudyTopics = [
  { id: 'work', label: 'Work & communication', keywords: ['deadline', 'feedback', 'priority', 'collaborate'] },
  { id: 'technology', label: 'Technology & society', keywords: ['convenience', 'privacy', 'access', 'impact'] },
  { id: 'environment', label: 'Environment & cities', keywords: ['sustainable', 'policy', 'resources', 'community'] },
  { id: 'education', label: 'Education & learning', keywords: ['motivation', 'practice', 'feedback', 'progress'] },
  { id: 'culture', label: 'Culture & identity', keywords: ['perspective', 'tradition', 'belonging', 'change'] },
  { id: 'daily-life', label: 'Daily life & decisions', keywords: ['habit', 'trade-off', 'practical', 'experience'] },
]

const templates = {
  Speaking: [
    { mode: 'opinion', title: 'Take and defend a position', instruction: 'Speak for 2–3 minutes. State a clear position, give two reasons, add a specific example, then acknowledge one reasonable counterpoint.', minWords: 80, checks: ['Mở đầu bằng quan điểm rõ ràng', 'Có ít nhất hai lý do và một ví dụ cụ thể', 'Có dùng một câu nhượng bộ hoặc phản biện', 'Kết thúc bằng kết luận ngắn'] },
    { mode: 'story', title: 'Tell a meaningful story', instruction: 'Speak for 2 minutes about a real experience. Set the context, describe a problem or turning point, and explain what you learned.', minWords: 65, checks: ['Kể theo trình tự thời gian dễ theo dõi', 'Dùng ít nhất ba động từ ở thì quá khứ', 'Giải thích được ý nghĩa hoặc bài học', 'Tránh chỉ liệt kê sự kiện'] },
  ],
  Writing: [
    { mode: 'argument', title: 'Write a balanced argument', instruction: 'Write 180–230 words. Present your position, develop two supporting ideas, include a qualification or counterargument, and finish with a precise conclusion.', minWords: 180, checks: ['Có mở bài nêu lập trường', 'Mỗi ý chính có giải thích hoặc ví dụ', 'Có ít nhất một counterargument/qualification', 'Kết luận không chỉ lặp lại mở bài'] },
    { mode: 'professional', title: 'Write with a real purpose', instruction: 'Write a concise professional message of 120–170 words. Explain the situation, make a clear request, propose a next step, and maintain an appropriate tone.', minWords: 120, checks: ['Nêu mục đích ngay từ đầu', 'Yêu cầu và next step cụ thể', 'Giọng văn phù hợp người nhận', 'Kết thúc lịch sự và tự nhiên'] },
  ],
  Grammar: [
    { mode: 'reformulation', title: 'Reformulate with precision', instruction: 'Write six original sentences about the topic. Use a different structure in each sentence: contrast, condition, cause, concession, comparison and emphasis.', minWords: 55, checks: ['Có đủ sáu câu riêng biệt', 'Dùng ít nhất ba loại liên từ khác nhau', 'Có một câu điều kiện và một câu nhượng bộ', 'Không lặp cùng một cấu trúc ở mọi câu'] },
    { mode: 'error-hunt', title: 'Explain the grammar choice', instruction: 'Write a short paragraph and deliberately use the target grammar naturally. Then add two lines explaining why your tense, article, preposition or modal choices fit the meaning.', minWords: 75, checks: ['Đoạn văn có ngữ cảnh rõ ràng', 'Có ít nhất một câu giải thích lựa chọn ngữ pháp', 'Ví dụ minh họa đúng ý định giao tiếp', 'Tự rà lỗi hòa hợp chủ-vị và thì'] },
  ],
  Vocabulary: [
    { mode: 'active-recall', title: 'Turn vocabulary into output', instruction: 'Write a short response using at least four target words naturally. Do not copy dictionary examples; change the collocation or grammatical form when possible.', minWords: 90, checks: ['Dùng ít nhất bốn từ mục tiêu', 'Mỗi từ nằm trong một ngữ cảnh có nghĩa', 'Có ít nhất một collocation tự nhiên', 'Không nhồi từ chỉ để đủ số lượng'] },
    { mode: 'register-shift', title: 'Change the register', instruction: 'Write the same message twice: first for a close friend, then for a professional or academic reader. Highlight the words and phrases whose register changes.', minWords: 100, checks: ['Có hai phiên bản cùng một ý', 'Thể hiện khác biệt informal/formal', 'Dùng từ thay thế chính xác, không chỉ đổi vài từ', 'Giữ nguyên thông tin cốt lõi'] },
  ],
  Reading: [
    { mode: 'critical-reading', title: 'Read between the lines', instruction: 'Choose a short article in the target language. Summarise the main claim, identify one assumption, and explain whether the evidence is convincing.', minWords: 100, checks: ['Tóm tắt đúng luận điểm chính', 'Chỉ ra ít nhất một assumption', 'Phân biệt fact, opinion và inference', 'Đưa ra đánh giá có lý do'] },
  ],
  Listening: [
    { mode: 'shadowing', title: 'Listen, shadow, improve', instruction: 'Choose a 60–90 second clip. Listen once for the gist, shadow it twice, then write what you understood and one pronunciation or connected-speech feature you noticed.', minWords: 70, checks: ['Nêu được gist trước khi xem transcript', 'Ghi lại ít nhất ba cụm nghe được', 'Nhận diện một feature phát âm', 'Nêu một điểm sẽ luyện lại'] },
  ],
}

const levelGuidance = {
  A1: 'Use short, accurate sentences and familiar vocabulary.',
  A2: 'Add basic reasons, time markers and connected sentences.',
  B1: 'Develop ideas with reasons, examples and clear linking.',
  B2: 'Show nuance, qualification, varied structures and precise collocations.',
  C1: 'Control register, implication, cohesion and complex argumentation.',
  C2: 'Aim for subtle meaning, idiomatic control and highly precise style.',
}

export function createSelfStudyPrompt({ skill = 'Speaking', level = 'B2', language = 'English', topic = selfStudyTopics[0].id, challenge = 'Precision', seed = 0 }) {
  const topicData = selfStudyTopics.find((item) => item.id === topic) || selfStudyTopics[0]
  const options = templates[skill] || templates.Speaking
  const template = options[Math.abs(seed) % options.length]
  const challengeText = {
    Precision: 'Prioritise exact word choice and natural collocations.',
    Fluency: 'Keep moving without translating word by word; use repair phrases naturally.',
    Nuance: 'Include a qualification, implied meaning or contrast rather than giving a simple answer.',
  }[challenge] || 'Prioritise exact word choice and natural collocations.'
  const task = `In ${language}, ${template.instruction} Topic: ${topicData.label}. ${challengeText}`
  const coachPrompt = `You are my demanding but constructive ${language} coach. I am practising at ${level}.\n\nTask: ${task}\n\nMy response:\n[PASTE MY RESPONSE HERE]\n\nCheck it against these criteria: ${template.checks.join('; ')}. Give me: (1) a score from 1–5 for task completion, accuracy, range and naturalness, (2) three high-impact corrections with explanations, (3) two more natural alternatives, and (4) one focused retry task. Do not rewrite everything for me.`
  return {
    id: `${skill.toLowerCase()}-${topicData.id}-${template.mode}-${seed}`,
    skill,
    mode: template.mode,
    title: template.title,
    topic: topicData.label,
    topicId: topicData.id,
    task,
    coachPrompt,
    checks: template.checks,
    keywords: topicData.keywords,
    minWords: template.minWords,
    guidance: levelGuidance[level] || levelGuidance.B2,
    challenge,
    level,
  }
}

export const selfStudySkills = Object.keys(templates)

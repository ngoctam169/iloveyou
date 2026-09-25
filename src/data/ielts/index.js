export const ieltsListening = [
  ['Form Completion','What is the caller’s surname?','Good evening. I would like to book a room. My surname is Henderson, H E N D E R S O N.',['Henderson','Anderson','Hudson'],0],
  ['Note Completion','What time does the library close on Friday?','On weekdays the library closes at eight, except Friday when it closes at six.',['5:00','6:00','8:00'],1],
  ['Multiple Choice','Why did the student choose the course?','I first considered economics, but the practical work on this environmental course convinced me.',['It was shorter.','It included practical work.','A friend recommended it.'],1],
  ['Matching','Which facility is opposite the café?','The café is beside reception, directly across from the computer room.',['Reception','Computer room','Lecture hall'],1],
  ['Table Completion','How much is the monthly membership?','An annual pass is two hundred pounds, while monthly membership costs twenty-five.',['£20','£25','£200'],1],
  ['Flow-chart Completion','What happens after the samples are heated?','First, label the samples. Heat them for ten minutes, then allow them to cool before measuring.',['They are measured.','They are labelled.','They are cooled.'],2],
  ['Sentence Completion','The speaker recommends bringing a _____.','The trail can become slippery after rain, so please bring a waterproof jacket and wear strong boots.',['map','waterproof jacket','first-aid kit'],1],
  ['Short Answer','Where will the group meet?','We will meet just inside the main entrance of the Natural History Museum.',['At the station','Inside the main entrance','Beside the café'],1],
  ['Multiple Choice','What is the lecture mainly about?','Today we will examine how urban gardens improve air quality and strengthen local communities.',['Food prices','Urban garden benefits','Building design'],1],
  ['Note Completion','Which skill will the workshop focus on?','The first workshop developed research skills. This Saturday we will focus on giving clear presentations.',['Research','Presentation','Interview'],1],
].map(([type,question,audio,options,answer], index) => ({ id:`il-${index + 1}`, section: Math.floor(index / 3) + 1, type, question, audio, transcript: audio, options, answer, explanation: `Chi tiết quyết định nằm trong câu: “${audio.split('.').at(-2)?.trim() || audio}”.`, vocabulary: ['key detail','paraphrase'] }))

export const ieltsReading = [
  {
    id:'ir-urban', title:'The Quiet Value of Urban Trees', topic:'Environment',
    passage:[
      'A. City trees are often valued for their appearance, yet their practical contribution is more substantial. Their leaves provide shade, while evaporation from foliage can reduce surrounding temperatures during hot weather.',
      'B. Trees also affect how people experience a neighborhood. Studies cited by urban planners associate greener streets with more walking and greater use of public spaces. Researchers are careful, however, not to claim that trees alone cause stronger communities.',
      'C. Maintaining an urban forest is not simple. Young trees need water, mature roots can damage poorly designed pavements, and some species cannot tolerate air pollution. Successful programs therefore choose species for local conditions and budget for long-term care.',
    ],
    questions:[
      ['True / False / Not Given','Leaves can help lower temperatures near trees.',['True','False','Not Given'],0,'A','lower temperatures','reduce surrounding temperatures','Cùng ý trực tiếp.'],
      ['True / False / Not Given','Trees are the only cause of stronger communities.',['True','False','Not Given'],1,'B','only cause','not to claim that trees alone cause','Passage phủ định “alone”.'],
      ['Matching Headings','Choose the best heading for paragraph C.',['Social benefits','Challenges of long-term care','The history of city parks'],1,'C','paragraph C','Maintaining…not simple; long-term care','Đoạn tập trung vào khó khăn bảo trì.'],
      ['Sentence Completion','Programs should select species for local _____.',['weather only','conditions','appearance'],1,'C','select species','choose species for local conditions','Từ khóa và đáp án nằm cùng câu.'],
      ['Short Answer','What can mature roots damage?',['pavements','leaves','public spaces'],0,'C','mature roots damage','roots can damage…pavements','Thông tin được nêu trực tiếp.'],
    ],
  },
  {
    id:'ir-sleep', title:'Why Sleep Supports Learning', topic:'Health',
    passage:[
      'A. Learning does not end when a study session finishes. During sleep, recently formed memories are reorganized and strengthened. This process is one reason why reviewing material before a normal night’s sleep can be effective.',
      'B. Not all sleep stages appear to serve exactly the same function. Deep sleep is linked with factual memory, whereas rapid-eye-movement sleep may help integrate ideas and support creative problem-solving. Scientists continue to investigate the boundaries of these roles.',
      'C. Sleeping less in order to revise for longer can therefore be counterproductive. A tired learner pays less attention and retrieves information less reliably. A consistent schedule is usually more valuable than a single night of last-minute study.',
    ],
    questions:[
      ['Yes / No / Not Given','The writer believes learning continues during sleep.',['Yes','No','Not Given'],0,'A','learning continues','memories are reorganized and strengthened','Quan điểm được xác nhận ở đoạn A.'],
      ['Matching Information','Which paragraph mentions creative problem-solving?',['A','B','C'],1,'B','creative problem-solving','support creative problem-solving','Cụm từ nằm ở đoạn B.'],
      ['Summary Completion','Deep sleep is associated with _____ memory.',['factual','emotional','short-term'],0,'B','Deep sleep','linked with factual memory','Paraphrase “associated with” = “linked with”.'],
      ['Multiple Choice','Why can studying all night be ineffective?',['It costs more.','It reduces attention and recall.','It changes sleep stages permanently.'],1,'C','counterproductive','pays less attention and retrieves…less reliably','Hai hậu quả giải thích đáp án.'],
      ['True / False / Not Given','One late study night always causes permanent memory damage.',['True','False','Not Given'],2,'C','permanent damage','not mentioned','Passage không nói về tổn thương vĩnh viễn.'],
    ],
  },
].map((passage) => ({ ...passage, questions: passage.questions.map(([type,question,options,answer,paragraph,questionKeyword,passageKeyword,explanation], index) => ({ id:`${passage.id}-q${index+1}`,type,question,options,answer,paragraph,questionKeyword,passageKeyword,explanation })) }))

export const ieltsWriting = [
  { id:'iw-line', task:'Task 1', type:'Line Graph', title:'Public transport use, 2000–2025', prompt:'The line graph shows the percentage of commuters using public transport in three cities from 2000 to 2025. Summarise the main features and make comparisons.', minWords:150, structure:['Introduction: paraphrase the prompt','Overview: identify the dominant trends','Body 1: compare starting points','Body 2: describe key changes'], vocabulary:['rose steadily','remained stable','reached a peak','respectively'], phrases:['Overall, it is clear that…','By contrast,…'] },
  { id:'iw-map', task:'Task 1', type:'Map', title:'A town centre before and after redevelopment', prompt:'The maps show a town centre in 2010 and after redevelopment in 2025. Summarise the main changes.', minWords:150, structure:['Introduction','Overall transformation','Changes in the north/east','Changes in the south/west'], vocabulary:['was converted into','was relocated','pedestrian area','underwent redevelopment'], phrases:['The most noticeable change is…','In place of the former…'] },
  { id:'iw-opinion', task:'Task 2', type:'Opinion', title:'Technology and face-to-face communication', prompt:'Some people believe technology is reducing the quality of face-to-face communication. To what extent do you agree or disagree?', minWords:250, structure:['Introduction + clear position','Reason 1 + example','Reason 2 + qualification','Conclusion'], vocabulary:['meaningful interaction','digital dependency','maintain relationships','social cues'], phrases:['I largely agree that…','This is not to suggest that…'] },
]

export const ieltsSpeaking = [
  ['Part 1','Home','What do you like most about your home?'],['Part 1','Study','What subject would you like to learn in the future?'],['Part 1','Daily routine','Which part of your day do you enjoy most?'],
  ['Part 2','Travel','Describe a place you would like to visit.','where it is|how you know about it|why you want to visit it|and explain why this place is interesting to you'],
  ['Part 2','People','Describe a person who has taught you something useful.','who the person is|what they taught you|how they taught you|and explain why it was useful'],
  ['Part 2','Technology','Describe a piece of technology you use often.','what it is|when you started using it|how it helps you|and explain why it is important'],
  ['Part 2','Culture','Describe a traditional celebration in your country.','what it is|when it happens|what people do|and explain why it matters'],
  ['Part 3','Education','Should schools teach more practical skills?'],['Part 3','Environment','How can cities encourage sustainable transport?'],['Part 3','Media','How has social media changed public discussion?'],
].map(([part,topic,question,bullets], index) => ({ id:`is-${index+1}`,part,topic,question,bullets:bullets?.split('|') || [] }))

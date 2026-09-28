const makeQuestion = (id, type, question, answer, options = null, extra = {}) => ({
  id, type, question, ...(options ? { options, answer } : { correct:answer }), ...extra,
})

const listeningSections = [
  {
    id:'ielts-listening-1',
    label:'Listening Part 1',
    audio:'Receptionist: Good morning, Riverside Guest House. How can I help? Caller: I would like to book a double room for two nights, arriving on Friday the fourteenth of November. Receptionist: Certainly. May I have your name? Caller: Daniel Mercer, M E R C E R. Receptionist: Thank you. The standard double is eighty-five pounds per night including breakfast. Caller: That is fine. Is parking available? Receptionist: Yes. The underground car park costs eight pounds per night, but street parking is free after six p.m. Caller: I will use the underground car park. Receptionist: What time do you expect to arrive? Caller: Our train gets in at six twenty, so probably around seven. Receptionist: I will note seven p.m. Would you like a dinner reservation? Caller: Yes, for seven forty-five if possible. Receptionist: Done. We also offer bicycle hire for twelve pounds a day. Caller: Not this time. Receptionist: Finally, could I have a contact number? Caller: 07700 314 826.',
    questions:[
      makeQuestion('ilf-01','Form Completion','What is the caller’s surname?','Mercer',null,{ instructions:'ONE WORD ONLY' }),
      makeQuestion('ilf-02','Form Completion','What date will the guest arrive?','14 November',null,{ acceptedAnswers:['November 14','14th November'] }),
      makeQuestion('ilf-03','Multiple Choice','What type of room does the caller book?',0,['Double','Single','Family']),
      makeQuestion('ilf-04','Short Answer','How much is the room per night?','85 pounds',null,{ acceptedAnswers:['£85','85'] }),
      makeQuestion('ilf-05','Multiple Choice','What is included in the room price?',1,['Parking','Breakfast','Dinner']),
      makeQuestion('ilf-06','Short Answer','How much does underground parking cost per night?','8 pounds',null,{ acceptedAnswers:['£8','8'] }),
      makeQuestion('ilf-07','Form Completion','What arrival time should the guest house note?','7 pm',null,{ acceptedAnswers:['7 p.m.','7:00 pm','19:00'] }),
      makeQuestion('ilf-08','Form Completion','What time is the dinner reservation?','7:45 pm',null,{ acceptedAnswers:['7.45 pm','19:45','7:45 p.m.'] }),
      makeQuestion('ilf-09','Multiple Choice','Which extra service does the caller NOT choose?',2,['Parking','Dinner reservation','Bicycle hire']),
      makeQuestion('ilf-10','Form Completion','What are the last three digits of the phone number?','826'),
    ],
  },
  {
    id:'ielts-listening-2',
    label:'Listening Part 2',
    audio:'Welcome to Westbrook Community Centre. The building opens at eight thirty on weekdays and nine on Saturdays. The reception desk is directly opposite the main entrance. To the left of reception is the café, which serves hot food until three. The computer room is upstairs, beside Room 204. If you have booked a fitness class, please go straight to Studio B, beyond the indoor court. The swimming pool is currently closed for maintenance and will reopen on the twenty-second. This month we are offering a photography workshop on Tuesday evenings and a first-aid course on Saturday mornings. Members pay thirty pounds for the photography workshop; non-members pay forty-five. The first-aid course is free, but places must be reserved online. Bicycle racks are beside the east entrance, while the car park is reached from King Street. Please remember that lockers require a one-pound coin, which is returned when you leave.',
    questions:[
      makeQuestion('ilf-11','Multiple Choice','What time does the centre open on Saturdays?',1,['8:30','9:00','9:30']),
      makeQuestion('ilf-12','Map / Plan','What is directly opposite the main entrance?',0,['Reception','Café','Studio B']),
      makeQuestion('ilf-13','Map / Plan','Where is the computer room?',1,['Beside the café','Beside Room 204','Behind reception']),
      makeQuestion('ilf-14','Multiple Choice','Which facility is temporarily unavailable?',2,['Indoor court','Café','Swimming pool']),
      makeQuestion('ilf-15','Short Answer','On what date will the pool reopen?','22nd',null,{ acceptedAnswers:['22','the 22nd'] }),
      makeQuestion('ilf-16','Multiple Choice','When is the photography workshop?',0,['Tuesday evenings','Saturday mornings','Friday afternoons']),
      makeQuestion('ilf-17','Short Answer','How much do members pay for the photography workshop?','30 pounds',null,{ acceptedAnswers:['£30','30'] }),
      makeQuestion('ilf-18','Multiple Choice','What must people do for the first-aid course?',1,['Pay at reception','Reserve online','Bring a medical form']),
      makeQuestion('ilf-19','Short Answer','Which street leads to the car park?','King Street'),
      makeQuestion('ilf-20','Short Answer','What coin is needed for a locker?','one-pound coin',null,{ acceptedAnswers:['£1 coin','1 pound coin','one pound coin'] }),
    ],
  },
  {
    id:'ielts-listening-3',
    label:'Listening Part 3',
    audio:'Tutor: So, how is your group project on urban food systems progressing? Lina: We narrowed the topic to rooftop gardens because our first idea, local markets, was too broad. Omar: We have collected survey responses from sixty-two residents, but we still need interviews with building managers. Tutor: Good. Remember, the presentation is only twelve minutes, so focus on two or three findings. Lina: We were thinking of spending five minutes on background information. Tutor: That is too long. Keep the background to about two minutes. Omar: We also found a useful city report from twenty twenty-three. Tutor: Use it, but compare it with at least one academic source. Lina: For the visual material, we have photographs and a map showing suitable roofs. Tutor: The map will be more useful than lots of photographs. Omar: Who should present the methods section? Lina: I can do that, and Omar can explain the results. Tutor: Fine. Then both of you should answer questions at the end. Please upload your slides by noon on Wednesday so I can check them before Thursday’s seminar.',
    questions:[
      makeQuestion('ilf-21','Multiple Choice','What is the group’s final topic?',2,['Local markets','Food prices','Rooftop gardens']),
      makeQuestion('ilf-22','Short Answer','How many residents completed the survey?','62',null,{ acceptedAnswers:['sixty-two','sixty two'] }),
      makeQuestion('ilf-23','Multiple Choice','Who does the group still need to interview?',1,['Residents','Building managers','Shop owners']),
      makeQuestion('ilf-24','Short Answer','How long is the presentation?','12 minutes',null,{ acceptedAnswers:['twelve minutes','12'] }),
      makeQuestion('ilf-25','Multiple Choice','How long should the background section be?',0,['About two minutes','About five minutes','About eight minutes']),
      makeQuestion('ilf-26','Short Answer','What year was the city report published?','2023'),
      makeQuestion('ilf-27','Multiple Choice','What does the tutor say the city report should be compared with?',2,['A newspaper article','Survey data only','An academic source']),
      makeQuestion('ilf-28','Multiple Choice','Which visual does the tutor prefer?',1,['Photographs','A map','A chart']),
      makeQuestion('ilf-29','Multiple Choice','Who will present the methods section?',0,['Lina','Omar','The tutor']),
      makeQuestion('ilf-30','Short Answer','When must the slides be uploaded?','Wednesday noon',null,{ acceptedAnswers:['noon on Wednesday','Wednesday at noon'] }),
    ],
  },
  {
    id:'ielts-listening-4',
    label:'Listening Part 4',
    audio:'Today we will examine the restoration of urban wetlands. For much of the twentieth century, many city wetlands were drained because they were seen as unused land. More recently, planners have recognised three major benefits. First, wetlands can store storm water and therefore reduce pressure on drainage systems during heavy rain. Second, wetland plants can improve water quality by trapping some pollutants before they reach rivers. Third, restored wetlands create habitats for birds, insects and amphibians. However, restoration is not simply a matter of adding water. Soil conditions must be assessed, invasive plant species need to be controlled, and nearby residents should be consulted about access and safety. One project in Northbridge converted an abandoned industrial site into a wetland park. Monitoring over five years showed a decrease in local flood incidents and a gradual increase in bird diversity. The project also built raised walking paths so visitors could enter the area without damaging sensitive ground. The main lesson is that successful restoration combines ecological design with long-term management. Short-term construction funding is useful, but maintenance budgets and community participation determine whether benefits continue.',
    questions:[
      makeQuestion('ilf-31','Multiple Choice','Why were many urban wetlands drained in the twentieth century?',0,['They were considered unused land','They caused all city flooding','They had no plants']),
      makeQuestion('ilf-32','Sentence Completion','Wetlands can reduce pressure on city _____ systems.','drainage'),
      makeQuestion('ilf-33','Multiple Choice','How can wetland plants improve water quality?',1,['By warming the water','By trapping some pollutants','By removing all insects']),
      makeQuestion('ilf-34','Short Answer','Name one animal group mentioned as benefiting from wetland habitat.','birds',null,{ acceptedAnswers:['insects','amphibians','bird','insect','amphibian'] }),
      makeQuestion('ilf-35','Multiple Choice','What must be assessed before restoration?',2,['Visitor numbers','Building height','Soil conditions']),
      makeQuestion('ilf-36','Short Answer','What type of plants need to be controlled?','invasive plants',null,{ acceptedAnswers:['invasive plant species','invasive species'] }),
      makeQuestion('ilf-37','Multiple Choice','What was the Northbridge site previously used for?',0,['Industry','Agriculture','Housing']),
      makeQuestion('ilf-38','Short Answer','For how many years was the Northbridge project monitored?','5 years',null,{ acceptedAnswers:['five years','5'] }),
      makeQuestion('ilf-39','Multiple Choice','Why were raised walking paths built?',1,['To shorten the park','To protect sensitive ground','To increase flood storage']),
      makeQuestion('ilf-40','Sentence Completion','Long-term success depends partly on maintenance budgets and community _____.','participation'),
    ],
  },
]

const balanceChoicePositions = (items) => items.map((item,index) => {
  if (!item.options?.length || !Number.isInteger(item.answer)) return item
  const shift = index % item.options.length
  if (!shift) return item
  const options = [...item.options.slice(shift),...item.options.slice(0,shift)]
  const answer = (item.answer - shift + item.options.length) % item.options.length
  return { ...item,options,answer }
})

export const ieltsFullListening = balanceChoicePositions(listeningSections.flatMap((section) => section.questions.map((question) => ({
  ...question,
  section:section.label,
  audio:section.audio,
}))))

const readingPassages = [
  {
    id:'r1',
    title:'Why Cities Are Reconsidering Night-time Lighting',
    paragraphs:[
      'A. Artificial lighting transformed urban life by extending working hours, improving navigation and making public spaces usable after sunset. For decades, city authorities generally treated more light as a sign of safety and progress. Yet researchers now argue that the relationship between brightness and urban quality is more complicated. Poorly designed lighting can waste energy, disturb wildlife and make it harder for people to see by producing glare.',
      'B. One important distinction is between illumination and visibility. A street may contain very bright lamps while still being difficult to navigate if light is uneven or shines directly into pedestrians’ eyes. Lighting engineers therefore measure not only the quantity of light but also its distribution, colour temperature and direction. Shielded lamps that direct light downward can often create a clearer environment with less total energy.',
      'C. Ecologists have also documented effects on animals. Many insects are attracted to artificial light and may circle lamps until they become exhausted. Migrating birds can be confused by brightly lit buildings, especially during cloudy weather. Some cities now reduce decorative lighting during peak migration periods. These programmes do not eliminate night lighting; instead, they target unnecessary sources at specific times.',
      'D. Human health research has added another reason for caution. Exposure to bright, blue-rich light late at night can delay the body’s production of melatonin, a hormone associated with sleep timing. Evidence about city-wide health effects is still developing, and researchers warn against assuming that every outdoor lamp causes sleep problems. Indoor screens and personal routines also influence evening light exposure.',
      'E. Safety remains a central concern. Residents often oppose lighting reductions because they fear darker streets may encourage crime. Studies, however, do not show a simple rule that brighter lighting always produces safer areas. Visibility, pedestrian activity, building design and policing all matter. In some locations, replacing harsh floodlights with lower, well-directed lamps has improved people’s ability to recognise faces and obstacles.',
      'F. Cost is another factor. Modern LED systems use less electricity than older technologies and can be controlled remotely. Sensors can dim lights when streets are empty and restore brightness when pedestrians or vehicles approach. Although installation can be expensive, municipalities may recover costs through lower electricity use and reduced maintenance.',
      'G. The emerging approach is therefore not darkness but precision. Rather than asking how much light a city should have, planners increasingly ask where light is needed, when it is needed and what form it should take. This shift treats lighting as infrastructure that must balance human activity, energy use and environmental conditions.',
    ],
    questions:[
      makeQuestion('irf-01','True / False / Not Given','City authorities have always recognised that brighter streets can create glare.',1,['True','False','Not Given']),
      makeQuestion('irf-02','Multiple Choice','According to paragraph B, what can improve visibility while using less energy?',0,['Directing light downward','Increasing lamp height','Using only blue light','Leaving lights on all day']),
      makeQuestion('irf-03','Matching Information','Which paragraph mentions migrating birds?',2,['A','B','C','D']),
      makeQuestion('irf-04','True / False / Not Given','Some cities switch off every outdoor light during bird migration.',1,['True','False','Not Given']),
      makeQuestion('irf-05','Sentence Completion','Blue-rich light can delay production of a hormone called _____.','melatonin'),
      makeQuestion('irf-06','True / False / Not Given','Researchers say outdoor lighting is the only cause of poor sleep.',1,['True','False','Not Given']),
      makeQuestion('irf-07','Multiple Choice','What concern do residents often raise about reducing lighting?',1,['Energy prices','Crime','Bird migration','Maintenance jobs']),
      makeQuestion('irf-08','Multiple Choice','Which factor is NOT listed as affecting safety?',3,['Pedestrian activity','Building design','Policing','Tree height']),
      makeQuestion('irf-09','Sentence Completion','Modern lighting systems can use _____ to dim lights when streets are empty.','sensors'),
      makeQuestion('irf-10','True / False / Not Given','LED systems are always cheaper to install than older lighting.',2,['True','False','Not Given']),
      makeQuestion('irf-11','Multiple Choice','What is the main idea of paragraph G?',2,['Cities should become completely dark','Lighting should be brighter in every district','Lighting should be used more precisely','Only environmental concerns matter']),
      makeQuestion('irf-12','Matching Heading','Choose the best heading for paragraph D.',1,['Wildlife migration','Possible effects on human sleep','The history of LEDs','Public transport at night']),
      makeQuestion('irf-13','Short Answer','What problem can very bright lamps cause for pedestrians?','glare'),
      makeQuestion('irf-14','Multiple Choice','What overall position does the passage take?',0,['Good lighting design balances several needs','All night lighting is harmful','Safety always requires more light','Cities should use one lighting standard']),
    ],
  },
  {
    id:'r2',
    title:'The Return of Repair Culture',
    paragraphs:[
      'A. For much of the past half-century, household products became cheaper to replace and harder to repair. Manufacturers often used sealed components, specialised screws and software locks that discouraged owners from opening devices. At the same time, rapid product cycles encouraged consumers to regard broken electronics as obsolete rather than fixable.',
      'B. A counter-movement has emerged in the form of repair cafés, tool libraries and community workshops. At repair cafés, volunteers help visitors diagnose faults in items such as lamps, radios, bicycles and small appliances. The goal is not simply to provide free technical labour. Organisers typically expect owners to observe or participate so that practical knowledge is shared.',
      'C. Supporters argue that repair has environmental benefits. Extending the life of a device can delay the energy and material costs associated with manufacturing a replacement. However, the calculation is not always simple. An old refrigerator that uses large amounts of electricity may have a greater lifetime impact than a newer, efficient model even when replacement creates waste.',
      'D. Repairability also depends on access to information and parts. Independent technicians have complained that service manuals, diagnostic software and replacement components are sometimes restricted to authorised networks. This debate has led to “right to repair” laws in several regions. Such rules vary, but they generally aim to make parts and technical information more available.',
      'E. Manufacturers raise legitimate concerns of their own. Poor repairs to batteries or high-voltage equipment can create safety risks. Companies also argue that unrestricted access to certain software tools could expose security weaknesses or confidential design information. Right-to-repair policies therefore need to distinguish ordinary maintenance from procedures that require specialist training.',
      'F. Economists note that repair markets can create local employment, but they also face a skills challenge. Modern devices combine electronics, software and compact mechanical systems. A technician who can replace a bicycle chain may not be qualified to diagnose a smartphone motherboard. Training systems must therefore evolve if repair is to become a larger part of the economy.',
      'G. The strongest repair culture may ultimately depend less on nostalgia than on product design. Devices that use replaceable modules, standard fasteners and accessible documentation can be maintained more easily by professionals and owners alike. In this view, repair is not an emergency activity performed after failure; it is a capability designed into a product from the beginning.',
    ],
    questions:[
      makeQuestion('irf-15','True / False / Not Given','Some modern products are difficult to open because of specialised fasteners.',0,['True','False','Not Given']),
      makeQuestion('irf-16','Multiple Choice','What is one purpose of repair cafés?',2,['To sell new devices','To train only professional engineers','To share practical knowledge','To collect taxes']),
      makeQuestion('irf-17','Short Answer','Name one type of item mentioned as being repaired at repair cafés.','lamps',null,{ acceptedAnswers:['radios','bicycles','small appliances','lamp','radio','bicycle'] }),
      makeQuestion('irf-18','True / False / Not Given','Repairing an old appliance is always environmentally better than replacing it.',1,['True','False','Not Given']),
      makeQuestion('irf-19','Multiple Choice','Why might replacing an old refrigerator reduce lifetime impact?',1,['New models are larger','New models may use less electricity','Old models cannot be recycled','Repair cafés refuse refrigerators']),
      makeQuestion('irf-20','Sentence Completion','Independent technicians may need access to service manuals, diagnostic software and replacement _____.','components'),
      makeQuestion('irf-21','Multiple Choice','What is a common aim of right-to-repair rules?',0,['Making parts and information more available','Banning authorised service centres','Ending software updates','Making every repair free']),
      makeQuestion('irf-22','True / False / Not Given','Manufacturers have no safety concerns about independent repair.',1,['True','False','Not Given']),
      makeQuestion('irf-23','Multiple Choice','Which repair is specifically mentioned as potentially risky?',2,['Replacing a lamp shade','Adjusting a bicycle seat','Repairing a battery','Cleaning a screen']),
      makeQuestion('irf-24','Matching Information','Which paragraph discusses local employment?',1,['E','F','G','C']),
      makeQuestion('irf-25','True / False / Not Given','A bicycle technician necessarily has the skills to repair a smartphone motherboard.',1,['True','False','Not Given']),
      makeQuestion('irf-26','Multiple Choice','According to paragraph G, what most strongly supports repair culture?',3,['Higher product prices','Fewer technicians','Longer advertisements','Repair-friendly product design']),
      makeQuestion('irf-27','Short Answer','What type of fasteners can make products easier to maintain?','standard fasteners'),
    ],
  },
  {
    id:'r3',
    title:'How Scientific Teams Handle Uncertainty',
    paragraphs:[
      'A. Scientific reports often contain precise numbers, yet the process that produces them is full of uncertainty. Measurements have limits, samples may not perfectly represent a population, and models simplify reality. Far from being a weakness, recognising these uncertainties is a core feature of scientific reasoning.',
      'B. One common source of uncertainty is measurement error. No instrument is infinitely precise. A thermometer may report temperature to the nearest tenth of a degree, while the actual value lies somewhere within a small range. Repeating measurements can reduce the influence of random error, but repetition does not automatically remove a systematic bias in the instrument.',
      'C. Sampling creates a different problem. Researchers studying a large population rarely collect data from every individual. Instead, they select a sample and use it to estimate patterns in the wider group. If the sample excludes important categories of people or locations, the result may be biased even when the calculations are performed correctly.',
      'D. Models introduce assumptions so that complex systems can be studied. A climate model, an economic model and an epidemic model each leave out details that are considered less important for a particular question. Scientists test models by comparing predictions with observations and by examining how results change when assumptions are altered.',
      'E. Communication is especially difficult because public audiences often interpret uncertainty as ignorance. A statement that an estimate has a range can sound less confident than a single number, even though the range may reflect more careful analysis. Researchers increasingly use visual tools and plain-language explanations to show what is known, what is uncertain and why.',
      'F. Decision-makers cannot always wait for complete information. During an emerging disease outbreak, for example, officials may need to act before researchers know the exact transmission rate. Good decisions therefore combine the best available evidence with an understanding of possible error. Policies can then be revised as better data becomes available.',
      'G. Scientific disagreement should also be interpreted carefully. Two research teams may produce different estimates because they used different datasets, definitions or assumptions. This does not necessarily mean that one team behaved incorrectly. Comparing methods can reveal which assumptions have the greatest influence and can guide the design of better studies.',
      'H. The broader lesson is that uncertainty does not make evidence useless. Instead, it indicates the boundaries of current knowledge. Reliable science makes those boundaries visible, tests how sensitive conclusions are to them, and updates claims when stronger evidence appears.',
    ],
    questions:[
      makeQuestion('irf-28','Multiple Choice','What is the main point of paragraph A?',1,['Precise numbers eliminate uncertainty','Acknowledging uncertainty is part of scientific reasoning','Models should never simplify reality','Samples always represent populations']),
      makeQuestion('irf-29','True / False / Not Given','Repeating measurements always removes systematic instrument bias.',1,['True','False','Not Given']),
      makeQuestion('irf-30','Sentence Completion','A thermometer may report to the nearest tenth of a _____.','degree'),
      makeQuestion('irf-31','Multiple Choice','What can make a sample biased?',2,['Using calculations','Having too many categories','Excluding important groups','Collecting data twice']),
      makeQuestion('irf-32','True / False / Not Given','Researchers normally collect data from every member of a large population.',1,['True','False','Not Given']),
      makeQuestion('irf-33','Multiple Choice','How are models tested according to paragraph D?',0,['By comparing predictions with observations','By removing all assumptions','By using only one dataset','By avoiding simplification']),
      makeQuestion('irf-34','Short Answer','What may scientists alter to see how model results change?','assumptions'),
      makeQuestion('irf-35','Multiple Choice','Why can uncertainty be difficult to communicate?',3,['Scientists dislike visual tools','Ranges are always wrong','Audiences prefer equations','A range can appear less confident than one number']),
      makeQuestion('irf-36','True / False / Not Given','Public officials can always delay decisions until complete information is available.',1,['True','False','Not Given']),
      makeQuestion('irf-37','Multiple Choice','What example is used for decisions under incomplete information?',1,['A building project','A disease outbreak','A school examination','A product launch']),
      makeQuestion('irf-38','True / False / Not Given','Different scientific estimates always mean one team made a mistake.',1,['True','False','Not Given']),
      makeQuestion('irf-39','Short Answer','What can comparing research methods reveal?','influential assumptions',null,{ acceptedAnswers:['which assumptions have the greatest influence','important assumptions'] }),
      makeQuestion('irf-40','Multiple Choice','What does uncertainty indicate in the final paragraph?',0,['The boundaries of current knowledge','That evidence should be ignored','That measurements are useless','That scientists should avoid revision']),
    ],
  },
]

export const ieltsFullReading = balanceChoicePositions(readingPassages.flatMap((passage) => passage.questions.map((question) => ({
  ...question,
  passageTitle:passage.title,
  passage:passage.paragraphs,
}))))

export const ieltsAcademicWritingTasks = [
  {
    id:'full-writing-task-1',
    task:'Task 1',
    minWords:150,
    recommendedMinutes:20,
    prompt:'The table below shows the percentage of commuters using four forms of transport in three cities in 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    data:'City A — Car 48→36%, Public transport 32→41%, Bicycle 12→16%, Walking 8→7%. City B — Car 55→45%, Public transport 25→31%, Bicycle 8→13%, Walking 12→11%. City C — Car 40→28%, Public transport 38→46%, Bicycle 10→15%, Walking 12→11%.',
  },
  {
    id:'full-writing-task-2',
    task:'Task 2',
    minWords:250,
    recommendedMinutes:40,
    prompt:'Some people think employers should allow employees to work from home whenever possible, while others believe regular office attendance is important. Discuss both views and give your own opinion.',
  },
]

export const ieltsFullSections = [
  { id:'ielts-listening', label:'Listening', duration:30*60, questions:ieltsFullListening },
  { id:'ielts-reading', label:'Academic Reading', duration:60*60, questions:ieltsFullReading },
]

const bandTable = (raw, rows) => {
  const hit = rows.find(([min]) => raw >= min)
  return hit ? hit[1] : 2.5
}

export function listeningBand(raw) {
  return bandTable(raw, [[39,9],[37,8.5],[35,8],[32,7.5],[30,7],[26,6.5],[23,6],[18,5.5],[16,5],[13,4.5],[11,4],[8,3.5],[6,3]])
}

export function academicReadingBand(raw) {
  return bandTable(raw, [[39,9],[37,8.5],[35,8],[33,7.5],[30,7],[27,6.5],[23,6],[19,5.5],[15,5],[13,4.5],[10,4],[8,3.5],[6,3]])
}

export function buildIeltsObjectiveResult({ answers, sections, elapsed }) {
  const [listening,reading] = sections
  const countCorrect = (items) => items.filter((item) => {
    const value = answers[item.id]
    if (item.options) return value === item.answer
    const normalized = String(value ?? '').trim().toLowerCase().replace(/[.!?]+$/,'')
    const accepted = [item.correct,...(item.acceptedAnswers || [])].map((answer) => String(answer).trim().toLowerCase().replace(/[.!?]+$/,''))
    return accepted.includes(normalized)
  }).length
  const listeningCorrect = countCorrect(listening.questions)
  const readingCorrect = countCorrect(reading.questions)
  const unanswered = [...listening.questions,...reading.questions].filter((item) => answers[item.id] === undefined || answers[item.id] === '').length
  return {
    type:'Academic Full Mock',
    listeningCorrect,
    readingCorrect,
    bands:{
      Listening:listeningBand(listeningCorrect),
      Reading:academicReadingBand(readingCorrect),
    },
    correct:listeningCorrect + readingCorrect,
    unanswered,
    timeUsed:(elapsed[listening.id] || 0) + (elapsed[reading.id] || 0),
  }
}

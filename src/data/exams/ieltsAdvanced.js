import { ieltsFullListening, ieltsFullReading } from './ieltsFull'
import { createExamRandom, examFormId, grouped, sample, stampQuestions } from './examRandom'

const makeQuestion = (id, type, question, answer, options = null, extra = {}) => ({
  id,
  type,
  question,
  ...(options ? { options, answer } : { correct:answer }),
  ...extra,
})

const listeningAlternatives = [
  {
    label:'Listening Part 1',
    audio:'Agent: Good afternoon, Northgate Conference Services. Caller: I am registering three colleagues for the regional planning seminar on the eighteenth of March. Agent: Certainly. The standard fee is ninety-six pounds per person, but organizations sending three or more people receive a twelve-percent group discount. Caller: Good. We will also need lunch. Agent: The vegetarian buffet is included. The hot lunch option costs eleven pounds extra per person. Caller: Two hot lunches and one vegetarian buffet, please. Agent: Noted. The seminar is in the Carlton Suite, not the Windsor Room shown on the early brochure. Registration opens at eight forty-five and the first session starts at nine thirty. Caller: One colleague uses a wheelchair. Agent: The Carlton Suite is step-free. I will also reserve a space near the front. Caller: Thank you. Can I pay today? Agent: Yes. I can send a secure payment link to your work email. Caller: Please send it to planning.office@example.com. Agent: Done. The link remains active for forty-eight hours.',
    questions:[
      makeQuestion('ial-01','Form Completion','On what date is the seminar?','18 March',null,{acceptedAnswers:['March 18','18th March'],instructions:'NO MORE THAN TWO WORDS AND/OR A NUMBER'}),
      makeQuestion('ial-02','Short Answer','How many colleagues is the caller registering?','3',null,{acceptedAnswers:['three']}),
      makeQuestion('ial-03','Sentence Completion','Groups of three or more receive a _____ percent discount.','12',null,{acceptedAnswers:['twelve','12%']}),
      makeQuestion('ial-04','Multiple Choice','How many hot lunches are requested?',1,['One','Two','Three']),
      makeQuestion('ial-05','Multiple Choice','Which meal is included in the standard fee?',2,['Hot lunch','Sandwich lunch','Vegetarian buffet']),
      makeQuestion('ial-06','Form Completion','What is the correct room name?','Carlton Suite'),
      makeQuestion('ial-07','Form Completion','What time does registration open?','8:45',null,{acceptedAnswers:['8.45','8:45 am','8.45 am','08:45']}),
      makeQuestion('ial-08','Sentence Completion','A seat will be reserved near the _____ for the colleague using a wheelchair.','front'),
      makeQuestion('ial-09','Short Answer','What will the agent send to the caller?','payment link',null,{acceptedAnswers:['secure payment link','a payment link']}),
      makeQuestion('ial-10','Sentence Completion','The payment link will remain active for _____ hours.','48',null,{acceptedAnswers:['forty-eight','48 hours']}),
    ],
  },
  {
    label:'Listening Part 2',
    audio:'Welcome to the Lakeside Heritage Trail. The full route is just under six kilometers and usually takes about two hours, although families with young children should allow longer. From the visitor center, follow the blue markers toward the old mill. The footbridge beside the mill is temporarily closed, so continue along the river for another two hundred meters and use the stone bridge instead. After crossing, turn left for the orchard. The picnic area is beyond the orchard, beside the small car park. Please note that the café marked on older maps closed last winter; drinks and snacks are now sold from a kiosk near the boat house. The hill section after the boat house is steep and can become slippery after rain. Walking poles may be borrowed from the visitor center with a refundable deposit. Dogs are welcome on most of the trail but must be kept on a lead through the wildlife meadow between April and July. The final museum entry is at four forty-five, thirty minutes before the building closes.',
    questions:[
      makeQuestion('ial-11','Short Answer','Approximately how long is the full trail?','6 kilometers',null,{acceptedAnswers:['six kilometers','6 km','six km']}),
      makeQuestion('ial-12','Multiple Choice','Which route marker should visitors follow initially?',1,['Red','Blue','Green']),
      makeQuestion('ial-13','Sentence Completion','Visitors should use the _____ bridge because the footbridge is closed.','stone'),
      makeQuestion('ial-14','Multiple Choice','Where is the picnic area?',2,['Before the orchard','At the visitor center','Beyond the orchard']),
      makeQuestion('ial-15','True / False / Not Given','The café shown on older maps is still open.',1,['True','False','Not Given']),
      makeQuestion('ial-16','Sentence Completion','Snacks are now sold near the _____.','boat house',null,{acceptedAnswers:['boathouse']}),
      makeQuestion('ial-17','Multiple Choice','What can visitors borrow?',0,['Walking poles','Rain jackets','Bicycles']),
      makeQuestion('ial-18','Sentence Completion','Dogs must be on a lead in the wildlife meadow from April to _____.','July'),
      makeQuestion('ial-19','Short Answer','What time is the final museum entry?','4:45',null,{acceptedAnswers:['4.45','4:45 pm','4.45 pm','16:45']}),
      makeQuestion('ial-20','Multiple Choice','What is the speaker mainly doing?',2,['Advertising a new café','Explaining museum exhibits','Giving practical route information']),
    ],
  },
  {
    label:'Listening Part 3',
    audio:'Tutor: You said your group changed the research question after the pilot interviews. Student A: Yes. We originally planned to compare commuting time across departments, but the interviews kept raising the issue of schedule flexibility. Student B: So now we are asking whether flexible start times affect how employees choose to travel. Tutor: That is narrower, but it also creates a problem. How will you separate the effect of flexibility from distance to work? Student A: We added distance bands to the survey. Student B: And we are collecting postcode sectors rather than exact addresses because the ethics reviewer advised us not to collect unnecessary location data. Tutor: Good. What about your sample? Student A: Human Resources can circulate the survey to all staff, but we are worried senior managers may respond at a higher rate than shift workers. Tutor: Then do not just report the overall average. Compare response rates by staff group and discuss any imbalance. Student B: We also wanted to interview twenty volunteers afterward. Tutor: Twenty is ambitious. Twelve carefully selected interviews would probably give you more useful depth. Student A: We can choose participants from contrasting travel patterns. Tutor: Exactly. And move the cost question later in the interview. Asking about money too early can make participants defensive.',
    questions:[
      makeQuestion('ial-21','Multiple Choice','What was the group’s original research focus?',0,['Commuting time across departments','Salary differences','Remote-work productivity','Parking availability']),
      makeQuestion('ial-22','Sentence Completion','The revised study focuses on flexible _____ times.','start'),
      makeQuestion('ial-23','Multiple Choice','Why were distance bands added?',1,['To shorten the survey','To control for distance to work','To identify home addresses','To compare salaries']),
      makeQuestion('ial-24','Short Answer','What location information will the group collect instead of exact addresses?','postcode sectors',null,{acceptedAnswers:['postcode sector']}),
      makeQuestion('ial-25','Multiple Choice','What sampling problem worries the students?',2,['Too many departments','Too few managers','Unequal response rates between staff groups']),
      makeQuestion('ial-26','Sentence Completion','The tutor says they should compare response rates by staff _____.','group',null,{acceptedAnswers:['groups']}),
      makeQuestion('ial-27','Multiple Choice','How many follow-up interviews does the tutor recommend?',1,['Twenty','Twelve','Six']),
      makeQuestion('ial-28','Multiple Choice','How should interview participants be chosen?',0,['From contrasting travel patterns','Only from senior managers','Randomly from one department']),
      makeQuestion('ial-29','True / False / Not Given','The tutor recommends removing all questions about cost.',1,['True','False','Not Given']),
      makeQuestion('ial-30','Multiple Choice','Why should the cost question be moved later?',2,['It requires calculations','It is unrelated to travel','It may make participants uncomfortable']),
    ],
  },
  {
    label:'Listening Part 4',
    audio:'Today I will discuss why some coastal restoration projects use so-called living shorelines instead of concrete seawalls. A seawall can protect a specific stretch of property from direct wave action, but it often reflects wave energy rather than absorbing it. Over time, this can increase erosion immediately in front of the wall or farther along the coast. A living shoreline uses combinations of marsh plants, oyster reefs, sand, and sometimes low rock structures. The aim is not to freeze the coast in one position but to reduce wave energy while allowing sediment and vegetation to respond naturally. These systems are not suitable everywhere. Sites exposed to very strong waves may still require conventional engineering, and restoration teams must examine water depth, tidal range, sediment type, and boat traffic. Monitoring is also essential. In one five-year study, researchers found that newly planted marshes initially lost vegetation during severe storms, but areas protected by oyster reefs recovered faster because the reefs reduced incoming wave force. Costs can also change over time. Living shorelines may require more ecological planning at the beginning, yet they can become more self-maintaining as plants and reefs mature. Their value is therefore measured not only by property protection, but also by habitat creation, water filtration, and the capacity to adapt to gradual sea-level rise.',
    questions:[
      makeQuestion('ial-31','Multiple Choice','What problem can a seawall sometimes worsen?',1,['Water filtration','Erosion','Boat traffic']),
      makeQuestion('ial-32','Sentence Completion','A living shoreline is designed to reduce wave _____.','energy'),
      makeQuestion('ial-33','Short Answer','Name one biological material used in living shorelines.','marsh plants',null,{acceptedAnswers:['plants','oyster reefs','oysters','marsh vegetation']}),
      makeQuestion('ial-34','True / False / Not Given','Living shorelines are appropriate for every coastal site.',1,['True','False','Not Given']),
      makeQuestion('ial-35','Sentence Completion','Teams may need to examine water depth, tidal range, sediment type and boat _____.','traffic'),
      makeQuestion('ial-36','Multiple Choice','What happened to some newly planted marshes during severe storms?',2,['They expanded immediately','They became seawalls','They lost vegetation']),
      makeQuestion('ial-37','Multiple Choice','Why did areas near oyster reefs recover faster?',0,['The reefs reduced wave force','The reefs raised water temperature','The reefs prevented all flooding']),
      makeQuestion('ial-38','True / False / Not Given','Living shorelines always cost less to plan initially than seawalls.',2,['True','False','Not Given']),
      makeQuestion('ial-39','Sentence Completion','Mature systems may become more self-_____ over time.','maintaining'),
      makeQuestion('ial-40','Multiple Choice','Which benefit is mentioned in addition to property protection?',1,['Faster boat travel','Habitat creation','Deeper shipping channels']),
    ],
  },
]

const readingAlternatives = [
  {
    title:'When Forecasts Become Decisions',
    paragraphs:[
      'A. Forecasts are often treated as predictions about what will happen, but in practice their value lies in supporting decisions made before outcomes are known. A transport agency deciding whether to add buses, a hospital scheduling staff, and an electricity operator preparing for peak demand all work with uncertain information. The relevant question is therefore not whether a forecast is perfectly accurate, but whether it helps decision-makers choose actions that perform reasonably well across plausible futures.',
      'B. This distinction matters because common accuracy measures can hide operational consequences. Suppose two demand forecasts each miss the true value by ten percent. If one error leads to a few empty seats while the other leaves hundreds of passengers stranded, the numerical errors may be similar even though the practical costs are not. Some organizations therefore evaluate forecasts using loss functions that assign different penalties to overestimation and underestimation.',
      'C. Forecast horizons create another trade-off. Short-term forecasts usually benefit from recent observations and can respond quickly to sudden changes. Long-term forecasts have less immediate information but allow organizations more time to act. A city may be able to add an extra bus tomorrow, for example, but building a new rail line requires years. The appropriate forecasting method depends partly on what decisions remain possible at each horizon.',
      'D. Human judgment can improve or damage statistical forecasts. Experienced staff may know about a strike, promotional campaign, or policy change that is absent from historical data. However, people are also vulnerable to recency bias and may place too much weight on dramatic events. Several organizations now record manual adjustments and compare their effects over time instead of assuming expert intervention is automatically beneficial.',
      'E. Forecast combinations offer a different strategy. Rather than selecting one supposedly superior model, analysts can average or otherwise combine estimates from several models. This often improves stability because models tend to fail in different ways. The advantage is greatest when the component forecasts contain genuinely different information; combining several nearly identical models provides little benefit.',
      'F. Communication remains difficult. A forecast expressed as a single number can appear authoritative but may conceal uncertainty. Probability ranges are more informative, yet users may misread them. If a hospital is told there is a seventy-percent chance that emergency admissions will fall between 180 and 220, managers still need to decide what staffing level is acceptable given the cost of unused capacity and the risk of overcrowding.',
      'G. For this reason, some forecasters advocate decision-focused evaluation. A model should be tested not only against historical observations but also against the decisions it is intended to support. This can reveal that a slightly less accurate forecast produces better outcomes because its errors occur in less costly situations. It can also expose cases where improved statistical accuracy makes almost no operational difference.',
      'H. Forecasting, then, is less a contest to discover one perfect number than a structured way to reason under uncertainty. Models, judgment, and probability statements are tools. Their usefulness depends on the choices available, the costs of different errors, and the ability of institutions to respond when new information arrives.'
    ],
    questions:[
      makeQuestion('iar-01','Multiple Choice','What is the writer’s main claim in paragraph A?',1,['Forecasts should always be long term','Forecasts should be judged by how they support decisions','Statistical models are usually inaccurate','Decision-makers should avoid uncertain information']),
      makeQuestion('iar-02','True / False / Not Given','Two forecasts with the same percentage error can have very different practical consequences.',0,['True','False','Not Given']),
      makeQuestion('iar-03','Sentence Completion','Some organizations use _____ functions to give different penalties to different kinds of error.','loss'),
      makeQuestion('iar-04','Matching Information','Which paragraph discusses how much time organizations have to respond?',2,['B','D','C','F']),
      makeQuestion('iar-05','Multiple Choice','Why can human judgment improve a forecast?',2,['It removes uncertainty','It guarantees consistency','It may include information missing from historical data','It prevents recency bias']),
      makeQuestion('iar-06','True / False / Not Given','The writer says expert adjustments should always replace statistical forecasts.',1,['True','False','Not Given']),
      makeQuestion('iar-07','Sentence Completion','Forecast combinations work best when models contain genuinely different _____.','information'),
      makeQuestion('iar-08','Multiple Choice','What problem is associated with a single-number forecast?',0,['It can hide uncertainty','It is impossible to calculate','It always overestimates demand','It cannot be compared historically']),
      makeQuestion('iar-09','Short Answer','What two competing concerns are mentioned in the hospital example?','unused capacity and overcrowding',null,{acceptedAnswers:['cost of unused capacity and risk of overcrowding','unused capacity; overcrowding']}),
      makeQuestion('iar-10','True / False / Not Given','A more statistically accurate forecast will necessarily produce a better operational outcome.',1,['True','False','Not Given']),
      makeQuestion('iar-11','Multiple Choice','What does decision-focused evaluation add to ordinary accuracy testing?',3,['It removes historical data','It avoids probability ranges','It selects the newest model','It examines the consequences of decisions']),
      makeQuestion('iar-12','Matching Heading','Choose the best heading for paragraph E.',2,['Why experts make poor decisions','The limits of long-range data','Combining models for greater stability','How hospitals measure admissions']),
      makeQuestion('iar-13','Short Answer','According to paragraph H, what three things determine usefulness?','choices, costs and ability to respond',null,{acceptedAnswers:['choices available, costs of errors, ability to respond','choices costs and response ability']}),
      makeQuestion('iar-14','Multiple Choice','Which statement best reflects the passage?',1,['Perfect prediction is the central goal','Forecast quality depends partly on decision context','Human judgment is better than models','Probability ranges should be avoided']),
    ],
  },
  {
    title:'The Hidden Work of Standards',
    paragraphs:[
      'A. Many technologies appear to function independently, yet everyday systems rely on technical standards that users rarely notice. A payment card works in thousands of terminals, a shipping container can be transferred between truck and ship, and a web page can be viewed on devices made by competing companies because organizations have agreed on shared specifications.',
      'B. Standards are sometimes mistaken for government regulations. Regulations are legally enforceable rules issued by authorities, whereas many standards are voluntary documents created by professional bodies, industry groups, or international committees. The distinction is not absolute: regulators may later refer to a standard in law, making compliance effectively mandatory in a particular context.',
      'C. Creating a standard involves negotiation because participants have different interests. A manufacturer may prefer a specification close to its existing technology, while customers may want stronger compatibility requirements. Smaller firms can worry that complex certification procedures favor large competitors. Committees therefore spend considerable time defining scope, testing methods, terminology, and procedures for revising the document.',
      'D. Stability is valuable, but excessive stability can become a problem. If a standard changes too frequently, companies face repeated redesign costs. If it changes too slowly, it may preserve outdated assumptions. Successful standards often include migration periods during which old and new versions can coexist, allowing equipment and software to be updated gradually.',
      'E. Network effects can make standards powerful. Once many organizations adopt the same specification, joining that network becomes more attractive to others. This can accelerate compatibility but can also lock markets into an inferior design if switching costs become high. Historical success therefore does not prove that a standard was technically optimal.',
      'F. Testing and certification add another layer. A product may claim compliance, but buyers need confidence that the claim is meaningful. Independent laboratories, audit procedures, and certification marks can reduce uncertainty. Yet these systems cost money, and overly burdensome testing can discourage innovation or exclude small suppliers.',
      'G. Digital services have introduced faster revision cycles. Software can be updated much more quickly than bridges, electrical equipment, or medical devices. Standards bodies are experimenting with modular documents and online revision processes, but they still need transparent review. Speed is useful only if participants can understand what changed and why.',
      'H. Standards succeed when they become almost invisible. Users benefit from interoperability without needing to know which committees defined connector dimensions, message formats, or safety tests. The quiet nature of this infrastructure should not obscure its importance: shared rules often determine whether separate technologies can function as a system.'
    ],
    questions:[
      makeQuestion('iar-15','True / False / Not Given','Technical standards are always created by governments.',1,['True','False','Not Given']),
      makeQuestion('iar-16','Sentence Completion','Regulators can make a voluntary standard effectively mandatory by referring to it in _____.','law'),
      makeQuestion('iar-17','Multiple Choice','Why can standard-setting negotiations be difficult?',1,['Standards never affect competition','Participants have different interests','Terminology cannot be defined','Customers avoid compatibility']),
      makeQuestion('iar-18','Short Answer','What may smaller firms believe complex certification procedures favor?','large competitors',null,{acceptedAnswers:['larger competitors','large firms','larger firms']}),
      makeQuestion('iar-19','Multiple Choice','What is one purpose of a migration period?',0,['To let old and new versions coexist temporarily','To make standards legally binding','To eliminate testing','To prevent software updates']),
      makeQuestion('iar-20','True / False / Not Given','A widely adopted standard must be the technically best design.',1,['True','False','Not Given']),
      makeQuestion('iar-21','Sentence Completion','High switching costs can _____ a market into an inferior design.','lock'),
      makeQuestion('iar-22','Multiple Choice','Why are certification systems useful?',2,['They remove all product costs','They replace standards committees','They give buyers confidence in compliance claims','They guarantee innovation']),
      makeQuestion('iar-23','True / False / Not Given','The passage says all independent testing is too expensive for small firms.',2,['True','False','Not Given']),
      makeQuestion('iar-24','Matching Information','Which paragraph contrasts software with physical infrastructure?',2,['E','F','G','H']),
      makeQuestion('iar-25','Multiple Choice','What condition does the writer attach to faster revision?',3,['Standards must remain secret','Only manufacturers should review changes','Physical products must update at software speed','Changes still need transparent review']),
      makeQuestion('iar-26','Short Answer','What benefit do users receive without understanding the standards themselves?','interoperability'),
      makeQuestion('iar-27','Multiple Choice','What is the main purpose of the final paragraph?',0,['To emphasize the importance of mostly invisible infrastructure','To argue standards should be abolished','To describe connector manufacturing','To compare regulations across countries']),
    ],
  },
  {
    title:'Rethinking Urban Heat',
    paragraphs:[
      'A. Cities are often warmer than surrounding rural areas, a pattern known as the urban heat-island effect. The difference is not produced by a single cause. Dark surfaces absorb solar energy, buildings restrict airflow, vehicles and air-conditioning systems release waste heat, and many districts contain less vegetation than the landscapes they replaced.',
      'B. Average temperature, however, can hide sharp differences within one city. Neighborhoods with mature trees and parks may be several degrees cooler than nearby industrial or commercial areas dominated by asphalt. Researchers increasingly map heat at street level because city-wide weather stations cannot represent the conditions experienced by every resident.',
      'C. Measurement itself is challenging. Satellite instruments can estimate surface temperature over large areas, but surface temperature is not identical to the air temperature felt by pedestrians. Mobile sensors mounted on bicycles or vehicles provide detailed local measurements, yet results can vary with time of day, traffic, shade, and sensor placement. Combining methods can therefore produce a more complete picture.',
      'D. Planting trees is a widely promoted response. Trees provide shade and cool the air through evapotranspiration, but benefits depend on species, canopy size, water availability, and long-term maintenance. Poorly chosen trees may struggle in compacted soil or interfere with utilities. In dry climates, large planting programs also need realistic plans for irrigation.',
      'E. Reflective roofs and pavements address heat differently by increasing the amount of solar energy reflected rather than absorbed. They can reduce surface temperatures substantially, although benefits at pedestrian level depend on design. Highly reflective materials may create glare, and reflected radiation can sometimes increase heat exposure for people standing nearby.',
      'F. Social factors influence vulnerability. Older adults, outdoor workers, people with chronic illness, and households without reliable cooling face greater health risks during heat waves. These groups are not distributed evenly across cities. Historical housing and infrastructure decisions can leave some neighborhoods with fewer trees, more pavement, and older buildings that retain heat.',
      'G. For planners, this means heat policy cannot be reduced to a single technical intervention. A district with little tree cover may need planting, while a dense commercial area may benefit more from roof retrofits, shaded transit stops, or changes to working hours. Emergency responses such as cooling centers remain important but address acute risk rather than the underlying urban form.',
      'H. The most effective strategies combine physical measurements with social information. Knowing where temperatures are highest is useful, but knowing who is exposed, when exposure occurs, and what resources people can access is equally important. Urban heat is therefore both an environmental condition and a planning problem involving infrastructure, public health, and inequality.'
    ],
    questions:[
      makeQuestion('iar-28','Multiple Choice','What does paragraph A emphasize?',2,['Urban heat is caused only by vehicles','Rural areas have more buildings','Several factors contribute to urban heat','Air conditioning always cools streets']),
      makeQuestion('iar-29','True / False / Not Given','Every neighborhood in a city experiences the same temperature increase.',1,['True','False','Not Given']),
      makeQuestion('iar-30','Sentence Completion','Researchers increasingly map heat at _____ level.','street'),
      makeQuestion('iar-31','Multiple Choice','What limitation of satellites is mentioned?',1,['They cannot cover large areas','Surface temperature is not the same as pedestrian air temperature','They only operate at night','They cannot detect roofs']),
      makeQuestion('iar-32','True / False / Not Given','Mobile sensor results can be affected by where the sensor is positioned.',0,['True','False','Not Given']),
      makeQuestion('iar-33','Multiple Choice','Why might tree-planting programs fail to deliver expected benefits?',3,['Trees never provide shade','Evapotranspiration warms the air','All cities lack water completely','Species and maintenance conditions may be unsuitable']),
      makeQuestion('iar-34','Short Answer','What resource may large tree programs require in dry climates?','irrigation',null,{acceptedAnswers:['water for irrigation']}),
      makeQuestion('iar-35','Multiple Choice','What is one possible disadvantage of highly reflective materials?',0,['Glare','Reduced sunlight reflection','More asphalt absorption','Lower roof temperatures']),
      makeQuestion('iar-36','True / False / Not Given','The passage states that reflective pavements always reduce heat exposure for nearby pedestrians.',1,['True','False','Not Given']),
      makeQuestion('iar-37','Multiple Choice','What does paragraph F add to the discussion?',2,['A history of weather stations','A list of tree species','Differences in social vulnerability','A method for measuring roofs']),
      makeQuestion('iar-38','Sentence Completion','Cooling centers mainly address _____ risk rather than urban form.','acute'),
      makeQuestion('iar-39','Short Answer','Besides temperature, what three exposure questions does the final paragraph highlight?','who, when and what resources',null,{acceptedAnswers:['who is exposed, when exposure occurs, what resources people can access','who when and resources']}),
      makeQuestion('iar-40','Multiple Choice','What is the writer’s overall view?',1,['One technology can solve urban heat','Heat policy should combine environmental and social information','Only health departments should address heat','City-wide averages are sufficient for planning']),
    ],
  },
]

const writingTask1Bank = [
  {
    id:'iw1-a',
    task:'Task 1',
    minWords:150,
    recommendedMinutes:20,
    prompt:'The table below shows the percentage of household waste recycled in four cities in 2012 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    data:'City A: 34%→57%; City B: 48%→61%; City C: 29%→52%; City D: 55%→58%.',
  },
  {
    id:'iw1-b',
    task:'Task 1',
    minWords:150,
    recommendedMinutes:20,
    prompt:'The chart below compares average daily passenger numbers on three forms of public transport in a city in 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    data:'Bus: 410,000→365,000; Metro: 280,000→455,000; Tram: 95,000→150,000 passengers per day.',
  },
  {
    id:'iw1-c',
    task:'Task 1',
    minWords:150,
    recommendedMinutes:20,
    prompt:'The table below gives the proportion of electricity generated from four sources in a country in 2005 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    data:'Coal 46%→21%; Gas 31%→26%; Wind 8%→29%; Solar 3%→18%; Other 12%→6%.',
  },
  {
    id:'iw1-d',
    task:'Task 1',
    minWords:150,
    recommendedMinutes:20,
    prompt:'The diagram below describes changes made to a town library between 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    data:'2010: central book stacks, small computer room, reading area, service desk. 2025: reduced book stacks, expanded digital media area, study rooms, café, self-service machines, relocated service desk.',
  },
]

const writingTask2Bank = [
  {
    id:'iw2-a',
    task:'Task 2',
    minWords:250,
    recommendedMinutes:40,
    prompt:'Some people believe governments should spend more on preventing illness, while others think treating people who are already ill should remain the priority. Discuss both views and give your own opinion.',
  },
  {
    id:'iw2-b',
    task:'Task 2',
    minWords:250,
    recommendedMinutes:40,
    prompt:'In many countries, more employees are working partly from home and partly in the workplace. Do the advantages of this development outweigh the disadvantages?',
  },
  {
    id:'iw2-c',
    task:'Task 2',
    minWords:250,
    recommendedMinutes:40,
    prompt:'Some people think university students should study only subjects related to their future careers, while others believe they should be free to study a wider range of subjects. Discuss both views and give your own opinion.',
  },
  {
    id:'iw2-d',
    task:'Task 2',
    minWords:250,
    recommendedMinutes:40,
    prompt:'Cities are increasingly using technology to manage transport, energy and public services. To what extent do you agree that this makes cities better places to live?',
  },
]

export function buildIeltsExamSections() {
  const random = createExamRandom()
  const formId = examFormId('ielts')
  const baseListening = grouped(ieltsFullListening,(item)=>item.section)
  const baseReading = grouped(ieltsFullReading,(item)=>item.passageTitle)

  const easyListeningSlot = Math.floor(random()*4)
  const listening = []
  for (let index=0; index<4; index+=1) {
    const source = index === easyListeningSlot ? baseListening[index] : listeningAlternatives[index].questions.map((item)=>({
      ...item,
      section:listeningAlternatives[index].label,
      audio:listeningAlternatives[index].audio,
    }))
    listening.push(...source)
  }

  const baseReadingSlot = Math.floor(random()*3)
  const reading = []
  for (let index=0; index<3; index+=1) {
    const source = index === baseReadingSlot
      ? baseReading[index]
      : readingAlternatives[index].questions.map((item)=>({
          ...item,
          passageTitle:readingAlternatives[index].title,
          passage:readingAlternatives[index].paragraphs,
        }))
    reading.push(...source)
  }

  return [
    { id:formId+'-listening', label:'Listening', duration:30*60, questions:stampQuestions(listening,formId+'-l',random) },
    { id:formId+'-reading', label:'Academic Reading', duration:60*60, questions:stampQuestions(reading,formId+'-r',random) },
  ]
}

export function buildIeltsWritingTasks() {
  const random = createExamRandom()
  const [task1] = sample(writingTask1Bank,1,random)
  const [task2] = sample(writingTask2Bank,1,random)
  return [task1,task2].map((task,index)=>({ ...task,id:task.id+'-'+Date.now().toString(36)+'-'+index }))
}

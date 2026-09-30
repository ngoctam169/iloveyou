const textQ = (id,type,question,correct,extra={}) => ({ id,type,question,correct,difficulty:'hard',...extra })
const choiceQ = (id,type,question,options,answer,extra={}) => ({ id,type,question,options,answer,difficulty:'hard',...extra })

export const ieltsHardListeningSections = [
  {
    id:'ihl-1',
    label:'Listening Part 1',
    audio:'Agent: Good afternoon, Northbridge Cycle Tours. Caller: I am calling about the weekend coastal tour on the twenty-third. Agent: We still have places on the Saturday departure, which leaves at eight forty-five from the visitor centre, not the railway station as shown in the old brochure. Caller: Good to know. I will need to hire a bicycle. Agent: That is twelve pounds, including a helmet. The tour itself is thirty-eight pounds. Caller: And lunch? Agent: The café stop is optional, so lunch is not included. We recommend bringing a light waterproof jacket because the forecast can change quickly near the coast. Caller: I am vegetarian. Is that a problem at the café? Agent: No, but tell the guide when you check in. Caller: My name is Priya Desai, D E S A I. Agent: Thank you. Could I have a mobile number? Caller: 07735 618 492.',
    questions:[
      textQ('ihl1-01','Form Completion','What is the caller’s surname?','Desai',{instructions:'ONE WORD ONLY'}),
      textQ('ihl1-02','Form Completion','On what date does the caller want to travel?','23',{acceptedAnswers:['23rd','23rd of the month'],instructions:'ONE NUMBER ONLY'}),
      choiceQ('ihl1-03','Multiple Choice','Where does the Saturday tour depart from?',['The visitor centre','The railway station','The café'],0),
      textQ('ihl1-04','Form Completion','What time does the tour leave?','8:45',{acceptedAnswers:['8.45','8:45 am','08:45']}),
      textQ('ihl1-05','Note Completion','How much does bicycle hire cost?','12 pounds',{acceptedAnswers:['£12','12']}),
      choiceQ('ihl1-06','Multiple Choice','What is included with bicycle hire?',['Lunch','A helmet','A waterproof jacket'],1),
      choiceQ('ihl1-07','Multiple Choice','Which item is NOT included in the tour price?',['Lunch','The guided tour','Route planning'],0),
      textQ('ihl1-08','Note Completion','What clothing item does the agent recommend bringing?','waterproof jacket',{acceptedAnswers:['a waterproof jacket','light waterproof jacket'],instructions:'NO MORE THAN THREE WORDS'}),
      choiceQ('ihl1-09','Multiple Choice','When should the caller mention her dietary requirement?',['When checking in','When booking the café','After the tour'],0),
      textQ('ihl1-10','Form Completion','What are the final three digits of the caller’s phone number?','492'),
    ],
  },
  {
    id:'ihl-2',
    label:'Listening Part 2',
    audio:'Welcome to the Ashford Innovation Centre. Before today’s public open day begins, I will explain the layout and a few temporary changes. The main exhibition hall is straight ahead through the glass doors. The prototype gallery, normally beside it, has moved upstairs to Room 214 because the ground-floor lighting is being replaced. If you have children with you, the robotics workshop is in Studio C, beyond the café. Places are limited and must be booked at the information desk. The café serves hot meals until two thirty, though drinks and snacks remain available until four. At eleven fifteen, Dr Lewis will give a talk in the lecture theatre about low-cost water sensors. A second talk at one forty-five will focus on battery recycling. Visitors may photograph displays unless a red no-photography symbol is shown. Finally, anyone joining the laboratory tour should meet beside the west staircase ten minutes before the printed start time.',
    questions:[
      choiceQ('ihl2-01','Multiple Choice','Where is the prototype gallery today?',['Room 214','The main exhibition hall','Studio C'],0),
      textQ('ihl2-02','Sentence Completion','The gallery moved because ground-floor _____ is being replaced.','lighting'),
      choiceQ('ihl2-03','Multiple Choice','Where should visitors reserve a place for the robotics workshop?',['At the information desk','Inside Studio C','At the café'],0),
      textQ('ihl2-04','Note Completion','Hot meals are served until _____.','2:30',{acceptedAnswers:['2.30','2:30 pm','14:30']}),
      choiceQ('ihl2-05','Multiple Choice','What is Dr Lewis’s talk about?',['Water sensors','Battery recycling','Prototype design'],0),
      textQ('ihl2-06','Note Completion','The battery recycling talk begins at _____.','1:45',{acceptedAnswers:['1.45','1:45 pm','13:45']}),
      choiceQ('ihl2-07','Multiple Choice','When is photography prohibited?',['Where a red symbol is displayed','In every laboratory','Only during talks'],0),
      textQ('ihl2-08','Sentence Completion','Laboratory tour participants should meet by the west _____.','staircase'),
      choiceQ('ihl2-09','Multiple Choice','How early should laboratory tour participants meet?',['10 minutes','15 minutes','20 minutes'],0),
      choiceQ('ihl2-10','Multiple Choice','Which facility stays open for drinks after hot meal service ends?',['The café','The lecture theatre','The prototype gallery'],0),
    ],
  },
  {
    id:'ihl-3',
    label:'Listening Part 3',
    audio:'Tutor: Let us review your group project on commuter behaviour. Student 1: We originally planned to compare three neighbourhoods, but the pilot questionnaire showed that the questions about household income made several respondents uncomfortable. Student 2: So we removed that section and added questions about journey flexibility instead. Tutor: Sensible. What about your sample? Student 1: We have eighty-two responses so far. Most came through the university mailing list, which may over-represent younger commuters. Tutor: Then do not present the sample as typical of the whole city. Student 2: We thought of collecting another twenty responses at the central bus interchange. Tutor: That would broaden the sample, but make sure you survey at different times of day. Student 1: For the analysis, I was going to compare average journey time. Student 2: I think reliability matters more. Some people accept a longer trip if the arrival time is predictable. Tutor: Why not report both, but separate scheduled duration from delay variability? Student 1: Good point. We also found that people who cycle often combine it with rail travel. Tutor: That is worth discussing, but check whether the questionnaire actually asked why they combine modes before you interpret the reason.',
    questions:[
      choiceQ('ihl3-01','Multiple Choice','Why did the students remove questions about income?',['Some respondents were uncomfortable with them','The tutor said income was irrelevant','The answers were too similar'],0),
      textQ('ihl3-02','Sentence Completion','The students added questions about journey _____.','flexibility'),
      textQ('ihl3-03','Short Answer','How many responses have they collected so far?','82',{acceptedAnswers:['eighty-two']}),
      choiceQ('ihl3-04','Multiple Choice','What weakness does the tutor identify in the current sample?',['It may contain too many younger commuters','It is too large to analyse','It excludes university students'],0),
      choiceQ('ihl3-05','Multiple Choice','Where might the students collect more responses?',['A bus interchange','A railway office','A shopping centre'],0),
      textQ('ihl3-06','Sentence Completion','The tutor says surveys should be conducted at different times of _____.','day'),
      choiceQ('ihl3-07','Multiple Choice','Which measure does Student 2 consider especially important?',['Reliability','Ticket price','Walking distance'],0),
      choiceQ('ihl3-08','Multiple Choice','What distinction does the tutor suggest making?',['Scheduled duration versus delay variability','Weekday versus weekend fares','Cycling versus walking speed'],0),
      textQ('ihl3-09','Sentence Completion','Frequent cyclists sometimes combine cycling with _____ travel.','rail'),
      choiceQ('ihl3-10','Multiple Choice','What caution does the tutor give about the mixed-mode finding?',['Do not infer a reason that was not asked about','Remove it from the report entirely','Collect only cycling data next time'],0),
    ],
  },
  {
    id:'ihl-4',
    label:'Listening Part 4',
    audio:'Today I will discuss why some restoration projects fail even when the engineering is technically sound. A useful example comes from river restoration. For much of the twentieth century, urban rivers were straightened and confined by concrete channels in order to move floodwater quickly through cities. More recent projects often try to restore bends, shallow banks and vegetation. These changes can slow water, create habitats and improve public access. However, simply rebuilding a more natural-looking channel does not guarantee success. One problem is sediment. If upstream construction continues to send large quantities of fine material into the river, newly created pools may fill rapidly. A second issue is maintenance. Young riverside plants can be overwhelmed by invasive species during the first few years, so early management is essential. Third, designers sometimes overlook how people use the site. A path placed too close to sensitive habitat may increase disturbance, while a path placed too far away may discourage public support for the project. Monitoring therefore needs to include both ecological measures and human behaviour. Successful projects tend to set measurable goals before construction, collect baseline data, and keep enough funding for several years of adjustment rather than treating completion of building work as the end of the project.',
    questions:[
      choiceQ('ihl4-01','Multiple Choice','Why were many urban rivers straightened historically?',['To move floodwater quickly','To improve fish migration','To create walking paths'],0),
      textQ('ihl4-02','Sentence Completion','Modern projects may restore bends, shallow banks and _____.','vegetation'),
      choiceQ('ihl4-03','Multiple Choice','What can newly created pools fill with?',['Fine sediment','Invasive fish','Concrete fragments'],0),
      textQ('ihl4-04','Sentence Completion','Young riverside plants may be threatened by invasive _____.','species'),
      choiceQ('ihl4-05','Multiple Choice','When is plant management especially important?',['During the first few years','Only before construction','After several decades'],0),
      choiceQ('ihl4-06','Multiple Choice','What can happen if a path is too close to sensitive habitat?',['Disturbance may increase','Public support always increases','Floodwater moves faster'],0),
      textQ('ihl4-07','Sentence Completion','Monitoring should include ecological measures and human _____.','behaviour',{acceptedAnswers:['behavior']}),
      choiceQ('ihl4-08','Multiple Choice','What should projects establish before construction?',['Measurable goals','Permanent visitor limits','A fixed river depth'],0),
      textQ('ihl4-09','Sentence Completion','Projects should collect _____ data before changes are made.','baseline'),
      choiceQ('ihl4-10','Multiple Choice','What is the speaker’s main argument?',['Long-term management and monitoring are crucial','Natural-looking channels always succeed','Engineering design is unimportant'],0),
    ],
  },
]

export const ieltsHardReadingPassages = [
  {
    id:'ihr-14',
    title:'When Forecasts Change Behaviour',
    paragraphs:[
      'A. Forecasts are usually treated as attempts to describe the future, but in social systems a forecast can also change the future it describes. A prediction of heavy traffic, for instance, may persuade drivers to travel earlier or choose another route. If enough people respond, the predicted congestion may never occur. This does not necessarily mean the forecast was poor; the forecast may have altered behaviour successfully.',
      'B. Economists have long recognised a related problem in financial markets. Public expectations about inflation, interest rates or company performance can influence spending and investment before the underlying event occurs. A prediction may therefore become partly self-fulfilling, as when expectations of rising prices encourage earlier purchases, or self-defeating, as when an expected shortage causes producers to increase supply.',
      'C. The issue creates difficulties for evaluating forecast accuracy. A weather forecast can often be compared with later measurements because ordinary listeners have little influence on atmospheric conditions. By contrast, a public-health warning may be followed by fewer infections precisely because people changed their behaviour. Judging such a warning only by whether its worst-case projection occurred would ignore the effect of the warning itself.',
      'D. Researchers address this problem by comparing multiple sources of evidence. They may examine regions where different messages were issued, study behaviour before and after announcements, or use models that estimate what might have happened without intervention. None of these approaches creates a perfect counterfactual, but together they can provide stronger evidence than a simple comparison between prediction and outcome.',
      'E. Communication strategy also matters. Highly dramatic forecasts may attract attention but can damage trust if audiences repeatedly see extreme outcomes fail to occur. Overly cautious messages have the opposite risk: they may preserve credibility but fail to prompt useful action. Effective forecasters therefore need to communicate uncertainty, explain plausible ranges, and make clear which actions could change the result.',
      'F. The broader lesson is that some forecasts should be judged partly by their decision value rather than by literal correspondence with a single future outcome. A flood warning that leads to timely evacuation may be useful even if the river ultimately rises less than expected. In systems where people respond to information, prediction and intervention cannot always be cleanly separated.',
    ],
    questions:[
      choiceQ('ihr14-01','Multiple Choice','What is the main point of paragraph A?',['A forecast can influence the event it predicts','Traffic forecasts are usually inaccurate','Drivers ignore most travel information','Congestion cannot be prevented'],0),
      choiceQ('ihr14-02','True / False / Not Given','If predicted congestion does not occur, the original forecast must have been wrong.',['True','False','Not Given'],1),
      textQ('ihr14-03','Sentence Completion','In financial markets, expectations may influence spending and _____.','investment'),
      choiceQ('ihr14-04','Multiple Choice','Which example illustrates a self-defeating prediction?',['A predicted shortage encourages increased supply','Expected inflation causes earlier purchases','A forecast is kept private','A company reports past profits'],0),
      choiceQ('ihr14-05','Matching Information','Which paragraph contrasts weather forecasts with public-health warnings?',['A','B','C','D'],2),
      choiceQ('ihr14-06','True / False / Not Given','People receiving a weather forecast normally have substantial influence on atmospheric conditions.',['True','False','Not Given'],1),
      choiceQ('ihr14-07','Multiple Choice','Why can a health warning appear inaccurate even when it is effective?',['Behavioural changes may prevent the projected outcome','The warning contains no numerical information','Health data are never measured','Weather affects all disease models'],0),
      textQ('ihr14-08','Short Answer','What term does the passage use for an imagined outcome without intervention?','counterfactual'),
      choiceQ('ihr14-09','Multiple Choice','What risk is associated with repeatedly dramatic forecasts?',['Loss of trust','Higher investment','Slower communication','Reduced data collection'],0),
      textQ('ihr14-10','Sentence Completion','Forecasters should explain plausible _____.','ranges'),
      choiceQ('ihr14-11','True / False / Not Given','The author argues that cautious messages are always more effective than dramatic ones.',['True','False','Not Given'],1),
      choiceQ('ihr14-12','Multiple Choice','How should some forecasts be judged, according to the final paragraph?',['Partly by how useful they are for decisions','Only by exact numerical accuracy','Only after several decades','By whether they create no behavioural response'],0),
      textQ('ihr14-13','Short Answer','What action is mentioned as a possible response to a flood warning?','evacuation',{acceptedAnswers:['timely evacuation']}),
      choiceQ('ihr14-14','Multiple Choice','Which statement best summarises the passage?',['In social systems, forecasts can alter outcomes and require more nuanced evaluation','All forecasts become self-fulfilling','Weather prediction is more important than health prediction','Public warnings should avoid uncertainty'],0),
    ],
  },
  {
    id:'ihr-13',
    title:'The Hidden Cost of Standardisation',
    paragraphs:[
      'A. Standardisation is one of the foundations of modern production. Common dimensions, interfaces and testing procedures allow components made by different firms to work together. The benefits are obvious in areas such as electrical plugs, shipping containers and digital file formats, where compatibility reduces cost and confusion.',
      'B. Yet standards can also preserve historical choices long after better alternatives appear. Once factories, regulations and user habits are built around a particular specification, replacing it becomes expensive. Economists describe this as path dependence: current options are constrained by decisions made earlier, even when those decisions were reasonable only under past conditions.',
      'C. The keyboard layout is often cited as an example, although the history is more complicated than popular stories suggest. What matters is not whether one layout is objectively best, but that millions of users, training courses and devices create a large installed base. A technically superior alternative would need to overcome retraining costs and coordination problems before its benefits could be realised.',
      'D. Standards can create strategic effects as well. A company whose technology becomes widely adopted may benefit from an ecosystem of compatible products and trained users. For this reason, firms sometimes publish technical specifications openly, not because they want to give away every advantage, but because broad adoption can make their own products more valuable.',
      'E. Governments face a difficult balance when selecting standards. Mandating one format too early can freeze an immature technology, while refusing to coordinate may leave consumers with incompatible systems. Some regulators therefore specify performance requirements rather than a single technical design, allowing competing approaches as long as they meet common safety or interoperability goals.',
      'F. Standardisation is therefore neither inherently conservative nor automatically progressive. It can accelerate innovation by providing a stable platform on which new products are built, but it can also make change harder once a system becomes deeply embedded. The challenge is to identify which features need stability and which should remain open to experimentation.',
    ],
    questions:[
      choiceQ('ihr13-01','Multiple Choice','What benefit of standards is emphasized in paragraph A?',['Compatibility between products','Higher advertising revenue','Fewer regulations','Shorter training courses'],0),
      textQ('ihr13-02','Sentence Completion','Existing choices can be constrained by earlier decisions, a process called path _____.','dependence'),
      choiceQ('ihr13-03','True / False / Not Given','The passage states that historical standards were always poorly chosen.',['True','False','Not Given'],1),
      choiceQ('ihr13-04','Multiple Choice','Why can replacing an established keyboard layout be difficult?',['Users and systems are already organized around the existing layout','No alternative layouts exist','Governments ban keyboard innovation','New layouts require different languages'],0),
      choiceQ('ihr13-05','Matching Information','Which paragraph discusses firms publishing specifications to encourage adoption?',['B','C','D','E'],2),
      textQ('ihr13-06','Short Answer','What may make a company’s own products more valuable?','broad adoption',{acceptedAnswers:['wide adoption']}),
      choiceQ('ihr13-07','Multiple Choice','What risk arises if a government mandates a standard too early?',['An immature technology may become locked in','Consumers will have too many compatible systems','Training costs always disappear','Companies stop publishing specifications'],0),
      choiceQ('ihr13-08','True / False / Not Given','Some regulators prefer performance requirements to prescribing one technical design.',['True','False','Not Given'],0),
      textQ('ihr13-09','Sentence Completion','Competing approaches may be allowed if they satisfy common safety or _____ goals.','interoperability'),
      choiceQ('ihr13-10','Multiple Choice','What does the final paragraph say standards can provide for innovation?',['A stable platform','A permanent monopoly','A ban on experimentation','A single global company'],0),
      choiceQ('ihr13-11','True / False / Not Given','The author believes standardisation always slows technological progress.',['True','False','Not Given'],1),
      choiceQ('ihr13-12','Multiple Choice','What is the central challenge identified by the author?',['Deciding what needs stability and what should remain flexible','Eliminating all historical standards','Preventing firms from sharing specifications','Replacing every common interface'],0),
      choiceQ('ihr13-13','Multiple Choice','Which title best captures the passage?',['Why Standards Help and Hinder Change','Why All Standards Should Be Mandatory','The Decline of Modern Manufacturing','How Keyboard Design Determines Innovation'],0),
    ],
  },
]

export const ieltsWritingTask1Pool = [
  {
    id:'ihw1-01',task:'Task 1',minWords:150,recommendedMinutes:20,
    prompt:'The chart below compares the proportion of household waste recycled in five regions in 2005, 2015 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    data:'North: 28%, 46%, 61%. South: 35%, 39%, 48%. East: 18%, 37%, 58%. West: 42%, 51%, 55%. Central: 25%, 31%, 44%.'
  },
  {
    id:'ihw1-02',task:'Task 1',minWords:150,recommendedMinutes:20,
    prompt:'The diagram below shows how rainwater is collected and processed for use in a residential building. Summarise the process by selecting and reporting the main features.',
    data:'Roof collection → leaf filter → underground storage tank → pump → sediment filter → ultraviolet treatment → separate non-drinking-water pipes for toilets and garden taps.'
  },
  {
    id:'ihw1-03',task:'Task 1',minWords:150,recommendedMinutes:20,
    prompt:'The tables below show average weekly working hours and average commuting time for employees in four industries in 2010 and 2025. Summarise the main features and make relevant comparisons.',
    data:'2010 — Finance 44h/38m; Manufacturing 42h/31m; Technology 41h/34m; Healthcare 46h/29m. 2025 — Finance 40h/35m; Manufacturing 40h/28m; Technology 39h/24m; Healthcare 44h/32m.'
  },
]

export const ieltsWritingTask2Pool = [
  {
    id:'ihw2-01',task:'Task 2',minWords:250,recommendedMinutes:40,
    prompt:'Some people believe universities should focus mainly on subjects that lead directly to employment, while others argue that students should be free to study any subject they find valuable. Discuss both views and give your own opinion.'
  },
  {
    id:'ihw2-02',task:'Task 2',minWords:250,recommendedMinutes:40,
    prompt:'In many cities, governments are investing heavily in public transport rather than expanding roads for private cars. To what extent do the advantages of this approach outweigh the disadvantages?'
  },
  {
    id:'ihw2-03',task:'Task 2',minWords:250,recommendedMinutes:40,
    prompt:'Some employers increasingly use automated systems to screen job applicants before a human reviews them. What problems can this create, and what measures could reduce these problems?'
  },
]

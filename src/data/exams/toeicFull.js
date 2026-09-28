const q = (id, part, type, question, options, answer, extra = {}) => ({ id, part, type, question, options, answer, ...extra })

const part1 = [
  q('t1-01',1,'Photographs','Which statement best describes the scene?',['A woman is arranging documents on a desk.','A shelf is being painted.','Several desks are outdoors.','A printer is being repaired.'],0,{ audio:'Look at the picture. A woman is arranging documents on a desk.' }),
  q('t1-02',1,'Photographs','Which statement best describes the scene?',['Passengers are leaving a bus.','Several passengers are waiting beside a train.','A platform is being cleaned.','Tickets are displayed on a wall.'],1,{ audio:'Look at the picture. Several passengers are waiting beside a train.' }),
  q('t1-03',1,'Photographs','Which statement best describes the scene?',['Boxes have been stacked near a warehouse entrance.','A truck is parked inside an office.','Workers are opening a restaurant.','The shelves are completely empty.'],0,{ audio:'Look at the picture. Boxes have been stacked near a warehouse entrance.' }),
  q('t1-04',1,'Photographs','Which statement best describes the scene?',['A chef is serving food at a counter.','Customers are signing forms.','Some tables are being folded.','A bicycle is leaning against a wall.'],3,{ audio:'Look at the picture. A bicycle is leaning against a wall near the entrance.' }),
  q('t1-05',1,'Photographs','Which statement best describes the scene?',['Two people are looking at a computer screen.','A monitor is being carried downstairs.','The office lights are off.','A meeting room is empty.'],0,{ audio:'Look at the picture. Two colleagues are looking at a computer screen.' }),
  q('t1-06',1,'Photographs','Which statement best describes the scene?',['A road is closed for construction.','Several umbrellas are open outside a café.','A café is being demolished.','People are boarding an airplane.'],1,{ audio:'Look at the picture. Several umbrellas are open outside a café.' }),
]

const part2Rows = [
  ['When will the quarterly report be ready?',['By Friday afternoon.','In the blue folder.','The figures are accurate.'],0],
  ['Could you reserve a conference room for tomorrow?',['The conference was useful.','Sure, what time do you need it?','Tomorrow’s room is large.'],1],
  ['Why was the delivery delayed?',['It arrived at noon.','At the loading area.','Because of severe weather.'],2],
  ['Who approved the revised budget?',['Ms. Ortega did.','At the finance office.','It was revised yesterday.'],0],
  ['Where should I leave these packages?',['They are very heavy.','On the table by reception.','The courier left already.'],1],
  ['How often is the safety training offered?',['Every three months.','For new employees.','In the auditorium.'],0],
  ['Has the client signed the contract yet?',['No, they asked for one change.','It is a long contract.','At the legal department.'],0],
  ['Which train goes to Riverside Station?',['The express on platform four.','About forty minutes.','A return ticket, please.'],0],
  ['Would you like me to email the invoice?',['Yes, that would be helpful.','The invoice total is correct.','I sent three boxes.'],0],
  ['Didn’t Maya attend the workshop?',['No, she was meeting a supplier.','The workshop room is upstairs.','It lasted two hours.'],0],
  ['What time does the store close tonight?',['It closes at nine.','The store is downtown.','Yes, tonight.'],0],
  ['How did you hear about the position?',['Through a former colleague.','It is a full-time role.','On the third floor.'],0],
  ['Why don’t we take the earlier flight?',['That would give us more time.','The airport is busy.','I bought a suitcase.'],0],
  ['Where can I print my boarding pass?',['At the self-service kiosk.','The flight boards soon.','I printed two copies.'],0],
  ['Who is presenting after lunch?',['Dr. Harris from the design team.','Lunch is in the lobby.','The presentation was useful.'],0],
  ['Can you finish the inventory today?',['I should be able to.','The warehouse is large.','Inventory means stock.'],0],
  ['When did the new manager start?',['At the main branch.','At the beginning of May.','She manages six people.'],1],
  ['Why is the lobby so crowded?',['A conference just ended.','The carpet is new.','It has two elevators.'],0],
  ['Should we order more brochures?',['Yes, we are almost out.','The printer is upstairs.','They are very colorful.'],0],
  ['Where did you put the spare keys?',['In the top drawer.','They open the storage room.','I made two copies.'],0],
  ['How much does the express service cost?',['It arrives tomorrow.','Twelve dollars extra.','At the service counter.'],1],
  ['Is the cafeteria open on Saturdays?',['Only until two o’clock.','The menu changes daily.','I had lunch there.'],0],
  ['Who should I contact about payroll?',['Send a message to Human Resources.','The payment is monthly.','The form is on the desk.'],0],
  ['Why was the meeting moved online?',['The main office is being renovated.','The link is in the invitation.','The meeting starts at ten.'],0],
  ['Could I borrow your charger for a minute?',['Sure, it is in my bag.','The battery lasts all day.','I bought it last week.'],0],
]
const part2 = part2Rows.map(([audio,options,answer],i)=>q(`t2-${String(i+1).padStart(2,'0')}`,2,'Question–Response','Choose the best response.',options,answer,{ audio }))

const conversationSets = [
  ['The client moved our meeting to two o’clock. That gives us an extra hour to review the proposal. Great. I will update the calendar invitation.',
    [
      ['What changed?',['The meeting time','The proposal price','The client company','The office location'],0],
      ['What will the speakers have extra time to do?',['Review a proposal','Call a supplier','Prepare lunch','Book a flight'],0],
      ['What will the woman probably do next?',['Update a calendar invitation','Cancel the meeting','Print a contract','Visit the client'],0],
    ]],
  ['I ordered twenty chairs, but only eighteen arrived. I’m sorry about that. I will ask the warehouse to send the missing items today. Please send me the tracking number when they leave.',
    [
      ['What problem does the man mention?',['The chairs are damaged','The order is incomplete','The invoice is incorrect','The delivery was expensive'],1],
      ['What will the woman do?',['Contact the warehouse','Refund the entire order','Visit the office','Change the invoice'],0],
      ['What does the man request?',['A tracking number','A discount code','A new catalog','A receipt'],0],
    ]],
  ['Have you finished the website draft? The homepage is ready, but I still need the product photos. I can send those after lunch. Perfect, then I can publish the preview this afternoon.',
    [
      ['What is the woman waiting for?',['Product photos','A price list','A password','A customer review'],0],
      ['When will the man send the materials?',['After lunch','Tomorrow morning','Next week','Before breakfast'],0],
      ['What will the woman probably do this afternoon?',['Publish a preview','Attend training','Visit a client','Replace a camera'],0],
    ]],
  ['The copier on the second floor is jammed again. I called maintenance, but they cannot come until three. I need these packets before the workshop starts. Use the copier in the library; it is available now.',
    [
      ['What problem is discussed?',['A copier is jammed','A workshop was canceled','A library is closed','Packets were delivered late'],0],
      ['When can maintenance come?',['At three','At noon','Tomorrow','After the workshop'],0],
      ['What does the man suggest?',['Use another copier','Delay the workshop','Call a supplier','Print fewer packets'],0],
    ]],
  ['Your flight to Denver was changed to gate C14. Thanks. Is the departure time still 6:40? Yes, but boarding will start ten minutes earlier than printed on your pass.',
    [
      ['What was changed?',['The gate','The destination','The ticket price','The airline'],0],
      ['What time is the flight scheduled to depart?',['6:40','6:30','7:10','5:40'],0],
      ['What will happen earlier?',['Boarding','Departure','Check-in closing','Baggage claim'],0],
    ]],
  ['The monthly sales report shows a drop in online orders. Could the new checkout page be causing it? Possibly. I will compare the conversion data before and after the update. Let’s review your findings tomorrow.',
    [
      ['What has decreased?',['Online orders','Store hours','Advertising costs','Product prices'],0],
      ['What will the man compare?',['Conversion data','Employee schedules','Supplier contracts','Delivery routes'],0],
      ['What will the speakers do tomorrow?',['Review findings','Launch an advertisement','Meet a supplier','Close the website'],0],
    ]],
  ['I booked the small conference room for our interview panel. We have six people attending, so it may be too crowded. The large room is free after eleven. I’ll move the reservation.',
    [
      ['What is the problem?',['The room may be too small','The interview was canceled','Too few people are attending','The large room has no equipment'],0],
      ['When is the large room available?',['After eleven','Before nine','All morning','Next week'],0],
      ['What will the woman do?',['Change the reservation','Reduce the panel','Cancel the interviews','Order new chairs'],0],
    ]],
  ['The shipment of tablets is scheduled for Thursday. That is one day later than we expected. Will the training team still have time to install the software? Yes, their session was moved to Monday.',
    [
      ['When will the tablets arrive?',['Thursday','Wednesday','Friday','Monday'],0],
      ['What concern does the woman have?',['Time to install software','The cost of tablets','The size of the shipment','The training location'],0],
      ['What was moved to Monday?',['A training session','The shipment','A software release','A meeting'],0],
    ]],
  ['I noticed the café menu still lists the old prices. The new prices start tomorrow. I’ll print replacement menus tonight. Can you update the digital board before opening? Absolutely.',
    [
      ['What needs to be changed?',['Menu prices','Opening hours','Staff uniforms','Supplier names'],0],
      ['When do the new prices begin?',['Tomorrow','Tonight','Next month','Next week'],0],
      ['What is the man asked to update?',['A digital board','Printed menus','The café website password','A delivery schedule'],0],
    ]],
  ['The hotel says our team can check in early if the rooms are ready. Great. Our train arrives at ten, so we can leave our bags even if we have to wait. I’ll confirm the luggage storage policy.',
    [
      ['What are the speakers discussing?',['Hotel check-in','A train delay','A meeting room','A restaurant reservation'],0],
      ['When does their train arrive?',['At ten','At noon','At nine','At eleven'],0],
      ['What will the woman confirm?',['The luggage storage policy','The train schedule','The room price','The breakfast menu'],0],
    ]],
  ['We received three applications for the internship. Only three? The posting closes Friday, so we should share it on the university job board. I’ll do that this afternoon.',
    [
      ['What are the speakers concerned about?',['Few applications','A late interview','High salary costs','A closed university'],0],
      ['When does the posting close?',['Friday','Today','Monday','Next month'],0],
      ['What will the woman do?',['Share the job posting','Interview a candidate','Call the university president','Extend the internship'],0],
    ]],
  ['The design team wants feedback on the new packaging by noon. I like the color, but the product name is hard to read. I agree. I’ll ask them to increase the font size.',
    [
      ['What are the speakers reviewing?',['Packaging','A website','A contract','An office layout'],0],
      ['What problem does the woman mention?',['The product name is hard to read','The color is too dark','The package is too large','The price is missing'],0],
      ['What change will the man request?',['A larger font','A new color','A lower price','A different product name'],0],
    ]],
  ['The customer training starts at one, but the projector is not connecting. Did you try the spare cable in the cabinet? Not yet. I’ll test it now while you call technical support.',
    [
      ['What problem is discussed?',['A projector connection','A missing customer','A late delivery','A broken cabinet'],0],
      ['What will the woman test?',['A spare cable','A new projector','The room lights','A customer account'],0],
      ['Who will be contacted?',['Technical support','A delivery driver','The customer’s manager','Security'],0],
    ]],
]
const part3 = conversationSets.flatMap(([audio,questions],setIndex)=>questions.map(([question,options,answer],qIndex)=>q(
  `t3-${String(setIndex*3+qIndex+1).padStart(2,'0')}`,3,'Conversations',question,options,answer,{ audio }
)))

const talkSets = [
  ['Attention passengers. Flight 726 to Singapore will depart from Gate 18 instead of Gate 12. Boarding will begin at nine fifteen. Passengers in rows twenty through thirty will board first.',
    [['What change is announced?',['A gate has changed','The flight is canceled','The destination changed','Boarding is complete'],0],['When will boarding begin?',['9:15','9:50','8:15','10:15'],0],['Who will board first?',['Passengers in rows 20–30','Business travelers','Families with children','Passengers at Gate 12'],0]]],
  ['Welcome to the City Science Museum. The robotics exhibition is on the second floor and remains open until six. Guided tours leave every hour from the main lobby. Tickets for special demonstrations can be purchased at the information desk.',
    [['Where is the robotics exhibition?',['On the second floor','In the lobby','Outside','On the roof'],0],['Where do guided tours begin?',['The main lobby','The second floor','The ticket office','The café'],0],['Where can demonstration tickets be purchased?',['At the information desk','Online only','At the café','On the tour bus'],0]]],
  ['This is a reminder that the west parking lot will be resurfaced tomorrow. Employees should use the north lot until Monday. Shuttle vans will run between the north lot and the main entrance every ten minutes.',
    [['Why will the west lot be unavailable?',['It is being resurfaced','A conference is taking place','It is reserved for visitors','A market is opening'],0],['Until when should employees use the north lot?',['Monday','Tomorrow afternoon','Friday','Next month'],0],['How often will shuttles run?',['Every ten minutes','Every hour','Twice a day','Every thirty minutes'],0]]],
  ['Thank you for calling Greenway Dental Clinic. Our office is closed for lunch from twelve thirty to one thirty. To reschedule an appointment, press two. For urgent dental care, please stay on the line.',
    [['What business is speaking?',['A dental clinic','A hotel','A pharmacy','A bank'],0],['When is the office closed for lunch?',['12:30 to 1:30','11:30 to 12:30','1:30 to 2:30','Noon to three'],0],['What should callers do for urgent care?',['Stay on the line','Press two','Call tomorrow','Visit the website'],0]]],
  ['Our spring furniture sale begins Saturday. All desks and office chairs are twenty percent off, and delivery is free for purchases over five hundred dollars. The showroom will open one hour early at eight.',
    [['What event is advertised?',['A furniture sale','A job fair','A training seminar','A restaurant opening'],0],['Which items are discounted?',['Desks and office chairs','Computers and printers','Sofas only','Lighting equipment'],0],['What time will the showroom open?',['8:00','9:00','7:00','10:00'],0]]],
  ['Before we begin the factory tour, please put on the safety glasses provided at the entrance. Photography is allowed in the lobby but not on the production floor. The tour will last about forty-five minutes.',
    [['What must visitors wear?',['Safety glasses','Hard hats only','Uniforms','Name badges only'],0],['Where is photography allowed?',['In the lobby','On the production floor','Nowhere','In the warehouse only'],0],['How long will the tour last?',['About 45 minutes','About 15 minutes','Two hours','All day'],0]]],
  ['The public library is introducing a new reservation system next week. Study rooms can be booked up to seven days in advance through the library app. Reservations are limited to two hours per day.',
    [['What is being introduced?',['A room reservation system','A new café','A book sale','A parking fee'],0],['How far in advance can rooms be booked?',['Seven days','Two days','One month','The same day only'],0],['What is the daily limit?',['Two hours','Seven hours','Thirty minutes','Four hours'],0]]],
  ['Due to heavy rain, tonight’s outdoor concert will move to the Civic Hall. Doors open at six thirty and the performance begins at seven. Existing tickets remain valid, and no exchange is required.',
    [['Why is the concert moving?',['Heavy rain','Low ticket sales','A power failure','A schedule conflict'],0],['Where will it be held?',['Civic Hall','The original park','City Library','Riverside Theater'],0],['What must ticket holders do?',['Nothing; tickets remain valid','Exchange tickets','Pay an extra fee','Arrive before six'],0]]],
  ['The marketing workshop starts at ten in Room 402. Please bring a laptop because the afternoon session includes a hands-on analytics exercise. Printed workbooks will be provided at registration.',
    [['Where is the workshop?',['Room 402','Room 204','The lobby','Online'],0],['What should participants bring?',['A laptop','A printed workbook','A projector','Lunch'],0],['What will be provided?',['Printed workbooks','Laptops','Parking permits','Headphones'],0]]],
  ['The River Street branch will close at five today for scheduled electrical maintenance. Customers needing teller service after five may visit the Central Avenue branch, which remains open until seven thirty.',
    [['Why will the branch close early?',['Electrical maintenance','Staff training','A holiday','Weather'],0],['What service is mentioned?',['Teller service','Loan approval','Insurance claims','Currency delivery'],0],['How late is the Central Avenue branch open?',['7:30','5:00','6:00','8:30'],0]]],
]
const part4 = talkSets.flatMap(([audio,questions],setIndex)=>questions.map(([question,options,answer],qIndex)=>q(
  `t4-${String(setIndex*3+qIndex+1).padStart(2,'0')}`,4,'Talks',question,options,answer,{ audio }
)))

const part5Rows = [
  ['All employees must submit travel receipts _____ Monday.',['at','by','during','among'],1],
  ['Ms. Patel is responsible for _____ new staff members.',['train','trained','training','trains'],2],
  ['The new printer operates more _____ than the old model.',['efficient','efficiency','efficiently','efficiencies'],2],
  ['Please contact the manager _____ you have any questions.',['if','although','unless','despite'],0],
  ['The conference attracted _____ five hundred participants.',['nearly','near','nearest','nearness'],0],
  ['Neither the director nor the assistants _____ available today.',['is','are','was','be'],1],
  ['Customers may return unused items within thirty days of _____.',['purchase','purchased','purchasing','purchaser'],0],
  ['The marketing team has not _____ the final design yet.',['approve','approved','approving','approval'],1],
  ['The supplier promised to deliver the equipment _____ noon.',['by','between','among','during'],0],
  ['We were pleased _____ the positive customer feedback.',['receive','to receive','received','receiving'],1],
  ['The company will expand its warehouse _____ demand continues to grow.',['if','despite','because of','unless'],0],
  ['Mr. Diaz spoke _____ about the revised safety procedure.',['clear','clearly','clearness','clearest'],1],
  ['The annual report contains a _____ summary of last year’s results.',['brief','briefly','briefness','briefing'],0],
  ['Applicants should attach two references _____ their résumé.',['to','from','over','between'],0],
  ['Our office furniture is designed to be both durable _____ comfortable.',['and','but','or','so'],0],
  ['The technician will inspect the machine before it is _____.',['ship','shipping','shipped','shipment'],2],
  ['The training session was postponed _____ the instructor was ill.',['because','although','unless','despite'],0],
  ['The hotel offers a discount to guests who book _____ online.',['direct','directly','direction','directed'],1],
  ['Please review the contract _____ before signing it.',['care','careful','carefully','caring'],2],
  ['The committee has _____ a new chairperson for next year.',['select','selected','selection','selecting'],1],
  ['The updated software is compatible _____ most operating systems.',['with','for','by','at'],0],
  ['Employees are encouraged to submit _____ suggestions.',['they','their','them','theirs'],1],
  ['The store will remain open _____ the renovation work continues.',['while','because of','despite of','during'],0],
  ['A confirmation email will be sent _____ your registration is complete.',['once','until','during','among'],0],
  ['The manager requested that the document _____ revised immediately.',['is','be','was','being'],1],
  ['Sales increased _____ after the new campaign launched.',['significant','significantly','significance','signify'],1],
  ['The meeting room is large enough _____ twenty people.',['accommodate','to accommodate','accommodating','accommodated'],1],
  ['We apologize for any inconvenience _____ by the service interruption.',['cause','caused','causing','causes'],1],
  ['The proposal was rejected because it was not financially _____.',['feasible','feasibly','feasibility','feasibles'],0],
  ['Please notify reception _____ your visitor arrives.',['when','which','whose','what'],0],
]
const part5 = part5Rows.map(([question,options,answer],i)=>q(`t5-${String(i+1).padStart(2,'0')}`,5,'Incomplete Sentences',question,options,answer))

const part6Sets = [
  {
    title:'Email: Interview invitation',
    text:'Thank you for applying for the analyst position. We have reviewed your résumé and would like to (1) _____ you for an interview next Tuesday. The interview will begin at 10:00 A.M. and should (2) _____ about forty-five minutes. Please check in at reception when you arrive. (3) _____, bring one form of photo identification. If the proposed time is not convenient, contact us (4) _____ Friday.',
    items:[
      ['Blank (1)',['invite','invitation','inviting','invited'],0],
      ['Blank (2)',['last','lasting','lasted','lasts'],0],
      ['Blank (3)',['In addition','Instead','Nevertheless','Otherwise'],0],
      ['Blank (4)',['by','among','during','across'],0],
    ],
  },
  {
    title:'Notice: Café renovation',
    text:'The Riverside Café will be closed from June 3 through June 6 for kitchen repairs. During this period, employees may use the temporary café in Building B. It will (1) _____ breakfast and lunch from 7:30 A.M. to 2:00 P.M. The menu will be slightly (2) _____ because of limited cooking facilities. (3) _____, all prepaid meal cards will continue to be accepted. We appreciate your patience while the renovation is (4) _____.',
    items:[
      ['Blank (1)',['serve','service','served','serving'],0],
      ['Blank (2)',['reduce','reduced','reducing','reduction'],1],
      ['Blank (3)',['However','For example','Similarly','Therefore'],0],
      ['Blank (4)',['completed','completing','complete','completion'],0],
    ],
  },
  {
    title:'Memo: Software update',
    text:'A security update will be installed on all company laptops this weekend. Employees should save important files to the network drive before leaving on Friday. Computers that are not connected to the company network may not receive the update (1) _____. For that reason, please leave your laptop powered on and connected. The installation will begin automatically and (2) _____ no action from users. On Monday morning, you may be asked to restart your computer. If you experience any problems, (3) _____ the Help Desk. The update is expected to improve both security and system (4) _____.',
    items:[
      ['Blank (1)',['properly','proper','property','properness'],0],
      ['Blank (2)',['require','requires','required','requiring'],1],
      ['Blank (3)',['contact','contacts','contacted','contacting'],0],
      ['Blank (4)',['perform','performance','performed','performing'],1],
    ],
  },
  {
    title:'Announcement: Membership renewal',
    text:'Your fitness center membership will renew automatically on August 1. Members who wish to change plans should submit a request before July 25. Requests received after that date may not be processed (1) _____ the new billing cycle begins. You can update your plan through the member portal or speak with a representative at the front desk. (2) _____ you decide to cancel, any unused guest passes will expire on the final day of membership. We recommend reviewing your account details (3) _____ to avoid billing errors. Thank you for being a (4) _____ member.',
    items:[
      ['Blank (1)',['before','until','among','beside'],1],
      ['Blank (2)',['If','Although','Despite','Unless'],0],
      ['Blank (3)',['carefully','careful','care','caring'],0],
      ['Blank (4)',['value','valued','valuablely','valuation'],1],
    ],
  },
]
const part6 = part6Sets.flatMap((set,setIndex)=>set.items.map(([question,options,answer],itemIndex)=>q(
  `t6-${String(setIndex*4+itemIndex+1).padStart(2,'0')}`,6,'Text Completion',question,options,answer,{ passageTitle:set.title, passage:set.text }
)))

const part7Sets = [
  ['Parking Notice','The east parking lot will close from May 3 to May 5 for resurfacing. Employees should use the North Street entrance and park in the temporary lot behind Building C. Shuttle service will operate every fifteen minutes during peak hours.',
    [['Why will the east lot close?',['For resurfacing','For a festival','For a new building','For snow removal'],0],['Where should employees park?',['Behind Building C','On North Street','At the east lot','At the train station'],0],['How often will the shuttle operate during peak hours?',['Every 15 minutes','Every 5 minutes','Every hour','Twice daily'],0]]],
  ['Shipping Email','Your replacement monitor has shipped and is expected on Tuesday. A prepaid label is included in the package for returning the faulty unit. Please return the old monitor within ten business days to avoid an equipment charge.',
    [['When is the new monitor expected?',['Tuesday','Monday','Friday','Next month'],0],['Why is a prepaid label included?',['To return a faulty unit','To identify the new monitor','To pay customs fees','To extend the warranty'],0],['What happens if the old monitor is returned late?',['An equipment charge may apply','The new monitor is canceled','The warranty doubles','A technician visits'],0]]],
  ['Fitness Advertisement','Join the Lakeside Fitness Center before June 1 and pay no registration fee. Monthly membership includes all group classes and access to the swimming pool. Personal training sessions are available for an additional charge.',
    [['What is waived for new members?',['The registration fee','The first month','Personal training','Pool access'],0],['What is included in monthly membership?',['Group classes and pool access','Personal training only','Parking','Sports equipment'],0],['What costs extra?',['Personal training','Group classes','Pool access','Registration'],0]]],
  ['Expense Memo','To reduce paper use, expense reports must be submitted through the employee portal beginning next month. Original receipts should be scanned and attached to the online form. Managers will continue to approve expenses using the same schedule.',
    [['What is the purpose of the change?',['To reduce paper use','To change managers','To shorten trips','To update salaries'],0],['What should employees do with receipts?',['Scan and attach them','Mail them','Discard them','Give them to security'],0],['What will remain the same?',['The approval schedule','The portal','The receipt format','The travel policy'],0]]],
  ['Hotel Confirmation','Your reservation at Harbor View Hotel is confirmed for September 12–14. Breakfast is included, and check-in begins at 3:00 P.M. Guests arriving earlier may store luggage at reception free of charge.',
    [['How many nights is the reservation?',['Two','One','Three','Four'],0],['What is included?',['Breakfast','Airport transfer','Dinner','Parking'],0],['What can early guests do?',['Store luggage','Check in at noon','Use a free taxi','Change rooms'],0]]],
  ['Training Announcement','The customer service workshop has moved from Room 210 to Room 415 because attendance exceeded expectations. The session still starts at 9:00 A.M. Participants should bring the workbook emailed last week.',
    [['Why was the room changed?',['More people are attending','The original room is being painted','The instructor is late','The building is closed'],0],['What time does the workshop begin?',['9:00 A.M.','4:15 P.M.','10:00 A.M.','8:00 A.M.'],0],['What should participants bring?',['A workbook','A laptop','Lunch','An ID card'],0]]],
  ['Library Message','Your requested book is now available at the Central Library service desk. It will be held until Thursday evening. Please bring your library card when collecting the item.',
    [['Why was the message sent?',['A requested book is ready','A library card expired','A fine is due','The library is moving'],0],['How long will the book be held?',['Until Thursday evening','For one month','Until Monday morning','Only today'],0],['What should the reader bring?',['A library card','Cash','A receipt','A passport'],0]]],
  ['Supplier Email','We can deliver 120 units by the original deadline, but the remaining 80 will require an additional three days. If a partial shipment is acceptable, please confirm by 4:00 P.M. today so we can reserve a truck.',
    [['How many units can arrive on time?',['120','80','200','40'],0],['How much longer are the remaining units expected to take?',['Three days','One day','One week','Two weeks'],0],['Why must the customer respond by 4:00?',['To reserve a truck','To change the price','To cancel the order','To request samples'],0]]],
  ['Museum Brochure','The Maritime Museum opens daily at 10:00 A.M. Guided tours are offered at 11:30 and 2:30. Admission is free for children under twelve when accompanied by a paying adult.',
    [['When does the museum open?',['10:00 A.M.','11:30 A.M.','2:30 P.M.','9:00 A.M.'],0],['How many guided tour times are listed?',['Two','One','Three','Four'],0],['Who may enter free?',['Children under twelve with a paying adult','All students','Adults over sixty','Tour groups'],0]]],
  ['Office Renovation','The fourth-floor break room will be unavailable next week while new flooring is installed. Employees may use the break room on the second floor. Refrigerators on the fourth floor must be emptied by Friday at 5:00 P.M.',
    [['Why will the room be unavailable?',['New flooring is being installed','New staff are arriving','A meeting is scheduled','Furniture is being sold'],0],['Which break room can employees use?',['The second-floor room','The lobby','The cafeteria only','The fifth-floor room'],0],['What must happen by Friday at 5:00?',['Refrigerators must be emptied','The flooring must be finished','Employees must leave','A meeting must end'],0]]],
  ['Conference Schedule','Registration opens at 8:00 A.M. in the main lobby. The keynote begins at 9:00 in Hall A, followed by three parallel sessions at 10:30. Lunch will be served in the garden restaurant.',
    [['Where does registration take place?',['The main lobby','Hall A','The garden restaurant','Online'],0],['What begins at 9:00?',['The keynote','Lunch','Registration','Parallel sessions'],0],['Where will lunch be served?',['The garden restaurant','Hall A','The lobby','Room 103'],0]]],
  ['Bank Notice','Starting July 1, the Oak Street branch will open thirty minutes earlier on weekdays. Saturday hours will remain unchanged. Customers can find updated hours on the mobile app and website.',
    [['What changes on July 1?',['Weekday opening time','Saturday closing time','The branch address','ATM fees'],0],['What stays unchanged?',['Saturday hours','Weekday hours','The website','The mobile app'],0],['Where can customers find current hours?',['The app and website','Only at the branch','On receipts','By mail only'],0]]],
  ['Restaurant Reservation','Your table for six is confirmed for 7:30 P.M. on Friday. Please contact us if your party size changes. We can hold the table for fifteen minutes after the reservation time.',
    [['How many people is the table for?',['Six','Seven','Fifteen','Thirty'],0],['What should the customer report?',['A change in party size','A menu choice','A parking request','A birthday'],0],['How long will the table be held?',['15 minutes','30 minutes','One hour','All evening'],0]]],
  ['Job Posting','Northstar Media seeks a project coordinator with at least two years of experience. Applicants should submit a résumé and cover letter by October 15. Experience with scheduling software is preferred but not required.',
    [['What position is advertised?',['Project coordinator','Graphic designer','Accountant','Sales manager'],0],['What is the application deadline?',['October 15','October 5','November 15','September 15'],0],['What is preferred but not required?',['Scheduling software experience','A cover letter','Two years of experience','A résumé'],0]]],
  ['Product Recall','Customers who purchased Model X electric kettles between January and March should stop using them immediately. A replacement can be requested online using the serial number printed on the bottom of the kettle.',
    [['What product is affected?',['Model X electric kettles','Coffee makers','Toasters','Microwaves'],0],['What should customers do first?',['Stop using the product','Mail the receipt','Visit a store','Remove the serial number'],0],['What information is needed online?',['The serial number','A passport number','A credit score','A store coupon'],0]]],
  ['Course Email','Your registration for Advanced Excel has been accepted. The course meets on Tuesdays for four weeks, beginning August 6. Please complete the online introduction module before the first class.',
    [['How long does the course run?',['Four weeks','One week','Six weeks','Two months'],0],['On which day does the class meet?',['Tuesday','Monday','Thursday','Saturday'],0],['What must be done before the first class?',['Complete an online module','Buy a laptop','Take a final exam','Visit the instructor'],0]]],
  ['Delivery Update','Because of a mechanical issue, today’s Route 8 deliveries will arrive approximately two hours later than planned. Drivers will contact customers by phone shortly before arrival. No action is required to keep the existing delivery appointment.',
    [['Why are deliveries delayed?',['A mechanical issue','Heavy traffic only','A weather warning','A staff meeting'],0],['How will customers be contacted?',['By phone','By mail','By video call','By text only'],0],['What must customers do to keep the appointment?',['Nothing','Confirm online','Call the driver','Pay a fee'],0]]],
  ['Community Event','Volunteers are needed for Saturday’s river cleanup. Gloves and trash bags will be provided, but participants should bring water and wear closed-toe shoes. Check-in begins at 8:30 near the south bridge.',
    [['What event is being organized?',['A river cleanup','A road race','A market','A concert'],0],['What should participants bring?',['Water','Gloves','Trash bags','Tools'],0],['Where does check-in begin?',['Near the south bridge','At city hall','At the north parking lot','Inside a school'],0]]],
]
const part7 = part7Sets.flatMap(([title,text,items],setIndex)=>items.map(([question,options,answer],itemIndex)=>q(
  `t7-${String(setIndex*3+itemIndex+1).padStart(2,'0')}`,7,'Reading Comprehension',question,options,answer,{ passageTitle:title, passage:text }
)))

const balanceChoicePositions = (items) => items.map((item,index) => {
  if (!item.options?.length || !Number.isInteger(item.answer)) return item
  const shift = index % item.options.length
  if (!shift) return item
  const options = [...item.options.slice(shift),...item.options.slice(0,shift)]
  const answer = (item.answer - shift + item.options.length) % item.options.length
  return { ...item,options,answer }
})

const listeningQuestions = balanceChoicePositions([...part1,...part2,...part3,...part4])
const readingQuestions = balanceChoicePositions([...part5,...part6,...part7])

export const toeicFullSections = [
  { id:'toeic-listening', label:'Listening', duration:45*60, questions:listeningQuestions },
  { id:'toeic-reading', label:'Reading', duration:75*60, questions:readingQuestions },
]

export const toeicFullStats = {
  total:listeningQuestions.length + readingQuestions.length,
  listening:listeningQuestions.length,
  reading:readingQuestions.length,
  parts:{
    1:part1.length,2:part2.length,3:part3.length,4:part4.length,
    5:part5.length,6:part6.length,7:part7.length,
  },
}

export function estimatedToeicSectionScore(raw) {
  return Math.max(5, Math.min(495, Math.round((5 + (Math.max(0, Math.min(100, raw)) / 100) * 490) / 5) * 5))
}

export function buildToeicFullResult({ answers, sections, elapsed }) {
  const [listening,reading] = sections
  const countCorrect = (items) => items.filter((item) => answers[item.id] === item.answer).length
  const listeningCorrect = countCorrect(listening.questions)
  const readingCorrect = countCorrect(reading.questions)
  const listeningScore = estimatedToeicSectionScore(listeningCorrect)
  const readingScore = estimatedToeicSectionScore(readingCorrect)
  const unanswered = [...listening.questions,...reading.questions].filter((item) => answers[item.id] === undefined).length
  return {
    type:'Full Test',
    score:listeningScore + readingScore,
    listeningScore,
    readingScore,
    listeningCorrect,
    readingCorrect,
    correct:listeningCorrect + readingCorrect,
    wrong:200 - listeningCorrect - readingCorrect - unanswered,
    unanswered,
    accuracy:Math.round((listeningCorrect + readingCorrect) / 200 * 100),
    timeUsed:(elapsed[listening.id] || 0) + (elapsed[reading.id] || 0),
    weakTopics:[
      listeningCorrect < 70 ? 'Listening' : null,
      readingCorrect < 70 ? 'Reading' : null,
    ].filter(Boolean),
  }
}

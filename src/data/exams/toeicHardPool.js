const q = (id, part, type, question, options, answer, extra = {}) => ({ id, part, type, question, options, answer, difficulty:'hard', ...extra })

export const toeicHardPart1 = [
  q('th1-01',1,'Photographs','Which statement best describes the scene?',['A technician is fastening a panel beneath a counter.','Several customers are queuing beside a counter.','The shelves have been removed from the wall.','A package is being weighed on a scale.'],0,{audio:'A technician is fastening a panel beneath a counter while tools are spread nearby.'}),
  q('th1-02',1,'Photographs','Which statement best describes the scene?',['Some chairs have been arranged in rows facing a stage.','A speaker is carrying chairs out of a hall.','Curtains are being folded on the floor.','Several tables are covered with documents.'],0,{audio:'Some chairs have been arranged in rows facing a small stage.'}),
  q('th1-03',1,'Photographs','Which statement best describes the scene?',['A delivery van is being loaded beside a warehouse.','Workers are repairing the roof of a warehouse.','Several boxes have been opened on a sidewalk.','The loading area is completely empty.'],0,{audio:'A delivery van is being loaded beside a warehouse entrance.'}),
  q('th1-04',1,'Photographs','Which statement best describes the scene?',['A pedestrian is examining a map near an intersection.','A traffic signal is being replaced by a worker.','Several cyclists are crossing a bridge.','A bus is pulling into an underground terminal.'],0,{audio:'A pedestrian is examining a map near an intersection.'}),
]

export const toeicHardPart2 = [
  q('th2-01',2,'Question–Response','Choose the best response.',['It was sent with the revised invoice.','Not until the finance director signs it.','The signature is difficult to read.'],1,{audio:'Has the reimbursement request been approved yet?'}),
  q('th2-02',2,'Question–Response','Choose the best response.',['I thought Lena was presenting that section.','The figures were revised last quarter.','Near the end of the hallway.'],0,{audio:'Who is going over the sales projections at the meeting?'}),
  q('th2-03',2,'Question–Response','Choose the best response.',['Only if the replacement arrives this morning.','The warranty lasts for two years.','Yes, the technician was very polite.'],0,{audio:'Can we still ship the order today?'}),
  q('th2-04',2,'Question–Response','Choose the best response.',['No, the branch on King Street has one in stock.','It was displayed near the entrance.','The supplier increased the price.'],0,{audio:'Do we need to back-order this model?'}),
  q('th2-05',2,'Question–Response','Choose the best response.',['The legal team suggested a few changes.','On the shelf beside the printer.','A contract for office furniture.'],0,{audio:'Why hasn’t the agreement been finalized?'}),
  q('th2-06',2,'Question–Response','Choose the best response.',['I can cover it until she returns.','The front desk closes at six.','Her office is on the third floor.'],0,{audio:'Mina is out of the office again today, isn’t she?'}),
  q('th2-07',2,'Question–Response','Choose the best response.',['I already forwarded it to everyone.','The schedule was printed in color.','About forty-five minutes.'],0,{audio:'Would you mind sending the updated agenda around?'}),
  q('th2-08',2,'Question–Response','Choose the best response.',['They moved the deadline to the twenty-eighth.','The design team sits upstairs.','It has three attachments.'],0,{audio:'When are the final mock-ups due?'}),
  q('th2-09',2,'Question–Response','Choose the best response.',['A larger room became available.','Yes, I attended it last year.','At the registration desk.'],0,{audio:'Why was the workshop relocated?'}),
  q('th2-10',2,'Question–Response','Choose the best response.',['Not unless the courier has already left.','I left the package at reception.','By express delivery.'],0,{audio:'Is it too late to add another parcel to today’s shipment?'}),
]

export const toeicHardPart3Sets = [
  {
    id:'th3-a',
    audio:'Woman: The vendor says the replacement sensors can arrive Friday, but only if we confirm the order before noon. Man: That is later than we planned. The calibration team is booked for Friday morning. Woman: I can ask them to move the appointment to the afternoon. Man: Do that first, then I will authorize the purchase.',
    questions:[
      q('th3-01',3,'Conversations','What problem are the speakers discussing?',['The replacement parts may arrive later than planned.','The calibration team ordered the wrong sensors.','The vendor changed the purchase price.','The Friday appointment has been canceled.'],0),
      q('th3-02',3,'Conversations','What does the woman offer to do?',['Reschedule a technical appointment.','Request a lower purchase price.','Install the sensors herself.','Cancel the order.'],0),
      q('th3-03',3,'Conversations','What will the man probably do after the woman acts?',['Approve the purchase.','Call the calibration team.','Return the sensors.','Move the delivery to Monday.'],0),
    ],
  },
  {
    id:'th3-b',
    audio:'Man: I noticed our booth number is different in the conference app. Woman: Yes, the organizers moved us closer to the main entrance because another exhibitor withdrew. Man: That could mean more traffic. Should we print a new floor map for the staff? Woman: I already sent everyone the updated map this morning.',
    questions:[
      q('th3-04',3,'Conversations','Why was the company’s booth moved?',['Another exhibitor canceled.','The company requested a larger booth.','The entrance is being renovated.','The conference app contained an error.'],0),
      q('th3-05',3,'Conversations','What advantage does the man mention?',['More visitors may pass the booth.','The booth will cost less.','Staff will have more storage space.','The event will open earlier.'],0),
      q('th3-06',3,'Conversations','What has the woman already done?',['Distributed an updated map.','Printed new booth signs.','Contacted the former exhibitor.','Changed the conference schedule.'],0),
    ],
  },
  {
    id:'th3-c',
    audio:'Woman: The client approved the video script, but they want captions in both French and Spanish. Man: That will add at least a day to post-production. The campaign launches on Thursday. Woman: I know. I have asked the translator to send the French version tonight, and the Spanish file should arrive tomorrow morning.',
    questions:[
      q('th3-07',3,'Conversations','What additional work did the client request?',['Captions in two languages.','A shorter advertising script.','New background music.','A different launch date.'],0),
      q('th3-08',3,'Conversations','What concern does the man express?',['The extra work may affect the schedule.','The translator is unavailable.','The script has not been approved.','The campaign budget was reduced.'],0),
      q('th3-09',3,'Conversations','When is the Spanish material expected?',['Tomorrow morning.','Tonight.','Thursday afternoon.','Next week.'],0),
    ],
  },
  {
    id:'th3-d',
    audio:'Man: The occupancy report shows that weekend bookings are strong, but weekday rooms are still below target. Woman: The convention center across town has several events next month. We could offer attendees a weekday rate. Man: Good idea. Check whether the shuttle company can add an evening run as part of the package.',
    questions:[
      q('th3-10',3,'Conversations','What does the report indicate?',['Weekday bookings need improvement.','Weekend prices are too low.','The hotel has too few rooms.','The convention center is closing.'],0),
      q('th3-11',3,'Conversations','What does the woman suggest?',['A special rate for event attendees.','Reducing weekend availability.','Moving guests to another hotel.','Canceling the shuttle service.'],0),
      q('th3-12',3,'Conversations','What is the man asking the woman to investigate?',['Additional evening transportation.','Convention ticket prices.','A new room category.','A later checkout policy.'],0),
    ],
  },
]

export const toeicHardPart4Sets = [
  {
    id:'th4-a',
    audio:'Good afternoon. This message is for passengers booked on the 4:20 ferry to Harbor Island. Because the vessel assigned to that departure requires an unexpected inspection, passengers will instead leave on the 4:45 ferry from Pier 6. Your original tickets remain valid. Travelers with checked bicycles should report to the loading desk no later than 4:15.',
    questions:[
      q('th4-01',4,'Talks','Why is the original departure changing?',['A vessel needs an inspection.','The weather has worsened.','Pier 6 is temporarily closed.','Too many passengers booked the ferry.'],0),
      q('th4-02',4,'Talks','What are passengers told about their tickets?',['They can use the same tickets.','They must exchange them at Pier 6.','They will receive a partial refund.','They should print new tickets.'],0),
      q('th4-03',4,'Talks','Who must arrive at the loading desk by 4:15?',['Passengers checking bicycles.','Passengers without luggage.','Harbor Island residents.','Travelers buying tickets.'],0),
    ],
  },
  {
    id:'th4-b',
    audio:'Before tomorrow’s inventory count begins, each department should finish processing any returns currently waiting in the stockroom. The count starts at seven thirty, and no items may be moved between departments once it is underway. Team leaders should collect barcode scanners from the security desk tonight and verify that the batteries are fully charged.',
    questions:[
      q('th4-04',4,'Talks','What should be completed before the inventory count?',['Pending returns should be processed.','All stock should be moved upstairs.','New scanners should be ordered.','Security forms should be signed.'],0),
      q('th4-05',4,'Talks','What restriction applies after the count starts?',['Items cannot be transferred between departments.','Employees cannot enter the stockroom.','Barcode scanners cannot be used.','Returns cannot be recorded electronically.'],0),
      q('th4-06',4,'Talks','What are team leaders asked to check?',['Scanner battery levels.','Department schedules.','Return prices.','Security desk hours.'],0),
    ],
  },
  {
    id:'th4-c',
    audio:'Welcome to the Lakeshore Design Forum. The keynote in Auditorium A will begin ten minutes later than scheduled because the speaker’s train was delayed. Meanwhile, the product demonstration in Studio 3 will start on time at ten fifteen. Anyone registered for both sessions may collect a recording of the demonstration from the media desk after lunch.',
    questions:[
      q('th4-07',4,'Talks','Why will the keynote begin late?',['The speaker was delayed while traveling.','The auditorium equipment failed.','Registration took longer than expected.','A demonstration ran overtime.'],0),
      q('th4-08',4,'Talks','Which event will begin at 10:15 as planned?',['The product demonstration.','The keynote.','Lunch service.','The media briefing.'],0),
      q('th4-09',4,'Talks','What can some attendees obtain later?',['A recording of a session.','A refund for registration.','A printed train schedule.','A new admission badge.'],0),
    ],
  },
  {
    id:'th4-d',
    audio:'This quarter, our customer survey response rate increased to sixty-two percent, but the number of completed comments fell. Beginning Monday, the final survey screen will therefore include a shorter optional comment box. We will compare completion rates for six weeks before deciding whether to keep the change permanently.',
    questions:[
      q('th4-10',4,'Talks','What changed despite a higher survey response rate?',['Fewer written comments were completed.','Customers gave lower overall ratings.','The survey contained fewer questions.','The response deadline was extended.'],0),
      q('th4-11',4,'Talks','What will be changed on Monday?',['The optional comment field.','The customer rating scale.','The survey distribution list.','The reporting software.'],0),
      q('th4-12',4,'Talks','Why will data be reviewed after six weeks?',['To decide whether the change should remain.','To select a survey vendor.','To determine employee bonuses.','To remove the survey entirely.'],0),
    ],
  },
]

export const toeicHardPart5 = [
  q('th5-01',5,'Incomplete Sentences','The committee requested that the revised proposal _____ before the end of the week.',['submit','be submitted','submitted','is submitting'],1),
  q('th5-02',5,'Incomplete Sentences','Only after the inspection was completed _____ the technicians restart the equipment.',['were','did','had','have'],1),
  q('th5-03',5,'Incomplete Sentences','The consultant’s recommendations were considered highly _____ to the company’s expansion strategy.',['relevance','relevantly','relevant','relate'],2),
  q('th5-04',5,'Incomplete Sentences','The shipment will be released once customs officials _____ the accompanying documents.',['verify','will verify','verified','are verifying'],0),
  q('th5-05',5,'Incomplete Sentences','The software update is expected to reduce processing time without _____ system reliability.',['compromise','compromised','compromising','compromises'],2),
  q('th5-06',5,'Incomplete Sentences','No sooner had the announcement been made _____ several employees requested additional details.',['than','when','that','while'],0),
  q('th5-07',5,'Incomplete Sentences','The board postponed its decision, citing information that was not sufficiently _____ to support the forecast.',['conclude','conclusive','conclusively','conclusion'],1),
  q('th5-08',5,'Incomplete Sentences','Ms. Huang will lead the negotiations in the director’s absence, _____ she has handled similar contracts before.',['given that','despite','unless','whereas'],0),
  q('th5-09',5,'Incomplete Sentences','The warehouse expansion was completed ahead of schedule, _____ several weeks of unusually heavy rain.',['despite','because','although','in case'],0),
  q('th5-10',5,'Incomplete Sentences','Applicants are advised to retain a copy of every document _____ through the online portal.',['submitting','submitted','submission','submits'],1),
  q('th5-11',5,'Incomplete Sentences','The revised policy applies to contractors as well as to employees, _____ of their work location.',['regardless','instead','otherwise','accordingly'],0),
  q('th5-12',5,'Incomplete Sentences','Production cannot resume until the damaged valve has been replaced and the pressure system _____.',['retests','has retested','has been retested','is retesting'],2),
  q('th5-13',5,'Incomplete Sentences','The research team found the new material to be considerably more durable than _____ tested previously.',['those','that','them','which'],0),
  q('th5-14',5,'Incomplete Sentences','Had the supplier notified us earlier, we _____ an alternative delivery schedule.',['arrange','would arrange','could have arranged','had arranged'],2),
  q('th5-15',5,'Incomplete Sentences','The finance department requires receipts for any expense _____ exceeds fifty dollars.',['who','whose','that','where'],2),
]

export const toeicHardPart6Sets = [
  {
    id:'th6-a',
    title:'Internal memo: Data migration',
    text:'Next Saturday, the customer database will be migrated to the new hosting environment. Staff should complete all pending profile updates by Friday at 6:00 P.M. During the migration, records will remain viewable but cannot be edited. The technical team expects normal access to resume by Sunday afternoon. Employees should avoid creating offline copies of customer files, since those copies may become outdated before the migration is complete.',
    items:[
      q('th6-01',6,'Text Completion','Staff should complete pending profile updates _____ Friday at 6:00 P.M.',['by','during','since','among'],0),
      q('th6-02',6,'Text Completion','During the migration, records will remain viewable but cannot be _____.',['editing','edited','editor','edits'],1),
      q('th6-03',6,'Text Completion','Normal access is expected to _____ by Sunday afternoon.',['resume','resumption','resumed','resuming'],0),
      q('th6-04',6,'Text Completion','Offline copies are discouraged _____ they may quickly become outdated.',['because','despite','unless','whereas'],0),
    ],
  },
  {
    id:'th6-b',
    title:'Client notice: Service-level review',
    text:'As part of our annual service review, we are asking clients to verify the list of authorized contacts associated with their accounts. Requests submitted by individuals who are not on the approved list may be delayed while identity checks are completed. To prevent interruptions, please review the attached contact sheet and return any corrections by November 8. If no changes are needed, no response is required.',
    items:[
      q('th6-05',6,'Text Completion','Clients are being asked to _____ their authorized contacts.',['verification','verify','verified','verifying'],1),
      q('th6-06',6,'Text Completion','Unrecognized requests may be delayed _____ identity checks are completed.',['while','despite','unless','beside'],0),
      q('th6-07',6,'Text Completion','Corrections should be returned _____ November 8.',['by','through','between','among'],0),
      q('th6-08',6,'Text Completion','Clients whose information is already accurate _____ respond.',['must not','need not','would not','could not'],1),
    ],
  },
  {
    id:'th6-c',
    title:'Announcement: Leadership program',
    text:'Applications are now open for the company’s six-month leadership development program. Participants will attend monthly workshops, complete a cross-department project, and meet regularly with a senior mentor. Managers may nominate employees, but candidates must submit their own statement explaining how the program supports their professional goals. Because places are limited, applications will be evaluated on both experience and the clarity of the proposed development plan.',
    items:[
      q('th6-09',6,'Text Completion','The program is designed to _____ over six months.',['run','running','ran','runs'],0),
      q('th6-10',6,'Text Completion','Candidates must submit a statement _____ their professional goals.',['explain','explaining','explained','explanation'],1),
      q('th6-11',6,'Text Completion','_____ managers may nominate employees, candidates submit their own statements.',['Although','Because of','Unless','Therefore'],0),
      q('th6-12',6,'Text Completion','Applications will be judged partly on the _____ of the proposed plan.',['clear','clearly','clarity','clarify'],2),
    ],
  },
]

export const toeicHardPart7Sets = [
  {
    id:'th7-a',
    title:'Double passage: Vendor notice + manager email',
    passage:[
      'VENDOR NOTICE — Beginning March 1, Northline Office Supply will consolidate Tuesday and Thursday deliveries into a single Wednesday route for customers in the Riverside district. Orders confirmed by 3:00 P.M. Tuesday will qualify for Wednesday delivery. Emergency same-day courier service will remain available for an additional fee.',
      'MANAGER EMAIL — Team, because our regular Thursday delivery is being discontinued, please submit routine supply requests by noon Tuesday so Purchasing has time to combine them. Do not use the emergency courier unless a delay would interrupt client service. — Elena',
    ],
    questions:[
      q('th7-01',7,'Reading Comprehension','What change is Northline making?',['Combining two weekly delivery days into one.','Closing its Riverside warehouse.','Eliminating courier service.','Moving all orders to Friday.'],0),
      q('th7-02',7,'Reading Comprehension','Why does Elena ask employees to submit requests by noon Tuesday?',['To give Purchasing time to consolidate orders.','To qualify for a courier discount.','To avoid ordering from Northline.','To receive deliveries on Tuesday.'],0),
      q('th7-03',7,'Reading Comprehension','Under what condition should employees use the emergency courier?',['When waiting would disrupt client service.','Whenever an order is placed after noon.','For every Riverside delivery.','Only for personal purchases.'],0),
    ],
  },
  {
    id:'th7-b',
    title:'Triple passage: Conference agenda + venue message + attendee email',
    passage:[
      'AGENDA — 9:00 Keynote, Hall A. 10:30 Breakout sessions. 12:00 Lunch. 1:30 Supplier Roundtable, Room 4B. 3:00 Closing panel, Hall A.',
      'VENUE MESSAGE — Due to maintenance on the fourth-floor ventilation system, all events scheduled in Room 4B tomorrow will move to Room 2C. Directional signs will be posted near the elevators.',
      'ATTENDEE EMAIL — Priya, I can join you for the supplier session after lunch, but I need to leave before the closing panel to catch the 3:20 train. Please save me a seat near the aisle. — Marcus',
    ],
    questions:[
      q('th7-04',7,'Reading Comprehension','Where will the supplier roundtable take place?',['Room 2C.','Room 4B.','Hall A.','Near the elevators.'],0),
      q('th7-05',7,'Reading Comprehension','Why will Marcus miss the final event?',['He needs to catch a train.','He has a supplier meeting elsewhere.','The venue is under maintenance.','He must attend lunch off-site.'],0),
      q('th7-06',7,'Reading Comprehension','What request does Marcus make?',['Reserve a seat near an aisle.','Send him the keynote recording.','Change the roundtable time.','Meet him at the station.'],0),
    ],
  },
  {
    id:'th7-c',
    title:'Double passage: Product bulletin + retailer reply',
    passage:[
      'PRODUCT BULLETIN — The MX-4 portable scanner now ships with firmware version 3.2. Units manufactured before August can be updated through the support portal. Version 3.2 improves battery reporting and compatibility with encrypted QR codes; it does not change scanning speed.',
      'RETAILER REPLY — We have twelve MX-4 units from July in our demonstration inventory. Please confirm whether updating them will preserve our custom device settings. If so, we plan to install version 3.2 before next week’s sales training.',
    ],
    questions:[
      q('th7-07',7,'Reading Comprehension','Which improvement is included in version 3.2?',['Better reporting of battery status.','Faster scanning speed.','A larger display.','Automatic hardware replacement.'],0),
      q('th7-08',7,'Reading Comprehension','What does the retailer want to know before updating?',['Whether customized settings will remain.','Whether the scanners were built in August.','Whether the update changes the screen size.','Whether training can be postponed.'],0),
      q('th7-09',7,'Reading Comprehension','Why does the retailer want to update the devices soon?',['A sales training session is approaching.','The support portal is closing.','The batteries have failed.','Customers requested refunds.'],0),
    ],
  },
  {
    id:'th7-d',
    title:'Triple passage: Job post + interview invitation + candidate note',
    passage:[
      'JOB POST — Operations Analyst. Requirements: two years of analytics experience, advanced spreadsheet skills, and availability for occasional evening system releases. Familiarity with SQL is preferred.',
      'INTERVIEW INVITATION — Your interview is scheduled for Tuesday at 10:30 A.M. Please prepare a ten-minute explanation of a process improvement you have led. The final fifteen minutes will include a spreadsheet exercise.',
      'CANDIDATE NOTE — I will use the warehouse forecasting project for the presentation because it reduced late shipments by 18 percent. I should also review pivot tables before Tuesday. My SQL experience is limited to the online course I completed last year.',
    ],
    questions:[
      q('th7-10',7,'Reading Comprehension','Which requirement will be directly tested during the interview?',['Spreadsheet skills.','Evening availability.','SQL programming.','Two years of employment history.'],0),
      q('th7-11',7,'Reading Comprehension','What will the candidate discuss in the presentation?',['A warehouse forecasting improvement.','An online SQL course.','A new evening release schedule.','A hiring process redesign.'],0),
      q('th7-12',7,'Reading Comprehension','Which qualification is described as preferred rather than required?',['SQL familiarity.','Spreadsheet skills.','Analytics experience.','Availability for some evenings.'],0),
    ],
  },
  {
    id:'th7-e',
    title:'Double passage: Hotel policy + guest message',
    passage:[
      'HOTEL POLICY — Reservations may be canceled without charge until 6:00 P.M. local time two days before arrival. Later cancellations are charged one night’s room rate. Guests who shorten a stay after check-in should notify reception before noon on the day before their revised departure.',
      'GUEST MESSAGE — I am due to arrive Thursday and stay through Monday, but my Sunday meeting was canceled. If I leave Sunday morning instead, please let me know when I must notify the front desk to avoid any additional charge.',
    ],
    questions:[
      q('th7-13',7,'Reading Comprehension','What change does the guest want to make?',['Leave one day earlier.','Arrive one day later.','Cancel the entire reservation.','Add another night.'],0),
      q('th7-14',7,'Reading Comprehension','By when should the guest notify reception about the shorter stay?',['Before noon Saturday.','Before 6:00 P.M. Tuesday.','Thursday morning.','After checking out Sunday.'],0),
      q('th7-15',7,'Reading Comprehension','What fee applies to a late cancellation of the whole reservation?',['One night’s room rate.','The entire stay.','A fixed processing fee.','No fee.'],0),
    ],
  },
  {
    id:'th7-f',
    title:'Triple passage: Service ticket + technician note + customer reply',
    passage:[
      'SERVICE TICKET — Printer P-17: intermittent paper-feed error. User reports problem mainly with heavy stock. Standard paper usually feeds normally.',
      'TECHNICIAN NOTE — Rollers show moderate wear but are still within tolerance. Updated feed calibration and tested twenty sheets of standard paper successfully. Heavy stock failed twice. Recommend replacing the pickup assembly if the client regularly prints on material above 160 gsm.',
      'CUSTOMER REPLY — Most of our jobs use 120 gsm paper, but we print event invitations on 200 gsm stock about twice a month. Please send an estimate for the recommended repair rather than replacing the printer.',
    ],
    questions:[
      q('th7-16',7,'Reading Comprehension','When is the printer problem most likely to occur?',['When heavier paper is used.','When standard paper is loaded.','Only after the rollers are replaced.','Whenever calibration is updated.'],0),
      q('th7-17',7,'Reading Comprehension','What does the technician recommend under certain usage conditions?',['Replacing the pickup assembly.','Replacing the entire printer immediately.','Using only paper below 120 gsm.','Disabling feed calibration.'],0),
      q('th7-18',7,'Reading Comprehension','What does the customer request next?',['A repair estimate.','A replacement printer.','A refund for paper stock.','A new calibration test.'],0),
    ],
  },
]

import { toeicFullSections } from './toeicFull.js'
import { createExamRandom, examFormId, grouped, sample, shuffled, stampQuestions } from './examRandom.js'

const q = (id, part, type, question, options, answer, extra = {}) => ({ id, part, type, question, options, answer, ...extra })
const base = toeicFullSections.flatMap((section) => section.questions)
const basePart = (part) => base.filter((item) => item.part === part)
const baseGroups = (part, keyFor) => grouped(basePart(part), keyFor)
const audioOnlyPart2 = (item) => ({
  ...item,
  audioOnlyChoices:true,
  choiceLabelsOnly:true,
  audio:`${item.audio} ${item.options.map((option,index)=>`Choice ${String.fromCharCode(65+index)}. ${option}`).join(' ')}`,
})

const part1Bank = [
  ['Two employees are reviewing information displayed on a wall.','Several chairs are being carried out of the room.','A woman is plugging a projector into the ceiling.','The conference table has been covered with boxes.'],
  ['A worker is fastening a sign above a doorway.','Some crates have been stacked beside a loading bay.','A delivery truck is being washed.','Customers are waiting inside a ticket office.'],
  ['The shelves are being restocked by several customers.','A ladder has been placed next to a display.','Merchandise is arranged on both sides of an aisle.','A cashier is closing the store entrance.'],
  ['The tables have been set for a meal.','A server is collecting menus from diners.','The outdoor chairs are being folded.','A row of umbrellas is shading empty tables.'],
  ['A technician is examining equipment mounted on a wall.','The man is carrying a toolbox down a staircase.','Several monitors are being packed for shipment.','A maintenance worker is sweeping the corridor.'],
  ['Some passengers are lining up beside a counter.','A suitcase is being placed on a conveyor belt.','The information screens have been switched off.','Several people are seated beneath departure displays.'],
  ['A bicycle has been secured to a railing.','The pedestrian is repairing a bicycle tire.','Several bicycles are being loaded into a vehicle.','A railing is being painted beside the road.'],
  ['Workers are moving furniture through a doorway.','A stack of chairs is blocking an entrance.','Some office furniture has been arranged near large windows.','The windows are being covered with curtains.'],
  ['A chef is slicing vegetables at a preparation counter.','Several trays are being removed from an oven.','The kitchen staff are standing near the dining area.','A cutting board has been stored above the sink.'],
  ['A boat is being pulled onto the shore.','Several boats are tied alongside a dock.','People are boarding a ferry from a ramp.','A dock is under construction.'],
].map((options,index) => {
  const answers=[0,1,2,3,0,3,0,2,0,1]
  const scenes=[
    'In a glass-walled meeting room, two employees stand beside a conference table. One points toward a wall-mounted schedule while the other holds a tablet.',
    'Outside a warehouse, sealed crates are stacked on pallets beside a raised loading bay. A delivery truck is parked farther away.',
    'A wide retail aisle extends between tall shelves stocked with packaged goods. A folded ladder is against the far wall.',
    'On a restaurant terrace, several empty tables sit beneath open umbrellas. No dishes or customers are present.',
    'A maintenance technician stands in a corridor with an open toolkit on the floor and examines a wall-mounted control panel.',
    'Inside a transport terminal, passengers sit beneath illuminated departure displays while a service counter remains in the distance.',
    'A single bicycle is secured to a metal railing beside a pedestrian walkway. A passerby is visible in the background.',
    'An office lounge contains armchairs and low tables arranged near floor-to-ceiling windows. The doorway is clear.',
    'In a commercial kitchen, a chef uses a knife on a cutting board beside bowls of vegetables.',
    'At a marina, several small boats are moored side by side along a wooden dock.',
  ]
  return q('adv-t1-'+String(index+1).padStart(2,'0'),1,'Photographs','Choose the statement that best matches the scene.',options,answers[index],{
    sceneImage:`toeic/scenes/${String(index + 1).padStart(2,'0')}.svg`,
    sceneAlt:scenes[index],
    audioOnlyChoices:true,
    choiceLabelsOnly:true,
    audio:options.map((option,i)=>'Choice '+String.fromCharCode(65+i)+'. '+option).join(' '),
  })
})

const part2Rows = [
  ['Haven’t the revised figures been uploaded yet?',['Not unless the server comes back online.','The figures were higher last quarter.','Yes, I prefer the printed chart.'],0],
  ['Who is taking over the Westbrook account?',['I heard it was reassigned to Priya.','The account balance is correct.','At the Westbrook branch.'],0],
  ['Couldn’t we move the inspection to Thursday?',['Only if the client agrees.','The inspector moved downstairs.','Thursday is printed in blue.'],0],
  ['Why don’t you ask Marcus to review the contract?',['He is already checking another one.','The contract has twelve pages.','Because the review was useful.'],0],
  ['Where did the courier say he would leave the parcel?',['With security if reception is closed.','He left about ten minutes ago.','The parcel weighs three kilos.'],0],
  ['Would you mind covering the front desk during lunch?',['Not at all. I’ll be there at noon.','Lunch was delivered early.','The desk is near the entrance.'],0],
  ['When are the regional managers expected back?',['Sometime after the afternoon session.','They manage three regions.','The session room is on level six.'],0],
  ['Isn’t this the version we approved last week?',['No, this one includes the legal revisions.','Approval usually takes a week.','The version number is on the cover.'],0],
  ['How come the conference room is unavailable?',['Facilities is setting up some equipment inside.','The conference begins at eleven.','I left the key on the table.'],0],
  ['Which supplier quoted the shorter lead time?',['The one based in Busan.','About two weeks shorter.','The quote was sent yesterday.'],0],
  ['Could you let me know once the transfer clears?',['Of course. I’ll message you right away.','The bank closes at four.','The transfer form is downstairs.'],0],
  ['Why was the keynote speaker replaced?',['She had to cancel because of a flight disruption.','The replacement speaks at nine.','I replaced the microphone batteries.'],0],
  ['Who should sign off on the final layout?',['Either Nina or the creative director can.','The layout fits on one page.','It was signed yesterday morning.'],0],
  ['Do we have enough samples for the client visit?',['Barely, but the new shipment arrives tonight.','The client visited last month.','Samples are stored alphabetically.'],0],
  ['Where are we supposed to meet the contractor?',['By the service entrance, according to the email.','The contract was renewed in May.','He is supposed to finish tomorrow.'],0],
  ['Shouldn’t the warranty cover this repair?',['It does, provided the damage was not accidental.','The repair shop is across town.','The warranty card is white.'],0],
  ['How soon can the revised schedule be circulated?',['As soon as the director confirms the dates.','The schedule covers six weeks.','It was circulated by email.'],0],
  ['Wouldn’t it be cheaper to renew the lease now?',['Perhaps, but we are still comparing locations.','The lease expires in October.','The cheaper office has blue walls.'],0],
  ['What did the auditor want us to clarify?',['How we classified the consulting expenses.','The auditor arrived early.','The expenses were paid in cash.'],0],
  ['Why is the loading dock unavailable this morning?',['A safety inspection is being carried out.','The dock faces the east parking lot.','This morning was unusually busy.'],0],
  ['Could I get an extension on the proposal deadline?',['You’ll need to check with procurement first.','The proposal is nearly complete.','An extension cord is in the cabinet.'],0],
  ['Which route avoids the construction near downtown?',['Take the ring road and exit at Harbor Avenue.','The construction started in June.','Downtown is about eight kilometers away.'],0],
  ['Didn’t the client ask for a cost breakdown?',['Yes, so I added one to the appendix.','The client broke the old display.','Costs rose by five percent.'],0],
  ['What’s holding up the reimbursement?',['Finance is waiting for one missing receipt.','The reimbursement was for airfare.','I’m holding the receipt folder.'],0],
  ['Can we still make the 6:20 train?',['If we leave in the next five minutes.','The train has six cars.','I made the reservation online.'],0],
  ['Why don’t we postpone the software rollout?',['That may be safer until the bug is fixed.','The rollout plan has three phases.','The software was purchased in April.'],0],
  ['Who else has access to the archived files?',['Only the compliance team, as far as I know.','The archive is in the basement.','The files are sorted by year.'],0],
  ['Where should visitors pick up temporary badges?',['At reception after showing identification.','The badges are valid for one day.','Visitors arrived before lunch.'],0],
  ['Has the vendor confirmed the revised delivery window?',['Not yet, but they promised an answer by noon.','The delivery window faces the courtyard.','I confirmed the order quantity.'],0],
  ['Would you prefer I send the draft now or after the meeting?',['After the meeting—we may have more changes.','The draft is three pages long.','I sent the meeting link already.'],0],
]
const part2Bank = part2Rows.map(([prompt,options,answer],index)=>q(
  'adv-t2-'+String(index+1).padStart(2,'0'),2,'Question–Response','Choose the best response.',options,answer,{
    audioOnlyChoices:true,
    choiceLabelsOnly:true,
    audio:prompt+' '+options.map((option,i)=>'Choice '+String.fromCharCode(65+i)+'. '+option).join(' '),
  }
))

const conversationRows = [
  ['The supplier says the replacement sensors can arrive Friday, but only if we approve express freight today. Friday is still too late for the Monday installation unless engineering can test them over the weekend. I’ll ask Lena whether her team can arrange a Saturday shift. Good. If she agrees, authorize the freight before three.',[
    ['Why is the woman concerned?',['The sensors may not be tested in time.','The supplier changed the specifications.','The installation was canceled.','Engineering ordered the wrong quantity.'],0],
    ['What will the man probably do next?',['Contact an engineering manager.','Cancel the express freight.','Move the installation to Friday.','Request a lower price.'],0],
    ['What does the woman imply about approving the freight?',['It depends on weekend testing being available.','It has already been approved.','It should wait until Monday.','It is unnecessary.'],0],
  ]],
  ['I reviewed the venue contract. The ballroom is reserved until six, but our awards program is scheduled to finish at six fifteen. Could we start dinner earlier? Catering needs the room until five twenty to finish setup. Then I’ll ask whether the reservation can be extended by half an hour.',[
    ['What problem do the speakers identify?',['Their program may run beyond the reservation.','Catering canceled dinner.','The ballroom is too small.','The awards have not arrived.'],0],
    ['Why can dinner not begin much earlier?',['The catering team needs setup time.','Guests arrive after six.','The venue prohibits early meals.','The awards start at five.'],0],
    ['What will the man most likely request?',['Additional time in the ballroom.','A smaller dining room.','A revised menu.','A refund.'],0],
  ]],
  ['I noticed the analytics dashboard shows a sharp rise in returns for Model C. That is because the warehouse changed the product code last week. Some exchanges are being counted as returns. So the number is misleading? For now, yes. I’m working with IT to correct the mapping before tomorrow’s review.',[
    ['What does the man notice?',['An apparent increase in returns.','A decline in traffic.','A shipment delay.','A changed review date.'],0],
    ['What caused the misleading data?',['A product-code mapping issue.','A defect in Model C.','Incorrect addresses.','A new return policy.'],0],
    ['Why is the woman working with IT?',['To correct the dashboard before a meeting.','To replace scanners.','To create a new model.','To postpone the review.'],0],
  ]],
  ['The architect sent two revised floor plans. Option A keeps the storage room but reduces the training area. We already struggle to fit twenty people into training sessions. Exactly. Option B removes the storage room and adds six seats. Let’s ask operations whether they can use off-site storage before we decide.',[
    ['What is one disadvantage of Option A?',['It makes the training space smaller.','It removes all storage.','It costs more.','It reduces offices.'],0],
    ['What can be inferred about the current training area?',['It is already close to capacity.','It is rarely used.','It contains off-site storage.','It was recently expanded.'],0],
    ['Whom will the speakers consult?',['The operations team.','The architect’s accountant.','A training instructor.','A furniture supplier.'],0],
  ]],
  ['We can publish the product announcement tomorrow if legal approves the warranty wording today. I sent the latest version this morning, but they asked whether the two-year coverage applies internationally. It does only in markets where we have authorized service partners. I’ll add that limitation and send it back now.',[
    ['What is delaying publication?',['Approval of warranty language.','Missing photographs.','A manufacturing problem.','An incomplete price list.'],0],
    ['What did the legal team ask about?',['Where the warranty applies.','How long the announcement should be.','Which partner is cheapest.','When the product was made.'],0],
    ['What will the woman do next?',['Revise the wording and resubmit it.','Contact all customers.','Extend the warranty everywhere.','Postpone the product indefinitely.'],0],
  ]],
  ['The client workshop is nearly full. We have twenty-eight registrations and the room limit is thirty. Should we close registration now? Not yet. A few people usually cancel. But add a wait-list option so we do not exceed the fire-code limit. I’ll update the form and confirmation email.',[
    ['What is the woman trying to avoid?',['Exceeding room capacity.','Canceling the workshop.','Reducing the fee.','Changing the date.'],0],
    ['Why does she not want to close registration immediately?',['Some registered people may cancel.','The fire-code limit changed.','A larger room is available.','Only twenty-eight seats were advertised.'],0],
    ['What will the man change?',['The registration system.','The agenda.','The room layout.','The cancellation policy.'],0],
  ]],
]
const advancedConversationGroups = conversationRows.map(([audio,items],setIndex)=>items.map(([question,options,answer],itemIndex)=>q(
  'adv-t3-'+String(setIndex*3+itemIndex+1).padStart(2,'0'),3,'Conversations',question,options,answer,{audio}
)))

const talkRows = [
  ['Before today’s laboratory tour, please note that the east wing is still operating, so visitors must remain behind the yellow floor markings. Photography is allowed in the packaging area but not where prototype equipment is being tested. The tour usually lasts fifty minutes; however, because one production line is shut down for maintenance, we expect to finish about ten minutes early. At the end, return your safety glasses to the marked bins near reception.',[
    ['Why must visitors stay behind the floor markings?',['Part of the laboratory is still operating.','The floor was recently painted.','Another tour group is arriving.','The packaging area is closed.'],0],
    ['Where is photography prohibited?',['Near prototype testing equipment.','In the packaging area.','At reception.','Beside the safety-glasses bins.'],0],
    ['What is different about today’s tour?',['It is expected to be shorter than usual.','It begins in the east wing.','Visitors may keep safety glasses.','Two lines are demonstrated.'],0],
  ]],
  ['This month, the company will begin replacing older access cards with mobile credentials. Employees in Building One will receive instructions first, followed by Buildings Two and Three next week. Do not discard your physical card until you receive confirmation that the mobile credential is active. Contractors and short-term visitors will continue using temporary cards for now. Questions should be sent to the security systems team rather than the general IT help desk.',[
    ['Who will receive the instructions first?',['Employees in Building One.','Contractors.','Short-term visitors.','The IT help desk.'],0],
    ['When should employees stop using physical cards?',['After mobile access is confirmed.','As soon as instructions arrive.','At month-end.','Before entering Building Two.'],0],
    ['Where should questions be directed?',['The security systems team.','The general IT help desk.','Building One reception.','The contractor office.'],0],
  ]],
  ['The downtown branch will test extended evening hours for six weeks beginning October fourth. During the trial, the branch will stay open until eight on Tuesdays and Thursdays, while all other weekday hours remain unchanged. Management will review customer traffic and staffing costs before deciding whether to keep the schedule. The drive-through window is not part of the trial and will continue closing at six.',[
    ['What is being tested?',['Longer hours on two evenings.','A new drive-through service.','Weekend opening.','A six-week closure.'],0],
    ['What will management examine?',['Customer traffic and staffing costs.','Parking and rent.','Loans and advertising.','Website usage and security.'],0],
    ['What is NOT affected by the trial?',['The drive-through closing time.','Tuesday hours.','Thursday hours.','The starting date.'],0],
  ]],
  ['Passengers traveling on Route 52 this weekend should expect a temporary change. Because crews are repairing the bridge on Elm Street, buses will turn onto King Avenue and skip the Elm Market stop. A temporary stop will be placed outside the public library, about two blocks west of the market. Normal service is expected to resume Monday morning unless the work is delayed by rain.',[
    ['Why is Route 52 changing?',['A bridge is being repaired.','A market is relocating.','A library is closed.','The bus fleet is changing.'],0],
    ['Where will the temporary stop be?',['Outside the public library.','At Elm Market.','On the bridge.','Two blocks east of the market.'],0],
    ['What could delay normal service?',['Rain.','Low passenger demand.','Library hours.','A driver shortage.'],0],
  ]],
  ['Beginning next quarter, invoices must include the purchase-order number in the subject line as well as on the attached document. Files should be submitted in PDF format; spreadsheet copies may be included for reference but will not replace the PDF. Invoices missing a purchase-order number will be returned without processing. The change is intended to reduce manual matching and shorten payment times.',[
    ['What new requirement is announced?',['The purchase-order number must also appear in the subject line.','Invoices must be spreadsheets only.','Suppliers must change bank accounts.','Purchase orders will end.'],0],
    ['What happens to invoices without a purchase-order number?',['They are returned without processing.','They are paid next quarter.','They are converted to spreadsheets.','They are sent elsewhere.'],0],
    ['Why is the change being made?',['To make invoice matching more efficient.','To increase purchase-order values.','To eliminate PDF documents.','To reduce suppliers.'],0],
  ]],
]
const advancedTalkGroups = talkRows.map(([audio,items],setIndex)=>items.map(([question,options,answer],itemIndex)=>q(
  'adv-t4-'+String(setIndex*3+itemIndex+1).padStart(2,'0'),4,'Talks',question,options,answer,{audio}
)))

const part5Rows = [
  ['The committee requested that the proposal _____ before any funds were released.',['be revised','is revised','revising','has revised'],0],
  ['Only after the inspection was completed _____ the equipment cleared for use.',['was','did','had','has'],0],
  ['The consultant’s recommendations were based _____ interviews with more than sixty employees.',['on','at','for','into'],0],
  ['The revised policy is intended to make reimbursement procedures more _____.',['transparent','transparently','transparency','transparentness'],0],
  ['No sooner had the shipment arrived _____ the quality team began its inspection.',['than','when','while','during'],0],
  ['Applicants with experience in both logistics and procurement are especially _____.',['desirable','desire','desirably','desiring'],0],
  ['The factory remained operational _____ several machines were undergoing maintenance.',['even though','because of','in spite','unless'],0],
  ['Ms. Alvarez was promoted in recognition _____ her work on the regional expansion.',['of','to','for','with'],0],
  ['The board postponed the vote pending _____ information from the legal department.',['further','farther','furthest','furthering'],0],
  ['Had the vendor notified us earlier, we _____ an alternative shipment.',['could have arranged','could arrange','will arrange','arranged'],0],
  ['The update is expected to reduce the amount of time _____ to process each request.',['required','requiring','requires','requirement'],0],
  ['Neither the revised estimate nor the supporting documents _____ been uploaded.',['have','has','having','was'],0],
  ['The company is seeking candidates capable _____ managing multiple projects simultaneously.',['of','to','with','for'],0],
  ['The final contract differs _____ from the draft circulated last month.',['substantially','substantial','substance','substantiate'],0],
  ['Customers are advised to retain receipts in the event _____ a warranty claim.',['of','for','that','with'],0],
  ['The merger will proceed only if regulators _____ the proposed conditions.',['approve','will approve','approved','approving'],0],
  ['The maintenance schedule was adjusted to minimize disruption _____ normal operations.',['to','for','with','at'],0],
  ['The report provides a concise overview, _____ it does not address implementation costs in detail.',['although','therefore','because','unless'],0],
  ['The new warehouse is strategically located _____ two major transportation corridors.',['between','among','during','through'],0],
  ['Employees should not disclose customer data except when _____ to do so by law.',['required','requiring','require','requirement'],0],
  ['The director asked that all outstanding invoices be settled _____ the end of the quarter.',['by','until','within','among'],0],
  ['The proposed timetable is ambitious but still _____ if additional staff are assigned.',['feasible','feasibly','feasibility','feasibles'],0],
  ['The audit identified several controls that were not being applied _____.',['consistently','consistent','consistency','consist'],0],
  ['Production was temporarily suspended _____ a fault in the cooling system.',['because of','although','unless','despite of'],0],
  ['The training materials reflect the most _____ regulatory requirements.',['recent','recently','recency','recentness'],0],
  ['The candidate responded _____ to several challenging follow-up questions.',['persuasively','persuasive','persuasion','persuade'],0],
  ['The lease may be renewed for three years _____ both parties agree to the revised terms.',['provided that','despite','whereas','because of'],0],
  ['The project manager requested a more _____ breakdown of implementation costs.',['detailed','detail','detailing','details'],0],
  ['Any expense exceeding the stated limit requires prior _____.',['authorization','authorize','authorized','authorizing'],0],
  ['The expansion has been more rapid than analysts initially _____.',['anticipated','anticipating','anticipate','anticipation'],0],
]
const part5Bank = part5Rows.map(([question,options,answer],index)=>q('adv-t5-'+String(index+1).padStart(2,'0'),5,'Incomplete Sentences',question,options,answer))

const part6Sets = [
  ['Memo: Vendor onboarding','Beginning next month, new suppliers must complete the digital onboarding form before purchase orders can be issued. The form collects tax information, banking details, and compliance declarations. (1) _____. Existing suppliers do not need to repeat the process unless their legal or banking information has changed. Because incomplete records can delay payment, departments should verify that vendors have finished onboarding (2) _____ placing an order. The procurement team will review forms within two business days and contact suppliers directly if documentation is (3) _____. Questions should be directed to procurement rather (4) _____ accounts payable.',[
    ['Blank (1)',['A confirmation email is sent once the form has been accepted.','The cafeteria will extend its hours.','Several vendors attended last year’s fair.','Purchase orders are printed on blue paper.'],0],
    ['Blank (2)',['before','despite','among','throughout'],0],
    ['Blank (3)',['missing','miss','missed','missingly'],0],
    ['Blank (4)',['than','from','to','with'],0],
  ]],
  ['Email: Revised research briefing','Thank you for reviewing the first draft of the research briefing. Several sections have been rewritten to distinguish confirmed findings from preliminary observations. The chart on page four has also been replaced because the original version could have (1) _____ the regional differences. (2) _____. Please pay particular attention to the assumptions listed below Figure 3. If you identify factual errors, send comments by noon Wednesday so the document can be (3) _____ before Thursday’s executive meeting. We appreciate the time you have (4) _____ to this project.',[
    ['Blank (1)',['overstated','overstate','overstating','overstatement'],0],
    ['Blank (2)',['The new chart uses the same scale for all three regions.','The office will be repainted tomorrow.','A training session begins next month.','The printer has been replaced.'],0],
    ['Blank (3)',['finalized','finalizing','finalize','final'],0],
    ['Blank (4)',['devoted','devoting','devote','devotion'],0],
  ]],
  ['Notice: Building access','The south entrance will be unavailable Saturday while the electronic access system is upgraded. Employees should use the north entrance and bring both their staff badge and a government-issued ID. Security officers will verify identities manually because badge readers may be (1) _____ during installation. Contractors must be listed on the approved weekend access roster. (2) _____. Normal badge access is expected to resume by 6:00 A.M. Monday, although employees should check the facilities page for updates (3) _____ traveling to the office. We apologize for any inconvenience the work may (4) _____.',[
    ['Blank (1)',['offline','outward','outside','offing'],0],
    ['Blank (2)',['Anyone not on the roster will need authorization from the duty manager.','The cafeteria menu changes Friday.','Parking passes are sold online.','Conference rooms were renovated.'],0],
    ['Blank (3)',['before','unless','despite','besides'],0],
    ['Blank (4)',['cause','caused','causing','causation'],0],
  ]],
  ['Announcement: Customer survey','Our annual customer survey will launch on September 8 and remain open for three weeks. This year, the questionnaire has been shortened so most participants can finish it in under seven minutes. Responses will be anonymous unless customers provide contact information. The team expects the shorter format to improve completion, (1) _____ last year’s survey had many abandoned responses. (2) _____. Branch managers should not coach customers on how to answer, but they may explain how survey data are used. Results will be summarized in October and presented (3) _____ the executive committee. Technical issues should be reported promptly so they can be (4) _____.',[
    ['Blank (1)',['as','unless','despite','whereas of'],0],
    ['Blank (2)',['A small pilot in July produced higher completion rates.','Office furniture was purchased locally.','Finance closes accounts monthly.','Some branches have larger parking lots.'],0],
    ['Blank (3)',['to','at','for','with'],0],
    ['Blank (4)',['resolved','resolution','resolving','resolve'],0],
  ]],
]
const advancedPart6Groups = part6Sets.map(([title,passage,items],setIndex)=>items.map(([question,options,answer],itemIndex)=>q(
  'adv-t6-'+String(setIndex*4+itemIndex+1).padStart(2,'0'),6,'Text Completion',question,options,answer,{passageTitle:title,passage}
)))

const multiPassageSets = [
  ['Email + Delivery Schedule',[
    'Document 1 — Procurement email: We have approved the replacement order for 80 temperature sensors. The supplier can dispatch 50 units on Tuesday and the remaining 30 on Friday. Because installation begins Thursday morning, please identify which sites should receive the first shipment.',
    'Document 2 — Installation schedule: Thursday — North Plant, 24 sensors; Friday — Harbor Plant, 18; Monday — West Depot, 20; Tuesday — Airport Facility, 18. Each site requires its full quantity before installation can begin.'
  ],[
    ['Why was the email sent?',['To coordinate a split shipment with an installation plan.','To cancel an order.','To request a new contractor.','To change the number of sites.'],0],
    ['Which site can definitely receive enough sensors from the first shipment?',['North Plant.','North Plant and Harbor Plant together.','West Depot only.','Airport Facility only.'],0],
    ['How many sensors remain after supplying North Plant from the first shipment?',['26.','6.','32.','50.'],0],
    ['Why might Harbor Plant need to wait for the second shipment?',['The first shipment may be allocated to an earlier site.','Its installation is after Tuesday.','It needs fewer sensors.','The supplier cannot ship Friday.'],0],
    ['What information must the recipient provide?',['Priority among the installation sites.','A revised specification.','A list of supplier employees.','A new purchase-order number.'],0],
  ]],
  ['Conference Notice + Registration Record',[
    'Document 1 — Conference notice: The morning keynote begins at 9:00 in Hall A. Workshops start at 10:30. Workshop W2, “Forecasting Demand,” has moved from Room 204 to Room 318 because registration exceeded the original room capacity. Lunch begins at 12:30.',
    'Document 2 — Registration record for M. Chen: Keynote — registered; 10:30 Workshop W2 — registered; 1:45 Workshop W5 — wait-listed. Accessibility note: requires step-free access.'
  ],[
    ['Why was Workshop W2 moved?',['More participants registered than expected.','The instructor requested a smaller room.','Hall A is unavailable.','Lunch was rescheduled.'],0],
    ['Where should M. Chen go at 10:30?',['Room 318.','Room 204.','Hall A.','The lunch area.'],0],
    ['What should organizers verify about Room 318?',['Whether it has step-free access.','Whether lunch is served there.','Whether W5 can move there.','Whether the keynote uses it.'],0],
    ['What is true about M. Chen’s afternoon plan?',['A place in Workshop W5 is not guaranteed.','The workshop begins before lunch.','W5 was canceled.','The keynote continues to 1:45.'],0],
    ['Which document explains the reason for the room change?',['The conference notice.','The registration record.','Both documents.','Neither document.'],0],
  ]],
  ['Maintenance Memo + Service Log',[
    'Document 1 — Maintenance memo: Elevators 2 and 3 will undergo inspection Wednesday. At least one elevator will remain in service. Deliveries requiring freight access should be scheduled after 2:00 P.M. when Elevator 3 is expected to return.',
    'Document 2 — Service log, 1:35 P.M.: Elevator 2 inspection completed early and it is back in service. Elevator 3 requires an additional component and will remain unavailable until approximately 4:30 P.M.'
  ],[
    ['What did the original memo recommend?',['Scheduling freight deliveries after 2:00 P.M.','Canceling deliveries all day.','Using Elevator 2 before noon.','Moving deliveries to Thursday.'],0],
    ['What changed according to the service log?',['Elevator 2 returned sooner than expected.','Both elevators stayed unavailable.','Elevator 3 finished early.','Freight access closed permanently.'],0],
    ['At 3:00 P.M., which elevator should be available?',['Elevator 2 only.','Elevator 3 only.','Both elevators.','Neither elevator.'],0],
    ['Why could a 2:30 P.M. delivery face a different situation than expected?',['Elevator 3 will still be unavailable.','Elevator 2 is scheduled then.','The building closes at 2:00.','Freight access was prohibited.'],0],
    ['Which information is most current?',['The service log.','The original memo.','Both are equally current.','Neither gives timing.'],0],
  ]],
  ['Hotel Message + Event Itinerary',[
    'Document 1 — Hotel message: Your group may store luggage at reception from 9:00 A.M. Rooms are guaranteed from 3:00 P.M. The hotel shuttle leaves for the convention center every hour on the half hour, beginning at 8:30 A.M. The trip usually takes twenty minutes.',
    'Document 2 — Event itinerary: Train arrival — 10:05 A.M.; badge collection — 11:00–11:45 A.M.; team lunch — 12:15 P.M.; hotel check-in — after afternoon sessions.'
  ],[
    ['What can the group do before rooms are ready?',['Leave luggage at reception.','Check in at 9:00.','Use rooms without keys.','Request guaranteed rooms at 10:05.'],0],
    ['Which is the latest safe shuttle for arriving before badge collection closes?',['10:30.','11:30.','9:30 only.','12:30.'],0],
    ['Why is immediate check-in unnecessary?',['Luggage storage is available and check-in is planned later.','The hotel has no reception desk.','The convention center stores luggage.','Rooms are ready at 10:05.'],0],
    ['How often does the shuttle depart?',['Once an hour.','Every twenty minutes.','Twice an hour.','Only at 8:30.'],0],
    ['What should the group probably do soon after arriving by train?',['Store luggage and continue to the convention center.','Wait until 3:00 at the station.','Attend lunch before badge collection.','Check in immediately.'],0],
  ]],
  ['Policy Update + Employee Case',[
    'Document 1 — Travel policy update: Hotel expenses above $180 per night require pre-approval unless the employee is attending an event at an officially designated conference hotel. Ground transportation receipts are required for individual expenses above $25.',
    'Document 2 — Expense note: Elena attended the Data Systems Forum at its designated conference hotel, which cost $205 per night. Her airport taxi was $42 and she attached the receipt. She did not request hotel pre-approval.'
  ],[
    ['Why might Elena’s hotel expense still comply with policy?',['The hotel was an officially designated conference hotel.','It cost less than $180.','She attached a taxi receipt.','She stayed only one night.'],0],
    ['Which expense definitely requires a receipt under the policy?',['The $42 taxi.','Any hotel expense.','Every expense under $25.','Conference registration only.'],0],
    ['What did Elena NOT do?',['Request hotel pre-approval.','Attend the forum.','Use a taxi.','Attach a taxi receipt.'],0],
    ['Which detail connects the two documents?',['The designated-conference-hotel exception.','The airport location.','The length of the forum.','The name of the taxi company.'],0],
    ['What is the best conclusion?',['Her hotel may be exempt from pre-approval, but the taxi receipt is still required.','Both expenses violate policy.','Neither expense needs documentation.','The hotel must cost exactly $180.'],0],
  ]],
  ['Customer Email + Warranty Table',[
    'Document 1 — Customer email: My Model Q blender stopped working after fourteen months. I purchased it new from an authorized retailer and have the receipt. The motor starts, but the blades do not turn. There is no visible damage to the jar.',
    'Document 2 — Warranty table: Motor — 24 months; drive coupling — 12 months; glass jar — 12 months; accessories — 6 months. Coverage excludes accidental damage and commercial use.'
  ],[
    ['Which component is clearly still within its stated warranty period?',['The motor.','The drive coupling.','The glass jar.','Accessories.'],0],
    ['Why is the receipt relevant?',['It can establish purchase timing and authorized-retailer status.','It proves the jar is damaged.','It extends every warranty to 24 months.','It shows commercial use.'],0],
    ['Which component could plausibly explain blades not turning while the motor runs?',['The drive coupling.','The glass jar.','An accessory bag.','The receipt.'],0],
    ['Why might coverage of that component be uncertain?',['Its stated warranty period is only 12 months.','The customer bought from an authorized retailer.','The motor starts.','The jar has no visible damage.'],0],
    ['What information would be most useful next?',['A diagnosis identifying the failed component.','The customer’s favorite recipe.','The store’s opening hours.','The blender color.'],0],
  ]],
  ['Job Posting + Candidate Profile',[
    'Document 1 — Job posting: Project coordinator. Required: two years of project support experience and advanced spreadsheet skills. Preferred: experience with scheduling software and vendor coordination. Applications close October 15.',
    'Document 2 — Candidate profile: Mai Tran — three years as operations assistant; coordinates supplier deliveries; advanced Excel certification; uses basic calendar tools but has not used dedicated project scheduling software.'
  ],[
    ['Which required qualification does Mai clearly meet?',['Both experience and advanced spreadsheet skills.','Scheduling software only.','Neither required qualification.','A management degree.'],0],
    ['Which preferred qualification does she also appear to meet?',['Vendor coordination.','Dedicated scheduling software.','Graphic design.','Accounting certification.'],0],
    ['What gap remains in her profile?',['No dedicated project scheduling software experience.','Insufficient work experience.','No spreadsheet skills.','No supplier exposure.'],0],
    ['What is the application deadline?',['October 15.','October 5.','November 15.','September 15.'],0],
    ['What is the best inference?',['She meets the stated requirements despite lacking one preferred skill.','She is automatically disqualified.','She exceeds every preferred qualification.','The posting requires four years of experience.'],0],
  ]],
  ['Flight Notice + Meeting Agenda',[
    'Document 1 — Airline notice: Flight 482 now departs at 9:20 A.M. instead of 8:35 because of aircraft rotation. Arrival is expected at 11:05 A.M. Passengers may change to Flight 318 at 7:50 A.M. without a fee, subject to availability.',
    'Document 2 — Meeting agenda: Client office — briefing 11:30 A.M.; presentation 12:00; site tour 1:30 P.M. Travel time from airport to client office is normally 35 minutes.'
  ],[
    ['What changed about Flight 482?',['Its departure was delayed.','Its destination changed.','Its fare increased.','It was canceled.'],0],
    ['Why could staying on Flight 482 be risky for the briefing?',['Normal ground travel would put arrival after the briefing starts.','The presentation was canceled.','The airport closes at eleven.','Flight 482 lands in another city.'],0],
    ['What alternative is offered?',['Flight 318 at 7:50 A.M.','A train at 9:20.','A refund only.','Flight 318 at noon.'],0],
    ['What time does the presentation begin?',['12:00.','11:05.','11:30.','1:30.'],0],
    ['What decision would best protect the schedule if a seat is available?',['Switch to the earlier flight.','Keep Flight 482 because it arrives before noon.','Skip the briefing automatically.','Move the client office to the airport.'],0],
  ]],
]
const advancedPart7Groups = multiPassageSets.map(([title,passage,items],setIndex)=>items.map(([question,options,answer],itemIndex)=>q(
  'adv-t7-'+String(setIndex*5+itemIndex+1).padStart(2,'0'),7,'Multiple Passages',question,options,answer,{passageTitle:title,passage}
)))

export function buildToeicExamSections(random = createExamRandom()) {
  const formId = examFormId('toeic')

  const part1 = sample(part1Bank,6,random)
  const part2 = shuffled([
    ...sample(part2Bank,18,random),
    ...sample(basePart(2),7,random).map(audioOnlyPart2),
  ],random)

  const basePart3 = baseGroups(3,(item)=>item.audio)
  const part3Groups = shuffled([
    ...sample(advancedConversationGroups,Math.min(4,advancedConversationGroups.length),random),
    ...sample(basePart3,9,random),
  ],random)

  const basePart4 = baseGroups(4,(item)=>item.audio)
  const part4Groups = shuffled([
    ...sample(advancedTalkGroups,Math.min(3,advancedTalkGroups.length),random),
    ...sample(basePart4,7,random),
  ],random)

  const part5 = shuffled([
    ...sample(part5Bank,20,random),
    ...sample(basePart(5),10,random),
  ],random)

  const basePart6Groups = baseGroups(6,(item)=>item.passageTitle || item.passage)
  const part6Groups = shuffled([
    ...sample(advancedPart6Groups,Math.min(3,advancedPart6Groups.length),random),
    ...sample(basePart6Groups,1,random),
  ],random)

  const basePart7Groups = baseGroups(7,(item)=>item.passageTitle || item.passage)
  const part7Groups = shuffled([
    ...sample(basePart7Groups,8,random),
    ...sample(advancedPart7Groups,6,random),
  ],random)

  const listening = [
    ...part1,
    ...part2,
    ...part3Groups.flat(),
    ...part4Groups.flat(),
  ]
  const reading = [
    ...part5,
    ...part6Groups.flat(),
    ...part7Groups.flat(),
  ]

  return [
    { id:formId+'-listening', label:'Listening', duration:45*60, questions:stampQuestions(listening,formId+'-l',random,{shuffleChoices:true}) },
    { id:formId+'-reading', label:'Reading', duration:75*60, questions:stampQuestions(reading,formId+'-r',random,{shuffleChoices:true}) },
  ]
}

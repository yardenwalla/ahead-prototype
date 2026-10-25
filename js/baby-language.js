/* Baby-specific language uses authored variants, never guesses from a name.
   Generic guidance and quotations stay neutral. Pronouns do not change clinical guidance. */
const BABY_COPY_TEMPLATES = new Map([
  [
    "Notice when she gets sleepy",
    "Notice when {s} {gets} sleepy"
  ],
  [
    "For a few days, note the times. If they’re similar, those are her nap times.",
    "For a few days, note the times. If they’re similar, those are {p} nap times."
  ],
  [
    "On two-nap days, an earlier bedtime helps while she adjusts.",
    "On two-nap days, an earlier bedtime helps while {s} {adjusts}."
  ],
  [
    "Offer comfort when she wakes, then use the same short goodbye.",
    "Offer comfort when {s} {wakes}, then use the same short goodbye."
  ],
  [
    "Stop swaddling. Use sleepwear or a sleep sack that leaves arms free. Keep placing baby on their back; once she rolls both ways, you can leave her.",
    "Stop swaddling. Use sleepwear or a sleep sack that leaves arms free. Keep placing baby on {p} back; once {s} {rolls} both ways, you can leave {o}."
  ],
  [
    "Set the mattress to its lowest and remove mobiles and anything she can reach.",
    "Set the mattress to its lowest and remove mobiles and anything {s} can reach."
  ],
  [
    "Moving to her own room",
    "Moving to {p} own room"
  ],
  [
    "Start bedtime when she’s truly sleepy, even if it’s late. Every few nights, move it 15 minutes earlier.",
    "Start bedtime when {s} {is} truly sleepy, even if it’s late. Every few nights, move it 15 minutes earlier."
  ],
  [
    "Pick her up to calm her, then put her down awake. Repeat until she settles.",
    "Pick {o} up to calm {o}, then put {o} down awake. Repeat until {s} {settles}."
  ],
  [
    "Sit by the crib while she falls asleep. Every few nights, move the chair farther away.",
    "Sit by the crib while {s} {falls} asleep. Every few nights, move the chair farther away."
  ],
  [
    "Say goodnight and stay out until morning, except for feeds or if she’s unwell.",
    "Say goodnight and stay out until morning, except for feeds or if {s} {is} unwell."
  ],
  [
    "Remove mobiles and anything she can reach from standing.",
    "Remove mobiles and anything {s} can reach from standing."
  ],
  [
    "Why won’t she settle?",
    "Why won’t {s} settle?"
  ],
  [
    "Is she fed and changed?",
    "{Is} {s} fed and changed?"
  ],
  [
    "Evening fussiness is very common. Dim the lights, cut the noise and feed as often as she wants.",
    "Evening fussiness is very common. Dim the lights, cut the noise and feed as often as {s} {wants}."
  ],
  [
    "Is it OK that she only naps on me?",
    "Is it OK that {s} only {naps} on me?"
  ],
  [
    "Does she sleep in her own space at night?",
    "{Does} {s} sleep in {p} own space at night?"
  ],
  [
    "Wait for deep sleep, about 15–20 minutes in, when her arms go limp, then move her to her sleep space.",
    "Wait for deep sleep, about 15–20 minutes in, when {p} arms go limp, then move {o} to {p} sleep space."
  ],
  [
    "If you’re getting sleepy, put her down first, even if she wakes.",
    "If you’re getting sleepy, put {o} down first, even if {s} {wakes}."
  ],
  [
    "Why won’t she settle for naps?",
    "Why won’t {s} settle for naps?"
  ],
  [
    "How long had she been awake?",
    "How long had {s} been awake?"
  ],
  [
    "She may not be tired yet. Try again in 15–20 minutes.",
    "{S} may not be tired yet. Try again in 15–20 minutes."
  ],
  [
    "She may be overtired. Try a darker room and more help this time, and start the next nap sooner.",
    "{S} may be overtired. Try a darker room and more help this time, and start the next nap sooner."
  ],
  [
    "Why is she fighting the catnap?",
    "Why {is} {s} fighting the catnap?"
  ],
  [
    "How does she do without it?",
    "How {does} {s} do without it?"
  ],
  [
    "She may be starting the 3-to-2 nap transition. On days she skips it, move bedtime earlier.",
    "{S} may be starting the 3-to-2 nap transition. On days {s} {skips} it, move bedtime earlier."
  ],
  [
    "She still needs it. Try a stroller ride, car ride or contact nap for 20–30 minutes.",
    "{S} still {needs} it. Try a stroller ride, car ride or contact nap for 20–30 minutes."
  ],
  [
    "Why is she waking more at night?",
    "Why {is} {s} waking more at night?"
  ],
  [
    "Keep placing her on her back. If she rolls over herself, you can leave her.",
    "Keep placing {o} on {p} back. If {s} {rolls} over {r}, you can leave {o}."
  ],
  [
    "She may not be tired yet. Push bedtime 20–30 minutes later tonight, and end that nap earlier tomorrow.",
    "{S} may not be tired yet. Push bedtime 20–30 minutes later tonight, and end that nap earlier tomorrow."
  ],
  [
    "Offer the comfort she needs now. Go back to your usual routine once she’s better.",
    "Offer the comfort {s} {needs} now. Go back to your usual routine once {s} {is} better."
  ],
  [
    "Help her lie down calmly, and practice sitting down from standing during play.",
    "Help {o} lie down calmly, and practice sitting down from standing during play."
  ],
  [
    "Why is she up so early?",
    "Why {is} {s} up so early?"
  ],
  [
    "Plan night feeds with your pediatrician. Sleep training changes how baby falls asleep, not whether she eats.",
    "Plan night feeds with your pediatrician. Sleep training changes how baby falls asleep, not whether {s} {eats}."
  ],
  [
    "Pause if she’s sick, teething or it stops feeling right. You can stop anytime.",
    "Pause if {s} {is} sick, teething or it stops feeling right. You can stop anytime."
  ],
  [
    "Let her end the feed",
    "Let {o} end the feed"
  ],
  [
    "Turning away, slowing down or closing her mouth can mean she’s had enough. Sleepiness alone doesn’t tell you she took enough milk. She doesn’t need to finish a bottle.",
    "Turning away, slowing down or closing {p} mouth can mean {s} {has} had enough. Sleepiness alone doesn’t tell you {s} took enough milk. {S} {does}n’t need to finish a bottle."
  ],
  [
    "She’s hard to wake for feeds, her skin or eyes look more yellow, or wet diapers drop below 6 a day.",
    "{S} {is} hard to wake for feeds, {p} skin or eyes look more yellow, or wet diapers drop below 6 a day."
  ],
  [
    "Some babies take milk more efficiently as they grow. Shorter feeds alone don’t tell you how much milk she’s getting; growth and wet diapers help show the overall pattern.",
    "Some babies take milk more efficiently as they grow. Shorter feeds alone don’t tell you how much milk {s} {is} getting; growth and wet diapers help show the overall pattern."
  ],
  [
    "Steady growth along her own curve at checkups, and regular wet diapers.",
    "Steady growth along {p} own curve at checkups, and regular wet diapers."
  ],
  [
    "Follow her cues, not the clock",
    "Follow {p} cues, not the clock"
  ],
  [
    "Offer more when she asks. You can’t spoil a baby with milk.",
    "Offer more when {s} {asks}. You can’t spoil a baby with milk."
  ],
  [
    "Hold the bottle more level and pause every few minutes so she can decide when she’s full. Never prop a bottle.",
    "Hold the bottle more level and pause every few minutes so {s} can decide when {s} {is} full. Never prop a bottle."
  ],
  [
    "Until about 6 months, milk gives her everything she needs, and her mouth and body are still learning to handle food. Readiness depends on skills, not a birthday.",
    "Until about 6 months, milk gives {o} everything {s} {needs}, and {p} mouth and body are still learning to handle food. Readiness depends on skills, not a birthday."
  ],
  [
    "Bring her to the table",
    "Bring {o} to the table"
  ],
  [
    "Let her sit with you at meals in her high chair. Watching you eat is good practice.",
    "Let {o} sit with you at meals in {p} high chair. Watching you eat is good practice."
  ],
  [
    "Once she’s showing the readiness signs, first foods are about tastes and practice. Milk is still the main food.",
    "Once {s} {is} showing the readiness signs, first foods are about tastes and practice. Milk is still the main food."
  ],
  [
    "Offer solids when she’s alert and not too hungry.",
    "Offer solids when {s} {is} alert and not too hungry."
  ],
  [
    "Milk still carries her growth. At meals, watch her interest and fullness, not how much she eats.",
    "Milk still carries {p} growth. At meals, watch {p} interest and fullness, not how much {s} {eats}."
  ],
  [
    "Offer them in a safe form, then keep them in her diet. See Introducing allergens for how.",
    "Offer them in a safe form, then keep them in {p} diet. See Introducing allergens for how."
  ],
  [
    "Follow her lead at meals",
    "Follow {p} lead at meals"
  ],
  [
    "Offer, then let her decide how much. Turning away or closing her mouth means she’s done.",
    "Offer, then let {o} decide how much. Turning away or closing {p} mouth means {s} {is} done."
  ],
  [
    "She’s showing all the readiness signs.",
    "{S} {is} showing all the readiness signs."
  ],
  [
    "Build on the foods she can manage with soft lumps and finger foods, whether you began with purées, self-feeding or both.",
    "Build on the foods {s} can manage with soft lumps and finger foods, whether you began with purées, self-feeding or both."
  ],
  [
    "Growth at checkups and regular wet diapers. How much she eats at one meal matters less than the week overall.",
    "Growth at checkups and regular wet diapers. How much {s} {eats} at one meal matters less than the week overall."
  ],
  [
    "Eating easily from a spoon and picking food up herself.",
    "Eating easily from a spoon and picking food up {r}."
  ],
  [
    "As she eats more food, she needs a little less milk. Eating together helps her learn by copying you.",
    "As {s} {eats} more food, {s} {needs} a little less milk. Eating together helps {o} learn by copying you."
  ],
  [
    "Offer what you’re eating, cut and cooked for her.",
    "Offer what you’re eating, cut and cooked for {o}."
  ],
  [
    "Some days she wants to feed almost constantly, often in the evening. It’s normal, and usually lasts 2–3 days.",
    "Some days {s} {wants} to feed almost constantly, often in the evening. It’s normal, and usually lasts 2–3 days."
  ],
  [
    "Feed when she asks, even if it feels constant. Her usual pattern comes back.",
    "Feed when {s} {asks}, even if it feels constant. {P} usual pattern comes back."
  ],
  [
    "More feeding is how supply catches up with her.",
    "More feeding is how supply catches up with {o}."
  ],
  [
    "She pulls off to look around, feeds for a minute, then stops. Everything is suddenly more interesting than milk.",
    "{S} {pulls} off to look around, {feeds} for a minute, then {stops}. Everything is suddenly more interesting than milk."
  ],
  [
    "Her vision and curiosity are taking off. It’s development, not rejection.",
    "{P} vision and curiosity are taking off. It’s development, not rejection."
  ],
  [
    "Shorter feeds during the day are fine if she makes up for them at other feeds.",
    "Shorter feeds during the day are fine if {s} {makes} up for them at other feeds."
  ],
  [
    "Offer a feed when she’s sleepy",
    "Offer a feed when {s} {is} sleepy"
  ],
  [
    "Before naps or right after waking, she’s less distracted.",
    "Before naps or right after waking, {s} {is} less distracted."
  ],
  [
    "Sore gums can make her fussy at the breast or bottle, and off her food for a few days.",
    "Sore gums can make {o} fussy at the breast or bottle, and off {p} food for a few days."
  ],
  [
    "She’ll usually catch up once the tooth is through.",
    "{S}’ll usually catch up once the tooth is through."
  ],
  [
    "She’ll make up for it once the tooth is through. Call your pediatrician if she refuses most feeds for more than a day.",
    "{S}’ll make up for it once the tooth is through. Call your pediatrician if {s} {refuses} most feeds for more than a day."
  ],
  [
    "A chilled teething ring or cold soft food before feeds can ease her gums.",
    "A chilled teething ring or cold soft food before feeds can ease {p} gums."
  ],
  [
    "Upright, with her feet supported if possible. Never feed her in a car seat, stroller or reclined.",
    "Upright, with {p} feet supported if possible. Never feed {o} in a car seat, stroller or reclined."
  ],
  [
    "Stay with her and keep her sitting upright for every meal and snack.",
    "Stay with {o} and keep {o} sitting upright for every meal and snack."
  ],
  [
    "Offer a bottle once nursing is going well, often around 3–6 weeks. Someone else giving it can help. When you’re apart, pump about as often as she’d feed.",
    "Offer a bottle once nursing is going well, often around 3–6 weeks. Someone else giving it can help. When you’re apart, pump about as often as {s}’d feed."
  ],
  [
    "Fewer wet diapers than usual · Not back to birth weight by 2 weeks · Refusing most feeds for a day · Hives or vomiting after a new food · Blood in her stool",
    "Fewer wet diapers than usual · Not back to birth weight by 2 weeks · Refusing most feeds for a day · Hives or vomiting after a new food · Blood in {p} stool"
  ],
  [
    "Trouble breathing or swelling of lips or tongue after a food · Choking that doesn’t clear · She’s limp or won’t wake",
    "Trouble breathing or swelling of lips or tongue after a food · Choking that doesn’t clear · {S} {is} limp or won’t wake"
  ],
  [
    "Keep choking hazards off her plate",
    "Keep choking hazards off {p} plate"
  ],
  [
    "Do I need to wake her to feed?",
    "Do I need to wake {o} to feed?"
  ],
  [
    "Is she back to her birth weight?",
    "{Is} {s} back to {p} birth weight?"
  ],
  [
    "Wake her to feed every 2–3 hours, day and night, until your pediatrician says you can stop.",
    "Wake {o} to feed every 2–3 hours, day and night, until your pediatrician says you can stop."
  ],
  [
    "Ask your pediatrician if you can let her wake you for feeds.",
    "Ask your pediatrician if you can let {o} wake you for feeds."
  ],
  [
    "Can I give her water?",
    "Can I give {o} water?"
  ],
  [
    "Yes, I’m worried she’s thirsty",
    "Yes, I’m worried {s} {is} thirsty"
  ],
  [
    "Not yet. Breast milk or formula covers all her fluids until about 6 months.",
    "Not yet. Breast milk or formula covers all {p} fluids until about 6 months."
  ],
  [
    "How does she seem after feeds?",
    "How {does} {s} seem after feeds?"
  ],
  [
    "All three are common. Burp her halfway through and after feeds, and keep her upright for a bit afterward.",
    "All three are common. Burp {o} halfway through and after feeds, and keep {o} upright for a bit afterward."
  ],
  [
    "Why is she suddenly hungrier?",
    "Why {is} {s} suddenly hungrier?"
  ],
  [
    "This is likely a growth spurt. Feed when she asks; it usually settles in 2–3 days.",
    "This is likely a growth spurt. Feed when {s} {asks}; it usually settles in 2–3 days."
  ],
  [
    "It doesn’t mean she needs solids or that your milk is low.",
    "It doesn’t mean {s} {needs} solids or that your milk is low."
  ],
  [
    "Check with your pediatrician at her next checkup, and bring a day of feeds and wet diapers.",
    "Check with your pediatrician at {p} next checkup, and bring a day of feeds and wet diapers."
  ],
  [
    "Steady growth is the best sign she’s getting enough.",
    "Steady growth is the best sign {s} {is} getting enough."
  ],
  [
    "Can she go longer at night?",
    "Can {s} go longer at night?"
  ],
  [
    "Is she gaining well at checkups?",
    "{Is} {s} gaining well at checkups?"
  ],
  [
    "Ask your pediatrician if you can let her wake you rather than waking her.",
    "Ask your pediatrician if you can let {o} wake you rather than waking {o}."
  ],
  [
    "Why won’t she take a bottle?",
    "Why won’t {s} take a bottle?"
  ],
  [
    "The person who nurses her",
    "The person who nurses {o}"
  ],
  [
    "Try when she’s a little hungry, not starving, and try a few different nipples.",
    "Try when {s} {is} a little hungry, not starving, and try a few different nipples."
  ],
  [
    "Someone else, and she still refuses",
    "Someone else, and {s} still {refuses}"
  ],
  [
    "A cup or spoon can work for short separations. Ask your pediatrician if she’s refusing for days.",
    "A cup or spoon can work for short separations. Ask your pediatrician if {s} {is} refusing for days."
  ],
  [
    "She seems hungrier. Should we start solids early?",
    "{S} {seems} hungrier. Should we start solids early?"
  ],
  [
    "No, she just seems hungry",
    "No, {s} just {seems} hungry"
  ],
  [
    "Let her open her mouth for the spoon rather than pushing it in.",
    "Let {o} open {p} mouth for the spoon rather than pushing it in."
  ],
  [
    "I’d like her to feed herself",
    "I’d like {o} to feed {r}"
  ],
  [
    "Baby-led weaning works too, once she sits well. Offer soft, finger-sized pieces she can squash.",
    "Baby-led weaning works too, once {s} {sits} well. Offer soft, finger-sized pieces {s} can squash."
  ],
  [
    "Does she cough or sputter, then carry on?",
    "{Does} {s} cough or sputter, then carry on?"
  ],
  [
    "That’s gagging. It’s noisy and normal while she learns. Stay calm and let her work it out.",
    "That’s gagging. It’s noisy and normal while {s} {learns}. Stay calm and let {o} work it out."
  ],
  [
    "She goes quiet or can’t breathe",
    "{S} {goes} quiet or can’t breathe"
  ],
  [
    "Why is her poop different?",
    "Why is {p} poop different?"
  ],
  [
    "Is she straining or uncomfortable?",
    "{Is} {s} straining or uncomfortable?"
  ],
  [
    "Call your pediatrician for blood in her poop, or no poop for several days with discomfort.",
    "Call your pediatrician for blood in {p} poop, or no poop for several days with discomfort."
  ],
  [
    "Changes in color, smell and texture are normal once solids start. What she eats often shows up.",
    "Changes in color, smell and texture are normal once solids start. What {s} {eats} often shows up."
  ],
  [
    "She spits everything out. Should I stop?",
    "{S} {spits} everything out. Should I stop?"
  ],
  [
    "How many times has she tried this food?",
    "How many times {has} {s} tried this food?"
  ],
  [
    "Keep offering it alongside foods she likes. Many babies need 10 or more tries.",
    "Keep offering it alongside foods {s} {likes}. Many babies need 10 or more tries."
  ],
  [
    "Her face may say no while she’s still learning. That’s normal.",
    "{P} face may say no while {s} {is} still learning. That’s normal."
  ],
  [
    "Many times, and she refuses most food",
    "Many times, and {s} {refuses} most food"
  ],
  [
    "Take a short break and try again in a few days. Mention it at her next checkup if it keeps happening.",
    "Take a short break and try again in a few days. Mention it at {p} next checkup if it keeps happening."
  ],
  [
    "Milk still covers most of what she needs right now.",
    "Milk still covers most of what {s} {needs} right now."
  ],
  [
    "Why won’t she eat lumps?",
    "Why won’t {s} eat lumps?"
  ],
  [
    "How does she react?",
    "How {does} {s} react?"
  ],
  [
    "Gagging is normal while she learns. Keep offering soft lumps alongside foods she likes.",
    "Gagging is normal while {s} {learns}. Keep offering soft lumps alongside foods {s} {likes}."
  ],
  [
    "Go back to a slightly smoother texture for a week, then try again. If it keeps happening, mention it at her next checkup.",
    "Go back to a slightly smoother texture for a week, then try again. If it keeps happening, mention it at {p} next checkup."
  ],
  [
    "Is she drinking too much milk?",
    "{Is} {s} drinking too much milk?"
  ],
  [
    "She eats well at meals",
    "{S} {eats} well at meals"
  ],
  [
    "Sometimes offer a meal before milk, so she comes to the table hungry.",
    "Sometimes offer a meal before milk, so {s} {comes} to the table hungry."
  ],
  [
    "She barely eats",
    "{S} barely {eats}"
  ],
  [
    "Offer food before her milk feed, when she’s hungry but not starving.",
    "Offer food before {p} milk feed, when {s} {is} hungry but not starving."
  ],
  [
    "Too much milk can crowd out iron-rich foods. Mention it at her checkup.",
    "Too much milk can crowd out iron-rich foods. Mention it at {p} checkup."
  ],
  [
    "Can she have finger foods without teeth?",
    "Can {s} have finger foods without teeth?"
  ],
  [
    "Then her gums can handle it. Offer pieces about the size of your finger.",
    "Then {p} gums can handle it. Offer pieces about the size of your finger."
  ],
  [
    "She’s a picky eater. Is that normal?",
    "{S} {is} a picky eater. Is that normal?"
  ],
  [
    "Does she eat well on some days?",
    "{Does} {s} eat well on some days?"
  ],
  [
    "That’s normal. Keep offering a mix, including one food she likes, and let her decide how much.",
    "That’s normal. Keep offering a mix, including one food {s} {likes}, and let {o} decide how much."
  ],
  [
    "She eats very little most days",
    "{S} {eats} very little most days"
  ],
  [
    "Mention it at her next checkup, especially if she seems tired or isn’t growing.",
    "Mention it at {p} next checkup, especially if {s} {seems} tired or {is}n’t growing."
  ],
  [
    "Is she under 12 months?",
    "{Is} {s} under 12 months?"
  ],
  [
    "She just turned 1",
    "{S} just turned 1"
  ],
  [
    "When should she stop using bottles?",
    "When should {s} stop using bottles?"
  ],
  [
    "Is she drinking from a cup?",
    "{Is} {s} drinking from a cup?"
  ],
  [
    "Start once she’s eating other solids, around 6 months.",
    "Start once {s} {is} eating other solids, around 6 months."
  ],
  [
    "Once she tolerates it, keep it in her diet a few times a week.",
    "Once {s} {tolerates} it, keep it in {p} diet a few times a week."
  ],
  [
    "A few hives around her mouth: stop the food and call your pediatrician.",
    "A few hives around {p} mouth: stop the food and call your pediatrician."
  ],
  [
    "Trouble breathing, swelling of lips or tongue, repeated vomiting, or she’s limp or pale: call 911.",
    "Trouble breathing, swelling of lips or tongue, repeated vomiting, or {s} {is} limp or pale: call 911."
  ],
  [
    "Ask your pediatrician first if she has severe eczema or an egg allergy.",
    "Ask your pediatrician first if {s} {has} severe eczema or an egg allergy."
  ],
  [
    "Hold her semi-upright and pace the feed; pause every few minutes.",
    "Hold {o} semi-upright and pace the feed; pause every few minutes."
  ],
  [
    "Never prop a bottle or put her to bed with one.",
    "Never prop a bottle or put {o} to bed with one."
  ]
]);
BABY_COPY_TEMPLATES.set('Before she pulls up','Before {s} {pulls} up');
BABY_COPY_TEMPLATES.set('Sleep · Before she pulls up','Sleep · Before {s} {pulls} up');
// Authored variants for the approved Sleep/Feeding copy refinement.
BABY_COPY_TEMPLATES.set("Watch for a yawn, a glazed stare or turning away. Use the awake-time range above as a guide, alongside her cues.","Watch for a yawn, a glazed stare or turning away. Use the awake-time range above as a guide, alongside {p} cues.");
BABY_COPY_TEMPLATES.set("If someone can help, take turns changing and settling her. If you handle the feeds, they can bring her to you and settle her afterward so you can rest.","If someone can help, take turns changing and settling {o}. If you handle the feeds, they can bring {o} to you and settle {o} afterward so you can rest.");
BABY_COPY_TEMPLATES.set("Watch for her quieter gaze, yawning or turning away. Start winding down before she becomes upset; a short nap may bring the next sleepy time sooner.","Watch for {p} quieter gaze, yawning or turning away. Start winding down before {s} {becomes} upset; a short nap may bring the next sleepy time sooner.");
BABY_COPY_TEMPLATES.set("One skipped catnap isn’t a transition. If she skips it most days and stays comfortable until bedtime, she may be ready to try two naps. A third nap may still help after short naps.","One skipped catnap isn’t a transition. If {s} {skips} it most days and {stays} comfortable until bedtime, {s} may be ready to try two naps. A third nap may still help after short naps.");
BABY_COPY_TEMPLATES.set("Use your familiar bedtime routine and the help she needs to settle. You don’t need to start sleep training to handle this change.","Use your familiar bedtime routine and the help {s} {needs} to settle. You don’t need to start sleep training to handle this change.");
BABY_COPY_TEMPLATES.set("Move her to a flat sleep space after the car","Move {o} to a flat sleep space after the car");
BABY_COPY_TEMPLATES.set("Car seats are for travel. When you arrive, move her to her own flat, firm sleep space. Swings aren’t for sleep.","Car seats are for travel. When you arrive, move {o} to {p} own flat, firm sleep space. Swings aren’t for sleep.");
BABY_COPY_TEMPLATES.set("Contact naps are common. Stay fully awake while holding her, and try a nap in her own flat, firm sleep space when you’re ready.","Contact naps are common. Stay fully awake while holding {o}, and try a nap in {p} own flat, firm sleep space when you’re ready.");
BABY_COPY_TEMPLATES.set("After settling her, try a gentle transfer to her own flat, firm sleep space. If she wakes, soothe her and try again.","After settling {o}, try a gentle transfer to {p} own flat, firm sleep space. If {s} {wakes}, soothe {o} and try again.");
BABY_COPY_TEMPLATES.set("How long has she been awake?","How long {has} {s} been awake?");
BABY_COPY_TEMPLATES.set("Less than her usual awake time","Less than {p} usual awake time");
BABY_COPY_TEMPLATES.set("She may not be tired yet. Try a little quiet play, then offer the nap when tired cues appear.","{S} may not be tired yet. Try a little quiet play, then offer the nap when tired cues appear.");
BABY_COPY_TEMPLATES.set("Use the awake-time range above as a guide, alongside her cues.","Use the awake-time range above as a guide, alongside {p} cues.");
BABY_COPY_TEMPLATES.set("About her usual time","About {p} usual time");
BABY_COPY_TEMPLATES.set("She may be overtired. Try a quieter, darker room and more help settling. Next time, start winding down a little sooner.","{S} may be overtired. Try a quieter, darker room and more help settling. Next time, start winding down a little sooner.");
BABY_COPY_TEMPLATES.set("Does she still need the catnap?","{Does} {s} still need the catnap?");
BABY_COPY_TEMPLATES.set("Offer a short nap in her sleep space with your usual help. If it doesn’t happen, move bedtime earlier.","Offer a short nap in {p} sleep space with your usual help. If it doesn’t happen, move bedtime earlier.");
BABY_COPY_TEMPLATES.set("Practice the new skill during the day. At night, use your usual help to settle her again.","Practice the new skill during the day. At night, use your usual help to settle {o} again.");
BABY_COPY_TEMPLATES.set("If she’s still alert, try bedtime 15–30 minutes later tonight and see how she does.","If {s} {is} still alert, try bedtime 15–30 minutes later tonight and see how {s} {does}.");
BABY_COPY_TEMPLATES.set("Check the awake-time range above and her tired cues before changing the nap routine.","Check the awake-time range above and {p} tired cues before changing the nap routine.");
BABY_COPY_TEMPLATES.set("If she protests when you leave, use a familiar short goodbye and your usual reassurance. Check for hunger or discomfort too.","If {s} {protests} when you leave, use a familiar short goodbye and your usual reassurance. Check for hunger or discomfort too.");
BABY_COPY_TEMPLATES.set("Keep the room dark and quiet at dawn. Feed her if she’s hungry, then keep things calm until she’s ready to start the day.","Keep the room dark and quiet at dawn. Feed {o} if {s} {is} hungry, then keep things calm until {s} {is} ready to start the day.");
BABY_COPY_TEMPLATES.set("Choose a consistent morning start she can comfortably manage.","Choose a consistent morning start {s} can comfortably manage.");
BABY_COPY_TEMPLATES.set("Check whether dawn light or noise wakes her. A darker, quieter room may help; also look at when the last nap ends and how tired she seems at bedtime.","Check whether dawn light or noise wakes {o}. A darker, quieter room may help; also look at when the last nap ends and how tired {s} {seems} at bedtime.");
BABY_COPY_TEMPLATES.set("Rooting, lip smacking and hands to mouth can come before crying. Offer milk when you see them, even if she ate an hour ago.","Rooting, lip smacking and hands to mouth can come before crying. Offer milk when you see them, even if {s} ate an hour ago.");
BABY_COPY_TEMPLATES.set("Offer milk at hunger cues. Extra hunger alone isn’t a sign she’s ready for solids.","Offer milk at hunger cues. Extra hunger alone isn’t a sign {s} {is} ready for solids.");
BABY_COPY_TEMPLATES.set("She’s tasting her first foods. Breast milk or formula is still her main food.","{S} {is} tasting {p} first foods. Breast milk or formula is still {p} main food.");
BABY_COPY_TEMPLATES.set("Try mashed beans, iron-fortified infant cereal mixed with breast milk or formula, or soft shredded meat. Offer small spoonfuls or let her hold a spoon you’ve loaded.","Try mashed beans, iron-fortified infant cereal mixed with breast milk or formula, or soft shredded meat. Offer small spoonfuls or let {o} hold a spoon you’ve loaded.");
BABY_COPY_TEMPLATES.set("She’s managing first tastes and trying soft lumps or finger foods. Build on foods she can handle, whether you started with purées, self-feeding or both.","{S} {is} managing first tastes and trying soft lumps or finger foods. Build on foods {s} can handle, whether you started with purées, self-feeding or both.");
BABY_COPY_TEMPLATES.set("She’s eating regular meals and varied textures, with milk alongside. Keep breast milk or formula through the first year; breastfeeding can continue after that.","{S} {is} eating regular meals and varied textures, with milk alongside. Keep breast milk or formula through the first year; breastfeeding can continue after that.");
BABY_COPY_TEMPLATES.set("Call your pediatrician if feeds hurt, she takes less milk overall or she has fewer wet diapers than usual.","Call your pediatrician if feeds hurt, {s} {takes} less milk overall or {s} {has} fewer wet diapers than usual.");
BABY_COPY_TEMPLATES.set("Some days she wants several feeds close together, often in the evening. Wet diapers and growth tell you it’s going well.","Some days {s} {wants} several feeds close together, often in the evening. Wet diapers and growth tell you it’s going well.");
BABY_COPY_TEMPLATES.set("Try feeds in a quiet, dim room. If she takes less milk overall or has fewer wet diapers, call your pediatrician.","Try feeds in a quiet, dim room. If {s} {takes} less milk overall or {has} fewer wet diapers, call your pediatrician.");
BABY_COPY_TEMPLATES.set("She’s noticing more around her, which can interrupt feeds.","{S} {is} noticing more around {o}, which can interrupt feeds.");
BABY_COPY_TEMPLATES.set("Keep offering her usual milk feeds. Call your pediatrician if she takes much less milk, has fewer wet diapers or seems unwell.","Keep offering {p} usual milk feeds. Call your pediatrician if {s} {takes} much less milk, {has} fewer wet diapers or {seems} unwell.");
BABY_COPY_TEMPLATES.set("Offer milk at hunger cues. Hungrier days can happen; watch wet diapers and growth as well as how often she feeds.","Offer milk at hunger cues. Hungrier days can happen; watch wet diapers and growth as well as how often {s} {feeds}.");
BABY_COPY_TEMPLATES.set("Extra hunger alone doesn’t mean she needs solids or that your milk supply is low.","Extra hunger alone doesn’t mean {s} {needs} solids or that your milk supply is low.");
BABY_COPY_TEMPLATES.set("Talk to your pediatrician if feeds keep leaving her unsatisfied. Bring a day of feeds and wet diapers.","Talk to your pediatrician if feeds keep leaving {o} unsatisfied. Bring a day of feeds and wet diapers.");
BABY_COPY_TEMPLATES.set("You offer small spoonfuls and adjust the texture. This takes your help for each bite; move toward mashed and lumpier food as she learns.","You offer small spoonfuls and adjust the texture. This takes your help for each bite; move toward mashed and lumpier food as {s} {learns}.");
BABY_COPY_TEMPLATES.set("She brings prepared finger foods to her mouth. This may suit you if you’re comfortable preparing safe shapes and letting her explore, including mess and dropped food.","{S} {brings} prepared finger foods to {p} mouth. This may suit you if you’re comfortable preparing safe shapes and letting {o} explore, including mess and dropped food.");
BABY_COPY_TEMPLATES.set("Readiness and safe food preparation matter with every approach. Milk feeds continue, and she decides how much to eat.","Readiness and safe food preparation matter with every approach. Milk feeds continue, and {s} {decides} how much to eat.");
BABY_COPY_TEMPLATES.set("A surprised face isn’t the same as closing her mouth or turning away. Respect those stop cues.","A surprised face isn’t the same as closing {p} mouth or turning away. Respect those stop cues.");
BABY_COPY_TEMPLATES.set("Offer textures she can manage, and contact your pediatrician about repeated vomiting or refusal. Ask whether a feeding assessment would help.","Offer textures {s} can manage, and contact your pediatrician about repeated vomiting or refusal. Ask whether a feeding assessment would help.");
BABY_COPY_TEMPLATES.set("Keep regular milk feeds and offer meals when she’s alert and interested. Leave some space between milk and food so she isn’t too full or very hungry.","Keep regular milk feeds and offer meals when {s} {is} alert and interested. Leave some space between milk and food so {s} {is} not too full or very hungry.");
BABY_COPY_TEMPLATES.set("Talk to your pediatrician about how much milk she takes, what she eats and her growth before cutting milk feeds.","Talk to your pediatrician about how much milk {s} {takes}, what {s} {eats} and {p} growth before cutting milk feeds.");
BABY_COPY_TEMPLATES.set("Yes. Her gums can mash soft food. Choose the shape and size for her grasp; use the food-preparation guide for examples.","Yes. {P} gums can mash soft food. Choose the shape and size for {p} grasp; use the food-preparation guide for examples.");
BABY_COPY_TEMPLATES.set("Teeth alone don’t decide whether she’s ready for finger foods.","Teeth alone don’t decide whether {s} {is} ready for finger foods.");
BABY_COPY_TEMPLATES.set("She’s old enough for honey now, though it still counts as added sugar to avoid. Keep preparing choking hazards safely.","{S} {is} old enough for honey now, though it still counts as added sugar to avoid. Keep preparing choking hazards safely.");
const BABY_VERBS = {gets:'get',adjusts:'adjust',wakes:'wake',rolls:'roll',settles:'settle',falls:'fall',wants:'want',naps:'nap',skips:'skip',needs:'need',eats:'eat',asks:'ask',pulls:'pull',feeds:'feed',stops:'stop',makes:'make',refuses:'refuse',seems:'seem',sits:'sit',learns:'learn',goes:'go',spits:'spit',likes:'like',comes:'come',tolerates:'tolerate',stays:'stay',protests:'protest',takes:'take',brings:'bring',decides:'decide',becomes:'become'};
function babyPronouns(){const key=profile.pronouns;return key==='he'?{s:'he',o:'him',p:'his',r:'himself',is:'is',has:'has',does:'does'}:key==='she'?{s:'she',o:'her',p:'her',r:'herself',is:'is',has:'has',does:'does'}:{s:'they',o:'them',p:'their',r:'themselves',is:'are',has:'have',does:'do'};}
function babyPronounLabel(){return profile.pronouns==='he'?'He/him':profile.pronouns==='she'?'She/her':'They/them';}
function babyCopy(source){const template=BABY_COPY_TEMPLATES.get(source);if(!template)return source;const p=babyPronouns();return template.replace(/\{([A-Za-z]+)\}/g,(token,key)=>{const lower=key.toLowerCase();let value=p[lower]||(BABY_VERBS[lower]?(p.s==='they'?BABY_VERBS[lower]:lower):null);if(!value)throw new Error('Unknown baby-copy token: '+key);return key[0]===key[0].toUpperCase()?value[0].toUpperCase()+value.slice(1):value;});}


/* Ahead · Sleep and Feeding guides, written as a conversation.
   Each stage answers the same questions in the same order:
     short  — the short answer (shown in the page header)
     do     — what to do now
     know   — what to know: the why, safety, and how it connects to the rest of the day
     normal — what's normal, so a parent doesn't worry about it
     help   — when to call your pediatrician
   "Maya" becomes the baby's name. {s} {o} {p} {S} {is} {has} {does} become the baby's pronouns.
   An item can carry a link: [title, body, onclick, link label]. */
window.AHEAD_GUIDES = {
 Sleep: {
  clock: {
   short: 'Newborns sleep 14–17 hours a day, but only 1–3 hours at a time, day and night. There’s no pattern yet, and that’s exactly how it should be.',
   do: [
    ['Put Maya down safely for every sleep', 'On {p} back, on a firm, flat surface with nothing else in it, ideally in your room. Of everything on this page, this matters most.', "openPage('chg:Sleep:safe')", 'Go through the safe sleep checklist'],
    ['Start settling at the first yawn', 'A yawn, a glazed stare or turning away are early signs. Most newborns are ready to sleep again after 45–60 minutes awake, and much of that time is feeding.'],
    ['Help Maya fall asleep any way that works', 'Feeding, rocking or holding {o} to sleep is normal and fine now. You can’t spoil a newborn.'],
    ['Share the nights if you can', 'If someone can help, take turns changing and settling. If you’re doing the feeds, they can bring Maya to you and settle {o} afterward so you can get back to sleep.']
   ],
   know: [
    ['Feeds come first', 'If a sleep runs long, wake Maya to feed until your pediatrician says you can stop. That’s usually once birth weight is back, around 2 weeks.'],
    ['Why there’s no pattern yet', 'A newborn’s body clock hasn’t switched on, so day and night feel the same. Hunger sets the pace for now.']
   ],
   normal: [
    ['Waking every 2–3 hours, day and night', 'Small tummies need frequent feeds.'],
    ['Noisy sleep', 'Grunts, squeaks and little twitches are part of newborn sleep.'],
    ['No two days looking the same', 'A longer stretch at night usually starts to show up around 6–8 weeks.']
   ],
   help: 'Call your pediatrician if Maya is hard to wake for feeds or has a temperature of 100.4°F or higher. Call 911 for trouble breathing, blue or gray lips, or if {s} won’t wake up.'
  },
  daynight: {
   short: 'Somewhere between 6 weeks and 3 months, many babies start telling day from night. Usually the first sign is one longer stretch at night, of 3 to 5 hours, though the timing varies.',
   do: [
    ['Keep days bright and nights dim', 'Daylight, chatter and everyday noise in the day; low light and quiet, boring feeds at night. It helps Maya’s body clock along.'],
    ['Start a short bedtime routine', 'The same few steps each evening, like a feed, a diaper and a song. It doesn’t need to be long, just familiar.'],
    ['Let Maya wake you for night feeds', 'Once your pediatrician says you can stop waking {o}, let {o} wake you. Most babies this age still feed 2–3 times a night.']
   ],
   know: [
    ['Bedtime starts late', 'At first bedtime is often between 8 and 10 pm, and it creeps earlier over these weeks. Nap times still move from day to day; they settle down next.'],
    ['Why nights come first', 'Maya’s body clock is starting to respond to daylight, so night sleep gets longer before naps get organized.']
   ],
   normal: [
    ['4–5 naps that still move around', 'A nap schedule comes later.'],
    ['A long stretch one night, and not the next', 'Progress isn’t a straight line.'],
    ['Fussier evenings', 'Crying often peaks around 6–8 weeks, especially in the evening, and then eases off.']
   ],
   help: 'Call your pediatrician if Maya snores most nights, pauses or gasps during sleep, or if sleep changes come with a fever or poor feeding. Call 911 for trouble breathing or blue or gray lips.'
  },
  rhythm: {
   short: 'Naps may start falling into a pattern now: usually three a day, two longer ones and a short late catnap. Most babies this age get sleepy after about 2 hours awake, though timing still varies and short naps are common.',
   do: [
    ['Watch for sleepy cues, then wind down', 'A quieter gaze, yawning or turning away mean it’s time. Start winding down before Maya gets upset; after a short nap, the next sleepy time may come sooner.'],
    ['Keep the same few steps before every sleep', 'A diaper, a song and your usual help settling. Nap times can move while the routine stays familiar.']
   ],
   know: [
    ['Rolling changes the sleep setup', 'Babies often start trying to roll between 3 and 6 months. At the first attempt, stop swaddling and switch to a sleep sack that leaves the arms free. Keep putting Maya down on {p} back; once {s} rolls both ways, you can leave {o} there.', "openSection('Sleep','sleep-rolling')", 'See how sleep changes as Maya moves'],
    ['Night feeds are a separate decision', 'Night feeds can carry on alongside a nap routine. If you’re thinking about dropping one, check with your pediatrician first.'],
    ['Why naps are getting easier to read', 'As sleep matures, sleepy times become easier to spot. Short naps and night waking can still happen alongside a growing routine.']
   ],
   normal: [
    ['Short naps', 'Naps of 30–45 minutes are common at this age.'],
    ['Fighting a nap now and then', 'Try again a little later, or settle for a short one.'],
    ['Bedtime moving earlier', 'Often somewhere between 7 and 8 pm.']
   ],
   help: 'Call your pediatrician if Maya snores most nights, pauses or gasps during sleep, or if sleep changes come with a fever or poor feeding. Call 911 for trouble breathing or blue or gray lips.'
  },
  two: {
   short: 'Somewhere between 6 and 9 months, the late catnap usually stops fitting and the day settles into two naps: one in the morning, one in the afternoon. One skipped catnap isn’t the switch; a pattern of them is.',
   do: [
    ['Look for a pattern, not one day', 'If Maya fights the catnap most days and still gets to bedtime happily, {s} may be ready for two naps. After a short nap, a third one can still help.'],
    ['Move bedtime earlier during the switch', 'Two-nap days make for a long afternoon. Try putting Maya down about 30 minutes earlier while {s} adjusts.'],
    ['Lower the crib mattress before Maya sits', 'Most babies sit without support between 6 and 9 months, and pull up soon after. Lower the mattress before sitting, and set it to its lowest before pulling up.', "openSection('Sleep','sleep-crib-height')", 'See the crib setup']
   ],
   know: [
    ['Why the catnap drops', 'Longer awake periods leave less room for a late nap. Readiness shows in how Maya manages the day, not in age alone.'],
    ['Night feeds can carry on', 'Some babies still feed at night on two naps. Talk to your pediatrician before dropping a night feed.']
   ],
   normal: [
    ['Catnap one day, no catnap the next', 'The switch usually takes a couple of weeks.'],
    ['Bedtime creeping later before the switch', 'It moves earlier again once two naps settle in.'],
    ['New skills disturbing sleep', 'Sitting, crawling and pulling up can mean a few unsettled nights.']
   ],
   help: 'Call your pediatrician if Maya snores most nights, pauses or gasps during sleep, or if sleep changes come with a fever or poor feeding. Call 911 for trouble breathing or blue or gray lips.'
  },
  two10: {
   short: 'Two naps, one in the morning and one in the afternoon, usually carry on well past the first birthday. A short nap or a busy day can shift the timing without changing the number of naps.',
   do: [
    ['After a short or missed nap, offer the next sleep earlier', 'One disrupted day doesn’t mean the two-nap routine has stopped working.'],
    ['Practice new skills while Maya is awake', 'Pulling up and cruising can wake {o} at night. Plenty of practice in the day, and a familiar bedtime, help it pass.']
   ],
   know: [
    ['Use the two naps as anchors', 'Timing can move after a short nap; the shape of the day stays the same.'],
    ['Most babies don’t drop to one nap until 13–18 months', 'A few refused naps around now are usually a phase, not a transition.']
   ],
   normal: [
    ['Unsettled nights with new skills', 'Practicing standing in the crib is very common.'],
    ['Separation anxiety at bedtime', 'Often strongest around 8–10 months.']
   ],
   help: 'Call your pediatrician if Maya snores most nights, pauses or gasps during sleep, or if sleep changes come with a fever or poor feeding. Call 911 for trouble breathing or blue or gray lips.'
  }
 },
 Feeding: {
  learn: {
   short: 'Newborns feed 8–12 times a day, often every 1–3 hours, day and night. Small, frequent feeds are exactly right, and you’ll both get the hang of it.',
   do: [
    ['Feed at the first hunger cues', 'Rooting, lip smacking and hands to the mouth usually come before crying. Offer milk when you see them, even if Maya ate an hour ago.'],
    ['Let Maya end the feed', 'Slowing down, turning away or closing {p} mouth can mean {s} {has} had enough. {S} doesn’t need to finish a bottle. Sleepiness alone doesn’t tell you how much milk {s} took.'],
    ['Get help early if nursing hurts', 'Pain past the first few seconds, or trouble latching, is worth a lactation visit now, not later.']
   ],
   know: [
    ['How to tell it’s going well', 'At least 6 wet diapers a day after day 5, and back to birth weight by about 2 weeks.'],
    ['Why feeds come so often', 'Newborns need frequent feeds to grow. If you’re nursing, feeding often also builds your milk supply.']
   ],
   normal: [
    ['Wanting to feed again an hour later', 'Especially in the evening.'],
    ['A little spit-up after feeds', 'Fine in a happy baby who’s growing.'],
    ['Feeds that take a while at first', 'They usually get quicker in the coming weeks.']
   ],
   help: 'Call your pediatrician if Maya is hard to wake for feeds, {p} skin or eyes look more yellow, or {s} has fewer wet diapers than expected for {p} age in days. Call 911 for trouble breathing or if {s} is limp or won’t wake.'
  },
  rhythm: {
   short: 'After the newborn weeks, feeds often get quicker or further apart, usually 6–8 a day. Hungrier days still happen, especially during growth spurts.',
   do: [
    ['Follow Maya’s cues, not the clock', 'Offer milk at hunger cues and pause at fullness cues, like turning away. Feeding often is normal.'],
    ['Pace bottle feeds', 'Hold the bottle fairly level and pause every few minutes so Maya can decide when {s} {is} full. Never prop a bottle.']
   ],
   know: [
    ['How to tell it’s going well', 'Steady growth along {p} own curve at checkups, and regular wet diapers. A shorter feed on its own doesn’t tell you how much milk {s} took.'],
    ['Why feeds get quicker', 'Many babies get more efficient at feeding as they grow.']
   ],
   normal: [
    ['Shorter, quicker feeds', 'Efficient, not underfed.'],
    ['Longer gaps between feeds', 'As long as wet diapers and growth stay steady.'],
    ['A little spit-up', 'Fine in a happy baby who’s growing.']
   ],
   help: 'Call your pediatrician if Maya has fewer wet diapers than usual, keeps refusing feeds, or is taking noticeably less milk. Call 911 for trouble breathing or if {s} is limp or won’t wake.'
  },
  ready: {
   short: 'Most babies start solids around 6 months, once they’re developmentally ready. Until then, breast milk or formula is all Maya needs. This is a good time to learn the signs and get set up.',
   do: [
    ['Watch for the readiness signs', 'Maya holds {p} head steady, sits with support, opens {p} mouth when food comes near, and swallows food rather than pushing it back out. Watching you eat isn’t a sign on its own.'],
    ['Choose how you’d like to start', 'Spoon-feeding purées, offering soft finger foods (often called baby-led weaning) and mixing both all work. You don’t have to pick just one.'],
    ['Get the basics ready', 'A high chair with a harness, a small soft-tipped spoon, and an open cup for sips of water from 6 months. The checklist above keeps track.'],
    ['Learn infant choking first aid', 'A short class or the AAP video. It’s much easier to learn now than in a hurry later.']
   ],
   know: [
    ['Gagging isn’t choking', 'Gagging is noisy and common while babies learn to eat. Choking is different: trouble breathing, or a weak or silent cough, even if there’s some sound. That’s when you call 911 and use the first aid you’ve learned.'],
    ['Start with iron-rich foods', 'Around 6 months, iron becomes an important part of Maya’s diet. Good first foods include mashed beans, iron-fortified cereal and soft shredded meat.'],
    ['Offer peanut and egg early', 'Once Maya is eating a few other foods, offering peanut and well-cooked egg early, and often, can help prevent those allergies. Check with your pediatrician first if {s} has severe eczema or an egg allergy.', "openPage('chg:Feeding:allergy')", 'See how to introduce allergens'],
    ['Milk stays the main food', 'Solids start as tastes and practice. Breast milk or formula carries most of Maya’s nutrition for months to come, so keep milk feeds as they are.']
   ],
   normal: [
    ['A hungrier phase around 4 months', 'Extra hunger on its own isn’t a sign Maya is ready for solids. Offer more milk.'],
    ['Staring at your plate', 'Interest is lovely, but look for the other signs too.'],
    ['Waking more at night', 'Often a sleep change, not hunger for solids.']
   ],
   help: 'Ask your pediatrician about timing if Maya was born early, has severe eczema or a known food allergy, or isn’t showing readiness signs by 7 months.'
  },
  first: {
   short: 'Maya is tasting first foods. A few bites once or twice a day is plenty, and breast milk or formula is still {p} main food.',
   do: [
    ['Start with an iron-rich food', 'Mashed beans, iron-fortified infant cereal mixed with breast milk or formula, or soft shredded meat. Offer small spoonfuls, or let Maya hold a spoon you’ve loaded.'],
    ['Introduce peanut and egg early', 'One new allergen at a time, a small amount, early in the day. Use a safe form, like peanut butter thinned into a purée or well-cooked egg, then keep each in {p} diet a few times a week.', "openPage('chg:Feeding:allergy')", 'See how to introduce allergens'],
    ['Let Maya decide how much', 'Offer, then follow {p} lead. Turning away or closing {p} mouth means {s} {is} done.'],
    ['Pick a time when Maya is alert', 'Not overtired, and not starving. Between milk feeds often works well.']
   ],
   know: [
    ['Foods to make safe', 'Whole nuts, whole grapes, popcorn, round slices of hot dog, raw carrot or apple, and spoonfuls of thick nut butter can cause choking. Quarter grapes lengthwise, cook vegetables until soft and thin nut butter.'],
    ['Not before 12 months', 'Honey, cow’s milk as a drink and juice. Avoid added sugar, and keep salt low.'],
    ['Milk carries on as before', 'Keep breast milk or formula feeds as they are. A few sips of water from an open cup at meals is fine.'],
    ['Stay close at every meal', 'Keep Maya sitting upright and stay with {o} for every meal and snack.']
   ],
   normal: [
    ['Gagging and funny faces', 'Part of learning to move food around the mouth.'],
    ['Eating almost nothing some days', 'Interest matters more than amount right now.'],
    ['Changes in poop', 'New colors and textures are expected as foods change.']
   ],
   help: 'Call your pediatrician if hives or vomiting follow a new food, or if Maya keeps refusing all food over a few weeks. Call 911 for trouble breathing, swelling of the lips or tongue, or choking that doesn’t clear.'
  },
  textures: {
   short: 'Maya is ready for more texture: soft lumps, mashed food and finger foods {s} can pick up. Build from foods {s} already manages, whether you started with purées, self-feeding or both.',
   do: [
    ['Move from smooth to lumpy', 'Start from a food Maya already likes and make it a little thicker or lumpier each week.'],
    ['Offer soft finger foods', 'Finger-sized strips are easiest at first. Once Maya can pinch with thumb and finger, small soft pieces work too.'],
    ['Practice with an open cup', 'A few sips of water at meals. Spills are part of learning.'],
    ['Eat together when you can', 'Maya learns a lot by copying you.']
   ],
   know: [
    ['Foods to make safe', 'Whole nuts, whole grapes, popcorn, round slices of hot dog, raw carrot or apple, and spoonfuls of thick nut butter can cause choking. Quarter grapes lengthwise, cook vegetables until soft and cut food into finger-sized strips.'],
    ['Milk still matters', 'Meals don’t need to replace milk feeds yet. Offer both.'],
    ['Look at the week, not the meal', 'How much Maya eats at one meal matters less than how the week goes overall.']
   ],
   normal: [
    ['Mess, and lots of dropped food', 'That’s exploring.'],
    ['Appetite that swings from day to day', 'Especially during teething or illness.'],
    ['Wanting to do it alone', 'Let Maya try, with a loaded spoon or finger food alongside.']
   ],
   help: 'Call your pediatrician if Maya keeps vomiting or refusing foods with texture, shows little interest in food after 9 months, or has hives or vomiting after a new food. Call 911 for trouble breathing or choking that doesn’t clear.'
  },
  meals: {
   short: 'Maya is eating three meals a day, plus a snack or two, with milk alongside. Much of what you eat can now be adapted for {o}.',
   do: [
    ['Adapt a family meal', 'Set Maya’s portion aside before adding salt. Aim for an iron-rich food, a soft vegetable or fruit, and a starchy food, each prepared for the way {s} eats.'],
    ['Offer a cup at meals', 'Water from an open or straw cup, so cups feel normal before bottles go.'],
    ['Plan the milk change at 12 months', 'From 12 months, whole cow’s milk can replace formula, about 16–24 oz a day from a cup. Breastfeeding can continue for as long as you both want.']
   ],
   know: [
    ['A light day is normal', 'Appetite swings. Growth at checkups tells you more than any one day.'],
    ['Still not before 12 months', 'Honey, cow’s milk as a drink and juice. Keep salt and added sugar low.'],
    ['Foods to make safe', 'Whole nuts, whole grapes, popcorn and round slices of hot dog still need cutting or avoiding.']
   ],
   normal: [
    ['Picky phases', 'Keep offering. It can take many tries before a new food is accepted.'],
    ['Wanting to self-feed everything', 'Messy, and good practice.'],
    ['Eating a lot one day and very little the next', 'It evens out over the week.']
   ],
   help: 'Call your pediatrician if Maya is having fewer wet diapers, keeps refusing food, or has hives or vomiting after a new food. Call 911 for trouble breathing, swelling of the lips or tongue, or choking that doesn’t clear.'
  }
 }
};

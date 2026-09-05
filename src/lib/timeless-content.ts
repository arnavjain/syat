/**
 * Authored reading material for the Timeless catalogue.
 *
 * These are open questions, not reporting. Nothing here asserts a fact about a named
 * person, organisation or event, and nothing here carries a figure. What each entry offers
 * is the shape of a disagreement: who is looking, what that position brings into view, what
 * it treats as important, and what it tends to miss. That is the part a reader cannot get
 * from a single source, and it needs no rights clearance because Syāt wrote it.
 */

export type TopicStandpoint = {
  label: string;
  sees: string;
  values: string;
  mayMiss: string;
};

export type TopicContent = {
  /** Why the question stays open rather than resolving. */
  opening: string;
  standpoints: readonly TopicStandpoint[];
  /** Where people who are all reasoning carefully still end up apart. */
  contested: string;
  /** The observation or experience that would genuinely move a reader's position. */
  changeYourMind: string;
};

export const timelessContent: Readonly<Record<string, TopicContent>> = {
  // Cities and public life
  "public-place": {
    opening: "A place can be open to everyone in law and still feel closed to most people. Ownership, policing, lighting, seating and who is asked to move along all decide the answer separately, and they rarely agree.",
    standpoints: [
      { label: "The person who stays longest", sees: "How a place behaves after the first hour, once you are no longer obviously passing through.", values: "Being able to remain without explaining yourself.", mayMiss: "The cost and effort of keeping a place usable for everyone else." },
      { label: "The one who maintains it", sees: "Wear, waste, repair cycles and what breaks when use outruns upkeep.", values: "A place that survives its own popularity.", mayMiss: "That restrictions meant to protect a place can quietly select who uses it." },
      { label: "The person moved along", sees: "Where the boundary actually falls, because they meet it.", values: "Not being treated as a problem for being present.", mayMiss: "The competing claims of people who also want to be there." }
    ],
    contested: "Whether public means owned in common, open by default, or simply not yet prohibited.",
    changeYourMind: "Sit somewhere public for two hours without buying anything, and notice when you first feel you should leave."
  },
  "street-after-dark": {
    opening: "The same street is not one place across a day. Darkness changes who is present, what feels permitted, and whose safety is treated as the default worth designing for.",
    standpoints: [
      { label: "The night worker", sees: "A street as a route home, judged by lighting, transport and how far a walk feels.", values: "Predictability more than liveliness.", mayMiss: "That the quiet they rely on is someone else's lost livelihood." },
      { label: "The resident above", sees: "Noise, spillover and the difference between activity and disturbance.", values: "Sleep, and a say in what happens below their window.", mayMiss: "That emptiness can be less safe than noise." },
      { label: "The person who feels watched", sees: "Which stretches have eyes on them and which do not.", values: "Being able to move without calculating a route.", mayMiss: "That the surveillance which reassures them constrains others." }
    ],
    contested: "Whether night safety comes from more activity or from less, since the two prescriptions point opposite ways.",
    changeYourMind: "Walk a familiar street at midnight and mark where you speed up. Then ask who is standing there."
  },
  "market-and-square": {
    opening: "Buying and selling can produce something a plaza cannot: a reason for unrelated people to be in the same place regularly. Whether that counts as civic life or merely commerce depends on what else the space permits.",
    standpoints: [
      { label: "The trader", sees: "Footfall, sightlines, and the rhythm of a working day.", values: "A place that supports a living reliably.", mayMiss: "That the same features can exclude people who are not buying." },
      { label: "The regular who buys little", sees: "A market as somewhere to be known without a transaction.", values: "Familiarity and low-cost company.", mayMiss: "The economics that keep the place open at all." },
      { label: "The planner", sees: "Circulation, safety, and how a space performs against its stated purpose.", values: "Legibility and outcomes that can be measured.", mayMiss: "That the useful parts of a market are often the unplanned ones." }
    ],
    contested: "Whether civic space requires being free of commerce or is often produced by it.",
    changeYourMind: "Find a market where people linger without buying, and work out what specifically allows that."
  },
  "waiting-in-city": {
    opening: "Every city distributes waiting, and it does not distribute it evenly. Who queues, where, in what weather and with what certainty is one of the clearest signals of how a place ranks the people in it.",
    standpoints: [
      { label: "The person in the queue", sees: "Time as the real price, on top of whatever is charged.", values: "Certainty about how long it will take.", mayMiss: "The constraints that produced the queue." },
      { label: "The one who administers it", sees: "Throughput, staffing and the limits of a system under load.", values: "Fairness expressed as a consistent process.", mayMiss: "That an orderly queue can still be an unjust one." },
      { label: "The person who never waits", sees: "Little, because the arrangement is invisible from where they stand.", values: "Efficiency, which they experience as normal.", mayMiss: "That their speed may be produced by someone else's delay." }
    ],
    contested: "Whether waiting is a neutral consequence of scarcity or a way of allocating dignity.",
    changeYourMind: "Add up the hours a week you spend waiting for anything essential, then ask who spends more."
  },
  "shade-and-heat": {
    opening: "Shade is treated as a pleasant extra until heat makes it the difference between a street being usable and not. At that point a tree, an awning or a wall becomes infrastructure that was never budgeted as such.",
    standpoints: [
      { label: "The outdoor worker", sees: "Where shade exists at the hours it is needed, not on average.", values: "Being able to work without harm.", mayMiss: "The maintenance burden that shade quietly creates." },
      { label: "The one who plants", sees: "Decades, root systems, water and what survives a changing climate.", values: "Choices that still hold in thirty years.", mayMiss: "That people need relief now, not at maturity." },
      { label: "The property owner", sees: "Cost, liability, leaf litter and obstructed frontage.", values: "Predictable upkeep.", mayMiss: "That shade's benefit falls mostly on people who are passing." }
    ],
    contested: "Whether shade is an amenity to be provided where affordable or a baseline that a habitable street requires.",
    changeYourMind: "Map the shade on a route you walk at two in the afternoon, and see how far the gaps run."
  },
  "bench-politics": {
    opening: "A bench decides who can stay somewhere without paying, which makes it a small piece of policy. Its presence, shape, armrests and placement encode a judgement about who belongs.",
    standpoints: [
      { label: "The person who needs to sit", sees: "Distance between rests, which sets how far the city extends for them.", values: "Being able to stop without justification.", mayMiss: "The competing uses of the same square metre." },
      { label: "The one who removed it", sees: "Complaints, sleeping, damage and pressure to act.", values: "Responsiveness to the people who complain.", mayMiss: "That removal answers a complaint by displacing a person." },
      { label: "The designer", sees: "Materials, drainage, sightlines and how a form invites or repels.", values: "Detail that works without instruction.", mayMiss: "That hostile detail reads as hostility to those it targets." }
    ],
    contested: "Whether discouraging some uses of a bench is reasonable management or a way of removing people from view.",
    changeYourMind: "Look for armrests placed where nobody rests an arm, and ask what they are actually for."
  },
  "access-to-toilet": {
    opening: "A public toilet determines how long someone can be in a place at all, and for whom that limit binds hardest. It is among the least discussed pieces of infrastructure and among the most decisive.",
    standpoints: [
      { label: "The person whose day depends on it", sees: "A map of the city drawn around availability, cost and safety.", values: "Being able to leave home for a full day.", mayMiss: "The genuine difficulty of keeping facilities safe and clean." },
      { label: "The operator", sees: "Cleaning costs, vandalism, staffing and a facility no budget wants to own.", values: "Something that can be sustained rather than opened once.", mayMiss: "That closure transfers the problem onto the people with fewest options." },
      { label: "The passer-by", sees: "Only whether one is open when needed.", values: "Convenience.", mayMiss: "That for others this is the constraint that shapes the whole day." }
    ],
    contested: "Whether sanitation in public is a service to be provided or a cost to be minimised.",
    changeYourMind: "Plan a day out assuming you cannot buy anything in order to use a toilet."
  },
  "neighbourhood-boundary": {
    opening: "Boundaries drawn for administration rarely match the ones people live by, yet both are real. A line becomes true when it starts deciding where a service stops or where a name applies.",
    standpoints: [
      { label: "The long resident", sees: "Edges marked by memory, routine and where people are from.", values: "Continuity and being able to say where you live.", mayMiss: "That their map may exclude newer arrivals." },
      { label: "The administrator", sees: "Catchments, wards and the need for lines that can be applied consistently.", values: "Boundaries that work the same for everyone.", mayMiss: "That a tidy line can cut through a community that functions as one." },
      { label: "The newcomer", sees: "Which side of a line they were placed on, and what follows from it.", values: "Access that does not depend on lineage.", mayMiss: "That older boundaries often encode real shared history." }
    ],
    contested: "Whether a neighbourhood is defined by the people in it or by the systems that serve it.",
    changeYourMind: "Draw your neighbourhood from memory, then compare it with the official boundary."
  },
  "street-vending": {
    opening: "Vending supplies food, repair, small credit and eyes on the street, usually at prices formal retail cannot match. It is also the use of public space most often treated as an obstruction.",
    standpoints: [
      { label: "The vendor", sees: "A pitch as an asset built over years, and enforcement as a recurring risk.", values: "Security of place, more than a licence in the abstract.", mayMiss: "The pressures on the pavement they occupy." },
      { label: "The pedestrian", sees: "Width, obstruction and whether a footpath still functions as one.", values: "Being able to pass, especially with a pram or a wheelchair.", mayMiss: "That the same stall may be why the street feels safe at night." },
      { label: "The shopkeeper behind", sees: "Frontage, competition and rent paid for a location partly blocked.", values: "Rules applied to everyone equally.", mayMiss: "That the footfall they depend on is partly drawn by the stalls." }
    ],
    contested: "Whether pavement is primarily for movement or is legitimately a place of work.",
    changeYourMind: "Time how long a stretch of footpath takes to walk with a pram, then with nothing."
  },
  "city-sound": {
    opening: "Some sounds are heard as city life and others as noise, and the sorting is rarely about volume. Which is which tends to track who is making the sound and whether their presence is already accepted.",
    standpoints: [
      { label: "The one who makes the sound", sees: "Work, worship, celebration or trade that has always sounded this way.", values: "Being audible as part of belonging.", mayMiss: "The genuine burden of living beside it." },
      { label: "The one who cannot sleep", sees: "Duration and timing more than decibels.", values: "Rest, and some say in their own environment.", mayMiss: "That a complaint can become a tool for removing a community." },
      { label: "The regulator", sees: "Thresholds, complaints and the need for a rule that can be enforced.", values: "A measurable line.", mayMiss: "That measurement cannot capture which sounds carry meaning." }
    ],
    contested: "Whether noise is a physical quantity or a social judgement wearing a number.",
    changeYourMind: "List the sounds you stopped noticing where you live, and ask why those and not others."
  },

  // History and memory
  "archive-silence": {
    opening: "An archive preserves what someone thought worth keeping, using categories that made sense at the time. Its gaps are not random, and reading them is a different skill from reading its holdings.",
    standpoints: [
      { label: "The archivist", sees: "Provenance, condition, and the limits of what survived at all.", values: "Keeping the record honest about its own gaps.", mayMiss: "That neutral description can still carry the original framing." },
      { label: "The descendant searching", sees: "An absence where a family should be.", values: "Being findable in the record of one's own country.", mayMiss: "That some absences reflect destruction rather than choice." },
      { label: "The historian", sees: "Patterns across collections, and what silence in one is confirmed by another.", values: "Inference disciplined by evidence.", mayMiss: "That a gap can be treated as a puzzle rather than a loss." }
    ],
    contested: "Whether an archive's silences can be responsibly filled by inference or should be left visible as silence.",
    changeYourMind: "Search an archive for someone like your grandparents and see how quickly the trail thins."
  },
  "family-history": {
    opening: "Family stories are edited every time they are told, which is exactly how they survive. The question is when a story stops being private memory and starts carrying weight as history.",
    standpoints: [
      { label: "The teller", sees: "A story shaped for the listener in front of them.", values: "Continuity and the point the story is meant to make.", mayMiss: "How much the telling has drifted." },
      { label: "The one written out", sees: "Their own absence from the version repeated at gatherings.", values: "Being included in the account of their own family.", mayMiss: "That omission is often protective rather than hostile." },
      { label: "The documenter", sees: "Dates, records and where the account can be checked.", values: "Claims that hold up outside the family.", mayMiss: "That what a story means can matter more than whether it is exact." }
    ],
    contested: "Whether a family story's value lies in its accuracy or in what it transmits.",
    changeYourMind: "Ask two relatives to tell the same family story separately and note where they diverge."
  },
  "monument-afterlife": {
    opening: "A monument is built to settle a question, and it works until the public it addressed has changed. What happens next is less about the object than about who is now expected to walk past it.",
    standpoints: [
      { label: "The person it honours nothing of", sees: "A daily assertion about whose past counts.", values: "Not being asked to accept a claim they never agreed to.", mayMiss: "That the same object may anchor someone else's grief." },
      { label: "The one who grew up beside it", sees: "A landmark, a meeting point, a fact of the neighbourhood.", values: "Continuity, and not having the familiar erased.", mayMiss: "That familiarity is not consent for those it excludes." },
      { label: "The curator", sees: "Options between keeping and removing: relocation, counter-marking, explanation.", values: "Keeping the argument visible rather than resolved by removal.", mayMiss: "That explanation can preserve an insult while annotating it." }
    ],
    contested: "Whether contested monuments should be removed, recontextualised, or left precisely because they are contested.",
    changeYourMind: "Read what a monument's inscription actually claims, rather than what you assume it commemorates."
  },
  "oral-memory": {
    opening: "Where records were never kept, or were kept about people rather than by them, spoken memory may be the only account. Treating it as lesser evidence can amount to accepting the gap as the truth.",
    standpoints: [
      { label: "The person remembering", sees: "Detail that no document recorded, held in a body and a voice.", values: "Being believed without a paper to prove it.", mayMiss: "That memory reorders and compresses over time." },
      { label: "The court or committee", sees: "A need for evidence that can be tested and cross-checked.", values: "Consistency, because decisions follow from it.", mayMiss: "That its standards were set where documents existed." },
      { label: "The listener recording", sees: "How the telling changes with who is present.", values: "Preserving the account with its context intact.", mayMiss: "That recording changes what a person is willing to say." }
    ],
    contested: "Whether testimony without documentation is weaker evidence or simply evidence of a different kind.",
    changeYourMind: "Try to document something true about your own life from five years ago using paper alone."
  },
  "map-and-power": {
    opening: "A map is a set of decisions about what deserves a symbol. Every one is selective, and the selections tend to follow whoever commissioned it.",
    standpoints: [
      { label: "The cartographer", sees: "Scale, projection and the impossibility of showing everything.", values: "Clarity and fitness for the stated purpose.", mayMiss: "That omissions read as absence rather than choice." },
      { label: "The unmapped resident", sees: "A settlement shown as blank, and services that follow the map.", values: "Existing officially.", mayMiss: "That being mapped can also bring taxation or eviction." },
      { label: "The navigator", sees: "Whether it gets them there.", values: "Accuracy for their route.", mayMiss: "Everything the map declined to draw." }
    ],
    contested: "Whether being put on a map is mainly a form of recognition or a form of exposure.",
    changeYourMind: "Compare an official map of an area with one drawn by people who live there."
  },
  "anniversary": {
    opening: "An anniversary decides when we look back, which quietly decides what we look at. The calendar does work that resembles editing.",
    standpoints: [
      { label: "The one who marks it", sees: "A date that makes remembering collective rather than solitary.", values: "Shared attention, briefly guaranteed.", mayMiss: "That the date may suit institutions more than mourners." },
      { label: "The one for whom it is not one day", sees: "A continuous condition that the calendar turns into an event.", values: "Being taken seriously outside the anniversary window.", mayMiss: "That the date is what keeps others paying attention at all." },
      { label: "The organiser", sees: "Rounds numbers, budgets and the attention a decade attracts.", values: "Reaching people who would otherwise not think about it.", mayMiss: "That commemoration can substitute for change." }
    ],
    contested: "Whether anniversaries sustain memory or ration it.",
    changeYourMind: "Notice which anniversaries you hear about, and ask who benefits from that particular calendar."
  },
  "museum-label": {
    opening: "A label is short, authoritative and read by nearly everyone who sees the object. Its brevity hides how much interpretation it performs.",
    standpoints: [
      { label: "The community of origin", sees: "An object described in someone else's vocabulary.", values: "Naming that matches how the thing is understood at home.", mayMiss: "That a general audience needs context they already have." },
      { label: "The curator", sees: "Word limits, comparability across a collection and contested provenance.", values: "Accuracy that survives scrutiny.", mayMiss: "That neutral phrasing can naturalise how the object was acquired." },
      { label: "The visitor", sees: "Whatever the label says, usually once.", values: "Understanding quickly.", mayMiss: "That what is not on the label was also decided." }
    ],
    contested: "Whether a label should state the disputed history of an object or leave that to longer material.",
    changeYourMind: "Read a label and write down what it does not say about how the object arrived."
  },
  "lost-language": {
    opening: "A language carries distinctions its speakers found worth making. When it falls quiet, the vocabulary goes, and so do the categories that only that vocabulary held together.",
    standpoints: [
      { label: "The last fluent speaker", sees: "Conversations no longer possible with anyone.", values: "Being understood in the language they think in.", mayMiss: "The reasons younger relatives chose a different one." },
      { label: "The younger relative", sees: "A trade made for school, work and mobility.", values: "A future that the older language seemed to foreclose.", mayMiss: "What was specific to the language they set down." },
      { label: "The linguist", sees: "Structures and a record that can outlast use.", values: "Documentation before it is impossible.", mayMiss: "That a documented language is not a spoken one." }
    ],
    contested: "Whether a language can meaningfully be preserved once it is no longer anyone's daily medium.",
    changeYourMind: "Find a word in a language you know that genuinely does not translate, and try anyway."
  },
  "migration-memory": {
    opening: "Migration produces two memories of the same place: one that keeps changing and one that stops. Neither is the false version.",
    standpoints: [
      { label: "The person who left", sees: "A place held at the moment of leaving.", values: "Keeping something intact across distance.", mayMiss: "How much the place has moved on." },
      { label: "The person who stayed", sees: "Continuous change, and an account from outside that feels frozen.", values: "Being described as they are now.", mayMiss: "That distance is its own kind of loss." },
      { label: "The child of migration", sees: "Two versions, neither fully theirs.", values: "Permission to belong partially to both.", mayMiss: "That their parents may experience that ease as a further loss." }
    ],
    contested: "Whose account of a place should be treated as current when the two have diverged.",
    changeYourMind: "Ask someone who left a place long ago to describe it, then ask someone who never left."
  },
  "forgotten-work": {
    opening: "Records tend to capture work that was paid, contracted or supervised. Work that was assumed, unpaid or done at home leaves fewer traces, which later reads as it not having happened.",
    standpoints: [
      { label: "The person who did it", sees: "Labour that filled a life and appears nowhere.", values: "Acknowledgement, even late.", mayMiss: "That recognition now cannot restore what it cost." },
      { label: "The historian", sees: "An archive shaped by what institutions bothered to write down.", values: "Reading the record against its own bias.", mayMiss: "That reconstruction can flatten individual experience into a category." },
      { label: "The employer of the time", sees: "A ledger that recorded what it was designed to record.", values: "Accounts that balanced.", mayMiss: "That the accounts defined what counted as work." }
    ],
    contested: "Whether absence from the record should be read as evidence of exclusion or merely of poor record keeping.",
    changeYourMind: "List the work done in your household this week that would appear in no document."
  },

  // Science and uncertainty
  "measurement": {
    opening: "Choosing what to measure, in which units, at what threshold, is already a claim about what matters. The number that results looks neutral in a way the choices behind it were not.",
    standpoints: [
      { label: "The one who set the threshold", sees: "A line that has to fall somewhere for the system to function.", values: "Consistency and defensibility.", mayMiss: "That people just below the line experience it as arbitrary." },
      { label: "The person measured", sees: "A life summarised by a figure that omits its own context.", values: "Being assessed on something that reflects their situation.", mayMiss: "That a common measure is what makes comparison possible at all." },
      { label: "The statistician", sees: "Error, variance and how confidently the number can be read.", values: "Honesty about precision.", mayMiss: "That the number will be used far more bluntly than it was produced." }
    ],
    contested: "Whether a measure can be improved into fairness or whether measuring itself imports a judgement.",
    changeYourMind: "Find a number that decides something about you, and read how its threshold was chosen."
  },
  "scientific-uncertainty": {
    opening: "Stated uncertainty is often read as weakness, when it is usually the opposite: a claim that says how far it can be trusted is more useful than one that does not.",
    standpoints: [
      { label: "The researcher", sees: "Ranges, assumptions and where the method stops working.", values: "Not claiming more than the data supports.", mayMiss: "That caution can be quoted as doubt about the whole finding." },
      { label: "The decision maker", sees: "A need to act before the range narrows.", values: "Something actionable now.", mayMiss: "That collapsing a range into a single figure discards the warning." },
      { label: "The reader", sees: "Two experts appearing to disagree.", values: "Knowing what to actually do.", mayMiss: "That an overlap in ranges is often agreement, not conflict." }
    ],
    contested: "How much uncertainty should be communicated when the audience will act on a simplified version anyway.",
    changeYourMind: "Read a study's confidence interval before its headline finding, and see if your reading changes."
  },
  "risk-and-precaution": {
    opening: "Acceptable risk sounds technical but is a distributional question. The people who bear a risk and the people who decide it is acceptable are frequently not the same.",
    standpoints: [
      { label: "The person exposed", sees: "A risk that is small in aggregate and total for them if it lands.", values: "Consent, and a say in the trade.", mayMiss: "That refusing all risk forecloses benefits they also want." },
      { label: "The regulator", sees: "Populations, base rates and the cost of over-caution.", values: "Proportionality across everyone affected.", mayMiss: "That averages hide who is concentrated at the bad end." },
      { label: "The one who benefits", sees: "An opportunity with manageable downside.", values: "Being allowed to proceed.", mayMiss: "That the downside may not be theirs to manage." }
    ],
    contested: "Whether acceptable risk should be set by expected harm across a population or by the consent of those most exposed.",
    changeYourMind: "Ask who is compensated if a low-probability risk actually occurs."
  },
  "model-and-world": {
    opening: "A model is useful because it leaves things out. That is also the whole of its danger, since what it omits does not stop existing.",
    standpoints: [
      { label: "The modeller", sees: "Assumptions, sensitivity and where the output stops being meaningful.", values: "Being explicit about scope.", mayMiss: "That the caveats rarely travel with the number." },
      { label: "The person the model describes", sees: "A category they were sorted into.", values: "Being treated as a case, not a class.", mayMiss: "That the model may serve them better than an individual judgement would." },
      { label: "The user of the output", sees: "A projection precise enough to plan around.", values: "Something to act on.", mayMiss: "That precision and accuracy are different properties." }
    ],
    contested: "Whether a model's simplifications are a fair price for foresight or a way of hiding a judgement inside arithmetic.",
    changeYourMind: "Find out what a model you rely on assumes stays constant."
  },
  "evidence-threshold": {
    opening: "Waiting for more evidence is itself a decision with consequences. So is acting early. Neither is the cautious option in every case.",
    standpoints: [
      { label: "The one who must act", sees: "A window that closes whether or not the evidence arrives.", values: "Timeliness.", mayMiss: "That acting on weak evidence can foreclose better options." },
      { label: "The sceptic", sees: "Past confident claims that did not hold.", values: "Not committing before the case is made.", mayMiss: "That delay has victims who are harder to count." },
      { label: "The person affected", sees: "A harm continuing while the standard is debated.", values: "Being believed before proof is complete.", mayMiss: "That premature action can misdirect scarce effort." }
    ],
    contested: "Whether the burden of proof should sit with those claiming harm or those claiming safety.",
    changeYourMind: "Consider a case where waiting for certainty turned out to be the costlier error."
  },
  "clinical-trial": {
    opening: "A trial's result applies most confidently to people like those enrolled. When enrolment is narrow, the confidence travels further than the evidence does.",
    standpoints: [
      { label: "The patient outside the sample", sees: "Guidance derived from bodies unlike theirs.", values: "Evidence that includes them.", mayMiss: "The cost and difficulty of broader recruitment." },
      { label: "The trial designer", sees: "Confounders, consent, retention and statistical power.", values: "A result that is actually interpretable.", mayMiss: "That a clean sample can produce a finding of limited reach." },
      { label: "The prescriber", sees: "A decision needed now for the person in front of them.", values: "Applicable guidance.", mayMiss: "That extrapolation beyond the sample is an assumption, not a finding." }
    ],
    contested: "Whether narrow trials should be treated as provisional for everyone else or as the best available basis for all.",
    changeYourMind: "Read who was excluded from a trial and why."
  },
  "weather-and-climate": {
    opening: "A single day proves little; a pattern proves a great deal. The difficulty is that people experience days and are asked to reason about patterns.",
    standpoints: [
      { label: "The person living through it", sees: "A season that no longer behaves as remembered.", values: "Having their observation counted.", mayMiss: "That memory of weather is unreliable in specific ways." },
      { label: "The climate scientist", sees: "Long records, attribution and what can be said about a single event.", values: "Not overclaiming a link.", mayMiss: "That excessive caution reads as no link at all." },
      { label: "The planner", sees: "Infrastructure with a lifespan longer than the forecast horizon.", values: "Decisions that hold under several futures.", mayMiss: "That planning for a range can look like indecision." }
    ],
    contested: "How firmly any single event can be attributed to a longer trend.",
    changeYourMind: "Compare your memory of the weather a decade ago with the recorded series."
  },
  "data-gap": {
    opening: "Missing data is rarely missing at random. What went unrecorded usually reflects who was doing the recording and what they were looking for.",
    standpoints: [
      { label: "The uncounted", sees: "Services allocated by figures that omit them.", values: "Being visible to the system that decides.", mayMiss: "That being counted also means being tracked." },
      { label: "The analyst", sees: "Gaps, and the temptation to treat absence as zero.", values: "Saying plainly what is unknown.", mayMiss: "That an honest gap still leaves a decision to be made." },
      { label: "The funder", sees: "A case that has to be made with numbers.", values: "Evidence strong enough to justify spending.", mayMiss: "That requiring data entrenches whoever already has it." }
    ],
    contested: "Whether decisions should wait for better data or proceed on testimony where data was never collected.",
    changeYourMind: "Ask what would have to be true for a zero in a dataset to be real."
  },
  "expert-disagreement": {
    opening: "Experts disagreeing is often taken as a sign that nobody knows. Sometimes it means the disagreement is about values, and the evidence was never the thing in dispute.",
    standpoints: [
      { label: "The specialist", sees: "A narrow area in real depth.", values: "Precision within their scope.", mayMiss: "That the decision spans several scopes." },
      { label: "The generalist", sees: "How the pieces interact and where they conflict.", values: "A workable whole.", mayMiss: "Depth that would change the picture." },
      { label: "The public", sees: "Confident people contradicting each other.", values: "Knowing whom to trust.", mayMiss: "That the disagreement may be about acceptable risk rather than fact." }
    ],
    contested: "Whether disagreement among experts should reduce public confidence or is a normal feature of active inquiry.",
    changeYourMind: "Separate the factual and value claims in a dispute and see which one the argument is really about."
  },
  "scientific-repair": {
    opening: "Correction is the mechanism that makes science trustworthy, yet each visible correction is read as evidence that it was not. The process and its reputation pull against each other.",
    standpoints: [
      { label: "The researcher who erred", sees: "Career risk in doing the right thing.", values: "Getting the record straight.", mayMiss: "That the audience remembers the claim, not the retraction." },
      { label: "The journal", sees: "Volume, incentives and limited capacity to check.", values: "A record that can be relied on.", mayMiss: "That slow correction leaves a false claim circulating." },
      { label: "The reader", sees: "A reversal, and wonders what else is wrong.", values: "Being able to rely on what they were told last year.", mayMiss: "That a field which never corrects is the worrying one." }
    ],
    contested: "Whether visible correction builds trust or spends it.",
    changeYourMind: "Follow a retracted finding and see how long it keeps being cited."
  },

  // Work and care
  "invisible-work": {
    opening: "Work becomes invisible when it is expected. Its absence is noticed immediately; its presence almost never is.",
    standpoints: [
      { label: "The one doing it", sees: "Continuous effort that produces no record.", values: "Being seen before something breaks.", mayMiss: "That naming it can turn a relationship into an account." },
      { label: "The one relying on it", sees: "Things simply working.", values: "Not having to think about it.", mayMiss: "That the smoothness is manufactured by someone." },
      { label: "The employer", sees: "Roles, hours and outputs that fit a description.", values: "What can be specified and paid for.", mayMiss: "The coordination that holds the specified work together." }
    ],
    contested: "Whether making invisible work visible improves its standing or merely adds surveillance.",
    changeYourMind: "Write down everything you did today that nobody would notice unless it stopped."
  },
  "time-and-care": {
    opening: "Care cannot be compressed without becoming something else. That makes it structurally awkward for systems built on throughput.",
    standpoints: [
      { label: "The carer", sees: "Time as the substance of the work, not its overhead.", values: "Enough of it to do the thing properly.", mayMiss: "The real constraint on how much time exists." },
      { label: "The person cared for", sees: "Whether they are being attended to or processed.", values: "Not being a task.", mayMiss: "That the carer is rationing across several people." },
      { label: "The administrator", sees: "Ratios, waiting lists and finite hours.", values: "Reaching everyone rather than a few well.", mayMiss: "That care delivered too fast may not be care." }
    ],
    contested: "Whether care can be made efficient without ceasing to be care.",
    changeYourMind: "Ask a carer what they would do with an extra ten minutes per person."
  },
  "shift-work": {
    opening: "A shift pattern does not only organise a workplace. It reorganises sleep, meals, childcare and who in a household is available to whom.",
    standpoints: [
      { label: "The shift worker", sees: "A body kept on a schedule that does not match daylight.", values: "Predictability, often above pay.", mayMiss: "That the flexibility they resent is what keeps the roster filled." },
      { label: "The household", sees: "A person present at hours nobody else is.", values: "Shared time.", mayMiss: "The constraints the roster imposes on the worker." },
      { label: "The scheduler", sees: "Coverage, absence and demand that will not flatten.", values: "A rota that holds.", mayMiss: "That each swap propagates into a home." }
    ],
    contested: "Whether unsocial hours are adequately answered by a premium or require limits.",
    changeYourMind: "Map a week of a rotating roster onto the hours a school or clinic is open."
  },
  "repair-work": {
    opening: "Repair returns things to a state where they are unremarkable again. Its success is the absence of a problem, which is difficult to point at.",
    standpoints: [
      { label: "The repairer", sees: "Accumulated judgement about how things fail.", values: "Skill that keeps things in use.", mayMiss: "That some replacement genuinely costs less." },
      { label: "The owner", sees: "Price, delay and whether it will fail again.", values: "Something that works.", mayMiss: "What is lost when repair skills disappear locally." },
      { label: "The manufacturer", sees: "Design cycles, liability and support cost.", values: "Products that scale.", mayMiss: "That unrepairable goods shift cost onto owners and waste systems." }
    ],
    contested: "Whether repairability should be required of makers or left to what buyers will pay for.",
    changeYourMind: "Try to have one recent device repaired and note where it becomes impossible."
  },
  "automation-and-dignity": {
    opening: "Automation changes not just how much work exists but which parts of a job carry judgement. A role can survive automation and still lose the thing that made it a craft.",
    standpoints: [
      { label: "The worker", sees: "Which decisions were theirs and are now the system's.", values: "Retaining the judgement that made the work skilled.", mayMiss: "That some automated tasks were genuinely degrading." },
      { label: "The employer", sees: "Consistency, cost and error rates.", values: "Reliable output.", mayMiss: "That discretion was absorbing problems the metrics never saw." },
      { label: "The customer", sees: "Speed and price.", values: "Getting what they came for.", mayMiss: "That the person who could make an exception no longer can." }
    ],
    contested: "Whether dignity at work is mainly about pay and security or about retaining judgement.",
    changeYourMind: "Ask someone whose job was automated in part which decisions they miss making."
  },
  "informal-work": {
    opening: "A great deal of what a city depends on is done outside formal employment. Calling it informal describes its paperwork, not its necessity.",
    standpoints: [
      { label: "The informal worker", sees: "Autonomy alongside no protection at all.", values: "Recognition that does not cost them their flexibility.", mayMiss: "That formalisation is what makes protection enforceable." },
      { label: "The city", sees: "Services delivered without a contract to hold anyone to.", values: "Accountability.", mayMiss: "That formal rules can price out the very workers they cover." },
      { label: "The household served", sees: "Affordable, responsive help.", values: "Availability.", mayMiss: "That affordability may rest on the absence of protection." }
    ],
    contested: "Whether formalising informal work protects those doing it or removes their access to it.",
    changeYourMind: "List the services you used this month and check which came with a contract."
  },
  "apprenticeship": {
    opening: "Some knowledge only transmits by working beside someone. It resists writing down, which makes it fragile in exactly the way documented knowledge is not.",
    standpoints: [
      { label: "The apprentice", sees: "Years before competence, on someone else's terms.", values: "Access to knowledge held by few.", mayMiss: "That the slowness is often the method." },
      { label: "The master", sees: "Judgement built by repetition and correction.", values: "Standards that survive them.", mayMiss: "That gatekeeping can be mistaken for rigour." },
      { label: "The institution", sees: "Curricula, certification and scale.", values: "Reaching many learners consistently.", mayMiss: "That the tacit part rarely survives the transfer." }
    ],
    contested: "Whether apprenticeship's slowness is essential to the learning or an artefact of how it was organised.",
    changeYourMind: "Try to write complete instructions for something you do skilfully without thinking."
  },
  "rest": {
    opening: "Rest is described as a universal need and distributed as a reward. Who can stop, and without penalty, is a fair summary of a society's arrangements.",
    standpoints: [
      { label: "The person who cannot stop", sees: "Rest priced beyond reach in time or money.", values: "Recovery without losing ground.", mayMiss: "That some rest depends on someone else continuing to work." },
      { label: "The one who rests easily", sees: "A normal week.", values: "A week that has an end to it.", mayMiss: "That their rest may be produced by another's shift." },
      { label: "The manager", sees: "Coverage, burnout and the cost of both.", values: "A sustainable team.", mayMiss: "That rest offered conditionally is not rest." }
    ],
    contested: "Whether rest is an entitlement or a resource to be earned.",
    changeYourMind: "Work out who has to be working for you to have a genuinely free day."
  },
  "wage-and-worth": {
    opening: "A wage records what a role could be hired for under particular conditions. Reading it as a statement about the value of the work confuses a price with a judgement.",
    standpoints: [
      { label: "The worker", sees: "A figure that does not match the difficulty of the day.", values: "Pay that tracks what the job asks.", mayMiss: "That price responds to supply, not to effort." },
      { label: "The employer", sees: "Budgets, market rates and replaceability.", values: "Paying enough to fill and keep the role.", mayMiss: "That a market rate can encode an old undervaluation." },
      { label: "The economist", sees: "Scarcity, bargaining power and institutions.", values: "Describing the mechanism accurately.", mayMiss: "That describing a mechanism can read as endorsing it." }
    ],
    contested: "Whether wages should be expected to reflect social value at all, or only market conditions.",
    changeYourMind: "Compare two jobs where the harder one pays less, and work out why."
  },
  "care-in-public": {
    opening: "Care done at home is private and largely unexamined. The same care in public becomes visible, and visibility brings both support and judgement.",
    standpoints: [
      { label: "The carer in public", sees: "Attention that can turn into comment.", values: "Being able to do the work without an audience.", mayMiss: "That visibility is what makes provision arguable for." },
      { label: "The onlooker", sees: "A situation they may misread.", values: "Wanting to help.", mayMiss: "That help offered publicly can be a further exposure." },
      { label: "The service designer", sees: "Whether facilities exist for care to happen at all.", values: "Provision that makes it unremarkable.", mayMiss: "That provision can normalise the burden rather than share it." }
    ],
    contested: "Whether care becoming visible improves support for it or mainly increases scrutiny of carers.",
    changeYourMind: "Notice where in your town someone could feed or change a child comfortably."
  },

  // Food and land
  "seed": {
    opening: "A seed is simultaneously a plant, a technology, a store of generations of selection and, sometimes, property. Those descriptions carry different rules about who may keep and share it.",
    standpoints: [
      { label: "The farmer saving seed", sees: "A practice older than the paperwork governing it.", values: "Independence from a purchase each season.", mayMiss: "That some improved varieties genuinely raise yields." },
      { label: "The breeder", sees: "Years of work that is easy to copy once released.", values: "Recovering the cost of development.", mayMiss: "That the base material was collectively produced over centuries." },
      { label: "The seed keeper", sees: "Diversity as insurance against a future nobody can specify.", values: "Keeping options alive.", mayMiss: "That preservation without use tends not to last." }
    ],
    contested: "Whether a plant variety can be owned when it is built from inherited common material.",
    changeYourMind: "Trace one common crop variety back through who selected it and when."
  },
  "water-sharing": {
    opening: "Water arrives unevenly and is needed constantly, so every community develops a rule for priority. Those rules are usually older, and more locally specific, than the law that now overlays them.",
    standpoints: [
      { label: "The upstream user", sees: "A resource that arrives on their land first.", values: "Established use and the investment made around it.", mayMiss: "That the same flow is someone else's entire supply." },
      { label: "The downstream user", sees: "What is left after others have taken.", values: "A share that does not depend on position.", mayMiss: "The prior claims and infrastructure upstream." },
      { label: "The allocator", sees: "Total availability, seasonality and competing rights.", values: "A rule that holds in a dry year.", mayMiss: "That formal allocation can override arrangements that were working." }
    ],
    contested: "Whether water should be allocated by prior use, by need, or by an equal share.",
    changeYourMind: "Find out where the water you used this morning was an hour earlier."
  },
  "seasonal-food": {
    opening: "Seasonality used to be a constraint and is now often a preference. What a season means has changed from what is possible to what is chosen.",
    standpoints: [
      { label: "The grower", sees: "Weather, labour peaks and a narrow window to sell.", values: "A price that survives the glut.", mayMiss: "That year-round supply is what keeps some buyers loyal." },
      { label: "The cook", sees: "Flavour, cost and what a season makes obvious.", values: "Eating what is good now.", mayMiss: "That seasonality as a preference is a form of affluence." },
      { label: "The importer", sees: "A supply chain that flattens the calendar.", values: "Availability and choice.", mayMiss: "That flattening the calendar erases the knowledge attached to it." }
    ],
    contested: "Whether seasonal eating is an ecological practice or mainly an aesthetic one.",
    changeYourMind: "Try eating for a fortnight only what grows near you at this time of year."
  },
  "soil": {
    opening: "Soil is often treated as a substrate that holds plants up. It is closer to a slow-built living system, and the timescale of its repair is not the timescale of a growing season.",
    standpoints: [
      { label: "The farmer", sees: "This season's yield against next decade's fertility.", values: "A holding that is still productive later.", mayMiss: "That the pressures forcing short-term choices are real." },
      { label: "The soil scientist", sees: "Structure, biology and depletion that takes years to show.", values: "Practices that rebuild rather than extract.", mayMiss: "That recommended practice may be unaffordable in a bad year." },
      { label: "The landlord", sees: "Rent, tenure and the value of the land.", values: "A return on the asset.", mayMiss: "That short tenancies discourage anyone from investing in the soil." }
    ],
    contested: "Whether soil is best protected by ownership incentives or by rules applied regardless of tenure.",
    changeYourMind: "Ask how long it takes to rebuild a centimetre of topsoil."
  },
  "fishing-right": {
    opening: "A fishing ground has no fences, so the right to use it is defined by custom, licence or force. When the fish move, every definition is tested at once.",
    standpoints: [
      { label: "The small-boat fisher", sees: "A ground worked for generations without a document.", values: "Customary access.", mayMiss: "That custom can also exclude newer entrants." },
      { label: "The regulator", sees: "Stock assessments and the cost of collapse.", values: "A fishery that still exists in twenty years.", mayMiss: "That quota systems tend to concentrate access." },
      { label: "The processor", sees: "Volume, consistency and contracts.", values: "Predictable supply.", mayMiss: "That predictability can be bought at the ecosystem's expense." }
    ],
    contested: "Whether access should follow historical use, ecological limits, or tradable entitlement.",
    changeYourMind: "Look at who holds the quota in a fishery and how they came to hold it."
  },
  "grain-storage": {
    opening: "A grain store buys time between harvests, and time is what converts a bad season into a survivable one. It also concentrates something valuable in one place, which has its own consequences.",
    standpoints: [
      { label: "The household storing", sees: "Insurance they control.", values: "Not depending on a market at the worst moment.", mayMiss: "Losses to pests and damp that a larger store would avoid." },
      { label: "The public agency", sees: "Buffer stocks, price stabilisation and rotation.", values: "Preventing a shortage becoming a crisis.", mayMiss: "That central storage moves control away from households." },
      { label: "The trader", sees: "Arbitrage across time and place.", values: "A functioning market signal.", mayMiss: "That storage as speculation and storage as security look identical." }
    ],
    contested: "Whether food security is better held by households or pooled centrally.",
    changeYourMind: "Ask how many days of food are stored where you live, and by whom."
  },
  "kitchen-knowledge": {
    opening: "Knowledge developed in kitchens is tested constantly against results, refined over generations and passed on by demonstration. It is rarely called expertise, which says more about the category than the knowledge.",
    standpoints: [
      { label: "The cook", sees: "Judgement built on thousands of repetitions.", values: "Knowing by doing.", mayMiss: "That some of the reasoning is wrong even when the result is right." },
      { label: "The food scientist", sees: "Mechanisms that explain why a technique works.", values: "Explanation that transfers.", mayMiss: "That the technique preceded and outperformed the explanation." },
      { label: "The chef", sees: "A tradition to draw on and be credited for.", values: "Craft recognised publicly.", mayMiss: "That the recognition often skips the people it came from." }
    ],
    contested: "Whether expertise requires articulable reasons or is adequately demonstrated by reliable results.",
    changeYourMind: "Ask someone to explain why a familiar technique works, and see how far the explanation goes."
  },
  "commons": {
    opening: "Common land is neither unowned nor privately held. It is governed, usually by rules that are detailed, local and invisible to anyone reading a title deed.",
    standpoints: [
      { label: "The commoner", sees: "Rights bounded by obligations that everyone knows.", values: "A system that has already lasted.", mayMiss: "That the rules can exclude those without inherited standing." },
      { label: "The economist", sees: "Incentives to overuse and the difficulty of enforcement.", values: "Arrangements that survive self-interest.", mayMiss: "That many commons solved this without privatising." },
      { label: "The developer", sees: "Land that appears underused.", values: "Putting it to productive use.", mayMiss: "That the use is real but does not register as output." }
    ],
    contested: "Whether commons fail without private ownership or fail mainly when their governance is dismantled.",
    changeYourMind: "Find a working commons and read the rules its users actually follow."
  },
  "food-price": {
    opening: "A price coordinates an enormous amount of information and omits everything nobody had to pay for. What it leaves out tends to be soil, water, labour conditions and time.",
    standpoints: [
      { label: "The shopper", sees: "What they can afford this week.", values: "Feeding a household.", mayMiss: "The costs displaced elsewhere to reach that price." },
      { label: "The producer", sees: "A margin squeezed between input costs and buyers.", values: "A price that covers production.", mayMiss: "That the shopper's constraint is also real." },
      { label: "The environmental accountant", sees: "Depletion that appears in no ledger.", values: "Prices that include what they consume.", mayMiss: "That internalising costs raises prices for people with least slack." }
    ],
    contested: "Whether cheap food is an achievement or a deferral of costs onto others.",
    changeYourMind: "Pick one item and try to find out what share of its price reaches the grower."
  },
  "crop-and-climate": {
    opening: "A crop is a relationship between a plant, a place and a calendar. When the calendar shifts, the crop can survive agronomically while ceasing to mean what it meant.",
    standpoints: [
      { label: "The grower", sees: "Varieties that no longer suit the season they were bred for.", values: "Something that yields under the new conditions.", mayMiss: "That switching crops can dissolve a local food culture." },
      { label: "The community that eats it", sees: "A food tied to festivals, memory and identity.", values: "Continuity of the thing itself.", mayMiss: "That insisting on continuity can be agronomically unworkable." },
      { label: "The researcher", sees: "Traits, tolerance and the pace of breeding.", values: "Adaptation fast enough to matter.", mayMiss: "That adoption is cultural as much as technical." }
    ],
    contested: "Whether adaptation should preserve the crop or the practice built around it when the two diverge.",
    changeYourMind: "Ask an older grower what has changed about when they plant."
  },

  // Technology and power
  "algorithm": {
    opening: "Most algorithmic decisions are not the visible ones. Ordering, defaults and what is shown first settle a great deal before anyone chooses anything.",
    standpoints: [
      { label: "The person ranked", sees: "An outcome with no stated reason.", values: "Knowing why, and being able to contest it.", mayMiss: "That a human decision was often no more explainable." },
      { label: "The engineer", sees: "Objectives, training data and trade-offs between error types.", values: "Performance against a defined target.", mayMiss: "That choosing the target was the decisive act." },
      { label: "The operator", sees: "Scale, cost and consistency.", values: "Handling volume no team could.", mayMiss: "That consistency at scale reproduces one judgement everywhere." }
    ],
    contested: "Whether algorithmic decisions need to be explainable or only demonstrably fair in outcome.",
    changeYourMind: "Ask what a system was optimised for, then ask who chose that."
  },
  "internet-memory": {
    opening: "The early web is mostly gone, and what remains was saved unevenly by volunteers. Its history is being written from an archive with large and unmarked holes.",
    standpoints: [
      { label: "The person who was there", sees: "Communities that left almost no trace.", values: "Their experience counting as history.", mayMiss: "That memory of a period reshapes itself." },
      { label: "The archivist", sees: "Link rot, format decay and what could be captured.", values: "Saving anything at all.", mayMiss: "That capture was shaped by what was easy to crawl." },
      { label: "The newcomer", sees: "A tidy story of a few famous sites.", values: "A usable narrative.", mayMiss: "That the tidiness comes from the losses." }
    ],
    contested: "Whether the early internet should be reconstructed from what survived or acknowledged as largely unrecoverable.",
    changeYourMind: "Try to find something you posted online more than a decade ago."
  },
  "repairable-device": {
    opening: "Repairability decides who keeps a working device and for how long. It is a design decision that quietly sets an ongoing cost for the owner.",
    standpoints: [
      { label: "The owner", sees: "A device failing for one small reason.", values: "Fixing rather than replacing.", mayMiss: "The genuine engineering constraints of thin, sealed products." },
      { label: "The manufacturer", sees: "Reliability, safety, support cost and design freedom.", values: "A product that performs and can be supported.", mayMiss: "That unrepairable design transfers cost to owners and waste streams." },
      { label: "The independent repairer", sees: "Parts, documentation and locks they cannot pass.", values: "Being allowed to do the work.", mayMiss: "The liability a maker carries for a bad third-party repair." }
    ],
    contested: "Whether repairability should be mandated or left to competition between makers.",
    changeYourMind: "Price the repair of the last device you replaced."
  },
  "identity-system": {
    opening: "An identity system works invisibly for people whose lives match its assumptions. For everyone else, it becomes the obstacle standing between them and everything it gates.",
    standpoints: [
      { label: "The person who cannot enrol", sees: "A door that will not open for reasons they cannot fix.", values: "An alternative route to the same service.", mayMiss: "That the system prevents real fraud against people like them." },
      { label: "The designer", sees: "Uniqueness, fraud, cost and coverage.", values: "A system that works for the great majority.", mayMiss: "That the residual few are concentrated among those with least recourse." },
      { label: "The service provider", sees: "A check that is fast and defensible.", values: "Certainty about who they are serving.", mayMiss: "That certainty about identity is not certainty about entitlement." }
    ],
    contested: "Whether identity systems should aim for universal coverage or always maintain a manual fallback.",
    changeYourMind: "Ask what happens to someone whose biometric enrolment repeatedly fails."
  },
  "platform-labour": {
    opening: "Flexibility describes a real benefit and also a shifted risk. Which one it mostly means depends on whether the worker can afford to decline.",
    standpoints: [
      { label: "The worker", sees: "Freedom to choose hours, and no floor under a bad week.", values: "Control that does not cost security.", mayMiss: "That guaranteed hours would reduce the flexibility they use." },
      { label: "The platform", sees: "Matching supply to demand without holding idle capacity.", values: "A market that clears.", mayMiss: "That the risk removed from the balance sheet lands on households." },
      { label: "The customer", sees: "Availability and price.", values: "Service on demand.", mayMiss: "That on-demand availability requires someone to be waiting unpaid." }
    ],
    contested: "Whether flexibility and security are genuinely in tension or only presented that way.",
    changeYourMind: "Work out what a platform worker earns including the hours spent waiting."
  },
  "digital-archive": {
    opening: "Digitisation is described as opening access, and it does. It also introduces new gates: bandwidth, devices, literacy, language and sometimes a subscription.",
    standpoints: [
      { label: "The remote researcher", sees: "Material they could never have travelled to.", values: "Access without a journey.", mayMiss: "That digitisation prioritised some collections over others." },
      { label: "The person without bandwidth", sees: "A door that opened somewhere else.", values: "Access that matches their connection.", mayMiss: "That physical access was never available to them either." },
      { label: "The institution", sees: "Cost, rights and what can lawfully be published.", values: "Doing as much as the budget allows.", mayMiss: "That partial digitisation sets what future scholarship notices." }
    ],
    contested: "Whether digitisation widens access overall or redistributes who is excluded.",
    changeYourMind: "Check what proportion of a collection you use has actually been digitised."
  },
  "automation-bias": {
    opening: "A system trained on the past will reproduce its patterns, including the ones nobody would defend. The output arrives without the hesitation a person might have shown.",
    standpoints: [
      { label: "The person affected", sees: "An old pattern applied faster and at larger scale.", values: "Not being sorted by history.", mayMiss: "That human decisions carried the same bias less visibly." },
      { label: "The developer", sees: "Data that encodes the world as it was.", values: "Measurable improvement over the prior process.", mayMiss: "That parity with a biased baseline is not fairness." },
      { label: "The auditor", sees: "Disparities that only appear in aggregate.", values: "Testing outcomes rather than intentions.", mayMiss: "That fixing one measure of fairness can worsen another." }
    ],
    contested: "Whether an automated system should be held to the standard of the process it replaced or a higher one.",
    changeYourMind: "Ask what a system would have decided about people like you thirty years ago."
  },
  "network-outage": {
    opening: "An outage is the only time most dependencies become visible. What stops working reveals an architecture nobody chose deliberately.",
    standpoints: [
      { label: "The person cut off", sees: "Payment, transport, work and contact failing together.", values: "A fallback that does not need the network.", mayMiss: "The cost of maintaining parallel systems." },
      { label: "The operator", sees: "Cascading failure and recovery order.", values: "Restoring the most critical service first.", mayMiss: "That criticality looks different from each household." },
      { label: "The planner", sees: "Concentration risk built up one convenience at a time.", values: "Redundancy.", mayMiss: "That redundancy is cut first when nothing has failed recently." }
    ],
    contested: "Whether resilience should be a public requirement or left to each operator's judgement.",
    changeYourMind: "List what you could not do today without a network, then find the offline route for each."
  },
  "interface-language": {
    opening: "An interface teaches expectations. What it makes easy comes to feel natural, and what it omits comes to feel unavailable.",
    standpoints: [
      { label: "The everyday user", sees: "Something that either fits their habits or does not.", values: "Not having to think.", mayMiss: "That their habits were formed by earlier interfaces." },
      { label: "The designer", sees: "Conventions, affordances and the cost of teaching anything new.", values: "Immediate comprehension.", mayMiss: "That following convention entrenches whoever set it." },
      { label: "The person outside the default", sees: "Assumptions about names, scripts, dates and bodies.", values: "Being representable in the form.", mayMiss: "That every form must draw a boundary somewhere." }
    ],
    contested: "Whether interfaces should follow familiar conventions or resist them when the convention excludes.",
    changeYourMind: "Try entering your details into a form designed for a different country."
  },
  "right-to-disconnect": {
    opening: "When work can reach a person anywhere, the boundary of the working day stops being set by a building. Whatever replaces it has to be stated, because it will not appear on its own.",
    standpoints: [
      { label: "The employee", sees: "Availability expected but never written down.", values: "A boundary they do not have to defend alone.", mayMiss: "That rigid rules can remove flexibility they use." },
      { label: "The manager", sees: "Time zones, urgency and a team that must coordinate.", values: "Responsiveness when it genuinely matters.", mayMiss: "That norms set by their own habits become obligations." },
      { label: "The colleague", sees: "A message sent late that they feel obliged to answer.", values: "Clarity about what is urgent.", mayMiss: "That the sender may not have expected a reply." }
    ],
    contested: "Whether disconnection should be a legal right, a workplace norm, or a personal negotiation.",
    changeYourMind: "Look at when the messages in your work account were actually sent."
  },

  // Art and interpretation
  "seeing-art": {
    opening: "A second viewing is never of the same work, because the viewer has changed. What looks like a property of the object is partly a property of the encounter.",
    standpoints: [
      { label: "The returning viewer", sees: "Something they missed, which was there all along.", values: "A work that keeps yielding.", mayMiss: "That they may be reading in what they brought." },
      { label: "The artist", sees: "Decisions made for reasons that may never be recovered.", values: "The work standing without explanation.", mayMiss: "That meaning continues to be made without them." },
      { label: "The curator", sees: "Hanging, light, sequence and what context does to attention.", values: "Conditions that let a work be seen.", mayMiss: "That framing can determine what is found." }
    ],
    contested: "Whether meaning is in the work, the viewer, or only in the meeting of the two.",
    changeYourMind: "Return to something you loved a decade ago and note what has moved."
  },
  "translation": {
    opening: "Translation is not substitution. Every choice trades something away, and the translator decides which loss the reader will not notice.",
    standpoints: [
      { label: "The translator", sees: "Rhythm, register and idiom pulling in different directions.", values: "Faithfulness to effect rather than to words.", mayMiss: "That readers may want the strangeness kept." },
      { label: "The original author", sees: "A text they can no longer fully control.", values: "Their intent surviving.", mayMiss: "That a literal rendering may betray intent more thoroughly." },
      { label: "The reader", sees: "A book that reads well or does not.", values: "Reaching a book they could not otherwise read.", mayMiss: "The decisions behind every smooth sentence." }
    ],
    contested: "Whether a translation should read as though written in the new language or announce that it was not.",
    changeYourMind: "Read two translations of the same passage side by side."
  },
  "song-and-place": {
    opening: "A song can hold the sound of a place, its language and its labour more durably than a building. It also travels, which is how it survives and how it changes.",
    standpoints: [
      { label: "The singer at home", sees: "A song embedded in occasion and season.", values: "Singing it where it belongs.", mayMiss: "That travel is often what kept it alive." },
      { label: "The diaspora listener", sees: "A place they can enter through sound.", values: "Continuity across distance.", mayMiss: "That the version they hold has stopped moving." },
      { label: "The performer elsewhere", sees: "Material worth carrying to new audiences.", values: "Sharing it.", mayMiss: "That decontextualised performance can hollow the song out." }
    ],
    contested: "Whether a song's meaning survives relocation or is largely produced by its setting.",
    changeYourMind: "Find a song tied to a place and ask someone from there what occasion it belongs to."
  },
  "craft-and-art": {
    opening: "The line between craft and art has moved repeatedly, and it usually moves along with who is making the object and where it is shown.",
    standpoints: [
      { label: "The maker", sees: "Material, skill and a tradition they are inside.", values: "The work being judged on its execution.", mayMiss: "That the category affects what it can be sold for." },
      { label: "The gallery", sees: "Context, scarcity and a market that responds to framing.", values: "Placing work where it will be taken seriously.", mayMiss: "That elevation can sever an object from its use." },
      { label: "The buyer", sees: "Something they want to live with.", values: "Their own response.", mayMiss: "That their sense of value was substantially framed for them." }
    ],
    contested: "Whether the distinction tracks anything in the objects or only in their institutions.",
    changeYourMind: "Find two near-identical objects, one in a gallery and one in a market, and compare their prices."
  },
  "theatre-audience": {
    opening: "A performance is completed in the room. The same production, with a different audience, is a different event, which is why it cannot be fully recorded.",
    standpoints: [
      { label: "The performer", sees: "A room's attention shifting minute to minute.", values: "The exchange that only happens live.", mayMiss: "That much of the audience is not participating in the way they imagine." },
      { label: "The audience member", sees: "Their own attention, and the people around them.", values: "Being moved.", mayMiss: "How much their presence shapes what is happening." },
      { label: "The archivist", sees: "A recording that keeps the text and loses the event.", values: "Something surviving.", mayMiss: "That the recording will become the work for everyone later." }
    ],
    contested: "Whether liveness is essential to theatre or a preference of those who can attend.",
    changeYourMind: "Watch a recording of a performance you attended and note what is absent."
  },
  "copy-and-original": {
    opening: "When a copy is materially indistinguishable, the value of the original rests on history rather than appearance. That history is real, but it is not visible in the object.",
    standpoints: [
      { label: "The collector", sees: "Provenance and the chain of custody.", values: "Authenticity as a documented fact.", mayMiss: "That the aesthetic experience may be identical." },
      { label: "The viewer", sees: "What is in front of them.", values: "The encounter.", mayMiss: "That knowing changes the encounter." },
      { label: "The conservator", sees: "How much of the original material is still present after restoration.", values: "Honesty about intervention.", mayMiss: "That the public wants an original that no longer wholly exists." }
    ],
    contested: "Whether authenticity is a property of the object or of its documented history.",
    changeYourMind: "Ask how much of a restored work is material the maker touched."
  },
  "public-art": {
    opening: "Art placed in public is encountered by people who did not choose it. That is its opportunity and the source of most arguments about it.",
    standpoints: [
      { label: "The resident", sees: "Something they will pass daily for years.", values: "A say in what occupies their route.", mayMiss: "That consultation tends to reach only those already engaged." },
      { label: "The artist", sees: "A commission with a site and a brief.", values: "Work that is not diluted by committee.", mayMiss: "That the audience is captive rather than attending." },
      { label: "The commissioner", sees: "Budget, maintenance, safety and competing views.", values: "Something defensible and durable.", mayMiss: "That defensible often means uncontroversial to the point of empty." }
    ],
    contested: "Whether public art should reflect local consensus or be free to unsettle it.",
    changeYourMind: "Ask people who pass a public artwork daily what they think it is for."
  },
  "voice-and-recording": {
    opening: "Recording a voice preserves it and fixes it. What was responsive to a moment becomes something that can be replayed in any other.",
    standpoints: [
      { label: "The speaker", sees: "Words that will outlive the situation they were said in.", values: "Being heard as they meant it.", mayMiss: "That the recording protects them from being misquoted." },
      { label: "The listener later", sees: "Tone and hesitation that a transcript loses.", values: "Hearing the person.", mayMiss: "That they are overhearing something not addressed to them." },
      { label: "The archivist", sees: "Consent, format and how long the medium lasts.", values: "Preservation with permission attached.", mayMiss: "That consent given once may not cover every future use." }
    ],
    contested: "Whether recording a voice mainly preserves it or removes it from the speaker's control.",
    changeYourMind: "Listen to a recording of yourself and note what surprises you."
  },
  "colour-and-meaning": {
    opening: "Colour carries meaning by convention, and conventions differ and coexist. A single colour can be mourning, celebration and a warning simultaneously.",
    standpoints: [
      { label: "The person inside one tradition", sees: "An obvious meaning.", values: "Shared understanding without explanation.", mayMiss: "That the obviousness is local." },
      { label: "The designer", sees: "Audiences who will read the same choice differently.", values: "Communicating reliably.", mayMiss: "That neutral choices can be flat." },
      { label: "The artist", sees: "Colour as material before it is a symbol.", values: "The physical effect.", mayMiss: "That viewers will read symbolism regardless." }
    ],
    contested: "Whether colour meaning is largely cultural convention or partly rooted in shared perception.",
    changeYourMind: "Ask three people from different backgrounds what a single colour signifies."
  },
  "criticism": {
    opening: "Criticism can close a work down to a verdict or open it up to more attention. Both are called criticism, and they are nearly opposite activities.",
    standpoints: [
      { label: "The maker", sees: "Years of work summarised quickly.", values: "Being read on the terms of the attempt.", mayMiss: "That an audience needs help deciding what to spend time on." },
      { label: "The critic", sees: "A work in relation to others and to what it tried to do.", values: "Judgement made in public with reasons.", mayMiss: "That authority can substitute for argument." },
      { label: "The reader", sees: "Guidance about what is worth their evening.", values: "Trustworthy recommendation.", mayMiss: "That the verdict is the least interesting part." }
    ],
    contested: "Whether criticism's job is evaluation or interpretation.",
    changeYourMind: "Read a review that changed how you saw something you already knew well."
  },

  // Language and belonging
  "mother-tongue": {
    opening: "A first language holds more than vocabulary: it carries the categories a person first thought in. Translation can move the content and still leave that behind.",
    standpoints: [
      { label: "The speaker", sees: "Precision available to them in one language only.", values: "Thinking without converting.", mayMiss: "That the second language may offer distinctions the first lacks." },
      { label: "The listener without it", sees: "Something being lost that they cannot assess.", values: "Understanding.", mayMiss: "That asking for translation shifts the work onto the speaker." },
      { label: "The institution", sees: "A need for one working language.", values: "Everyone able to participate.", mayMiss: "That a common language sets who speaks with ease." }
    ],
    contested: "Whether the loss in translation is incidental detail or the substance of thought.",
    changeYourMind: "Try to express something emotionally precise in your second language."
  },
  "accent": {
    opening: "An accent conveys where someone has been. It becomes a boundary when listeners treat it as information about competence rather than geography.",
    standpoints: [
      { label: "The speaker", sees: "Attention diverted from what they said to how it sounded.", values: "Being heard for content.", mayMiss: "That accent genuinely affects comprehension sometimes." },
      { label: "The listener", sees: "Effort required, and sometimes assumptions arriving unbidden.", values: "Understanding easily.", mayMiss: "That the effort is theirs to make too." },
      { label: "The employer", sees: "Customer-facing roles and stated communication requirements.", values: "Service that works.", mayMiss: "That such requirements often encode prejudice as standards." }
    ],
    contested: "Whether accent requirements are ever legitimately about clarity rather than belonging.",
    changeYourMind: "Notice whose accents you find effortful and whether difficulty explains the pattern."
  },
  "naming-place": {
    opening: "A place name is a compressed claim about history. Renaming makes the claim explicit, which is why it produces argument that the original naming often did not.",
    standpoints: [
      { label: "The community renaming", sees: "A name imposed during a period they did not consent to.", values: "Naming themselves.", mayMiss: "That others also formed attachments under the old name." },
      { label: "The long resident", sees: "Disruption to something that felt neutral.", values: "Continuity and practical familiarity.", mayMiss: "That the old name was never neutral to everyone." },
      { label: "The administrator", sees: "Records, addresses, signage and cost.", values: "A change that can be implemented.", mayMiss: "That treating it as logistics sidesteps the substance." }
    ],
    contested: "Whether renaming corrects a historical claim or replaces one claim with another.",
    changeYourMind: "Find out when a place near you was named, and by whom."
  },
  "everyday-word": {
    opening: "Common words accumulate history quietly. A term can carry an old hierarchy long after the arrangement that produced it has gone.",
    standpoints: [
      { label: "The habitual user", sees: "A word that means what they intend.", values: "Being understood without a lecture.", mayMiss: "That intent does not determine what a word carries." },
      { label: "The person it lands on", sees: "A history they hear each time.", values: "Not being reminded.", mayMiss: "That the speaker may genuinely not know." },
      { label: "The lexicographer", sees: "Usage shifting across decades.", values: "Describing what people actually say.", mayMiss: "That description can be read as endorsement." }
    ],
    contested: "Whether a word's meaning is set by current use or still carries its origin.",
    changeYourMind: "Look up the origin of a word you use daily without thinking."
  },
  "silence": {
    opening: "Silence can be refusal, consent, protection, grief or the absence of any safe way to speak. Reading it as one thing is usually a mistake.",
    standpoints: [
      { label: "The silent person", sees: "A choice, or the absence of one.", values: "Not being made to explain.", mayMiss: "That silence will be interpreted whether or not they intend it." },
      { label: "The one waiting", sees: "An answer withheld.", values: "Knowing where they stand.", mayMiss: "That demanding speech can be its own coercion." },
      { label: "The observer", sees: "A pattern of who speaks and who does not.", values: "Noticing the distribution.", mayMiss: "That individual silences have particular reasons." }
    ],
    contested: "Whether silence should be read as meaningful communication or left uninterpreted.",
    changeYourMind: "Recall a time your silence was read as something you did not mean."
  },
  "bilingual-life": {
    opening: "Living between languages is not two monolingual lives running in parallel. It produces its own way of thinking, with capacities and gaps that neither language has alone.",
    standpoints: [
      { label: "The bilingual person", sees: "Concepts that sit in one language and not the other.", values: "Using whichever fits.", mayMiss: "That switching can exclude people present." },
      { label: "The monolingual listener", sees: "A conversation they are outside of.", values: "Being part of the conversation in the room.", mayMiss: "That the switch is often about precision, not exclusion." },
      { label: "The teacher", sees: "Interference, transfer and uneven proficiency.", values: "Competence in each.", mayMiss: "That mixed use is a competence of its own." }
    ],
    contested: "Whether mixing languages is a deficiency of each or a distinct capability.",
    changeYourMind: "Notice which language you count, swear or dream in, and whether it is the same one."
  },
  "polite-language": {
    opening: "Politeness reduces friction, and it also decides who has to soften. Whose comfort is being protected is often clearer than whose feelings are.",
    standpoints: [
      { label: "The one asked to soften", sees: "Substance discounted because of tone.", values: "Being heard when direct.", mayMiss: "That delivery genuinely affects whether people listen." },
      { label: "The one who wants civility", sees: "Conversation becoming unusable without norms.", values: "Being able to disagree and continue.", mayMiss: "That civility norms are applied unevenly." },
      { label: "The bystander", sees: "Tone before content.", values: "A discussion they can stay in.", mayMiss: "That discomfort is sometimes the point being made." }
    ],
    contested: "Whether civility norms mainly enable disagreement or mainly police who may express it.",
    changeYourMind: "Notice who in a disagreement is told to change their tone."
  },
  "translation-loss": {
    opening: "A translator can smooth a text into fluency or leave the seams showing. Smoothing is kinder to the reader and can quietly erase what made the original itself.",
    standpoints: [
      { label: "The translator", sees: "Where fluency would flatten something deliberate.", values: "Keeping what resists.", mayMiss: "That difficulty loses readers who would otherwise arrive." },
      { label: "The reader", sees: "Prose that flows or does not.", values: "Being able to read it.", mayMiss: "That the friction was in the original." },
      { label: "The source community", sees: "Their idiom rendered as either exotic or invisible.", values: "Neither flattening nor ornament.", mayMiss: "That some readers need a bridge to arrive at all." }
    ],
    contested: "Whether a translation owes more to the reader's ease or the original's texture.",
    changeYourMind: "Find a translated phrase that was left untranslated, and ask why."
  },
  "sign-language": {
    opening: "Sign languages are full languages with their own grammar, not gestural versions of spoken ones. Treating them as a substitute misreads what they are.",
    standpoints: [
      { label: "The signer", sees: "A first language with its own structure and literature.", values: "Recognition as a language.", mayMiss: "That hearing people often encounter it only as accommodation." },
      { label: "The interpreter", sees: "Two grammars that do not map cleanly.", values: "Meaning carried, not words matched.", mayMiss: "That interpretation inserts a third party into every exchange." },
      { label: "The institution", sees: "Access requirements and cost.", values: "Compliance.", mayMiss: "That provision after the fact is not the same as design for it." }
    ],
    contested: "Whether access is adequately met by interpretation or requires environments where signing is native.",
    changeYourMind: "Learn that sign languages differ by country, and ask why that surprised you."
  },
  "dictionary": {
    opening: "A dictionary claims to describe usage while also conferring legitimacy. Inclusion is treated as recognition, whatever the editors intend.",
    standpoints: [
      { label: "The lexicographer", sees: "Evidence of use across sources over time.", values: "Description, not permission.", mayMiss: "That readers treat inclusion as approval." },
      { label: "The speaker of an excluded variety", sees: "Their words marked as non-standard or absent.", values: "Their language counted as language.", mayMiss: "That inclusion criteria need to be something." },
      { label: "The teacher", sees: "A standard to teach against.", values: "A reference students can rely on.", mayMiss: "That the standard is one variety with institutional backing." }
    ],
    contested: "Whether a dictionary can describe usage without also enforcing a standard.",
    changeYourMind: "Look for a word you grew up with and see whether it is listed."
  },

  // Bodies and health
  "disability-access": {
    opening: "Access reveals what a place assumed about the bodies passing through it. Retrofits show the assumption; they rarely remove it.",
    standpoints: [
      { label: "The disabled person", sees: "Routes that exist on a plan and fail in practice.", values: "Arriving the same way as everyone else.", mayMiss: "The genuine constraints of altering old structures." },
      { label: "The building owner", sees: "Cost, heritage rules and structural limits.", values: "Compliance that is achievable.", mayMiss: "That a compliant entrance at the back is not equal access." },
      { label: "The other user", sees: "A ramp that also helps them with a pram or a trolley.", values: "Convenience.", mayMiss: "That what is convenience for them is necessity for others." }
    ],
    contested: "Whether access should mean the same route for everyone or an equivalent one.",
    changeYourMind: "Enter a building you use often by its accessible route."
  },
  "pain": {
    opening: "Pain is entirely real and cannot be shown. Every system for responding to it depends on description, and description depends on being believed.",
    standpoints: [
      { label: "The person in pain", sees: "An experience that exceeds the vocabulary offered.", values: "Being believed without proving it.", mayMiss: "That clinicians see people whose accounts conflict with findings." },
      { label: "The clinician", sees: "Reports, scales and no objective measure.", values: "Treating appropriately without harm.", mayMiss: "That scepticism falls unevenly across patients." },
      { label: "The family", sees: "Change in a person they know well.", values: "Advocating effectively.", mayMiss: "That their account can override the patient's own." }
    ],
    contested: "How much weight self-reported pain should carry when it cannot be verified.",
    changeYourMind: "Try describing a past pain precisely enough for someone to act on it."
  },
  "public-health": {
    opening: "Public health reasons about populations; people live individually. A measure can be correct in aggregate and unbearable in a particular life.",
    standpoints: [
      { label: "The individual", sees: "A rule that does not fit their circumstances.", values: "Being treated as a case.", mayMiss: "That exceptions at scale can dissolve the measure." },
      { label: "The public health official", sees: "Distributions and what changes them.", values: "Reducing harm overall.", mayMiss: "That the burden of a measure is rarely evenly spread." },
      { label: "The clinician", sees: "One person, and guidance written for many.", values: "The patient in front of them.", mayMiss: "That individual exceptions can undermine collective benefit." }
    ],
    contested: "Whether public health should optimise the aggregate or protect those worst affected by its own measures.",
    changeYourMind: "Find a health measure that helped most people and made things harder for a specific group."
  },
  "rest-and-recovery": {
    opening: "Recovery needs time, income, housing and someone to help. Treatment is often the only one of those that a health system is set up to provide.",
    standpoints: [
      { label: "The person recovering", sees: "Discharge into conditions that do not permit rest.", values: "Being able to actually recover.", mayMiss: "The limits of what a clinical service can reach." },
      { label: "The clinician", sees: "A treatment completed and an outcome outside their control.", values: "Doing their part well.", mayMiss: "That the outcome is what the patient experiences." },
      { label: "The employer", sees: "Absence, cover and a return-to-work date.", values: "Predictability.", mayMiss: "That an early return often produces a longer absence later." }
    ],
    contested: "Whether recovery is a clinical responsibility or a social one.",
    changeYourMind: "Ask what someone would need at home to recover properly, and who provides it."
  },
  "ageing": {
    opening: "Cities are largely designed around a body that moves quickly and does not need to sit. Ageing makes that design visible, first to older people and eventually to everyone.",
    standpoints: [
      { label: "The older resident", sees: "Distances between rests, kerb heights and crossing times.", values: "Staying independent in the place they know.", mayMiss: "That the same design pressures affect others too." },
      { label: "The planner", sees: "Flow, capacity and competing demands on space.", values: "A city that works at peak.", mayMiss: "That designing for the fastest excludes progressively more people." },
      { label: "The family", sees: "Risk, and a wish to reduce it.", values: "Knowing the person they love is not at risk.", mayMiss: "That protection can shrink a life faster than the ageing did." }
    ],
    contested: "Whether ageing well is mainly a matter of care provision or of ordinary design.",
    changeYourMind: "Time a pedestrian crossing and ask who comfortably makes it."
  },
  "body-and-work": {
    opening: "Every job makes a physical demand, and the demands that accumulate slowly are the ones least likely to be recorded as injury.",
    standpoints: [
      { label: "The worker", sees: "Wear that appears years later.", values: "Leaving the job in the condition they entered it.", mayMiss: "That some risk is inherent to work they chose." },
      { label: "The safety officer", sees: "Incidents, thresholds and what is reportable.", values: "Preventing recordable harm.", mayMiss: "That cumulative strain rarely produces an incident." },
      { label: "The customer", sees: "A service delivered.", values: "Speed and price.", mayMiss: "That the pace they expect is set into someone's body." }
    ],
    contested: "Whether slow cumulative harm should be treated as injury or as an expected cost of the work.",
    changeYourMind: "Ask someone twenty years into a physical job what it has taken."
  },
  "mental-health-language": {
    opening: "The words available shape whether asking for help feels possible. Clinical language grants legitimacy and can also make ordinary difficulty sound like diagnosis.",
    standpoints: [
      { label: "The person struggling", sees: "Vocabulary that either fits or medicalises.", values: "Being taken seriously without being labelled.", mayMiss: "That a label can unlock help nothing else will." },
      { label: "The clinician", sees: "Categories that guide treatment.", values: "Precision that leads somewhere.", mayMiss: "That the category becomes an identity outside the clinic." },
      { label: "The friend", sees: "Someone they want to help and no idea what to say.", values: "Not making it worse.", mayMiss: "That saying something imperfect usually beats silence." }
    ],
    contested: "Whether wider use of clinical language reduces stigma or dilutes the meaning of diagnosis.",
    changeYourMind: "Ask someone what words made it easier for them to ask for help."
  },
  "care-record": {
    opening: "A care record is written by professionals and read by professionals, about a person who is usually neither. Its language and its silences follow the person for years.",
    standpoints: [
      { label: "The patient", sees: "Themselves described in terms they did not choose.", values: "Accuracy, and a say in the account.", mayMiss: "That the record is written for clinical decisions, not for them." },
      { label: "The clinician", sees: "Notes made quickly under load, for colleagues.", values: "Useful handover.", mayMiss: "That shorthand judgements persist and are read as fact." },
      { label: "The next clinician", sees: "A history that frames the person before they speak.", values: "Knowing what has already been tried.", mayMiss: "That the framing may be an old error repeated." }
    ],
    contested: "Whether patients should co-author their records or whether that would compromise clinical candour.",
    changeYourMind: "Read your own medical notes and see whether you recognise the person in them."
  },
  "sport-and-belonging": {
    opening: "Sport creates belonging quickly by supplying a shared thing to care about. The same mechanism draws a line around who is inside.",
    standpoints: [
      { label: "The player", sees: "A team as a place they are counted on.", values: "Being needed.", mayMiss: "How hard it was for others to get onto the pitch." },
      { label: "The one who never joined", sees: "A culture with an entry cost in money, time or confidence.", values: "Being able to take part casually.", mayMiss: "That commitment is part of what makes the bond." },
      { label: "The organiser", sees: "Facilities, fixtures and volunteers.", values: "Keeping it running.", mayMiss: "That the structures that sustain it also gatekeep." }
    ],
    contested: "Whether sport's belonging can be widened without weakening what creates it.",
    changeYourMind: "Ask what it would cost, in money and hours, to join a local team this month."
  },
  "healing-practice": {
    opening: "Practices move with people and adapt where they land. Whether an adapted practice is a living tradition or a diluted one is argued by people who each have a real claim.",
    standpoints: [
      { label: "The practitioner in the tradition", sees: "Knowledge with a context that travels poorly.", values: "Integrity of the practice.", mayMiss: "That traditions have always adapted." },
      { label: "The person seeking help", sees: "Something that works for them.", values: "Something that eases what they came with.", mayMiss: "That effect and explanation may be unrelated." },
      { label: "The clinician", sees: "Interactions, evidence and risk.", values: "Not causing harm.", mayMiss: "That dismissal drives use underground rather than ending it." }
    ],
    contested: "Whether a practice separated from its context remains the same practice.",
    changeYourMind: "Ask a practitioner what part of their practice does not survive being written down."
  },

  // Democracy and common life
  "listening": {
    opening: "Consultation can gather views without any of them changing an outcome. Being heard requires that something could have gone differently.",
    standpoints: [
      { label: "The person consulted", sees: "A process whose conclusion appeared settled.", values: "Evidence their input mattered.", mayMiss: "That some decisions are genuinely constrained." },
      { label: "The official", sees: "Statutory duties, timelines and competing responses.", values: "A defensible process.", mayMiss: "That defensible and responsive are different." },
      { label: "The person who did not respond", sees: "A process not built for their hours or language.", values: "Being reachable.", mayMiss: "That organisers may have tried within their means." }
    ],
    contested: "Whether consultation is legitimate when the decision space is already narrow, provided that is stated.",
    changeYourMind: "Read a consultation report and find one thing the responses actually changed."
  },
  "protest": {
    opening: "Protest is often judged on disruption rather than argument. Disruption is frequently the only means by which the argument gets attention at all.",
    standpoints: [
      { label: "The protester", sees: "Channels tried and exhausted.", values: "Being impossible to ignore.", mayMiss: "That disruption can lose the people they need." },
      { label: "The person inconvenienced", sees: "A day disrupted for a cause not theirs.", values: "Getting on with life.", mayMiss: "That their normal day may depend on what is being protested." },
      { label: "The authority", sees: "Order, safety and precedent.", values: "Predictability.", mayMiss: "That suppressing the visible form does not settle the grievance." }
    ],
    contested: "Whether disruption is a legitimate part of political speech or a cost that discredits it.",
    changeYourMind: "Pick a right you have and find out what it took to win it."
  },
  "rule-and-exception": {
    opening: "A rule is written for a typical case. Who lives at the edge, and how easily they can get an exception, is where a system's fairness actually sits.",
    standpoints: [
      { label: "The person at the edge", sees: "A rule that produces an absurd result in their case.", values: "Discretion.", mayMiss: "That discretion is applied unevenly too." },
      { label: "The administrator", sees: "Volume, consistency and the risk of arbitrary treatment.", values: "Treating like cases alike.", mayMiss: "That rigid application produces its own arbitrariness." },
      { label: "The person who fits", sees: "A system that works.", values: "Simplicity.", mayMiss: "That their experience is not evidence about the system." }
    ],
    contested: "Whether fairness is better served by firm rules or by discretion.",
    changeYourMind: "Find out how someone actually obtains an exception, and how long it takes."
  },
  "local-decision": {
    opening: "Local decisions are closest to those affected and often least scrutinised. Proximity improves knowledge and does not by itself improve fairness.",
    standpoints: [
      { label: "The affected resident", sees: "A decision made about their street by people they can find.", values: "Access to the decision.", mayMiss: "That local majorities can be as exclusionary as distant ones." },
      { label: "The councillor", sees: "Competing demands and a budget that will not stretch.", values: "Something deliverable.", mayMiss: "That the loudest constituents are not the most affected." },
      { label: "The person who cannot attend", sees: "Decisions taken at hours they work.", values: "Participation that fits a life.", mayMiss: "That meetings must happen at some hour." }
    ],
    contested: "Whether decisions should sit as locally as possible or where the affected population is fully represented.",
    changeYourMind: "Find out when your local decisions are made and who can attend at that hour."
  },
  "citizenship": {
    opening: "Citizenship is a legal status and a set of practices, and the two come apart. People with the document may not participate; people without it often carry the place.",
    standpoints: [
      { label: "The long-term resident without status", sees: "Contribution without standing.", values: "Recognition of what they already do.", mayMiss: "That status carries obligations as well as rights." },
      { label: "The citizen", sees: "A status they did not earn and rarely think about.", values: "A standing they never had to argue for.", mayMiss: "How much of their security is invisible to them." },
      { label: "The state", sees: "Membership, obligation and a boundary that must exist somewhere.", values: "A definable body of members.", mayMiss: "That the boundary excludes people fully inside the society." }
    ],
    contested: "Whether citizenship should track legal status or actual participation.",
    changeYourMind: "List what you can do because of your status, and ask who does the same work without it."
  },
  "public-trust": {
    opening: "Trust is built slowly by institutions doing what they said, and lost quickly when they do not. Repair is slower than the loss and usually less visible.",
    standpoints: [
      { label: "The person who stopped trusting", sees: "A specific failure and no accountability afterwards.", values: "Being told the truth, including about failure.", mayMiss: "That the institution may have changed since." },
      { label: "The institution", sees: "Improvements made quietly and a reputation that lags.", values: "Being judged on current practice.", mayMiss: "That trust is restored by acknowledgement, not by improvement alone." },
      { label: "The frontline worker", sees: "Distrust arriving before they have done anything.", values: "Being met as an individual.", mayMiss: "That they represent the institution to the person in front of them." }
    ],
    contested: "Whether trust is rebuilt by better performance or by admitting the original failure.",
    changeYourMind: "Recall an institution you stopped trusting and what would actually restore it."
  },
  "neighbourhood-assembly": {
    opening: "Who is in the room determines what counts as the local view. Meetings held at fixed hours in fixed places select their participants before anyone speaks.",
    standpoints: [
      { label: "The regular attender", sees: "A forum open to anyone who turns up.", values: "Participation earned by showing up.", mayMiss: "That turning up is unevenly possible." },
      { label: "The absent resident", sees: "Decisions taken while they worked.", values: "Being represented anyway.", mayMiss: "That someone has to do the work of attending." },
      { label: "The chair", sees: "Quorum, agenda and the same voices each time.", values: "A functioning meeting.", mayMiss: "That the format itself is the filter." }
    ],
    contested: "Whether local legitimacy comes from open invitation or from representative attendance.",
    changeYourMind: "Look at who attended your last local meeting and who lives in the area."
  },
  "vote-and-voice": {
    opening: "A vote is periodic, equal and coarse. Most political influence happens between elections through means that are none of those things.",
    standpoints: [
      { label: "The voter", sees: "One clear moment of equal say.", values: "A right that cannot be taken.", mayMiss: "How much is settled in the intervals." },
      { label: "The organiser", sees: "Sustained pressure as what actually moves decisions.", values: "Ongoing participation.", mayMiss: "That organising capacity is unequally distributed too." },
      { label: "The official", sees: "A mandate and continuous competing claims.", values: "Legitimate authority to act.", mayMiss: "That a mandate is thin evidence about any specific question." }
    ],
    contested: "Whether influence between elections strengthens democracy or distorts the mandate.",
    changeYourMind: "Trace one local decision back to what actually caused it."
  },
  "mutual-aid": {
    opening: "Mutual aid moves fast because it skips eligibility checks. That is its advantage and the reason it is hard to scale or sustain.",
    standpoints: [
      { label: "The organiser", sees: "Need met in hours rather than weeks.", values: "Solidarity rather than assessment.", mayMiss: "That volunteer capacity exhausts." },
      { label: "The recipient", sees: "Help without proving deservingness.", values: "Dignity in receiving.", mayMiss: "That informal help can carry social obligation." },
      { label: "The institution", sees: "Coverage, consistency and accountability.", values: "Everyone reached, not only the well-connected.", mayMiss: "That its own processes exclude people who cannot navigate them." }
    ],
    contested: "Whether mutual aid supplements institutions or exposes what they should be doing.",
    changeYourMind: "Ask a mutual aid group what they do that a formal service cannot."
  },
  "disagreement": {
    opening: "A society does not need agreement to function; it needs a way of disagreeing that people can stay inside. That practice is maintained deliberately or it erodes.",
    standpoints: [
      { label: "The one who disagrees", sees: "A position treated as bad faith rather than answered.", values: "Being argued with.", mayMiss: "That some positions cost others their standing." },
      { label: "The one who is tired", sees: "Debate as something that has previously gone nowhere.", values: "Not relitigating settled ground.", mayMiss: "That treating a question as closed can be the disagreement." },
      { label: "The mediator", sees: "Where the actual difference lies beneath the argument.", values: "Keeping people in the room.", mayMiss: "That some disagreements should not be smoothed." }
    ],
    contested: "Whether every disagreement deserves engagement or some are better refused.",
    changeYourMind: "Find someone you disagree with and state their position until they agree it is fair."
  },

  // The freedom struggle, argued
  "revolt-1857": {
    opening: "The same eighteen months are taught as a sepoy mutiny, as a feudal reaction, and as a first war of independence. The disagreement is not really about what happened. It is about what counts as a nation acting, and whether people who never used the word were nonetheless doing the thing.",
    standpoints: [
      { label: "The company's account", sees: "A military breakdown that began in the ranks, spread through grievance and rumour, and was put down.", values: "Explaining a collapse in terms an administration can act on, which means discipline and command.", mayMiss: "That framing it as indiscipline made the political demands of those involved unreadable by design." },
      { label: "The nationalist reading", sees: "A coordinated refusal across regions, castes and faiths, with rulers, peasants and soldiers acting together against one power.", values: "Recognising ordinary people as political actors rather than as a mob.", mayMiss: "How local and dynastic many of the aims were, and how many Indians fought on the other side." },
      { label: "The dispossessed ruler", sees: "A chance to reverse annexations and a doctrine that had swallowed states without a war.", values: "Restoration of a specific sovereignty, not the creation of a new one.", mayMiss: "That a restored order would have returned most participants to where they started." },
      { label: "The peasant who joined", sees: "Revenue demands, dispossession and the courts that enforced both.", values: "Relief that arrives in the village, whoever delivers it.", mayMiss: "That the leadership he was fighting under had no plan for his land question either." }
    ],
    contested: "Whether an uprising has to imagine a nation in order to be one. One side argues that intention is what makes a national movement; the other that the effect on the imperial state, and on what Indians later believed possible, is what matters.",
    changeYourMind: "Read the proclamations issued in Delhi and Awadh in 1857 alongside the annexation records of the preceding decade. If the language reaches past dynasty toward a shared grievance, the nationalist reading gains ground. If it does not, the restorationist reading does."
  },
  "moderates-and-extremists": {
    opening: "The Moderates are remembered for petitions that were ignored and the Extremists for a militancy that was suppressed. Both judgements are made from the far end, knowing how it finished. At the time, neither knew whether the other was the wasted decade.",
    standpoints: [
      { label: "The constitutional petitioner", sees: "That an empire justifying itself by law can be held to its own law, and that the record of refusal is itself evidence.", values: "Building a case that survives, and an educated public that can read it.", mayMiss: "That a case can be unanswerable and still be ignored for forty years." },
      { label: "The advocate of pressure", sees: "That nothing moved until something cost the administration money, order or confidence.", values: "Making refusal expensive rather than merely embarrassing.", mayMiss: "That pressure without an organised base invites repression the base cannot absorb." },
      { label: "The provincial organiser", sees: "That both wings were arguing in English about a country that mostly was not listening yet.", values: "Reaching people in their own language before deciding what to ask for.", mayMiss: "That the constitutional work created the vocabulary the mass phase later used." },
      { label: "The colonial administrator", sees: "One wing to negotiate with and another to police, and an advantage in keeping them apart.", values: "A managed opposition over an unmanageable one.", mayMiss: "That the split he encouraged made the eventual synthesis stronger." }
    ],
    contested: "Whether the economic critique the Moderates built, of drain and deindustrialisation, did more lasting damage to imperial legitimacy than any agitation, or whether it merely made the case that agitation later enforced.",
    changeYourMind: "Trace one specific demand from a Congress resolution of the 1890s to its appearance in law. If the path runs through the argument itself, the constitutional case is stronger. If it runs only through a later moment of disorder, the case for pressure is."
  },
  "swadeshi-1905": {
    opening: "A partition of Bengal produced the first mass boycott, a wave of indigenous enterprise and schooling, and a set of exclusions that were not incidental to it. Both are the same movement and neither cancels the other.",
    standpoints: [
      { label: "The boycotting student", sees: "That refusal can be organised, sustained and felt in another country's ledgers.", values: "Discovering that ordinary participation has leverage.", mayMiss: "How much of the burden fell on traders and weavers who had no choice about the goods they handled." },
      { label: "The Muslim cultivator in east Bengal", sees: "A campaign led largely by the landholding class he already owed rent to, and a new province that had promised him attention.", values: "Not being asked to sacrifice for a settlement that leaves his position unchanged.", mayMiss: "That the administrative promise was partly a device to divide the opposition." },
      { label: "The builder of national institutions", sees: "Schools, banks and mills founded in a few years, and proof that substitution was possible.", values: "Capacity that outlasts a campaign.", mayMiss: "That most of those enterprises did not survive the decade." },
      { label: "The official in Calcutta", sees: "Administrative logic in dividing an unmanageable province, and agitation as the response of a narrow elite.", values: "Governability.", mayMiss: "That the reversal in 1911 conceded the political point entirely." }
    ],
    contested: "Whether the exclusions were a failure of a good movement or a feature of how it was built, and therefore whether the later communal settlement was an accident or an inheritance.",
    changeYourMind: "Compare participation in the boycott across districts against landholding and religious composition. If refusal held where the leadership had no economic hold, the movement was broader than its critics allow."
  },
  "champaran-method": {
    opening: "A dispute about indigo cultivation in one district became the model for everything that followed. What made it a template was not the grievance, which was old, but the method: arrive, record, refuse to leave, and make the recording itself the confrontation.",
    standpoints: [
      { label: "The cultivator under tinkathia", sees: "An obligation to grow a crop he cannot eat on land he needs for food, enforced by people who live nearby.", values: "Ending a specific, daily compulsion.", mayMiss: "That the settlement reached still left the planters' wider position intact." },
      { label: "The organiser taking statements", sees: "That thousands of individual depositions are harder to dismiss than one representative's claim.", values: "Evidence gathered from those affected, in their own words.", mayMiss: "That the method depends on an administration that can still be embarrassed by a record." },
      { label: "The planter", sees: "Contracts, investment and a system that had operated lawfully for decades.", values: "Certainty of supply.", mayMiss: "That legality had been built around a compulsion nobody had consented to." },
      { label: "The district officer", sees: "An outsider raising a settled matter, and a queue outside his office that will not disperse.", values: "Order restored at the least cost.", mayMiss: "That conceding the inquiry conceded the principle that peasants could summon the state." }
    ],
    contested: "Whether the method generalises. It worked where the grievance was specific, local and documentable. Whether the same approach can carry a demand as broad as self-rule is the question the next thirty years tested.",
    changeYourMind: "Look at how many of the depositions taken in 1917 were used in the commission's findings. If the record shaped the outcome, the method was doing the work. If the outcome turned on political pressure elsewhere, the record was a device rather than the cause."
  },
  "khilafat-alliance": {
    opening: "For two years the largest mobilisation India had seen joined a demand about an Ottoman office to a demand about Indian self-rule. It ended when the office was abolished by Turkey itself. What that alliance bought, and what it cost afterwards, is still argued.",
    standpoints: [
      { label: "The organiser of unity", sees: "The one moment when a single campaign moved both major communities together, at scale, in the same direction.", values: "A political fact that had never existed before and did not last.", mayMiss: "That the shared cause was external, and could not survive its own resolution." },
      { label: "The sceptic of religious mobilisation", sees: "A national movement borrowing energy from a theological grievance it could not itself define or defend.", values: "Politics grounded in claims all citizens can weigh.", mayMiss: "That the mobilisation reached people no secular appeal had reached." },
      { label: "The Khilafat committee member", sees: "A genuine and widely felt obligation, not a tactic to be assessed for its Indian yield.", values: "Being taken seriously on his own terms rather than as a recruit.", mayMiss: "How exposed the cause was to a decision taken in Ankara." },
      { label: "The later historian of communal politics", sees: "Organisational habits and vocabularies formed in these years that outlived the alliance and were available afterwards to divide.", values: "Tracing consequences past the moment of intent.", mayMiss: "That the same years produced the strongest evidence that a shared politics was possible." }
    ],
    contested: "Whether the alliance created the conditions for later separation, or whether it was the last thing holding it off. The same evidence supports both, depending on where the account is allowed to stop.",
    changeYourMind: "Follow the individual leaders of the Khilafat committees through the next fifteen years. Where they end up, and how quickly, tells you whether the alliance built something or borrowed it."
  },
  "chauri-chaura": {
    opening: "A police post was burned and twenty-two policemen died, and the largest movement in the country was called off within days, over the objections of most of its leadership. It is either the moment the movement proved its seriousness, or the moment it lost its opening.",
    standpoints: [
      { label: "The leader who withdrew", sees: "That a movement which cannot hold to non-violence under provocation will become the thing it opposes, and lose the only advantage it has.", values: "Means that can survive success.", mayMiss: "The cost to those already imprisoned, and to a mobilisation that would take a decade to rebuild." },
      { label: "The imprisoned organiser", sees: "Momentum surrendered at the point of maximum pressure, on the strength of one incident among many.", values: "Seeing through what people had already sacrificed for.", mayMiss: "That a movement excusing this incident would be asked to excuse the next." },
      { label: "The crowd at Chauri Chaura", sees: "Provocation, firing, and a police post that had been a source of everyday coercion long before that day.", values: "Not being written out of their own action as a lapse in someone else's discipline.", mayMiss: "That the leadership's authority rested on a claim that could not admit exceptions." },
      { label: "The revolutionary watching", sees: "Confirmation that mass non-violence would always stop short, and that another method was needed.", values: "Consistency between the scale of the wrong and the scale of the response.", mayMiss: "That the movement's restraint was what made its moral claim legible abroad." }
    ],
    contested: "Whether non-violence was a strategy, to be judged on results, or a commitment, which cannot be suspended when it becomes expensive without ceasing to be one.",
    changeYourMind: "Compare the recruitment and the repression that followed the withdrawal with what followed the movements that did not withdraw. If the pause preserved the base, the decision looks strategic as well as principled."
  },
  "salt-as-symbol": {
    opening: "Of every grievance available in 1930, the one chosen was a tax on salt. Sophisticated observers on all sides thought it trivial. It turned out to be the most legible demand of the entire struggle, and the reason is worth understanding rather than admiring.",
    standpoints: [
      { label: "The organiser choosing the issue", sees: "A law everyone breaks against, that costs the poorest most, that anyone can defy publicly with their hands, and that the state must either enforce visibly or abandon.", values: "A demand that needs no explaining and no literacy.", mayMiss: "That symbolic clarity can substitute for a programme once the campaign ends." },
      { label: "The Congress economist", sees: "A minor revenue head standing in for a whole fiscal relationship, and the risk of winning the symbol and losing the substance.", values: "Structural change over a demonstration.", mayMiss: "That structural demands had produced forty years of nothing." },
      { label: "The woman joining a public procession", sees: "The first political act available to her that required no property, no office and no permission from a party.", values: "Entry into public life through the least guarded door.", mayMiss: "That the space opened would be narrowed again once the campaign closed." },
      { label: "The viceroy's office", sees: "An unenforceable law and a choice between looking brutal and looking irrelevant.", values: "Authority preserved at acceptable cost.", mayMiss: "That both options conceded that the law governed only by consent." }
    ],
    contested: "Whether the campaign's success came from the moral force of the act or from the administrative trap it set, and whether a movement can repeat the trick once the other side has seen it.",
    changeYourMind: "Look at what the salt laws actually did to household budgets at the bottom of the income distribution. If the burden was real and heavy, the symbol was also a substantive grievance, and the distinction the critics drew collapses."
  },
  "revolutionary-path": {
    opening: "A small number of people chose armed action while a mass movement was running, and were executed for it. They are commemorated everywhere and their argument is rarely examined, which is a strange way to honour people who wrote a great deal about why they did what they did.",
    standpoints: [
      { label: "The revolutionary", sees: "That an empire holds by force, that petition and even mass refusal leave that force untested, and that a public trial is a platform nothing else provides.", values: "Proportion between the violence of the order and the response to it.", mayMiss: "That the platform depends on a state willing to hold a public trial at all." },
      { label: "The mass organiser", sees: "Actions that cannot be repeated at scale, cannot be defended in public, and hand the administration its justification.", values: "Methods ordinary people can join without dying.", mayMiss: "That the executions moved more people than most of his own campaigns." },
      { label: "The socialist within the movement", sees: "In the later writing, a programme about class and property that the commemorations quietly drop.", values: "Taking the stated politics seriously rather than only the sacrifice.", mayMiss: "That the writing was done young, under sentence, and was still changing." },
      { label: "The family of a policeman killed", sees: "A person, not a symbol, and a death that no account of the movement lists by name.", values: "Being counted.", mayMiss: "The scale of the violence being answered." }
    ],
    contested: "Whether the revolutionaries are best understood as a moral supplement to the mass movement, supplying urgency it lacked, or as a rival politics with a different analysis that was defeated rather than absorbed.",
    changeYourMind: "Read the court statements and the later prison writing rather than the commemorations. If a worked-out political programme is there, the rival-politics reading holds. If the writing is mostly about method and sacrifice, the supplement reading does."
  },
  "quit-india-1942": {
    opening: "The leadership was arrested within hours of the resolution. What followed for three months was therefore not led by them, and that is the most interesting fact about it. A movement without its command structure revealed who else had been organising all along.",
    standpoints: [
      { label: "The student and local organiser", sees: "That the absence of instruction was an opening, and that parallel administration in a district was actually achievable.", values: "Initiative that does not wait for permission.", mayMiss: "That what could be seized in a district could not be held against a state that had decided to reconquer it." },
      { label: "The imprisoned leadership", sees: "A movement it had called and could not shape, taking forms it had spent twenty years arguing against.", values: "Coherence between the demand and the method.", mayMiss: "That its own resolution had invited exactly this by naming no next step." },
      { label: "The wartime administration", sees: "An insurrection during a war on two fronts, and a free hand to end it.", values: "Holding the country as a base.", mayMiss: "That the scale of force required demonstrated how little consent remained." },
      { label: "The communist and the Muslim League, standing aside", sees: "A war against fascism that ought not to be sabotaged, or a movement that had not settled the constitutional question they cared about.", values: "Their own priority, held openly.", mayMiss: "That absence in 1942 became a charge against them for decades." }
    ],
    contested: "Whether 1942 hastened the departure by proving the country ungovernable, or delayed a negotiated settlement by removing every leader capable of negotiating one for three years.",
    changeYourMind: "Look at where parallel governments actually functioned and for how long. If they held in more than a handful of places, the ungovernability argument gains real weight."
  },
  "ina-trials": {
    opening: "An army that lost its campaign changed Indian politics more in three months of courtroom proceedings than in its years in the field. The decision to try the officers publicly, at the Red Fort, is one of the most consequential administrative misjudgements of the period.",
    standpoints: [
      { label: "The defence lawyer", sees: "A charge of treason that requires the court to assert allegiance to a crown the defendants deny, in front of the country.", values: "Turning a prosecution into an examination of the state's own claim.", mayMiss: "That the strategy worked because of the moment, not because of its legal strength." },
      { label: "The serving Indian soldier", sees: "Men from the same regiments and villages, tried for a choice he might have faced, by officers who had recently needed him.", values: "Not being asked to enforce a distinction he does not accept.", mayMiss: "That the loyalty being tested was what had held the whole arrangement together." },
      { label: "The Congress leadership", sees: "A cause capable of uniting opinion across communities at a moment when little else could.", values: "Consolidation at the point of transfer.", mayMiss: "That defending the soldiers meant honouring a wartime alliance it had opposed." },
      { label: "The official reviewing the decision", sees: "That the trials had to happen for discipline, and that holding them in public was the error rather than holding them at all.", values: "An army that remains an army.", mayMiss: "That there was no venue where this could have been done quietly by then." }
    ],
    contested: "Whether the transfer of power was decided by the mass movement, by the war's exhaustion of British capacity, or by the moment the administration could no longer be certain of the loyalty of Indian troops and police.",
    changeYourMind: "Read the internal assessments of the reliability of Indian forces written in 1945 and 1946. If they changed sharply around the trials and the naval mutiny, the loyalty argument is doing more work than the others."
  },

  // Partition and its arithmetic
  "two-nation-claim": {
    opening: "The claim that Hindus and Muslims formed two nations was made for decades before it became a border. Treating it as either an ancient truth or a sudden invention both avoid the harder question: what changed between it being one argument among many and it being the basis of a state.",
    standpoints: [
      { label: "The League's constitutional case", sees: "A permanent minority in a majoritarian democracy, with no reserved share of power that the majority cannot amend away.", values: "Guarantees written into the structure rather than promised by goodwill.", mayMiss: "That the remedy chosen stranded the very populations it invoked, in provinces that were never going to move." },
      { label: "The Congress reply", sees: "A composite society where religious identity is one affiliation among several, and a claim that hardens into permanence only if institutions are built on it.", values: "Citizenship that does not require declaring a community first.", mayMiss: "That its own assurances were not backed by any mechanism a minority could enforce." },
      { label: "The nationalist Muslim", sees: "His position erased by both sides: refused as unrepresentative by one and treated as an exception by the other.", values: "A politics where he is not the residue of someone else's argument.", mayMiss: "How thin his organisational base was once the question became a plebiscite." },
      { label: "The provincial politician", sees: "Coalitions in Punjab and Bengal that had worked across the line for years, being pulled apart by an argument conducted elsewhere.", values: "Local arrangements that had actually held.", mayMiss: "That those arrangements depended on a centre nobody was going to leave intact." }
    ],
    contested: "Whether separation followed from a claim about what a nation is, or from the mechanics of representation under the 1935 Act and the 1946 elections, which made communal blocs the currency of politics before anyone had settled the theory.",
    changeYourMind: "Read the 1946 provincial election results next to the franchise rules that produced them. If the mandate looks like a product of a restricted separate-electorate franchise, the mechanical explanation carries more weight than the ideological one."
  },
  "cabinet-mission": {
    opening: "In 1946 a plan was put forward that would have kept India together with a weak centre and grouped provinces. Both major parties accepted it and then read it differently, and it collapsed. It remains the last documented alternative to partition.",
    standpoints: [
      { label: "The advocate of grouping", sees: "A structure giving Muslim-majority provinces collective weight without a separate state, and a ten-year exit if it failed.", values: "A settlement short of amputation.", mayMiss: "That grouping compulsory at the start and optional later was a contradiction, not a compromise." },
      { label: "The centralist", sees: "A union so weak it could not tax, plan or hold itself together, guaranteeing a slower partition rather than none.", values: "A state capable of acting.", mayMiss: "That a strong centre was precisely the thing the other side could not accept." },
      { label: "The provincial minority inside a group", sees: "That grouping protects one minority by creating another, in Assam and in East Punjab, with no protection at all.", values: "Not being someone else's arithmetic.", mayMiss: "That the alternative on offer would place him across a border instead." },
      { label: "The departing administration", sees: "A last chance to leave one successor state rather than two, and a timetable already fixed.", values: "An orderly transfer.", mayMiss: "That the timetable itself removed the time the plan needed to be tested." }
    ],
    contested: "Whether the plan failed because its text was genuinely ambiguous on whether grouping was compulsory, or because neither party wanted it to succeed on the other's reading and the ambiguity was a convenience.",
    changeYourMind: "Read the plan's own wording on grouping alongside the two parties' immediate public statements. If the text will not bear one reading, the ambiguity was real and the collapse was drafting. If it will, the collapse was political."
  },
  "direct-action-day": {
    opening: "A single day in Calcutta in August 1946 killed thousands and changed what participants on all sides believed was coming. Whether it was intended as a demonstration or as what it became is disputed. Its effect is not.",
    standpoints: [
      { label: "The organiser who called it", sees: "A show of political strength after constitutional routes had closed, of a kind other parties had used for decades.", values: "Being taken seriously after being outvoted.", mayMiss: "That calling a general strike in a divided city with a partisan administration is not a controllable act." },
      { label: "The resident of a mixed neighbourhood", sees: "Neighbours becoming a threat within hours, and no police response for a day and a night.", values: "Survival, and afterwards, distance.", mayMiss: "Nothing. This standpoint is the one the political accounts most often skip." },
      { label: "The provincial administration", sees: "A holiday declared, a force it did not trust to be impartial, and a decision to wait.", values: "Not making it worse by intervening badly.", mayMiss: "That waiting was itself a decision with a body count." },
      { label: "The negotiator afterwards", sees: "That the argument had moved from what should happen to what could be prevented.", values: "Speed, above the terms.", mayMiss: "That speed produced boundaries drawn without survey and transfers without protection." }
    ],
    contested: "Whether the violence made partition inevitable or merely made it faster, and whether treating it as a turning point flatters the political actors by removing their choices after it.",
    changeYourMind: "Compare the negotiating positions of each party in July 1946 with those in October. If the terms shift more than the timetable, the event changed the substance and not only the pace."
  },
  "radcliffe-line": {
    opening: "A lawyer who had never been to India was given about five weeks to divide two provinces, using outdated census material, and was gone before the line was published. The result governs the daily lives of hundreds of millions and is still being litigated in water, in fields and in memory.",
    standpoints: [
      { label: "The boundary commissioner", sees: "An impossible instruction, contradictory criteria, and a deadline he did not set.", values: "Finishing a job nobody else would take.", mayMiss: "That accepting the timetable made the outcome his as well." },
      { label: "The farmer whose land the line crossed", sees: "A field on one side and a well on the other, and a canal head now in another country.", values: "Continuity of the thing he actually farms.", mayMiss: "That no line drawn anywhere would have left every system whole." },
      { label: "The demographer", sees: "Criteria that could not all be satisfied at once: contiguity, majority, and other factors deliberately left undefined.", values: "Saying plainly that the brief was incoherent.", mayMiss: "That an incoherent brief still had to produce a line by a date." },
      { label: "The official defending the timetable", sees: "That delay would have meant governing a collapsing situation with no authority to do it.", values: "Leaving before the state failed entirely.", mayMiss: "That the haste transferred the whole cost of the failure onto people who had no say in the date." }
    ],
    contested: "Whether a boundary can be assessed as a technical exercise at all, or whether the choice to draw one on that timetable, with those criteria, was the decision and the cartography merely its execution.",
    changeYourMind: "Look at the award's treatment of the canal systems in Punjab. If irrigation was considered and overridden, the exercise was political. If it was never assessed, the incoherence of the brief is the better explanation."
  },
  "punjab-and-bengal": {
    opening: "Both provinces were divided, both saw enormous violence and movement, and the two are remembered very differently. Punjab is a rupture with a date; Bengal is a longer displacement that never quite resolved into an event.",
    standpoints: [
      { label: "The Punjabi refugee", sees: "A near-total exchange over months, columns on the roads, and arrival in a country that at least expected him.", values: "Recognition of a catastrophe with a beginning and an end.", mayMiss: "That the completeness of the exchange is what made resettlement politically possible." },
      { label: "The Bengali who stayed, then left", sees: "Departure in waves over decades, arriving where no rehabilitation scheme was waiting and the crisis had been declared over.", values: "Being counted at all.", mayMiss: "That the slower pace also meant more people kept property, family and a route back for longer." },
      { label: "The rehabilitation official", sees: "Two problems with different shapes: one a surge to be absorbed, the other a flow with no end date to plan against.", values: "Matching the response to the form of the movement.", mayMiss: "That the open-ended problem got the smaller share precisely because it had no deadline." },
      { label: "The historian of memory", sees: "That a bounded event produces literature, commemoration and a settled national story, while a continuing one produces silence.", values: "Asking why some suffering becomes canonical.", mayMiss: "That the canonical account also flattens the Punjab experience into a single week." }
    ],
    contested: "Whether the difference is in the events or in the recording, and whether the national story required one partition to be the partition.",
    changeYourMind: "Compare rehabilitation spending per displaced person in the two regions across the 1950s. A large gap suggests the difference in memory follows a difference in treatment, rather than the other way round."
  },
  "migration-1947": {
    opening: "The movement of people in 1947 is usually given as a number. The number is contested, the direction was not always one way, and a great deal of what moved was not people at all: skills, tenancies, credit relationships and the assumption that where you live is where you stay.",
    standpoints: [
      { label: "The person who left", sees: "A decision made in days, on rumour and on what the neighbours did, expected to be temporary.", values: "Getting the family out.", mayMiss: "That the temporary framing is what left property claims unsettled for generations." },
      { label: "The person who stayed", sees: "A country that changed around him without his moving, and a new requirement to demonstrate belonging.", values: "The right not to have to prove it.", mayMiss: "That those who left often had no such option." },
      { label: "The receiving city", sees: "Population arriving faster than housing, water or work, and a politics reshaped for decades by where they settled.", values: "Absorption without collapse.", mayMiss: "That the settlements treated as temporary became permanent and underserved." },
      { label: "The statistician", sees: "Counts assembled from incompatible sources, with strong incentives on all sides to overstate or understate.", values: "Honest uncertainty over a confident figure.", mayMiss: "That refusing a number leaves the field to the least careful estimate." }
    ],
    contested: "Whether 1947 is best understood as an exchange of populations, which implies symmetry and completion, or as a displacement, which implies loss without a counterpart.",
    changeYourMind: "Follow property compensation claims filed in the 1950s on both sides. If the claims were largely settled, the exchange framing holds. If they were written off, displacement is the better word."
  },
  "princely-choice": {
    opening: "Over five hundred princely states were told that paramountcy would lapse and that they should accede to one dominion or the other. The formal position was that they had a choice. What that choice consisted of, in practice, varied enormously and is often described as though it did not.",
    standpoints: [
      { label: "The ruler", sees: "A treaty relationship being dissolved by one party, and an instrument of accession offered on a deadline.", values: "The terms of the arrangement he signed.", mayMiss: "That the arrangement had always rested on a power that was leaving." },
      { label: "The states department", sees: "A map that will not function with hundreds of enclaves, and a narrow window before positions harden.", values: "A viable country.", mayMiss: "That efficiency at that speed meant pressure that the formal choice was supposed to exclude." },
      { label: "The subject of a princely state", sees: "That nobody asked him, and that the popular movements inside several states were the actual force deciding the outcome.", values: "Being a party rather than an asset.", mayMiss: "That his movement's success often depended on the dominion's backing." },
      { label: "The lawyer of accession", sees: "Instruments limited to three subjects, later extended well beyond what was signed.", values: "Holding the document to its text.", mayMiss: "That every federal settlement of the period was renegotiated the same way." }
    ],
    contested: "Whether integration is best described as a negotiated accession, a popular movement inside the states, or an annexation conducted with paperwork. Different states support different answers, which is why single accounts of the process are usually arguing about the outliers.",
    changeYourMind: "Take three states with different outcomes and read the sequence of internal agitation, standstill agreement and accession in each. If popular pressure precedes the instrument, the movement account holds."
  },
  "partition-women": {
    opening: "After 1947 both new states ran programmes to recover women who had been abducted, and returned them across the border, in many cases against their stated wishes and years after they had built new lives. The programmes were widely supported at the time.",
    standpoints: [
      { label: "The recovering state", sees: "An obligation to citizens taken by force, and a national dishonour to be corrected.", values: "Restoration of what was taken.", mayMiss: "That it was defining the woman's belonging by the community she was born into, and overriding her own account." },
      { label: "The woman being recovered", sees: "A second removal, sometimes from children she cannot bring, into a family that may not accept her.", values: "Deciding for herself which life is hers.", mayMiss: "How little the framework of the time could hear that as a legitimate answer." },
      { label: "The receiving family", sees: "Honour, and a return that is also an accusation neighbours will remember.", values: "The family restored as it was.", mayMiss: "That the restoration is being performed on someone rather than for her." },
      { label: "The social worker administering it", sees: "Real cases of coercion alongside cases that were not, and no procedure that distinguishes them.", values: "Rescuing those genuinely held.", mayMiss: "That a programme without consent at its centre cannot tell the two apart, and did not try." }
    ],
    contested: "Whether the state may override an individual's stated choice in the name of correcting a wrong done to her, and who decides when the wrong has been corrected.",
    changeYourMind: "Read the recovery legislation's own provisions on consent. If consent is absent from the text rather than merely overridden in practice, the programme was designed to work this way and cannot be defended as implementation failure."
  },

  // Writing the Constitution
  "constituent-assembly": {
    opening: "The Assembly that wrote the Constitution was elected on a franchise covering a small fraction of adults, by provincial legislators, under rules written by the departing power. It then wrote universal adult suffrage into the document. Both facts are true and the tension between them is the interesting part.",
    standpoints: [
      { label: "The member defending its authority", sees: "The most representative body the country had ever assembled, working in public, with dissent recorded verbatim.", values: "Legitimacy earned through deliberation rather than through the ballot that selected it.", mayMiss: "That deliberative quality is not the same as a mandate." },
      { label: "The critic of its composition", sees: "A body dominated by one party, thin on peasants, workers and women, deciding for a population that had not chosen it.", values: "Who is actually in the room.", mayMiss: "That its first act was to make itself the last such body." },
      { label: "The member from a marginalised community", sees: "Space to argue for safeguards, and the limits of arguing from a small number of seats.", values: "Getting the guarantee into the text while the text is open.", mayMiss: "That a guarantee in the text still depends on later majorities to work." },
      { label: "The drafting lawyer", sees: "A technical problem of stitching borrowed provisions into something that will function under stress.", values: "A document that survives contact with actual government.", mayMiss: "That technical choices about emergency and centre-state power were political choices in other clothes." }
    ],
    contested: "Whether a body can legitimately write a constitution for people who did not elect it, if what it writes hands them the power to change it.",
    changeYourMind: "Compare the Assembly's composition with the first general election result. If the same forces win, the mandate objection weakens considerably."
  },
  "fundamental-rights-limits": {
    opening: "Almost every fundamental right in the Indian Constitution arrives with its restrictions in the same article. This was deliberate and heavily argued. It is either the reason the rights survived, or the reason they can be narrowed.",
    standpoints: [
      { label: "The drafter", sees: "That a right stated absolutely will be suspended entirely at the first emergency, and that writing the limits down keeps them reviewable.", values: "Restrictions that a court can measure.", mayMiss: "That a listed ground can be stretched further than an unlisted one could have been." },
      { label: "The civil libertarian", sees: "Qualifications broad enough that the exception can swallow the right, especially around public order.", values: "A right that means something when it is inconvenient.", mayMiss: "That absolute rights elsewhere have been suspended wholesale rather than trimmed." },
      { label: "The administrator", sees: "A country where a public order provision is used constantly and cannot simply be removed.", values: "Instruments that work in the conditions that exist.", mayMiss: "That routine use is what turns an exception into the norm." },
      { label: "The judge applying it", sees: "A test of reasonableness that gives the court a role it would not have if the right were absolute.", values: "Judicial supervision of the limit.", mayMiss: "That the same test lets restriction be validated case by case until little is left." }
    ],
    contested: "Whether writing limits into rights strengthens them by making restriction justiciable, or weakens them by pre-authorising it.",
    changeYourMind: "Track how often the reasonableness test has struck down a restriction rather than upheld it. A high strike rate supports the drafters; a low one supports the libertarian."
  },
  "directive-principles": {
    opening: "One part of the Constitution lists obligations of the state that no court may enforce. Calling them unenforceable promises is accurate and also misses what they have done to how laws are read.",
    standpoints: [
      { label: "The drafter", sees: "Goals a poor state cannot yet deliver, written down so that failure to pursue them is visible and arguable.", values: "Direction without pretending to capacity.", mayMiss: "That unenforceable text invites the charge of decoration." },
      { label: "The critic", sees: "A section that lets a state announce commitments it never has to meet, with the word not in the operative clause.", values: "Obligations with consequences.", mayMiss: "That several principles have since been legislated into enforceable rights." },
      { label: "The judge", sees: "An interpretive resource: where a right is ambiguous, the principles say which reading the Constitution prefers.", values: "Coherence between the two parts.", mayMiss: "That using unenforceable text to expand enforceable rights is doing indirectly what was expressly excluded." },
      { label: "The claimant", sees: "That whether her claim succeeds depends on which side of the line her subject happened to be placed in 1950.", values: "Getting the entitlement, whatever it is filed under.", mayMiss: "That the line is what allowed the promise to be made at all." }
    ],
    contested: "Whether unenforceable constitutional obligations are a serious legal instrument or an honest admission of inability, and whether the judicial migration of principles into rights respects the design or quietly overrides it.",
    changeYourMind: "List the directive principles that have become enforceable through legislation or judicial reading. If most have, the section worked as a queue rather than a graveyard."
  },
  "reservation-debate": {
    opening: "The Assembly argued about reservation not mainly as a question of fairness between individuals but as a question about what representation is for, and whether a guarantee that is meant to end should be written as though it will.",
    standpoints: [
      { label: "The advocate of safeguards", sees: "Exclusion so structural that formal equality preserves it, and a remedy that must be in the text because no majority would legislate it later.", values: "Presence in institutions as a precondition for everything else.", mayMiss: "That a remedy fixed in the text is hard to adjust as conditions change." },
      { label: "The opponent on principle", sees: "A constitution built on individual equality carving out group entitlements, and a category that political incentives will expand.", values: "Citizenship that does not require declaring a group.", mayMiss: "That the neutral rule operates on a distribution produced by centuries of the opposite." },
      { label: "The member arguing about duration", sees: "A safeguard with a sunset for legislatures and none for services, and no agreed measure of when it has worked.", values: "Knowing what success would look like.", mayMiss: "That defining the endpoint in 1949 would have fixed a standard nobody could then measure." },
      { label: "The excluded claimant", sees: "Categories drawn to include some historically excluded groups and not others equally placed.", values: "The remedy tracking the harm rather than the classification.", mayMiss: "That an unbounded category makes the remedy unadministrable." }
    ],
    contested: "Whether reservation was conceived as compensation for past exclusion, as a mechanism for present representation, or as a route to future irrelevance of the categories themselves. The three imply different endpoints and the text does not settle between them.",
    changeYourMind: "Read the Assembly debates on the duration clause. If members expected review against evidence rather than a fixed date, the compensation framing was not the dominant one."
  },
  "language-question": {
    opening: "India did not adopt a national language. It adopted an official language, with a fifteen-year transition that was then not enforced, after debates that came closer to breaking the Assembly than almost anything else.",
    standpoints: [
      { label: "The advocate of Hindi", sees: "A country that cannot administer itself in the language of a departed power, and the largest single language available.", values: "Self-government including in its vocabulary.", mayMiss: "That largest is not majority, and that imposition would create the resistance it feared." },
      { label: "The southern member", sees: "A proposal that makes his constituents foreigners in their own administration and disadvantages them in every examination.", values: "Not paying a permanent tax to belong.", mayMiss: "That English carried its own class barrier, favouring those already educated." },
      { label: "The speaker of a language on no list", sees: "An argument between two large claims, conducted entirely above his own.", values: "Recognition of the language actually spoken at home.", mayMiss: "That the number of languages makes any complete answer unworkable." },
      { label: "The drafter of the compromise", sees: "That deciding the question would fracture the country, and that not deciding it might not.", values: "A settlement that survives by remaining unfinished.", mayMiss: "That leaving it open meant fighting it again every generation." }
    ],
    contested: "Whether the language settlement is a model of pluralism or an unresolved dispute that has simply been deferred by successive governments unwilling to test it.",
    changeYourMind: "Look at what happened when the fifteen-year transition actually arrived in 1965. The response tells you whether the compromise had settled anything or only postponed it."
  },
  "federal-balance": {
    opening: "The Constitution distributes power between centre and states and then equips the centre to override that distribution in defined circumstances. Whether this is federalism with safeguards or a unitary state with federal features is the oldest live argument about the document.",
    standpoints: [
      { label: "The centralist drafter", sees: "A country just partitioned, with hundreds of states newly integrated and no assurance it holds.", values: "A centre that can act when the alternative is disintegration.", mayMiss: "That instruments built for emergencies are used for ordinary politics." },
      { label: "The state government", sees: "Its legislature dismissable, its governor appointed elsewhere, and its revenue determined by a formula it does not set.", values: "Autonomy in the subjects it was given.", mayMiss: "That several of the powers it objects to have been narrowed by courts and convention since." },
      { label: "The fiscal analyst", sees: "That the real federal balance is settled by where the money is raised and how it is shared, not by the legislative lists.", values: "Following the revenue rather than the text.", mayMiss: "That the legislative lists determine what a state can do with money once it has it." },
      { label: "The citizen in a small state", sees: "That a strong centre is sometimes the only thing that will act against his own state government.", values: "A remedy beyond the local majority.", mayMiss: "That the same reach is available against a state government he supports." }
    ],
    contested: "Whether the centralising provisions are emergency instruments that have been misused, or the actual design, with the federal language as the exception.",
    changeYourMind: "Count the uses of the provision for central rule in states before and after the judicial limits placed on it. A sharp fall suggests misuse of a sound design rather than the design itself."
  },
  "emergency-provisions": {
    opening: "The Constitution contains detailed instructions for its own suspension. The Assembly debated this at length and adopted it anyway, and one member warned on the record that it could turn the country into a police state. Twenty-five years later a great deal of that warning was tested.",
    standpoints: [
      { label: "The drafter", sees: "That emergencies happen, and that a state without lawful means will use unlawful ones with no limit at all.", values: "Suspension that is bounded, recorded and reversible.", mayMiss: "That writing the procedure lowers the threshold for using it." },
      { label: "The dissenting member", sees: "Provisions inherited from a colonial statute designed to govern a subject population, now pointed at citizens.", values: "Refusing the instrument regardless of who holds it.", mayMiss: "That the alternative was not the absence of emergency power but its exercise without rules." },
      { label: "The citizen during an emergency", sees: "That the safeguards which mattered were the ones the text allowed to be suspended.", values: "Rights that hold precisely when they are inconvenient to the government.", mayMiss: "That the constitutional route also made the ending of it constitutional." },
      { label: "The reformer afterwards", sees: "Amendments raising the threshold, narrowing the grounds and restoring rights that may not be suspended.", values: "Learning written back into the text.", mayMiss: "That amendments can be amended by the same majorities." }
    ],
    contested: "Whether constitutionalising emergency power constrains it or legitimises it. The Indian experience is cited by both sides, which suggests the answer depends on what else is holding.",
    changeYourMind: "Read the post-1977 amendments against the original provisions. If the changes made a repeat materially harder rather than merely more embarrassing, the constraint argument is doing real work."
  },
  "ambedkar-dissent": {
    opening: "On the last day of the debates, the person most associated with the document spent much of his closing speech warning about what it could not do. That speech is quoted constantly for its phrases and read rarely for its argument.",
    standpoints: [
      { label: "The drafter closing the debate", sees: "A political democracy laid on top of a social order built on graded inequality, and a contradiction that will have to be resolved one way or the other.", values: "Naming the gap while the credit is being handed out.", mayMiss: "Nothing much; the speech states its own limits explicitly." },
      { label: "The celebrant", sees: "The world's longest written constitution, adopted peacefully by a country that had just been through partition.", values: "Recognising an achievement.", mayMiss: "That the achievement is what the warning was about: a good document is not a good society." },
      { label: "The constitutional lawyer", sees: "Specific warnings about hero worship, about the methods of grievance politics, and about placing faith in the text.", values: "Treating it as an argument to be assessed, not a benediction.", mayMiss: "That the warnings were addressed to a moment as well as to the future." },
      { label: "The reader today", sees: "Which of the warnings turned out to be right, and which the country has quietly stopped discussing.", values: "Using a text to check a record.", mayMiss: "That hindsight makes prediction look easier than it was." }
    ],
    contested: "Whether the Constitution is best understood as a completed settlement or as a warning about a task barely begun, and whether treating it as the former is what the speech was cautioning against.",
    changeYourMind: "Read the closing speech in full rather than in quotation. If most of it is about social and economic conditions rather than institutions, the warning reading is the correct one and the celebratory use is a misreading."
  },

  // Science, where it is genuinely open
  "replication-failure": {
    opening: "A result does not reproduce. That sentence is treated as a verdict, but it is closer to the start of an argument. Failure to replicate is consistent with the original being wrong, with the replication being wrong, and with both being right about different conditions.",
    standpoints: [
      { label: "The replicator", sees: "A published claim that will not appear again under the stated method, and a literature built on things nobody rechecked.", values: "Findings that hold when someone else does the work.", mayMiss: "That a method described in a paper is never the whole of what was done in the room." },
      { label: "The original author", sees: "A protocol followed on paper and not in substance, in a different population, with a sample chosen for cost.", values: "Conditions being part of the claim.", mayMiss: "That if the effect only appears in one lab, the effect claimed was broader than the evidence." },
      { label: "The statistician", sees: "Both studies underpowered, and a field treating a threshold as a decision procedure.", values: "Effect sizes and intervals rather than a verdict.", mayMiss: "That practitioners need a decision even when the estimate is uncertain." },
      { label: "The reader of the news report", sees: "One year a finding, the next a debunking, and no way to tell which stage this is.", values: "Knowing how settled something is before acting on it.", mayMiss: "That the visible churn is a field checking itself, which is what it is supposed to do." }
    ],
    contested: "Whether a replication failure should lower confidence in the original claim, in the field's methods, or in the replication itself, and who gets to decide which. The answer differs by discipline and is rarely stated.",
    changeYourMind: "Look at whether the replication was pre-registered and adequately powered, and whether the original authors were consulted on the protocol. Those three facts usually settle which reading is available."
  },
  "dual-use-research": {
    opening: "Some findings make people safer by being known and more dangerous by being known, and it is the same finding. Publication norms were built for a world where the second effect was rare, and are being asked to carry cases where it is not.",
    standpoints: [
      { label: "The researcher", sees: "That withheld findings cannot be checked, that secrecy concentrates knowledge among those with clearance, and that the defensive value usually requires the detail.", values: "Open verification as the thing that makes science reliable at all.", mayMiss: "That the defensive use may take years and the offensive use may take weeks." },
      { label: "The biosecurity official", sees: "A method reproducible by a competent graduate, published irreversibly, against a threat that needs to succeed once.", values: "Not handing over the last hard step.", mayMiss: "That review boards leak, delay, and reliably fail to define the line in advance." },
      { label: "The journal editor", sees: "A decision with no expertise to make it, no mandate, and a competitor who will publish if he does not.", values: "A rule that does not depend on his individual judgement.", mayMiss: "That declining to decide is a decision with the same consequences." },
      { label: "The researcher in a country with no such review", sees: "A norm written by a few institutions that also determines whose work counts as legitimate.", values: "Not being governed by a committee he cannot appeal to.", mayMiss: "That the risk does not respect the same borders as the norm." }
    ],
    contested: "Whether openness is a founding commitment of science that admits no exceptions, or an instrument valued for its results and therefore reviewable when the results turn.",
    changeYourMind: "Find a case where publication was withheld and see whether the defensive work still happened. If it did, the openness argument weakens; if it stalled, it strengthens."
  },
  "gene-editing-line": {
    opening: "Editing a person's cells to treat their disease is broadly accepted. Editing an embryo so the change passes to their descendants is broadly prohibited. Both use the same tool, and the line between them is doing enormous moral work for a distinction that is technical.",
    standpoints: [
      { label: "The clinician treating a fatal inherited disease", sees: "Families who will pass on a condition they have watched kill relatives, and a fix that exists.", values: "Preventing suffering that is entirely foreseeable.", mayMiss: "That prevention at the embryo stage often has alternatives that do not edit anyone." },
      { label: "The disability rights advocate", sees: "A programme that describes people alive now as conditions to be prevented.", values: "That a life with the condition is a life, not an outcome to be designed out.", mayMiss: "That some conditions cause suffering that no amount of accommodation reaches." },
      { label: "The regulator", sees: "A change to people who cannot consent, that spreads through a population, with unknown interactions and no recall.", values: "Reversibility, or failing that, extreme caution.", mayMiss: "That prohibition in regulated countries relocates the work rather than stopping it." },
      { label: "The parent", sees: "A specific child and a specific risk, and an ethical debate conducted about her in the abstract.", values: "The decision resting with those who will live with it.", mayMiss: "That the person most affected is not yet there to be consulted." }
    ],
    contested: "Whether the heritable line marks a real moral difference or a convenient stopping point, and whether treating and enhancing can be distinguished once a condition is defined by what a society will accommodate.",
    changeYourMind: "Ask whether the same reasoning would have prohibited an accepted intervention when it was new. If it would have, the line is doing less principled work than it appears to."
  },
  "machine-understanding": {
    opening: "A system produces answers that look like understanding. Whether anything is understood is either the deepest question in the field or a confusion about words, and which of those it is has itself been argued for seventy years without resolution.",
    standpoints: [
      { label: "The behaviourist about minds", sees: "That understanding was never observable in humans either, and that we grant it on performance.", values: "Applying one standard to people and machines.", mayMiss: "That we grant it to humans partly because we know what we are and assume similarity." },
      { label: "The sceptic", sees: "Statistical continuation of text with no reference to a world, producing fluent answers and confident errors of a kind understanding would not make.", values: "Not mistaking the appearance for the thing.", mayMiss: "That the errors may be evidence about this system rather than about the possibility." },
      { label: "The engineer", sees: "A question that changes no decision he has to make about testing, deployment or failure modes.", values: "Working on what can be measured.", mayMiss: "That the question determines what obligations, if any, are owed." },
      { label: "The person on the other end of the system", sees: "Something that answered her question, and a debate about whether it meant it.", values: "Knowing whether to trust it.", mayMiss: "That trust and understanding are separable; a calculator is trustworthy and understands nothing." }
    ],
    contested: "Whether there is a fact about understanding that observation could settle, or whether the disagreement is about which concept to extend and to what, in which case no experiment resolves it.",
    changeYourMind: "State in advance what result would change your view. If you cannot, the disagreement is about words rather than about the world, and that is worth knowing."
  },
  "research-animal": {
    opening: "Almost every medicine in use passed through animals first. The practice is regulated, reduced where possible, and defended on the grounds that the alternative is worse. Whether that defence works depends on a comparison nobody can run.",
    standpoints: [
      { label: "The researcher", sees: "Regulation, review, and a genuine reduction in numbers, against diseases that kill people now.", values: "Weighing a real harm against a real benefit rather than against an imagined method.", mayMiss: "That the benefit is probabilistic and distant while the harm is certain and immediate." },
      { label: "The abolitionist", sees: "A creature that can suffer, used for someone else's benefit, with its consent structurally impossible.", values: "That capacity to suffer is what grounds the claim, and it does not vary by species.", mayMiss: "That ending the practice now would stop lines of research with no replacement ready." },
      { label: "The methodologist", sees: "Poor translation rates from animal models to human outcomes in several fields, and studies run because they are expected rather than because they inform.", values: "Asking whether the harm buys the knowledge claimed.", mayMiss: "That translation failures are also how a model gets refined." },
      { label: "The patient waiting", sees: "A debate about method conducted while her condition progresses.", values: "Something that works, arriving in time.", mayMiss: "That the same urgency has justified a great deal of research that helped nobody." }
    ],
    contested: "Whether the justification is consequentialist, in which case poor translation rates undermine it directly, or whether it rests on a difference in moral status that makes the calculation unnecessary.",
    changeYourMind: "Look at translation rates in the specific field in question rather than in general. If the model predicts human outcomes well, the consequentialist defence holds there even where it fails elsewhere."
  },
  "trial-equipoise": {
    opening: "A trial is only ethical while genuine uncertainty remains about which arm is better. The moment the evidence tips, continuing means knowingly giving some participants the worse option. Deciding when that moment arrived is the hardest judgement in clinical research.",
    standpoints: [
      { label: "The trial statistician", sees: "Interim results that will look decisive and then reverse, and a stopping rule set in advance precisely to resist that pull.", values: "A result strong enough to change practice.", mayMiss: "That the people in the control arm are not a statistical population." },
      { label: "The participant", sees: "That she consented to uncertainty, not to continuing after it resolved.", values: "Being told what the researchers now believe.", mayMiss: "That an early impression is often wrong and acting on it has killed people before." },
      { label: "The clinician enrolling patients", sees: "A duty to this patient that does not obviously bend to future patients she will never meet.", values: "The person in front of her.", mayMiss: "That every established treatment exists because earlier patients were enrolled under the same tension." },
      { label: "The regulator", sees: "Trials stopped early that overstate effects, and a literature skewed by them.", values: "Evidence that will not have to be redone.", mayMiss: "That the cost of the extra certainty is paid by identifiable people." }
    ],
    contested: "Whether equipoise is about the individual clinician's uncertainty or the professional community's, and whether a participant is owed the researchers' current belief or only the protocol she agreed to.",
    changeYourMind: "Compare effect sizes in trials stopped early for benefit against those that ran to completion. A consistent gap tells you the early stops were reading noise."
  },
  "deference-to-consensus": {
    opening: "A non-expert cannot evaluate the evidence directly, so deferring to consensus is usually the rational move. It is also how every historical error was sustained. Both halves are true, which is why the question is about conditions rather than about a rule.",
    standpoints: [
      { label: "The advocate of deference", sees: "That the alternative is not independent judgement but susceptibility to whoever argues most confidently.", values: "Recognising the limits of one's own competence.", mayMiss: "That consensus can be an artefact of funding, training and who was allowed to publish." },
      { label: "The dissenting specialist", sees: "That real revisions come from inside, and that a field's confidence is not evidence about the world.", values: "Keeping the disagreement open where it is genuine.", mayMiss: "That the same posture is used to manufacture doubt about things that are not in doubt." },
      { label: "The science communicator", sees: "That explaining uncertainty honestly is read as weakness and exploited.", values: "Being trusted enough to be useful.", mayMiss: "That overstating certainty is what destroys the trust when the estimate later moves." },
      { label: "The policymaker", sees: "That he must act before the science settles, and that waiting is also a choice with consequences.", values: "Decisions robust to being wrong.", mayMiss: "That framing a decision as scientific hides the values in it." }
    ],
    contested: "Whether the public is being asked to defer to findings, which is reasonable, or to the policy conclusions drawn from them, which are value judgements that expertise does not settle.",
    changeYourMind: "Separate the empirical claim from the policy recommendation in a specific case. If the disagreement survives that separation, it was never about the science."
  },
  "intelligence-measure": {
    opening: "Tests of intelligence predict outcomes reliably enough to be used in selection, and what they are measuring is unresolved. Predictive power and construct validity are different things, and the argument has run for a century without the two being reconciled.",
    standpoints: [
      { label: "The psychometrician", sees: "Scores that correlate across domains and predict performance, stably, across many populations.", values: "A measure that does what a measure is for.", mayMiss: "That predicting an outcome shaped by the same schooling is a weaker result than it appears." },
      { label: "The critic of the construct", sees: "A test built by a group, validated against outcomes that group defines as success, then treated as measuring a property of the person.", values: "Asking what the instrument was calibrated on.", mayMiss: "That the correlations persist across very different systems, which a purely cultural account struggles with." },
      { label: "The teacher", sees: "Children whose scores move with nutrition, sleep, language of instruction and whether anyone read to them.", values: "The conditions rather than the ranking.", mayMiss: "That variation with conditions does not show the measure is empty." },
      { label: "The person tested", sees: "A number that will follow her into decisions made about her by people who never meet her.", values: "Not being reduced to it.", mayMiss: "That the alternative selection methods have their own, less visible biases." }
    ],
    contested: "Whether a test that predicts well but cannot say what it measures is a useful instrument or a circular one, and whether its use in selection makes its predictions partly self-fulfilling.",
    changeYourMind: "Look at what happens to the predictive power when the outcome measured is chosen by someone outside the tradition that built the test. If it holds, the construct is doing more than the critics allow."
  },

  // Philosophy, unresolved
  "free-will-and-blame": {
    opening: "Everything about a choice appears to have causes reaching back before the chooser existed. We nonetheless hold people responsible, and every legal system depends on doing so. Whether that practice survives the causal picture is the oldest live question in philosophy.",
    standpoints: [
      { label: "The compatibilist", sees: "That freedom was never the absence of causes but the absence of coercion, and that acting on your own reasons is all it ever meant.", values: "Keeping responsibility without needing a gap in nature.", mayMiss: "That it redefines the term rather than answering the worry that motivated it." },
      { label: "The hard determinist", sees: "That nobody chose their genes, upbringing or the reasons that appeal to them, and that blame is therefore never fully deserved.", values: "Following the argument where it goes.", mayMiss: "That a practice can be justified by what it does rather than by desert." },
      { label: "The judge", sees: "That the system needs a workable line, and that it already draws one at capacity and coercion rather than at metaphysics.", values: "A rule that can be applied consistently.", mayMiss: "That the line is doing moral work the law does not examine." },
      { label: "The person who was wronged", sees: "That an account explaining why it happened does not dissolve what happened to her.", values: "The wrong being acknowledged as a wrong.", mayMiss: "That acknowledgement and punishment are separable, and only one of them requires desert." }
    ],
    contested: "Whether blame is justified because it is deserved or because it works, and whether a society that adopted the second answer wholesale could still be said to be holding anyone responsible.",
    changeYourMind: "Ask what you would want done if the person who harmed you were shown to have had a brain tumour. If your answer changes, desert is doing real work in your view. If it does not, it is not."
  },
  "explaining-experience": {
    opening: "A complete physical account of a brain seeing red would describe wavelengths, receptors, and every downstream state. Whether it would have explained what seeing red is like is the question, and it has resisted every attempt to dissolve it.",
    standpoints: [
      { label: "The physicalist", sees: "A pattern in the history of science, where phenomena resisted explanation until they did, and no reason to expect this one to be different.", values: "Not multiplying kinds of things on the strength of an intuition.", mayMiss: "That the intuition here is unusually stable and survives being explained away." },
      { label: "The one who presses the gap", sees: "That you could know every physical fact and still learn something on first seeing colour.", values: "Taking the first-person case seriously as data.", mayMiss: "That knowing-what-it-is-like may be a different kind of knowing rather than knowing a further fact." },
      { label: "The neuroscientist", sees: "Steady progress in mapping which processes correlate with which reports, and a question that never becomes tractable.", values: "Work that produces findings.", mayMiss: "That correlation with reports is what the question was asking about." },
      { label: "The clinician", sees: "Patients whose experience must be inferred from behaviour, where being wrong has consequences.", values: "A workable standard for attributing experience.", mayMiss: "That a workable standard is not the same as an account of what is being attributed." }
    ],
    contested: "Whether the explanatory gap reveals something about the world or something about the limits of the concepts we are using to describe it from the outside.",
    changeYourMind: "Consider whether an analogous gap once existed for life itself, and whether its dissolution felt like an answer or like a change of subject. Honest answers here differ."
  },
  "moral-discovery": {
    opening: "When two societies disagree about whether something is wrong, one of them may be mistaken, or the question may have no answer independent of the asking. Almost everyone talks as though the first is true and struggles to say what would make it so.",
    standpoints: [
      { label: "The realist", sees: "That moral progress is a coherent idea, that we say earlier societies were wrong about slavery and mean it, and that this requires something to be wrong about.", values: "Taking moral claims at face value.", mayMiss: "That it must then explain what moral facts are and how anyone detects them." },
      { label: "The constructivist", sees: "Standards built by agreement among people who have to live together, which is enough to make claims binding without making them cosmic.", values: "An account with nothing spooky in it.", mayMiss: "That it struggles to condemn a society whose agreement is internally consistent and monstrous." },
      { label: "The anthropologist", sees: "Enormous variation in practice sitting on top of surprising convergence in the underlying concerns.", values: "Describing what is actually there before theorising it.", mayMiss: "That convergence is compatible with both accounts and settles neither." },
      { label: "The person facing the decision", sees: "That she must act, and that the metaethics does not tell her what to do.", values: "Getting it right in this case.", mayMiss: "That what getting it right means is exactly what is in dispute." }
    ],
    contested: "Whether the phrase moral progress can be defended by anyone who denies moral facts, and whether the realist can say what those facts are without simply naming the ones already believed.",
    changeYourMind: "Find a moral claim you hold that you did not inherit and cannot trace to your interests. If none survives the search, the constructivist has the better of it."
  },
  "same-person": {
    opening: "The cells, the memories, the beliefs and much of the personality change. We nonetheless hold people to promises made decades earlier and punish them for acts they no longer remember. What survives to be held responsible is not obvious.",
    standpoints: [
      { label: "The psychological continuity view", sees: "Overlapping chains of memory and intention linking today's person to yesterday's.", values: "Locating identity in what the person is like rather than in the matter.", mayMiss: "That the chain can fork, and that two branches cannot both be the original." },
      { label: "The bodily view", sees: "One organism, continuous, however much its contents change.", values: "A criterion that never produces two answers.", mayMiss: "That it makes severe amnesia irrelevant to identity, which few people accept in practice." },
      { label: "The narrative view", sees: "A person as an account she tells and revises, and identity as the coherence of that account.", values: "Matching how people actually experience being themselves.", mayMiss: "That someone with no such narrative is not thereby nobody." },
      { label: "The person with the earlier debt", sees: "That the question is not academic when the obligation is enforced.", values: "A settled rule.", mayMiss: "That the rule chosen determines who is being asked to pay." }
    ],
    contested: "Whether identity is what matters, or whether the practical questions about responsibility and obligation can be answered without settling it.",
    changeYourMind: "Ask whether you would keep a promise made by a version of yourself you now find alien. Where you draw that line tells you which criterion you actually hold."
  },
  "moral-status": {
    opening: "We treat some things as having claims on us and others as available for use. The line has moved repeatedly and every movement was resisted. Whatever grounds it, it is not species membership alone, because almost nobody defends that when pressed.",
    standpoints: [
      { label: "The sentientist", sees: "Capacity to suffer as the relevant fact, and every other criterion as arbitrary once stated plainly.", values: "One principle applied without exception.", mayMiss: "That it gives no account of why a person matters more than an equally sentient animal, if that is what one believes." },
      { label: "The relational view", sees: "Status arising from relationships and dependence rather than from an intrinsic property.", values: "Matching how obligations are actually felt and discharged.", mayMiss: "That it leaves strangers, and the distant, with weak claims." },
      { label: "The one who defends a species line", sees: "That moral life runs on categories that can be applied without a philosophy seminar.", values: "Rules that function.", mayMiss: "That the same argument was used for every earlier exclusion." },
      { label: "The person at the edge of the category", sees: "Criteria being proposed that would exclude her or someone she cares for.", values: "Not having status made conditional on a capacity.", mayMiss: "That an unconditional criterion has to be grounded in something, or it will not hold." }
    ],
    contested: "Whether moral status is an intrinsic property that we detect or a status we confer, and whether anything follows differently in practice depending on which is true.",
    changeYourMind: "State your criterion, then check who it excludes. If it excludes someone you are unwilling to exclude, the criterion is not the one you are using."
  },
  "owing-the-unborn": {
    opening: "Decisions about climate, debt and infrastructure are justified by reference to future generations. Those people do not exist, have no preferences, and their very identities depend on what we decide. Whether they can be wronged is genuinely unclear.",
    standpoints: [
      { label: "The long-termist", sees: "Vastly more people in the future than the present, and no reason their interests should count less for being later.", values: "Consistency across time.", mayMiss: "That obligations to people who exist now are being weighed against a number that can be made arbitrarily large." },
      { label: "The one pressing the non-identity problem", sees: "That different policies produce different people, so nobody who exists in the worse future is worse off than they would have been.", values: "Following the logic rather than the sentiment.", mayMiss: "That most people's judgement that the worse future is worse survives the argument intact." },
      { label: "The present poor", sees: "Sacrifices being asked of those with least, on behalf of people who will almost certainly be richer.", values: "Not discounting the certain for the speculative.", mayMiss: "That some harms compound past the point of repair." },
      { label: "The parent", sees: "That the obligation is not abstract and does not need a theory.", values: "Acting on it.", mayMiss: "That the intuition covers descendants and thins out fast beyond them." }
    ],
    contested: "Whether obligations to future people are owed to specific individuals, which the non-identity problem makes difficult, or to states of the world, which requires a different kind of moral theory entirely.",
    changeYourMind: "Ask whether you think a policy leaving a devastated planet is wrong even though the people living on it would not otherwise have existed. If you do, impersonal value is doing the work."
  },
  "honest-lie": {
    opening: "Almost every moral tradition condemns lying and almost every person tells lies they would defend. The interesting cases are not the self-serving ones but the ones where telling the truth would be the act of aggression.",
    standpoints: [
      { label: "The absolutist", sees: "That once exceptions are permitted, the exception is claimed by everyone who wants it, and that trust cannot be built on a rule with a discretionary override.", values: "A commitment that holds when it costs.", mayMiss: "That the rule's most famous defence produced conclusions almost nobody accepts." },
      { label: "The consequentialist", sees: "Speech as an act with effects, to be judged like any other.", values: "Not privileging one act type over its results.", mayMiss: "That the value of an assertion depends on a general practice the calculation quietly relies on." },
      { label: "The person lied to", sees: "That being deceived for her own good treats her as someone to be managed.", values: "Deciding for herself with accurate information.", mayMiss: "That some information arrives when she has no capacity to use it and every capacity to be harmed by it." },
      { label: "The doctor", sees: "That the question is rarely whether to lie and usually how much to say, in what order, at whose pace.", values: "Truth as a process rather than a disclosure.", mayMiss: "That pacing can slide into deciding what she never needs to know." }
    ],
    contested: "Whether there is a duty to volunteer truth or only a duty not to assert falsehood, since almost all real cases live in the gap between those two.",
    changeYourMind: "Ask whether the person you would deceive would endorse the deception afterwards. Their answer is not decisive, but a confident prediction that they would not is close to one."
  },
  "luck-and-desert": {
    opening: "Where you were born, to whom, with what health and what aptitudes, you did not choose. What remains after subtracting all of it is what you can be said to have earned, and it is much smaller than most systems of reward assume.",
    standpoints: [
      { label: "The luck egalitarian", sees: "That inequality traceable to circumstance is unjust, and almost all of it is.", values: "Distinguishing choice from circumstance rigorously.", mayMiss: "That the distinction requires judging which of someone's choices were really theirs, which is intrusive and often impossible." },
      { label: "The defender of desert", sees: "That effort is real, felt from the inside, and that a system denying it destroys the reason to make any.", values: "Agency taken seriously.", mayMiss: "That the capacity for sustained effort is itself substantially unchosen." },
      { label: "The institutional designer", sees: "That whatever the truth about desert, incentives change behaviour and a system has to function.", values: "Outcomes over metaphysics.", mayMiss: "That justifying rewards by their incentive effect concedes they are not deserved." },
      { label: "The person who worked and has little", sees: "That the account explaining her position does not change it, and that being told her effort was luck is its own insult.", values: "Recognition of what she actually did.", mayMiss: "That the argument is directed at those who claim their advantages were earned." }
    ],
    contested: "Whether desert can survive the observation that the capacity to deserve is itself unearned, and whether a society could organise reward on any other basis without losing something it needs.",
    changeYourMind: "Try to specify one achievement of your own that owes nothing to circumstance. The difficulty of the exercise is the argument."
  },

  // Environment and its trade-offs
  "conservation-and-livelihood": {
    opening: "A forest is protected and the people who lived from it are compensated, relocated, or told to stop. The species recover or they do not. Both outcomes are reported nationally; the second half of the arrangement is usually reported locally if at all.",
    standpoints: [
      { label: "The conservation biologist", sees: "Populations that will not recover with continued extraction, and a window that closes.", values: "Irreversibility as the deciding fact.", mayMiss: "That protection enforced without consent tends to be protection enforced badly." },
      { label: "The forest-dwelling household", sees: "Rights recognised in law, a livelihood built over generations, and an eviction described as voluntary.", values: "Not being the cheapest available input into someone else's conservation.", mayMiss: "That some extraction genuinely does not scale to the population now depending on it." },
      { label: "The forest official", sees: "A mandate, a budget, and a boundary he is judged on.", values: "Enforceable lines.", mayMiss: "That the people he excludes were often the reason there was a forest to protect." },
      { label: "The urban supporter", sees: "A species he will never encounter and wants to continue existing.", values: "Something preserved beyond its use.", mayMiss: "That he is not being asked to pay any part of the cost." }
    ],
    contested: "Whether conservation works better with people inside protected areas or outside them. The evidence is genuinely mixed and varies by ecosystem, which is why both sides can cite studies indefinitely.",
    changeYourMind: "Compare outcomes in areas with recognised community forest rights against strictly protected areas in comparable terrain. Where community-managed areas hold up, exclusion is a choice rather than a necessity."
  },
  "nuclear-question": {
    opening: "Nuclear power produces very little carbon and concentrates its risk into rare, severe, long-lived events. Almost every argument about it is really an argument about how to compare a large number of small harms with a small number of enormous ones.",
    standpoints: [
      { label: "The climate engineer", sees: "Deaths per unit of energy far below coal even counting the accidents, and a grid that needs something firm.", values: "Counting the harm that is happening now rather than the one that is vivid.", mayMiss: "That public consent is a real constraint, not an irrationality to be corrected." },
      { label: "The person living near the site", sees: "A risk she did not choose, concentrated where she lives, benefiting a grid that is mostly elsewhere.", values: "Consent from those who carry it.", mayMiss: "That the alternative sited somewhere else also lands on someone." },
      { label: "The finance analyst", sees: "Cost overruns, decade-long build times, and renewables falling in price faster than nuclear can be commissioned.", values: "What can actually be delivered in the time available.", mayMiss: "That storage at the scale required is not yet demonstrated either." },
      { label: "The waste regulator", sees: "Material requiring custody longer than any institution has existed.", values: "Honesty about a commitment across geological time.", mayMiss: "That carbon released now also commits the future, with no custody arrangement at all." }
    ],
    contested: "Whether risk should be assessed by expected harm, which favours nuclear strongly, or by the character of the harm, since a catastrophic tail is not the same as its arithmetic equivalent spread thin.",
    changeYourMind: "Look at build times and final costs for plants commissioned in the last twenty years rather than at the technology in principle. Delivery record is the argument that moves fastest."
  },
  "growth-and-emissions": {
    opening: "A country with widespread energy poverty is asked to decarbonise on a timetable set by the emissions of countries that industrialised without constraint. Whether that is unfair, or simply the situation, is disputed on grounds that are not only about fairness.",
    standpoints: [
      { label: "The development economist", sees: "Energy as the input to everything that lifts people out of poverty, and per capita emissions still a fraction of the rich world's.", values: "Not asking the poor to pay for a problem they did not make.", mayMiss: "That the physics does not adjust for fairness." },
      { label: "The climate scientist", sees: "A carbon budget that is nearly spent regardless of who spent it.", values: "The constraint as it is.", mayMiss: "That a plan ignoring legitimacy will not be adopted by the countries it needs." },
      { label: "The industrial minister", sees: "That leapfrogging requires capital and technology that were promised and largely not delivered.", values: "Commitments honoured before new ones are demanded.", mayMiss: "That waiting for delivery locks in infrastructure lasting forty years." },
      { label: "The household without reliable power", sees: "Load shedding, and a debate about her country's trajectory conducted in terms she is never offered.", values: "Electricity that works.", mayMiss: "That she is also among the most exposed to the heat and the floods." }
    ],
    contested: "Whether historical responsibility generates an enforceable claim or only a moral one, and whether a development path can be both fast enough to matter and clean enough to count.",
    changeYourMind: "Track the finance actually transferred against what was pledged. If the gap is large, the fairness objection is a description of the record rather than a rhetorical position."
  },
  "historical-emissions": {
    opening: "Most of the carbon in the atmosphere was released by a small number of countries over two centuries, mostly before the consequences were understood. Whether that generates a debt, and to whom, is the question that has stalled every negotiation.",
    standpoints: [
      { label: "The claimant country", sees: "Damage occurring now, caused by emissions elsewhere, with the beneficiaries identifiable.", values: "Cause and consequence connected.", mayMiss: "That the people who emitted are largely dead and the ones being asked to pay did not choose it." },
      { label: "The country asked to pay", sees: "Liability for acts that were lawful and whose effects were unknown at the time.", values: "Not being held to a standard that did not exist.", mayMiss: "That the benefits of those acts were inherited along with everything else." },
      { label: "The economist", sees: "A transfer that could be justified on forward-looking grounds without settling blame at all.", values: "An agreement that can actually be reached.", mayMiss: "That parties who feel wronged do not accept being told the wrong is irrelevant." },
      { label: "The person losing land to the sea", sees: "A negotiation about attribution while the ground goes.", values: "Money arriving.", mayMiss: "That the framing chosen determines whether it arrives as aid or as owed." }
    ],
    contested: "Whether responsibility follows emissions, wealth accumulated from them, or present capacity to pay. Each produces a different bill and each has a serious argument behind it.",
    changeYourMind: "Ask whether you would accept the same principle applied to a domestic case of inherited advantage. Consistency between the two is rare and revealing."
  },
  "river-linking": {
    opening: "Moving water from a basin defined as surplus to one defined as deficit sounds like arithmetic. Surplus and deficit are the whole argument: they are defined against an assumed use, in an assumed year, before the climate that produced the assumption changed.",
    standpoints: [
      { label: "The water engineer", sees: "Predictable flooding in one basin and predictable scarcity in another, and a transfer that has been proposed for over a century.", values: "Using water that currently reaches the sea.", mayMiss: "That water reaching the sea is doing work in the estuary and the delta." },
      { label: "The downstream farmer in the donor basin", sees: "A surplus declared upstream, on data he cannot check, about a river he depends on.", values: "Whose calculation counts.", mayMiss: "That his own extraction is also part of what has made the system tight." },
      { label: "The ecologist", sees: "Species, sediment and salinity regimes that the transfer treats as absent.", values: "A river as a system rather than a channel.", mayMiss: "That the alternative is not the river as it was but the river under continued extraction." },
      { label: "The receiving state's minister", sees: "Constituents without irrigation, and a project promised across governments.", values: "Water arriving in his constituency within a political lifetime.", mayMiss: "That demand tends to expand to meet supply, returning the deficit in a decade." }
    ],
    contested: "Whether a river basin is a resource to be balanced across a country or a system whose integrity is itself the thing being valued, and who is entitled to define a surplus.",
    changeYourMind: "Examine how surplus was calculated and in which years. If the baseline predates the last two decades of rainfall variability, the arithmetic is not describing the present river."
  },
  "stubble-burning": {
    opening: "Every year the same fields burn, the same cities choke, the same measures are announced. Treating it as a failure of enforcement or of farmer responsibility has not worked for a decade, which suggests the description is wrong.",
    standpoints: [
      { label: "The farmer", sees: "About three weeks between harvest and sowing, machinery he cannot afford, and a cost he is asked to absorb for air he does not breathe.", values: "A window that closes whatever anyone announces.", mayMiss: "That the practice became widespread only after mechanised harvesting changed what was left in the field." },
      { label: "The city resident", sees: "Air that measurably shortens lives, from a cause identified and legal to prohibit.", values: "Not paying with her lungs for someone else's schedule.", mayMiss: "That crop burning is one contributor among several she is less willing to discuss." },
      { label: "The agricultural policymaker", sees: "Groundwater rules that shifted the sowing date, a procurement system rewarding this crop rotation, and a burning window that policy created.", values: "Treating it as the downstream effect it is.", mayMiss: "That unwinding the incentives touches food security and farm incomes at once." },
      { label: "The machinery supplier", sees: "Equipment subsidised, distributed and underused, because it costs to run and saves nobody money.", values: "Whether the subsidy addressed the actual constraint.", mayMiss: "That the equipment does work where the operating cost is covered." }
    ],
    contested: "Whether this is a compliance problem, a technology problem, or the predictable output of a water and procurement policy that nobody wants to reopen.",
    changeYourMind: "Look at when the burning window became compressed and what changed in groundwater regulation just before. If the timing lines up, enforcement was never going to be the answer."
  },
  "carbon-offset": {
    opening: "An offset claims that an emission somewhere was cancelled by a reduction elsewhere. The claim depends on additionality, permanence and accurate baselines, each of which is a counterfactual, and counterfactuals cannot be measured.",
    standpoints: [
      { label: "The market designer", sees: "A mechanism directing money to cheap abatement wherever it is, which is where it does most good per rupee.", values: "Efficiency in a problem defined by total quantity.", mayMiss: "That the price signal only works if the underlying reductions are real." },
      { label: "The auditor of projects", sees: "Baselines chosen by the seller, forests counted as saved that were never threatened, and permanence claimed for a plantation that burns.", values: "Verification that does not rely on the interested party.", mayMiss: "That some projects do check out, and blanket dismissal removes their funding too." },
      { label: "The community on the project land", sees: "Access restricted so that a distant emitter can continue, with the benefit sharing negotiated on their behalf.", values: "Being a party to the transaction.", mayMiss: "That the payment is real income where alternatives are few." },
      { label: "The company buying", sees: "Emissions it cannot yet eliminate and a way to act now rather than in a decade.", values: "Doing something rather than waiting.", mayMiss: "That the something may license continuing the thing it was meant to reduce." }
    ],
    contested: "Whether offsets are a transitional tool that has been implemented badly, or an instrument whose central claim is unverifiable in principle and therefore always exploitable.",
    changeYourMind: "Look at what fraction of credits from a given registry survive independent re-analysis. If most do not, the problem is structural rather than a matter of bad actors."
  },
  "wildlife-and-neighbour": {
    opening: "Conservation succeeds and populations recover. Where they recover, they meet people. Crops are destroyed, livestock taken, and sometimes people are killed. The success and the conflict are the same fact seen from two distances.",
    standpoints: [
      { label: "The farmer beside the boundary", sees: "A season's crop taken overnight, compensation that arrives late or not at all, and a legal protection that does not extend to him.", values: "Bearing a national commitment at household scale.", mayMiss: "That retaliatory killing removes the animal and not the conflict." },
      { label: "The conservationist", sees: "A recovering population in a landscape that has been fragmented around it.", values: "Not losing what was nearly lost.", mayMiss: "That tolerance is the actual limiting resource and it is being spent." },
      { label: "The compensation officer", sees: "Claims he cannot verify, a budget that runs out, and rules requiring evidence that a lost animal does not leave.", values: "A scheme that survives audit.", mayMiss: "That an unpaid claim teaches people not to report." },
      { label: "The person who lost a family member", sees: "A death, and an official account balancing it against a population figure.", values: "The loss named as a loss.", mayMiss: "Nothing. This is the standpoint the policy is least equipped to answer." }
    ],
    contested: "Whether coexistence is a realistic goal in landscapes at Indian population densities, or whether separation is the honest policy and the argument is about who moves.",
    changeYourMind: "Compare compensation paid against assessed loss, and how fast. Where payment is prompt and adequate, tolerance holds; where it is not, no amount of awareness work substitutes."
  },

  // Economics, argued
  "growth-or-distribution": {
    opening: "One account says you cannot distribute what has not been produced. The other says growth without distribution concentrates and stalls. Both are supported by real cases, which suggests the sequence matters less than what kind of growth it is.",
    standpoints: [
      { label: "The growth-first economist", sees: "That no country has redistributed its way out of poverty, and that the pie's size is the binding constraint.", values: "Aggregate expansion.", mayMiss: "That growth concentrated in capital-intensive sectors employs few and raises little at the bottom." },
      { label: "The distribution-first economist", sees: "That health, schooling and land reform raised living standards where growth alone did not, and that they also produce the workforce growth needs.", values: "Capability as both end and input.", mayMiss: "That sustaining them requires revenue that has to come from somewhere." },
      { label: "The finance ministry official", sees: "A fiscal position that will not carry both at once, and a political cycle shorter than either takes to work.", values: "What can be funded.", mayMiss: "That deferring the second indefinitely is a decision presented as a sequence." },
      { label: "The worker in a growing economy", sees: "Output rising, wages not, and a share of value added that has been falling for years.", values: "The gain reaching her.", mayMiss: "That the sectors paying most are the ones her state is competing to attract." }
    ],
    contested: "Whether the trade-off is real at all, or whether the cases usually cited differ in the composition of growth rather than in the sequencing of policy.",
    changeYourMind: "Compare states within one country, holding national policy constant. Where similar growth rates produce very different poverty outcomes, composition rather than sequence is doing the work."
  },
  "formalising-work": {
    opening: "Most Indian workers are informal: no contract, no benefits, no record. Formalisation is a near-universal policy goal. What formalisation actually delivers to the worker, as opposed to the state, is less examined than how much of it has been achieved.",
    standpoints: [
      { label: "The labour ministry", sees: "Workers outside every protection, unable to prove employment or claim a pension.", values: "Bringing people inside the system.", mayMiss: "That registration and protection are different things, and only one of them is being counted." },
      { label: "The informal worker", sees: "Flexibility she depends on, an employer who will shed her if costs rise, and compliance she cannot navigate.", values: "Income continuing next month.", mayMiss: "That the same flexibility is what leaves her with nothing when she cannot work." },
      { label: "The small employer", sees: "Thresholds that make the tenth employee far more expensive than the ninth.", values: "Staying under the line.", mayMiss: "That the threshold structure is a policy choice, not a fact about employment." },
      { label: "The economist", sees: "Formal-sector employment barely moving for decades while output moved a great deal.", values: "Asking whether the target is reachable by the means chosen.", mayMiss: "That measured informality has fallen where social protection was decoupled from the employer." }
    ],
    contested: "Whether informality is a transitional stage that development ends, or a stable equilibrium that policy has to build protection around rather than through.",
    changeYourMind: "Look at whether formalisation drives changed anyone's access to benefits, or only their presence on a register. If the second, the policy was measuring itself."
  },
  "subsidy-question": {
    opening: "A subsidy names a beneficiary. Whether the benefit reaches them depends on how it is delivered, who administers it, and whether the price effect is captured before it arrives. Most arguments about subsidies are actually arguments about that chain.",
    standpoints: [
      { label: "The targeting advocate", sees: "Universal schemes spending most of their money on people who do not need it.", values: "Money reaching the poorest.", mayMiss: "That targeting costs money, excludes by error, and creates a constituency for cutting the scheme." },
      { label: "The universalist", sees: "Exclusion errors that fall on exactly the people least able to appeal them, and universal schemes that survive politically because everyone has a stake.", values: "Nobody wrongly left out.", mayMiss: "That fiscal space is finite and universal coverage lowers per-head generosity." },
      { label: "The intended beneficiary", sees: "Documentation requirements, a portal that fails, and an entitlement she is told she has.", values: "Receiving the thing.", mayMiss: "That the verification she resents also removed a layer of diversion." },
      { label: "The producer receiving the price support", sees: "A subsidy described as reaching consumers that has become a floor under his own planning.", values: "Predictability.", mayMiss: "That the support is shaping what gets grown, and increasingly what water gets used." }
    ],
    contested: "Whether the leakage that dominates subsidy debate is a delivery problem to be engineered away, or the predictable result of any transfer administered by people with discretion.",
    changeYourMind: "Compare exclusion error against inclusion error in a given scheme. Most debate assumes inclusion error is the larger; where it is not, the targeting case collapses."
  },
  "minimum-wage-effect": {
    opening: "The textbook says a price floor above the market rate reduces quantity demanded. A large body of empirical work finds employment effects near zero across a wide range. Both cannot be straightforwardly right, and the reconciliation is the interesting part.",
    standpoints: [
      { label: "The standard-model economist", sees: "A constraint on price with predictable consequences, and studies whose null results reflect small increases and short horizons.", values: "Theory that generalises.", mayMiss: "That the model assumes a competitive labour market that often is not there." },
      { label: "The empirical labour economist", sees: "Employers with wage-setting power, where a floor can raise pay without cutting jobs, and evidence across many settings.", values: "What the data show.", mayMiss: "That evidence from moderate increases says little about large ones." },
      { label: "The worker at the floor", sees: "A statutory rate widely ignored, and enforcement that depends on complaining about the employer she needs.", values: "The wage actually paid.", mayMiss: "That a rate set well above local conditions makes non-compliance the norm and enforcement hopeless." },
      { label: "The small employer", sees: "Margins that cannot absorb it and competitors who will not comply.", values: "A level field.", mayMiss: "That his position depends on the same non-compliance he objects to." }
    ],
    contested: "Whether the near-zero employment effects found for moderate increases extend to the larger increases now proposed, and whether in an economy this informal the statutory rate is the operative variable at all.",
    changeYourMind: "Look at compliance rates rather than employment effects. Where most covered workers are paid below the floor, the debate about disemployment is about a policy that is not in force."
  },
  "land-acquisition": {
    opening: "Compulsory acquisition assumes land has a market price and that paying it, plus a premium, makes the owner whole. For a household whose land is also its occupation, collateral, address and social position, that assumption is doing a great deal of work.",
    standpoints: [
      { label: "The project authority", sees: "Infrastructure with wide public benefit, blocked by a small number of holdouts who can capture the entire surplus.", values: "The many over the few.", mayMiss: "That the many are diffuse and the few lose everything at once." },
      { label: "The landholder", sees: "A price set by recorded transactions that are systematically understated, for an asset she cannot replace nearby.", values: "Replacement rather than compensation.", mayMiss: "That holding out is also a strategy, and everyone doing it stops the project." },
      { label: "The landless labourer on that land", sees: "A compensation framework keyed to title, and no title.", values: "Loss of livelihood counting as loss.", mayMiss: "That including him makes the entitlement list contestable and slow." },
      { label: "The economist", sees: "That consent thresholds and social impact assessment raise cost and time, and that this is the point rather than a defect.", values: "Prices that include what was previously externalised.", mayMiss: "That projects abandoned on cost also had beneficiaries." }
    ],
    contested: "Whether fair compensation is calculable at all where the asset is not fungible for its owner, and whether consent requirements protect the vulnerable or empower the best organised.",
    changeYourMind: "Follow compensated households for five years. If most are worse off despite payment at or above market rate, the monetary framing is the problem rather than the amount."
  },
  "cash-or-kind": {
    opening: "The state can hand over money or hand over the thing. Cash respects the recipient's judgement and is cheaper to administer. In-kind transfers survive inflation, cannot be captured by whoever controls the household's money, and build a supply chain. The choice is not obvious.",
    standpoints: [
      { label: "The cash advocate", sees: "That poor people are the best judges of their own needs, and that procurement and storage waste much of an in-kind transfer.", values: "Autonomy plus efficiency.", mayMiss: "That cash requires functioning markets nearby, which is exactly what is missing in the poorest places." },
      { label: "The in-kind advocate", sees: "Food arriving whatever the price does, and a ration that a woman can access without negotiating for the money.", values: "Reaching the person inside the household.", mayMiss: "That the same system delivers what the state procured rather than what the household eats." },
      { label: "The recipient", sees: "A queue, a fixed basket, and a shop that is closed or short.", values: "Reliability first, choice second.", mayMiss: "That her preference between the two depends heavily on whether her local market functions." },
      { label: "The finance ministry", sees: "That cash is far cheaper to run and easier to cut.", values: "Fiscal control.", mayMiss: "That ease of cutting is a feature to the ministry and a risk to the recipient." }
    ],
    contested: "Whether transfers should maximise recipient autonomy or reliability of a specific outcome, and whether the answer changes with how well local markets and intra-household bargaining work.",
    changeYourMind: "Look at what happens to the real value of cash transfers during a local price shock. If they are not indexed and prices move, the in-kind case is stronger than the efficiency comparison suggests."
  },
  "trade-and-jobs": {
    opening: "Opening to trade raises total income and concentrates the losses. Economists have said the second half for as long as the first, and the compensation that would make the argument complete has almost never been delivered.",
    standpoints: [
      { label: "The trade economist", sees: "Consumers better off, exporters growing, and aggregate gains that exceed the losses.", values: "Total welfare.", mayMiss: "That an aggregate gain is not experienced by anyone, while a concentrated loss is." },
      { label: "The displaced worker", sees: "A plant closed, a skill with no local market, and retraining that leads to lower-paid work.", values: "Not being the adjustment mechanism.", mayMiss: "That protecting the plant taxes everyone else, including workers poorer than him." },
      { label: "The consumer", sees: "Prices lower across a whole basket, a benefit spread so thin nobody attributes it.", values: "Real income.", mayMiss: "That the diffuse benefit is why the losers organise and the winners do not." },
      { label: "The industrial policy advocate", sees: "That comparative advantage is built rather than found, and that every country now advising openness protected while it developed.", values: "The historical record of the advisers.", mayMiss: "That most protection produced neither competitiveness nor an exit." }
    ],
    contested: "Whether the standard case for trade is incomplete without the compensation it assumes, and whether a policy whose precondition is never met should still be recommended.",
    changeYourMind: "Look at adjustment assistance actually spent per displaced worker. Where it is negligible, the theoretical case is being made for a policy that was not implemented."
  },
  "inflation-target": {
    opening: "A central bank targets a single number. That number is an average across a basket, and no household consumes the average. Whose basket it approximates is a distributional decision made by a technical body.",
    standpoints: [
      { label: "The central banker", sees: "Expectations that must be anchored, and a single credible target as the instrument that anchors them.", values: "Credibility, which is destroyed by discretion.", mayMiss: "That the basket's weights encode a distributional choice presented as measurement." },
      { label: "The poor household", sees: "Food and fuel, which move more than the index and dominate her spending.", values: "The prices she actually faces.", mayMiss: "That monetary policy is a poor instrument against supply-driven food price shocks." },
      { label: "The employment-focused economist", sees: "Rates raised against inflation the rate cannot reach, with the cost paid in jobs.", values: "Not treating unemployment as the acceptable side of the mandate.", mayMiss: "That unanchored inflation also falls hardest on the same households." },
      { label: "The saver", sees: "Returns below inflation for years, and a policy that quietly transfers from savers to borrowers.", values: "The real value of what he set aside.", mayMiss: "That the alternative rate path may have cost him his income instead." }
    ],
    contested: "Whether an inflation target is a technical parameter or a distributional policy, and whether a body insulated from politics should be setting it if it is the second.",
    changeYourMind: "Compare inflation for the bottom decile's basket against the headline index over a decade. A persistent gap means the target is not measuring the experience it is defended by."
  },

  // Polity and power in India
  "judicial-appointments": {
    opening: "A court that reviews the government's actions is appointed through a process the government cannot control, by judges accountable to no electorate. Every arrangement on offer breaks one principle to protect another, and India has now tried more than one.",
    standpoints: [
      { label: "The defender of judicial primacy", sees: "That a government which picks its own reviewers will not be reviewed, and that this was the experience before the change.", values: "Independence as the precondition for everything else the court does.", mayMiss: "That the alternative concentrates power in a small group with no external check and no published criteria." },
      { label: "The advocate of executive voice", sees: "Judges selecting judges, with no transparency and a striking narrowness in who is chosen.", values: "Democratic accountability reaching every institution.", mayMiss: "That the executive is the largest litigant before the court it would help staff." },
      { label: "The litigant", sees: "Vacancies, delay, and a process whose disputes are conducted between institutions while cases wait.", values: "A functioning court.", mayMiss: "That speed obtained by weakening independence buys a court that decides faster and matters less." },
      { label: "The lawyer from outside the usual pool", sees: "Selection running through networks she is not in, under either system.", values: "A bench that resembles the country.", mayMiss: "That formal criteria have not, elsewhere, reliably produced that either." }
    ],
    contested: "Whether judicial independence requires judicial control over appointments, or whether independence is secured by tenure and process and the appointment stage can safely be shared.",
    changeYourMind: "Compare the composition and the government's success rate before and after the collegium. If neither shifted much, the argument is about legitimacy rather than outcomes."
  },
  "governor-role": {
    opening: "A governor is appointed by the centre, holds office at its pleasure, and exercises discretion over an elected state government at exactly the moments that matter most: assembly formation, assent to bills, and the recommendation for central rule.",
    standpoints: [
      { label: "The constitutional designer", sees: "A federal safety valve, and a link holding a union together that had just been assembled from very different pieces.", values: "A mechanism for when a state's institutions fail.", mayMiss: "That an office defended by its emergency use will be occupied continuously." },
      { label: "The state government", sees: "Bills held without decision, a majority questioned, and discretion exercised in a pattern that tracks which party holds Delhi.", values: "The mandate it was given.", mayMiss: "That state governments have also acted in ways that made an external check look necessary." },
      { label: "The constitutional lawyer", sees: "Discretion narrowed repeatedly by courts, and the remaining discretion concentrated in acts with no deadline attached.", values: "Judicially enforceable limits.", mayMiss: "That a limit without a timetable can be defeated by delay alone." },
      { label: "The voter in the state", sees: "An outcome she did not vote for, arranged by an office she has never voted on.", values: "The result standing.", mayMiss: "That the same office has occasionally prevented a result being manufactured." }
    ],
    contested: "Whether the office is a federal check that has been misused by successive governments of every party, or an instrument that was always going to be used this way and is functioning as designed.",
    changeYourMind: "Chart the use of gubernatorial discretion against whether the state and central governments shared a party. If the correlation is strong across many decades and parties, the design is the issue rather than the occupant."
  },
  "speech-and-the-state": {
    opening: "Indian law permits restriction of speech on grounds including public order, decency and the security of the state. Almost every serious dispute about free expression is a dispute about how far those words reach, not about whether the right exists.",
    standpoints: [
      { label: "The civil libertarian", sees: "Provisions used far more often against critics than against genuine incitement, with the process itself the punishment.", values: "A right that protects speech the government dislikes.", mayMiss: "That in a plural society, some speech does reliably produce violence." },
      { label: "The police officer", sees: "A specific crowd, a specific rumour, and a duty to prevent something that has happened before in that town.", values: "Preventing harm that has already been demonstrated.", mayMiss: "That anticipating disorder gives whoever threatens it a veto over what may be said." },
      { label: "The person the speech is about", sees: "Being targeted at scale, with the harm real and the remedy theoretical.", values: "Not being told to argue back against a mob.", mayMiss: "That broad powers acquired for her protection will be used elsewhere." },
      { label: "The publisher", sees: "Cases filed in distant jurisdictions, and the cost of defending them being the actual deterrent.", values: "Being able to publish without litigating everywhere at once.", mayMiss: "That the same reach lets a person with no resources sue a large publisher." }
    ],
    contested: "Whether restriction should turn on the likelihood of imminent harm, which protects most speech and some genuinely dangerous speech, or on the tendency of speech to cause harm, which protects far less.",
    changeYourMind: "Look at how many cases under these provisions end in conviction. A low rate combined with long pre-trial process means the mechanism is operating as deterrence rather than as law."
  },
  "anti-defection": {
    opening: "A legislator who votes against the party that got her elected loses her seat. This was enacted to stop governments being bought. It also means a member cannot dissent on any matter the party whips, which is most of them.",
    standpoints: [
      { label: "The reformer who wrote it", sees: "Governments falling to purchased defections, and voters' mandates being resold between elections.", values: "The mandate holding for its term.", mayMiss: "That it transfers the member's independence to the party leadership rather than to the voter." },
      { label: "The backbench member", sees: "No ability to vote her constituency's interest against her party's instruction, on any question that matters.", values: "Representing the people who elected her.", mayMiss: "That voters largely chose the party symbol rather than her." },
      { label: "The party leader", sees: "Discipline that makes a legislative programme possible at all.", values: "A government that can govern.", mayMiss: "That discipline this complete removes the internal check on the leadership." },
      { label: "The scholar of legislatures", sees: "Committees weakened, debate reduced to positions declared in advance, and the chamber's scrutiny function largely gone.", values: "A legislature that examines rather than ratifies.", mayMiss: "That the instability it replaced also prevented scrutiny." }
    ],
    contested: "Whether the law should apply only to votes of confidence and money bills, preserving dissent elsewhere, or whether a party that cannot enforce its whip generally cannot enforce it at all.",
    changeYourMind: "Look at how often the exemption for a split has been used and how it was structured. If wholesale defections continue through the exemption while individual dissent is punished, the law is not doing the job it was written for."
  },
  "reservation-horizon": {
    opening: "Reservation was designed as a remedy. A remedy implies a condition that could be cured, and therefore an endpoint. Seventy-five years on, there is no agreed measure of what the endpoint would look like, and proposing one is itself politically costly.",
    standpoints: [
      { label: "The advocate of continuation", sees: "Representation still far from proportionate at senior levels, and the barriers that produced it substantially intact.", values: "Ending the remedy when the harm ends, not before.", mayMiss: "That without a stated measure, the argument cannot ever be settled by evidence." },
      { label: "The advocate of a sunset", sees: "A policy with no exit criterion becoming permanent by default, and a politics organised around expanding rather than completing it.", values: "A remedy that is answerable to a standard.", mayMiss: "That fixing a date rather than a condition would end it while the condition persists." },
      { label: "The beneficiary within the category", sees: "That the benefit concentrates among those in the category who were already best placed.", values: "The remedy reaching the worst off inside it.", mayMiss: "That sub-classification splits the political coalition holding the policy in place." },
      { label: "The applicant outside it", sees: "Competing for a smaller share on a criterion he did not choose either.", values: "Assessment on what he did.", mayMiss: "That the unreserved share still substantially exceeds the unreserved population." }
    ],
    contested: "Whether the goal is proportionate representation, in which case the measure is arithmetic, or the dismantling of caste as a determinant of life chances, in which case representation is an indicator and not the target.",
    changeYourMind: "Look at representation at the most senior levels, where reservation has applied longest. If the gap persists there, an argument that the remedy has run its course has to explain why."
  },
  "personal-law-question": {
    opening: "India applies different family law depending on religious community, an arrangement written into the settlement of 1947 and revisited constantly since. A uniform code is a directive principle of the Constitution and has never been enacted. Both the demand and the resistance contain more than one motive.",
    standpoints: [
      { label: "The advocate of uniformity", sees: "Citizens with different rights in marriage, inheritance and maintenance according to community, and women worse off under several of the systems.", values: "One law for one citizenship.", mayMiss: "That uniformity drafted by a majority tends to resemble the majority's practice." },
      { label: "The defender of plurality", sees: "Communities whose practices were guaranteed at a moment when that guarantee was the condition of staying, and a demand that arrives loudest from those least concerned with the rights it invokes.", values: "Promises kept.", mayMiss: "That defending the system as a whole defends its worst provisions too." },
      { label: "The woman within a personal law system", sees: "Her rights determined by the community she was born into, and reform proposals that speak for her in an argument between men.", values: "The specific entitlement, from whichever direction it comes.", mayMiss: "That reform delivered as an attack on her community may cost her its support." },
      { label: "The law reformer", sees: "That most concrete gains have come through targeted reform and litigation rather than through a comprehensive code.", values: "What has actually moved.", mayMiss: "That incremental reform leaves the underlying differentiation intact." }
    ],
    contested: "Whether equality before the law requires identical family law, or whether it requires a floor of rights that every system must meet while remaining different above it.",
    changeYourMind: "Examine which specific inequalities a proposed code would remove and whether existing reforms have already removed them. If most are already addressed, the code is doing symbolic rather than legal work."
  },
  "electoral-funding": {
    opening: "Money is necessary to contest an election and creates an obligation to whoever supplies it. Every design choice trades disclosure against the risk of retaliation, and India has moved between them more than once.",
    standpoints: [
      { label: "The transparency advocate", sees: "A voter entitled to know who has an interest in the person she is electing.", values: "Disclosure as the precondition for informed consent.", mayMiss: "That full disclosure exposes donors to retaliation by whoever wins, which favours the incumbent." },
      { label: "The defender of donor anonymity", sees: "Businesses that will be punished for backing the losing side, and a system that already runs largely on cash it cannot see.", values: "Getting money into the banking system at all.", mayMiss: "That anonymity from the public is not anonymity from a government that can see the banking record." },
      { label: "The smaller party", sees: "Funding concentrating on whoever is expected to win, and a structural advantage compounding.", values: "A contest that is not decided before it starts.", mayMiss: "That state funding fixes the field in place around whoever currently qualifies." },
      { label: "The voter", sees: "Expenditure limits per candidate and no limit on the party spending around her.", values: "A rule that describes the actual spending.", mayMiss: "That a genuinely enforced limit would need a scale of audit nobody has built." }
    ],
    contested: "Whether the harm to be prevented is the purchase of policy, which requires disclosure, or the coercion of donors, which anonymity addresses at the cost of the first.",
    changeYourMind: "Ask whether the anonymity in question is symmetric. If the government can identify donors and the public cannot, the design does not address coercion; it relocates it."
  },
  "centre-state-money": {
    opening: "Some states raise far more revenue than they receive back; others receive far more than they raise. Both facts are true simultaneously and both are used as grievances. What a shared fiscal pool is for has never been settled in public.",
    standpoints: [
      { label: "The higher-contributing state", sees: "Revenue raised locally, transferred elsewhere, with its own share falling as it succeeds.", values: "A return related to contribution.", mayMiss: "That its revenue base partly reflects national investment and migration from the states it is comparing itself to." },
      { label: "The receiving state", sees: "Historical underinvestment, weaker infrastructure, and a formula that is the mechanism by which a union means anything.", values: "Comparable services regardless of birthplace.", mayMiss: "That transfers not tied to outcomes can preserve the conditions they compensate for." },
      { label: "The finance commission member", sees: "A formula weighing need, equity and effort, where every weight is contested and any choice creates a losing group.", values: "A defensible rule applied consistently.", mayMiss: "That devolution has been increasingly bypassed by centrally sponsored schemes the formula does not reach." },
      { label: "The citizen", sees: "Services that vary enormously by state and no clear line of accountability between the two governments funding them.", values: "Knowing who to hold responsible.", mayMiss: "That the ambiguity suits both governments." }
    ],
    contested: "Whether transfers should equalise capacity, which rewards need, or reward performance, which compounds advantage. The formula does both partially and satisfies nobody.",
    changeYourMind: "Look at how much of central transfer now flows outside the finance commission formula. If the share is large and growing, the argument about the formula is about a shrinking part of the money."
  },

  // India and the world
  "non-alignment-now": {
    opening: "Non-alignment was a position taken when the choice was between two blocs. The blocs went, the term stayed, and what it now describes ranges from a principled refusal to a practice of taking from several sides at once.",
    standpoints: [
      { label: "The continuity view", sees: "A consistent refusal to subordinate national decisions to another capital, surviving every change in the international system.", values: "Judgement retained.", mayMiss: "That refusing alignment is cheap when nobody is asking and expensive when someone is." },
      { label: "The critic", sees: "A doctrine used to avoid choosing while accepting the benefits of choices others make, including the security order that keeps trade routes open.", values: "Costs acknowledged where they are borne.", mayMiss: "That the alternative on offer has usually been alignment on someone else's terms." },
      { label: "The strategist", sees: "Multiple partnerships, none exclusive, as a rational hedge for a country large enough to matter and not large enough to dictate.", values: "Options preserved.", mayMiss: "That partners eventually price the hedging in." },
      { label: "The smaller country watching", sees: "A large state claiming a principle that, applied by everyone, would leave it with no protection at all.", values: "Rules that also work for the weak.", mayMiss: "That alignment has not reliably protected small states either." }
    ],
    contested: "Whether non-alignment is a principle about how a country should decide, which survives the end of the blocs, or a strategy for a specific configuration that no longer exists.",
    changeYourMind: "Identify a case where the position cost something material. If the record is mostly of positions taken when they were free, it is describing a preference rather than a principle."
  },
  "strategic-autonomy": {
    opening: "A country can supply its own defence, buy from several suppliers, or accept a security guarantee. The first is expensive and slow, the second leaves it dependent on continued goodwill from each, and the third requires giving up decisions. There is no fourth option.",
    standpoints: [
      { label: "The advocate of indigenous capability", sees: "Supply cut off at the moment it is needed, which has happened, and a domestic industrial base as the only real independence.", values: "Not being deliverable.", mayMiss: "That building it takes decades and the capability gap in the meantime is real." },
      { label: "The advocate of diversified purchase", sees: "Multiple suppliers as insurance against any one of them, and access to technology no domestic programme will match soon.", values: "Capability now.", mayMiss: "That multiple dependencies are still dependencies, with interoperability costs on top." },
      { label: "The treasury", sees: "Defence spending against health and education, in a country where both are underfunded.", values: "The opportunity cost stated out loud.", mayMiss: "That the cost of being unable to defend a position is not on the same ledger." },
      { label: "The partner state", sees: "A country wanting technology transfer, joint development and no commitment.", values: "Reciprocity.", mayMiss: "That its own reliability has been the reason for the hedging." }
    ],
    contested: "Whether autonomy is achievable at acceptable cost for a country of this size and income, or whether the honest choice is which dependencies to accept and how to spread them.",
    changeYourMind: "Look at the import content of systems described as indigenous. If critical components remain foreign, autonomy is being measured at the wrong point in the supply chain."
  },
  "neighbourhood-first": {
    opening: "India shares borders and rivers with most of South Asia and is larger than all of them combined. That asymmetry means the same act reads as generosity from one side and as pressure from the other, whatever was intended.",
    standpoints: [
      { label: "The Indian policymaker", sees: "Assistance, credit lines and infrastructure extended, and neighbours hedging toward other partners regardless.", values: "Being credited for what is given.", mayMiss: "That a much larger neighbour's help is never received as help alone." },
      { label: "The smaller neighbour", sees: "Dependence on one country for trade routes, fuel and rivers, and domestic politics in which distance from it is always available as a platform.", values: "Room that does not require a patron.", mayMiss: "That the alternative partner also expects something and is further away." },
      { label: "The border community", sees: "Kinship, language and trade running across a line that policy treats as the unit.", values: "The crossing staying open.", mayMiss: "That open crossings are the first casualty of any dispute above them." },
      { label: "The strategic analyst", sees: "Another large power extending credit and infrastructure, and a competition for influence neither neighbour asked for.", values: "Position maintained.", mayMiss: "That framing the region as a competition invites the smaller states to auction it." }
    ],
    contested: "Whether asymmetry can be offset by generosity, or whether it is structural and the realistic goal is predictability rather than affection.",
    changeYourMind: "Compare announced assistance with disbursed assistance and delivery timelines. Where the gap is large, the reception may be a response to the record rather than to the size."
  },
  "migration-and-remittance": {
    opening: "Workers leave, send money home, and that money exceeds most forms of foreign investment. It arrives directly in households rather than through a state. What it costs the place they left is harder to see and rarely counted.",
    standpoints: [
      { label: "The economist", sees: "Transfers that are stable in downturns, untied to conditions, and spent on schooling and health.", values: "Income reaching households directly.", mayMiss: "That the same flow raises local prices and can reduce the pressure to fix what made leaving necessary." },
      { label: "The migrant worker", sees: "Wages several times what was available, and conditions, isolation and legal status that the remittance figure does not record.", values: "The family's position changing.", mayMiss: "That the arrangement depends on his continued absence." },
      { label: "The family that stayed", sees: "Money arriving and a person not, across years, with the household reorganised around it.", values: "The person.", mayMiss: "That the alternative was the same absence without the money." },
      { label: "The sending state", sees: "A trained workforce departing after public investment in its education.", values: "A return on what it paid for.", mayMiss: "That the training was often undertaken precisely because it enabled leaving." }
    ],
    contested: "Whether remittances are a development success or a symptom of a failure to create work at home, and whether a policy of encouraging emigration is a strategy or an admission.",
    changeYourMind: "Look at what remittances are spent on over time. Sustained shifts into land and consumption rather than enterprise suggest they are compensating rather than developing."
  },
  "diaspora-claim": {
    opening: "People who left, and their descendants, retain attachments to the country they came from and are increasingly courted by it. What either party may ask of the other, when one no longer lives with the consequences, is unresolved.",
    standpoints: [
      { label: "The diaspora member", sees: "Family, property and identity still there, and remittances and investment that continue.", values: "A relationship that did not end at the airport.", mayMiss: "That influence exercised from outside is not accountable to anyone inside." },
      { label: "The resident citizen", sees: "Strong opinions about her country's politics held by people who do not live under the results.", values: "Decisions resting with those who bear them.", mayMiss: "That the diaspora often funds institutions that resident citizens rely on." },
      { label: "The government courting them", sees: "Capital, expertise, and a constituency abroad that advances its position in other capitals.", values: "A resource that costs little to cultivate.", mayMiss: "That mobilising a diaspora politically can make its position in its host country harder." },
      { label: "The host country", sees: "Citizens with an active political attachment elsewhere, and periodic questions about where loyalty sits.", values: "Integration.", mayMiss: "That divided attachment is the normal condition of migration and rarely the problem it is described as." }
    ],
    contested: "Whether political voice should follow citizenship, residence, or contribution, since the diaspora often has the first and third without the second.",
    changeYourMind: "Ask whether you would extend the same voice to a diaspora whose politics you dislike. If not, the principle being defended is the outcome."
  },
  "multilateral-reform": {
    opening: "The institutions governing security, trade and finance were designed in 1945 by the states that had just won a war. Almost everyone agrees they no longer represent the distribution of power or population. Nothing changes, and the reason is not mysterious.",
    standpoints: [
      { label: "The claimant for a seat", sees: "Population, economic weight and contribution unrepresented at the table where decisions bind it.", values: "Representation tracking reality.", mayMiss: "That every claimant is opposed by a regional rival with the same argument." },
      { label: "The permanent member", sees: "An arrangement that has held for eighty years, and a veto it will not be voted out of.", values: "Stability, and its own position.", mayMiss: "That legitimacy lost slowly is still lost." },
      { label: "The small state", sees: "Reform proposals that would add more large states above it while changing nothing about its own position.", values: "Not trading one hierarchy for a larger one.", mayMiss: "That the current arrangement is not serving it either." },
      { label: "The institutionalist", sees: "Bodies that still do a great deal of unglamorous work that nothing would replace.", values: "Not breaking what functions while arguing about the part that does not.", mayMiss: "That the functioning parts are increasingly bypassed by arrangements made elsewhere." }
    ],
    contested: "Whether the blockage is the veto, which is a rule, or the absence of any coalition that agrees on an alternative, which is a fact about interests.",
    changeYourMind: "Look at whether reform proposals have ever failed at the veto stage, or earlier. If they die before reaching it, the veto is not the binding constraint."
  },
  "border-lives": {
    opening: "A border is drawn as a line on a map and lived as a condition. For people whose fields, kin and markets are on both sides of it, the questions are about permits, access and documentation rather than about where sovereignty sits.",
    standpoints: [
      { label: "The person living at the line", sees: "Land divided from the village, movement dependent on permission, and infrastructure that stops short because of where it is.", values: "Continuing to live the life the place supported.", mayMiss: "That the security concerns cited are sometimes real and have costs of their own." },
      { label: "The security establishment", sees: "A frontier requiring surveillance, and movement that cannot be distinguished case by case at scale.", values: "A controllable perimeter.", mayMiss: "That treating a population as a risk removes the cooperation that actually produces information." },
      { label: "The trader", sees: "Historic routes closed and goods travelling ten times the distance through a sanctioned crossing.", values: "Exchange that predates the line.", mayMiss: "That open trade routes are used for more than trade." },
      { label: "The national public", sees: "A border as an emblem, discussed in terms of firmness.", values: "Territorial integrity.", mayMiss: "That the cost of firmness is paid entirely by people they will never meet." }
    ],
    contested: "Whether border management should optimise for security, which means restricting movement, or for the viability of border communities, whose cooperation is itself a security asset.",
    changeYourMind: "Compare development indicators in border districts against state averages. A persistent gap means the security framing has a measurable price and someone specific is paying it."
  },
  "aid-and-influence": {
    opening: "Assistance between states is given for reasons, and the reasons include influence. Calling it a gift obscures that; calling it purely instrumental ignores that some of it does exactly what it says. The distinction matters most to the recipient.",
    standpoints: [
      { label: "The donor government", sees: "Public money that must be justified to its own taxpayers, and interests that are not shameful for being interests.", values: "Honesty about mixed motives.", mayMiss: "That conditions attached in good faith still restrict a sovereign decision." },
      { label: "The recipient government", sees: "Assistance arriving with procurement requirements, advisers and reporting that shape policy well beyond the project.", values: "Deciding its own priorities.", mayMiss: "That it sought the funding and can decline the conditions." },
      { label: "The intended beneficiary", sees: "A clinic that exists, and a debate about motives conducted above it.", values: "The thing being built.", mayMiss: "That projects chosen for donor visibility often do not survive the funding cycle." },
      { label: "The competing donor", sees: "Infrastructure offered without governance conditions, and recipients who prefer it.", values: "Speed and non-interference.", mayMiss: "That debt without conditions is still debt, and the terms surface later." }
    ],
    contested: "Whether assistance can be evaluated by its effect regardless of motive, or whether the influence purchased is itself part of the effect and belongs in the assessment.",
    changeYourMind: "Track what happens to a funded programme when the donor's strategic interest moves elsewhere. Continuation suggests it was development; abandonment suggests it was position."
  },
};

export function getTopicContent(slug: string): TopicContent | undefined {
  return timelessContent[slug];
}

export const authoredTopicCount = Object.keys(timelessContent).length;

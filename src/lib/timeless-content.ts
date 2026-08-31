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
  }
};

export function getTopicContent(slug: string): TopicContent | undefined {
  return timelessContent[slug];
}

export const authoredTopicCount = Object.keys(timelessContent).length;

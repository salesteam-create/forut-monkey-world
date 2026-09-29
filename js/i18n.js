// Copy for the prototype. Norwegian (bokmål) is the default, English is for the internal team.
// Child-facing lines are short because Monki reads them aloud.
window.I18N = {
  no: {
    langName: 'Norsk',
    switchTo: 'EN',
    sound: 'Lyd',
    appName: 'Monkis verden',
    concept: 'Konseptskisse',

    welcomeKicker: 'Fra barnehagen',
    welcomeTitle: 'Monki har blitt med deg hjem!',
    welcomeBody: 'Små oppdrag, samtaler om følelser og gode øyeblikk sammen. Noen minutter på skjermen, resten av moroa skjer hjemme.',
    promiseAds: 'Ingen reklame',
    promiseAlgo: 'Ingen algoritmer',
    promiseTime: '5 minutter om dagen',
    start: 'Kom i gang',
    scanned: 'Du skannet QR-koden fra Barneaksjonen-kortet',

    hubGreeting: 'Hei! Så fint at du er her. Hva vil du gjøre i dag?',
    tileMission: 'Dagens oppdrag',
    tileMissionSub: 'Hjelp Monki å rydde',
    tileFeelings: 'Følelser',
    tileFeelingsSub: 'Hvordan har du det?',
    tileTree: 'Bananatreet',
    tileTreeSub: '{n} av {goal} bananer',
    tileParents: 'For voksne',
    tileParentsSub: 'Oversikt og innstillinger',
    friendsTitle: 'Monkis venner',
    back: 'Tilbake',

    missionTitle: 'Monki kommer hjem!',
    missionSay: 'Oi, så rotete det er i gangen! Kan du hjelpe meg å rydde?',
    missionBody: 'Dra tingene på riktig plass.',
    letsGo: 'Ja, vi gjør det!',
    gameSay: 'Hvor skal støvlene? Og jakken?',
    gameGood: ['Supert!', 'Bra jobbet!', 'Ja, der skal den!', 'Hurra!'],
    gameTry: 'Nesten! Prøv en gang til.',
    gameDone: 'Nå er gangen fin! Takk for hjelpen!',
    gameNext: 'Neste',
    itemBoots: 'støvler',
    itemJacket: 'jakke',
    itemHat: 'lue',
    itemBag: 'sekk',

    realTitle: 'Nå er det din tur!',
    realSay: 'Kan du sette skoene og jakken din på plass hjemme også?',
    realParent: 'For den voksne: Gjør oppdraget sammen, og trykk når dere er ferdige.',
    realPhoto: 'Ta et bilde (valgfritt)',
    realPhotoNote: 'Bildet blir bare lagret på denne enheten.',
    realDone: 'Vi gjorde det!',

    celebrateTitle: 'Du fikk en banan!',
    celebrateSay: 'Du er verdens beste hjelper! Banan på treet!',
    unlockTitle: 'Ny belønning låst opp',
    toTree: 'Se bananatreet',
    toHub: 'Tilbake til jungelen',

    feelTitle: 'Hvordan har du det i dag?',
    feelSay: 'Hvordan har du det i dag? Trykk på et fjes.',
    feelings: {
      happy: 'Glad', sad: 'Lei meg', angry: 'Sint', scared: 'Redd', excited: 'Spent'
    },
    feelReply: {
      happy: 'Så fint at du er glad! Jeg blir glad sammen med deg.',
      sad: 'Det er lov å være lei seg. Vil du ha en klem?',
      angry: 'Noen ganger blir vi sinte. Skal vi puste dypt sammen?',
      scared: 'Det er helt greit å være redd. Jeg er her med deg.',
      excited: 'Jippi! Hva gleder du deg til?'
    },
    feelStarterTitle: 'Samtalestarter for den voksne',
    feelStarter: {
      happy: 'Hva var det beste som skjedde i dag?',
      sad: 'Hva gjorde deg lei deg? Hva kan hjelpe når man er lei seg?',
      angry: 'Hvor i kroppen kjenner du at du er sint?',
      scared: 'Hva kan vi gjøre sammen når noe er skummelt?',
      excited: 'Hva gleder du deg mest til denne uka?'
    },
    feelNepal: 'Høsten 2027 reiser Monki til Nepal for å lære mer om følelser.',
    feelDone: 'Vi snakket om det',

    treeTitle: 'Bananatreet',
    treeSay: 'Hver banan teller! Se hvor mange vi har samlet.',
    treeMonth: 'Oktober',
    treeCount: '{n} av {goal} bananer denne måneden',
    treeNoStreak: 'Hvert oppdrag og hver samtale blir en banan. Ingen rekker å miste, og ingen sammenligning med andre.',
    friends: {
      yanay: 'Yanay betyr elefant på tamil. Yanay er fra Sri Lanka.',
      orbai: 'Orbai betyr konge på temne. Orbai er fra Sierra Leone.',
      suala: 'Suala betyr sjiraff på chichewa. Suala er fra Malawi.',
      palaiya: 'Palaiya betyr gammel på tamil. Palaiya er fra Sri Lanka.'
    },
    weekdays: ['M', 'T', 'O', 'T', 'F', 'L', 'S'],
    treeDays: 'Dager dere var med',
    rewardsTitle: 'Belønninger',
    rewards: [
      { at: 6, title: 'Monki-sang', sub: 'En ny sang å synge sammen' },
      { at: 12, title: 'Fargeleggingsark', sub: 'Skriv ut og fargelegg hjemme' },
      { at: 18, title: 'Klistremerker', sub: 'Monki og vennene, til å skrive ut' },
      { at: 24, title: 'Månedens fotokort', sub: 'Et trykt kort med bildene fra oppdragene deres. Foreslått partner: Cewe' }
    ],
    locked: 'Låst',
    unlocked: 'Låst opp',

    gateTitle: 'For voksne',
    gateBody: 'Hold inne knappen i 3 sekunder for å fortsette.',
    gateHold: 'Hold inne',

    parentsTitle: 'For voksne',
    weekTitle: 'Denne uka',
    statMissions: 'oppdrag',
    statFeelings: 'følelsessamtaler',
    statMinutes: 'min på skjermen',
    screenTitle: 'Skjermtid i dag',
    screenBody: '{m} min av anbefalt maks {max} min. Etterpå sier Monki ha det og foreslår noe å gjøre ute.',
    photosTitle: 'Bildene deres',
    photosEmpty: 'Bilder fra oppdragene vises her. De blir bare lagret på denne enheten.',
    orderPrint: 'Bestill fotokort (kommer)',
    settingsTitle: 'Innstillinger',
    setReminder: 'Påminnelse ved henting i barnehagen',
    setSound: 'Monki leser høyt',
    whyTitle: 'Hvorfor Monkis verden er annerledes',
    why: [
      'Ingen reklame og ingen algoritmer. Innholdet er laget av FORUT.',
      'Målet er ikke mer skjermtid, men flere gode øyeblikk sammen.',
      'Ingen sammenligning med andre barn.',
      'Vi samler så lite data som mulig.'
    ],
    resetDemo: 'Nullstill demo',
    resetDone: 'Demoen er nullstilt'
  },

  en: {
    langName: 'English',
    switchTo: 'NO',
    sound: 'Sound',
    appName: "Monki's World",
    concept: 'Concept sketch',

    welcomeKicker: 'From kindergarten',
    welcomeTitle: 'Monki came home with you!',
    welcomeBody: 'Small missions, talks about feelings and good moments together. A few minutes on screen, the rest of the fun happens at home.',
    promiseAds: 'No ads',
    promiseAlgo: 'No algorithms',
    promiseTime: '5 minutes a day',
    start: 'Get started',
    scanned: 'You scanned the QR code from the Barneaksjonen card',

    hubGreeting: "Hi! I'm so glad you're here. What do you want to do today?",
    tileMission: "Today's mission",
    tileMissionSub: 'Help Monki tidy up',
    tileFeelings: 'Feelings',
    tileFeelingsSub: 'How are you today?',
    tileTree: 'Banana tree',
    tileTreeSub: '{n} of {goal} bananas',
    tileParents: 'For grown-ups',
    tileParentsSub: 'Overview and settings',
    friendsTitle: "Monki's friends",
    back: 'Back',

    missionTitle: 'Monki comes home!',
    missionSay: 'Oh, the hallway is so messy! Can you help me tidy up?',
    missionBody: 'Drag the things to the right place.',
    letsGo: "Yes, let's do it!",
    gameSay: 'Where do the boots go? And the jacket?',
    gameGood: ['Super!', 'Well done!', 'Yes, that goes there!', 'Hooray!'],
    gameTry: 'Almost! Try again.',
    gameDone: 'The hallway looks great! Thank you for helping!',
    gameNext: 'Next',
    itemBoots: 'boots',
    itemJacket: 'jacket',
    itemHat: 'hat',
    itemBag: 'backpack',

    realTitle: 'Now it is your turn!',
    realSay: 'Can you put your shoes and jacket in their place at home too?',
    realParent: 'For the grown-up: do the mission together and tap when you are done.',
    realPhoto: 'Take a photo (optional)',
    realPhotoNote: 'The photo is only stored on this device.',
    realDone: 'We did it!',

    celebrateTitle: 'You got a banana!',
    celebrateSay: "You're the world's best helper! A banana for the tree!",
    unlockTitle: 'New reward unlocked',
    toTree: 'See the banana tree',
    toHub: 'Back to the jungle',

    feelTitle: 'How are you today?',
    feelSay: 'How are you feeling today? Tap a face.',
    feelings: {
      happy: 'Happy', sad: 'Sad', angry: 'Angry', scared: 'Scared', excited: 'Excited'
    },
    feelReply: {
      happy: "I'm so glad you're happy! I feel happy with you.",
      sad: "It's okay to be sad. Would you like a hug?",
      angry: "Sometimes we get angry. Shall we take a deep breath together?",
      scared: "It's okay to be scared. I'm here with you.",
      excited: 'Yippee! What are you looking forward to?'
    },
    feelStarterTitle: 'Conversation starter for the grown-up',
    feelStarter: {
      happy: 'What was the best thing that happened today?',
      sad: 'What made you sad? What helps when you feel sad?',
      angry: 'Where in your body do you feel angry?',
      scared: 'What can we do together when something feels scary?',
      excited: 'What are you looking forward to most this week?'
    },
    feelNepal: 'In autumn 2027 Monki travels to Nepal to learn more about feelings.',
    feelDone: 'We talked about it',

    treeTitle: 'Banana tree',
    treeSay: "Every banana counts! Look how many we've collected.",
    treeMonth: 'October',
    treeCount: '{n} of {goal} bananas this month',
    treeNoStreak: 'Every mission and every talk becomes a banana. No streaks to lose, and no comparing with others.',
    friends: {
      yanay: 'Yanay means elephant in Tamil. Yanay is from Sri Lanka.',
      orbai: 'Orbai means king in Temne. Orbai is from Sierra Leone.',
      suala: 'Suala means giraffe in Chichewa. Suala is from Malawi.',
      palaiya: 'Palaiya means old in Tamil. Palaiya is from Sri Lanka.'
    },
    weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    treeDays: 'Days you took part',
    rewardsTitle: 'Rewards',
    rewards: [
      { at: 6, title: 'Monki song', sub: 'A new song to sing together' },
      { at: 12, title: 'Colouring sheet', sub: 'Print and colour at home' },
      { at: 18, title: 'Stickers', sub: 'Monki and friends, ready to print' },
      { at: 24, title: 'Photo card of the month', sub: 'A printed card with photos from your missions. Suggested partner: Cewe' }
    ],
    locked: 'Locked',
    unlocked: 'Unlocked',

    gateTitle: 'For grown-ups',
    gateBody: 'Press and hold the button for 3 seconds to continue.',
    gateHold: 'Hold',

    parentsTitle: 'For grown-ups',
    weekTitle: 'This week',
    statMissions: 'missions',
    statFeelings: 'feelings talks',
    statMinutes: 'min on screen',
    screenTitle: 'Screen time today',
    screenBody: '{m} min of the recommended max {max} min. After that, Monki says goodbye and suggests something to do outside.',
    photosTitle: 'Your photos',
    photosEmpty: 'Photos from your missions appear here. They are only stored on this device.',
    orderPrint: 'Order photo card (coming)',
    settingsTitle: 'Settings',
    setReminder: 'Reminder at kindergarten pick-up',
    setSound: 'Monki reads aloud',
    whyTitle: "Why Monki's World is different",
    why: [
      'No ads and no algorithms. The content is made by FORUT.',
      'The goal is not more screen time, but more good moments together.',
      'No comparison with other children.',
      'We collect as little data as possible.'
    ],
    resetDemo: 'Reset demo',
    resetDone: 'The demo has been reset'
  }
};

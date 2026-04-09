interface JobMatch {
  title: string;
  explanation: string;
  itemNames: string[];
}

const JOB_MAPPINGS: { keywords: string[]; match: JobMatch }[] = [
  {
    keywords: ["refinish", "hardwood", "floor", "sand", "wood floor", "resurface"],
    match: {
      title: "Floor refinishing kit",
      explanation: "Here's everything you need to refinish hardwood floors:",
      itemNames: ["Orbital Sander (Bosch)", "Floor Buffer / Polisher"],
    },
  },
  {
    keywords: ["outdoor", "movie", "night", "cinema", "projector", "backyard movie", "screen"],
    match: {
      title: "Outdoor cinema setup",
      explanation: "Everything for an outdoor movie night:",
      itemNames: ["Portable Projector + Screen", "Bluetooth PA Speaker (JBL PartyBox)"],
    },
  },
  {
    keywords: ["fix", "deck", "repair deck", "build deck", "patio", "wood", "fence"],
    match: {
      title: "Deck repair toolkit",
      explanation: "Tools you'll need for deck repair:",
      itemNames: ["DeWalt 20V Cordless Drill", "Circular Saw (Makita 7¼\")", "Orbital Sander (Bosch)"],
    },
  },
  {
    keywords: ["thanksgiving", "dinner", "feast", "cook", "holiday meal", "bake", "baking", "cooking"],
    match: {
      title: "Thanksgiving kitchen arsenal",
      explanation: "Cook a feast with these:",
      itemNames: ["KitchenAid Stand Mixer", "Instant Pot Duo 8-Quart", "Sous Vide Precision Cooker"],
    },
  },
  {
    keywords: ["camping", "camp", "tent", "weekend trip", "outdoors", "hike", "hiking"],
    match: {
      title: "Weekend camping essentials",
      explanation: "Everything for a weekend trip:",
      itemNames: ["4-Person Tent (MSR Habitude)", "Camping Stove (Coleman 2-Burner)"],
    },
  },
  {
    keywords: ["clean", "exterior", "house", "pressure wash", "power wash", "siding", "driveway"],
    match: {
      title: "House exterior cleaning",
      explanation: "Get your house looking fresh:",
      itemNames: ["Pressure Washer (Sun Joe 2030 PSI)", "Hedge Trimmer (Electric)"],
    },
  },
  {
    keywords: ["party", "music", "event", "speaker", "dj", "gathering", "celebration"],
    match: {
      title: "Party sound system",
      explanation: "Set the vibe for your event:",
      itemNames: ["Bluetooth PA Speaker (JBL PartyBox)", "Portable Projector + Screen"],
    },
  },
  {
    keywords: ["photo", "photograph", "portrait", "shoot", "camera", "picture"],
    match: {
      title: "Photography kit",
      explanation: "Everything you need for a photo shoot:",
      itemNames: ["DSLR Camera (Canon EOS Rebel T8i + 18-55mm)"],
    },
  },
  {
    keywords: ["drill", "hang", "shelf", "shelves", "mount", "install", "wall"],
    match: {
      title: "Wall mounting toolkit",
      explanation: "Tools to hang and mount things:",
      itemNames: ["DeWalt 20V Cordless Drill", "Socket Wrench Set (152-piece)"],
    },
  },
  {
    keywords: ["garden", "yard", "trim", "hedge", "lawn", "landscap"],
    match: {
      title: "Garden maintenance kit",
      explanation: "Keep your yard looking great:",
      itemNames: ["Hedge Trimmer (Electric)", "Pressure Washer (Sun Joe 2030 PSI)"],
    },
  },
];

const TASK_VERBS = ["fix", "build", "make", "cook", "repair", "clean", "set up", "prepare", "host", "throw", "organize", "refinish", "install", "hang", "mount", "trim", "wash", "photograph", "shoot"];

export function isJobQuery(query: string): boolean {
  const words = query.trim().split(/\s+/);
  if (words.length > 4) return true;
  const lower = query.toLowerCase();
  return TASK_VERBS.some((verb) => lower.includes(verb));
}

export function findJobMatches(query: string): JobMatch | null {
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/);

  let bestMatch: JobMatch | null = null;
  let bestScore = 0;

  for (const mapping of JOB_MAPPINGS) {
    let score = 0;
    for (const keyword of mapping.keywords) {
      if (queryLower.includes(keyword)) {
        score += 3;
      } else {
        for (const word of queryWords) {
          if (word.length > 2 && keyword.includes(word)) {
            score += 1;
          }
        }
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = mapping.match;
    }
  }

  return bestScore >= 2 ? bestMatch : null;
}

export type { JobMatch };

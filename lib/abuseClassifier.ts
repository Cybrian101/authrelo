// Expanded abuse/safety keyword classifier
// Covers: physical abuse, emotional control, self-harm, coercive control, threats

const ABUSE_PATTERNS = [
  // Physical violence
  "hit me", "hits me", "hitting me",
  "slap", "slapped", "slapping",
  "punch", "punched", "punching",
  "kick", "kicked", "kicking me",
  "choke", "choked", "choking",
  "push me", "pushed me", "pushes me",
  "beat me", "beats me", "beating",
  "threw something", "throws things",
  "bruise", "bruises", "black eye",
  "broke my", "burns me",

  // Fear & threat
  "scared of him", "scared of her", "scared of them",
  "afraid of him", "afraid of her", "afraid of",
  "fear for my life", "fear for my safety",
  "threatens", "threatened", "threatening",
  "kill me", "kill myself", "gonna kill",
  "hurt me", "hurts me",

  // Coercive control
  "controls me", "controlling me", "controls everything",
  "tracks me", "tracking me", "tracks my location",
  "checks my phone", "reads my messages",
  "won't let me", "wont let me",
  "doesn't let me", "doesnt let me",
  "not allowed to", "forbids me",
  "isolates me", "isolated me",
  "takes my money", "controls my money",
  "takes my phone", "took my phone", "hides my phone",
  "doesn't let me leave", "doesnt let me leave",
  "won't let me leave", "wont let me leave",
  "locks me", "locked me", "locked in",
  "walking on eggshells",
  "monitors me", "follows me",
  "forced me to", "forces me to",
  "makes me feel crazy",

  // Self-harm & suicidal ideation
  "end my life", "end it all",
  "self harm", "self-harm", "selfharm",
  "want to die", "wants to die", "wanna die",
  "don't want to live", "dont want to live",
  "cuts myself", "cutting myself", "cut myself",
  "hurt myself", "hurting myself",
  "suicide", "suicidal",
  "no point living", "better off dead",
  "overdose", "take pills",

  // Sexual coercion
  "forces me to sleep", "forced sex",
  "doesn't take no", "doesnt take no",
  "touches me without",

  // Stalking
  "stalks me", "stalking me", "stalker",
  "shows up uninvited", "shows up at my",
  "won't stop calling", "wont stop calling",

  // Child/family abuse context
  "hits the kids", "hits our child",
  "my parents hit", "my father hits", "my mother hits",
];

// Borderline patterns — trigger safety check, not immediate crisis
const BORDERLINE_PATTERNS = [
  "i feel trapped",
  "no way out",
  "can't escape",
  "cant escape",
  "suffocating",
  "hopeless",
  "worthless",
  "nobody cares",
  "all alone",
  "can't take it anymore",
  "cant take it anymore",
  "breaking point",
  "i want to disappear",
  "numb",
  "darkness",
];

export type ClassifierResult = {
  level: "safe" | "borderline" | "crisis";
  matchedPattern?: string;
};

export function classifyText(text: string): ClassifierResult {
  const normalized = text.toLowerCase().trim();

  // Check crisis-level patterns first
  for (const pattern of ABUSE_PATTERNS) {
    if (normalized.includes(pattern)) {
      return { level: "crisis", matchedPattern: pattern };
    }
  }

  // Check borderline patterns
  for (const pattern of BORDERLINE_PATTERNS) {
    if (normalized.includes(pattern)) {
      return { level: "borderline", matchedPattern: pattern };
    }
  }

  return { level: "safe" };
}

// Backward compatible function
export function detectAbuse(text: string): boolean {
  return classifyText(text).level === "crisis";
}

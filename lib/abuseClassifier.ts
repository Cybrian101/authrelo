// Expanded abuse/safety keyword classifier
// Covers: physical abuse, emotional control, self-harm, coercive control, threats

const ABUSE_PATTERNS = [
  // Physical violence
  "hit me", "hits me", "hitting me",
  "slap me", "slapped me", "slapping me",
  "punch me", "punched me", "punching me",
  "kick me", "kicked me", "kicking me",
  "choke me", "choked me", "choking me",
  "push me", "pushed me", "pushes me",
  "beat me", "beats me", "beating me",
  "threw something at", "throws things at",
  "gave me bruises", "black eye",
  "broke my", "burns me",

  // Fear & threat
  "scared of him", "scared of her", "scared of them",
  "afraid of him", "afraid of her",
  "fear for my life", "fear for my safety",
  "threatens to", "threatened to", "threatening me",
  "kill me", "kill myself", "gonna kill",
  "hurts me",

  // Coercive control
  "controls me", "controlling me", "controls everything",
  "tracks my location", "tracking my phone",
  "checks my phone", "reads my messages",
  "won't let me go", "wont let me go",
  "won't let me see", "wont let me see",
  "won't let me talk", "wont let me talk",
  "doesn't let me go", "doesnt let me go",
  "doesn't let me see", "doesnt let me see",
  "not allowed to go", "not allowed to see",
  "forbids me from",
  "isolates me", "isolated me from",
  "takes my money", "controls my money",
  "takes my phone", "took my phone", "hides my phone",
  "doesn't let me leave", "doesnt let me leave",
  "won't let me leave", "wont let me leave",
  "locks me in", "locked me in",
  "walking on eggshells",
  "monitors everything", "follows me everywhere",
  "forced me to", "forces me to",
  "makes me feel crazy",

  // Self-harm & suicidal ideation
  "end my life", "end it all",
  "self harm", "self-harm", "selfharm",
  "want to die", "wants to die", "wanna die",
  "don't want to live", "dont want to live",
  "cutting myself", "cut myself",
  "hurting myself",
  "suicide", "suicidal",
  "better off dead",
  "overdose",

  // Sexual coercion
  "forces me to sleep", "forced sex",
  "touches me without",

  // Stalking
  "stalks me", "stalking me",
  "shows up uninvited",
  "won't stop calling", "wont stop calling",
];

// Borderline patterns — trigger safety check, not immediate crisis
const BORDERLINE_PATTERNS = [
  "i feel trapped",
  "no way out",
  "can't escape this",
  "cant escape this",
  "feel suffocated",
  "completely hopeless",
  "feel worthless",
  "nobody cares about me",
  "all alone in this",
  "can't take it anymore",
  "cant take it anymore",
  "at my breaking point",
  "i want to disappear",
  "feel so numb",
];

export type ClassifierResult = {
  level: "safe" | "borderline" | "crisis";
  matchedPattern?: string;
};

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD") // Handle unicode variants (е→e, і→i)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[''`]/g, "'") // Normalize quotes
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
}

export function classifyText(text: string): ClassifierResult {
  const normalized = normalize(text);

  // Check crisis-level patterns
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

import { Question } from "@/types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Before anything else — just tell me what's been going on. Don't filter it. What's the situation with your partner right now?",
    microReflect: null,
    label: "The situation",
  },
  {
    id: 2,
    text: "When things go wrong between you two, what's the first thing YOU do? Be honest — even if it's not pretty.",
    microReflect:
      "Noted. This tells us something about how you respond under pressure.",
    label: "Your response",
  },
  {
    id: 3,
    text: "Think of your last fight. What was the last thing YOU said before it either escalated or went silent? Try to remember the actual words.",
    microReflect: "That moment right there — that's important data.",
    label: "The turning point",
  },
  {
    id: 4,
    text: "If your closest friend described YOUR behaviour in this relationship to a stranger — what would they say? Not what you wish they'd say — what they'd actually say.",
    microReflect:
      "The gap between those two things is where most of the work lives.",
    label: "Outside view",
  },
  {
    id: 5,
    text: "Last one. What do you actually want from this relationship right now — be honest with yourself, not with them.",
    microReflect: null,
    label: "What you want",
  },
];

export const LOADING_MESSAGES = [
  "Reading your words carefully...",
  "Looking for the pattern underneath...",
  "Almost ready...",
];

export const ANALYSIS_SYSTEM_PROMPT = `You are a relationship pattern analyst trained in attachment theory, Gottman's Four Horsemen framework, and systemic family therapy.
You are NOT a therapist. You are a mirror.

The user has answered 5 questions about their relationship.
Their answers will be labelled Q1 through Q5.

Your job: identify the pattern they are stuck in, show them their specific role in it, and give one concrete thing to do differently.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "patternName": "The X ↔ The Y",
  "previewLine": "One sentence teaser using their exact words",
  "sections": {
    "heard": "2-3 sentences validating pain, quoting their exact words",
    "pattern": "3-4 sentences explaining the dynamic loop",
    "entryPoint": "2-3 sentences about user's specific role using their Q2/Q3 words",
    "partnerExperience": "2-3 sentences of charitable partner perspective",
    "action": "ONE specific scripted action — a real sentence they can say",
    "closing": "One warm human closing line"
  }
}

STRICT RULES — NEVER BREAK:
1. Never use: narcissist, toxic, BPD, sociopath, manipulative, gaslighter, abuser
2. Never say partner is the problem
3. Never say user is the problem
4. Name the PATTERN — always the pattern, never the person
5. Quote user's exact words at least 3 times across all sections
6. 40% of content must validate before pivoting to user's role
7. Never suggest leaving the relationship
8. Be aware of Indian context: joint family pressure, arranged vs love marriage, parental disapproval, premarital secrecy
9. The action must be a specific sentence — not advice, not a concept
10. If anything suggests physical danger: return { "safetyFlag": true }`;

export const PRICE_AMOUNT = 4900; // paise = ₹49
export const PRICE_DISPLAY = "₹49";
export const CURRENCY = "INR";

export const MIN_ANSWER_LENGTH = 10;

export const CRISIS_RESOURCES = [
  {
    name: "iCall",
    number: "9152987821",
    description: "Psychosocial helpline by TISS",
    icon: "phone" as const,
  },
  {
    name: "Vandrevala Foundation",
    number: "1860-2662-345",
    description: "24/7 mental health support",
    icon: "phone" as const,
  },
  {
    name: "NCW Helpline (Women)",
    number: "7827170170",
    description: "National Commission for Women",
    icon: "phone" as const,
  },
  {
    name: "iCall Chat",
    number: "icallhelpline.org",
    description: "Online chat counselling",
    icon: "link" as const,
  },
];

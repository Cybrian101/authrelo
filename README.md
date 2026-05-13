# AuthRelo

**Are you really listening — to yourself?**

AuthRelo is an anonymous, AI-powered relationship self-reflection tool built for young Indians (18–25). Users answer 5 carefully designed questions about their relationship. The AI — trained on attachment theory, Gottman's Four Horsemen framework, and systemic family therapy — identifies the relational pattern they're stuck in and reflects it back at them. Specifically, honestly, without judgment.

It's not therapy. It's not advice. It's a mirror.

Brand color: **Amber #F59E0B** on dark **#0D1117**

---

## How It Works

### The User Journey

1. **Landing** → User sees tagline, trust signals, and starts for free
2. **Content Warning** → Gentle heads-up that questions may surface difficult emotions
3. **5-Question Chat** → Guided conversational flow with typing indicators, micro-reflections between questions, and voice input support
4. **Safety Gate** → Every answer is scanned for abuse/self-harm keywords. Crisis → redirect to helplines. Borderline → "Are you safe right now?" check
5. **Analysis** → Claude processes all 5 answers against a strict psychological prompt. 15-second loading screen with rotating status messages
6. **Paywall** → Pattern name + first 2 lines visible. Rest blurred. ₹49 via Razorpay UPI
7. **Full Reflection** → 6 sections: What we heard, The pattern, Your entry point, Partner's experience, One thing to try this week, Closing line
8. **Post-Result** → Feedback widget, email delivery, share card, referral link, therapist directory, upsell (3-pack / monthly)

### The 5 Questions

These are hardcoded — not AI-generated. Each is designed to surface a specific behavioral signal:

| # | Question | What it reveals |
|---|----------|-----------------|
| Q1 | "What's the situation with your partner right now?" | Context, emotional state, framing |
| Q2 | "When things go wrong, what's the first thing YOU do?" | Default stress response pattern |
| Q3 | "What was the last thing YOU said before it escalated or went silent?" | Exact trigger moment |
| Q4 | "If your closest friend described YOUR behaviour — what would they say?" | Self-awareness gap |
| Q5 | "What do you actually want from this relationship right now?" | Underlying need vs. stated position |

After Q2, Q3, and Q4, the AI shows a "micro-reflection" — a short italic line that signals "we noticed something" without revealing the analysis.

---

## Features

### Core
- **5-question guided chat session** — conversational UI with typing indicators and message bubbles
- **AI pattern analysis** — Claude claude-sonnet-4-5 with strict psychological prompt (attachment theory + Gottman)
- **Streaming analysis** — SSE endpoint for real-time response streaming
- **Razorpay payments** — ₹49 one-time UPI payment with server-side signature verification (constant-time comparison)
- **Fully anonymous** — no database, no auth, no cookies. All state in `sessionStorage` (clears on tab close)

### Safety
- **Multi-level abuse classifier** — 80+ patterns across physical violence, coercive control, self-harm, sexual coercion, stalking
- **Borderline detection** — phrases like "I feel trapped" or "can't take it anymore" trigger an intermediate safety check ("Are you safe right now?") instead of hard-redirecting to crisis
- **Unicode normalization** — classifier handles diacritics, Cyrillic lookalikes, and quote variants to prevent bypass
- **Crisis screen** — one-way route to Indian helplines (iCall, Vandrevala Foundation, NCW, iCall Chat). No back button
- **Server-side safety flag** — Claude prompt itself returns `{ safetyFlag: true }` if it detects danger in answers
- **Content warning** — shown once before session begins

### Couple Mode
- Both partners answer the same 5 questions on the same device, one after the other
- Dedicated Claude prompt compares both perspectives and identifies the shared dynamic
- Shows where the patterns collide and gives one scripted action for each partner

### Internationalization
- **English + Hindi** — full translation of all 80+ UI strings
- **Language toggle** on landing page (EN / हिं)
- Designed for easy addition of Tamil, Telugu, Marathi, etc.

### UX & Polish
- **Framer Motion animations** — page transitions, staggered fade-ins, scroll-triggered reveals
- **Onboarding carousel** — 3-slide "how it works" shown once for first-time visitors
- **Voice input** — Web Speech API with animated recording indicator and haptic feedback
- **Dark/Light theme** — toggle with CSS variable system and smooth transitions
- **Confetti** — fires on result page unlock (payment success)
- **Skeleton loaders** — for all loading/hydration states
- **Progressive disclosure** — result sections reveal as user scrolls (IntersectionObserver via Framer Motion)
- **Error boundaries** — graceful crash recovery with retry button
- **Mobile-first** — max-width 480px, 44px minimum tap targets, iOS safe areas, 16px inputs to prevent zoom

### Post-Result Features
- **Feedback widget** — thumbs up/down with analytics tracking
- **Email delivery** — optional send reflection to email (HTML formatted, SMTP configurable)
- **Share card** — native share sheet or clipboard fallback with pattern name + preview line
- **Referral system** — unique referral link with copy-to-clipboard
- **Upsell cards** — 3-session pack (₹129) and monthly unlimited (₹99)
- **Therapist directory** — filterable by city (Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Online) with tap-to-call

### Technical
- **Rate limiting** — in-memory rate limiter on all API routes (5 req/min per IP)
- **OG image generation** — dynamic social share cards via `@vercel/og` at `/api/og?pattern=...&line=...`
- **Analytics** — PostHog integration with 19 funnel events (landing → session → analysis → payment → result → share)
- **PWA** — manifest.json, service worker with network-first navigation + stale-while-revalidate assets
- **Install prompt** — "Add to Home Screen" banner with dismiss/remember

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS variables for theming |
| UI Components | shadcn/ui pattern (Radix + CVA) |
| Animations | Framer Motion |
| AI | Anthropic Claude API (claude-sonnet-4-5) |
| Payments | Razorpay (UPI) |
| Email | Nodemailer (SMTP) |
| Analytics | PostHog |
| OG Images | @vercel/og |
| Effects | canvas-confetti |
| Notifications | react-hot-toast |
| Deployment | Vercel-ready |

---

## Project Structure

```
authrelo/
├── app/
│   ├── layout.tsx                      Root layout (DM Sans, PWA, error boundary)
│   ├── page.tsx                        Screen 1: Landing (onboarding, theme/lang toggle)
│   ├── globals.css                     Design system (dark + light themes)
│   ├── session/
│   │   └── page.tsx                    Screen 2: Chat flow (5 questions + safety)
│   ├── paywall/
│   │   └── page.tsx                    Screen 3: Blurred result + Razorpay payment
│   ├── result/
│   │   └── page.tsx                    Screen 4: Full reflection + feedback + share
│   ├── crisis/
│   │   └── page.tsx                    Screen 5: Safety resources (one-way)
│   ├── couple/
│   │   └── page.tsx                    Screen 6: Couple mode (both partners)
│   ├── therapists/
│   │   └── page.tsx                    Screen 7: Therapist directory by city
│   └── api/
│       ├── analyse/
│       │   ├── route.ts                Claude API call (standard)
│       │   └── stream/
│       │       └── route.ts            Claude API call (SSE streaming)
│       ├── couple-analyse/
│       │   └── route.ts                Claude API for couple mode
│       ├── payment/
│       │   ├── create/route.ts         Create Razorpay order (₹49)
│       │   └── verify/route.ts         Verify payment signature (timing-safe)
│       ├── email/
│       │   └── route.ts               Send reflection via SMTP
│       └── og/
│           └── route.tsx               Dynamic OG image generation
├── components/
│   ├── ui/
│   │   └── button.tsx                  shadcn-style button (CVA variants)
│   ├── ChatBubble.tsx                  AI/user/micro-reflect message bubbles
│   ├── TypingIndicator.tsx             3-dot animated typing dots
│   ├── ProgressBar.tsx                 Step X of 5 with amber fill
│   ├── MicroReflect.tsx                Italic amber reflection between questions
│   ├── PatternCard.tsx                 Pattern name + preview (with optional blur)
│   ├── BlurredResult.tsx               Locked section previews on paywall
│   ├── ResultSection.tsx               Individual result card (icon + title + body)
│   ├── ShareCard.tsx                   Native share / clipboard share button
│   ├── UpsellCard.tsx                  3-pack and monthly pricing
│   ├── CrisisScreen.tsx                Helpline resource cards
│   ├── OnboardingCarousel.tsx          3-slide intro with Framer Motion
│   ├── ContentWarning.tsx              "Before we begin" emotional heads-up
│   ├── SafetyCheck.tsx                 "Are you safe right now?" checkpoint
│   ├── VoiceButton.tsx                 Mic button with pulse animation
│   ├── ThemeToggle.tsx                 Sun/Moon dark/light switch
│   ├── LanguageToggle.tsx              EN/हिं language switcher
│   ├── InstallPrompt.tsx               PWA install banner
│   ├── FeedbackWidget.tsx              Thumbs up/down post-result
│   ├── EmailDelivery.tsx               Email input + send button
│   ├── ReferralCard.tsx                Referral link + copy
│   ├── Confetti.tsx                    Amber confetti burst on payment
│   ├── PageTransition.tsx              Framer Motion page wrapper
│   ├── ScrollReveal.tsx                Scroll-triggered fade-in (IntersectionObserver)
│   ├── ErrorBoundary.tsx               React error boundary with retry
│   ├── ErrorBoundaryWrapper.tsx        Client wrapper for error boundary
│   ├── SkeletonLoader.tsx              Page/Chat/Result skeleton states
│   └── ServiceWorkerRegistrar.tsx      SW registration on mount
├── hooks/
│   ├── useSession.ts                   sessionStorage-backed session state
│   ├── usePayment.ts                   Razorpay script loader + payment flow
│   ├── useLocale.ts                    EN/HI language state + translator
│   ├── useTheme.ts                     Dark/light theme state + DOM toggle
│   ├── useVoiceInput.ts                Web Speech API wrapper
│   └── useInstallPrompt.ts             beforeinstallprompt handler
├── lib/
│   ├── constants.ts                    Questions, system prompt, pricing, crisis resources
│   ├── claudeClient.ts                 Anthropic SDK wrapper
│   ├── razorpay.ts                     Razorpay SDK wrapper (timing-safe verify)
│   ├── abuseClassifier.ts              80+ pattern classifier (crisis + borderline)
│   ├── i18n.ts                         EN + HI translations (80+ keys)
│   ├── analytics.ts                    PostHog init + 19 event constants
│   ├── rateLimit.ts                    In-memory rate limiter
│   ├── therapists.ts                   Therapist directory data (7 cities)
│   └── utils.ts                        cn() utility (clsx + tailwind-merge)
├── types/
│   └── index.ts                        All TypeScript interfaces
├── public/
│   ├── manifest.json                   PWA manifest
│   ├── sw.js                           Service worker (network-first + SWR)
│   └── icons/                          PWA icons
├── .env.local.example                  Environment variable template
├── tailwind.config.ts                  Design system (colors, animations, radii)
├── tsconfig.json                       TypeScript config
└── README.md                           This file
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

**Required:**

| Variable | Description |
|----------|-------------|
| `ANTHROPIC_API_KEY` | Anthropic API key for Claude |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (server-side) |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret (server-side) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID (client-side, for checkout.js) |

**Optional:**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project API key |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (default: `https://app.posthog.com`) |
| `SMTP_HOST` | SMTP server hostname |
| `SMTP_PORT` | SMTP port (default: 587) |
| `SMTP_SECURE` | Use TLS (default: false) |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From address (default: `AuthRelo <noreply@authrelo.com>`) |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> The landing page, chat flow, and crisis page work without any API keys. You need `ANTHROPIC_API_KEY` for analysis and `RAZORPAY_*` keys for payments.

---

## Deploy to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard → Settings → Environment Variables
4. Deploy

The app is Vercel-ready with zero configuration. All API routes run as serverless functions. The OG image route runs on Edge Runtime.

---

## Connect Razorpay

1. Create a [Razorpay account](https://razorpay.com)
2. Go to Dashboard → Settings → API Keys → Generate Key
3. Copy **Key ID** and **Key Secret**
4. Add to `.env.local`:
   ```
   RAZORPAY_KEY_ID=rzp_test_...
   RAZORPAY_KEY_SECRET=...
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_...
   ```
5. Enable UPI as a payment method in Razorpay Dashboard → Settings → Payment Methods
6. For production: switch from test keys to live keys and complete KYC

**Payment flow:**
- Client calls `/api/payment/create` → server creates Razorpay order (₹49 / 4900 paise)
- Razorpay checkout.js opens UPI modal on client
- On success, client sends signature to `/api/payment/verify` → server verifies with `crypto.timingSafeEqual`
- On verification success → redirect to `/result`

---

## Connect Anthropic API

1. Create an account at [console.anthropic.com](https://console.anthropic.com)
2. Go to API Keys → Create Key
3. Add to `.env.local`:
   ```
   ANTHROPIC_API_KEY=sk-ant-api03-...
   ```

**How the AI works:**
- Uses `claude-sonnet-4-5-20250514` with a strict system prompt
- Trained persona: relationship pattern analyst (attachment theory + Gottman + systemic family therapy)
- 10 strict rules including: never label people (only patterns), never use clinical terms, be aware of Indian context, quote user's exact words, return safety flag if danger detected
- Response format: structured JSON with `patternName`, `previewLine`, and 6 sections
- Separate prompt for couple mode that compares both partners' perspectives

---

## The AI Prompt

The system prompt enforces these rules:

1. Never use: narcissist, toxic, BPD, sociopath, manipulative, gaslighter, abuser
2. Never say partner is the problem
3. Never say user is the problem
4. Name the PATTERN — always the pattern, never the person
5. Quote user's exact words at least 3 times
6. 40% of content must validate before pivoting to user's role
7. Never suggest leaving the relationship
8. Be aware of Indian context (joint family, arranged vs love marriage, parental disapproval, premarital secrecy)
9. The action must be a specific sentence they can say — not advice, not a concept
10. If anything suggests physical danger → return `{ safetyFlag: true }`

---

## Safety Architecture

```
User types answer
       │
       ▼
┌─────────────────┐
│ Client-side      │
│ classifyText()   │
│ (80+ patterns)   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
 crisis   borderline
    │         │
    ▼         ▼
 /crisis   SafetyCheck
 (helplines) ("Are you safe?")
              │
         ┌────┴────┐
         │         │
       "Yes"     "No"
         │         │
         ▼         ▼
    Continue    /crisis
    session     (helplines)
         │
         ▼
┌─────────────────┐
│ Server-side      │
│ Claude analysis  │
│ (safetyFlag)     │
└────────┬────────┘
         │
    safetyFlag: true?
         │
         ▼
      /crisis
```

Crisis resources (India):
- **iCall** — 9152987821 (TISS psychosocial helpline)
- **Vandrevala Foundation** — 1860-2662-345 (24/7 mental health)
- **NCW Helpline** — 7827170170 (National Commission for Women)
- **iCall Chat** — icallhelpline.org (online counselling)

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#0D1117` (dark) / `#FAFAFA` (light) |
| Card | `#1a2332` (dark) / `#FFFFFF` (light) |
| Accent | `#F59E0B` (dark) / `#D97706` (light) |
| Text | `#F1F5F9` (dark) / `#1A1A1A` (light) |
| Font | DM Sans 400/500 |
| Card radius | 16px |
| Button radius | 14px |
| Pill radius | 12px |
| Min tap target | 44px |
| Max content width | 480px |

---

## Analytics Events

If PostHog is configured, these events are tracked:

| Event | When |
|-------|------|
| `landing_view` | Landing page loads |
| `session_start` | User clicks "Start" |
| `question_answered` | Each answer submitted (with step #) |
| `abuse_detected` | Safety classifier fires |
| `analysis_started` | Claude API called |
| `analysis_complete` | Claude response received |
| `paywall_view` | Paywall page loads |
| `payment_initiated` | User clicks pay button |
| `payment_success` | Razorpay confirms payment |
| `payment_failed` | Payment fails or cancelled |
| `result_view` | Result page loads |
| `result_shared` | User shares pattern |
| `feedback_given` | Thumbs up/down clicked |
| `couple_mode_start` | Couple session started |
| `referral_copied` | Referral link copied |
| `email_sent` | Reflection emailed |
| `voice_input_used` | Microphone used |
| `theme_toggled` | Dark/light switched |
| `language_changed` | EN/HI toggled |
| `pwa_installed` | App installed to home screen |

All analytics use `persistence: "memory"` — no cookies, no localStorage tracking. Privacy-first.

---

## Privacy

- **No database** — all state lives in `sessionStorage` (clears when tab closes)
- **No user accounts** — no login, no signup, no profile
- **No cookies** — analytics use memory-only persistence
- **No data retention** — answers are sent to Claude API and discarded. Nothing is stored server-side
- **API keys server-only** — `ANTHROPIC_API_KEY` and `RAZORPAY_KEY_SECRET` never reach the client
- **Email not stored** — if user opts to email their reflection, the email is sent and forgotten
- **Referral codes are client-generated** — no server-side tracking of referral state

---

## License

MIT

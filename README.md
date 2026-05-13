# AuthRelo

**Are you really listening — to yourself?**

AuthRelo is an anonymous AI-powered relationship self-reflection tool for young Indians (18–25). Users answer 5 questions about their relationship. The AI identifies the pattern they're stuck in and reflects it back — specifically, honestly, without judgment.

## Features

- **5-question guided session** — thoughtful questions rooted in relationship psychology
- **AI pattern analysis** — powered by Claude (attachment theory + Gottman's framework)
- **Abuse detection** — client-side safety classifier with crisis resources
- **Mobile-first PWA** — standalone app experience, 480px max-width
- **Fully anonymous** — no database, no auth, session-only state
- **Razorpay payments** — ₹49 one-time unlock via UPI

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-5)
- Razorpay for payments
- PWA enabled

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `RAZORPAY_KEY_ID` | Razorpay Key ID (server-side) |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret (server-side) |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay Key ID (client-side) |

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

## Connect Razorpay

1. Create a [Razorpay account](https://razorpay.com)
2. Get your Key ID and Key Secret from Dashboard → Settings → API Keys
3. Add both to your `.env.local` (and Vercel env vars for production)
4. Enable UPI as a payment method in your Razorpay dashboard

## Connect Anthropic API

1. Create an account at [console.anthropic.com](https://console.anthropic.com)
2. Generate an API key
3. Add it as `ANTHROPIC_API_KEY` in your environment

## Project Structure

```
app/
├── page.tsx                    Landing page
├── session/page.tsx            Chat flow (5 questions)
├── paywall/page.tsx            Blurred result + payment
├── result/page.tsx             Full reflection (post-payment)
├── crisis/page.tsx             Safety resources
└── api/
    ├── analyse/route.ts        Claude API call
    └── payment/
        ├── create/route.ts     Create Razorpay order
        └── verify/route.ts     Verify payment signature
components/                     Reusable UI components
hooks/                          useSession, usePayment
lib/                            Utilities, constants, API clients
types/                          TypeScript types
```

## Privacy

- No database — all state lives in `sessionStorage`
- Session clears on tab close
- No user data is persisted anywhere
- API keys are server-side only

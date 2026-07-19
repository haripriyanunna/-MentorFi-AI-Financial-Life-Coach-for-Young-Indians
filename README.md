# MentorFi-AI Financial Life Coach for Young Indians
##PROBLEM STATEMENT
India has 100M+ first-time earners (age 21–30), yet financial literacy remains alarmingly low. Most schools and colleges don't teach personal finance — budgeting, taxation, investing, credit, EMIs, or government schemes. The result: young earners fall into common traps early — lifestyle inflation, bad EMI decisions, zero emergency fund, delayed investing, and avoidable debt.
Existing finance apps assume you already know what to do. They track expenses or sell products but never teach. They're built for experienced earners, not someone staring at their first ₹30,000 salary wondering "what now?"

The gap: No judgment-free, beginner-first, India-specific financial guide that explains concepts in plain language and turns them into actionable plans.

##SOLUTION
MentorFi is an AI-powered financial life coach designed for first-time Indian earners. It doesn't just track — it teaches, analyzes, and guides. Users arrive knowing nothing and leave with a personalized budget, a goal plan, clarity on whether that EMI is a trap, and answers to their money questions — all in simple, relatable language.
Instead of selling financial products, MentorFi explains why decisions matter and how to think about them, then gives users tools to act on that knowledge.

##APP HIGHLIGHTS
###1)Budget Planner — 2-step wizard: enter salary + city + expenses → get a personalized 50/30/20 budget split with a donut chart, category breakdowns (Needs/Savings/Wants), and tailored tips. City-aware cost adjustments for 11 Indian cities.

###2)Goal Tracker — Create financial goals (emergency fund, bike, trip, education) with target amount, current savings, and monthly contribution. Visual progress bars + auto-calculated months-to-goal. Persists to Bolt Database — goals survive reloads.

###3)EMI Danger Detector — Input product cost, down payment, EMI, tenure, processing fee, and salary. The app computes total cost, total interest, effective interest rate, and the salary impact percentage, then flags it as Safe / Caution / Danger with a clear recommendation. Prevents young earners from signing bad EMI deals.

###4)Ask MentorFi (AI Chat) — Conversational AI mentor with 13 deep-dive knowledge areas:
First salary roadmap, SIPs & mutual funds, income tax & ITR, emergency funds, FD/RD vs mutual funds, stock market myths, GST, debt vs invest decisions, PPF, inflation, credit cards, government schemes (Jan Dhan, APY, EPF, PMSBY), 50-30-20 rule.
Pattern-matched responses with structured, markdown-formatted answers.
Chat history persists to Bolt Database — conversations continue across sessions.
## 🛠️ Technologies Used

| **Layer** | **Technology** |
|------------|----------------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS (Custom Animations, Glassmorphism, Mesh Gradients) |
| **Icons** | Lucide React |
| **Backend** | Supabase Edge Functions (Deno) |
| **Database** | PostgreSQL (via Supabase/Bolt) |
| **AI / Server Logic** | Bolt Database Edge Functions (Deno) |
| **Persistence** | Bolt Database with Row Level Security (RLS) |

##WORK FLOW
User lands on MentorFi
        │
        ▼
┌─────────────────────────────────────────────────┐
│  Landing Page — understands the problem         │
│  Clicks "Get Started Free"                      │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────┐
│  Budget Planner — enters salary + city + expenses│
│  → Gets personalized 50/30/20 budget + tips     │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────┐
│  Goal Tracker — creates goals (e.g. emergency   │
│  fund ₹90k, bike ₹1L) → Bolt Database persists them  │
│  → Sees progress bars + months-to-goal          │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────┐
│  EMI Detector — evaluating a phone/bike EMI     │
│  → App computes total interest + salary impact  │
│  → Flags Safe / Caution / Danger                │
└─────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────┐
│  Ask MentorFi — asks "What is a SIP?"           │
│  → Edge function returns structured answer      │
│  → Conversation saved to Bolt Database               │
└─────────────────────────────────────────────────┘

##SYSTEM ARCHITECTURE

┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                             │
│                                                                     │
│   ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│   │ Navigation  │  │ LandingPage │  │ BudgetPlan  │  │ EMI Det. │ │
│   │ Component   │  │ Component   │  │ Component   │  │ Component│ │
│   └─────────────┘  └─────────────┘  └─────────────┘  └──────────┘ │
│   ┌─────────────┐  ┌─────────────┐                                │
│   │ GoalTracker │  │   AIChat    │  ┌─────────────┐               │
│   │ Component   │  │ Component   │  │ KnowledgeHub│               │
│   └─────────────┘  └─────────────┘  └─────────────┘               │
│         │                │                                          │
│         ▼                ▼                                          │
│   ┌──────────────────────────────────┐                             │
│   │      src/lib/supabase.ts         │  ← Bolt Database JS client       │
│   │   (singleton instance + types)   │    (anon key auth)          │
│   └──────────────────────────────────┘                             │
│         │                          │                               │
└─────────┼──────────────────────────┼───────────────────────────────┘
          │                          │
          │ HTTPS (REST)             │ HTTPS (fetch)
          │ Bolt Database PostgREST       │ Edge Function invoke
          ▼                          ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     Database BACKEND                                │
│                                                                     │
│   ┌─────────────────────┐    ┌──────────────────────────────┐      │
│   │   PostgreSQL DB     │    │   Edge Functions (Deno)      │      │
│   │                     │    │                              │      │
│   │  ┌───────────────┐  │    │   ┌────────────────────────┐ │      │
│   │  │ goals         │  │    │   │   ai-mentor            │ │      │
│   │  ├───────────────┤  │    │   │                        │ │      │
│   │  │ chat_messages │  │    │   │  • Knowledge base      │ │      │
│   │  ├───────────────┤  │    │   │    (13 topics)         │ │      │
│   │  │ budget_plans  │  │    │   │  • Pattern matcher     │ │      │
│   │  ├───────────────┤  │    │   │  • Fallback handler    │ │      │
│   │  │ emi_analyses  │  │    │   │  • CORS middleware     │ │      │
│   │  └───────────────┘  │    │   └────────────────────────┘ │      │
│   │                     │    └──────────────────────────────┘      │
│   │  Row Level Security │                                           │
│   │  (RLS policies on   │                                           │
│   │   every table)      │                                           │
│   └─────────────────────┘                                           │
└─────────────────────────────────────────────────────────────────────┘

##FUTURE SCOPE
User authentication — migrate from single-tenant to multi-tenant ; schema already supports adding user_id + auth.uid() RLS policies
Recurring transaction tracking — new transactions table, auto-categorize into Needs/Savings/Wants, monthly cash-flow dashboard
Gamification — goal milestones (25/50/75/100%), savings streaks, "Financial Health Score" (0–100)
Multilingual support — Hindi, Tamil, Telugu, Bengali, Marathi interfaces + AI responses
Personalized AI insights — weekly generated insights from user's actual transaction + goal data ("Your emergency fund is at 1.2 months — target 3")
WhatsApp/Telegram bot — port AI mentor to where users already are; most young Indians use WhatsApp daily
Voice-first interface — Web Speech API for voice input/output, critical for lower-literacy users
Credit score education — CIBIL/Experian integration with consent, paired with credit card module

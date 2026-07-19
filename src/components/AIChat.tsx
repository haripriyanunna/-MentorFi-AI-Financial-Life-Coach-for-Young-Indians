import { useState, useRef, useEffect } from 'react';
import { Send, TrendingUp, User, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase, type ChatMessageRow } from '../lib/supabase';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const SESSION_ID = (() => {
  const stored = localStorage.getItem('mentorfi_session_id');
  if (stored) return stored;
  const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem('mentorfi_session_id', id);
  return id;
})();

const AI_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-mentor`;

const quickPrompts = [
  'I just got my first salary. What should I do?',
  'What is a SIP and should I invest in one?',
  'How does income tax work for salaried employees?',
  'Is an emergency fund really necessary?',
  'What is the difference between FD and mutual funds?',
  'How does the stock market work?',
  'What is GST and how does it affect me?',
  'Should I invest or pay off debt first?',
];

const knowledge: { patterns: string[]; response: string }[] = [
  {
    patterns: ['first salary', 'just got salary', 'new salary', 'first job', 'first paycheck'],
    response: `Congratulations on your first salary — this is genuinely a big moment!

Here's a simple framework to start:

**The 50-30-20 rule (adjusted for India):**
- **50% for Needs** — rent, food, travel, utilities, family support
- **20% for Savings** — emergency fund first, then investments like SIPs
- **30% for Wants** — entertainment, shopping, dining, personal care

**Your first three steps this month:**
1. Open a separate savings account — don't keep savings in your spending account
2. Start an emergency fund. Target: 3 months of expenses. Even ₹1,000/month is a start
3. Don't sign any EMI in your first month — understand your expenses first

**One thing most people get wrong:** Spending increases to match income. Automate your savings on salary day before you can spend it.

Want me to help you build a personalized budget for your salary?`,
  },
  {
    patterns: ['sip', 'systematic investment', 'mutual fund', 'what is sip'],
    response: `Great question — SIP is one of the most powerful tools for a first-time investor.

**What is a SIP?**
SIP stands for Systematic Investment Plan. You invest a fixed amount (as little as ₹500) every month into a mutual fund automatically.

**How it works:**
- You pick a mutual fund (a pool of stocks or bonds managed by experts)
- A fixed amount is debited from your account each month
- Over time, you buy more units when prices are low and fewer when prices are high — this is called **rupee cost averaging**

**Why it works for you:**
- No need to time the market
- Builds discipline automatically
- Historically, long-term SIPs in equity mutual funds have returned 10-15% annually (though past returns don't guarantee future returns)

**Example:** ₹3,000/month SIP for 5 years = ₹1.8 lakh invested. At 12% annual return, it could grow to ~₹2.4 lakh.

**Where to start:** Use SEBI-registered apps like Zerodha Coin, Groww, or Paytm Money. Look for index funds first — they are low cost and low risk relative to active funds.

*Important: I'm explaining the concept, not recommending specific funds. Please verify with a SEBI-registered advisor.*`,
  },
  {
    patterns: ['income tax', 'tax slab', 'tds', 'itr', 'tax return', 'file tax', 'income tax return'],
    response: `Income tax can seem scary — but the basics are actually quite simple.

**Do you need to file a return (ITR)?**
Yes, if your income exceeds ₹2.5 lakh per year (₹3 lakh under new regime). Most salaried employees earning above ₹30,000/month should file.

**Tax Slabs (New Regime FY 2024-25 — simplified):**
- Up to ₹3 lakh: No tax
- ₹3 lakh – ₹6 lakh: 5%
- ₹6 lakh – ₹9 lakh: 10%
- ₹9 lakh – ₹12 lakh: 15%
- Above ₹12 lakh: 20-30%

**Good news:** Under the new regime, income up to ₹7 lakh is effectively tax-free due to rebate under Section 87A.

**What is TDS?**
Your employer deducts Tax Deducted at Source before paying your salary. You can see this in Form 16 (given by employer) and Form 26AS (available on income tax portal).

**How to file:**
- Go to incometax.gov.in
- Use your PAN to register
- Deadline: July 31 each year

*Always verify tax information with the official income tax portal or a chartered accountant — tax laws change annually.*`,
  },
  {
    patterns: ['emergency fund', 'emergency savings', 'why save', 'rainy day'],
    response: `An emergency fund is the single most important financial safety net you can build. Here's why:

**What it is:** 3-6 months of your essential expenses kept in a liquid savings account — money you can access within 24 hours.

**Why it matters:**
- Job loss, medical emergency, or unexpected expense won't push you into debt
- Without it, you end up using credit cards or personal loans (at 24-36% interest) for emergencies
- It gives you the freedom to leave a bad job, negotiate better, or take risks

**How much to save:**
- Minimum: 3 months of essential expenses (rent + food + travel + utilities)
- Ideal: 6 months if you're the sole earner or in a volatile industry

**Where to keep it:**
- High-interest savings account (4-7% interest)
- Liquid mutual fund (slightly better returns, redeemable in 1 day)
- Do NOT invest in stocks or fixed FDs — you need it accessible

**How to build it:**
If your monthly expenses are ₹15,000, your target is ₹45,000–₹90,000. Saving ₹3,000/month gets you there in 15-30 months. Start now — even small amounts compound.`,
  },
  {
    patterns: ['fd', 'fixed deposit', 'recurring deposit', 'rd', 'difference between fd', 'fd vs'],
    response: `Let me break down these savings options clearly:

**Fixed Deposit (FD):**
- You deposit a lump sum for a fixed period (7 days to 10 years)
- Earn a guaranteed interest rate (currently ~6.5-7.5% in major banks)
- Cannot withdraw early without penalty
- Best for: Parking money you won't need for a defined period

**Recurring Deposit (RD):**
- You deposit a fixed amount every month (like a SIP but guaranteed)
- Similar interest rates to FDs
- Builds discipline — good for a specific goal in 1-3 years
- Best for: Saving toward a defined short-term goal

**Mutual Fund (via SIP):**
- Invests in the stock market or bonds
- Returns are NOT guaranteed — can be negative in bad years
- Historically 10-15% annually for equity funds over long periods
- Best for: Goals 5+ years away — wealth building, retirement

**Simple rule:**
- Emergency fund → High-interest savings account or liquid fund
- Short-term goals (1-3 years) → RD or FD
- Long-term goals (5+ years) → SIP in mutual funds

*PPF (Public Provident Fund) is another excellent option — government-backed, 7.1% guaranteed, tax-free — worth exploring once you have an emergency fund.*`,
  },
  {
    patterns: ['stock market', 'stocks', 'shares', 'equity', 'investing in stocks', 'is it gambling', 'gambling'],
    response: `This is one of the most common questions — and the honest answer might surprise you.

**The stock market is NOT gambling — but it can behave like it if you use it wrong.**

**What it actually is:**
When you buy a stock, you buy a small ownership stake in a real company. If the company grows and profits, your share's value increases. You're not betting — you're owning a piece of a business.

**Why it can feel like gambling:**
- Short-term prices are unpredictable (affected by news, emotion, global events)
- People buy individual stocks trying to "time" the market — that IS close to gambling
- Social media shows only the wins, not the losses

**How smart investors use it:**
- Buy index funds or diversified mutual funds (not individual stocks)
- Hold for 10+ years — time in the market beats timing the market
- Invest only what you won't need for 5-7 years
- Never invest borrowed money

**Historical fact:** The Sensex was at 1,000 in 1990. It's above 70,000 today. Long-term investors in diversified funds have consistently built wealth.

**My advice for a first-time earner:** Do NOT start with individual stocks. Start with an index fund SIP of ₹500-₹1,000/month. Learn as you go.`,
  },
  {
    patterns: ['gst', 'goods and services tax', 'what is gst'],
    response: `GST — Goods and Services Tax — is a tax you probably pay every day without realizing it.

**What it is:**
GST replaced India's complicated old tax system in 2017. It's a single tax applied to most goods and services you buy.

**How it affects you directly:**
- When you buy a ₹1,000 shirt, you might actually pay ₹1,120 — the extra ₹120 is GST (12% slab)
- Restaurant bill: 5% GST on food (18% if AC restaurant)
- Mobile phone: 18% GST included in the price
- Milk, eggs, vegetables: 0% GST (exempt)

**GST Slabs:**
- 0%: Essential food items, books, medical supplies
- 5%: Packaged food, restaurant (non-AC), transport
- 12%: Clothes above ₹1,000, processed food
- 18%: Most electronics, AC restaurants, financial services
- 28%: Luxury goods, cars, tobacco

**What this means for your budget:**
Your effective cost of living is higher than item prices suggest. When budgeting, GST is already included in retail prices — so you don't need to add it separately.

**As a salaried employee:** You don't file GST returns (that's for businesses). But if you do freelance work, you may need to register for GST if annual turnover exceeds ₹20 lakh.`,
  },
  {
    patterns: ['debt', 'pay off debt', 'loan vs invest', 'should i invest or pay', 'emi vs invest'],
    response: `This is one of the most nuanced financial decisions — and the answer depends on interest rates.

**The core principle:**
If your debt interest rate > expected investment return → Pay off debt first.
If your debt interest rate < expected investment return → Invest while paying debt.

**In practice for India:**

**Always pay these off first (high interest):**
- Credit card debt: 24-42% interest — no investment beats this
- Personal loans: 12-24% — pay aggressively
- Buy Now Pay Later: Often 18-36% effectively

**Can invest while paying these (low interest):**
- Home loan: 8-9% interest vs. equity mutual funds historically returning 12-15% — investing makes sense here
- Education loan: 9-12% — a balanced approach works

**The emergency fund exception:**
Even with debt, always keep a small emergency buffer (₹10,000-₹25,000). Without it, any surprise expense becomes more credit card debt.

**Practical approach:**
1. Minimum payments on all debt
2. Build ₹10,000 emergency buffer
3. Pay off highest-interest debt aggressively
4. Once high-interest debt is gone, start investing

*This is general guidance. Your specific situation matters — speak to a financial advisor for personalized advice.*`,
  },
  {
    patterns: ['union budget', 'budget 2024', 'government budget', 'what is budget'],
    response: `The Union Budget — and why it actually matters for your salary.

**What is the Union Budget?**
Every year (usually February 1), India's Finance Minister presents the Union Budget — the government's plan for how it will earn and spend money for the year.

**How it directly affects you:**

**Tax changes:** Budget announcements change income tax slabs, deductions, and rates. The Budget can put more money in your pocket or take some away — that's why everyone watches it.

**Inflation and prices:** Government spending decisions affect inflation, which affects what your savings are actually worth over time.

**Key things to watch:**
- Changes to income tax slabs or standard deduction
- Changes to Section 80C investment limits
- Changes to home loan interest deductions
- New government schemes for youth or housing

**Recent impact (Budget 2024):** The standard deduction increased to ₹75,000 from ₹50,000 under the new tax regime — saving salaried employees up to ₹7,500 in taxes.

**How to stay informed:**
- Watch the Budget speech live on DD News (it's free)
- Read the "Budget impact on salary" summaries published by economic newspapers on February 2nd

*Tax policies change annually — verify any tax-related action with incometax.gov.in or a CA.*`,
  },
  {
    patterns: ['ppf', 'public provident fund', 'what is ppf'],
    response: `PPF is one of the best-kept secrets for young Indian investors. Here's why.

**What is PPF?**
Public Provident Fund is a government-backed savings scheme. It's one of the safest long-term investments in India.

**Key features:**
- **Interest rate:** 7.1% per year (set by government, revised quarterly)
- **Tax benefits:** Contributions up to ₹1.5 lakh qualify for Section 80C deduction
- **Returns:** Completely tax-free — you pay zero tax on the interest earned
- **Lock-in:** 15 years (with partial withdrawal allowed after 7 years)
- **Minimum:** ₹500/year | Maximum: ₹1.5 lakh/year
- **Safety:** Backed by Government of India — cannot default

**Who should use PPF:**
- Anyone in the 20-30% tax bracket
- Long-term savers (retirement, child education fund)
- People who want guaranteed, safe returns with tax benefits

**Where to open:** Any nationalized bank (SBI, Bank of India, etc.) or post office. Also available online through internet banking.

**PPF vs FD vs SIP:**
- PPF wins on safety and tax benefits
- SIP wins on potential returns over 15+ years (but not guaranteed)
- FD wins on liquidity

Start a PPF account with just ₹500. You can increase later.`,
  },
  {
    patterns: ['bank account', 'types of account', 'savings account', 'current account', 'how bank works'],
    response: `Banking basics — things most people figure out the hard way.

**Main types of bank accounts:**

**Savings Account:**
- For personal use — salaries, daily expenses
- Earns 2.5-7% interest (varies by bank)
- Ideal for: Your emergency fund and daily spending
- Tip: Look for zero-balance accounts to avoid penalties

**Current Account:**
- For businesses — high transaction limits
- Usually earns no interest
- You don't need this as a salaried employee

**Fixed Deposit (FD):**
- Lock money for a fixed period at higher interest (6-7.5%)
- Penalty for early withdrawal

**Recurring Deposit (RD):**
- Monthly contributions at fixed interest
- Great for disciplined saving toward a goal

**Important concepts:**

**NEFT/IMPS/RTGS:** Ways to transfer money between banks. IMPS is instant 24/7. NEFT is batch-processed.

**UPI:** Unified Payments Interface — this is what PhonePe, GPay, and Paytm use. Linked to your bank account, instant, free.

**KYC:** Know Your Customer — the bank verifying your identity with Aadhaar/PAN. Required for all accounts.

**CIBIL Score:** Your credit score (300-900). Higher is better. Affects loan eligibility and interest rates. Starting score = 0 (no history). Don't worry about it early on — just pay bills on time.`,
  },
  {
    patterns: ['inflation', 'what is inflation', 'why inflation matters', 'prices going up'],
    response: `Inflation is something every young earner needs to understand — it's quietly affecting your money right now.

**What is inflation?**
Inflation is the gradual increase in prices over time. If inflation is 6% annually, something that costs ₹1,000 today will cost ₹1,060 next year.

**Why it matters for your savings:**
If your savings account earns 4% interest but inflation is 6%, your money is actually LOSING value at 2% per year. This is called negative real returns.

**Example:**
- You save ₹1,00,000 in a jar at home
- In 10 years with 6% inflation, it has the purchasing power of only ~₹56,000
- This is why keeping cash is not "safe"

**How to beat inflation:**
- Equity mutual funds historically beat inflation (10-15% returns vs 6% inflation)
- PPF at 7.1% roughly keeps pace with inflation, tax-free
- FD at 6-7% barely beats inflation — not ideal for long-term wealth

**India-specific note:**
India's average CPI inflation has been around 5-7% over the past decade. This means your salary must grow by at least 5-7% yearly just to maintain your standard of living.

**Practical takeaway:** Never leave large amounts of money in a savings account or cash for more than 3-6 months. Money that isn't growing is shrinking.`,
  },
  {
    patterns: ['how much to save', 'save percent', 'how much save salary', 'saving rule', '50 30 20'],
    response: `How much should you save? There's no one-size answer, but here's a realistic framework.

**The classic 50-30-20 rule:**
- **50%** → Needs (rent, food, travel, utilities, family support)
- **30%** → Wants (dining out, entertainment, shopping)
- **20%** → Savings and investments

**For early-career Indians, I'd adjust this to:**
- **50-55%** → Needs (cost of living in Indian cities is high)
- **20-25%** → Savings (prioritize this)
- **20-25%** → Wants

**Minimum savings benchmarks:**
- Emergency fund: Target 3x monthly expenses before anything else
- SIP: ₹500/month minimum to start the habit
- Total savings: At least 15% of take-home, ideally 20%

**What if I can't save 20%?**
Start with whatever is possible — even ₹500/month. The habit matters more than the amount in your first year. As your salary grows, increase savings before increasing lifestyle.

**One powerful trick:**
Automate savings on salary day. Set up a standing instruction to transfer to savings account before you see the money. What you don't see, you don't spend.

Want me to build a budget plan based on your specific salary?`,
  },
  {
    patterns: ['credit card', 'should i get credit card', 'credit card good or bad'],
    response: `Credit cards — one of the most misunderstood financial tools in India.

**Are credit cards good or bad?**
Neither — they're a tool. Like a knife, they're useful when used correctly and dangerous when misused.

**The right way to use a credit card:**
- Use it like a debit card — only spend what you already have in your bank
- Pay the FULL balance every month, never the minimum
- Use the reward points/cashback as a bonus — not as justification to spend more
- Keep utilization below 30% of your credit limit

**When a credit card becomes dangerous:**
- You start paying only the minimum due
- Interest kicks in at 36-42% per year — the highest legal interest rate in India
- ₹10,000 credit card debt can become ₹25,000+ in 2 years if you only pay minimums

**Benefits when used correctly:**
- Builds your CIBIL credit score (helps get home/car loans later)
- Fraud protection (easier to dispute than debit card)
- Cashback and reward points (effectively a 1-5% discount)
- 45-day interest-free credit period

**My advice for first-time earners:**
Get a basic, no-fee credit card after 6 months of stable salary. Use it only for fixed monthly expenses (phone bill, groceries). Pay in full on the due date. Never miss a payment.`,
  },
  {
    patterns: ['government scheme', 'schemes for youth', 'government benefit', 'pm scheme', 'jan dhan', 'atal pension', 'pmjdy'],
    response: `There are several government schemes specifically useful for young earners — most people never claim them.

**Key schemes for first-time earners:**

**Jan Dhan Yojana (PMJDY):**
- Zero-balance savings account with free RuPay debit card
- ₹2 lakh accident insurance included
- For those without bank accounts — still relevant for family members

**Atal Pension Yojana (APY):**
- Government-backed pension for unorganized sector / freelancers
- Contribute ₹100-₹1,500/month based on age and desired pension
- Government co-contributes for lower income groups
- Great for those without EPF (Employees' Provident Fund)

**EPF — Employees' Provident Fund:**
- If your employer has 20+ employees, EPF is mandatory
- 12% of basic salary is deducted + employer contributes 12% too
- Tax-free on maturity — essentially forced long-term savings
- Check your EPF balance on epfindia.gov.in using your UAN number

**PM SVANidhi (for freelancers/small vendors):**
- Micro-credit for street vendors and small business owners

**Startup India / MSME schemes:**
- For those looking to start a business — check startupindia.gov.in

**Pradhan Mantri Suraksha Bima Yojana (PMSBY):**
- Accident insurance: ₹2 lakh coverage for just ₹20/year
- Enroll through your bank account — most people miss this

*Verify all scheme eligibility and current status at india.gov.in*`,
  },
];

const fallbackResponses = [
  `That's a thoughtful question. Financial literacy is a journey, and no question is too basic here.

While I want to give you the most accurate information, this specific topic might require more context. Could you tell me a bit more about what you're trying to understand or decide?

Some things that might help me help you better:
- What is your current situation (student, fresher, employed)?
- Is this about saving, spending, investing, or something else?
- What specifically are you unsure about?

You can also browse the Knowledge Hub for structured explanations on common topics like SIPs, tax, EMIs, and government schemes.`,

  `Great question — and the fact that you're asking it means you're ahead of most people your age.

I want to make sure I give you an accurate answer rather than guess. Could you rephrase or add more context?

For example:
- Are you asking about a specific product (like a mutual fund or loan)?
- Is this related to tax, savings, budgeting, or investing?

MentorFi is always here — no question is too simple or too embarrassing.`,
];

function getResponse(message: string): string {
  const lower = message.toLowerCase();
  for (const item of knowledge) {
    if (item.patterns.some(p => lower.includes(p))) {
      return item.response;
    }
  }
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

async function fetchAIResponse(message: string): Promise<string> {
  try {
    const res = await fetch(AI_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ message }),
    });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    const data = await res.json();
    if (typeof data?.reply !== 'string' || !data.reply) {
      throw new Error('Unexpected response shape');
    }
    return data.reply;
  } catch {
    return getResponse(message);
  }
}

function formatMessage(text: string) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    if (line.startsWith('**') && line.endsWith('**')) {
      return <div key={i} className="font-bold text-white mt-3 mb-1">{line.replace(/\*\*/g, '')}</div>;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const formatted = parts.map((part, j) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={j} className="text-sky-300 font-semibold">{part.replace(/\*\*/g, '')}</strong>;
      }
      return <span key={j}>{part}</span>;
    });
    if (line.startsWith('- ')) {
      return <div key={i} className="flex items-start gap-2 ml-2 mt-1"><span className="text-sky-400 mt-1">•</span><span>{formatted.slice(1)}{formatted[0]}</span></div>;
    }
    if (line.trim() === '') return <div key={i} className="h-2" />;
    return <div key={i} className="leading-relaxed">{formatted}</div>;
  });
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessage = (): Message => ({
    id: 'welcome',
    role: 'assistant',
    text: `Hello! I'm MentorFi, your AI financial life coach.

I'm here to help you understand money — budgeting, saving, investing, EMIs, taxes, government schemes, and more. No question is too basic. No judgment here.

**What's on your mind today?**

You can ask me things like:
- "I just got my first salary of ₹35,000. What should I do?"
- "What is a SIP and should I start one?"
- "Is this phone EMI offer a good deal?"
- "How does income tax work for me?"`,
    timestamp: new Date(),
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error: err } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', SESSION_ID)
        .order('created_at', { ascending: true });
      if (cancelled) return;
      if (err) {
        setError(err.message);
        setMessages([welcomeMessage()]);
      } else if (data && (data as ChatMessageRow[]).length > 0) {
        const history: Message[] = (data as ChatMessageRow[]).map(r => ({
          id: r.id,
          role: r.role,
          text: r.text,
          timestamp: new Date(r.created_at),
        }));
        setMessages(history);
      } else {
        setMessages([welcomeMessage()]);
      }
      setHistoryLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const persistMessage = async (role: 'user' | 'assistant', text: string) => {
    await supabase
      .from('chat_messages')
      .insert({ session_id: SESSION_ID, role, text });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    persistMessage('user', userMsg.text);

    const reply = await fetchAIResponse(userMsg.text);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      text: reply,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
    persistMessage('assistant', reply);
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const resetChat = async () => {
    await supabase.from('chat_messages').delete().eq('session_id', SESSION_ID);
    setMessages([welcomeMessage()]);
    setError(null);
  };

  return (
    <div className="h-full bg-slate-950 flex flex-col">
      {/* Sub-header */}
      <div className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-3">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">MentorFi AI — Judgment-free financial guidance</span>
          </div>
          <button
            onClick={resetChat}
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            New chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {error && (
            <div className="max-w-3xl mx-auto mb-4 flex items-start gap-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
          {historyLoading ? (
            <div className="text-center text-slate-500 text-sm py-12">Loading your conversation…</div>
          ) : (
            <>
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 chat-message ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                msg.role === 'assistant'
                  ? 'bg-gradient-to-br from-sky-500 to-teal-500'
                  : 'bg-slate-700'
              }`}>
                {msg.role === 'assistant'
                  ? <TrendingUp className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-slate-300" />
                }
              </div>
              <div className={`max-w-2xl ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-sky-500/20 border border-sky-500/30 text-slate-200 rounded-tr-none'
                    : 'bg-slate-800/60 border border-slate-700/50 text-slate-300 rounded-tl-none'
                }`}>
                  {msg.role === 'assistant'
                    ? <div className="space-y-0.5">{formatMessage(msg.text)}</div>
                    : msg.text
                  }
                </div>
                <div className="text-slate-600 text-xs mt-1.5 px-1">
                  {msg.timestamp.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 chat-message">
              <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl rounded-tl-none px-5 py-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Quick prompts */}
      {!historyLoading && messages.length <= 2 && (
        <div className="px-4 pb-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs px-3 py-1.5 border border-slate-700 text-slate-400 rounded-full hover:border-sky-500/50 hover:text-sky-400 hover:bg-sky-500/5 transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything about money, savings, taxes, investments..."
              className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors text-sm"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl disabled:opacity-40 hover:from-sky-400 hover:to-teal-400 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-xs text-slate-600 text-center mt-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            MentorFi educates — always verify financial decisions with a qualified advisor
          </p>
        </div>
      </div>
    </div>
  );
}

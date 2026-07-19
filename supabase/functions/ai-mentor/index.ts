import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface KnowledgeEntry {
  patterns: string[];
  response: string;
}

const knowledge: KnowledgeEntry[] = [
  {
    patterns: ["first salary", "just got salary", "new salary", "first job", "first paycheck"],
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
    patterns: ["sip", "systematic investment", "mutual fund", "what is sip"],
    response: `Great question — SIP is one of the most powerful tools for a first-time investor.

**What is a SIP?**
SIP stands for Systematic Investment Plan. You invest a fixed amount (as little as ₹500) every month into a mutual fund automatically.

**How it works:**
- You pick a mutual fund (a pool of stocks or bonds managed by experts)
- A fixed amount is debited from your account each month
- Over time, you buy more units when prices are low and fewer when high — this is **rupee cost averaging**

**Why it works for you:**
- No need to time the market
- Builds discipline automatically
- Historically, long-term SIPs in equity mutual funds have returned 10-15% annually (past returns don't guarantee future)

**Example:** ₹3,000/month SIP for 5 years = ₹1.8 lakh invested. At 12% annual return, it could grow to ~₹2.4 lakh.

**Where to start:** SEBI-registered apps like Zerodha Coin, Groww, or Paytm Money. Look for index funds first — low cost, low risk relative to active funds.

*Important: I'm explaining the concept, not recommending specific funds. Please verify with a SEBI-registered advisor.*`,
  },
  {
    patterns: ["income tax", "tax slab", "tds", "itr", "tax return", "file tax", "income tax return"],
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
Your employer deducts Tax Deducted at Source before paying your salary. You can see this in Form 16 (given by employer) and Form 26AS (on the income tax portal).

**How to file:**
- Go to incometax.gov.in
- Use your PAN to register
- Deadline: July 31 each year

*Always verify tax information with the official income tax portal or a CA — tax laws change annually.*`,
  },
  {
    patterns: ["emergency fund", "emergency savings", "why save", "rainy day"],
    response: `An emergency fund is the single most important financial safety net you can build.

**What it is:** 3-6 months of your essential expenses kept in a liquid savings account — money you can access within 24 hours.

**Why it matters:**
- Job loss, medical emergency, or unexpected expense won't push you into debt
- Without it, you end up using credit cards or personal loans (at 24-36% interest)
- It gives you the freedom to leave a bad job or take risks

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
    patterns: ["fd", "fixed deposit", "recurring deposit", "rd", "difference between fd", "fd vs"],
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

**Mutual Fund (via SIP):**
- Invests in the stock market or bonds
- Returns are NOT guaranteed — can be negative in bad years
- Historically 10-15% annually for equity funds over long periods
- Best for: Goals 5+ years away — wealth building, retirement

**Simple rule:**
- Emergency fund → High-interest savings account or liquid fund
- Short-term goals (1-3 years) → RD or FD
- Long-term goals (5+ years) → SIP in mutual funds

*PPF (Public Provident Fund) is another excellent option — government-backed, 7.1% guaranteed, tax-free.*`,
  },
  {
    patterns: ["stock market", "stocks", "shares", "equity", "investing in stocks", "is it gambling", "gambling"],
    response: `This is one of the most common questions — and the honest answer might surprise you.

**The stock market is NOT gambling — but it can behave like it if you use it wrong.**

**What it actually is:**
When you buy a stock, you buy a small ownership stake in a real company. If the company grows and profits, your share's value increases. You're not betting — you're owning a piece of a business.

**Why it can feel like gambling:**
- Short-term prices are unpredictable
- People buy individual stocks trying to "time" the market — that IS close to gambling
- Social media shows only the wins, not the losses

**How smart investors use it:**
- Buy index funds or diversified mutual funds (not individual stocks)
- Hold for 10+ years — time in the market beats timing the market
- Invest only what you won't need for 5-7 years
- Never invest borrowed money

**Historical fact:** The Sensex was at 1,000 in 1990. It's above 70,000 today. Long-term investors in diversified funds have consistently built wealth.

**My advice for a first-time earner:** Do NOT start with individual stocks. Start with an index fund SIP of ₹500-₹1,000/month.`,
  },
  {
    patterns: ["gst", "goods and services tax", "what is gst"],
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

**As a salaried employee:** You don't file GST returns (that's for businesses). But if you do freelance work, you may need to register for GST if annual turnover exceeds ₹20 lakh.`,
  },
  {
    patterns: ["debt", "pay off debt", "loan vs invest", "should i invest or pay", "emi vs invest"],
    response: `This is one of the most nuanced financial decisions — and the answer depends on interest rates.

**The core principle:**
If your debt interest rate > expected investment return → Pay off debt first.
If your debt interest rate < expected investment return → Invest while paying debt.

**Always pay these off first (high interest):**
- Credit card debt: 24-42% interest — no investment beats this
- Personal loans: 12-24% — pay aggressively
- Buy Now Pay Later: Often 18-36% effectively

**Can invest while paying these (low interest):**
- Home loan: 8-9% interest vs. equity mutual funds historically returning 12-15%
- Education loan: 9-12% — a balanced approach works

**The emergency fund exception:**
Even with debt, always keep a small emergency buffer (₹10,000-₹25,000).

**Practical approach:**
1. Minimum payments on all debt
2. Build ₹10,000 emergency buffer
3. Pay off highest-interest debt aggressively
4. Once high-interest debt is gone, start investing

*This is general guidance. Speak to a financial advisor for personalized advice.*`,
  },
  {
    patterns: ["ppf", "public provident fund", "what is ppf"],
    response: `PPF is one of the best-kept secrets for young Indian investors.

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

Start a PPF account with just ₹500. You can increase later.`,
  },
  {
    patterns: ["inflation", "what is inflation", "why inflation matters", "prices going up"],
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

**Practical takeaway:** Never leave large amounts of money in a savings account or cash for more than 3-6 months. Money that isn't growing is shrinking.`,
  },
  {
    patterns: ["credit card", "should i get credit card", "credit card good or bad"],
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
Get a basic, no-fee credit card after 6 months of stable salary. Use it only for fixed monthly expenses (phone bill, groceries). Pay in full on the due date.`,
  },
  {
    patterns: ["government scheme", "schemes for youth", "government benefit", "pm scheme", "jan dhan", "atal pension", "pmjdy"],
    response: `There are several government schemes specifically useful for young earners — most people never claim them.

**Key schemes for first-time earners:**

**Jan Dhan Yojana (PMJDY):**
- Zero-balance savings account with free RuPay debit card
- ₹2 lakh accident insurance included

**Atal Pension Yojana (APY):**
- Government-backed pension for unorganized sector / freelancers
- Contribute ₹100-₹1,500/month based on age and desired pension

**EPF — Employees' Provident Fund:**
- If your employer has 20+ employees, EPF is mandatory
- 12% of basic salary is deducted + employer contributes 12% too
- Tax-free on maturity — essentially forced long-term savings
- Check your EPF balance on epfindia.gov.in using your UAN number

**Pradhan Mantri Suraksha Bima Yojana (PMSBY):**
- Accident insurance: ₹2 lakh coverage for just ₹20/year
- Enroll through your bank account — most people miss this

*Verify all scheme eligibility and current status at india.gov.in*`,
  },
  {
    patterns: ["how much to save", "save percent", "how much save salary", "saving rule", "50 30 20"],
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

**One powerful trick:**
Automate savings on salary day. Set up a standing instruction to transfer to savings before you see the money. What you don't see, you don't spend.

Want me to build a budget plan based on your specific salary?`,
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
    if (item.patterns.some((p) => lower.includes(p))) {
      return item.response;
    }
  }
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed. Use POST." }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.message !== "string") {
      return new Response(
        JSON.stringify({ error: "Request body must include a 'message' string." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const reply = getResponse(body.message);

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});

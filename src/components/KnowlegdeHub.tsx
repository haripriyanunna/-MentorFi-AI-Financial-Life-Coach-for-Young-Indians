import { useState } from 'react';
import {
  BookOpen, Search, ChevronRight, AlertCircle
} from 'lucide-react';

interface Topic {
  id: string;
  category: string;
  title: string;
  summary: string;
  content: string[];
  icon: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const topics: Topic[] = [
  {
    id: 'bank-basics',
    category: 'Banking',
    title: 'How Bank Accounts Work',
    summary: 'Understand savings, current, and FD accounts — and which one you need.',
    icon: '🏦',
    level: 'Beginner',
    content: [
      'A bank account is a safe place to store your money while earning interest on it. Banks use your deposits to lend to others and pay you interest in return.',
      'Savings Account: Your primary account for salary and daily use. Earns 2.5–7% interest annually. Keep at least the minimum balance (or use zero-balance accounts).',
      'Current Account: For businesses needing many daily transactions. Usually earns no interest. You don\'t need this as a salaried individual.',
      'Fixed Deposit (FD): Lock your money for a fixed period at a guaranteed higher rate (6–7.5%). Best for money you won\'t need for 3–12 months.',
      'Recurring Deposit (RD): Deposit a fixed monthly amount at a guaranteed rate. Perfect for disciplined saving toward a short-term goal.',
      'Key tip: Open a second savings account just for savings and never use it for daily spending. This simple trick dramatically improves savings discipline.',
    ],
  },
  {
    id: 'sip',
    category: 'Investing',
    title: 'SIPs: The Beginner\'s Best Friend',
    summary: 'What a SIP is, how it works, and why ₹500/month can change your life.',
    icon: '📈',
    level: 'Beginner',
    content: [
      'SIP stands for Systematic Investment Plan. It means investing a fixed amount into a mutual fund every month — automatically, on a set date.',
      'Mutual funds pool money from thousands of investors and invest in stocks, bonds, or both. Professional fund managers handle the investment decisions.',
      'Rupee Cost Averaging: When the market is low, your SIP buys more units. When it is high, it buys fewer. Over time, this averages out your purchase cost — you benefit from market volatility.',
      'Power of compounding: ₹3,000/month for 20 years at 12% annual return grows to approximately ₹30 lakh — from just ₹7.2 lakh invested.',
      'Types of mutual funds: Equity (stocks, high risk/return), Debt (bonds, low risk/return), and Hybrid (mix of both). For beginners, start with index funds.',
      'Where to start: SEBI-regulated apps like Zerodha Coin, Groww, or Paytm Money. Minimum SIP: ₹500/month. Always check the fund\'s expense ratio — lower is better.',
      'Important: Mutual fund investments are subject to market risk. Do not invest money you might need in the next 5 years in equity SIPs.',
    ],
  },
  {
    id: 'income-tax',
    category: 'Taxes',
    title: 'Income Tax Made Simple',
    summary: 'Tax slabs, TDS, ITR filing — everything a salaried person needs to know.',
    icon: '📋',
    level: 'Beginner',
    content: [
      'Income tax is a portion of your income you pay to the government. In India, the rate you pay depends on how much you earn — this is the "progressive" system.',
      'New Tax Regime (FY 2024-25): 0% up to ₹3 lakh → 5% for ₹3–6 lakh → 10% for ₹6–9 lakh → 15% for ₹9–12 lakh → 20% for ₹12–15 lakh → 30% above ₹15 lakh.',
      'Rebate u/s 87A: If your income is below ₹7 lakh, you get a full tax rebate under the new regime — effectively paying ZERO tax.',
      'TDS (Tax Deducted at Source): Your employer automatically deducts estimated tax from your salary each month. You can see this in your payslip.',
      'Form 16: Your employer gives you this certificate in June showing total salary paid and TDS deducted. Essential for filing your ITR.',
      'ITR (Income Tax Return): Your annual tax declaration filed at incometax.gov.in. Deadline: July 31. Filing is mandatory if income exceeds ₹2.5 lakh (old regime) or ₹3 lakh (new regime).',
      'Standard Deduction: Under the new regime, ₹75,000 is automatically deducted from your taxable salary — you don\'t need to claim anything.',
    ],
  },
  {
    id: 'stock-market',
    category: 'Investing',
    title: 'What the Stock Market Actually Is',
    summary: 'Understand equities, indexes, and why it is not gambling when done right.',
    icon: '📊',
    level: 'Intermediate',
    content: [
      'A stock represents partial ownership in a company. If you own 100 shares of Infosys, you own a tiny slice of that business.',
      'Stock exchanges (BSE and NSE in India) are marketplaces where buyers and sellers trade these ownership stakes. The Sensex and Nifty 50 are indexes — they measure the average performance of the top companies.',
      'Stock prices move based on company performance, economic conditions, global events, and investor sentiment — often in the short term, irrationally.',
      'Long-term investing is not gambling: The Sensex went from 1,000 in 1990 to 70,000+ today. Patient, diversified investors have consistently built wealth.',
      'Short-term trading IS closer to gambling: Predicting next week\'s price movement is nearly impossible. Most day traders lose money.',
      'Index investing: Instead of picking stocks, buy an index fund that tracks Nifty 50 or Sensex. You own a tiny piece of the 50 or 30 best companies in India. Low cost, diversified, and historically effective.',
      'For beginners: Start with a Nifty 50 index fund SIP. Never invest borrowed money in stocks. Never invest money you need within 5 years. Invest regularly and ignore short-term market noise.',
    ],
  },
  {
    id: 'ppf',
    category: 'Investing',
    title: 'PPF: Safe, Tax-Free Wealth Building',
    summary: 'Government-backed savings with triple tax benefit — perfect for long-term security.',
    icon: '🏛️',
    level: 'Beginner',
    content: [
      'Public Provident Fund (PPF) is a government-backed savings scheme available to all Indian citizens. It offers one of the safest ways to save long-term.',
      'Interest rate: Currently 7.1% per year, reviewed quarterly by the government. Guaranteed — unlike mutual funds.',
      'Triple tax benefit (EEE): Deposits up to ₹1.5 lakh per year qualify for Section 80C deduction. Interest earned is tax-free. Maturity amount is tax-free.',
      'Lock-in period: 15 years minimum. Partial withdrawals allowed after 7 years. Premature closure only in specific cases.',
      'Loan facility: You can take a loan against your PPF balance from year 3 to 6 — useful in emergencies without breaking the account.',
      'Where to open: Any nationalized bank (SBI, PNB, etc.) or post office. Online opening available through net banking.',
      'Who should use it: Anyone who wants guaranteed returns with tax benefits. Especially useful for those in the 20-30% tax bracket.',
    ],
  },
  {
    id: 'epf',
    category: 'Retirement',
    title: 'Understanding Your EPF',
    summary: 'Your employer is already saving for you — learn how to use it.',
    icon: '🧾',
    level: 'Beginner',
    content: [
      'EPF stands for Employees\' Provident Fund. If your company has 20+ employees, this is mandatory. 12% of your basic salary is deducted monthly, and your employer contributes another 12%.',
      'Your UAN (Universal Account Number) is your EPF identity. Activate it at epfindia.gov.in or the UMANG app to check your balance.',
      'Interest rate: Currently 8.25% per year — much higher than most savings accounts. Tax-free on maturity.',
      'On resignation: You can withdraw after 60 days of unemployment. However, keeping it invested is better — it earns interest and is not taxed.',
      'Transfer on job change: When you switch jobs, transfer your EPF to the new employer\'s trust using your UAN. Do not withdraw — you\'ll lose the compounding.',
      'Withdrawal for emergencies: You can make partial withdrawals for medical treatment, home purchase, or child\'s education — check the specific rules on epfindia.gov.in.',
      'Free life and disability insurance: All EPF members are covered under EDLI (Employees\' Deposit Linked Insurance) — up to ₹7 lakh at no cost to you.',
    ],
  },
  {
    id: 'gst',
    category: 'Taxes',
    title: 'GST and Your Daily Spending',
    summary: 'How Goods and Services Tax affects what you buy every day.',
    icon: '🧾',
    level: 'Beginner',
    content: [
      'GST (Goods and Services Tax) replaced India\'s complex tax system in 2017 with a single national tax on most goods and services.',
      'GST slabs: 0% (essential food, medicine), 5% (basic food items, transport), 12% (processed food, clothes >₹1,000), 18% (electronics, AC restaurants, most services), 28% (luxury goods, cars).',
      'What this means for you: When you buy a phone for ₹15,000, about ₹2,300 of that is GST (18%). The price you see at most stores already includes GST.',
      'Zero-rated items (no GST): Fresh vegetables, fruits, milk, eggs, bread, books, newspapers, and most medical supplies.',
      'Restaurant bills: Non-AC restaurant = 5% GST. AC restaurant = 18% GST. Look at your bill — the tax is itemized there.',
      'As a salaried employee: You do not file GST returns. GST is collected and paid by businesses, not individuals.',
      'If you freelance: If your annual freelance income exceeds ₹20 lakh (₹10 lakh in some states), you must register for GST. Below that threshold, no GST registration is required.',
    ],
  },
  {
    id: 'credit-score',
    category: 'Banking',
    title: 'Your CIBIL Score Explained',
    summary: 'How your credit history works and why it matters for loans and renting.',
    icon: '⭐',
    level: 'Intermediate',
    content: [
      'CIBIL score (officially called TransUnion CIBIL score) ranges from 300 to 900. It measures how reliably you repay debts.',
      '750+ = Excellent: You get the best loan interest rates and credit card approvals. Lenders see you as low risk.',
      '650–749 = Good: Loans are available but at slightly higher rates.',
      'Below 650 = Difficult: Most banks will reject loan applications or charge very high interest.',
      'No history (first-time borrowers) = 0 or -1: You have no score yet. This is normal and not bad. Build it gradually.',
      'What builds a good score: Pay all bills (credit card, EMIs) on time. Keep credit utilization below 30% of your limit. Do not apply for many loans at once.',
      'What damages your score: Missing payments (even by a day). Defaulting on loans. Applying for credit too frequently (hard enquiries).',
      'How to check: Once free per year at cibil.com. Paid subscription for frequent checks. Many banks offer free credit score checks in their apps.',
    ],
  },
  {
    id: 'inflation',
    category: 'Economics',
    title: 'Inflation: The Silent Wealth Thief',
    summary: 'Why your money is worth less every year — and what to do about it.',
    icon: '📉',
    level: 'Beginner',
    content: [
      'Inflation is the gradual increase in prices over time. When inflation is 6%, a ₹1,000 item today will cost ₹1,060 next year.',
      'Real returns = Investment return − Inflation rate. If your FD earns 6.5% and inflation is 6%, your real gain is only 0.5% — your money is barely growing.',
      'Rule of 72: Divide 72 by the annual inflation rate to find how long it takes for prices to double. At 6% inflation: 72/6 = 12 years. In 12 years, today\'s ₹50 loaf of bread might cost ₹100.',
      'India-specific: Average CPI inflation has been 5–7% over the past decade. Your salary must grow by at least this much per year just to maintain your standard of living.',
      'How to beat inflation: Equity mutual funds have historically returned 10–15% annually — well above inflation. Even PPF at 7.1% beats inflation modestly.',
      'Never store large amounts in cash: Cash earns 0% while inflation erodes its value. ₹1 lakh today may have the purchasing power of ₹56,000 in 10 years at 6% inflation.',
      'Practical tip: Always ask "what is the real return?" when comparing investments. An investment earning less than inflation is effectively losing you money.',
    ],
  },
  {
    id: 'emergency-fund',
    category: 'Savings',
    title: 'Building Your Emergency Fund',
    summary: 'The safety net that protects everything else you build.',
    icon: '🛡️',
    level: 'Beginner',
    content: [
      'An emergency fund is 3–6 months of essential expenses kept in a liquid, accessible account. It is your financial safety net for job loss, medical emergencies, or major repairs.',
      'Why it matters: Without one, any emergency forces you into high-interest debt (credit cards at 36%, personal loans at 18–24%). One emergency can undo months of financial progress.',
      'How much: Minimum 3 months of essential expenses (rent + food + travel + utilities). Ideal: 6 months if you support family or have a less stable income.',
      'Where to keep it: High-interest savings account (4–7%), liquid mutual fund (slightly higher, redeemable in 1 business day). Do NOT invest in stocks or long-term FDs.',
      'The single bank account trap: If you have emergency funds and spending money in the same account, you will spend the emergency fund. Keep them strictly separate.',
      'Building step by step: Even ₹1,000/month is progress. Start with a target of ₹10,000, then ₹25,000, then 1 month\'s expenses. Small wins compound into security.',
      'Once built: Do not touch it for non-emergencies. "Sale season" is not an emergency. Losing your job is. Medical bills are. A broken down vehicle stopping you from working is.',
    ],
  },
];

const categories = ['All', 'Banking', 'Investing', 'Taxes', 'Savings', 'Retirement', 'Economics'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function KnowledgeHub() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLevel, setActiveLevel] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = topics.filter(t => {
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.summary.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || t.category === activeCategory;
    const matchLevel = activeLevel === 'All' || t.level === activeLevel;
    return matchSearch && matchCat && matchLevel;
  });

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm mb-6">
            <BookOpen className="w-4 h-4" />
            Financial Knowledge Hub
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Learn without judgment
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Clear, honest explanations of money concepts that nobody taught you in school. Start anywhere — there is no wrong question.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6 animate-fade-in-up">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for a topic — SIP, tax, inflation, EMI..."
            className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-11 text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <div className="flex gap-1 flex-wrap">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === c
                    ? 'bg-violet-500/20 text-violet-400 border border-violet-500/40'
                    : 'text-slate-500 border border-slate-800 hover:text-slate-300 hover:border-slate-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            {levels.map(l => (
              <button
                key={l}
                onClick={() => setActiveLevel(l)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeLevel === l
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                    : 'text-slate-500 border border-slate-800 hover:text-slate-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Topics */}
        <div className="space-y-4">
          {filtered.length === 0 && (
            <div className="text-center py-16 text-slate-500">
              <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-50" />
              No topics match your search. Try the AI chat to ask any financial question.
            </div>
          )}
          {filtered.map(topic => (
            <div
              key={topic.id}
              className="glass rounded-2xl border border-slate-800 overflow-hidden card-hover"
            >
              <button
                className="w-full text-left p-6 flex items-start gap-4"
                onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
              >
                <div className="text-2xl shrink-0 mt-0.5">{topic.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-white font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {topic.title}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      topic.level === 'Beginner' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' :
                      topic.level === 'Intermediate' ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' :
                      'text-rose-400 border-rose-500/30 bg-rose-500/10'
                    }`}>
                      {topic.level}
                    </span>
                  </div>
                  <div className="text-slate-400 text-sm">{topic.summary}</div>
                  <div className="text-xs text-slate-600 mt-1">{topic.category}</div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${expandedId === topic.id ? 'rotate-90' : ''}`}
                />
              </button>

              {expandedId === topic.id && (
                <div className="px-6 pb-6 animate-fade-in">
                  <div className="border-t border-slate-800 pt-5">
                    <div className="space-y-4">
                      {topic.content.map((para, i) => {
                        const firstColon = para.indexOf(':');
                        if (firstColon > 0 && firstColon < 50 && !para.startsWith('http')) {
                          const label = para.slice(0, firstColon);
                          const rest = para.slice(firstColon + 1);
                          return (
                            <div key={i} className="flex items-start gap-3 text-sm">
                              <div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-2 shrink-0" />
                              <div>
                                <span className="text-violet-300 font-semibold">{label}:</span>
                                <span className="text-slate-300">{rest}</span>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div key={i} className="flex items-start gap-3 text-sm">
                            <div className="w-1.5 h-1.5 bg-slate-600 rounded-full mt-2 shrink-0" />
                            <span className="text-slate-300 leading-relaxed">{para}</span>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-5 pt-4 border-t border-slate-800 flex items-start gap-2 text-xs text-slate-600">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      This is educational content only. Verify specific numbers (tax rates, interest rates) with official government sources — they change regularly.
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

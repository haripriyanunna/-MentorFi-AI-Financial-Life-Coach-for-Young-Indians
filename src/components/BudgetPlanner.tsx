import { useState } from 'react';
import {
  IndianRupee, Home, Car, Utensils, Heart, Wallet,
  TrendingUp, AlertCircle, CheckCircle2, RefreshCw, ChevronRight
} from 'lucide-react';

const cities: { name: string; rentMultiplier: number; costIndex: number }[] = [
  { name: 'Mumbai', rentMultiplier: 1.8, costIndex: 1.7 },
  { name: 'Delhi / NCR', rentMultiplier: 1.5, costIndex: 1.5 },
  { name: 'Bangalore', rentMultiplier: 1.6, costIndex: 1.5 },
  { name: 'Hyderabad', rentMultiplier: 1.2, costIndex: 1.3 },
  { name: 'Pune', rentMultiplier: 1.3, costIndex: 1.3 },
  { name: 'Chennai', rentMultiplier: 1.2, costIndex: 1.3 },
  { name: 'Kolkata', rentMultiplier: 1.0, costIndex: 1.1 },
  { name: 'Ahmedabad', rentMultiplier: 0.9, costIndex: 1.0 },
  { name: 'Jaipur', rentMultiplier: 0.8, costIndex: 0.9 },
  { name: 'Lucknow', rentMultiplier: 0.7, costIndex: 0.85 },
  { name: 'Other City', rentMultiplier: 1.0, costIndex: 1.0 },
];

interface BudgetInput {
  salary: string;
  city: string;
  rent: string;
  travel: string;
  remittance: string;
  hasLoans: boolean;
  loanEmi: string;
}

interface BudgetResult {
  needs: { label: string; amount: number; icon: string }[];
  savings: { label: string; amount: number; icon: string }[];
  wants: { label: string; amount: number; icon: string }[];
  totalNeeds: number;
  totalSavings: number;
  totalWants: number;
  surplus: number;
  salary: number;
  tips: string[];
}

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function DonutChart({ segments }: { segments: { value: number; color: string; label: string }[] }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  const size = 200;
  const radius = 70;
  const strokeWidth = 28;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const paths = segments.map(seg => {
    const pct = seg.value / total;
    const dash = circumference * pct;
    const gap = circumference - dash;
    const strokeDashoffset = circumference - circumference * offset;
    offset += pct;
    return { ...seg, dash, gap, strokeDashoffset };
  });

  return (
    <div className="relative flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
        {paths.map((p, i) => (
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={p.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${p.dash} ${p.gap}`}
            strokeDashoffset={p.strokeDashoffset}
            className="donut-segment"
            strokeLinecap="round"
          />
        ))}
      </svg>
      <div className="absolute text-center">
        <div className="text-2xl font-bold text-white">{Math.round((segments[1]?.value / total) * 100) || 0}%</div>
        <div className="text-xs text-slate-400">Savings</div>
      </div>
    </div>
  );
}

function generateBudget(input: BudgetInput): BudgetResult | null {
  const salary = parseInt(input.salary);
  if (!salary || salary < 1000) return null;

  const rent = parseInt(input.rent) || 0;
  const travel = parseInt(input.travel) || 0;
  const remittance = parseInt(input.remittance) || 0;
  const loanEmi = input.hasLoans ? (parseInt(input.loanEmi) || 0) : 0;

  const city = cities.find(c => c.name === input.city) || cities[10];

  const food = Math.round(salary * 0.15 * city.costIndex);
  const utilities = Math.round(salary * 0.03);
  const totalNeeds = rent + travel + remittance + loanEmi + food + utilities;

  const targetSavings = Math.max(salary * 0.2, 1000);
  const emergencyFund = Math.round(targetSavings * 0.5);
  const sip = Math.round(targetSavings * 0.3);
  const ppf = Math.round(targetSavings * 0.2);
  const totalSavings = emergencyFund + sip + ppf;

  const totalWantsRaw = salary - totalNeeds - totalSavings;
  const entertainment = Math.round(totalWantsRaw * 0.35);
  const shopping = Math.round(totalWantsRaw * 0.35);
  const selfCare = totalWantsRaw - entertainment - shopping;
  const totalWants = Math.max(totalWantsRaw, 0);

  const surplus = salary - totalNeeds - totalSavings - totalWants;

  const tips: string[] = [];
  if (totalNeeds / salary > 0.6) tips.push('Your essential expenses are high. Consider shared accommodation or carpooling to reduce costs.');
  if (totalSavings / salary < 0.15) tips.push('Try to save at least 20% of your salary. Even ₹500/month compounding over years makes a big difference.');
  if (loanEmi > 0) tips.push('Pay off high-interest debt first before increasing investments. Check if prepaying loans saves more than SIPs currently.');
  if (rent / salary > 0.4) tips.push('Your rent is more than 40% of your salary. Experts suggest keeping it below 30%. Consider roommates.');
  if (remittance > 0) tips.push('Sending money home shows great responsibility. Ensure you still maintain a small personal emergency buffer.');
  if (tips.length === 0) tips.push('Great balance! You have a healthy salary-to-expense ratio. Focus on building your emergency fund first, then invest in SIPs.');

  return {
    needs: [
      { label: 'Rent / Housing', amount: rent, icon: '🏠' },
      { label: 'Food & Groceries', amount: food, icon: '🥗' },
      { label: 'Travel & Commute', amount: travel, icon: '🚌' },
      { label: 'Utilities & Phone', amount: utilities, icon: '📱' },
      ...(remittance > 0 ? [{ label: 'Money Sent Home', amount: remittance, icon: '💛' }] : []),
      ...(loanEmi > 0 ? [{ label: 'Loan EMI', amount: loanEmi, icon: '⚠️' }] : []),
    ],
    savings: [
      { label: 'Emergency Fund', amount: emergencyFund, icon: '🛡️' },
      { label: 'SIP / Mutual Fund', amount: sip, icon: '📈' },
      { label: 'PPF / RD', amount: ppf, icon: '🏦' },
    ],
    wants: [
      { label: 'Entertainment & Dining', amount: entertainment, icon: '🎬' },
      { label: 'Shopping & Personal', amount: shopping, icon: '🛍️' },
      { label: 'Self-care & Misc', amount: Math.max(selfCare, 0), icon: '✨' },
    ],
    totalNeeds,
    totalSavings,
    totalWants,
    surplus,
    salary,
    tips,
  };
}

export default function BudgetPlanner() {
  const [step, setStep] = useState(1);
  const [input, setInput] = useState<BudgetInput>({
    salary: '',
    city: 'Hyderabad',
    rent: '',
    travel: '',
    remittance: '',
    hasLoans: false,
    loanEmi: '',
  });
  const [result, setResult] = useState<BudgetResult | null>(null);

  const update = (key: keyof BudgetInput, value: string | boolean) => {
    setInput(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = () => {
    const r = generateBudget(input);
    if (r) {
      setResult(r);
      setStep(3);
    }
  };

  const reset = () => {
    setResult(null);
    setStep(1);
    setInput({ salary: '', city: 'Hyderabad', rent: '', travel: '', remittance: '', hasLoans: false, loanEmi: '' });
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm mb-6">
            <IndianRupee className="w-4 h-4" />
            Salary Budget Planner
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Make every rupee count
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Enter your details and get a personalized monthly budget — built for your actual life, not a textbook.
          </p>
        </div>

        {/* Progress */}
        {step < 3 && (
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map(s => (
              <div key={s} className="flex items-center gap-3 flex-1">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 transition-all ${step >= s ? 'bg-sky-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <div className={`text-sm font-medium ${step >= s ? 'text-white' : 'text-slate-500'}`}>
                  {s === 1 ? 'Income & City' : 'Expenses & Goals'}
                </div>
                {s < 2 && <div className={`h-px flex-1 ml-2 transition-all ${step > s ? 'bg-sky-500' : 'bg-slate-800'}`} />}
              </div>
            ))}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="glass rounded-2xl p-8 border border-slate-800 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Income & City</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Monthly take-home salary (after TDS) *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={input.salary}
                    onChange={e => update('salary', e.target.value)}
                    placeholder="32000"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-1.5">Enter the amount that actually hits your bank account each month.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Your city *</label>
                <select
                  value={input.city}
                  onChange={e => update('city', e.target.value)}
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 transition-colors"
                >
                  {cities.map(c => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1.5">We adjust cost estimates based on where you live.</p>
              </div>
            </div>
            <button
              onClick={() => parseInt(input.salary) > 0 && setStep(2)}
              disabled={!input.salary || parseInt(input.salary) < 1000}
              className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:from-sky-400 hover:to-teal-400 transition-all"
            >
              Next: Your Expenses <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="glass rounded-2xl p-8 border border-slate-800 animate-fade-in-up">
            <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Your Monthly Expenses</h2>
            <div className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Home className="w-4 h-4 text-sky-400" /> Monthly Rent
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input
                      type="number"
                      value={input.rent}
                      onChange={e => update('rent', e.target.value)}
                      placeholder="8000"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                    <Car className="w-4 h-4 text-teal-400" /> Travel / Commute
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input
                      type="number"
                      value={input.travel}
                      onChange={e => update('travel', e.target.value)}
                      placeholder="2000"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                  <Heart className="w-4 h-4 text-rose-400" /> Money sent home monthly (0 if none)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={input.remittance}
                    onChange={e => update('remittance', e.target.value)}
                    placeholder="0"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
                  <Wallet className="w-4 h-4 text-amber-400" /> Do you have any existing loans or EMIs?
                </label>
                <div className="flex gap-3">
                  {['Yes', 'No'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => update('hasLoans', opt === 'Yes')}
                      className={`px-6 py-2 rounded-lg text-sm font-medium border transition-all ${
                        (input.hasLoans && opt === 'Yes') || (!input.hasLoans && opt === 'No')
                          ? 'bg-sky-500/20 border-sky-500/50 text-sky-400'
                          : 'border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              {input.hasLoans && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-slate-300 mb-2">Total monthly EMI amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input
                      type="number"
                      value={input.loanEmi}
                      onChange={e => update('loanEmi', e.target.value)}
                      placeholder="3000"
                      className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-slate-700 text-slate-400 rounded-xl hover:border-slate-600 hover:text-white transition-all"
              >
                Back
              </button>
              <button
                onClick={handleGenerate}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl hover:from-sky-400 hover:to-teal-400 transition-all"
              >
                <TrendingUp className="w-5 h-5" />
                Generate My Budget Plan
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {step === 3 && result && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Summary bar */}
            <div className="glass rounded-2xl p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Your Monthly Budget
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">Based on your salary of {formatINR(result.salary)} in {input.city}</p>
                </div>
                <button onClick={reset} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
                  <RefreshCw className="w-4 h-4" /> Reset
                </button>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <DonutChart
                  segments={[
                    { value: result.totalNeeds, color: '#ef4444', label: 'Needs' },
                    { value: result.totalSavings, color: '#22c55e', label: 'Savings' },
                    { value: Math.max(result.totalWants, 0), color: '#3b82f6', label: 'Wants' },
                  ]}
                />
                <div className="flex-1 space-y-3">
                  {[
                    { label: 'Needs (Essential)', amount: result.totalNeeds, color: 'bg-red-500', pct: Math.round((result.totalNeeds / result.salary) * 100) },
                    { label: 'Savings & Investments', amount: result.totalSavings, color: 'bg-emerald-500', pct: Math.round((result.totalSavings / result.salary) * 100) },
                    { label: 'Wants (Personal)', amount: Math.max(result.totalWants, 0), color: 'bg-blue-500', pct: Math.max(Math.round((result.totalWants / result.salary) * 100), 0) },
                  ].map(({ label, amount, color, pct }) => (
                    <div key={label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-300">{label}</span>
                        <span className="text-white font-medium">{formatINR(amount)} <span className="text-slate-500">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full progress-bar`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {result.surplus < 0 && (
                <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-red-300 font-medium text-sm">Your expenses exceed your income</div>
                    <div className="text-slate-400 text-sm mt-1">You are short by {formatINR(Math.abs(result.surplus))}. See tips below for adjustments.</div>
                  </div>
                </div>
              )}
            </div>

            {/* Breakdown cards */}
            <div className="grid md:grid-cols-3 gap-5">
              {[
                { title: 'Essential Needs', items: result.needs, total: result.totalNeeds, color: 'border-red-500/30 bg-red-500/5', titleColor: 'text-red-400' },
                { title: 'Savings & Investments', items: result.savings, total: result.totalSavings, color: 'border-emerald-500/30 bg-emerald-500/5', titleColor: 'text-emerald-400' },
                { title: 'Personal Wants', items: result.wants.filter(w => w.amount > 0), total: Math.max(result.totalWants, 0), color: 'border-blue-500/30 bg-blue-500/5', titleColor: 'text-blue-400' },
              ].map(({ title, items, total, color, titleColor }) => (
                <div key={title} className={`rounded-2xl p-5 border ${color}`}>
                  <div className={`text-sm font-semibold ${titleColor} mb-4`}>{title}</div>
                  <div className="space-y-2.5">
                    {items.map(({ label, amount, icon }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-400 flex items-center gap-2">
                          <span>{icon}</span>{label}
                        </span>
                        <span className="text-white font-medium">{formatINR(amount)}</span>
                      </div>
                    ))}
                  </div>
                  <div className={`mt-4 pt-3 border-t border-slate-800 flex justify-between text-sm font-semibold`}>
                    <span className="text-slate-300">Total</span>
                    <span className="text-white">{formatINR(total)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="glass rounded-2xl p-6 border border-slate-800">
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Utensils className="w-5 h-5 text-amber-400" />
                MentorFi's Tips for You
              </h3>
              <div className="space-y-3">
                {result.tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 border-t border-slate-800 text-xs text-slate-500 flex items-start gap-2">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                MentorFi provides education and guidance, not certified financial advice. Verify important decisions with a qualified financial advisor.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

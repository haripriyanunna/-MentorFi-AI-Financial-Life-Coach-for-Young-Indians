import { useState } from 'react';
import {
  AlertTriangle, CheckCircle2, XCircle, Calculator,
  TrendingDown, Shield, RefreshCw, Info, Zap
} from 'lucide-react';

interface EMIResult {
  productCost: number;
  totalPayable: number;
  totalInterest: number;
  effectiveRate: number;
  monthlyEmi: number;
  months: number;
  salaryPct: number | null;
  riskLevel: 'low' | 'medium' | 'high' | 'danger';
  verdict: string;
  redFlags: string[];
  greenFlags: string[];
  advice: string;
}

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function analyzeEMI(
  productCost: number,
  downPayment: number,
  monthlyEmi: number,
  months: number,
  processingFee: number,
  salary: number | null
): EMIResult {
  const loanAmount = productCost - downPayment;
  const totalEmiPaid = monthlyEmi * months;
  const totalPayable = totalEmiPaid + downPayment + processingFee;
  const totalInterest = totalPayable - productCost;
  const effectiveRate = loanAmount > 0 ? ((totalInterest / loanAmount) / (months / 12)) * 100 : 0;

  const salaryPct = salary ? (monthlyEmi / salary) * 100 : null;

  const redFlags: string[] = [];
  const greenFlags: string[] = [];

  if (effectiveRate > 30) redFlags.push(`Very high effective interest rate: ${effectiveRate.toFixed(1)}% per year (credit card range)`);
  else if (effectiveRate > 20) redFlags.push(`High effective interest rate: ${effectiveRate.toFixed(1)}% per year — explore alternatives`);
  else if (effectiveRate > 12) redFlags.push(`Moderate interest rate: ${effectiveRate.toFixed(1)}% per year`);
  else greenFlags.push(`Reasonable effective rate: ${effectiveRate.toFixed(1)}% per year`);

  if (processingFee > 0) redFlags.push(`Processing/documentation fee: ${formatINR(processingFee)} — often hidden in "zero interest" schemes`);
  else greenFlags.push('No processing fee mentioned');

  if (salaryPct !== null) {
    if (salaryPct > 40) redFlags.push(`EMI is ${salaryPct.toFixed(0)}% of your salary — dangerously high. Experts recommend below 30%`);
    else if (salaryPct > 25) redFlags.push(`EMI is ${salaryPct.toFixed(0)}% of salary — manageable but leaves little room for savings`);
    else greenFlags.push(`EMI is ${salaryPct.toFixed(0)}% of salary — within manageable range`);
  }

  if (totalInterest / productCost > 0.3) redFlags.push(`You'll pay ${formatINR(totalInterest)} extra — that's ${Math.round((totalInterest / productCost) * 100)}% on top of the product price`);
  else if (totalInterest > 0) greenFlags.push(`Total interest: ${formatINR(totalInterest)} — relatively limited`);

  if (months > 24) redFlags.push('Long tenure (>24 months) means you pay more interest and stay in debt longer');
  else greenFlags.push('Short to moderate tenure — good practice');

  const riskScore = redFlags.length;
  let riskLevel: EMIResult['riskLevel'] = 'low';
  if (riskScore >= 4) riskLevel = 'danger';
  else if (riskScore >= 3) riskLevel = 'high';
  else if (riskScore >= 1) riskLevel = 'medium';

  let verdict = '';
  let advice = '';
  if (riskLevel === 'danger') {
    verdict = 'Do not take this EMI';
    advice = `This loan will cost you ${formatINR(totalInterest)} in interest alone. Consider saving ${formatINR(monthlyEmi)}/month for ${Math.ceil(loanAmount / monthlyEmi)} months to buy it outright — or find a product you can afford cash.`;
  } else if (riskLevel === 'high') {
    verdict = 'Proceed with caution';
    advice = `The real cost of this item is ${formatINR(totalPayable)}, not ${formatINR(productCost)}. If you can delay the purchase by 3-4 months and save aggressively, you may avoid interest entirely.`;
  } else if (riskLevel === 'medium') {
    verdict = 'Acceptable but understand the cost';
    advice = `The effective annual rate is ${effectiveRate.toFixed(1)}%. This is not "free" credit. Make sure you do not miss any EMI — late payments attract penalties and hurt your credit score.`;
  } else {
    verdict = 'This looks like a reasonable deal';
    advice = `The interest cost is relatively low. Make sure you have an emergency fund before committing, and never borrow for depreciating goods if you can avoid it.`;
  }

  return {
    productCost,
    totalPayable,
    totalInterest,
    effectiveRate,
    monthlyEmi,
    months,
    salaryPct,
    riskLevel,
    verdict,
    redFlags,
    greenFlags,
    advice,
  };
}

const riskConfig = {
  low: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2, label: 'Low Risk' },
  medium: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', icon: Info, label: 'Moderate Risk' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20', icon: AlertTriangle, label: 'High Risk' },
  danger: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', icon: XCircle, label: 'Danger — Avoid' },
};

export default function EMIDetector() {
  const [form, setForm] = useState({
    productCost: '',
    downPayment: '',
    monthlyEmi: '',
    months: '',
    processingFee: '',
    salary: '',
  });
  const [result, setResult] = useState<EMIResult | null>(null);

  const update = (key: string, val: string) => setForm(p => ({ ...p, [key]: val }));

  const analyze = () => {
    const r = analyzeEMI(
      parseInt(form.productCost) || 0,
      parseInt(form.downPayment) || 0,
      parseInt(form.monthlyEmi) || 0,
      parseInt(form.months) || 0,
      parseInt(form.processingFee) || 0,
      form.salary ? parseInt(form.salary) : null
    );
    setResult(r);
  };

  const reset = () => {
    setResult(null);
    setForm({ productCost: '', downPayment: '', monthlyEmi: '', months: '', processingFee: '', salary: '' });
  };

  const canAnalyze = form.productCost && form.monthlyEmi && form.months;

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm mb-6">
            <AlertTriangle className="w-4 h-4" />
            EMI & Loan Danger Detector
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Know the real cost before you sign
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Enter any EMI offer or BNPL deal. MentorFi reveals hidden costs, the true interest rate, and whether you can really afford it.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="glass rounded-2xl p-7 border border-slate-800 animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Calculator className="w-5 h-5 text-amber-400" />
              EMI Details
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Product / Loan amount *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input type="number" value={form.productCost} onChange={e => update('productCost', e.target.value)}
                    placeholder="50000" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Down payment</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input type="number" value={form.downPayment} onChange={e => update('downPayment', e.target.value)}
                      placeholder="5000" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Processing fee</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input type="number" value={form.processingFee} onChange={e => update('processingFee', e.target.value)}
                      placeholder="999" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Monthly EMI *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                    <input type="number" value={form.monthlyEmi} onChange={e => update('monthlyEmi', e.target.value)}
                      placeholder="2500" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tenure (months) *</label>
                  <input type="number" value={form.months} onChange={e => update('months', e.target.value)}
                    placeholder="24" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Your monthly salary <span className="text-slate-500">(optional, for affordability check)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input type="number" value={form.salary} onChange={e => update('salary', e.target.value)}
                    placeholder="30000" className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors" />
                </div>
              </div>
            </div>
            <button
              onClick={analyze}
              disabled={!canAnalyze}
              className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl disabled:opacity-40 hover:from-amber-400 hover:to-orange-400 transition-all"
            >
              <Zap className="w-5 h-5" />
              Analyze This EMI
            </button>
          </div>

          {/* Result panel */}
          {result ? (
            <div className="space-y-4 animate-fade-in-up">
              {/* Verdict */}
              {(() => {
                const cfg = riskConfig[result.riskLevel];
                const Icon = cfg.icon;
                return (
                  <div className={`rounded-2xl p-5 border ${cfg.bg}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className={`w-6 h-6 ${cfg.color}`} />
                      <div>
                        <div className={`text-lg font-bold ${cfg.color}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{result.verdict}</div>
                        <div className="text-xs text-slate-400">{cfg.label}</div>
                      </div>
                      <button onClick={reset} className="ml-auto text-slate-500 hover:text-white transition-colors">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{result.advice}</p>
                  </div>
                );
              })()}

              {/* Numbers */}
              <div className="glass rounded-2xl p-5 border border-slate-800">
                <h3 className="text-sm font-semibold text-slate-300 mb-4">Real Cost Breakdown</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Product price', value: formatINR(result.productCost), normal: true },
                    { label: 'Total EMI payments', value: formatINR(result.monthlyEmi * result.months), normal: true },
                    { label: 'Processing fee', value: result.monthlyEmi > 0 ? formatINR(parseInt(form.processingFee) || 0) : '₹0', normal: true },
                    { label: 'Total you actually pay', value: formatINR(result.totalPayable), highlight: true },
                    { label: 'Interest / extra cost', value: formatINR(result.totalInterest), danger: result.totalInterest > result.productCost * 0.2 },
                    { label: 'Effective annual rate', value: `${result.effectiveRate.toFixed(1)}%`, danger: result.effectiveRate > 20 },
                    ...(result.salaryPct !== null ? [{ label: 'EMI as % of salary', value: `${result.salaryPct.toFixed(0)}%`, danger: result.salaryPct > 30 }] : []),
                  ].map(({ label, value, highlight, danger }) => (
                    <div key={label} className={`flex justify-between text-sm py-2 border-b border-slate-800/50 last:border-0 ${highlight ? 'pt-3' : ''}`}>
                      <span className={`${highlight ? 'font-semibold text-white' : 'text-slate-400'}`}>{label}</span>
                      <span className={`font-semibold ${highlight ? 'text-white text-base' : danger ? 'text-red-400' : 'text-slate-200'}`}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Flags */}
              <div className="glass rounded-2xl p-5 border border-slate-800 space-y-3">
                {result.redFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{f}</span>
                  </div>
                ))}
                {result.greenFlags.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">{f}</span>
                  </div>
                ))}
              </div>

              <div className="text-xs text-slate-600 flex items-start gap-2 px-1">
                <Shield className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                MentorFi educates you about financial offers but does not provide certified financial advice. Always read loan agreements carefully.
              </div>
            </div>
          ) : (
            <div className="glass rounded-2xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center min-h-64">
              <AlertTriangle className="w-10 h-10 text-slate-700 mb-4" />
              <div className="text-slate-500 text-sm max-w-xs">
                Fill in the EMI details on the left and click Analyze. MentorFi will reveal the real cost before you commit.
              </div>
              <div className="mt-6 space-y-2 text-left w-full">
                {[
                  'Bajaj Finance phone — ₹50,000 cost, ₹2,500 EMI × 24 months',
                  'Amazon BNPL — ₹10,000 item, 0% interest but ₹999 fee',
                  'Two-wheeler loan — ₹80,000, ₹3,200 EMI × 36 months',
                ].map(eg => (
                  <div key={eg} className="text-xs text-slate-600 flex items-center gap-2">
                    <TrendingDown className="w-3 h-3 text-slate-700 shrink-0" />
                    {eg}
                  </div>
                ))}
                <div className="text-xs text-slate-600 mt-3">Try any of these examples above.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

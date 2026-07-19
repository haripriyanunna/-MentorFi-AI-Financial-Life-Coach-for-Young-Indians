import { useState, useEffect, useCallback } from 'react';
import {
  Target, Plus, Trash2, TrendingUp, Calendar, CheckCircle2,
  Wallet, MoreHorizontal
} from 'lucide-react';
import { supabase, type GoalRow } from '../lib/supabase';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  monthlySaving: number;
  icon: string;
  color: string;
}

function rowToGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    name: row.name,
    targetAmount: row.target_amount,
    savedAmount: row.saved_amount,
    monthlySaving: row.monthly_saving,
    icon: row.icon,
    color: row.color,
  };
}

const goalTemplates = [
  { name: 'Emergency Fund (3 months)', icon: '🛡️', amount: 90000, color: 'from-sky-500 to-blue-600' },
  { name: 'Buy a Bike', icon: '🏍️', amount: 100000, color: 'from-amber-500 to-orange-600' },
  { name: 'International Trip', icon: '✈️', amount: 80000, color: 'from-teal-500 to-emerald-600' },
  { name: 'Laptop Upgrade', icon: '💻', amount: 60000, color: 'from-violet-500 to-purple-600' },
  { name: 'Higher Education', icon: '🎓', amount: 300000, color: 'from-rose-500 to-pink-600' },
  { name: 'House Down Payment', icon: '🏠', amount: 500000, color: 'from-indigo-500 to-blue-700' },
];

function formatINR(amount: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

function GoalCard({ goal, onDelete, onUpdate }: {
  goal: Goal;
  onDelete: (id: string) => void;
  onUpdate: (id: string, saved: number) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [addAmount, setAddAmount] = useState('');

  const pct = Math.min((goal.savedAmount / goal.targetAmount) * 100, 100);
  const remaining = goal.targetAmount - goal.savedAmount;
  const monthsLeft = goal.monthlySaving > 0 ? Math.ceil(remaining / goal.monthlySaving) : null;

  const handleAdd = () => {
    const amt = parseInt(addAmount);
    if (amt > 0) {
      onUpdate(goal.id, Math.min(goal.savedAmount + amt, goal.targetAmount));
      setAddAmount('');
      setAdding(false);
    }
  };

  const isComplete = goal.savedAmount >= goal.targetAmount;

  return (
    <div className={`glass rounded-2xl p-6 border transition-all ${isComplete ? 'border-emerald-500/40' : 'border-slate-800'} card-hover`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center text-lg`}>
            {goal.icon}
          </div>
          <div>
            <div className="text-white font-semibold">{goal.name}</div>
            <div className="text-slate-400 text-sm">{formatINR(goal.targetAmount)} goal</div>
          </div>
        </div>
        <button onClick={() => onDelete(goal.id)} className="text-slate-600 hover:text-red-400 transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-slate-400">Progress</span>
          <span className={`font-semibold ${isComplete ? 'text-emerald-400' : 'text-white'}`}>
            {formatINR(goal.savedAmount)} / {formatINR(goal.targetAmount)}
          </span>
        </div>
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full progress-bar bg-gradient-to-r ${goal.color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-1.5">
          <span>{Math.round(pct)}% saved</span>
          <span>{formatINR(remaining)} remaining</span>
        </div>
      </div>

      {/* Status */}
      {isComplete ? (
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 rounded-lg px-3 py-2 border border-emerald-500/20">
          <CheckCircle2 className="w-4 h-4" />
          Goal Achieved! Congratulations!
        </div>
      ) : (
        <div className="flex items-center justify-between text-sm">
          <div className="text-slate-400">
            {monthsLeft !== null ? (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                ~{monthsLeft} month{monthsLeft !== 1 ? 's' : ''} at {formatINR(goal.monthlySaving)}/mo
              </span>
            ) : (
              <span>Set a monthly saving to track</span>
            )}
          </div>
          <button
            onClick={() => setAdding(!adding)}
            className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add savings
          </button>
        </div>
      )}

      {adding && (
        <div className="mt-3 flex gap-2 animate-fade-in">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">₹</span>
            <input
              type="number"
              value={addAmount}
              onChange={e => setAddAmount(e.target.value)}
              placeholder="Amount added"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 pl-7 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500"
              autoFocus
            />
          </div>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-400 transition-colors"
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
}

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    savedAmount: '',
    monthlySaving: '',
    icon: '🎯',
    color: 'from-sky-500 to-blue-600',
  });
  const [useTemplate, setUseTemplate] = useState(false);

  const loadGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('goals')
      .select('*')
      .order('created_at', { ascending: true });
    if (err) {
      setError(err.message);
    } else if (data) {
      setGoals((data as GoalRow[]).map(rowToGoal));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const addGoal = async () => {
    if (!form.name || !form.targetAmount) return;
    const payload = {
      name: form.name,
      target_amount: parseInt(form.targetAmount),
      saved_amount: parseInt(form.savedAmount) || 0,
      monthly_saving: parseInt(form.monthlySaving) || 0,
      icon: form.icon,
      color: form.color,
    };
    const { data, error: err } = await supabase
      .from('goals')
      .insert(payload)
      .select()
      .maybeSingle();
    if (err) {
      setError(err.message);
      return;
    }
    if (data) setGoals(prev => [...prev, rowToGoal(data as GoalRow)]);
    setForm({ name: '', targetAmount: '', savedAmount: '', monthlySaving: '', icon: '🎯', color: 'from-sky-500 to-blue-600' });
    setShowForm(false);
  };

  const deleteGoal = async (id: string) => {
    const { error: err } = await supabase.from('goals').delete().eq('id', id);
    if (err) { setError(err.message); return; }
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoal = async (id: string, saved: number) => {
    const { error: err } = await supabase
      .from('goals')
      .update({ saved_amount: saved })
      .eq('id', id);
    if (err) { setError(err.message); return; }
    setGoals(prev => prev.map(g => g.id === id ? { ...g, savedAmount: saved } : g));
  };

  const applyTemplate = (t: typeof goalTemplates[0]) => {
    setForm({
      name: t.name,
      targetAmount: t.amount.toString(),
      savedAmount: '',
      monthlySaving: '',
      icon: t.icon,
      color: t.color,
    });
    setUseTemplate(false);
  };

  const totalSaved = goals.reduce((s, g) => s + g.savedAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-6">
            <Target className="w-4 h-4" />
            Financial Goal Tracker
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Goals without a plan are just wishes
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Set a target, track your progress, and MentorFi shows you exactly how long it takes to get there.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm px-4 py-3">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-slate-500 text-sm">Loading your goals…</div>
        )}

        {/* Summary */}
        {!loading && goals.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Active Goals', value: goals.length.toString(), icon: Target },
              { label: 'Total Saved', value: formatINR(totalSaved), icon: Wallet },
              { label: 'Total Target', value: formatINR(totalTarget), icon: TrendingUp },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="glass rounded-xl p-4 border border-slate-800 text-center">
                <Icon className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</div>
                <div className="text-slate-500 text-xs">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Goals grid */}
        {!loading && goals.length > 0 && (
          <div className="grid md:grid-cols-2 gap-5 mb-6">
            {goals.map(goal => (
              <GoalCard key={goal.id} goal={goal} onDelete={deleteGoal} onUpdate={updateGoal} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && goals.length === 0 && (
          <div className="text-center py-16 glass rounded-2xl border border-slate-800 mb-6">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <div className="text-slate-400">No goals yet. Add your first financial goal below.</div>
          </div>
        )}

        {/* Add goal button */}
        {!loading && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-slate-700 text-slate-400 rounded-2xl hover:border-teal-500/50 hover:text-teal-400 hover:bg-teal-500/5 transition-all duration-300 font-medium"
          >
            <Plus className="w-5 h-5" />
            Add New Goal
          </button>
        )}

        {/* Add goal form */}
        {showForm && (
          <div className="glass rounded-2xl p-7 border border-slate-800 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>New Financial Goal</h2>
              <button
                onClick={() => setUseTemplate(!useTemplate)}
                className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1.5 transition-colors"
              >
                <MoreHorizontal className="w-4 h-4" />
                Use a template
              </button>
            </div>

            {useTemplate && (
              <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
                {goalTemplates.map(t => (
                  <button
                    key={t.name}
                    onClick={() => applyTemplate(t)}
                    className="text-left p-3 glass rounded-xl border border-slate-800 hover:border-teal-500/40 hover:bg-teal-500/5 transition-all"
                  >
                    <div className="text-lg mb-1">{t.icon}</div>
                    <div className="text-white text-xs font-medium leading-snug">{t.name}</div>
                    <div className="text-slate-500 text-xs mt-1">{formatINR(t.amount)}</div>
                  </button>
                ))}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-2">Goal name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Buy a Bike, Emergency Fund"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target amount *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={form.targetAmount}
                    onChange={e => setForm(p => ({ ...p, targetAmount: e.target.value }))}
                    placeholder="100000"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Already saved</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={form.savedAmount}
                    onChange={e => setForm(p => ({ ...p, savedAmount: e.target.value }))}
                    placeholder="0"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Monthly saving plan</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">₹</span>
                  <input
                    type="number"
                    value={form.monthlySaving}
                    onChange={e => setForm(p => ({ ...p, monthlySaving: e.target.value }))}
                    placeholder="5000"
                    className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 pl-8 text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors"
                  />
                </div>
              </div>
              {form.targetAmount && form.monthlySaving && parseInt(form.monthlySaving) > 0 && (
                <div className="sm:col-span-2 bg-teal-500/10 border border-teal-500/20 rounded-xl p-4 animate-fade-in">
                  <div className="text-teal-300 text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    At ₹{parseInt(form.monthlySaving).toLocaleString('en-IN')}/month, you'll reach this goal in{' '}
                    <strong>~{Math.ceil((parseInt(form.targetAmount) - (parseInt(form.savedAmount) || 0)) / parseInt(form.monthlySaving))} months</strong>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-6 py-3 border border-slate-700 text-slate-400 rounded-xl hover:border-slate-600 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addGoal}
                disabled={!form.name || !form.targetAmount}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl disabled:opacity-40 hover:from-teal-400 hover:to-emerald-400 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Goal
              </button>
            </div>
          </div>
        )}

        {/* MentorFi tip */}
        <div className="mt-8 glass rounded-2xl p-5 border border-slate-800">
          <div className="flex items-start gap-3 text-sm text-slate-400">
            <TrendingUp className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="text-teal-400 font-medium">MentorFi advice: </span>
              Always build a 3-month emergency fund before other goals. It protects you from needing high-interest loans during emergencies. Aim for 3x your monthly expenses as your first milestone.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

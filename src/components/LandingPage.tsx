import { useState, useEffect } from 'react';
import {
  ArrowRight, Shield, Target, AlertTriangle, BookOpen,
  TrendingUp, Star, ChevronRight, Sparkles,
  IndianRupee, Brain, Heart, CheckCircle2
} from 'lucide-react';

type Page = 'home' | 'budget' | 'goals' | 'emi' | 'chat' | 'learn';

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

const stats = [
  { value: '5M+', label: 'First-time earners in India yearly' },
  { value: '0', label: 'Financial education in schools' },
  { value: '73%', label: 'Young Indians lack savings plan' },
  { value: '1 in 3', label: 'Trapped in unplanned EMI debt' },
];

const features = [
  {
    icon: IndianRupee,
    title: 'Salary Budget Planner',
    desc: 'Enter your salary, city, and responsibilities. Get an instant, personalized rupee-by-rupee budget split tailored to your real life.',
    color: 'from-sky-500 to-blue-600',
    glow: 'group-hover:shadow-sky-500/20',
    page: 'budget' as Page,
    badge: 'Most Used',
  },
  {
    icon: Target,
    title: 'Financial Goal Tracker',
    desc: 'Set a goal — a bike, emergency fund, trip, or house. MentorFi calculates exactly how long it takes and what monthly savings you need.',
    color: 'from-teal-500 to-emerald-600',
    glow: 'group-hover:shadow-teal-500/20',
    page: 'goals' as Page,
    badge: null,
  },
  {
    icon: AlertTriangle,
    title: 'EMI Danger Detector',
    desc: 'Paste any EMI or BNPL offer. MentorFi reveals the real total cost, hidden charges, and red flags before you sign.',
    color: 'from-amber-500 to-orange-600',
    glow: 'group-hover:shadow-amber-500/20',
    page: 'emi' as Page,
    badge: 'Saves Money',
  },
  {
    icon: BookOpen,
    title: 'Knowledge & Policy Guide',
    desc: 'Ask anything about banking, stock markets, taxes, GST, or government schemes — no jargon, no judgment, always clear.',
    color: 'from-violet-500 to-purple-600',
    glow: 'group-hover:shadow-violet-500/20',
    page: 'learn' as Page,
    badge: null,
  },
];

const howItWorks = [
  {
    step: '01',
    title: 'Tell MentorFi about yourself',
    desc: 'Share your salary, city, and expenses. No forms — just a natural conversation at your own pace.',
  },
  {
    step: '02',
    title: 'Get your personalized plan',
    desc: 'Receive a clear budget breakdown, savings roadmap, and instant answers to your financial questions.',
  },
  {
    step: '03',
    title: 'Build financial confidence',
    desc: 'Use the tools, track your goals, and grow your knowledge — one step at a time, judgment-free.',
  },
];

const testimonials = [
  {
    name: 'Arjun M.',
    role: 'Software Developer, Pune',
    text: 'I got my first salary and had no idea what to do. MentorFi created a budget in minutes and explained what a SIP actually is. No one had ever explained that to me.',
    rating: 5,
  },
  {
    name: 'Priya S.',
    role: 'Marketing Executive, Bangalore',
    text: 'The EMI detector saved me from a phone loan that would have cost me ₹8,000 more than the sticker price. I never knew how to calculate that.',
    rating: 5,
  },
  {
    name: 'Rahul K.',
    role: 'Teaching Professional, Lucknow',
    text: 'I asked "what is the stock market" and it answered without making me feel dumb. That meant everything to me.',
    rating: 5,
  },
];

const comparison = [
  { feature: 'Built for first-time earners', others: false, mentorfi: true },
  { feature: 'Guides before spending', others: false, mentorfi: true },
  { feature: 'Judgment-free interface', others: false, mentorfi: true },
  { feature: 'No product selling', others: false, mentorfi: true },
  { feature: 'Personalized to salary & city', others: false, mentorfi: true },
  { feature: 'Explains Indian policies & taxes', others: false, mentorfi: true },
];

const quickTopics = [
  'What is a SIP?',
  'How to save tax?',
  'What is inflation?',
  'Should I invest in FD?',
  'How does EMI work?',
  'What is the stock market?',
];

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [visible, setVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center bg-mesh pt-16 overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-float delay-300" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-float delay-500" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Hackathon Challenge 3 — The Everyday AI Innovator
            </div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Your First Salary<br />
              <span className="text-gradient">Deserves a Guide</span>
            </h1>

            <p className="text-xl sm:text-2xl text-slate-400 max-w-3xl mx-auto mb-4 leading-relaxed">
              MentorFi is the AI financial life coach built for young Indians — calm, honest, and always judgment-free.
            </p>
            <p className="text-base text-slate-500 max-w-2xl mx-auto mb-10">
              Budget smarter. Plan your goals. Decode EMIs. Learn money basics. No jargon. No shame.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={() => onNavigate('budget')}
                className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl text-lg shadow-xl hover:shadow-sky-500/30 hover:from-sky-400 hover:to-teal-400 transition-all duration-300"
              >
                <IndianRupee className="w-5 h-5" />
                Plan My Salary
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('chat')}
                className="flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 text-slate-300 font-semibold rounded-xl text-lg hover:border-sky-500/50 hover:text-white hover:bg-white/5 transition-all duration-300"
              >
                <Brain className="w-5 h-5" />
                Ask MentorFi Anything
              </button>
            </div>

            {/* Quick topic pills */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {quickTopics.map(topic => (
                <button
                  key={topic}
                  onClick={() => onNavigate('chat')}
                  className="px-3 py-1.5 text-xs text-slate-400 border border-slate-800 rounded-full hover:border-sky-500/40 hover:text-sky-400 hover:bg-sky-500/5 transition-all duration-200"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Floating UI mockup */}
          <div className={`transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <div className="relative max-w-2xl mx-auto">
              <div className="glass rounded-2xl p-6 border border-slate-700/50 text-left shadow-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 bg-gradient-to-br from-sky-500 to-teal-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">MentorFi</div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                      <span className="text-emerald-400 text-xs">Always here for you</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-slate-800/60 rounded-xl rounded-tl-none px-4 py-3 text-slate-300 text-sm max-w-xs">
                    I just got my first salary of ₹32,000 in Hyderabad. I have no idea what to do with it.
                  </div>
                  <div className="bg-gradient-to-r from-sky-500/20 to-teal-500/20 border border-sky-500/20 rounded-xl rounded-tr-none px-4 py-3 text-sm max-w-md ml-auto text-right">
                    <p className="text-sky-300 font-medium mb-2">That is so exciting — congratulations on your first salary!</p>
                    <p className="text-slate-300">Let me help you make the most of it. Can I ask a few quick questions about your expenses and goals?</p>
                  </div>
                  <div className="flex gap-2 mt-3">
                    {['Sure, let\'s go!', 'Yes please', 'Tell me more'].map(opt => (
                      <button
                        key={opt}
                        className="px-3 py-1.5 text-xs border border-sky-500/30 text-sky-400 rounded-full hover:bg-sky-500/10 transition-colors"
                        onClick={() => onNavigate('chat')}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-600 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-slate-600 to-transparent" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-y border-slate-800 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gradient mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {value}
                </div>
                <div className="text-slate-400 text-sm leading-snug">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-4">The Problem</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Millions of first-time earners, <span className="text-gradient">zero guidance</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Every year, millions of young Indians receive their first salary with no financial education. Their parents couldn't teach them. Banks are intimidating. Google overwhelms with jargon.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Many feel too embarrassed to ask basic questions. They sign EMIs they don't understand, skip savings they can't afford to miss, and miss out on government benefits they're entitled to.
            </p>
          </div>
          <div className="space-y-4">
            {[
              'How do I split my salary between needs, savings, and fun?',
              'Is this EMI a good deal or a trap?',
              'What even is a mutual fund? Is it risky?',
              'Do I need to file a tax return?',
              'What does the Union Budget mean for me?',
            ].map((q, i) => (
              <div
                key={i}
                className="glass rounded-xl px-5 py-4 flex items-start gap-3 border border-slate-800 card-hover cursor-pointer"
                onClick={() => onNavigate('chat')}
              >
                <Heart className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                <span className="text-slate-300 text-sm">{q}</span>
                <ChevronRight className="w-4 h-4 text-slate-600 ml-auto shrink-0" />
              </div>
            ))}
            <p className="text-center text-slate-500 text-sm pt-2">These are questions MentorFi answers every day — warmly, clearly, without judgment.</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-900/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-sky-400 text-sm font-semibold tracking-widest uppercase mb-4">Core Features</div>
            <h2 className="text-4xl lg:text-5xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Everything you need to master money
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map(({ icon: Icon, title, desc, color, glow, page, badge }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`group relative text-left glass rounded-2xl p-8 border border-slate-800 card-hover transition-all duration-300 ${glow} hover:border-slate-700`}
              >
                {badge && (
                  <span className="absolute top-5 right-5 px-2.5 py-1 text-xs font-semibold bg-amber-500/20 text-amber-400 rounded-full border border-amber-500/30">
                    {badge}
                  </span>
                )}
                <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
                <p className="text-slate-400 leading-relaxed mb-5">{desc}</p>
                <div className="flex items-center gap-2 text-sky-400 text-sm font-medium">
                  Try it now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="text-teal-400 text-sm font-semibold tracking-widest uppercase mb-4">How It Works</div>
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Three steps to financial clarity</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorks.map(({ step, title, desc }) => (
            <div key={step} className="relative">
              <div className="text-7xl font-black text-slate-800 mb-4 select-none" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{step}</div>
              <h3 className="text-xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
              <p className="text-slate-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="py-24 bg-slate-900/30 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-4">Why MentorFi</div>
            <h2 className="text-4xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Different by design</h2>
          </div>
          <div className="glass rounded-2xl overflow-hidden border border-slate-800">
            <div className="grid grid-cols-3 text-center text-sm font-semibold border-b border-slate-800">
              <div className="py-4 px-6 text-slate-400">Feature</div>
              <div className="py-4 px-6 text-slate-500 border-x border-slate-800">Other Finance Apps</div>
              <div className="py-4 px-6 text-sky-400">MentorFi</div>
            </div>
            {comparison.map(({ feature, others, mentorfi }) => (
              <div key={feature} className="grid grid-cols-3 text-center text-sm border-b border-slate-800/50 last:border-0">
                <div className="py-4 px-6 text-slate-300 text-left">{feature}</div>
                <div className="py-4 px-6 border-x border-slate-800 flex items-center justify-center">
                  {others ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </div>
                <div className="py-4 px-6 flex items-center justify-center">
                  {mentorfi ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <span className="text-slate-600">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="text-emerald-400 text-sm font-semibold tracking-widest uppercase mb-4">Stories</div>
          <h2 className="text-4xl font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Real users, real confidence</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className={`glass rounded-2xl p-6 border transition-all duration-500 card-hover ${
                i === activeTestimonial ? 'border-sky-500/40 shadow-lg shadow-sky-500/10' : 'border-slate-800'
              }`}
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-300 leading-relaxed mb-6 text-sm">"{t.text}"</p>
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-slate-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Statement */}
      <section className="py-24 bg-gradient-to-br from-sky-950 via-slate-950 to-teal-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <Shield className="w-12 h-12 text-sky-400 mx-auto mb-6" />
          <blockquote className="text-2xl lg:text-3xl font-medium text-slate-200 leading-relaxed italic mb-8" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            "To be the financial companion every young Indian wishes they had when they got their first salary — honest, simple, judgment-free, and always on their side."
          </blockquote>
          <div className="flex items-center justify-center gap-2 text-sky-400 mb-12">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold text-xl" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>MentorFi</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => onNavigate('budget')}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold rounded-xl text-lg shadow-xl hover:shadow-sky-500/40 transition-all duration-300"
            >
              Start Your Financial Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-gradient-to-br from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Mentor<span className="text-gradient">Fi</span>
              </span>
            </div>
            <div className="text-slate-500 text-sm text-center">
              Hackathon Submission — Challenge 3: The Everyday AI Innovator<br />
              Financial literacy is not a privilege. MentorFi exists to make it a right.
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              <span>Not a registered financial advisor. For education only.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

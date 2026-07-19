import { useState, useEffect } from 'react';
import { TrendingUp, Menu, X } from 'lucide-react';

type Page = 'home' | 'budget' | 'goals' | 'emi' | 'chat' | 'learn';

interface NavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const navLinks: { label: string; page: Page }[] = [
  { label: 'Budget Planner', page: 'budget' },
  { label: 'Goal Tracker', page: 'goals' },
  { label: 'EMI Detector', page: 'emi' },
  { label: 'Ask MentorFi', page: 'chat' },
  { label: 'Learn', page: 'learn' },
];

export default function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (page: Page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || currentPage !== 'home'
          ? 'bg-slate-900/95 backdrop-blur-md border-b border-slate-800'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-teal-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-sky-500/30 transition-shadow">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Mentor<span className="text-gradient">Fi</span>
            </span>
          </button>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ label, page }) => (
              <button
                key={page}
                onClick={() => handleNav(page)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPage === page
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => handleNav('chat')}
              className="ml-3 px-4 py-2 bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold rounded-lg hover:from-sky-400 hover:to-teal-400 transition-all duration-200 shadow-lg hover:shadow-sky-500/30"
            >
              Get Started Free
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900/98 border-b border-slate-800 px-4 py-4 flex flex-col gap-2 animate-fade-in">
          {navLinks.map(({ label, page }) => (
            <button
              key={page}
              onClick={() => handleNav(page)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                currentPage === page
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => handleNav('chat')}
            className="w-full mt-2 px-4 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white text-sm font-semibold rounded-lg"
          >
            Get Started Free
          </button>
        </div>
      )}
    </nav>
  );
}

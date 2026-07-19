import { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import LandingPage from './components/LandingPage';
import BudgetPlanner from './components/BudgetPlanner';
import GoalTracker from './components/GoalTracker';
import EMIDetector from './components/EMIDetector';
import AIChat from './components/AIChat';
import KnowledgeHub from './components/KnowledgeHub';

type Page = 'home' | 'budget' | 'goals' | 'emi' | 'chat' | 'learn';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const titles: Record<Page, string> = {
      home: 'MentorFi — AI Financial Life Coach for Young Indians',
      budget: 'Budget Planner — MentorFi',
      goals: 'Goal Tracker — MentorFi',
      emi: 'EMI Danger Detector — MentorFi',
      chat: 'Ask MentorFi — AI Financial Coach',
      learn: 'Financial Knowledge Hub — MentorFi',
    };
    document.title = titles[currentPage];
  }, [currentPage]);

  const isChat = currentPage === 'chat';

  return (
    <div className={`bg-slate-950 ${isChat ? 'h-screen flex flex-col overflow-hidden' : 'min-h-screen'}`}>
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />

      <main className={isChat ? 'flex-1 overflow-hidden pt-16' : ''}>
        {currentPage === 'home' && <LandingPage onNavigate={handleNavigate} />}
        {currentPage === 'budget' && <BudgetPlanner />}
        {currentPage === 'goals' && <GoalTracker />}
        {currentPage === 'emi' && <EMIDetector />}
        {currentPage === 'chat' && <AIChat />}
        {currentPage === 'learn' && <KnowledgeHub />}
      </main>
    </div>
  );
}

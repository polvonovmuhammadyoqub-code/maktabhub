import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardOverview } from './components/DashboardOverview';
import { ScheduleView } from './components/ScheduleView';
import { LessonsView } from './components/LessonsView';
import { HomeworkView } from './components/HomeworkView';
import { LeaderboardView } from './components/LeaderboardView';
import { RewardShopView } from './components/RewardShopView';
import { QuizArenaView } from './components/QuizArenaView';
import { AdminPanel } from './components/AdminPanel';

import { 
  initialStudent, 
  mockLessons, 
  mockHomeworks, 
  mockLeaderboard, 
  mockRewards, 
  mockBadges,
  mockSchedule
} from './mock/mockData';
import type { HomeworkItem, LessonMaterial, RewardItem, UserRole, QuizQuestion, ScheduleItem, UserProfile } from './types';
import { api } from './api/client';

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialStudent);
  const [activeTab, setActiveTab] = useState('overview');

  const [lessons, setLessons] = useState<LessonMaterial[]>(mockLessons);
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>(mockHomeworks);
  const [rewards, setRewards] = useState<RewardItem[]>(mockRewards);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>(mockSchedule);
  const [badges] = useState(mockBadges);
  const [activeModalHw, setActiveModalHw] = useState<HomeworkItem | null>(null);

  // Sync with Backend API on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apiLessons, apiRewards, apiHomeworks, apiUser, apiQuiz, apiSchedule] = await Promise.allSettled([
          api.getLessons(),
          api.getRewards(),
          api.getHomeworks(),
          api.getUserProfile(),
          api.getQuizQuestions(),
          api.getSchedule(),
        ]);

        if (apiLessons.status === 'fulfilled') setLessons(apiLessons.value);
        if (apiRewards.status === 'fulfilled') setRewards(apiRewards.value);
        if (apiHomeworks.status === 'fulfilled') setHomeworks(apiHomeworks.value);
        if (apiUser.status === 'fulfilled') setCurrentUser(apiUser.value);
        if (apiQuiz.status === 'fulfilled') setQuizQuestions(apiQuiz.value);
        if (apiSchedule.status === 'fulfilled') setSchedules(apiSchedule.value);
      } catch (err) {
        console.log('Running in local state mode (backend starting or offline):', err);
      }
    };

    fetchData();
  }, []);

  // Handle Login & Registration
  const handleLogin = (role: UserRole, user?: UserProfile) => {
    setIsLoggedIn(true);
    if (user) {
      setCurrentUser(user);
    }
    if (role === 'ADMIN') {
      setActiveTab('admin');
    } else {
      setActiveTab('overview');
    }
  };

  // Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Handle Homework Submission (Backend + Local State)
  const handleSubmitHomework = async (homeworkId: string, answerText: string) => {
    try {
      await api.submitHomework(homeworkId, answerText);
    } catch (e) {
      console.log('API call failed, updating local state:', e);
    }

    setHomeworks((prev) =>
      prev.map((hw) => {
        if (hw.id === homeworkId) {
          return {
            ...hw,
            status: 'under_review',
            studentAnswer: answerText,
          };
        }
        return hw;
      })
    );
  };

  // Handle Reward Purchase (Backend API + Local State)
  const handlePurchaseReward = (reward: RewardItem): boolean => {
    if (currentUser.coins < reward.price) return false;

    // Trigger backend purchase
    api.purchaseReward(reward.id).catch((err) => {
      console.log('Backend purchase error:', err);
    });

    // Update state immediately
    setCurrentUser((prev) => ({
      ...prev,
      coins: prev.coins - reward.price,
    }));

    setRewards((prev) =>
      prev.map((r) => {
        if (r.id === reward.id) {
          return { ...r, stock: Math.max(0, r.stock - 1) };
        }
        return r;
      })
    );

    return true;
  };

  // Handle Earning Coins / XP from Quiz Arena
  const handleEarnCoins = (amount: number, xp: number) => {
    api.adjustCoins(amount, 'Quiz Arena viktorinasidagi g‘alaba').catch((err) => {
      console.log('Backend adjust coins err:', err);
    });

    setCurrentUser((prev) => {
      const newXp = prev.xp + xp;
      const newLevel = Math.floor(newXp / 500) + 1;
      return {
        ...prev,
        coins: prev.coins + amount,
        xp: newXp,
        level: newLevel,
      };
    });
  };

  // ----------------------------------------------------
  // ADMIN PANEL HANDLERS (Darsliklar, Narxlar, Savollar)
  // ----------------------------------------------------
  const handleUpdateReward = async (id: string, data: Partial<RewardItem>) => {
    try {
      const updated = await api.updateReward(id, data);
      setRewards((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch {
      setRewards((prev) => prev.map((r) => (r.id === id ? { ...r, ...data } : r)));
    }
  };

  const handleCreateReward = async (data: Partial<RewardItem>) => {
    try {
      const created = await api.createReward(data);
      setRewards((prev) => [created, ...prev]);
    } catch {
      const fallbackReward: RewardItem = {
        id: `rew-${Date.now()}`,
        title: data.title || 'Yangi Mukofot',
        price: data.price || 100,
        category: data.category || 'physical',
        description: data.description || '',
        stock: data.stock || 10,
        image: data.image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
      };
      setRewards((prev) => [fallbackReward, ...prev]);
    }
  };

  const handleDeleteReward = async (id: string) => {
    try {
      await api.deleteReward(id);
    } catch (e) {
      console.log(e);
    }
    setRewards((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateLesson = async (id: string, data: Partial<LessonMaterial>) => {
    try {
      const updated = await api.updateLesson(id, data);
      setLessons((prev) => prev.map((l) => (l.id === id ? updated : l)));
    } catch {
      setLessons((prev) => prev.map((l) => (l.id === id ? { ...l, ...data } : l)));
    }
  };

  const handleCreateLesson = async (data: Partial<LessonMaterial>) => {
    try {
      const created = await api.createLesson(data);
      setLessons((prev) => [created, ...prev]);
    } catch {
      const fallbackLesson: LessonMaterial = {
        id: `les-${Date.now()}`,
        title: data.title || 'Yangi Dars',
        subject: data.subject || 'Informatika',
        teacherName: data.teacherName || 'O‘qituvchi',
        date: 'Bugun',
        fileType: data.fileType || 'pptx',
        fileSize: '3.0 MB',
        description: data.description || '',
      };
      setLessons((prev) => [fallbackLesson, ...prev]);
    }
  };

  const handleDeleteLesson = async (id: string) => {
    try {
      await api.deleteLesson(id);
    } catch (e) {
      console.log(e);
    }
    setLessons((prev) => prev.filter((l) => l.id !== id));
  };

  const handleAdjustCoins = async (amount: number, reason: string) => {
    try {
      const res = await api.adjustCoins(amount, reason);
      setCurrentUser((prev) => ({ ...prev, coins: res.newBalance }));
    } catch {
      setCurrentUser((prev) => ({ ...prev, coins: Math.max(0, prev.coins + amount) }));
    }
  };

  // Quiz Questions Admin Handlers
  const handleCreateQuizQuestion = async (data: Partial<QuizQuestion>) => {
    try {
      const created = await api.createQuizQuestion(data);
      setQuizQuestions((prev) => [...prev, created]);
    } catch {
      const fallback: QuizQuestion = {
        id: `q-${Date.now()}`,
        subject: data.subject || 'Umumiy',
        title: data.title || '',
        timeLimit: data.timeLimit || 15,
        points: data.points || 800,
        coinsReward: data.coinsReward || 20,
        options: data.options || [],
        explanation: data.explanation,
      };
      setQuizQuestions((prev) => [...prev, fallback]);
    }
  };

  const handleUpdateQuizQuestion = async (id: string, data: Partial<QuizQuestion>) => {
    try {
      const updated = await api.updateQuizQuestion(id, data);
      setQuizQuestions((prev) => prev.map((q) => (q.id === id ? updated : q)));
    } catch {
      setQuizQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)));
    }
  };

  const handleDeleteQuizQuestion = async (id: string) => {
    try {
      await api.deleteQuizQuestion(id);
    } catch (e) {
      console.log(e);
    }
    setQuizQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  // If not logged in, render the Login Page
  if (!isLoggedIn) {
    return <LoginView onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        user={currentUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'overview' && (
          <DashboardOverview
            user={currentUser}
            homeworks={homeworks}
            lessons={lessons}
            badges={badges}
            schedules={schedules}
            onNavigateTab={setActiveTab}
            onOpenHomeworkModal={(hw) => {
              setActiveModalHw(hw);
              setActiveTab('homework');
            }}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleView 
            schedules={schedules} 
            onNavigateTab={setActiveTab} 
          />
        )}

        {activeTab === 'lessons' && (
          <LessonsView lessons={lessons} />
        )}

        {activeTab === 'homework' && (
          <HomeworkView
            homeworks={homeworks}
            onSubmitHomework={handleSubmitHomework}
            activeModalHw={activeModalHw}
            setActiveModalHw={setActiveModalHw}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView users={mockLeaderboard} />
        )}

        {activeTab === 'rewards' && (
          <RewardShopView
            user={currentUser}
            rewards={rewards}
            onPurchaseReward={handlePurchaseReward}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizArenaView 
            questions={quizQuestions}
            onEarnCoins={handleEarnCoins} 
          />
        )}

        {/* Admin Panel Tab */}
        {activeTab === 'admin' && (
          <AdminPanel
            lessons={lessons}
            rewards={rewards}
            quizQuestions={quizQuestions}
            studentCoins={currentUser.coins}
            onUpdateReward={handleUpdateReward}
            onCreateReward={handleCreateReward}
            onDeleteReward={handleDeleteReward}
            onUpdateLesson={handleUpdateLesson}
            onCreateLesson={handleCreateLesson}
            onDeleteLesson={handleDeleteLesson}
            onAdjustCoins={handleAdjustCoins}
            onCreateQuizQuestion={handleCreateQuizQuestion}
            onUpdateQuizQuestion={handleUpdateQuizQuestion}
            onDeleteQuizQuestion={handleDeleteQuizQuestion}
          />
        )}
      </main>

      {/* Modern Footer */}
      <footer className="bg-white border-t border-slate-200/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">MaktabZiyo</span>
            <span>— Maktablar uchun gamifikatsiyalangan raqamli ta’lim platformasi</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Cyber Arena & Admin Panel Faol
            </span>
            <span>•</span>
            <button 
              onClick={() => setActiveTab(activeTab === 'admin' ? 'overview' : 'admin')}
              className="text-indigo-600 hover:underline font-bold"
            >
              {activeTab === 'admin' ? 'O‘quvchi ko‘rinishiga qaytish' : '⚙️ Admin Panelga o‘tish'}
            </button>
            <span>•</span>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:underline font-semibold"
            >
              Chiqish
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

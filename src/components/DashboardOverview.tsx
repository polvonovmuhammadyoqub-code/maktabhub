import React from 'react';
import type { UserProfile, HomeworkItem, LessonMaterial, AchievementBadge, ScheduleItem } from '../types';
import { 
  Coins, 
  Zap, 
  Flame, 
  Trophy, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Gamepad2, 
  Sparkles,
  Star,
  Target,
  Calendar,
  MapPin
} from 'lucide-react';

interface DashboardOverviewProps {
  user: UserProfile;
  homeworks: HomeworkItem[];
  lessons: LessonMaterial[];
  badges: AchievementBadge[];
  schedules?: ScheduleItem[];
  onNavigateTab: (tab: string) => void;
  onOpenHomeworkModal: (hw: HomeworkItem) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  user,
  homeworks,
  lessons,
  badges,
  schedules = [],
  onNavigateTab,
  onOpenHomeworkModal,
}) => {
  const pendingHomeworks = homeworks.filter(h => h.status === 'new');
  const xpForNextLevel = 2000;
  const xpNeeded = xpForNextLevel - user.xp;
  const progressPercent = Math.round((user.xp / xpForNextLevel) * 100);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-800 p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
        {/* Background glow graphics */}
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-40 -top-10 w-48 h-48 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300 border border-white/15">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{user.streakDays} kunlik faollik seriyasi davom etmoqda!</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Salom, {user.fullName.split(' ')[0]}! 🚀
            </h1>
            <p className="text-sm sm:text-base text-indigo-100/90 max-w-xl">
              Bugun darslarni o‘rganish va yangi virtual tangalar to‘plash uchun ajoyib kun. Siz 7-“B” sinfida 3-o‘rinda ketyapsiz!
            </p>
          </div>

          {/* Quick Quiz Card inside Banner */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col gap-3 min-w-[280px]">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <Gamepad2 className="w-4 h-4" />
                Cyber Arena Viktorinasi
              </span>
              <span className="text-[10px] bg-emerald-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                Faol xona bor
              </span>
            </div>
            <p className="text-xs text-indigo-100">
              O‘qituvchingiz bergan 6 xonali o‘yin kodini kiriting va sinfdoshlaringiz bilan real-vaqtda bellashing!
            </p>
            <button
              onClick={() => onNavigateTab('quiz')}
              className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Cyber Arenaga ulanish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 4 Essential Gamification Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        
        {/* Metric 1: Coins */}
        <div 
          onClick={() => onNavigateTab('rewards')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tangalar
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Coins className="w-5 h-5 fill-amber-500 text-amber-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {user.coins}
            </span>
            <span className="text-xs font-bold text-emerald-600">+45 ta bu hafta</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Do‘konda sarflash mumkin</p>
        </div>

        {/* Metric 2: XP & Level */}
        <div 
          onClick={() => onNavigateTab('leaderboard')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {user.level}-Daraja (XP)
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5 fill-indigo-500 text-indigo-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {user.xp}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 2000 XP</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 mt-1.5">{xpNeeded} XP keyingi darajaga</p>
        </div>

        {/* Metric 3: Pending Tasks */}
        <div 
          onClick={() => onNavigateTab('homework')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Kutilayotgan vazifalar
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {pendingHomeworks.length} ta
            </span>
            <span className="text-xs font-bold text-rose-500">Muddati yaqin</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Bugun topshirish lozim</p>
        </div>

        {/* Metric 4: Leaderboard Rank */}
        <div 
          onClick={() => onNavigateTab('leaderboard')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Sinfdagi o‘rni
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900">
              {user.rank}-o‘rin
            </span>
            <span className="text-xs font-bold text-purple-600">Top 3 talik</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">7-"B" sinfi bo‘yicha</p>
        </div>

      </div>

      {/* Main Content Grid: Upcoming Tasks & Recent Lessons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column (8 cols): Tasks & Lessons */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Bugungi Dars Jadvali Widget */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
                    Bugungi Dars Jadvali
                  </h2>
                  <span className="text-[11px] text-slate-400 font-medium">Payshanba • 6 ta dars</span>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('schedule')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>To‘liq jadval</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {schedules.slice(0, 6).map((item) => {
                const isCurrent = item.status === 'current';
                const isCompleted = item.status === 'completed';

                return (
                  <div
                    key={item.id}
                    onClick={() => onNavigateTab('schedule')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isCurrent
                        ? 'bg-indigo-50/70 border-indigo-300 ring-2 ring-indigo-200'
                        : isCompleted
                        ? 'bg-slate-50 border-slate-200/60 opacity-75'
                        : 'bg-white border-slate-200 hover:border-indigo-200 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isCurrent
                          ? 'bg-indigo-600 text-white'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.lessonNumber}-dars
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {item.time.split(' - ')[0]}
                      </span>
                    </div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                      {item.subject}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">{item.room}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Urgent Homework Section */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Bajarilishi kerak bo‘lgan vazifalar
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('homework')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Barchasini ko‘rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {pendingHomeworks.map((hw) => (
                <div
                  key={hw.id}
                  className="p-4 rounded-xl border border-slate-200/70 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-100 text-indigo-800">
                        {hw.subject}
                      </span>
                      <span className="text-xs font-semibold text-rose-600 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {hw.dueDate}
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {hw.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">
                      {hw.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 rounded-lg border border-amber-200 text-xs font-bold text-amber-800">
                      <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>+{hw.maxCoins}</span>
                    </div>

                    <button
                      onClick={() => onOpenHomeworkModal(hw)}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all"
                    >
                      Bajarish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Lessons Section */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Yangi dars materiallari
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('lessons')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Barchasini ko‘rish</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {lessons.slice(0, 2).map((lesson) => (
                <div
                  key={lesson.id}
                  onClick={() => onNavigateTab('lessons')}
                  className="p-4 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {lesson.subject}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase">
                        {lesson.fileType} • {lesson.fileSize}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 mb-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {lesson.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{lesson.teacherName}</span>
                    <span className="text-indigo-600 font-bold hover:underline flex items-center gap-1">
                      Ochish <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (4 cols): Achievements & Activity */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Unlocked Badges Showcase */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-base font-extrabold text-slate-900">
                  Erishilgan yutuqlar
                </h2>
              </div>
              <span className="text-xs font-bold text-amber-600">
                3 / 4 ochilgan
              </span>
            </div>

            <div className="space-y-3">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                    badge.isUnlocked
                      ? 'border-amber-200 bg-amber-50/40 text-slate-900'
                      : 'border-slate-200 bg-slate-50/60 opacity-60 text-slate-500'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    badge.isUnlocked ? 'bg-amber-400 text-amber-950 shadow-xs' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {badge.icon === 'Flame' && <Flame className="w-5 h-5 fill-amber-700" />}
                    {badge.icon === 'Star' && <Star className="w-5 h-5 fill-amber-700" />}
                    {badge.icon === 'Target' && <Target className="w-5 h-5 text-amber-950" />}
                    {badge.icon === 'BookOpen' && <BookOpen className="w-5 h-5 text-slate-500" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs sm:text-sm truncate">
                        {badge.title}
                      </h4>
                      {badge.unlockedAt && (
                        <span className="text-[10px] text-amber-700 font-medium">
                          {badge.unlockedAt}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {badge.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('leaderboard')}
              className="w-full mt-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Barcha nishonlar va unvonlar
            </button>
          </div>

          {/* Reward Shop Teaser Card */}
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-5 text-white shadow-md shadow-amber-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-100">
                Mukofotlar Do‘koni
              </span>
              <Coins className="w-5 h-5 text-amber-100" />
            </div>
            <h3 className="font-black text-lg sm:text-xl">
              Tangalaringizni sovg‘alarga almashtiring! 🎁
            </h3>
            <p className="text-xs text-amber-100/90 mt-1 mb-4">
              Sizda 380 tanga bor. Maxsus profil avatari yoki maktab bloknotini olishingiz mumkin.
            </p>
            <button
              onClick={() => onNavigateTab('rewards')}
              className="w-full py-2.5 px-3 bg-white hover:bg-amber-50 text-amber-950 font-bold rounded-xl text-xs shadow-xs transition-all hover:scale-[1.02]"
            >
              Do‘konga o‘tish
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

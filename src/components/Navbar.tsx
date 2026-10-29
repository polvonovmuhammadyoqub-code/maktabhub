import React from 'react';
import type { UserProfile } from '../types';
import { Coins, Zap, Bell, Flame, LogOut, Sparkles, Settings } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  onLogout,
}) => {
  const xpForNextLevel = 2000;
  const xpPercentage = Math.min(100, Math.round((user.xp / xpForNextLevel) * 100));

  const navItems = [
    { id: 'overview', label: 'Bosh sahifa' },
    { id: 'schedule', label: 'Dars jadvali' },
    { id: 'lessons', label: 'Darslar' },
    { id: 'homework', label: 'Vazifalar' },
    { id: 'leaderboard', label: 'Reyting' },
    { id: 'rewards', label: 'Do‘kon' },
    { id: 'quiz', label: 'Cyber Arena' },
    { id: 'admin', label: '⚙️ Admin Panel' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & School Name */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent">
                  MaktabZiyo
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ONLINE API
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block truncate max-w-[200px] md:max-w-[280px]">
                {user.schoolName}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              const isAdmin = item.id === 'admin';

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? isAdmin
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-indigo-50 text-indigo-700 shadow-xs'
                      : isAdmin
                      ? 'text-slate-800 bg-slate-100 hover:bg-slate-200 font-extrabold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  {isAdmin && <Settings className="w-3.5 h-3.5 text-indigo-500" />}
                  <span>{isAdmin ? 'Admin Panel' : item.label}</span>
                  {item.id === 'quiz' && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-amber-500 text-white rounded-full animate-pulse">
                      Jonli
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Gamification Stats: Coins, XP, Level, Avatar */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Streak Indicator */}
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-50 border border-orange-200 rounded-xl text-orange-700 font-bold text-xs" title="Ketma-ket 5 kunlik faollik">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span>{user.streakDays} kun</span>
            </div>

            {/* Virtual Coins Badge */}
            <div 
              onClick={() => setActiveTab('rewards')}
              className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200/80 rounded-xl cursor-pointer transition-all shadow-xs"
              title="Virtual tangalaringiz balansi. Do‘konda sarflashingiz mumkin!"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-xs">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div className="text-left">
                <span className="block font-black text-amber-900 text-sm leading-none">
                  {user.coins}
                </span>
                <span className="text-[10px] font-semibold text-amber-700 uppercase tracking-wider">
                  Tanga
                </span>
              </div>
            </div>

            {/* Level & XP Bar */}
            <div 
              onClick={() => setActiveTab('leaderboard')}
              className="hidden md:flex flex-col gap-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors"
              title={`${user.xp} / ${xpForNextLevel} XP`}
            >
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="flex items-center gap-1 font-bold text-indigo-700">
                  <Zap className="w-3.5 h-3.5 fill-indigo-500 text-indigo-600" />
                  {user.level}-Daraja
                </span>
                <span className="text-slate-500 text-[11px] font-medium">
                  {user.xp} XP
                </span>
              </div>
              <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
                  style={{ width: `${xpPercentage}%` }}
                />
              </div>
            </div>

            {/* Notification Bell */}
            <button 
              className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              title="Bildirishnomalar"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* User Profile Avatar & Dropdown */}
            <div className="flex items-center gap-2 pl-1 sm:pl-2 border-l border-slate-200">
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden xl:block text-left">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user.fullName}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  {user.className}
                </div>
              </div>

              <button
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                title="Chiqish / Kirish sahifasiga qaytish"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Mobile Navigation bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 scrollbar-none border-t border-slate-100">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};

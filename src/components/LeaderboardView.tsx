import React, { useState } from 'react';
import type { LeaderboardUser } from '../types';
import { Trophy, Medal, Crown, Zap, ShieldAlert } from 'lucide-react';

interface LeaderboardViewProps {
  users: LeaderboardUser[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ users }) => {
  const [scope, setScope] = useState<'class' | 'school'>('class');

  const topThree = users.slice(0, 3);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Leaderboard — O‘quvchilar Reytingi 🏆
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tajriba ballari (XP) bo‘yicha eng faol va tirishqoq o‘quvchilar peshqadami.
          </p>
        </div>

        {/* Scope switch */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl">
          <button
            onClick={() => setScope('class')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              scope === 'class' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Sinf reytingi (7-"B")
          </button>
          <button
            onClick={() => setScope('school')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              scope === 'school' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Maktab reytingi
          </button>
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center mb-8">
          <span className="text-xs font-bold text-amber-300 uppercase tracking-widest px-3 py-1 bg-white/10 rounded-full border border-white/10">
            Haftalik peshqadamlar shohsupasi
          </span>
        </div>

        {/* Podium Layout */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-center gap-4 sm:gap-6 pt-4 max-w-3xl mx-auto">
          
          {/* 2nd Place: Silver */}
          {topThree[1] && (
            <div className="order-2 sm:order-1 flex flex-col items-center w-full sm:w-1/3">
              <div className="relative mb-3">
                <img
                  src={topThree[1].avatar}
                  alt={topThree[1].fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-slate-300 shadow-lg"
                />
                <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-slate-300 text-slate-800 font-black text-xs flex items-center justify-center shadow-md">
                  2
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-100 text-center truncate max-w-[160px]">
                {topThree[1].fullName}
              </h4>
              <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mt-1">
                <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                <span>{topThree[1].xp} XP</span>
              </div>
              <div className="w-full h-24 sm:h-28 bg-white/10 border-t-2 border-slate-300 rounded-t-2xl mt-4 flex items-center justify-center">
                <Medal className="w-8 h-8 text-slate-300" />
              </div>
            </div>
          )}

          {/* 1st Place: Gold */}
          {topThree[0] && (
            <div className="order-1 sm:order-2 flex flex-col items-center w-full sm:w-1/3">
              <div className="relative mb-3">
                <Crown className="w-8 h-8 text-amber-400 fill-amber-400 mx-auto mb-1 animate-bounce" />
                <img
                  src={topThree[0].avatar}
                  alt={topThree[0].fullName}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-amber-400 shadow-xl shadow-amber-500/20"
                />
                <span className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 font-black text-sm flex items-center justify-center shadow-md">
                  1
                </span>
              </div>
              <h4 className="font-extrabold text-base sm:text-lg text-amber-200 text-center truncate max-w-[180px]">
                {topThree[0].fullName}
              </h4>
              <div className="flex items-center gap-1 text-sm text-amber-300 font-extrabold mt-1">
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{topThree[0].xp} XP</span>
              </div>
              <div className="w-full h-32 sm:h-36 bg-gradient-to-b from-amber-500/20 to-white/10 border-t-4 border-amber-400 rounded-t-2xl mt-4 flex items-center justify-center">
                <Trophy className="w-10 h-10 text-amber-400" />
              </div>
            </div>
          )}

          {/* 3rd Place: Bronze (Current User) */}
          {topThree[2] && (
            <div className="order-3 flex flex-col items-center w-full sm:w-1/3">
              <div className="relative mb-3">
                <img
                  src={topThree[2].avatar}
                  alt={topThree[2].fullName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-600/70 shadow-lg"
                />
                <span className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shadow-md">
                  3
                </span>
              </div>
              <h4 className="font-bold text-sm sm:text-base text-slate-100 text-center truncate max-w-[160px]">
                {topThree[2].fullName}
              </h4>
              <div className="flex items-center gap-1 text-xs text-amber-300 font-bold mt-1">
                <Zap className="w-3.5 h-3.5 fill-indigo-400 text-indigo-400" />
                <span>{topThree[2].xp} XP</span>
              </div>
              <div className="w-full h-20 sm:h-24 bg-white/10 border-t-2 border-amber-600 rounded-t-2xl mt-4 flex items-center justify-center">
                <Medal className="w-7 h-7 text-amber-600" />
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Leaderboard Table for 4th and beyond */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900">
            To‘liq ro‘yxat
          </h3>
          <span className="text-xs text-slate-500">
            Jami: {users.length} o‘quvchi
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {users.map((item) => (
            <div
              key={item.id}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                item.isCurrentUser
                  ? 'bg-indigo-50/60 font-semibold text-indigo-900 border-l-4 border-l-indigo-600'
                  : 'hover:bg-slate-50/60'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <span className={`w-7 text-center font-black text-sm ${
                  item.rank === 1 ? 'text-amber-500' :
                  item.rank === 2 ? 'text-slate-400' :
                  item.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                }`}>
                  #{item.rank}
                </span>

                <img
                  src={item.avatar}
                  alt={item.fullName}
                  className="w-10 h-10 rounded-xl object-cover shrink-0"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {item.fullName}
                    </span>
                    {item.isCurrentUser && (
                      <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold">
                        Siz
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">
                    {item.className} • {item.level}-Daraja • {item.badgesCount} ta nishon
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-6 shrink-0">
                <div className="text-right">
                  <div className="flex items-center gap-1 font-black text-sm text-indigo-700">
                    <Zap className="w-3.5 h-3.5 fill-indigo-600 text-indigo-600" />
                    <span>{item.xp} XP</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-medium">
                    {item.coins} tanga
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fairness & Privacy Guarantee Card */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <span className="font-bold">Adolatli gamifikatsiya qoidasi: </span>
          Reyting faqat to‘plangan o‘quv tajriba ballari (XP) asosida shakllanadi. Do‘konda virtual tangalaringizni sovg‘alarga sarflashingiz reytingdagi o‘rningizga va erishilgan darajangizga hech qanday salbiy ta’sir ko‘rsatmaydi!
        </div>
      </div>

    </div>
  );
};

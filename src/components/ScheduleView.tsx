import React, { useState } from 'react';
import type { ScheduleItem } from '../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  CheckCircle2, 
  AlertCircle, 
  BookOpen, 
  ChevronRight, 
  BellRing
} from 'lucide-react';

interface ScheduleViewProps {
  schedules: ScheduleItem[];
  onNavigateTab: (tab: string) => void;
}

export const ScheduleView: React.FC<ScheduleViewProps> = ({ schedules, onNavigateTab }) => {
  const [selectedDay, setSelectedDay] = useState<'today' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'>('today');

  const daysOfWeek = [
    { id: 'today', label: 'Bugun (Payshanba)' },
    { id: 'mon', label: 'Dushanba' },
    { id: 'tue', label: 'Seshanba' },
    { id: 'wed', label: 'Chorshanba' },
    { id: 'thu', label: 'Payshanba' },
    { id: 'fri', label: 'Juma' },
    { id: 'sat', label: 'Shanba' },
  ];

  const completedCount = schedules.filter(s => s.status === 'completed').length;
  const currentLesson = schedules.find(s => s.status === 'current');
  const upcomingCount = schedules.filter(s => s.status === 'upcoming').length;

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-100">
        <div className="absolute -right-8 -bottom-8 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-amber-300 border border-white/15">
              <Calendar className="w-4 h-4" />
              2026/2027-o‘quv yili • 1-yarim yillik
            </span>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              Dars Jadvali & Qo‘ng‘iroqlar 📅
            </h1>
            <p className="text-sm sm:text-base text-indigo-100 max-w-xl">
              7-"B" sinfining kunlik dars taqvimi. Dars vaqtlari, xonalar va mavzular bilan tanishing.
            </p>
          </div>

          {/* Current Lesson Badge Card */}
          {currentLesson && (
            <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 sm:p-5 flex flex-col gap-2 min-w-[280px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Hozirgi dars jarayoni
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/80 text-white">
                  {currentLesson.lessonNumber}-para
                </span>
              </div>
              <h3 className="text-lg font-black text-white">{currentLesson.subject}</h3>
              <p className="text-xs text-indigo-100 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentLesson.room}</span>
                <span>•</span>
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>{currentLesson.time}</span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bugungi darslar</span>
            <div className="text-2xl font-black text-slate-900">{schedules.length} ta dars</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tugallangan darslar</span>
            <div className="text-2xl font-black text-emerald-600">{completedCount} ta dars</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kutilayotgan darslar</span>
            <div className="text-2xl font-black text-amber-600">{upcomingCount} ta dars</div>
          </div>
        </div>
      </div>

      {/* Days Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {daysOfWeek.map((day) => (
          <button
            key={day.id}
            onClick={() => setSelectedDay(day.id as any)}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedDay === day.id
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* Schedule Timeline List */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">
              Bugungi Darslar Ro‘yxati
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tanaffuslar: 10 daqiqa (Katta tanaffus: 20 daqiqa dars oralig‘ida)
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
            <BellRing className="w-4 h-4 text-indigo-600" />
            <span>Qo‘ng‘iroqlar avtomatik</span>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          {schedules.map((item) => {
            const isCompleted = item.status === 'completed';
            const isCurrent = item.status === 'current';

            return (
              <div
                key={item.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCurrent
                    ? 'border-indigo-400 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-md'
                    : isCompleted
                    ? 'border-slate-200 bg-slate-50/50 opacity-80'
                    : 'border-slate-200 hover:border-indigo-300 hover:bg-white hover:shadow-xs'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4">
                  {/* Lesson Number Circle */}
                  <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-300'
                      : isCompleted
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    <span className="text-xs uppercase font-semibold">Dars</span>
                    <span className="text-lg leading-none">{item.lessonNumber}</span>
                  </div>

                  {/* Lesson Details */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {item.subject}
                      </h3>

                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white flex items-center gap-1 animate-pulse">
                          <span>● Hozir o‘tilmoqda</span>
                        </span>
                      )}

                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tugallangan</span>
                        </span>
                      )}

                      {!isCompleted && !isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                          Navbatdagi dars
                        </span>
                      )}

                      {item.hasHomework && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Vazifa berilgan</span>
                        </span>
                      )}
                    </div>

                    {item.topic && (
                      <p className="text-xs sm:text-sm font-medium text-slate-600">
                        Mavzu: <span className="font-semibold text-slate-800">{item.topic}</span>
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1 font-semibold text-indigo-700">
                        <Clock className="w-3.5 h-3.5" />
                        {item.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.room}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {item.teacherName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {item.hasHomework ? (
                    <button
                      onClick={() => onNavigateTab('homework')}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1"
                    >
                      <span>Vazifani ko‘rish</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => onNavigateTab('lessons')}
                      className="px-4 py-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1"
                    >
                      <span>Konspektlar</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import type { LessonMaterial } from '../types';
import { BookOpen, Search, Download, Eye, FileText, Presentation, X } from 'lucide-react';

interface LessonsViewProps {
  lessons: LessonMaterial[];
}

export const LessonsView: React.FC<LessonsViewProps> = ({ lessons }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState<LessonMaterial | null>(null);

  const subjects = ['Barchasi', 'Informatika', 'Algebra', 'Fizika', 'Adabiyot'];

  const filteredLessons = lessons.filter((lesson) => {
    const matchesSubject = selectedSubject === 'Barchasi' || lesson.subject === selectedSubject;
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header & Search */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Darslar va O‘quv Materiallari 📚
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            O‘qituvchilar tomonidan yuklangan taqdimotlar, konspektlar va PDF qo‘llanmalar.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Mavzular bo‘yicha qidiruv..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedSubject === sub
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Lessons Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredLessons.map((lesson) => {
          const isPpt = lesson.fileType === 'pptx';
          return (
            <div
              key={lesson.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Subject & Type Tag */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">
                    {lesson.subject}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 uppercase">
                    {isPpt ? (
                      <Presentation className="w-3.5 h-3.5 text-amber-600" />
                    ) : (
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                    )}
                    <span>{lesson.fileType} • {lesson.fileSize}</span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mb-2">
                  {lesson.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-4">
                  {lesson.description}
                </p>
              </div>

              {/* Footer info & Action buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700 block">{lesson.teacherName}</span>
                  <span>{lesson.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedLesson(lesson)}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ochish</span>
                  </button>

                  <button
                    onClick={() => alert(`"${lesson.title}" fayli yuklab olinmoqda...`)}
                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                    title="Yuklab olish"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-700">Hech qanday dars topilmadi</h3>
          <p className="text-xs text-slate-400 mt-1">
            Qidiruv so‘zini o‘zgartirib ko‘ring yoki boshqa fanni tanlang.
          </p>
        </div>
      )}

      {/* Lesson Preview Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSelectedLesson(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-100 text-indigo-800">
                {selectedLesson.subject}
              </span>
              <span className="text-xs text-slate-400">
                {selectedLesson.date}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-3">
              {selectedLesson.title}
            </h2>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 mb-6">
              <h4 className="text-xs font-bold text-slate-700 uppercase mb-1">
                Dars tavsifi va konspekti:
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                {selectedLesson.description}
              </p>
            </div>

            {/* Simulated Document Viewer Area */}
            <div className="h-44 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 mb-6 p-4 text-center">
              <Presentation className="w-10 h-10 text-indigo-500 mb-2" />
              <p className="font-bold text-sm text-slate-700">
                {selectedLesson.title} ({selectedLesson.fileType.toUpperCase()})
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Brauzer orqali taqdimotni onlayn ko‘rish va konspekt qilib olish interfeysi
              </p>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedLesson(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Yopish
              </button>
              <button
                onClick={() => {
                  alert(`Fayl saqlanmoqda: ${selectedLesson.title}`);
                  setSelectedLesson(null);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Yuklab olish ({selectedLesson.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

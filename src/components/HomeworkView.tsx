import React, { useState } from 'react';
import type { HomeworkItem } from '../types';
import { 
  CheckCircle2, 
  Clock, 
  Coins, 
  Zap, 
  Send, 
  UploadCloud, 
  MessageSquare,
  X
} from 'lucide-react';

interface HomeworkViewProps {
  homeworks: HomeworkItem[];
  onSubmitHomework: (homeworkId: string, answerText: string) => void;
  activeModalHw: HomeworkItem | null;
  setActiveModalHw: (hw: HomeworkItem | null) => void;
}

export const HomeworkView: React.FC<HomeworkViewProps> = ({
  homeworks,
  onSubmitHomework,
  activeModalHw,
  setActiveModalHw,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [answerText, setAnswerText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  const filtered = homeworks.filter((hw) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'new') return hw.status === 'new';
    if (filterStatus === 'under_review') return hw.status === 'under_review';
    if (filterStatus === 'graded') return hw.status === 'graded';
    return true;
  });

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalHw) return;
    onSubmitHomework(activeModalHw.id, answerText);
    setAnswerText('');
    setAttachedFile(null);
    setActiveModalHw(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Uy Vazifalari va Amaliy Topshiriqlar 📝
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Vazifalarni o‘z vaqtida topshirib, virtual tangalar va tajriba ballari (XP) to‘plang!
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Barchasi ({homeworks.length})
          </button>
          <button
            onClick={() => setFilterStatus('new')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'new' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Yangi ({homeworks.filter(h => h.status === 'new').length})
          </button>
          <button
            onClick={() => setFilterStatus('under_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'under_review' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Tekshiruvda
          </button>
          <button
            onClick={() => setFilterStatus('graded')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filterStatus === 'graded' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600'
            }`}
          >
            Baholangan
          </button>
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-4">
        {filtered.map((hw) => {
          const isGraded = hw.status === 'graded';
          const isReview = hw.status === 'under_review';
          const isNew = hw.status === 'new';

          return (
            <div
              key={hw.id}
              className={`bg-white rounded-2xl p-5 sm:p-6 border transition-all ${
                isNew
                  ? 'border-indigo-200/90 shadow-xs hover:shadow-md'
                  : isReview
                  ? 'border-amber-200/80 bg-amber-50/10'
                  : 'border-emerald-200/80 bg-emerald-50/10'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                
                <div className="space-y-2 flex-1">
                  {/* Status & Subject */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800">
                      {hw.subject}
                    </span>

                    {isNew && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-100 text-rose-700 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        Topshirish muddati: {hw.dueDate}
                      </span>
                    )}

                    {isReview && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        O‘qituvchi tekshirmoqda
                      </span>
                    )}

                    {isGraded && (
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Muvaffaqiyatli qabul qilindi
                      </span>
                    )}
                  </div>

                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                    {hw.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {hw.description}
                  </p>

                  {/* Teacher Feedback block if graded */}
                  {hw.teacherComment && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl mt-3 flex items-start gap-2.5">
                      <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-xs font-bold text-emerald-900 block">
                          O‘qituvchi izohi ({hw.teacherName}):
                        </span>
                        <p className="text-xs text-emerald-800 mt-0.5">
                          {hw.teacherComment}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Student Answer if in review */}
                  {isReview && hw.studentAnswer && (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                      <span className="font-bold text-slate-700">Yuborilgan javobingiz: </span>
                      {hw.studentAnswer}
                    </div>
                  )}
                </div>

                {/* Right side: Rewards & Action */}
                <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-xl text-xs font-extrabold text-amber-900">
                      <Coins className="w-4 h-4 fill-amber-500 text-amber-600" />
                      <span>+{isGraded ? hw.earnedCoins : hw.maxCoins} Tanga</span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs font-extrabold text-indigo-900">
                      <Zap className="w-4 h-4 fill-indigo-500 text-indigo-600" />
                      <span>+{isGraded ? hw.earnedXP : hw.maxXP} XP</span>
                    </div>
                  </div>

                  <div>
                    {isNew && (
                      <button
                        onClick={() => setActiveModalHw(hw)}
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2 transition-all hover:scale-[1.02]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Vazifani topshirish</span>
                      </button>
                    )}

                    {isReview && (
                      <span className="text-xs font-bold text-amber-700 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
                        Natija kutilmoqda
                      </span>
                    )}

                    {isGraded && (
                      <span className="text-xs font-bold text-emerald-700 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Baholandi
                      </span>
                    )}
                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Homework Submission Modal */}
      {activeModalHw && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setActiveModalHw(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-100 text-indigo-800">
                {activeModalHw.subject}
              </span>
              <span className="text-xs text-rose-600 font-bold">
                {activeModalHw.dueDate}
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-2">
              {activeModalHw.title}
            </h2>

            <p className="text-xs text-slate-500 mb-5">
              {activeModalHw.description}
            </p>

            <form onSubmit={handleModalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Javob matni yoki izoh
                </label>
                <textarea
                  rows={4}
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Vazifa bo‘yicha tushuntirish yoki kod natijangizni shu yerga yozing..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Drag and Drop File Simulation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Fayl yuklash (PDF, Rasm, PPTX yoki Kod)
                </label>
                <div 
                  onClick={() => setAttachedFile('vazifa_yechimi_azizbek.pdf')}
                  className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/30 transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-1.5" />
                  {attachedFile ? (
                    <span className="text-xs font-bold text-emerald-600 block">
                      ✓ Fayl biriktirildi: {attachedFile}
                    </span>
                  ) : (
                    <>
                      <span className="text-xs font-bold text-slate-700 block">
                        Faylni tanlash uchun bosing
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Maksimal hajm: 20 MB (PDF, JPG, PNG, DOCX, ZIP)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-bold">
                  <Coins className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>+{activeModalHw.maxCoins} Tanga olish imkoniyati</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModalHw(null)}
                    className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                  >
                    Bekor qilish
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Topshirish</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

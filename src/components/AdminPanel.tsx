import { useState } from 'react';
import type { LessonMaterial, RewardItem, QuizQuestion } from '../types';
import { 
  Settings, 
  BookOpen, 
  ShoppingBag, 
  Coins, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  Save, 
  Sparkles,
  History,
  Gamepad2,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AdminPanelProps {
  lessons: LessonMaterial[];
  rewards: RewardItem[];
  quizQuestions: QuizQuestion[];
  studentCoins: number;
  onUpdateReward: (id: string, data: Partial<RewardItem>) => Promise<void>;
  onCreateReward: (data: Partial<RewardItem>) => Promise<void>;
  onDeleteReward: (id: string) => Promise<void>;
  onUpdateLesson: (id: string, data: Partial<LessonMaterial>) => Promise<void>;
  onCreateLesson: (data: Partial<LessonMaterial>) => Promise<void>;
  onDeleteLesson: (id: string) => Promise<void>;
  onAdjustCoins: (amount: number, reason: string) => Promise<void>;
  onCreateQuizQuestion: (data: Partial<QuizQuestion>) => Promise<void>;
  onUpdateQuizQuestion: (id: string, data: Partial<QuizQuestion>) => Promise<void>;
  onDeleteQuizQuestion: (id: string) => Promise<void>;
}

export const AdminPanel = ({
  lessons,
  rewards,
  quizQuestions,
  studentCoins,
  onUpdateReward,
  onCreateReward,
  onDeleteReward,
  onUpdateLesson,
  onCreateLesson,
  onDeleteLesson,
  onAdjustCoins,
  onCreateQuizQuestion,
  onUpdateQuizQuestion,
  onDeleteQuizQuestion,
}: AdminPanelProps) => {
  const [adminTab, setAdminTab] = useState<'rewards' | 'lessons' | 'quiz' | 'coins'>('quiz');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Rewards states
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editStock, setEditStock] = useState<number>(0);

  // New Reward Modal
  const [showAddRewardModal, setShowAddRewardModal] = useState(false);
  const [newRewardTitle, setNewRewardTitle] = useState('');
  const [newRewardPrice, setNewRewardPrice] = useState(100);
  const [newRewardCategory, setNewRewardCategory] = useState<'digital' | 'physical' | 'privilege'>('physical');
  const [newRewardStock, setNewRewardStock] = useState(10);
  const [newRewardDesc, setNewRewardDesc] = useState('');

  // Lessons states
  const [showAddLessonModal, setShowAddLessonModal] = useState(false);
  const [newLessonTitle, setNewLessonTitle] = useState('');
  const [newLessonSubject, setNewLessonSubject] = useState('Informatika');
  const [newLessonTeacher, setNewLessonTeacher] = useState('Sardor Qodirov');
  const [newLessonType, setNewLessonType] = useState<'pdf' | 'pptx'>('pptx');
  const [newLessonDesc, setNewLessonDesc] = useState('');
  const [editingLesson, setEditingLesson] = useState<LessonMaterial | null>(null);

  // Quiz Questions states
  const [showAddQuizModal, setShowAddQuizModal] = useState(false);
  const [qSubject, setQSubject] = useState('Informatika');
  const [qTitle, setQTitle] = useState('');
  const [qTimeLimit, setQTimeLimit] = useState(15);
  const [qCoinsReward, setQCoinsReward] = useState(20);
  const [qPoints, setQPoints] = useState(800);
  const [qExplanation, setQExplanation] = useState('');
  const [qOptions, setQOptions] = useState([
    { id: 1, text: '', isRight: true },
    { id: 2, text: '', isRight: false },
    { id: 3, text: '', isRight: false },
    { id: 4, text: '', isRight: false },
  ]);
  const [editingQuestion, setEditingQuestion] = useState<QuizQuestion | null>(null);

  // Coins adjustment state
  const [coinAdjustmentAmount, setCoinAdjustmentAmount] = useState<number>(50);
  const [coinAdjustmentReason, setCoinAdjustmentReason] = useState<string>('Faollik va namunali intizom uchun rag‘batlantirish');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle fast price save
  const handleSavePrice = async (rewardId: string) => {
    try {
      await onUpdateReward(rewardId, { price: editPrice, stock: editStock });
      setEditingRewardId(null);
      showToast('Tovar narxi va qoldig‘i muvaffaqiyatli saqlandi!');
    } catch {
      showToast('Xatolik yuz berdi');
    }
  };

  // Handle add reward
  const handleCreateRewardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateReward({
        title: newRewardTitle,
        price: Number(newRewardPrice),
        category: newRewardCategory,
        stock: Number(newRewardStock),
        description: newRewardDesc,
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
      });
      setShowAddRewardModal(false);
      setNewRewardTitle('');
      setNewRewardDesc('');
      showToast('Yangi tovar do‘konga qo‘shildi!');
    } catch {
      showToast('Tovarni saqlashda xatolik yuz berdi');
    }
  };

  // Handle add lesson
  const handleCreateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onCreateLesson({
        title: newLessonTitle,
        subject: newLessonSubject,
        teacherName: newLessonTeacher,
        fileType: newLessonType,
        description: newLessonDesc,
        fileSize: '3.4 MB',
      });
      setShowAddLessonModal(false);
      setNewLessonTitle('');
      setNewLessonDesc('');
      showToast('Yangi darslik tizimga joylashtirildi!');
    } catch {
      showToast('Darslikni qo‘shishda xatolik yuz berdi');
    }
  };

  // Handle update lesson
  const handleUpdateLessonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLesson) return;
    try {
      await onUpdateLesson(editingLesson.id, editingLesson);
      setEditingLesson(null);
      showToast('Darslik ma’lumotlari muvaffaqiyatli yangilandi!');
    } catch {
      showToast('Darslikni yangilashda xatolik');
    }
  };

  // Handle add quiz question
  const handleCreateQuizQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qOptions.some((o) => o.isRight)) {
      alert('Iltimos, variantlardan kamida bittasini to‘g‘ri javob deb belgilang!');
      return;
    }
    try {
      await onCreateQuizQuestion({
        subject: qSubject,
        title: qTitle,
        timeLimit: Number(qTimeLimit),
        coinsReward: Number(qCoinsReward),
        points: Number(qPoints),
        options: qOptions,
        explanation: qExplanation,
      });
      setShowAddQuizModal(false);
      setQTitle('');
      setQExplanation('');
      setQOptions([
        { id: 1, text: '', isRight: true },
        { id: 2, text: '', isRight: false },
        { id: 3, text: '', isRight: false },
        { id: 4, text: '', isRight: false },
      ]);
      showToast('Cyber Arena uchun yangi savol muvaffaqiyatli joylandi! 🎯');
    } catch {
      showToast('Savolni qo‘shishda xatolik yuz berdi');
    }
  };

  // Handle update quiz question
  const handleUpdateQuizQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingQuestion) return;
    try {
      await onUpdateQuizQuestion(editingQuestion.id, editingQuestion);
      setEditingQuestion(null);
      showToast('Savol muvaffaqiyatli yangilandi!');
    } catch {
      showToast('Savolni yangilashda xatolik');
    }
  };

  // Handle Coin adjustment
  const handleCoinAdjustmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onAdjustCoins(coinAdjustmentAmount, coinAdjustmentReason);
      showToast(`O‘quvchiga ${coinAdjustmentAmount > 0 ? '+' : ''}${coinAdjustmentAmount} tanga o‘tkazildi!`);
    } catch {
      showToast('Tangalarni o‘zgartirishda xatolik');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30 mb-3">
            <Settings className="w-4 h-4 text-indigo-400" />
            <span>Administrator Boshqaruv Markazi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Maktab Ta’lim, Cyber Arena va Do‘kon Boshqaruvi 🛠️
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mt-1">
            Ushbu panel orqali Cyber Arena savollarini joylash, darsliklarni tahrirlash, mukofotlar do‘konidagi narxlarni o‘zgartirish va tangalar aylanmasini boshqarishingiz mumkin.
          </p>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-4 gap-2.5 bg-white/5 p-3 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center px-2 py-1">
            <span className="block text-slate-400 text-[10px] font-bold uppercase">Savollar</span>
            <span className="text-lg font-black text-rose-400">{quizQuestions.length} ta</span>
          </div>
          <div className="text-center px-2 py-1 border-x border-white/10">
            <span className="block text-slate-400 text-[10px] font-bold uppercase">Darsliklar</span>
            <span className="text-lg font-black text-indigo-400">{lessons.length} ta</span>
          </div>
          <div className="text-center px-2 py-1 border-r border-white/10">
            <span className="block text-slate-400 text-[10px] font-bold uppercase">Tovarlar</span>
            <span className="text-lg font-black text-amber-400">{rewards.length} ta</span>
          </div>
          <div className="text-center px-2 py-1">
            <span className="block text-slate-400 text-[10px] font-bold uppercase">Aylanma</span>
            <span className="text-lg font-black text-emerald-400">{studentCoins} 🪙</span>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setAdminTab('quiz')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'quiz'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>⚡ Cyber Arena Savollari ({quizQuestions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('rewards')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'rewards'
              ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Do‘kon va Narxlar boshqaruvi</span>
        </button>

        <button
          onClick={() => setAdminTab('lessons')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'lessons'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Darsliklar va Materiallar</span>
        </button>

        <button
          onClick={() => setAdminTab('coins')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            adminTab === 'coins'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Coins className="w-4 h-4" />
          <span>Tangalar va O‘quvchi hisobi</span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB: CYBER ARENA QUESTIONS (SAVOLLARNI JOYLAB BO'LADIGAN QILISH) */}
      {/* ============================================================== */}
      {adminTab === 'quiz' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>Cyber Arena Viktorina Savollari Boshqaruvi</span>
                <span className="px-2 py-0.5 rounded-full text-xs bg-rose-100 text-rose-700 font-bold">
                  {quizQuestions.length} ta faol savol
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                O‘quvchilar Cyber Arenaga kirganda aynan shu savollar ketma-ket chiqadi. Yangi savollar qo‘shing yoki mavjudlarini tahrirlang.
              </p>
            </div>

            <button
              onClick={() => setShowAddQuizModal(true)}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-rose-200 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Savol Joylash</span>
            </button>
          </div>

          {/* Questions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizQuestions.map((q, index) => (
              <div
                key={q.id}
                className="bg-white rounded-3xl p-5 border border-slate-200/90 shadow-xs hover:border-rose-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-rose-50 text-rose-700">
                      #{index + 1} • {q.subject}
                    </span>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                        <Clock className="w-3.5 h-3.5" />
                        {q.timeLimit}s
                      </span>
                      <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        <Coins className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        +{q.coinsReward}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mb-3 leading-snug">
                    {q.title}
                  </h3>

                  {/* Options List with green indicator for correct answer */}
                  <div className="space-y-1.5 mb-4">
                    {q.options.map((opt) => (
                      <div
                        key={opt.id}
                        className={`px-3 py-2 rounded-xl text-xs flex items-center justify-between font-semibold border transition-colors ${
                          opt.isRight
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        <span className="truncate">{opt.text}</span>
                        {opt.isRight && (
                          <span className="flex items-center gap-1 text-[11px] text-emerald-700 font-extrabold shrink-0 ml-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            To‘g‘ri
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  {q.explanation && (
                    <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 line-clamp-2 mb-3">
                      💡 <strong>Izoh:</strong> {q.explanation}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{q.points} ball</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Tahrirlash</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Ushbu savolni o‘chirmoqchimisiz?`)) {
                          onDeleteQuizQuestion(q.id);
                          showToast('Savol o‘chirildi');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="O‘chirish"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: REWARDS & PRICE MANAGEMENT                              */}
      {/* ============================================================== */}
      {adminTab === 'rewards' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Reward Shop Tovarlari va Narxlar Ro‘yxati
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                O‘quvchilar ko‘radigan narx va qoldiqni shu yerdan to‘g‘ridan-to‘g‘ri o‘zgartirishingiz mumkin.
              </p>
            </div>

            <button
              onClick={() => setShowAddRewardModal(true)}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-200 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Tovar Qo‘shish</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="py-3 px-4">Tovar</th>
                    <th className="py-3 px-4">Toifasi</th>
                    <th className="py-3 px-4">Narxi (Tanga)</th>
                    <th className="py-3 px-4">Qoldiq (Soni)</th>
                    <th className="py-3 px-4 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rewards.map((reward) => {
                    const isEditing = editingRewardId === reward.id;

                    return (
                      <tr key={reward.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4 flex items-center gap-3">
                          <img
                            src={reward.image}
                            alt={reward.title}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{reward.title}</span>
                            <span className="text-xs text-slate-400 line-clamp-1">{reward.description}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700">
                            {reward.category === 'digital' ? 'Raqamli' : reward.category === 'physical' ? 'Jismoniy' : 'Imtiyoz'}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(Number(e.target.value))}
                                className="w-20 px-2 py-1 text-sm font-black border-2 border-amber-400 rounded-lg focus:outline-none"
                              />
                              <span className="text-xs font-bold text-amber-700">🪙</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 font-black text-amber-900">
                              <Coins className="w-4 h-4 fill-amber-500 text-amber-500" />
                              <span>{reward.price} tanga</span>
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editStock}
                              onChange={(e) => setEditStock(Number(e.target.value))}
                              className="w-16 px-2 py-1 text-sm font-bold border-2 border-slate-300 rounded-lg focus:outline-none"
                            />
                          ) : (
                            <span className="text-xs font-bold text-slate-600">
                              {reward.stock} dona
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSavePrice(reward.id)}
                                className="p-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs"
                                title="Saqlash"
                              >
                                <Save className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setEditingRewardId(null)}
                                className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg"
                                title="Bekor qilish"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setEditingRewardId(reward.id);
                                  setEditPrice(reward.price);
                                  setEditStock(reward.stock);
                                }}
                                className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg text-xs font-bold flex items-center gap-1 border border-amber-200 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Narxni o‘zgartirish</span>
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`"${reward.title}" tovarini rostdan ham o‘chirmoqchimisiz?`)) {
                                    onDeleteReward(reward.id);
                                    showToast('Tovar o‘chirildi');
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                title="O‘chirish"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LESSONS & MATERIALS MANAGEMENT                          */}
      {/* ============================================================== */}
      {adminTab === 'lessons' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                Darsliklar va O‘quv Taqdimotlari Boshqaruvi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Mavjud darsliklarni tahrirlang yoki yangi mavzu konspektlarini platformaga joylashtiring.
              </p>
            </div>

            <button
              onClick={() => setShowAddLessonModal(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-indigo-200 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Yangi Darslik Qo‘shish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 text-indigo-700">
                      {lesson.subject}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      {lesson.fileType} • {lesson.fileSize}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base mb-2">
                    {lesson.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{lesson.teacherName} ({lesson.date})</span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingLesson(lesson)}
                      className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg font-bold flex items-center gap-1 transition-colors"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Tahrirlash</span>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`"${lesson.title}" darsligini o‘chirmoqchimisiz?`)) {
                          onDeleteLesson(lesson.id);
                          showToast('Darslik o‘chirildi');
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: COINS ADJUSTMENT & STUDENT AUDIT                        */}
      {/* ============================================================== */}
      {adminTab === 'coins' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                O‘quvchiga Tangalar Qo‘shish / Rag‘batlantirish
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Maktab tadbirlaridagi g‘alaba yoki faollik uchun o‘quvchi hisobiga qo‘shimcha virtual tangalar o‘tkazish.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-900 block">Tanlangan O‘quvchi:</span>
                <span className="font-extrabold text-slate-900">Azizbek Rahimov (7-"B" sinf)</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-amber-800 block">Joriy Balans:</span>
                <span className="text-xl font-black text-amber-950">{studentCoins} 🪙</span>
              </div>
            </div>

            <form onSubmit={handleCoinAdjustmentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  O‘tkaziladigan tangalar miqdori (+ yoki -)
                </label>
                <input
                  type="number"
                  value={coinAdjustmentAmount}
                  onChange={(e) => setCoinAdjustmentAmount(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-black text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  O‘tkazish sababi (Audit jurnali uchun)
                </label>
                <textarea
                  rows={3}
                  value={coinAdjustmentReason}
                  onChange={(e) => setCoinAdjustmentReason(e.target.value)}
                  placeholder="Masalan: Maktab olimpiadasida 1-o‘rinni olgani uchun"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-extrabold rounded-xl shadow-md shadow-amber-200 flex items-center justify-center gap-2 text-sm transition-all"
              >
                <Coins className="w-4 h-4 fill-white" />
                <span>Tangalarni tasdiqlash va o‘tkazish</span>
              </button>
            </form>
          </div>

          <div className="lg:col-span-6 bg-slate-900 text-white p-6 rounded-3xl shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                <History className="w-4 h-4" />
                <span>Xavfsiz Server Tranzaksiyalari</span>
              </div>
              <h3 className="text-xl font-black mb-3">
                Shaffoflik va Audit Nazorati
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Barcha operatsiyalar (vazifalar uchun tanga berish, Cyber Arena yutuqlari va Do‘kondagi xaridlar) backend ma’lumotlar bazasida atomar qayd etiladi. Hech bir tanga izsiz yo‘qolmaydi va soxtalashtirilmaydi.
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">"Farhod va Shirin" vazifasi uchun mukofot</span>
                  <span className="text-emerald-400 font-bold">+40 tanga</span>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between">
                  <span className="text-slate-300">Cyber Arena 1-o‘rin</span>
                  <span className="text-emerald-400 font-bold">+25 tanga</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
              <span>Status: Backend API faol</span>
              <span>Port: 5000</span>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW CYBER ARENA QUESTION                            */}
      {/* ============================================================== */}
      {showAddQuizModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddQuizModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1 flex items-center gap-2">
              <Gamepad2 className="w-6 h-6 text-rose-600" />
              <span>Cyber Arena uchun Yangi Savol</span>
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Savol matnini va 4 ta variantni kiriting. To‘g‘ri javobning doirachasini belgilang.
            </p>

            <form onSubmit={handleCreateQuizQuestionSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Fan Nomi
                  </label>
                  <input
                    type="text"
                    value={qSubject}
                    onChange={(e) => setQSubject(e.target.value)}
                    placeholder="Masalan: Informatika"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Vaqt (Sekund)
                  </label>
                  <select
                    value={qTimeLimit}
                    onChange={(e) => setQTimeLimit(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value={10}>10 soniya</option>
                    <option value={15}>15 soniya</option>
                    <option value={20}>20 soniya</option>
                    <option value={30}>30 soniya</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Savol Matni
                </label>
                <textarea
                  rows={2}
                  value={qTitle}
                  onChange={(e) => setQTitle(e.target.value)}
                  placeholder="Masalan: Kompyuter xotirasining eng kichik o‘lchov birligi nima?"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-semibold"
                  required
                />
              </div>

              {/* 4 Options with Radio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  4 ta Javob Varianti (To‘g‘ri javobni tanlang):
                </label>
                <div className="space-y-2.5">
                  {qOptions.map((opt, idx) => (
                    <div 
                      key={opt.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${
                        opt.isRight ? 'bg-emerald-50/80 border-emerald-400' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="correctOption"
                        checked={opt.isRight}
                        onChange={() => {
                          setQOptions((prev) =>
                            prev.map((o) => ({ ...o, isRight: o.id === opt.id }))
                          );
                        }}
                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 cursor-pointer ml-1"
                        id={`opt-radio-${opt.id}`}
                      />
                      <span className="text-xs font-black text-slate-400 w-4">
                        {String.fromCharCode(65 + idx)}:
                      </span>
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setQOptions((prev) =>
                            prev.map((o) => (o.id === opt.id ? { ...o, text: val } : o))
                          );
                        }}
                        placeholder={`Variant ${idx + 1}...`}
                        className="flex-1 bg-transparent text-xs sm:text-sm font-semibold focus:outline-none"
                        required
                      />
                      {opt.isRight && (
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                          To‘g‘ri
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rewards */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Mukofot (Tanga)
                  </label>
                  <input
                    type="number"
                    value={qCoinsReward}
                    onChange={(e) => setQCoinsReward(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-black text-amber-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Maksimal Ball
                  </label>
                  <input
                    type="number"
                    value={qPoints}
                    onChange={(e) => setQPoints(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm font-black text-indigo-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Yechim izohi (Ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={qExplanation}
                  onChange={(e) => setQExplanation(e.target.value)}
                  placeholder="Masalan: Bit — axborotning eng kichik birligidir."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddQuizModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Savolni Saqlash</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT QUIZ QUESTION                                      */}
      {/* ============================================================== */}
      {editingQuestion && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingQuestion(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Savolni Tahrirlash ✏️
            </h3>

            <form onSubmit={handleUpdateQuizQuestionSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mavzu / Savol Matni
                </label>
                <input
                  type="text"
                  value={editingQuestion.title}
                  onChange={(e) => setEditingQuestion({ ...editingQuestion, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Variantlar:
                </label>
                <div className="space-y-2">
                  {editingQuestion.options.map((opt) => (
                    <div 
                      key={opt.id}
                      className={`flex items-center gap-2 p-2 rounded-xl border ${
                        opt.isRight ? 'bg-emerald-50 border-emerald-400' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="editCorrectOption"
                        checked={opt.isRight}
                        onChange={() => {
                          setEditingQuestion({
                            ...editingQuestion,
                            options: editingQuestion.options.map((o) => ({
                              ...o,
                              isRight: o.id === opt.id,
                            })),
                          });
                        }}
                        className="w-4 h-4 text-emerald-600 cursor-pointer ml-1"
                      />
                      <input
                        type="text"
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingQuestion({
                            ...editingQuestion,
                            options: editingQuestion.options.map((o) =>
                              o.id === opt.id ? { ...o, text: val } : o
                            ),
                          });
                        }}
                        className="flex-1 bg-transparent text-sm font-semibold focus:outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingQuestion(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW REWARD                                          */}
      {/* ============================================================== */}
      {showAddRewardModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowAddRewardModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Yangi Mukofot Qo‘shish 🎁
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Reward Shop vitrinasida paydo bo‘ladigan tovar parametrlari.
            </p>

            <form onSubmit={handleCreateRewardSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tovar Nomi
                </label>
                <input
                  type="text"
                  value={newRewardTitle}
                  onChange={(e) => setNewRewardTitle(e.target.value)}
                  placeholder="Masalan: Maktab futbolkasi"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Narxi (Tanga)
                  </label>
                  <input
                    type="number"
                    value={newRewardPrice}
                    onChange={(e) => setNewRewardPrice(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Qoldiq (Soni)
                  </label>
                  <input
                    type="number"
                    value={newRewardStock}
                    onChange={(e) => setNewRewardStock(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Toifasi
                </label>
                <select
                  value={newRewardCategory}
                  onChange={(e) => setNewRewardCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="digital">Raqamli (Avatar, Ramka)</option>
                  <option value="physical">Jismoniy (Daftar, Termos, Ruchka)</option>
                  <option value="privilege">Ta’limiy Imtiyoz (Immunitet kuponi)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tavsifi
                </label>
                <textarea
                  rows={2}
                  value={newRewardDesc}
                  onChange={(e) => setNewRewardDesc(e.target.value)}
                  placeholder="Mukofot haqida qisqacha ma’lumot..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddRewardModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-200"
                >
                  Qo‘shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: ADD NEW LESSON                                          */}
      {/* ============================================================== */}
      {showAddLessonModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setShowAddLessonModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Yangi Darslik Joylashtirish 📚
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              O‘quvchilar ko‘rishi uchun yangi mavzu yoki taqdimot kiriting.
            </p>

            <form onSubmit={handleCreateLessonSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dars / Mavzu Nomi
                </label>
                <input
                  type="text"
                  value={newLessonTitle}
                  onChange={(e) => setNewLessonTitle(e.target.value)}
                  placeholder="Masalan: Web dasturlash: HTML asoslari"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Fani
                  </label>
                  <input
                    type="text"
                    value={newLessonSubject}
                    onChange={(e) => setNewLessonSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Fayl Turi
                  </label>
                  <select
                    value={newLessonType}
                    onChange={(e) => setNewLessonType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pptx">Taqdimot (PPTX)</option>
                    <option value="pdf">Hujjat (PDF)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  O‘qituvchi Ismi
                </label>
                <input
                  type="text"
                  value={newLessonTeacher}
                  onChange={(e) => setNewLessonTeacher(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Dars Tavsifi / Konspekt
                </label>
                <textarea
                  rows={3}
                  value={newLessonDesc}
                  onChange={(e) => setNewLessonDesc(e.target.value)}
                  placeholder="Dars mavzusiga doir asosiy ma’lumotlar..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddLessonModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200"
                >
                  Joylashtirish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: EDIT EXISTING LESSON                                    */}
      {/* ============================================================== */}
      {editingLesson && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setEditingLesson(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Darslikni Tahrirlash ✏️
            </h3>

            <form onSubmit={handleUpdateLessonSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Mavzu Nomi
                </label>
                <input
                  type="text"
                  value={editingLesson.title}
                  onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Fani
                </label>
                <input
                  type="text"
                  value={editingLesson.subject}
                  onChange={(e) => setEditingLesson({ ...editingLesson, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Tavsifi
                </label>
                <textarea
                  rows={3}
                  value={editingLesson.description}
                  onChange={(e) => setEditingLesson({ ...editingLesson, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingLesson(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

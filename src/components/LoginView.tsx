import React, { useState } from 'react';
import type { UserRole, UserProfile } from '../types';
import { api } from '../api/client';
import { 
  Sparkles, 
  ShieldCheck, 
  Gamepad2, 
  ArrowRight, 
  BookOpen, 
  Coins, 
  UserPlus, 
  LogIn, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: UserRole, user?: UserProfile) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Login form state
  const [selectedRole, setSelectedRole] = useState<UserRole>('STUDENT');
  const [schoolCode, setSchoolCode] = useState('MAKTAB-01');
  const [loginId, setLoginId] = useState('7B-2401');
  const [password, setPassword] = useState('password');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setLoginId('admin');
      setPassword('admin');
    } else if (role === 'TEACHER') {
      setLoginId('teacher');
      setPassword('teacher');
    } else {
      setLoginId('7B-2401');
      setPassword('password');
    }
  };

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regSchoolName, setRegSchoolName] = useState('Prezident ixtisoslashtirilgan 1-maktabi');
  const [regClassName, setRegClassName] = useState('7-"B" sinf');
  const [regLoginId, setRegLoginId] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const res = await api.loginUser({
        loginId,
        password,
        role: selectedRole,
      });

      if (res && res.user) {
        onLogin(selectedRole, res.user);
      } else {
        onLogin(selectedRole);
      }
    } catch (err: any) {
      console.warn('Backend login fallback to mock:', err);
      // Fallback: don't block user if backend is offline or starting
      onLogin(selectedRole);
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regFullName.trim() || !regLoginId.trim() || !regPassword.trim()) {
      setErrorMessage('Iltimos, barcha maydonlarni to‘liq to‘ldiring');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage('Parol kamida 4 ta belgidan iborat bo‘lishi shart');
      return;
    }

    setLoading(true);

    try {
      const res = await api.registerStudent({
        fullName: regFullName,
        schoolName: regSchoolName,
        className: regClassName,
        loginId: regLoginId,
        password: regPassword,
      });

      setSuccessMessage(res.message || 'Hisob muvaffaqiyatli yaratildi!');
      setTimeout(() => {
        onLogin('STUDENT', res.user);
      }, 800);
    } catch (err: any) {
      console.warn('Backend register offline, creating local session:', err);
      const fallbackUser: UserProfile = {
        id: `usr-st-${Date.now()}`,
        fullName: regFullName.trim(),
        role: 'STUDENT',
        schoolName: regSchoolName || 'Prezident ixtisoslashtirilgan 1-maktabi',
        className: regClassName,
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        coins: 100,
        xp: 50,
        level: 1,
        rank: 4,
        streakDays: 1,
        loginId: regLoginId,
      };
      setSuccessMessage('Hisob muvaffaqiyatli yaratildi! +100 bonus tangalar taqdim etildi.');
      setTimeout(() => {
        onLogin('STUDENT', fallbackUser);
      }, 800);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-white/20">
        
        {/* Left column: Login / Register Forms */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <span className="font-extrabold text-2xl text-slate-900 tracking-tight">
                  MaktabZiyo
                </span>
                <span className="block text-xs font-semibold text-indigo-600">
                  Gamifikatsiyalangan Ta’lim Tizimi
                </span>
              </div>
            </div>

            {/* Auth Mode Toggle (Kirish vs Hisob yaratish) */}
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl mb-6">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'login'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Tizimga kirish</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setErrorMessage('');
                  setSuccessMessage('');
                }}
                className={`py-2.5 text-xs sm:text-sm font-extrabold rounded-xl transition-all flex items-center justify-center gap-2 ${
                  authMode === 'register'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserPlus className="w-4 h-4" />
                <span>Hisob yaratish</span>
                <span className="px-1.5 py-0.2 bg-amber-400 text-slate-900 text-[10px] font-black rounded-full">
                  +100🪙
                </span>
              </button>
            </div>

            {/* Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* --- REGISTER FORM --- */}
            {authMode === 'register' ? (
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div className="mb-2">
                  <h2 className="text-xl font-extrabold text-slate-900">
                    O‘quvchi hisobini ochish 🎓
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hisob yarating va darhol 100 bonus tangaga ega bo‘ling!
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Ism va Familiyangiz *
                  </label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Masalan: Sardor Alimov"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Sinfingiz *
                    </label>
                    <select
                      value={regClassName}
                      onChange={(e) => setRegClassName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
                    >
                      <option value="5-“A” sinf">5-“A” sinf</option>
                      <option value="6-“A” sinf">6-“A” sinf</option>
                      <option value="7-“A” sinf">7-“A” sinf</option>
                      <option value="7-“B” sinf">7-“B” sinf</option>
                      <option value="8-“A” sinf">8-“A” sinf</option>
                      <option value="9-“A” sinf">9-“A” sinf</option>
                      <option value="10-“A” sinf">10-“A” sinf</option>
                      <option value="11-“A” sinf">11-“A” sinf</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Yangi Login *
                    </label>
                    <input
                      type="text"
                      value={regLoginId}
                      onChange={(e) => setRegLoginId(e.target.value)}
                      placeholder="sardor_07"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Maktab nomi
                  </label>
                  <input
                    type="text"
                    value={regSchoolName}
                    onChange={(e) => setRegSchoolName(e.target.value)}
                    placeholder="Maktabingiz nomi"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Parol tanlang (kamida 4 belgi) *
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center gap-2 text-xs text-amber-900 font-semibold">
                  <Coins className="w-5 h-5 text-amber-600 fill-amber-500 shrink-0" />
                  <span>Ro‘yxatdan o‘tganingizda profilingizga darhol <strong>+100 tanga</strong> taqdim etiladi!</span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>{loading ? 'Yaratilmoqda...' : 'Hisob yaratish & Kirish'}</span>
                </button>
              </form>
            ) : (
              /* --- LOGIN FORM --- */
              <>
                <div className="mb-4">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    Xush kelibsiz! 👋
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Maktab ma’muriyati tomonidan berilgan login va parolingiz orqali tizimga kiring.
                  </p>
                </div>

                {/* Role Selector Tabs */}
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                  <button
                    type="button"
                    onClick={() => handleRoleChange('STUDENT')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedRole === 'STUDENT'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    O‘quvchi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('TEACHER')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedRole === 'TEACHER'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    O‘qituvchi
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleChange('ADMIN')}
                    className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                      selectedRole === 'ADMIN'
                        ? 'bg-white text-indigo-700 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Administrator
                  </button>
                </div>

                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Maktab kodi
                    </label>
                    <input
                      type="text"
                      value={schoolCode}
                      onChange={(e) => setSchoolCode(e.target.value)}
                      placeholder="Masalan: MAKTAB-01"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Login yoki O‘quvchi ID
                    </label>
                    <input
                      type="text"
                      value={loginId}
                      onChange={(e) => setLoginId(e.target.value)}
                      placeholder="Masalan: 7B-2401"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 uppercase">
                        Maxfiy Parol
                      </label>
                      <a href="#help" className="text-xs text-indigo-600 hover:underline">
                        Parolni unutdingizmi?
                      </a>
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] cursor-pointer disabled:opacity-50"
                  >
                    <span>{loading ? 'Kirilmoqda...' : 'Tizimga kirish'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Demo Button */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onLogin('STUDENT')}
                    className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold rounded-xl shadow-md shadow-amber-200 flex items-center justify-center gap-2 text-xs sm:text-sm transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>1-klik bilan Demo O‘quvchi sifatida kirish</span>
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="mt-6 text-xs text-slate-400 text-center">
            &copy; 2026 MaktabZiyo. Barcha huquqlar himoyalangan.
          </div>
        </div>

        {/* Right column: Highlights and Gamification Teaser */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-800 to-purple-900 p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold text-amber-300 border border-white/10 mb-6">
              <Gamepad2 className="w-4 h-4" />
              Yangi avlod ta’lim platformasi
            </span>

            <h2 className="text-2xl sm:text-3xl font-extrabold leading-snug mb-4">
              O‘qish va rivojlanish endi yanada qiziqarli! 🚀
            </h2>

            <p className="text-sm text-indigo-100/90 leading-relaxed mb-8">
              Oddiy baholardan tashqari har bir vazifani o‘z vaqtida bajaring, Quiz Arena viktorinalarida bellashing va maktab do‘konida mukofotlar yutib oling.
            </p>

            {/* Feature Cards */}
            <div className="space-y-3.5">
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center shrink-0 font-bold">
                  <Coins className="w-5 h-5 text-amber-950" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Virtual Tangalar & XP</h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Har bir to‘g‘ri bajarilgan vazifa va faollik uchun tangalar beriladi.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-emerald-400 text-slate-900 flex items-center justify-center shrink-0 font-bold">
                  <Gamepad2 className="w-5 h-5 text-emerald-950" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Quiz Arena</h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Dars vaqtida o‘qituvchi bilan birgalikda jonli interaktiv viktorinalar.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
                <div className="w-9 h-9 rounded-xl bg-purple-400 text-slate-900 flex items-center justify-center shrink-0 font-bold">
                  <BookOpen className="w-5 h-5 text-purple-950" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Bugungi Dars Jadvali & Materiallar</h3>
                  <p className="text-xs text-indigo-200 mt-0.5">
                    Qo‘ng‘iroqlar, xonalar va PDF taqdimotlar har doim qo‘l ostingizda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 mt-6 border-t border-white/10 text-xs text-indigo-200 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Xavfsiz maktab tarmog‘i
            </span>
            <span>v1.2 Fullstack Vercel Ready</span>
          </div>
        </div>

      </div>
    </div>
  );
};

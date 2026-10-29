import type { LessonMaterial, RewardItem, HomeworkItem, UserProfile, QuizQuestion, ScheduleItem, UserRole } from '../types';

const BASE_URL = (import.meta.env?.VITE_API_URL as string | undefined) || '';
const url = (path: string) => `${BASE_URL}${path}`;

export const api = {
  // Lessons
  async getLessons(): Promise<LessonMaterial[]> {
    const res = await fetch(url('/api/lessons'));
    if (!res.ok) throw new Error('Darsliklarni yuklab bo‘lmadi');
    return res.json();
  },

  async createLesson(data: Partial<LessonMaterial>): Promise<LessonMaterial> {
    const res = await fetch(url('/api/lessons'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Darslikni yaratishda xatolik yuz berdi');
    return res.json();
  },

  async updateLesson(id: string, data: Partial<LessonMaterial>): Promise<LessonMaterial> {
    const res = await fetch(url(`/api/lessons/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Darslikni yangilab bo‘lmadi');
    return res.json();
  },

  async deleteLesson(id: string): Promise<void> {
    const res = await fetch(url(`/api/lessons/${id}`), { method: 'DELETE' });
    if (!res.ok) throw new Error('Darslikni o‘chirib bo‘lmadi');
  },

  // Rewards (Do'kon va narxlar)
  async getRewards(): Promise<RewardItem[]> {
    const res = await fetch(url('/api/rewards'));
    if (!res.ok) throw new Error('Mukofotlarni yuklab bo‘lmadi');
    return res.json();
  },

  async updateReward(id: string, data: Partial<RewardItem>): Promise<RewardItem> {
    const res = await fetch(url(`/api/rewards/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Mukofot narxi yoki ma’lumotini yangilab bo‘lmadi');
    return res.json();
  },

  async createReward(data: Partial<RewardItem>): Promise<RewardItem> {
    const res = await fetch(url('/api/rewards'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Yangi mukofot qo‘shishda xatolik yuz berdi');
    return res.json();
  },

  async deleteReward(id: string): Promise<void> {
    const res = await fetch(url(`/api/rewards/${id}`), { method: 'DELETE' });
    if (!res.ok) throw new Error('Mukofotni o‘chirib bo‘lmadi');
  },

  async purchaseReward(id: string): Promise<{ success: boolean; message: string; newBalance: number; rewardStock: number }> {
    const res = await fetch(url(`/api/rewards/${id}/purchase`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Xaridni amalga oshirib bo‘lmadi');
    return data;
  },

  // Homeworks
  async getHomeworks(): Promise<HomeworkItem[]> {
    const res = await fetch(url('/api/homeworks'));
    if (!res.ok) throw new Error('Vazifalarni yuklab bo‘lmadi');
    return res.json();
  },

  async submitHomework(id: string, answerText: string): Promise<any> {
    const res = await fetch(url(`/api/homeworks/${id}/submit`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answerText }),
    });
    if (!res.ok) throw new Error('Vazifani yuborishda xatolik yuz berdi');
    return res.json();
  },

  // Cyber / Quiz Arena Questions
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    const res = await fetch(url('/api/quiz-questions'));
    if (!res.ok) throw new Error('Quiz savollarini yuklab bo‘lmadi');
    return res.json();
  },

  async createQuizQuestion(data: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const res = await fetch(url('/api/quiz-questions'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Savol qo‘shishda xatolik yuz berdi');
    return res.json();
  },

  async updateQuizQuestion(id: string, data: Partial<QuizQuestion>): Promise<QuizQuestion> {
    const res = await fetch(url(`/api/quiz-questions/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Savolni yangilab bo‘lmadi');
    return res.json();
  },

  async deleteQuizQuestion(id: string): Promise<void> {
    const res = await fetch(url(`/api/quiz-questions/${id}`), { method: 'DELETE' });
    if (!res.ok) throw new Error('Savolni o‘chirib bo‘lmadi');
  },

  // User & Admin Stats
  async getUserProfile(): Promise<UserProfile> {
    const res = await fetch(url('/api/user/profile'));
    if (!res.ok) throw new Error('Foydalanuvchi ma’lumotini yuklab bo‘lmadi');
    return res.json();
  },

  async adjustCoins(amount: number, reason: string): Promise<{ success: boolean; newBalance: number }> {
    const res = await fetch(url('/api/user/adjust-coins'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount, reason }),
    });
    if (!res.ok) throw new Error('Tangalarni o‘zgartirib bo‘lmadi');
    return res.json();
  },

  async getAdminStats(): Promise<{
    totalLessons: number;
    totalRewards: number;
    totalHomeworks: number;
    totalCirculatingCoins: number;
    totalTransactions: number;
    recentTransactions: any[];
  }> {
    const res = await fetch(url('/api/admin/stats'));
    if (!res.ok) throw new Error('Statistikani yuklab bo‘lmadi');
    return res.json();
  },

  // --------------------------------------------------
  // Bugungi Dars Jadvali API
  // --------------------------------------------------
  async getSchedule(): Promise<ScheduleItem[]> {
    const res = await fetch(url('/api/schedule'));
    if (!res.ok) throw new Error('Dars jadvalini yuklab bo‘lmadi');
    return res.json();
  },

  async createScheduleItem(data: Partial<ScheduleItem>): Promise<ScheduleItem> {
    const res = await fetch(url('/api/schedule'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Dars jadvaliga dars qo‘shib bo‘lmadi');
    return res.json();
  },

  // --------------------------------------------------
  // Hisob Yaratish & Avtorizatsiya API
  // --------------------------------------------------
  async registerStudent(data: {
    fullName: string;
    schoolName?: string;
    className: string;
    loginId: string;
    password: string;
  }): Promise<{ success: boolean; message: string; user: UserProfile }> {
    const res = await fetch(url('/api/auth/register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Hisob yaratishda xatolik yuz berdi');
    return result;
  },

  async loginUser(data: {
    loginId?: string;
    password?: string;
    role?: UserRole;
  }): Promise<{ success: boolean; user: UserProfile }> {
    const res = await fetch(url('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Kirishda xatolik yuz berdi');
    return result;
  },
};

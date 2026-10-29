import express, { Request, Response } from 'express';
import cors from 'cors';
import { getDb, saveDb, LessonMaterial, RewardItem, QuizQuestion, ScheduleItem, UserProfile } from './db';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----------------------------------------------------
// Health Check
// ----------------------------------------------------
app.get(['/', '/api', '/api/health'], (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'MaktabZiyo API is running', serverTime: new Date().toISOString() });
});

// ----------------------------------------------------
// 1. LESSONS API (Darsliklar va materiallar)
// ----------------------------------------------------
app.get('/api/lessons', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.lessons);
});

// Admin creates lesson
app.post('/api/lessons', (req: Request, res: Response) => {
  const db = getDb();
  const { title, subject, teacherName, description, fileType, fileSize } = req.body;

  if (!title || !subject) {
    return res.status(400).json({ error: 'Mavzu nomi va fani kiritilishi shart' });
  }

  const newLesson: LessonMaterial = {
    id: `les-${Date.now()}`,
    title,
    subject,
    teacherName: teacherName || 'Noma’lum o‘qituvchi',
    date: new Date().toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long', year: 'numeric' }),
    fileType: fileType || 'pdf',
    fileSize: fileSize || '2.5 MB',
    description: description || '',
  };

  db.lessons.unshift(newLesson);
  saveDb(db);
  res.status(201).json(newLesson);
});

// Admin updates lesson
app.put('/api/lessons/:id', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  const index = db.lessons.findIndex((l) => l.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Darslik topilmadi' });
  }

  db.lessons[index] = {
    ...db.lessons[index],
    ...req.body,
    id, // preserve ID
  };

  saveDb(db);
  res.json(db.lessons[index]);
});

// Admin deletes lesson
app.delete('/api/lessons/:id', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  const initialLength = db.lessons.length;
  db.lessons = db.lessons.filter((l) => l.id !== id);

  if (db.lessons.length === initialLength) {
    return res.status(404).json({ error: 'Darslik topilmadi' });
  }

  saveDb(db);
  res.json({ success: true, message: 'Darslik muvaffaqiyatli o‘chirildi' });
});

// ----------------------------------------------------
// 2. REWARD SHOP API (Do'kon va narxlar boshqaruvi)
// ----------------------------------------------------
app.get('/api/rewards', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.rewards);
});

// Admin updates reward (Price change, stock change, details)
app.put('/api/rewards/:id', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  const index = db.rewards.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Mukofot tovari topilmadi' });
  }

  const { price, stock, title, description, category, isPopular } = req.body;

  db.rewards[index] = {
    ...db.rewards[index],
    price: price !== undefined ? Number(price) : db.rewards[index].price,
    stock: stock !== undefined ? Number(stock) : db.rewards[index].stock,
    title: title !== undefined ? title : db.rewards[index].title,
    description: description !== undefined ? description : db.rewards[index].description,
    category: category !== undefined ? category : db.rewards[index].category,
    isPopular: isPopular !== undefined ? isPopular : db.rewards[index].isPopular,
  };

  saveDb(db);
  res.json(db.rewards[index]);
});

// Admin adds new reward
app.post('/api/rewards', (req: Request, res: Response) => {
  const db = getDb();
  const { title, price, category, description, stock, image } = req.body;

  if (!title || price === undefined) {
    return res.status(400).json({ error: 'Tovar nomi va narxi (tanga) kiritilishi shart' });
  }

  const newReward: RewardItem = {
    id: `rew-${Date.now()}`,
    title,
    price: Number(price),
    category: category || 'digital',
    description: description || '',
    stock: stock !== undefined ? Number(stock) : 10,
    image: image || 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
    isPopular: false,
  };

  db.rewards.unshift(newReward);
  saveDb(db);
  res.status(201).json(newReward);
});

// Admin deletes reward
app.delete('/api/rewards/:id', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  db.rewards = db.rewards.filter((r) => r.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Mukofot tovari o‘chirildi' });
});

// Student purchases reward (Atomic server-side check)
app.post('/api/rewards/:id/purchase', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  const reward = db.rewards.find((r) => r.id === id);

  if (!reward) {
    return res.status(404).json({ error: 'Tovar topilmadi' });
  }

  if (reward.stock <= 0) {
    return res.status(400).json({ error: 'Kechirasiz, ushbu tovar do‘konda tugagan' });
  }

  // Find student (first student)
  const student = db.users.find((u) => u.role === 'STUDENT') || db.users[0];

  if (student.coins < reward.price) {
    return res.status(400).json({ 
      error: `Tangalar yetarli emas! Sizda ${student.coins} tanga bor, tovar narxi esa ${reward.price} tanga.` 
    });
  }

  // Atomic transaction
  student.coins -= reward.price;
  reward.stock -= 1;

  // Log transaction
  db.transactions.push({
    id: `tx-${Date.now()}`,
    userId: student.id,
    amount: -reward.price,
    type: 'REWARD_PURCHASE',
    description: `"${reward.title}" mukofotini xarid qilish`,
    createdAt: new Date().toISOString(),
  });

  saveDb(db);

  res.json({
    success: true,
    message: `"${reward.title}" muvaffaqiyatli xarid qilindi!`,
    newBalance: student.coins,
    rewardStock: reward.stock,
  });
});

// ----------------------------------------------------
// 3. HOMEWORK API
// ----------------------------------------------------
app.get('/api/homeworks', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.homeworks);
});

app.post('/api/homeworks/:id/submit', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  const { answerText } = req.body;

  const hw = db.homeworks.find((h) => h.id === id);
  if (!hw) {
    return res.status(404).json({ error: 'Vazifa topilmadi' });
  }

  hw.status = 'under_review';
  hw.studentAnswer = answerText || 'Vazifa javobi topshirildi';

  saveDb(db);
  res.json({ success: true, message: 'Vazifa muvaffaqiyatli topshirildi', homework: hw });
});

// ----------------------------------------------------
// 4. CYBER / QUIZ ARENA QUESTIONS API
// ----------------------------------------------------
app.get('/api/quiz-questions', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.quizQuestions || []);
});

app.post('/api/quiz-questions', (req: Request, res: Response) => {
  const db = getDb();
  const { title, subject, timeLimit, points, coinsReward, options, explanation } = req.body;

  if (!title || !options || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'Savol matni va kamida 2 ta javob varianti kiritilishi shart' });
  }

  const newQuestion: QuizQuestion = {
    id: `q-${Date.now()}`,
    title,
    subject: subject || 'Umumiy',
    timeLimit: Number(timeLimit) || 15,
    points: Number(points) || 800,
    coinsReward: Number(coinsReward) || 20,
    options: options.map((opt: any, idx: number) => ({
      id: idx + 1,
      text: opt.text || `Variant ${idx + 1}`,
      isRight: Boolean(opt.isRight),
    })),
    explanation: explanation || '',
    createdAt: new Date().toISOString(),
  };

  if (!db.quizQuestions) db.quizQuestions = [];
  db.quizQuestions.push(newQuestion);
  saveDb(db);

  res.status(201).json(newQuestion);
});

app.put('/api/quiz-questions/:id', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  if (!db.quizQuestions) db.quizQuestions = [];
  const index = db.quizQuestions.findIndex((q) => q.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Savol topilmadi' });
  }

  db.quizQuestions[index] = {
    ...db.quizQuestions[index],
    ...req.body,
    id,
  };

  saveDb(db);
  res.json(db.quizQuestions[index]);
});

app.delete('/api/quiz-questions/:id', (req: Request, res: Response) => {
  const db = getDb();
  const { id } = req.params;
  if (!db.quizQuestions) db.quizQuestions = [];
  db.quizQuestions = db.quizQuestions.filter((q) => q.id !== id);
  saveDb(db);
  res.json({ success: true, message: 'Savol o‘chirildi' });
});

// ----------------------------------------------------
// 4. USER & STATS API
// ----------------------------------------------------
app.get('/api/user/profile', (_req: Request, res: Response) => {
  const db = getDb();
  const student = db.users?.find((u) => u.role === 'STUDENT') || db.users?.[0];
  if (!student) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
  }
  res.json(student);
});

// Admin adjusts student coins (Rag'batlantirish)
app.post('/api/user/adjust-coins', (req: Request, res: Response) => {
  const db = getDb();
  const { amount, reason } = req.body;
  const student = db.users?.find((u) => u.role === 'STUDENT') || db.users?.[0];

  if (!student) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
  }

  student.coins = Math.max(0, student.coins + Number(amount));

  if (!db.transactions) db.transactions = [];
  db.transactions.push({
    id: `tx-${Date.now()}`,
    userId: student.id,
    amount: Number(amount),
    type: 'ADMIN_ADJUSTMENT',
    description: reason || 'Administrator tomonidan rag‘batlantirish',
    createdAt: new Date().toISOString(),
  });

  saveDb(db);
  res.json({ success: true, newBalance: student.coins });
});

// Admin Statistics overview
app.get('/api/admin/stats', (_req: Request, res: Response) => {
  const db = getDb();
  const student = db.users?.find((u) => u.role === 'STUDENT') || db.users?.[0];

  res.json({
    totalLessons: db.lessons?.length || 0,
    totalRewards: db.rewards?.length || 0,
    totalHomeworks: db.homeworks?.length || 0,
    totalCirculatingCoins: student ? student.coins : 0,
    totalTransactions: db.transactions?.length || 0,
    recentTransactions: (db.transactions || []).slice(-5).reverse(),
  });
});

// ----------------------------------------------------
// 5. BUGUNGI DARS JADVALI API (Schedule)
// ----------------------------------------------------
app.get('/api/schedule', (_req: Request, res: Response) => {
  const db = getDb();
  res.json(db.schedules || []);
});

app.post('/api/schedule', (req: Request, res: Response) => {
  const db = getDb();
  const { lessonNumber, subject, time, room, teacherName, topic, status, hasHomework } = req.body;

  if (!subject || !time || !room) {
    return res.status(400).json({ error: 'Fan nomi, vaqti va xonasi kiritilishi shart' });
  }

  const newScheduleItem: ScheduleItem = {
    id: `sch-${Date.now()}`,
    lessonNumber: Number(lessonNumber) || ((db.schedules?.length || 0) + 1),
    subject,
    time,
    room,
    teacherName: teacherName || 'Noma’lum o‘qituvchi',
    status: status || 'upcoming',
    topic: topic || '',
    hasHomework: Boolean(hasHomework),
  };

  if (!db.schedules) db.schedules = [];
  db.schedules.push(newScheduleItem);
  db.schedules.sort((a, b) => a.lessonNumber - b.lessonNumber);
  saveDb(db);

  res.status(201).json(newScheduleItem);
});

// ----------------------------------------------------
// 6. HISOB YARATISH VA AUTH API (Student Registration & Login)
// ----------------------------------------------------
app.post('/api/auth/register', (req: Request, res: Response) => {
  const db = getDb();
  const { fullName, schoolName, className, loginId, password } = req.body;

  if (!fullName || !className || !loginId || !password) {
    return res.status(400).json({ 
      error: 'Iltimos, ism-familiya, sinf, login va parolni to‘liq kiriting' 
    });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: 'Parol kamida 4 ta belgidan iborat bo‘lishi lozim' });
  }

  // Check existing login
  const existingUser = db.users.find(
    (u) => (u.loginId && u.loginId.toLowerCase() === loginId.trim().toLowerCase())
  );
  if (existingUser) {
    return res.status(400).json({ error: 'Ushbu login band, iltimos boshqa login tanlang' });
  }

  const studentCount = db.users.filter((u) => u.role === 'STUDENT').length;
  const newStudent: UserProfile = {
    id: `usr-st-${Date.now()}`,
    fullName: fullName.trim(),
    role: 'STUDENT',
    schoolName: schoolName ? schoolName.trim() : 'Prezident ixtisoslashtirilgan 1-maktabi',
    className: className.trim(),
    avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80`,
    coins: 100, // 100 bonus coins on registration
    xp: 50,
    level: 1,
    rank: studentCount + 1,
    streakDays: 1,
    loginId: loginId.trim(),
    password: password.trim(),
  };

  db.users.push(newStudent);

  // Bonus transaction
  db.transactions.push({
    id: `tx-${Date.now()}`,
    userId: newStudent.id,
    amount: 100,
    type: 'REGISTRATION_BONUS',
    description: 'Tizimda hisob yaratganlik uchun start bonus',
    createdAt: new Date().toISOString(),
  });

  saveDb(db);

  res.status(201).json({
    success: true,
    message: 'Hisob muvaffaqiyatli yaratildi! +100 boshlang‘ich bonus tangalar hisobingizga qo‘shildi.',
    user: newStudent,
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const db = getDb();
  const { loginId, password, role } = req.body;

  if (role === 'ADMIN') {
    const admin = db.users.find((u) => u.role === 'ADMIN') || db.users[1];
    return res.json({ success: true, user: admin });
  }

  if (loginId) {
    const found = db.users.find(
      (u) => u.loginId && u.loginId.toLowerCase() === loginId.trim().toLowerCase()
    );
    if (found) {
      if (found.password && password && found.password !== password) {
        return res.status(401).json({ error: 'Parol noto‘g‘ri kiritildi' });
      }
      return res.json({ success: true, user: found });
    }
  }

  // Fallback default student
  const student = db.users.find((u) => u.role === 'STUDENT') || db.users[0];
  res.json({ success: true, user: student });
});

// Export app for serverless deployment (Vercel)
export default app;

// In standalone/local environment, start the HTTP server
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[Backend Server] MaktabZiyo API server http://localhost:${PORT} da muvaffaqiyatli ishga tushdi`);
  });
}

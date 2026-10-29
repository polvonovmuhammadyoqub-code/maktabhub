import fs from 'fs';
import path from 'path';

export interface LessonMaterial {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  date: string;
  fileType: 'pdf' | 'pptx' | 'doc' | 'video';
  fileSize: string;
  downloadUrl?: string;
  description: string;
}

export interface RewardItem {
  id: string;
  title: string;
  category: 'digital' | 'physical' | 'privilege';
  price: number;
  image: string;
  description: string;
  stock: number;
  isPopular?: boolean;
}

export interface HomeworkItem {
  id: string;
  title: string;
  subject: string;
  teacherName: string;
  dueDate: string;
  dueTime: string;
  maxCoins: number;
  maxXP: number;
  status: 'new' | 'submitted' | 'under_review' | 'needs_work' | 'graded';
  description: string;
  teacherComment?: string;
  earnedCoins?: number;
  earnedXP?: number;
  studentAnswer?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  schoolName: string;
  className: string;
  avatarUrl: string;
  coins: number;
  xp: number;
  level: number;
  rank: number;
  streakDays: number;
  loginId?: string;
  password?: string;
}

export interface CoinTransaction {
  id: string;
  userId: string;
  amount: number;
  type: string;
  description: string;
  createdAt: string;
}

export interface QuizOption {
  id: number;
  text: string;
  isRight: boolean;
}

export interface QuizQuestion {
  id: string;
  subject: string;
  title: string;
  timeLimit: number;
  points: number;
  coinsReward: number;
  options: QuizOption[];
  explanation?: string;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  lessonNumber: number;
  subject: string;
  time: string;
  room: string;
  teacherName: string;
  status: 'upcoming' | 'current' | 'completed';
  topic?: string;
  hasHomework?: boolean;
}

export interface DatabaseSchema {
  lessons: LessonMaterial[];
  rewards: RewardItem[];
  homeworks: HomeworkItem[];
  users: UserProfile[];
  transactions: CoinTransaction[];
  quizQuestions: QuizQuestion[];
  schedules: ScheduleItem[];
}

const DB_FILE = path.join(process.cwd(), 'server', 'data', 'db.json');

const initialDatabase: DatabaseSchema = {
  users: [
    {
      id: 'usr-st-702',
      fullName: 'Azizbek Rahimov',
      role: 'STUDENT',
      schoolName: 'Prezident ixtisoslashtirilgan 1-maktabi',
      className: '7-"B" sinf',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      coins: 380,
      xp: 1450,
      level: 4,
      rank: 3,
      streakDays: 5,
      loginId: '7B-2401',
      password: 'password',
    },
    {
      id: 'usr-adm-01',
      fullName: 'Rustam Karimov (Admin)',
      role: 'ADMIN',
      schoolName: 'Prezident ixtisoslashtirilgan 1-maktabi',
      className: 'Maktab Ma’muriyati',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
      coins: 9999,
      xp: 5000,
      level: 10,
      rank: 1,
      streakDays: 30,
      loginId: 'admin',
      password: 'admin',
    }
  ],
  lessons: [
    {
      id: 'les-01',
      title: 'Python dasturlash: Tarmoqlanuvchi shart operatorlari (if/else)',
      subject: 'Informatika',
      teacherName: 'Sardor Qodirov',
      date: '28-Oktyabr, 2026',
      fileType: 'pptx',
      fileSize: '4.8 MB',
      description: 'Python tilida if, elif va else bloklarining ishlash mexanizmi, mantiqiy amallar va amaliy misollar taqdimoti.',
    },
    {
      id: 'les-02',
      title: 'Kvadrat tenglamalar va Viyet teoremasining qo‘llanilishi',
      subject: 'Algebra',
      teacherName: 'Nodira Karimova',
      date: '27-Oktyabr, 2026',
      fileType: 'pdf',
      fileSize: '2.3 MB',
      description: 'Kvadrat tenglamalarni diskriminant va Viyet formulalari orqali tezkor yechish uslublari konspekti.',
    },
    {
      id: 'les-03',
      title: 'Nyutonning ikkinchi qonuni va dinamika asoslari',
      subject: 'Fizika',
      teacherName: 'Ulug‘bek Salimov',
      date: '25-Oktyabr, 2026',
      fileType: 'pdf',
      fileSize: '3.1 MB',
      description: 'Kuch, massa va tezlanish bog‘liqligi. Laboratoriya mashg‘uloti uchun ko‘rsatmalar to‘plami.',
    },
    {
      id: 'les-04',
      title: 'Alisher Navoiy hayoti va "Xamsa" dostonlari tahlili',
      subject: 'Adabiyot',
      teacherName: 'Dilnoza Yusupova',
      date: '23-Oktyabr, 2026',
      fileType: 'pptx',
      fileSize: '6.5 MB',
      description: 'Navoiy dostonlaridagi ma’rifiy g‘oyalar va qahramonlar xarakteristikasi bo‘yicha ko‘rgazmali slaydlar.',
    },
  ],
  rewards: [
    {
      id: 'rew-01',
      title: 'Maxsus "Kiber-Ajdar" Profil Avatari',
      category: 'digital',
      price: 80,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80',
      description: 'Profilingiz va reyting jadvalida ko‘rinadigan noyob animatsion neon avatar.',
      stock: 999,
      isPopular: true,
    },
    {
      id: 'rew-02',
      title: '"Oltin Chempion" Profil Ramkasi',
      category: 'digital',
      price: 120,
      image: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=300&q=80',
      description: 'Ism-sharifingiz atrofida yaltirab turuvchi eksklyuziv oltin hoshiya.',
      stock: 999,
    },
    {
      id: 'rew-03',
      title: 'Maktab logotipli maxsus IT-bloknot va ruchka',
      category: 'physical',
      price: 160,
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=300&q=80',
      description: 'Qattiq muqovali, qulay va chiroyli maktab kundaligi va maxsus qora ruchka to‘plami.',
      stock: 14,
      isPopular: true,
    },
    {
      id: 'rew-04',
      title: 'Darsda 1 martalik "Immunitet Kuponi"',
      category: 'privilege',
      price: 300,
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=300&q=80',
      description: 'Ixtiyoriy bitta darsda kutilmagan doskaga chiqishdan himoyalanish rasmiy imtiyozi (o‘qituvchi bilan kelishilgan).',
      stock: 5,
    },
    {
      id: 'rew-05',
      title: 'Tanaffus vaqtida maktab radiosida qo‘shiq tanlash huquqi',
      category: 'privilege',
      price: 220,
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
      description: 'Katta tanaffusda maktab radiotarmog‘i orqali sevimli musiqangizni barcha uchun qo‘ydirish imkoniyati.',
      stock: 8,
    },
    {
      id: 'rew-06',
      title: 'Maktab ramzi tushirilgan metall termos',
      category: 'physical',
      price: 450,
      image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=300&q=80',
      description: 'Issiq va sovuqni 12 soat saqlaydigan qulay va zamonaviy o‘quvchi termosi.',
      stock: 3,
    },
  ],
  homeworks: [
    {
      id: 'hw-01',
      title: 'Python: Juft va toq sonlarni aniqlaydigan 3 ta algoritm yozish',
      subject: 'Informatika',
      teacherName: 'Sardor Qodirov',
      dueDate: 'Bugun, 23:59 gacha',
      dueTime: '23:59',
      maxCoins: 25,
      maxXP: 50,
      status: 'new',
      description: 'Konspektda berilgan 2, 4 va 5-amaliy masalalarni Python kodida yozing. Kod skrinshotini yoki .py faylni yuklang.',
    },
    {
      id: 'hw-02',
      title: 'Darslikdan 142–146-misollarni yechish (Viyet teoremasi)',
      subject: 'Algebra',
      teacherName: 'Nodira Karimova',
      dueDate: 'Ertaga, 17:00 gacha',
      dueTime: '17:00',
      maxCoins: 30,
      maxXP: 60,
      status: 'new',
      description: 'Misollarni katak daftarga aniq yechib, suratga oling yoki toza PDF ko‘rinishida yuklang.',
    },
    {
      id: 'hw-03',
      title: 'Nyuton qonunlariga doir 5 ta masala hisob-kitobi',
      subject: 'Fizika',
      teacherName: 'Ulug‘bek Salimov',
      dueDate: '27-Oktyabr',
      dueTime: '18:00',
      maxCoins: 20,
      maxXP: 45,
      status: 'under_review',
      description: 'Laboratoriya daftarchasidagi 3-variant topshiriqlari.',
      studentAnswer: 'Vazifa bajarildi, barcha 5 ta masalaning hisobi yuklandi.',
    },
    {
      id: 'hw-04',
      title: '"Farhod va Shirin" dostonidan 20 misra yod olish va audio yuborish',
      subject: 'Adabiyot',
      teacherName: 'Dilnoza Yusupova',
      dueDate: '24-Oktyabr',
      dueTime: '16:00',
      maxCoins: 40,
      maxXP: 80,
      status: 'graded',
      description: 'Ifodali o‘qish va ovozli xabar qilib yuborish.',
      teacherComment: 'Barakalla, Azizbek! Talaffuz va intonatsiya a’lo darajada! +40 tanga hisobingizga qo‘shildi.',
      earnedCoins: 40,
      earnedXP: 80,
      studentAnswer: 'Audio yozuv yuklandi.',
    },
  ],
  transactions: [
    {
      id: 'tx-01',
      userId: 'usr-st-702',
      amount: 40,
      type: 'ASSIGNMENT',
      description: '"Farhod va Shirin" dostonidan 20 misra yod olish topshirig‘i uchun mukofot',
      createdAt: '2026-10-24T10:30:00Z',
    },
    {
      id: 'tx-02',
      userId: 'usr-st-702',
      amount: 25,
      type: 'QUIZ',
      description: 'Informatika fani bo‘yicha Quiz Arena g‘olibi',
      createdAt: '2026-10-26T14:15:00Z',
    }
  ],
  quizQuestions: [
    {
      id: 'q-01',
      subject: 'Informatika',
      title: 'Pythonda konsolga ma’lumot chiqarish uchun qaysi standart funksiya ishlatiladi?',
      timeLimit: 15,
      points: 800,
      coinsReward: 20,
      options: [
        { id: 1, text: 'console.log()', isRight: false },
        { id: 2, text: 'print()', isRight: true },
        { id: 3, text: 'echo()', isRight: false },
        { id: 4, text: 'System.out.println()', isRight: false },
      ],
      explanation: 'Python tilida matn yoki natijani ekranga chiqarish uchun print() funksiyasi qo‘llaniladi.',
      createdAt: '2026-10-28T09:00:00Z',
    },
    {
      id: 'q-02',
      subject: 'Algebra',
      title: 'Kvadrat tenglamada diskriminant (D) hisoblash formulasi qaysi?',
      timeLimit: 20,
      points: 900,
      coinsReward: 25,
      options: [
        { id: 1, text: 'D = b² - 4ac', isRight: true },
        { id: 2, text: 'D = b² + 4ac', isRight: false },
        { id: 3, text: 'D = a² + b² - c²', isRight: false },
        { id: 4, text: 'D = -b ± √(4ac)', isRight: false },
      ],
      explanation: 'ax² + bx + c = 0 kvadrat tenglamasi diskriminanti D = b² - 4ac ga teng.',
      createdAt: '2026-10-28T09:10:00Z',
    },
    {
      id: 'q-03',
      subject: 'Fizika',
      title: 'Nyutonning ikkinchi qonuni ifodasini aniqlang:',
      timeLimit: 15,
      points: 850,
      coinsReward: 20,
      options: [
        { id: 1, text: 'F = m / a', isRight: false },
        { id: 2, text: 'F = m · a', isRight: true },
        { id: 3, text: 'E = m · c²', isRight: false },
        { id: 4, text: 'v = s / t', isRight: false },
      ],
      explanation: 'Jismga ta’sir qiluvchi kuch uning massasi bilan tezlanishining ko‘paytmasiga teng: F = m·a.',
      createdAt: '2026-10-28T09:20:00Z',
    }
  ],
  schedules: [
    {
      id: 'sch-01',
      lessonNumber: 1,
      subject: 'Informatika',
      time: '08:30 - 09:15',
      room: '304-kompyuter sinfi',
      teacherName: 'Sardor Qodirov',
      status: 'completed',
      topic: 'Python dasturlash: Shart operatorlari',
      hasHomework: true,
    },
    {
      id: 'sch-02',
      lessonNumber: 2,
      subject: 'Algebra',
      time: '09:25 - 10:10',
      room: '208-xona',
      teacherName: 'Nodira Karimova',
      status: 'completed',
      topic: 'Kvadrat tenglamalar va Viyet teoremasi',
      hasHomework: true,
    },
    {
      id: 'sch-03',
      lessonNumber: 3,
      subject: 'Fizika',
      time: '10:25 - 11:10',
      room: '112-laboratoriya',
      teacherName: 'Ulug‘bek Salimov',
      status: 'current',
      topic: 'Nyutonning ikkinchi qonuni va dinamika',
      hasHomework: false,
    },
    {
      id: 'sch-04',
      lessonNumber: 4,
      subject: 'Ingliz tili',
      time: '11:20 - 12:05',
      room: '205-til markazi',
      teacherName: 'Malika Ahmedova',
      status: 'upcoming',
      topic: 'Unit 4: Future Technology & AI Tools',
      hasHomework: false,
    },
    {
      id: 'sch-05',
      lessonNumber: 5,
      subject: 'Adabiyot',
      time: '12:25 - 13:10',
      room: '315-xona',
      teacherName: 'Dilnoza Yusupova',
      status: 'upcoming',
      topic: 'Alisher Navoiy: Hayoti va "Xamsa" dostoni',
      hasHomework: true,
    },
    {
      id: 'sch-06',
      lessonNumber: 6,
      subject: 'Biologiya',
      time: '13:20 - 14:05',
      room: '110-biologiya xonasi',
      teacherName: 'Jasur Umarov',
      status: 'upcoming',
      topic: 'Hujayra tuzilishi va mikroskop amaliyoti',
      hasHomework: false,
    },
  ]
};

// In-memory cache for serverless environments (prevents repeated disk reads and keeps state in warm container)
let memoryDb: DatabaseSchema | null = null;
const TMP_DB_FILE = path.join('/tmp', 'maktabziyo_db.json');

export function getDb(): DatabaseSchema {
  // If running in serverless and memoryDb exists, return cached state
  if (memoryDb) {
    return memoryDb;
  }

  try {
    const isVercel = Boolean(process.env.VERCEL);
    let targetFile = DB_FILE;

    // On Vercel, check if /tmp has updated state first
    if (isVercel && fs.existsSync(TMP_DB_FILE)) {
      targetFile = TMP_DB_FILE;
    }

    if (!fs.existsSync(targetFile)) {
      memoryDb = { ...initialDatabase };
      saveDb(memoryDb);
      return memoryDb;
    }

    const raw = fs.readFileSync(targetFile, 'utf-8');
    const data: DatabaseSchema = JSON.parse(raw);

    // Backward compatibility for existing db.json files
    if (!data.quizQuestions || data.quizQuestions.length === 0) {
      data.quizQuestions = initialDatabase.quizQuestions;
      saveDb(data);
    }

    if (!data.schedules || data.schedules.length === 0) {
      data.schedules = initialDatabase.schedules;
      saveDb(data);
    }

    memoryDb = data;
    return data;
  } catch (error) {
    console.error('Error reading database file:', error);
    memoryDb = { ...initialDatabase };
    return memoryDb;
  }
}

export function saveDb(data: DatabaseSchema): void {
  // Always update in-memory state
  memoryDb = data;

  const isVercel = Boolean(process.env.VERCEL);

  if (isVercel) {
    // Vercel serverless functions have a read-only filesystem except /tmp
    console.warn(
      '[Database Warning] Vercel serverless muhitida JSON faylli baza vaqtinchalik saqlanadi. ' +
      'Ma\'lumotlarni doimiy saqlash uchun tashqi Cloud Database (MongoDB Atlas, Supabase yoki Upstash) ulanishi zarur.'
    );
    try {
      fs.writeFileSync(TMP_DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (tmpErr) {
      console.warn('Vercel /tmp write error (non-fatal):', tmpErr);
    }
    return;
  }

  // Standalone / Local environment: write to server/data/db.json
  try {
    const dir = path.dirname(DB_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving database file:', error);
  }
}

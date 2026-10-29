import React, { useState } from 'react';
import type { RewardItem, UserProfile } from '../types';
import { Coins, ShoppingBag, Check, AlertCircle, Sparkles, Package, X } from 'lucide-react';

interface RewardShopViewProps {
  user: UserProfile;
  rewards: RewardItem[];
  onPurchaseReward: (reward: RewardItem) => boolean;
}

export const RewardShopView: React.FC<RewardShopViewProps> = ({
  user,
  rewards,
  onPurchaseReward,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState<RewardItem | null>(null);
  const [insufficientFundsItem, setInsufficientFundsItem] = useState<RewardItem | null>(null);

  const categories = [
    { id: 'all', label: 'Barchasi' },
    { id: 'digital', label: 'Raqamli narsalar' },
    { id: 'physical', label: 'Maktab sovg‘alari' },
    { id: 'privilege', label: 'Ta’limiy imtiyozlar' },
  ];

  const filteredRewards = rewards.filter((item) => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  const handleBuyClick = (item: RewardItem) => {
    if (user.coins >= item.price) {
      const success = onPurchaseReward(item);
      if (success) {
        setPurchaseSuccessItem(item);
      }
    } else {
      setInsufficientFundsItem(item);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* Header Banner with Coins Balance */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-amber-200/50 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-950 border border-white/20">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Maktab Gamifikatsiya Do‘koni</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Reward Shop — Mukofotlar Markazi 🛍️
          </h1>
          <p className="text-xs sm:text-sm text-amber-50 max-w-xl">
            Vazifalarni vaqtida topshirib va viktorinalarda yutgan tangalaringizni maxsus avatarlar, maktab daftarlari yoki dars imtiyozlariga almashtiring.
          </p>
        </div>

        {/* Balance Card */}
        <div className="relative z-10 bg-white/95 text-slate-900 rounded-2xl p-4 sm:p-5 flex items-center gap-4 shadow-lg shrink-0">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center text-white shadow-md">
            <Coins className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Sizning Balansingiz:
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-amber-950">
                {user.coins}
              </span>
              <span className="text-xs font-bold text-amber-700">Tanga</span>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              selectedCategory === cat.id
                ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {filteredRewards.map((reward) => {
          const canAfford = user.coins >= reward.price;
          const isOutOfStock = reward.stock <= 0;

          return (
            <div
              key={reward.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Reward Image */}
                <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                  <img
                    src={reward.image}
                    alt={reward.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {reward.isPopular && (
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Eng ommabop
                    </span>
                  )}
                  <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[10px] font-bold bg-white/90 backdrop-blur-xs text-slate-700 shadow-xs">
                    {reward.category === 'digital' ? 'Raqamli' : reward.category === 'physical' ? 'Jismoniy' : 'Imtiyoz'}
                  </span>
                </div>

                {/* Details */}
                <div className="p-5">
                  <h3 className="font-extrabold text-base text-slate-900 mb-1.5">
                    {reward.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                    {reward.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Package className="w-3.5 h-3.5" />
                      Qoldiq: <strong className="text-slate-700">{reward.stock} dona</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Purchase button and price footer */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-1 text-amber-700 font-black text-lg">
                    <Coins className="w-5 h-5 fill-amber-500 text-amber-500" />
                    <span>{reward.price}</span>
                  </div>

                  <button
                    onClick={() => handleBuyClick(reward)}
                    disabled={isOutOfStock}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      isOutOfStock
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : canAfford
                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-200 hover:scale-[1.02]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    <span>{isOutOfStock ? 'Tugagan' : 'Sotib olish'}</span>
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Success Modal */}
      {purchaseSuccessItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-center animate-scaleIn">
            <button
              onClick={() => setPurchaseSuccessItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Tabriklaymiz! 🎉
            </h3>
            <p className="text-sm font-bold text-indigo-700 mb-2">
              "{purchaseSuccessItem.title}" muvaffaqiyatli xarid qilindi!
            </p>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Hisobingizdan <strong>{purchaseSuccessItem.price} tanga</strong> yechildi. Agar bu jismoniy sovg‘a bo‘lsa, tanaffus paytida maktab ma’muriyatidan olishingiz mumkin.
            </p>

            <button
              onClick={() => setPurchaseSuccessItem(null)}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200"
            >
              Tushundim, davom etish
            </button>
          </div>
        </div>
      )}

      {/* Insufficient Funds Warning Modal */}
      {insufficientFundsItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-center">
            <button
              onClick={() => setInsufficientFundsItem(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">
              Tangalar yetarli emas! 🪙
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Ushbu mukofot narxi <strong>{insufficientFundsItem.price} tanga</strong>, sizda esa <strong>{user.coins} tanga</strong> mavjud. Yana {insufficientFundsItem.price - user.coins} ta tanga kerak.
            </p>
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-xs text-indigo-800 font-semibold mb-6">
              💡 Maslahat: Yangi uy vazifalarini vaqtida topshiring yoki Quiz Arenada qatnashing!
            </div>

            <button
              onClick={() => setInsufficientFundsItem(null)}
              className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
            >
              Yopish
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { SECT_SHOP_ITEMS } from '../types/cultivation';
import { sound } from '../utils/audio';
import { Swords, ShieldAlert, ShoppingBag, Sparkles, Trophy } from 'lucide-react';
import bossImg from '../assets/images/demon_ape_boss_art_1790866770506.jpg';

interface SectTabProps {
  bossHp: number;
  bossMaxHp: number;
  bossDefeats: number;
  sectPoints: number;
  realmIndex: number;
  onAttackBoss: () => void;
  onBuyItem: (itemId: string, cost: number, type: string, amount: number) => void;
}

export const SectTab: React.FC<SectTabProps> = ({
  bossHp,
  bossMaxHp,
  bossDefeats,
  sectPoints,
  realmIndex,
  onAttackBoss,
  onBuyItem,
}) => {
  const [tickerList, setTickerList] = useState<string[]>([
    '真傳弟子 蕭炎 祭出八荒玄火，重創魔猿 3,420 傷害！',
    '內門長老 雲中子 運轉翻天手，造成 4,800 傷害！',
    '太玄劍宗弟子 祭出七星龍泉劍，凌空斬擊 2,100 傷害！',
  ]);

  const [isStriking, setIsStriking] = useState(false);

  // Periodic random sect disciples attacking
  useEffect(() => {
    const discipleNames = [
      '太上長老 虛雲子',
      '真傳師姐 洛璃',
      '內門弟子 韓立',
      '劍堂堂主 孤鴻子',
      '百草峰長老 靈藥老人',
      '外門執事 王通',
    ];
    const skills = [
      '萬劍歸宗',
      '天罡雷法',
      '焚天神焰',
      '移山縮地掌',
      '大悲撕天手',
      '七十二地煞印',
    ];

    const interval = setInterval(() => {
      const dName = discipleNames[Math.floor(Math.random() * discipleNames.length)];
      const skill = skills[Math.floor(Math.random() * skills.length)];
      const dmg = Math.floor(Math.random() * 3000) + 1500;
      const entry = `${dName} 催動【${skill}】，重創撼天魔猿 ${dmg.toLocaleString()} 點傷害！`;

      setTickerList((prev) => [entry, ...prev.slice(0, 4)]);
    }, 3800);

    return () => clearInterval(interval);
  }, []);

  const handleAttack = () => {
    sound.play('battle');
    setIsStriking(true);
    setTimeout(() => setIsStriking(false), 250);
    onAttackBoss();
  };

  const handleBuy = (item: (typeof SECT_SHOP_ITEMS)[0]) => {
    if (sectPoints < item.cost) {
      alert(`宗門貢獻不足！兌換【${item.name}】需要 ${item.cost} 點貢獻。`);
      return;
    }
    sound.play('reward');
    onBuyItem(item.id, item.cost, item.type, item.amount);
  };

  const hpPercent = Math.max(0, Math.min(100, (bossHp / bossMaxHp) * 100));

  return (
    <div className="space-y-3.5 select-none animate-fadeIn">
      {/* 萬人同屏鎮魔區域 */}
      <div className="bg-white/65 border border-[#cbbea5] rounded-md p-3.5 shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-3.5">
          {/* Boss Image */}
          <div
            className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden border-2 border-[#801f20] shrink-0 bg-[#2b1c1c] shadow-md ${
              isStriking ? 'scale-95 brightness-125' : ''
            }`}
          >
            <img
              src={bossImg}
              alt="太古撼天魔猿"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1 bg-[#801f20] text-white text-[9px] font-bold px-1.5 py-0.2 rounded shadow">
              太古巨兇
            </div>
          </div>

          {/* Boss Stats & HP */}
          <div className="flex-1 w-full text-center sm:text-left text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-[#9e2a2b] rounded-xs" />
                <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy">
                  宗門萬人鎮魔 · 太古撼天魔猿
                </h3>
              </div>
              <span className="text-[11px] text-[#736e63]">
                剿滅累計: <strong className="text-[#9e2a2b]">{bossDefeats}</strong> 次
              </span>
            </div>

            <p className="text-[#6b6456] text-[11px] mt-0.5 leading-relaxed">
              封魔禁地大陣異動，太古巨凶破印而出！召集萬仙合力鎮壓，重創兇獸可斬獲海量宗門貢獻與天階犒賞！
            </p>

            {/* Boss HP Bar */}
            <div className="mt-2.5">
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-[#736e63] font-medium">魔猿剩餘精血</span>
                <span className="font-mono tabular-nums font-bold text-[#9e2a2b]">
                  {Math.floor(bossHp).toLocaleString()} / {bossMaxHp.toLocaleString()} (
                  {hpPercent.toFixed(1)}%)
                </span>
              </div>

              <div className="w-full h-3 bg-[#d5cbba] border border-[#a89d89] rounded-full overflow-hidden p-0.5 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-[#9e2a2b] via-[#c84b31] to-[#6a040f] rounded-full transition-all duration-200"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* Attack Button */}
            <button
              onClick={handleAttack}
              className="w-full mt-2.5 py-2 text-xs font-bold text-white bg-gradient-to-r from-[#9e2a2b] to-[#7a1c1d] hover:brightness-110 active:scale-98 rounded shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Swords className="w-3.5 h-3.5" />
              <span>祭出無上神通 · 合力痛擊兇獸</span>
            </button>
          </div>
        </div>

        {/* Sect Ticker */}
        <div className="mt-3 pt-2 border-t border-[#cbbea5]/60 bg-[#f7f3eb] p-2 rounded text-[11px] text-[#59544c]">
          <div className="flex items-center gap-1 font-bold text-[#1f1f1f] mb-1">
            <Sparkles className="w-3 h-3 text-[#c5a059]" />
            <span>同門萬仙合戰播報：</span>
          </div>
          <div className="space-y-0.5 h-12 overflow-hidden">
            {tickerList.map((entry, idx) => (
              <div key={idx} className="truncate text-[#736e63]">
                ◆ {entry}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 宗門藏寶閣 */}
      <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3.5 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#cbbea5]/70 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <ShoppingBag className="w-4 h-4 text-[#9e2a2b]" />
            <h4 className="font-bold text-xs text-[#1f1f1f]">
              宗門藏寶閣 · 貢獻兌換
            </h4>
          </div>
          <span className="text-xs text-[#b36200] font-bold font-mono">
            當前貢獻: {sectPoints} 點
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {SECT_SHOP_ITEMS.map((item) => {
            const canAfford = sectPoints >= item.cost;

            return (
              <div
                key={item.id}
                className="bg-[#f7f2e9] border border-[#dfd5c2] rounded p-2.5 flex items-center justify-between gap-2 hover:border-[#bdae95] transition-all"
              >
                <div className="flex-1">
                  <div className="font-bold text-[#1f1f1f]">{item.name}</div>
                  <div className="text-[11px] text-[#6b6456] mt-0.5 line-clamp-1">
                    {item.description}
                  </div>
                  <div className="text-[11px] text-[#b36200] font-semibold mt-1">
                    消耗: {item.cost} 貢獻
                  </div>
                </div>

                <button
                  disabled={!canAfford}
                  onClick={() => handleBuy(item)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-all ${
                    canAfford
                      ? 'bg-[#2b2823] hover:bg-[#1a1816] text-white active:scale-95 cursor-pointer shadow-xs'
                      : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed'
                  }`}
                >
                  兌換
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

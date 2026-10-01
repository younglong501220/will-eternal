import React from 'react';
import { PetData, PET_CATALOG } from '../types/cultivation';
import { sound } from '../utils/audio';
import { Sparkles, HeartHandshake, ShieldCheck, Egg, Zap } from 'lucide-react';
import beastImg from '../assets/images/spirit_beasts_art_1790866758112.jpg';

interface PetTabProps {
  pet: PetData | null;
  petEggs: number;
  monsterCores: number;
  onHatchEgg: () => void;
  onFeedPet: () => void;
}

export const PetTab: React.FC<PetTabProps> = ({
  pet,
  petEggs,
  monsterCores,
  onHatchEgg,
  onFeedPet,
}) => {
  const handleHatch = () => {
    if (petEggs <= 0) {
      alert('儲物袋中暫無靈獸蛋！請多在【秘境歷練】尋覓或於【宗門寶閣】兌換！');
      return;
    }
    sound.play('hatch');
    onHatchEgg();
  };

  const handleFeed = () => {
    if (!pet || monsterCores <= 0) return;
    sound.play('click');
    onFeedPet();
  };

  return (
    <div className="space-y-3.5 select-none animate-fadeIn">
      {/* 本命靈獸主位 */}
      <div className="bg-white/65 border border-[#cbbea5] rounded-md p-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3.5">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden border border-[#bfae95] shrink-0 bg-[#2b2721] shadow-sm">
            <img
              src={beastImg}
              alt="仙禽神獸"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            {pet && (
              <div className="absolute bottom-1 right-1 bg-[#9e2a2b] text-white text-[10px] font-bold px-1.5 py-0.2 rounded shadow">
                {pet.level} 階
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left text-xs">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
              <span className="w-1.5 h-3 bg-[#9e2a2b] rounded-xs" />
              <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy">
                本命伴生靈獸
              </h3>
            </div>

            {pet ? (
              <div className="space-y-1">
                <div className="flex items-baseline justify-center sm:justify-start gap-2">
                  <span className="text-base font-black text-[#9e2a2b] font-calligraphy">
                    {pet.name}
                  </span>
                  <span className="text-[11px] text-[#736e63]">
                    【{pet.level} 階 · {pet.title}】
                  </span>
                </div>

                <p className="text-[11px] text-[#59544c] leading-relaxed">
                  {pet.description}
                </p>

                <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1 text-[#2d6a4f] font-semibold text-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    協戰效果：
                    {pet.bonusType === 'qi'
                      ? `靈氣吸納速度提升 ${pet.level * pet.bonusPercent}%`
                      : pet.bonusType === 'combat'
                      ? `鬥法與鎮魔殺傷提升 ${pet.level * pet.bonusPercent}%`
                      : `秘境歷練草木收成提升 ${pet.level * pet.bonusPercent}%`}
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-2 text-[#736e63]">
                <p>靈台空明，暫無認主伴生靈獸。</p>
                <p className="text-[11px] text-[#8c8577] mt-0.5">
                  孵化靈獸蛋可引得通靈異獸投奔認主，賦予逆天被動神通！
                </p>
              </div>
            )}

            {/* 操作按鈕條 */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 pt-2 border-t border-[#cbbea5]/60">
              <button
                onClick={handleHatch}
                disabled={petEggs <= 0}
                className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  petEggs > 0
                    ? 'bg-[#9e2a2b] hover:bg-[#801f20] text-white active:scale-95 cursor-pointer shadow-xs'
                    : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed'
                }`}
              >
                <Egg className="w-3.5 h-3.5" />
                <span>
                  {pet ? '重契孵化' : '孵化靈獸'} (存蛋: {petEggs})
                </span>
              </button>

              {pet && (
                <button
                  onClick={handleFeed}
                  disabled={monsterCores <= 0}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    monsterCores > 0
                      ? 'bg-[#2b2823] hover:bg-[#1a1816] text-white active:scale-95 cursor-pointer shadow-xs'
                      : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed'
                  }`}
                  title="消耗 1 顆妖丹精萃，提升靈獸階位"
                >
                  <Zap className="w-3.5 h-3.5 text-[#c5a059]" />
                  <span>哺育妖丹 (存量: {monsterCores})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 萬獸仙鑑 (Codex) */}
      <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3 shadow-xs">
        <div className="flex items-center gap-1.5 border-b border-[#cbbea5]/70 pb-2 mb-2.5">
          <ShieldCheck className="w-4 h-4 text-[#9e2a2b]" />
          <h4 className="font-bold text-xs text-[#1f1f1f]">
            萬獸仙鑑 · 洪荒靈獸圖譜
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {PET_CATALOG.map((cat) => {
            const isCurrent = pet && pet.id === cat.id;

            return (
              <div
                key={cat.id}
                className={`p-2.5 rounded border transition-all ${
                  isCurrent
                    ? 'bg-[#f0ebe0] border-[#9e2a2b] ring-1 ring-[#9e2a2b]/30'
                    : 'bg-[#f7f2e9] border-[#ded5c2]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="font-bold text-[#1f1f1f] flex items-center gap-1">
                    <span>{cat.name}</span>
                    {isCurrent && (
                      <span className="text-[10px] text-[#9e2a2b] font-bold">
                        (相伴中)
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-[#736e63]">{cat.title}</span>
                </div>

                <div className="text-[11px] text-[#2d6a4f] mt-1 font-medium">
                  天賦：
                  {cat.bonusType === 'qi'
                    ? `修為吸納 +${cat.bonusPercent}% / 階`
                    : cat.bonusType === 'combat'
                    ? `鬥法神威 +${cat.bonusPercent}% / 階`
                    : `草木機緣 +${cat.bonusPercent}% / 階`}
                </div>
                <p className="text-[11px] text-[#6b6456] mt-0.5 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

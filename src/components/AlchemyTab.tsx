import React, { useState } from 'react';
import { PILL_RECIPES, PillRecipe } from '../types/cultivation';
import { sound } from '../utils/audio';
import { Sparkles, Flame, CheckCircle, Package } from 'lucide-react';
import cauldronImg from '../assets/images/alchemy_furnace_art_1790866746653.jpg';

interface AlchemyTabProps {
  herbs: number;
  cores: number;
  spiritStones: number;
  pills: {
    peiyuan: number;
    breakPill: number;
    concentrate: number;
    bodyMarrow: number;
  };
  onCraftPill: (recipeId: string, quantity: number) => void;
  onUsePill: (pillKey: 'peiyuan' | 'concentrate' | 'bodyMarrow') => void;
}

export const AlchemyTab: React.FC<AlchemyTabProps> = ({
  herbs,
  cores,
  spiritStones,
  pills,
  onCraftPill,
  onUsePill,
}) => {
  const [isCrafting, setIsCrafting] = useState(false);
  const [craftMsg, setCraftMsg] = useState<string | null>(null);

  const handleCraft = (recipe: PillRecipe, qty: number) => {
    const totalHerbs = recipe.costHerbs * qty;
    const totalCores = recipe.costCores * qty;
    const totalStones = recipe.costStones * qty;

    if (herbs < totalHerbs || cores < totalCores || spiritStones < totalStones) {
      alert(`靈材不足！煉製 ${qty} 枚【${recipe.name}】需要：${totalHerbs}株靈草、${totalCores}顆妖丹、${totalStones}靈石。`);
      return;
    }

    setIsCrafting(true);
    sound.play('alchemy');

    setTimeout(() => {
      onCraftPill(recipe.id, qty);
      setIsCrafting(false);
      setCraftMsg(`丹爐開頂，祥雲繚繞！成功煉出【${recipe.name}】x${qty} 枚！`);
      setTimeout(() => setCraftMsg(null), 3000);
    }, 600);
  };

  const handleUse = (key: 'peiyuan' | 'concentrate' | 'bodyMarrow') => {
    sound.play('click');
    onUsePill(key);
  };

  return (
    <div className="space-y-3.5 select-none animate-fadeIn">
      {/* 丹爐天地概覽 */}
      <div className="bg-white/65 border border-[#cbbea5] rounded-md p-3 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden border border-[#bfae95] shrink-0 bg-[#3a352c] shadow-sm">
            <img
              src={cauldronImg}
              alt="乾坤八卦煉丹爐"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-transform duration-700 ${
                isCrafting ? 'scale-110 brightness-125' : 'hover:scale-105'
              }`}
            />
            {isCrafting && (
              <div className="absolute inset-0 bg-amber-500/20 animate-pulse flex items-center justify-center">
                <Flame className="w-8 h-8 text-amber-300 animate-bounce" />
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left text-xs">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
              <span className="w-1.5 h-3 bg-[#9e2a2b] rounded-xs" />
              <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy">
                乾坤八卦九轉神爐
              </h3>
            </div>
            <p className="text-[#6b6456] leading-relaxed text-[11px]">
              奪天地造化，採草木靈精，以本命三昧真火鍛之。丹成異象，藥力精純，助修士洗骨伐髓、破障登仙。
            </p>

            {/* Current Materials inventory strip */}
            <div className="flex items-center justify-center sm:justify-start gap-3 mt-2.5 pt-2 border-t border-[#cbbea5]/60 text-xs">
              <div>
                靈草儲備: <span className="font-bold text-[#2d6a4f]">{herbs}</span> 株
              </div>
              <div>
                妖丹精華: <span className="font-bold text-[#6a040f]">{cores}</span> 顆
              </div>
              <div>
                靈石: <span className="font-bold text-[#9e2a2b]">{spiritStones}</span> 枚
              </div>
            </div>
          </div>
        </div>

        {craftMsg && (
          <div className="mt-2.5 p-2 bg-[#e9f5ed] border border-[#a3d9b5] rounded text-xs text-[#1e6f42] font-semibold text-center flex items-center justify-center gap-1.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-[#2d6a4f]" />
            <span>{craftMsg}</span>
          </div>
        )}
      </div>

      {/* 丹方煉製列表 */}
      <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3 shadow-xs">
        <div className="flex items-center gap-1.5 border-b border-[#cbbea5]/70 pb-2 mb-2.5">
          <Flame className="w-4 h-4 text-[#9e2a2b]" />
          <h4 className="font-bold text-xs text-[#1f1f1f]">
            古法丹方 · 參悟煉製
          </h4>
        </div>

        <div className="space-y-2.5">
          {PILL_RECIPES.map((recipe) => {
            const canCraft1 =
              herbs >= recipe.costHerbs &&
              cores >= recipe.costCores &&
              spiritStones >= recipe.costStones;

            const canCraft5 =
              herbs >= recipe.costHerbs * 5 &&
              cores >= recipe.costCores * 5 &&
              spiritStones >= recipe.costStones * 5;

            return (
              <div
                key={recipe.id}
                className="bg-[#f7f2e9] border border-[#dfd5c2] rounded p-2.5 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-[#bdae95] transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1f1f1f]">
                      {recipe.name}
                    </span>
                    <span className="text-[11px] text-[#2d6a4f]">
                      {recipe.effectDescription}
                    </span>
                  </div>

                  <div className="text-[11px] text-[#736e63] mt-1 flex items-center gap-2 flex-wrap">
                    <span>
                      耗材: 靈草 x{recipe.costHerbs}
                    </span>
                    {recipe.costCores > 0 && (
                      <span>妖丹 x{recipe.costCores}</span>
                    )}
                    {recipe.costStones > 0 && (
                      <span>靈石 x{recipe.costStones}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  <button
                    disabled={!canCraft1 || isCrafting}
                    onClick={() => handleCraft(recipe, 1)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                      canCraft1 && !isCrafting
                        ? 'bg-[#2b2823] text-white hover:bg-[#1a1816] active:scale-95 cursor-pointer shadow-xs'
                        : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed'
                    }`}
                  >
                    煉製 1 枚
                  </button>

                  <button
                    disabled={!canCraft5 || isCrafting}
                    onClick={() => handleCraft(recipe, 5)}
                    className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-all ${
                      canCraft5 && !isCrafting
                        ? 'bg-[#9e2a2b] text-white hover:bg-[#801f20] active:scale-95 cursor-pointer shadow-xs'
                        : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed'
                    }`}
                    title="一次性開爐煉製 5 枚"
                  >
                    連煉 5 枚
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 丹藥儲存與服用 */}
      <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3 shadow-xs">
        <div className="flex items-center gap-1.5 border-b border-[#cbbea5]/70 pb-2 mb-2.5">
          <Package className="w-4 h-4 text-[#9e2a2b]" />
          <h4 className="font-bold text-xs text-[#1f1f1f]">
            儲物袋丹藥庫 (即時服用)
          </h4>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {/* 培元丹 */}
          <div className="p-2.5 bg-[#f5efe3] border border-[#d8ceba] rounded flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1f1f1f]">培元丹</div>
              <div className="text-[11px] text-[#736e63]">
                存量: <span className="font-bold text-[#9e2a2b]">{pills.peiyuan}</span> 枚
              </div>
            </div>
            <button
              disabled={pills.peiyuan <= 0}
              onClick={() => handleUse('peiyuan')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                pills.peiyuan > 0
                  ? 'bg-[#2d6a4f] text-white hover:bg-[#22543d] active:scale-95 cursor-pointer'
                  : 'bg-[#d8ceba] text-[#8c8577] cursor-not-allowed'
              }`}
            >
              吞服 (+50修為)
            </button>
          </div>

          {/* 凝神丹 */}
          <div className="p-2.5 bg-[#f5efe3] border border-[#d8ceba] rounded flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1f1f1f]">凝神丹</div>
              <div className="text-[11px] text-[#736e63]">
                存量: <span className="font-bold text-[#9e2a2b]">{pills.concentrate}</span> 枚
              </div>
            </div>
            <button
              disabled={pills.concentrate <= 0}
              onClick={() => handleUse('concentrate')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                pills.concentrate > 0
                  ? 'bg-[#2d6a4f] text-white hover:bg-[#22543d] active:scale-95 cursor-pointer'
                  : 'bg-[#d8ceba] text-[#8c8577] cursor-not-allowed'
              }`}
            >
              吞服 (+200修為)
            </button>
          </div>

          {/* 洗髓金丹 */}
          <div className="p-2.5 bg-[#f5efe3] border border-[#d8ceba] rounded flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1f1f1f]">洗髓金丹</div>
              <div className="text-[11px] text-[#736e63]">
                存量: <span className="font-bold text-[#9e2a2b]">{pills.bodyMarrow}</span> 枚
              </div>
            </div>
            <button
              disabled={pills.bodyMarrow <= 0}
              onClick={() => handleUse('bodyMarrow')}
              className={`px-2.5 py-1 rounded text-xs font-semibold ${
                pills.bodyMarrow > 0
                  ? 'bg-[#c5a059] text-white hover:bg-[#a3803f] active:scale-95 cursor-pointer'
                  : 'bg-[#d8ceba] text-[#8c8577] cursor-not-allowed'
              }`}
            >
              重塑 (+5/秒吸收)
            </button>
          </div>

          {/* 破境丹 */}
          <div className="p-2.5 bg-[#f5efe3] border border-[#d8ceba] rounded flex items-center justify-between">
            <div>
              <div className="font-bold text-[#1f1f1f]">破境丹</div>
              <div className="text-[11px] text-[#736e63]">
                存量: <span className="font-bold text-[#9e2a2b]">{pills.breakPill}</span> 枚
              </div>
            </div>
            <span className="text-[10px] text-[#9e2a2b] font-semibold">
              渡劫突破時自動護法
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

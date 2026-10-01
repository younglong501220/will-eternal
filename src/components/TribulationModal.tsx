import React, { useState } from 'react';
import { Sparkles, Shield, AlertTriangle, X, Check } from 'lucide-react';
import { sound } from '../utils/audio';

interface TribulationModalProps {
  currentRealmName: string;
  nextRealmName: string;
  breakPillCount: number;
  onConfirmBreakthrough: (usePill: boolean) => void;
  onClose: () => void;
}

export const TribulationModal: React.FC<TribulationModalProps> = ({
  currentRealmName,
  nextRealmName,
  breakPillCount,
  onConfirmBreakthrough,
  onClose,
}) => {
  const [usePill, setUsePill] = useState(breakPillCount > 0);
  const [isStriking, setIsStriking] = useState(false);

  const baseRate = 65;
  const pillBonus = usePill && breakPillCount > 0 ? 30 : 0;
  const totalRate = Math.min(100, baseRate + pillBonus);

  const handleStartTribulation = () => {
    setIsStriking(true);
    sound.play('tribulation');

    setTimeout(() => {
      onConfirmBreakthrough(usePill && breakPillCount > 0);
      setIsStriking(false);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fadeIn">
      {/* Tribulation flash overlay */}
      {isStriking && (
        <div className="absolute inset-0 z-60 bg-white/40 animate-pulse pointer-events-none" />
      )}

      <div className="relative w-full max-w-md bg-[#f4efe6] border-4 border-[#3d342a] rounded-lg shadow-2xl p-5 overflow-hidden paper-texture">
        {/* Decorative corner ribbons */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#9e2a2b] rotate-45 transform pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          disabled={isStriking}
          className="absolute top-3 right-3 p-1 text-[#6b6456] hover:text-[#1a1816] rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-4">
          <span className="inline-block px-3 py-0.5 text-xs font-bold text-white bg-[#9e2a2b] border border-[#c84b31] rounded shadow-xs mb-1.5 font-calligraphy tracking-widest">
            天地玄黃 · 九霄雷劫
          </span>
          <h2 className="text-2xl font-black text-[#1a1816] font-calligraphy tracking-wider">
            引動天劫 · 破境飛升
          </h2>
          <p className="text-xs text-[#736e63] mt-1">
            當前境界【{currentRealmName}】圓滿，欲晉陞至【
            <span className="text-[#9e2a2b] font-bold">{nextRealmName}</span>】
          </p>
        </div>

        {/* Tribulation Rate Gauge */}
        <div className="bg-[#e9dfcb] border border-[#cbbea5] rounded-md p-3.5 mb-4 shadow-inner text-center">
          <div className="text-xs text-[#59544c] mb-1">天道感應渡劫成功率</div>
          <div className="flex items-center justify-center gap-1.5 my-1">
            <span
              className={`text-3xl font-black font-mono tabular-nums ${
                totalRate >= 90
                  ? 'text-[#2d6a4f]'
                  : totalRate >= 70
                  ? 'text-[#c5a059]'
                  : 'text-[#9e2a2b]'
              }`}
            >
              {totalRate}%
            </span>
          </div>

          <div className="text-[11px] text-[#736e63] flex justify-center items-center gap-2">
            <span>基礎機率: {baseRate}%</span>
            {pillBonus > 0 && (
              <span className="text-[#2d6a4f] font-semibold">
                + 破境丹加護: {pillBonus}%
              </span>
            )}
          </div>
        </div>

        {/* Pill Selection */}
        <div className="bg-[#ede4d2] border border-[#cbbea5] rounded-md p-3 mb-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Shield
                className={`w-5 h-5 ${
                  breakPillCount > 0 ? 'text-[#9e2a2b]' : 'text-[#8c8577]'
                }`}
              />
              <div>
                <div className="text-xs font-bold text-[#1f1f1f]">
                  使用【破境丹】護持靈台
                </div>
                <div className="text-[11px] text-[#736e63]">
                  提升 30% 突破率，儲物袋存量：
                  <span className="font-bold text-[#9e2a2b]">
                    {breakPillCount}
                  </span>{' '}
                  枚
                </div>
              </div>
            </div>

            <input
              type="checkbox"
              checked={usePill && breakPillCount > 0}
              disabled={breakPillCount === 0 || isStriking}
              onChange={(e) => setUsePill(e.target.checked)}
              className="w-4 h-4 accent-[#9e2a2b] cursor-pointer"
            />
          </label>
          {breakPillCount === 0 && (
            <p className="text-[10px] text-[#9e2a2b] mt-1.5">
              * 提示：儲物袋中無破境丹，可前往【丹房】採藥煉製或於【宗門寶閣】兌換。
            </p>
          )}
        </div>

        {/* Warning / Lore */}
        <div className="flex items-start gap-2 text-xs text-[#6b6456] mb-5 bg-[#faf6ef] p-2.5 rounded border border-[#e2d6c0]">
          <AlertTriangle className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            渡劫乃逆天行事。若突破失敗將引發心魔反噬，損耗約三成修為真元，需調息重新凝氣。
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isStriking}
            className="flex-1 py-2 text-xs font-medium text-[#4a4641] bg-[#e4dac6] hover:bg-[#d8ccb4] border border-[#b8a992] rounded transition-all active:scale-95"
          >
            暫穩道心 (取消)
          </button>

          <button
            onClick={handleStartTribulation}
            disabled={isStriking}
            className={`flex-1 py-2 text-xs font-bold text-white rounded transition-all shadow-md flex items-center justify-center gap-1.5 ${
              isStriking
                ? 'bg-[#736e63] cursor-wait'
                : 'bg-[#9e2a2b] hover:bg-[#801f20] active:scale-95 cursor-pointer'
            }`}
          >
            {isStriking ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>九天雷劫降臨中...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>引動九天雷劫</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { CultivationPath } from '../types/cultivation';
import { sound } from '../utils/audio';
import { Flame, Sparkles, RefreshCw } from 'lucide-react';

interface FloatingNumber {
  id: number;
  text: string;
  x: number;
  y: number;
}

interface CultivationCoreProps {
  path: CultivationPath;
  exp: number;
  maxExp: number;
  autoGainRate: number;
  clickGain: number;
  canBreakthrough: boolean;
  onMeditateClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onSwitchPath: () => void;
  onBreakthrough: () => void;
}

export const CultivationCore: React.FC<CultivationCoreProps> = ({
  path,
  exp,
  maxExp,
  autoGainRate,
  clickGain,
  canBreakthrough,
  onMeditateClick,
  onSwitchPath,
  onBreakthrough,
}) => {
  const [floaters, setFloaters] = useState<FloatingNumber[]>([]);
  const [isPressed, setIsPressed] = useState(false);

  const expPercent = Math.min(100, Math.max(0, (exp / maxExp) * 100));

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    sound.play('click');
    onMeditateClick(e);

    // Create a floating text effect at click position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + (Math.random() * 20 - 10);
    const y = e.clientY - rect.top - 15;

    const newFloater: FloatingNumber = {
      id: Date.now() + Math.random(),
      text: `+${clickGain} 靈氣`,
      x,
      y,
    };

    setFloaters((prev) => [...prev, newFloater]);
    setTimeout(() => {
      setFloaters((prev) => prev.filter((item) => item.id !== newFloater.id));
    }, 850);
  };

  return (
    <div className="relative px-4 py-4 sm:py-5 flex flex-col items-center border-b border-[#cbbea5] bg-gradient-to-b from-[#f4efe6]/50 via-transparent to-[#ece4d4]/40 select-none overflow-hidden">
      {/* Background ink wash mountain silhouette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07] bg-center bg-no-repeat bg-cover"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #000 0%, transparent 75%)`,
        }}
      />

      {/* Center Interactive Tai-Chi / Bagua Disc */}
      <div className="relative my-1">
        {/* Floating animated numbers */}
        {floaters.map((floater) => (
          <div
            key={floater.id}
            className="absolute pointer-events-none text-sm font-bold text-[#9e2a2b] font-calligraphy z-30 floating-ink-text drop-shadow-sm whitespace-nowrap"
            style={{ left: `${floater.x}px`, top: `${floater.y}px` }}
          >
            {floater.text}
          </div>
        ))}

        {/* Outer glowing ink pulse aura */}
        <div className="absolute -inset-3 sm:-inset-4 rounded-full border-2 border-dashed border-[#9e2a2b]/35 animate-ink-pulse pointer-events-none" />
        <div className="absolute -inset-1 sm:-inset-1.5 rounded-full border border-[#c5a059]/40 animate-spin-slow pointer-events-none" />

        {/* The Clickable Tai Chi Node */}
        <div
          onClick={handleClick}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onTouchStart={() => setIsPressed(true)}
          onTouchEnd={() => setIsPressed(false)}
          className={`relative w-32 h-32 sm:w-36 sm:h-36 rounded-full cursor-pointer flex flex-col items-center justify-center transition-all duration-150 shadow-md ${
            isPressed ? 'scale-92' : 'hover:scale-103'
          } ${
            canBreakthrough
              ? 'ring-4 ring-[#9e2a2b]/60 ring-offset-2 ring-offset-[#f4efe6]'
              : 'border-2 border-[#8c8577]/70'
          }`}
          style={{
            background:
              'radial-gradient(circle at 40% 40%, #fdfcf9 0%, #ece5d6 65%, #d8cdb8 100%)',
            boxShadow:
              'inset 0 2px 10px rgba(255,255,255,0.8), 0 6px 18px rgba(0,0,0,0.12)',
          }}
          title="點擊聚靈吐納 (吸納天地精華)"
        >
          {/* Subtle Yin Yang / Bagua lines decoration */}
          <div className="absolute inset-2 rounded-full border border-dashed border-[#9b9385]/40 pointer-events-none" />

          {/* Central Calligraphy Text */}
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <span
              className="text-2xl sm:text-3xl font-extrabold text-[#1a1816] font-calligraphy tracking-widest leading-none drop-shadow-xs"
              style={{ writingMode: 'vertical-rl' }}
            >
              吐納
            </span>
            <span className="text-[10px] text-[#736e63] font-medium tracking-tight mt-1">
              點擊聚靈
            </span>
          </div>

          {/* Breakthrough ready beacon */}
          {canBreakthrough && (
            <div className="absolute -top-1.5 -right-1.5 bg-[#9e2a2b] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow animate-bounce flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              <span>圓滿</span>
            </div>
          )}
        </div>
      </div>

      {/* Cultivation Progress Bar Area */}
      <div className="w-full max-w-sm mt-3 px-2">
        <div className="flex justify-between items-center text-xs mb-1.5">
          <span className="text-[#59544c] font-medium flex items-center gap-1">
            <span>修為積累</span>
            <span className="text-[11px] text-[#8c8577]">
              (+{autoGainRate}/秒)
            </span>
          </span>
          <span className="font-mono tabular-nums text-xs font-semibold text-[#1a1816]">
            {Math.floor(exp).toLocaleString()} / {maxExp.toLocaleString()} (
            {expPercent.toFixed(1)}%)
          </span>
        </div>

        {/* Progress Track */}
        <div className="w-full h-3 bg-[#d8cebc] border border-[#a89d89] rounded-full overflow-hidden p-0.5 shadow-inner relative">
          <div
            className={`h-full rounded-full transition-all duration-300 relative ${
              canBreakthrough
                ? 'bg-gradient-to-r from-[#9e2a2b] via-[#c84b31] to-[#c5a059] shadow-sm'
                : 'bg-gradient-to-r from-[#3e3a35] via-[#24211d] to-[#121110]'
            }`}
            style={{ width: `${expPercent}%` }}
          >
            {/* Shimmer animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
          </div>
        </div>
      </div>

      {/* Buttons row: Path Switcher & Breakthrough */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={onSwitchPath}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#2b2823] hover:text-[#9e2a2b] bg-[#e4dac6] hover:bg-[#d8ccb4] border border-[#b8a992] rounded-md transition-all active:scale-95 shadow-xs"
          title="轉修其他道途"
        >
          <RefreshCw className="w-3 h-3 text-[#736e63]" />
          <span>切換道途：{path === 'fa' ? '體修' : '法修'}</span>
        </button>

        <button
          onClick={onBreakthrough}
          disabled={!canBreakthrough}
          className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-md transition-all tracking-wider shadow-sm ${
            canBreakthrough
              ? 'bg-[#9e2a2b] hover:bg-[#852324] text-white active:scale-95 animate-pulse cursor-pointer shadow-md'
              : 'bg-[#beb6a4] text-[#6b6456] cursor-not-allowed opacity-70'
          }`}
          title={canBreakthrough ? '靈氣圓滿，引動天劫！' : '修為尚未圓滿，暫不可突破'}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>渡劫突破</span>
        </button>
      </div>
    </div>
  );
};

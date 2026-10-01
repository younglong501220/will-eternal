import React, { useState } from 'react';
import { Volume2, VolumeX, Backpack, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { CultivationPath } from '../types/cultivation';
import { sound } from '../utils/audio';

interface HeaderProps {
  path: CultivationPath;
  realmName: string;
  spiritStones: number;
  sectPoints: number;
  herbs: number;
  cores: number;
  onOpenBag: () => void;
  onOpenAchievements: () => void;
  onResetGame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  path,
  realmName,
  spiritStones,
  sectPoints,
  herbs,
  cores,
  onOpenBag,
  onOpenAchievements,
  onResetGame,
}) => {
  const [isMuted, setIsMuted] = useState(!sound.isEnabled());

  const handleToggleSound = () => {
    const enabled = sound.toggleSound();
    setIsMuted(!enabled);
  };

  return (
    <header className="relative z-10 px-4 py-3 border-b-2 border-[#b5ab96] bg-gradient-to-b from-[#e5dec9] via-[#eee7d7] to-[#f4efe6]/90 backdrop-blur-sm select-none">
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        {/* Realm Badge & Name */}
        <div className="flex items-center gap-2.5">
          <div className="relative group">
            <span
              className="inline-block px-2.5 py-0.5 text-xs font-bold text-white bg-[#9e2a2b] border border-[#c84b31]/60 rounded shadow-sm tracking-widest cursor-default"
              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.5)' }}
            >
              {path === 'fa' ? '法修' : '體修'}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <h1 className="text-xl font-bold tracking-wide text-[#1f1f1f] font-calligraphy">
              {realmName}
            </h1>
            <span className="text-[11px] text-[#736e63] font-medium hidden sm:inline">
              {path === 'fa' ? '御劍凝神' : '氣血烘爐'}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenBag}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#2b2823] bg-[#e2d8c3] hover:bg-[#d5c9b0] active:scale-95 border border-[#baa990] rounded transition-all shadow-xs"
            title="開啟儲物袋"
          >
            <Backpack className="w-3.5 h-3.5 text-[#9e2a2b]" />
            <span className="hidden sm:inline">儲物袋</span>
          </button>

          <button
            onClick={onOpenAchievements}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-[#2b2823] bg-[#e2d8c3] hover:bg-[#d5c9b0] active:scale-95 border border-[#baa990] rounded transition-all shadow-xs"
            title="仙途成就"
          >
            <Trophy className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="hidden sm:inline">仙途</span>
          </button>

          <button
            onClick={handleToggleSound}
            className="p-1.5 text-[#4a4641] hover:text-[#1a1816] hover:bg-[#e2d8c3] active:scale-95 border border-[#baa990]/60 rounded transition-all"
            title={isMuted ? '開啟音效' : '靜音'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-[#8c8577]" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#9e2a2b]" />
            )}
          </button>

          <button
            onClick={onResetGame}
            className="p-1.5 text-[#736e63] hover:text-[#9e2a2b] hover:bg-[#e2d8c3] active:scale-95 border border-[#baa990]/60 rounded transition-all"
            title="轉世重修 (重設進度)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Resource bar */}
      <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#cbbea5]/60 text-xs text-[#4a4641]">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-[#736e63]">靈石:</span>
            <span className="font-semibold text-[#9e2a2b] tabular-nums font-mono">
              {spiritStones.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[#736e63]">宗門貢獻:</span>
            <span className="font-semibold text-[#b36200] tabular-nums font-mono">
              {sectPoints.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1 hidden xs:flex">
            <span className="text-[#736e63]">靈草:</span>
            <span className="font-semibold text-[#2d6a4f] tabular-nums font-mono">
              {herbs}
            </span>
          </div>

          <div className="flex items-center gap-1 hidden xs:flex">
            <span className="text-[#736e63]">妖丹:</span>
            <span className="font-semibold text-[#6a040f] tabular-nums font-mono">
              {cores}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-[#8c8577]">
          <Sparkles className="w-3 h-3 text-[#c5a059]" />
          <span>天道氣運自轉中</span>
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { SECRET_REALMS, SecretRealm, GameLog } from '../types/cultivation';
import { sound } from '../utils/audio';
import { Swords, Compass, Sparkles, MapPin, Trash2 } from 'lucide-react';

interface AdventureTabProps {
  currentRealmIndex: number;
  activeRealmId: string;
  logs: GameLog[];
  onSelectRealm: (realmId: string) => void;
  onFastHunt: () => void;
  onClearLogs: () => void;
}

export const AdventureTab: React.FC<AdventureTabProps> = ({
  currentRealmIndex,
  activeRealmId,
  logs,
  onSelectRealm,
  onFastHunt,
  onClearLogs,
}) => {
  const [slashEffect, setSlashEffect] = useState(false);

  const currentRealm =
    SECRET_REALMS.find((r) => r.id === activeRealmId) || SECRET_REALMS[0];

  const handleStrike = () => {
    sound.play('battle');
    setSlashEffect(true);
    setTimeout(() => setSlashEffect(false), 400);
    onFastHunt();
  };

  return (
    <div className="space-y-3.5 select-none animate-fadeIn relative">
      {/* Realm Selection Pills */}
      <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#9e2a2b]" />
            <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy">
              秘境神識探索
            </h3>
          </div>
          <span className="text-[11px] text-[#736e63]">
            神識正漫遊於洪荒外境
          </span>
        </div>

        {/* Realm Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
          {SECRET_REALMS.map((r) => {
            const isUnlocked = currentRealmIndex >= r.minRealmIndex;
            const isSelected = r.id === currentRealm.id;

            return (
              <button
                key={r.id}
                disabled={!isUnlocked}
                onClick={() => {
                  sound.play('click');
                  onSelectRealm(r.id);
                }}
                className={`px-2.5 py-1.5 text-xs rounded border transition-all text-left flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#9e2a2b] text-white border-[#852122] shadow-xs'
                    : isUnlocked
                    ? 'bg-[#ede5d3] hover:bg-[#e2d8c3] text-[#2d2a26] border-[#baa990]'
                    : 'bg-[#e2ded6]/50 text-[#8c8577] border-[#d0c8b8] cursor-not-allowed opacity-60'
                }`}
              >
                <div className="font-bold truncate">{r.name}</div>
                <div className="text-[10px] mt-0.5 opacity-80">
                  {isUnlocked ? `收穫x${r.herbYield}` : `需階位 ${r.minRealmIndex + 1}`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Realm Encounter Card */}
      <div className="relative bg-white/70 border border-[#cbbea5] rounded-md p-3.5 shadow-xs overflow-hidden">
        {/* Slash effect on strike */}
        {slashEffect && (
          <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center bg-red-900/10">
            <div className="w-48 h-1 bg-gradient-to-r from-transparent via-[#c84b31] to-transparent slash-effect shadow-lg" />
          </div>
        )}

        <div className="flex items-center justify-between border-b border-[#cbbea5]/70 pb-2 mb-2.5">
          <div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#9e2a2b]" />
              <h4 className="font-bold text-sm text-[#1f1f1f]">
                {currentRealm.name}
              </h4>
            </div>
            <p className="text-[11px] text-[#736e63] mt-0.5">
              {currentRealm.description}
            </p>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 text-xs text-[#9e2a2b] font-semibold animate-pulse">
              <Sparkles className="w-3 h-3" />
              <span>神識狩獵中</span>
            </span>
          </div>
        </div>

        {/* Monster encounter & Fast Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-[#f5efe3] p-2.5 rounded border border-[#dfd5c2]">
          <div className="text-xs">
            <div className="text-[#736e63]">出沒大妖首領：</div>
            <div className="font-bold text-sm text-[#1a1816] mt-0.5">
              {currentRealm.bossName}
            </div>
            <div className="text-[11px] text-[#2d6a4f] mt-0.5">
              掉落概覽：上品靈石、千年靈草、大妖內丹、罕見靈獸蛋
            </div>
          </div>

          <button
            onClick={handleStrike}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#9e2a2b] hover:bg-[#801f20] active:scale-95 rounded shadow-sm transition-all whitespace-nowrap cursor-pointer"
            title="祭出本命飛劍神通，瞬息清空妖獸群"
          >
            <Swords className="w-3.5 h-3.5" />
            <span>神通鎮壓 (瞬殺群妖)</span>
          </button>
        </div>
      </div>

      {/* Real-time Adventure Ink Log */}
      <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#cbbea5]/70 pb-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3 bg-[#9e2a2b] rounded-xs" />
            <h4 className="font-bold text-xs text-[#1f1f1f]">
              秘境歷練卷軸 (神識日誌)
            </h4>
          </div>

          <button
            onClick={onClearLogs}
            className="flex items-center gap-1 text-[11px] text-[#736e63] hover:text-[#9e2a2b] transition-colors"
            title="清空日誌"
          >
            <Trash2 className="w-3 h-3" />
            <span>清空記錄</span>
          </button>
        </div>

        <div className="h-44 sm:h-52 overflow-y-auto pr-1 space-y-1.5 text-xs text-[#3d3b37]">
          {logs.length === 0 ? (
            <div className="text-center py-6 text-xs text-[#8c8577]">
              神識正在悄然探尋秘境深處，暫無交鋒記錄...
            </div>
          ) : (
            logs.map((log) => {
              let badgeColor = 'bg-[#4a4641] text-white';
              if (log.type === 'system') badgeColor = 'bg-[#6b6456] text-white';
              if (log.type === 'breakthrough') badgeColor = 'bg-[#c5a059] text-white';
              if (log.type === 'adventure') badgeColor = 'bg-[#2d6a4f] text-white';
              if (log.type === 'alchemy') badgeColor = 'bg-[#b36200] text-white';
              if (log.type === 'beast') badgeColor = 'bg-[#5c2d91] text-white';
              if (log.type === 'sect') badgeColor = 'bg-[#9e2a2b] text-white';

              return (
                <div
                  key={log.id}
                  className="flex items-start gap-1.5 py-1 px-1.5 rounded hover:bg-[#ede5d3]/50 transition-colors border-b border-dashed border-[#cbbea5]/30 leading-relaxed"
                >
                  <span
                    className={`inline-block px-1.5 py-0.2 text-[10px] font-bold rounded-xs shrink-0 tracking-wider font-mono ${badgeColor}`}
                  >
                    {log.type === 'adventure'
                      ? '秘境'
                      : log.type === 'breakthrough'
                      ? '突破'
                      : log.type === 'alchemy'
                      ? '丹道'
                      : log.type === 'beast'
                      ? '靈獸'
                      : log.type === 'sect'
                      ? '伏魔'
                      : '天道'}
                  </span>
                  <span className="text-[11px] text-[#8c8577] font-mono shrink-0">
                    {log.timestamp}
                  </span>
                  <span className="flex-1 break-words">{log.text}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

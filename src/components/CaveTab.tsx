import React, { useState } from 'react';
import { CultivationPath, PetData } from '../types/cultivation';
import { Zap, Shield, BookOpen, Compass, Award, Sparkles } from 'lucide-react';
import { TalentView } from './TalentView';
import { MeridianCirculation } from './MeridianCirculation';
import { sound } from '../utils/audio';

interface CaveTabProps {
  path: CultivationPath;
  realmIndex: number;
  realmName: string;
  autoGainRate: number;
  pet: PetData | null;
  permanentMarrowBonus: number;
  totalKills: number;
  pillsCrafted: number;
  talentPoints: number;
  talents: Record<string, number>;
  spiritStones: number;
  onUpgradeTalent: (talentId: string) => void;
  onResetTalents: () => void;
}

export const CaveTab: React.FC<CaveTabProps> = ({
  path,
  realmIndex,
  realmName,
  autoGainRate,
  pet,
  permanentMarrowBonus,
  totalKills,
  pillsCrafted,
  talentPoints,
  talents,
  spiritStones,
  onUpgradeTalent,
  onResetTalents,
}) => {
  const [caveSubTab, setCaveSubTab] = useState<'meridian' | 'talents'>('meridian');

  const combatPowerMultiplier = 1 + ((talents['combat_power'] || 0) * 10 + (talents['combat_chaos'] ? 35 : 0)) / 100;
  const rawCombatPower =
    path === 'fa'
      ? (realmIndex + 1) * 45 + (pet && pet.bonusType === 'combat' ? pet.level * 20 : 0)
      : (realmIndex + 1) * 70 + (pet && pet.bonusType === 'combat' ? pet.level * 30 : 0);
  const combatPower = Math.floor(rawCombatPower * combatPowerMultiplier);

  const petBonusText = pet
    ? `${pet.name} (+${pet.level * pet.bonusPercent}% ${
        pet.bonusType === 'qi'
          ? '修為汲取'
          : pet.bonusType === 'combat'
          ? '鬥法神威'
          : '草木福緣'
      })`
    : '暫無本命靈獸護法';

  return (
    <div className="space-y-3 select-none animate-fadeIn">
      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-1.5 p-1 bg-[#ded5bf] rounded-md border border-[#c4b9a3] text-xs">
        <button
          onClick={() => {
            sound.play('click');
            setCaveSubTab('meridian');
          }}
          className={`flex-1 py-1.5 px-3 rounded font-medium transition-all text-center flex items-center justify-center gap-1 ${
            caveSubTab === 'meridian'
              ? 'bg-[#f4efe6] text-[#9e2a2b] font-bold shadow-xs'
              : 'text-[#4a4641] hover:text-[#1a1816]'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>洞府經脈</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setCaveSubTab('talents');
          }}
          className={`flex-1 py-1.5 px-3 rounded font-medium transition-all text-center flex items-center justify-center gap-1 relative ${
            caveSubTab === 'talents'
              ? 'bg-[#f4efe6] text-[#9e2a2b] font-bold shadow-xs'
              : 'text-[#4a4641] hover:text-[#1a1816]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>靈脈天賦</span>
          {talentPoints > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-[#9e2a2b] text-white text-[10px] font-bold rounded-full animate-bounce">
              {talentPoints}
            </span>
          )}
        </button>
      </div>

      {caveSubTab === 'talents' ? (
        <TalentView
          talentPoints={talentPoints}
          talents={talents}
          spiritStones={spiritStones}
          onUpgradeTalent={onUpgradeTalent}
          onResetTalents={onResetTalents}
        />
      ) : (
        <div className="space-y-3.5">
          {/* 經脈運轉動態視覺圖 */}
          <MeridianCirculation
            path={path}
            autoGainRate={autoGainRate}
            realmName={realmName}
          />

          {/* 經脈與氣海面板 */}
          <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3.5 shadow-xs relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#cbbea5]/70 pb-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-3.5 bg-[#9e2a2b] rounded-xs" />
                <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy tracking-wide">
                  洞府經脈 · 氣海周天
                </h3>
              </div>
              <span className="text-xs text-[#2d6a4f] font-semibold font-mono tabular-nums">
                周天運轉: +{autoGainRate}/秒
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#4a4641]">
              <div className="space-y-1.5">
                <div className="flex justify-between items-center py-1 border-b border-dashed border-[#cbbea5]/40">
                  <span className="text-[#736e63]">當前道途</span>
                  <span className="font-bold text-[#9e2a2b]">
                    {path === 'fa' ? '法修 (萬法御空)' : '體修 (金身破虛)'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-dashed border-[#cbbea5]/40">
                  <span className="text-[#736e63]">
                    {path === 'fa' ? '法術真元強度' : '氣血金身神力'}
                  </span>
                  <span className="font-semibold font-mono tabular-nums text-[#1a1816]">
                    {combatPower} 點
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-dashed border-[#cbbea5]/40">
                  <span className="text-[#736e63]">洗髓金丹加持</span>
                  <span className="font-semibold text-[#b36200] font-mono tabular-nums">
                    +{permanentMarrowBonus}/秒
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center py-1 border-b border-dashed border-[#cbbea5]/40">
                  <span className="text-[#736e63]">本命靈獸守護</span>
                  <span className="font-semibold text-[#2d6a4f] text-[11px] truncate max-w-[140px]">
                    {petBonusText}
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-dashed border-[#cbbea5]/40">
                  <span className="text-[#736e63]">秘境斬妖累計</span>
                  <span className="font-semibold font-mono tabular-nums text-[#1a1816]">
                    {totalKills} 頭妖獸
                  </span>
                </div>

                <div className="flex justify-between items-center py-1 border-b border-dashed border-[#cbbea5]/40">
                  <span className="text-[#736e63]">靈脈天賦總投點</span>
                  <span className="font-semibold text-[#9e2a2b] font-mono tabular-nums">
                    {Object.values(talents).reduce((a, b) => a + (b || 0), 0)} 點
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#cbbea5]/50 text-[11px] text-[#6b6456] leading-relaxed">
              {path === 'fa' ? (
                <p>
                  ◆ <strong>法修精義</strong>
                  ：主修靈台元神，吸納天地靈氣更加迅疾，施展神通玄奧莫測，突破更易引動天劫福澤。
                </p>
              ) : (
                <p>
                  ◆ <strong>體修精義</strong>
                  ：主修肉身血氣，以力證道，單次吐納與搏殺爆發力雄厚，面對宗門兇獸更具鎮壓之威。
                </p>
              )}
            </div>
          </div>

          {/* 心法頓悟 */}
          <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3.5 shadow-xs">
            <div className="flex items-center gap-1.5 border-b border-[#cbbea5]/70 pb-2 mb-2.5">
              <BookOpen className="w-4 h-4 text-[#9e2a2b]" />
              <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy tracking-wide">
                玄門真經 · 心法感悟
              </h3>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-2 rounded bg-[#f3ecdd] border border-[#d8cdb8] flex items-start gap-2.5">
                <Zap className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#1f1f1f] flex items-center gap-1.5">
                    <span>《玄元導引篇》</span>
                    <span className="text-[10px] text-[#2d6a4f] font-normal">已融會貫通</span>
                  </div>
                  <p className="text-[#6b6456] text-[11px] mt-0.5">
                    初入修真門檻，引氣入體，通百脈而聚靈海。基礎自動吸納效率提升。
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-[#f3ecdd] border border-[#d8cdb8] flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-[#9e2a2b] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#1f1f1f] flex items-center gap-1.5">
                    <span>《太乙九宮引》</span>
                    <span className="text-[10px] text-[#736e63] font-normal">
                      {realmIndex >= 3 ? '已參悟玄機' : '築基期方可解鎖'}
                    </span>
                  </div>
                  <p className="text-[#6b6456] text-[11px] mt-0.5">
                    太乙循行九宮，經脈如大江奔流，真元綿綿不絕，強化歷練生存與殺伐。
                  </p>
                </div>
              </div>

              <div className="p-2 rounded bg-[#f3ecdd] border border-[#d8cdb8] flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#2d6a4f] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-[#1f1f1f] flex items-center gap-1.5">
                    <span>《萬古逍遙訣》</span>
                    <span className="text-[10px] text-[#736e63] font-normal">
                      {realmIndex >= 6 ? '元神大成' : '元嬰期方可參悟'}
                    </span>
                  </div>
                  <p className="text-[#6b6456] text-[11px] mt-0.5">
                    天地為爐，造化為工，一念超脫凡塵，與造化同遊，洞府吐納天地通融。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 修仙箴言 */}
          <div className="p-3 rounded bg-gradient-to-r from-[#ece4d4] to-[#f4efe6] border border-[#cbbea5] shadow-inner text-center">
            <Award className="w-4 h-4 text-[#9e2a2b] mx-auto mb-1" />
            <p className="text-xs text-[#4a4641] font-calligraphy tracking-widest leading-relaxed">
              「仙路漫漫，一念成魔，一念逍遙。凡人修真，唯持之以恆，運轉周天，方可窺得天道。」
            </p>
            <div className="text-[10px] text-[#8c8577] mt-1 font-mono">
              —— 逍遙祖師 · 傳道玉簡
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

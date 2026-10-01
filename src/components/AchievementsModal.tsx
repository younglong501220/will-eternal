import React from 'react';
import { PlayerState } from '../types/cultivation';
import { Trophy, CheckCircle, X, Gift } from 'lucide-react';
import { sound } from '../utils/audio';

export interface Milestone {
  id: string;
  title: string;
  desc: string;
  rewardText: string;
  isCompleted: boolean;
  reward: {
    stones?: number;
    points?: number;
    herbs?: number;
    cores?: number;
    eggs?: number;
    breakPill?: number;
    bodyMarrow?: number;
  };
}

interface AchievementsModalProps {
  player: PlayerState;
  claimedIds: string[];
  onClaimMilestone: (milestone: Milestone) => void;
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  player,
  claimedIds,
  onClaimMilestone,
  onClose,
}) => {
  const milestones: Milestone[] = [
    {
      id: 'm_realm_1',
      title: '初踏仙途',
      desc: '修為突破至第二層境界 (練氣前期/通脈精純)。',
      rewardText: '靈石 +50、靈草 +5',
      isCompleted: player.realmIndex >= 1,
      reward: { stones: 50, herbs: 5 },
    },
    {
      id: 'm_realm_3',
      title: '築基洗髓',
      desc: '道行大進，跨入第四層境界 (築基初期/鍛骨洗髓)。',
      rewardText: '長老破境丹 x1、靈石 +150',
      isCompleted: player.realmIndex >= 3,
      reward: { breakPill: 1, stones: 150 },
    },
    {
      id: 'm_realm_5',
      title: '金丹大道',
      desc: '結丹圓滿或金身大成，邁入第六層境界。',
      rewardText: '太古靈獸蛋 x1、妖丹 +5',
      isCompleted: player.realmIndex >= 5,
      reward: { eggs: 1, cores: 5 },
    },
    {
      id: 'm_hunt_15',
      title: '斬妖校尉',
      desc: '深入秘境歷練，累計斬落 15 頭各路妖獸。',
      rewardText: '大妖妖丹 +3、千年靈草 +10',
      isCompleted: player.stats.totalMonstersSlain >= 15,
      reward: { cores: 3, herbs: 10 },
    },
    {
      id: 'm_hunt_50',
      title: '萬妖伏誅',
      desc: '神識縱橫四海，累計斬落 50 頭洪荒妖獸。',
      rewardText: '洗髓金丹 x1、靈石 +300',
      isCompleted: player.stats.totalMonstersSlain >= 50,
      reward: { bodyMarrow: 1, stones: 300 },
    },
    {
      id: 'm_alchemy_5',
      title: '妙手丹師',
      desc: '開爐煉丹，累計煉出 5 枚各品階仙丹。',
      rewardText: '千年靈草 +20、靈石 +100',
      isCompleted: player.stats.totalPillsCrafted >= 5,
      reward: { herbs: 20, stones: 100 },
    },
    {
      id: 'm_pet_bound',
      title: '萬獸通靈',
      desc: '孵化靈獸蛋，得仙禽異獸認主護法。',
      rewardText: '妖丹精華 +5、宗門貢獻 +50',
      isCompleted: player.pet !== null,
      reward: { cores: 5, points: 50 },
    },
    {
      id: 'm_boss_slain',
      title: '撼天鎮魔',
      desc: '合萬仙之力，成功剿滅至少 1 次太古撼天魔猿。',
      rewardText: '宗門貢獻 +200、靈石 +200',
      isCompleted: player.bossDefeats >= 1,
      reward: { points: 200, stones: 200 },
    },
  ];

  const handleClaim = (m: Milestone) => {
    sound.play('reward');
    onClaimMilestone(m);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#f4efe6] border-4 border-[#3d342a] rounded-lg shadow-2xl p-5 overflow-hidden paper-texture">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#b5ab96] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#c5a059]" />
            <h2 className="text-xl font-bold text-[#1f1f1f] font-calligraphy">
              仙途歷程 · 天道功德譜
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6b6456] hover:text-[#1a1816] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone List */}
        <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-2.5 text-xs">
          {milestones.map((m) => {
            const isClaimed = claimedIds.includes(m.id);

            return (
              <div
                key={m.id}
                className="p-3 bg-white/70 border border-[#cbbea5] rounded flex items-center justify-between gap-3 hover:border-[#9e2a2b]/60 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#1f1f1f]">
                      {m.title}
                    </span>
                    {isClaimed ? (
                      <span className="text-[10px] text-[#2d6a4f] flex items-center gap-0.5 font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        <span>已領取</span>
                      </span>
                    ) : m.isCompleted ? (
                      <span className="text-[10px] text-[#9e2a2b] font-bold animate-pulse">
                        可領取！
                      </span>
                    ) : (
                      <span className="text-[10px] text-[#8c8577]">進行中</span>
                    )}
                  </div>

                  <p className="text-[11px] text-[#6b6456] mt-0.5">{m.desc}</p>
                  <div className="text-[11px] text-[#2d6a4f] font-semibold mt-1 flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    <span>天道犒賞：{m.rewardText}</span>
                  </div>
                </div>

                <button
                  disabled={!m.isCompleted || isClaimed}
                  onClick={() => handleClaim(m)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-all ${
                    isClaimed
                      ? 'bg-[#ded6c5] text-[#8c8577] cursor-default'
                      : m.isCompleted
                      ? 'bg-[#9e2a2b] hover:bg-[#801f20] text-white active:scale-95 cursor-pointer shadow-xs animate-bounce'
                      : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed opacity-70'
                  }`}
                >
                  {isClaimed ? '已領取' : m.isCompleted ? '領取功德' : '未達成'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-[#cbbea5]/60 text-right">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#2b2823] hover:bg-[#1a1816] active:scale-95 rounded shadow-xs"
          >
            關閉功德譜
          </button>
        </div>
      </div>
    </div>
  );
};

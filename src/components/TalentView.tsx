import React, { useState } from 'react';
import { TalentDef, TALENTS_CATALOG } from '../types/cultivation';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Zap,
  Swords,
  Gift,
  RotateCcw,
  CheckCircle,
  Lock,
  GitBranch,
  ListFilter,
  Check,
} from 'lucide-react';

interface TalentViewProps {
  talentPoints: number;
  talents: Record<string, number>;
  spiritStones: number;
  onUpgradeTalent: (talentId: string) => void;
  onResetTalents: () => void;
}

interface TreeNodePos {
  id: string;
  x: number; // SVG viewBox center coordinates
  y: number;
  tier: number;
}

export const TalentView: React.FC<TalentViewProps> = ({
  talentPoints,
  talents,
  spiritStones,
  onUpgradeTalent,
  onResetTalents,
}) => {
  const [selectedBranch, setSelectedBranch] = useState<'qi' | 'combat' | 'fortune'>('qi');
  const [selectedTalentId, setSelectedTalentId] = useState<string>('qi_gather');
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree');
  const [justUpgraded, setJustUpgraded] = useState<string | null>(null);

  // Calculate spent points per branch
  const getBranchSpent = (branch: 'qi' | 'combat' | 'fortune') => {
    return TALENTS_CATALOG.filter((t) => t.branch === branch).reduce((sum, t) => {
      return sum + (talents[t.id] || 0);
    }, 0);
  };

  const totalSpent = Object.values(talents).reduce((a, b) => a + (b || 0), 0);
  const qiSpent = getBranchSpent('qi');
  const combatSpent = getBranchSpent('combat');
  const fortuneSpent = getBranchSpent('fortune');

  // Overall bonuses summary
  const qiGatherBonus = (talents['qi_gather'] || 0) * 8 + (talents['qi_unity'] ? 30 : 0);
  const combatPowerBonus = (talents['combat_power'] || 0) * 10 + (talents['combat_chaos'] ? 35 : 0);

  // Tree layouts by branch
  const BRANCH_TREE_CONFIGS: Record<
    'qi' | 'combat' | 'fortune',
    {
      nodes: TreeNodePos[];
      links: { from: string; to: string }[];
    }
  > = {
    qi: {
      nodes: [
        { id: 'qi_gather', x: 105, y: 55, tier: 1 },
        { id: 'qi_cycle', x: 315, y: 55, tier: 1 },
        { id: 'qi_pill', x: 210, y: 145, tier: 2 },
        { id: 'qi_unity', x: 210, y: 235, tier: 3 },
      ],
      links: [
        { from: 'qi_gather', to: 'qi_pill' },
        { from: 'qi_cycle', to: 'qi_pill' },
        { from: 'qi_pill', to: 'qi_unity' },
      ],
    },
    combat: {
      nodes: [
        { id: 'combat_power', x: 105, y: 55, tier: 1 },
        { id: 'combat_strike', x: 315, y: 55, tier: 1 },
        { id: 'combat_boss', x: 210, y: 145, tier: 2 },
        { id: 'combat_chaos', x: 210, y: 235, tier: 3 },
      ],
      links: [
        { from: 'combat_power', to: 'combat_boss' },
        { from: 'combat_strike', to: 'combat_boss' },
        { from: 'combat_boss', to: 'combat_chaos' },
      ],
    },
    fortune: {
      nodes: [
        { id: 'fortune_drop', x: 120, y: 70, tier: 1 },
        { id: 'fortune_alchemy', x: 300, y: 70, tier: 1 },
        { id: 'fortune_spirit', x: 210, y: 185, tier: 2 },
      ],
      links: [
        { from: 'fortune_drop', to: 'fortune_spirit' },
        { from: 'fortune_alchemy', to: 'fortune_spirit' },
      ],
    },
  };

  const currentTree = BRANCH_TREE_CONFIGS[selectedBranch];
  const branchTalents = TALENTS_CATALOG.filter((t) => t.branch === selectedBranch);

  const selectedTalent =
    TALENTS_CATALOG.find((t) => t.id === selectedTalentId) || branchTalents[0];

  const handleUpgrade = (t: TalentDef) => {
    const curLevel = talents[t.id] || 0;
    const branchSpent = getBranchSpent(t.branch);

    if (curLevel >= t.maxLevel || talentPoints <= 0 || branchSpent < t.reqSpent) {
      return;
    }

    sound.play('reward');
    setJustUpgraded(t.id);
    setTimeout(() => setJustUpgraded(null), 600);
    onUpgradeTalent(t.id);
  };

  const handleReset = () => {
    if (totalSpent === 0) {
      alert('尚無任何已分配的天賦點！');
      return;
    }

    if (window.confirm('確定要進行【洗髓通絡】，返還所有已分配的靈脈天賦點數嗎？')) {
      sound.play('breakthrough');
      onResetTalents();
    }
  };

  return (
    <div className="space-y-3.5 select-none animate-fadeIn">
      {/* Overview Card */}
      <div className="bg-white/65 border border-[#cbbea5] rounded-md p-3.5 shadow-xs relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#cbbea5]/70 pb-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-3.5 bg-[#9e2a2b] rounded-xs" />
            <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy tracking-wide">
              靈脈天賦神樹 · 奇經八脈
            </h3>
          </div>

          <div className="flex items-center gap-1.5">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 bg-[#ded5bf] rounded border border-[#baa990] text-[11px]">
              <button
                onClick={() => setViewMode('tree')}
                className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                  viewMode === 'tree'
                    ? 'bg-[#f4efe6] text-[#9e2a2b] font-bold shadow-xs'
                    : 'text-[#59544c]'
                }`}
                title="樹狀連結視圖"
              >
                <GitBranch className="w-3 h-3" />
                <span>脈絡樹</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                  viewMode === 'list'
                    ? 'bg-[#f4efe6] text-[#9e2a2b] font-bold shadow-xs'
                    : 'text-[#59544c]'
                }`}
                title="天賦列表視圖"
              >
                <ListFilter className="w-3 h-3" />
                <span>明細</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              disabled={totalSpent === 0}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded transition-all ${
                totalSpent > 0
                  ? 'bg-[#e2d8c3] hover:bg-[#d5c9b0] text-[#732223] font-semibold border border-[#baa990] active:scale-95 cursor-pointer shadow-xs'
                  : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed opacity-60'
              }`}
              title="洗髓返還所有天賦點數"
            >
              <RotateCcw className="w-3 h-3" />
              <span>洗髓</span>
            </button>
          </div>
        </div>

        {/* Talent Points Counter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2 rounded bg-[#f4efe3] border border-[#dfd5c2] flex flex-col justify-center">
            <span className="text-[#736e63] text-[11px]">可用天賦點</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums text-[#9e2a2b]">
                {talentPoints}
              </span>
              <span className="text-[10px] text-[#736e63]">點</span>
            </div>
          </div>

          <div className="p-2 rounded bg-[#f4efe3] border border-[#dfd5c2] flex flex-col justify-center">
            <span className="text-[#736e63] text-[11px]">已分配點數</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-xl font-bold font-mono tabular-nums text-[#2b2823]">
                {totalSpent}
              </span>
              <span className="text-[10px] text-[#736e63]">點</span>
            </div>
          </div>

          <div className="p-2 rounded bg-[#f4efe3] border border-[#dfd5c2] flex flex-col justify-center">
            <span className="text-[#736e63] text-[11px]">修為吸納永久加成</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono tabular-nums text-[#2d6a4f]">
                +{qiGatherBonus}%
              </span>
            </div>
          </div>

          <div className="p-2 rounded bg-[#f4efe3] border border-[#dfd5c2] flex flex-col justify-center">
            <span className="text-[#736e63] text-[11px]">鬥法神通永久加成</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-lg font-bold font-mono tabular-nums text-[#b36200]">
                +{combatPowerBonus}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Branch Selector Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#ded5bf] rounded-md border border-[#c4b9a3] text-xs">
        <button
          onClick={() => {
            sound.play('click');
            setSelectedBranch('qi');
            setSelectedTalentId('qi_gather');
          }}
          className={`flex-1 py-1.5 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1 ${
            selectedBranch === 'qi'
              ? 'bg-[#f4efe6] text-[#9e2a2b] font-bold shadow-xs'
              : 'text-[#4a4641] hover:text-[#1a1816]'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-[#2d6a4f]" />
          <span>氣海靈脈 ({qiSpent}點)</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setSelectedBranch('combat');
            setSelectedTalentId('combat_power');
          }}
          className={`flex-1 py-1.5 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1 ${
            selectedBranch === 'combat'
              ? 'bg-[#f4efe6] text-[#9e2a2b] font-bold shadow-xs'
              : 'text-[#4a4641] hover:text-[#1a1816]'
          }`}
        >
          <Swords className="w-3.5 h-3.5 text-[#9e2a2b]" />
          <span>玄煞神脈 ({combatSpent}點)</span>
        </button>

        <button
          onClick={() => {
            sound.play('click');
            setSelectedBranch('fortune');
            setSelectedTalentId('fortune_drop');
          }}
          className={`flex-1 py-1.5 px-2 rounded font-medium transition-all text-center flex items-center justify-center gap-1 ${
            selectedBranch === 'fortune'
              ? 'bg-[#f4efe6] text-[#9e2a2b] font-bold shadow-xs'
              : 'text-[#4a4641] hover:text-[#1a1816]'
          }`}
        >
          <Gift className="w-3.5 h-3.5 text-[#c5a059]" />
          <span>造化福緣 ({fortuneSpent}點)</span>
        </button>
      </div>

      {/* Mode 1: Connected SVG Tree Structure View */}
      {viewMode === 'tree' ? (
        <div className="bg-white/65 border border-[#cbbea5] rounded-md p-3.5 shadow-xs relative overflow-hidden">
          {/* Tier Labels on side */}
          <div className="flex justify-between items-center text-[10px] text-[#736e63] border-b border-[#cbbea5]/60 pb-1.5 mb-1">
            <span>第一重 · 凡竅初通</span>
            <span>第二重 · 顯化玄通 (需前置)</span>
            {selectedBranch !== 'fortune' && <span>第三重 · 大道至尊</span>}
          </div>

          {/* SVG Canvas with Connected Nodes */}
          <div className="relative w-full h-[290px] bg-[#f8f4eb] border border-[#dfd5c2] rounded-md overflow-hidden flex items-center justify-center">
            {/* Background subtle tree rings pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black via-transparent to-transparent" />

            <svg viewBox="0 0 420 290" className="w-full h-full">
              <defs>
                <linearGradient id="activeTreeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#c5a059" />
                  <stop offset="100%" stopColor="#9e2a2b" />
                </linearGradient>
              </defs>

              {/* Render SVG Connection Lines */}
              {currentTree.links.map((link, idx) => {
                const fromNode = currentTree.nodes.find((n) => n.id === link.from);
                const toNode = currentTree.nodes.find((n) => n.id === link.to);
                if (!fromNode || !toNode) return null;

                const toTalent = TALENTS_CATALOG.find((t) => t.id === toNode.id);
                const fromLvl = talents[fromNode.id] || 0;
                const branchSpent = getBranchSpent(selectedBranch);
                const isLinkActive =
                  fromLvl > 0 && branchSpent >= (toTalent?.reqSpent || 0);

                // Calculate bezier control points for smooth Chinese calligraphy curves
                const pathD = `M ${fromNode.x} ${fromNode.y + 24} C ${fromNode.x} ${
                  (fromNode.y + toNode.y) / 2
                }, ${toNode.x} ${(fromNode.y + toNode.y) / 2}, ${toNode.x} ${
                  toNode.y - 24
                }`;

                return (
                  <g key={`link-${idx}`}>
                    {/* Shadow / Base line */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#d0c4b2"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />

                    {/* Animated Flowing Line if active */}
                    <path
                      d={pathD}
                      fill="none"
                      stroke={isLinkActive ? 'url(#activeTreeGrad)' : '#b5a995'}
                      strokeWidth={isLinkActive ? '3.5' : '1.8'}
                      strokeDasharray={isLinkActive ? '8 6' : '4 4'}
                      className={isLinkActive ? 'animate-meridian-stream' : ''}
                      opacity={isLinkActive ? 0.95 : 0.6}
                    />
                  </g>
                );
              })}

              {/* Render Nodes as SVG Groups */}
              {currentTree.nodes.map((nodePos) => {
                const t = TALENTS_CATALOG.find((item) => item.id === nodePos.id);
                if (!t) return null;

                const curLvl = talents[t.id] || 0;
                const isMax = curLvl >= t.maxLevel;
                const branchSpent = getBranchSpent(t.branch);
                const reqSatisfied = branchSpent >= t.reqSpent;
                const isSelected = selectedTalent.id === t.id;
                const canUpgrade = !isMax && talentPoints > 0 && reqSatisfied;
                const isUpgradedNow = justUpgraded === t.id;

                let ringColor = '#cbbea5';
                if (isSelected) ringColor = '#9e2a2b';
                else if (isMax) ringColor = '#2d6a4f';
                else if (canUpgrade) ringColor = '#c5a059';

                return (
                  <g
                    key={nodePos.id}
                    className="cursor-pointer group"
                    onClick={() => {
                      sound.play('click');
                      setSelectedTalentId(t.id);
                    }}
                  >
                    {/* Outer Pulsing Glow Circle on Can Upgrade */}
                    {canUpgrade && (
                      <circle
                        cx={nodePos.x}
                        cy={nodePos.y}
                        r="27"
                        fill="none"
                        stroke="#c5a059"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                        className="animate-spin-slow opacity-75"
                      />
                    )}

                    {/* Outer Border / Aura */}
                    <circle
                      cx={nodePos.x}
                      cy={nodePos.y}
                      r="23"
                      fill={isSelected ? '#f4ece1' : '#fff'}
                      stroke={ringColor}
                      strokeWidth={isSelected ? '2.5' : '1.8'}
                      style={{
                        filter: isSelected
                          ? 'drop-shadow(0 0 6px rgba(158, 42, 43, 0.45))'
                          : canUpgrade
                          ? 'drop-shadow(0 0 5px rgba(197, 160, 89, 0.5))'
                          : 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))',
                      }}
                    />

                    {/* Innermost Decorative Ring */}
                    <circle
                      cx={nodePos.x}
                      cy={nodePos.y}
                      r="19"
                      fill="none"
                      stroke={ringColor}
                      strokeWidth="1"
                      strokeDasharray="3 2"
                      opacity="0.6"
                    />

                    {/* Lock Icon or Center Core Symbol */}
                    {!reqSatisfied ? (
                      <g transform={`translate(${nodePos.x - 7}, ${nodePos.y - 8})`}>
                        <path
                          d="M 2 5 L 2 3 C 2 1.3 3.3 0 5 0 C 6.7 0 8 1.3 8 3 L 8 5 M 0 5 L 10 5 L 10 11 L 0 11 Z"
                          fill="#8c8577"
                        />
                      </g>
                    ) : (
                      <text
                        x={nodePos.x}
                        y={nodePos.y - 1}
                        textAnchor="middle"
                        fill={isMax ? '#2d6a4f' : isSelected ? '#9e2a2b' : '#1f1f1f'}
                        fontSize="11"
                        fontWeight="bold"
                        className="font-calligraphy"
                      >
                        {t.name.slice(0, 2)}
                      </text>
                    )}

                    {/* Level Badge below or inside node */}
                    <rect
                      x={nodePos.x - 16}
                      y={nodePos.y + 7}
                      width="32"
                      height="12"
                      rx="3"
                      fill={isMax ? '#2d6a4f' : isSelected ? '#9e2a2b' : '#3d3830'}
                    />
                    <text
                      x={nodePos.x}
                      y={nodePos.y + 16}
                      textAnchor="middle"
                      fill="#fff"
                      fontSize="9"
                      fontWeight="bold"
                      className="font-mono tabular-nums"
                    >
                      {curLvl}/{t.maxLevel}
                    </text>

                    {/* Full Name Label below the node */}
                    <text
                      x={nodePos.x}
                      y={nodePos.y + 35}
                      textAnchor="middle"
                      fill={isSelected ? '#9e2a2b' : '#2b2823'}
                      fontSize="11"
                      fontWeight={isSelected ? 'bold' : 'normal'}
                      className="font-calligraphy"
                      style={{ textShadow: '1px 1px 2px #fff' }}
                    >
                      {t.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Node Talisman Inspector Drawer */}
          <div className="mt-3 p-3 bg-[#f8f4ec] border border-[#dfd5c2] rounded-md text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1f1f1f] font-calligraphy">
                    {selectedTalent.name}
                  </span>
                  <span className="text-[11px] text-[#736e63]">
                    【{talents[selectedTalent.id] || 0} / {selectedTalent.maxLevel} 階】
                  </span>
                  {(talents[selectedTalent.id] || 0) >= selectedTalent.maxLevel && (
                    <span className="text-[10px] text-[#2d6a4f] font-semibold flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" />
                      <span>已臻大成</span>
                    </span>
                  )}
                </div>

                <div className="mt-1 text-xs">
                  <span className="text-[#736e63]">當前階位效果：</span>
                  <span
                    className={
                      (talents[selectedTalent.id] || 0) > 0
                        ? 'font-bold text-[#1e6f42]'
                        : 'text-[#8c8577]'
                    }
                  >
                    {selectedTalent.getDesc(talents[selectedTalent.id] || 0)}
                  </span>
                </div>

                {(talents[selectedTalent.id] || 0) < selectedTalent.maxLevel && (
                  <div className="text-[11px] text-[#736e63] mt-0.5">
                    下一重境界：
                    <span className="text-[#3d372e]">
                      {selectedTalent.getNextDesc(talents[selectedTalent.id] || 0)}
                    </span>
                  </div>
                )}

                {getBranchSpent(selectedTalent.branch) < selectedTalent.reqSpent && (
                  <div className="text-[11px] text-[#9e2a2b] font-medium flex items-center gap-1 mt-1">
                    <Lock className="w-3 h-3" />
                    <span>
                      前置要求：需先在【{selectedTalent.branchName}】投入{' '}
                      {selectedTalent.reqSpent} 點天賦 (目前:
                      {getBranchSpent(selectedTalent.branch)}/{selectedTalent.reqSpent})
                    </span>
                  </div>
                )}
              </div>

              {/* Upgrade Button in Inspector */}
              <div className="self-end sm:self-center shrink-0">
                {(() => {
                  const curLvl = talents[selectedTalent.id] || 0;
                  const isMax = curLvl >= selectedTalent.maxLevel;
                  const reqSatisfied =
                    getBranchSpent(selectedTalent.branch) >= selectedTalent.reqSpent;
                  const canUpgrade = !isMax && talentPoints > 0 && reqSatisfied;

                  return (
                    <button
                      disabled={!canUpgrade}
                      onClick={() => handleUpgrade(selectedTalent)}
                      className={`px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm ${
                        isMax
                          ? 'bg-[#ded6c5] text-[#6b6456] cursor-default'
                          : canUpgrade
                          ? 'bg-[#9e2a2b] hover:bg-[#801f20] text-white active:scale-95 cursor-pointer shadow-md'
                          : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed opacity-80'
                      }`}
                    >
                      {isMax ? (
                        <span>圓滿極境</span>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>參悟升階 (-1點)</span>
                        </>
                      )}
                    </button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Mode 2: Detailed List View */
        <div className="space-y-2.5">
          {branchTalents.map((t) => {
            const curLevel = talents[t.id] || 0;
            const isMax = curLevel >= t.maxLevel;
            const branchSpent = getBranchSpent(t.branch);
            const reqSatisfied = branchSpent >= t.reqSpent;
            const canUpgrade = !isMax && talentPoints > 0 && reqSatisfied;
            const isUpgradedNow = justUpgraded === t.id;

            return (
              <div
                key={t.id}
                className={`p-3 rounded-md border transition-all ${
                  isUpgradedNow
                    ? 'bg-[#f8f5ee] border-[#9e2a2b] ring-2 ring-[#9e2a2b]/40 scale-[1.01]'
                    : isMax
                    ? 'bg-[#f7f2e9] border-[#cbbfa9]'
                    : reqSatisfied
                    ? 'bg-white/70 border-[#cbbea5] hover:border-[#baa990]'
                    : 'bg-[#ede7da]/50 border-[#d5ccbd] opacity-75'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#1f1f1f] font-calligraphy">
                        {t.name}
                      </span>
                      <span className="text-xs font-bold text-[#9e2a2b] font-mono tabular-nums">
                        {curLevel} / {t.maxLevel} 階
                      </span>
                      {isMax && <CheckCircle className="w-3.5 h-3.5 text-[#2d6a4f]" />}
                    </div>

                    <div className="mt-1 text-xs">
                      <span className="text-[#736e63]">當前：</span>
                      <span
                        className={
                          curLevel > 0 ? 'font-semibold text-[#1e6f42]' : 'text-[#8c8577]'
                        }
                      >
                        {t.getDesc(curLevel)}
                      </span>
                    </div>

                    {!isMax && (
                      <div className="text-[11px] text-[#8c8577] mt-0.5">
                        下一重：{t.getNextDesc(curLevel)}
                      </div>
                    )}

                    {!reqSatisfied && (
                      <div className="flex items-center gap-1 text-[11px] text-[#9e2a2b] font-medium mt-1">
                        <Lock className="w-3 h-3" />
                        <span>需先在此脈累計投入 {t.reqSpent} 點天賦</span>
                      </div>
                    )}
                  </div>

                  <div className="self-end sm:self-center shrink-0">
                    <button
                      disabled={!canUpgrade}
                      onClick={() => handleUpgrade(t)}
                      className={`px-3.5 py-1.5 rounded text-xs font-bold transition-all flex items-center gap-1 ${
                        isMax
                          ? 'bg-[#ded6c5] text-[#6b6456] cursor-default'
                          : canUpgrade
                          ? 'bg-[#9e2a2b] hover:bg-[#801f20] text-white active:scale-95 cursor-pointer shadow-xs'
                          : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed opacity-80'
                      }`}
                    >
                      {isMax ? '已臻大成' : '參悟升階 (-1點)'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

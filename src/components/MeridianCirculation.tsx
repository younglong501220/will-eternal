import React, { useState } from 'react';
import { CultivationPath } from '../types/cultivation';
import { Sparkles, Info, Activity } from 'lucide-react';

interface MeridianCirculationProps {
  path: CultivationPath;
  autoGainRate: number;
  realmName: string;
}

interface MeridianNode {
  id: string;
  name: string;
  pinyin: string;
  vessel: '任脈 (陰)' | '督脈 (陽)' | '衝脈 (樞)';
  x: number; // percentage in SVG viewBox
  y: number;
  desc: string;
  effect: string;
}

const MERIDIAN_NODES: MeridianNode[] = [
  {
    id: 'baihui',
    name: '百會穴',
    pinyin: 'Bǎi Huì',
    vessel: '督脈 (陽)',
    x: 160,
    y: 36,
    desc: '頭頂諸陽之會，百脈朝宗。引九天清氣自頂門貫入。',
    effect: '接引天道浩然靈氣',
  },
  {
    id: 'niwan',
    name: '泥丸宮',
    pinyin: 'Ní Wán Gōng',
    vessel: '督脈 (陽)',
    x: 160,
    y: 68,
    desc: '上丹田元神居所，藏識駐魄。主神識清明與法相神通。',
    effect: '凝練神識與元神感知',
  },
  {
    id: 'dazhui',
    name: '大椎穴',
    pinyin: 'Dà Zhuī',
    vessel: '督脈 (陽)',
    x: 135,
    y: 104,
    desc: '脊椎之樞紐，三陽之會。統御一身陽罡氣勁流轉。',
    effect: '固化氣血與罡氣壁障',
  },
  {
    id: 'shanzhong',
    name: '膻中穴',
    pinyin: 'Shān Zhōng',
    vessel: '任脈 (陰)',
    x: 160,
    y: 128,
    desc: '中丹田氣之所會，靈樞樞紐。調和真元五行，化生萬法。',
    effect: '真元樞紐，平抑心魔',
  },
  {
    id: 'shenque',
    name: '神闕穴',
    pinyin: 'Shén Què',
    vessel: '任脈 (陰)',
    x: 160,
    y: 172,
    desc: '先天之臍門，元神受生之門戶。運轉陰陽兩儀玄機。',
    effect: '調和水火，胎息內結',
  },
  {
    id: 'mingmen',
    name: '命門穴',
    pinyin: 'Mìng Mén',
    vessel: '督脈 (陽)',
    x: 132,
    y: 188,
    desc: '生命真陽之原，先天真火所寄。體修氣血如爐之根本。',
    effect: '激發純陽氣血本源',
  },
  {
    id: 'qihai',
    name: '氣海丹田',
    pinyin: 'Qì Hǎi Dān Tián',
    vessel: '任脈 (陰)',
    x: 160,
    y: 206,
    desc: '下丹田氣之瀚海，納百川真元。修士築基結丹之根本神室。',
    effect: '儲聚浩瀚修為真元',
  },
  {
    id: 'yongquan_l',
    name: '湧泉 (左)',
    pinyin: 'Yǒng Quán',
    vessel: '衝脈 (樞)',
    x: 108,
    y: 278,
    desc: '足底玄關，引九幽地脈靈煞而上，根基如磐石泰山。',
    effect: '汲納大地厚土玄華',
  },
  {
    id: 'yongquan_r',
    name: '湧泉 (右)',
    pinyin: 'Yǒng Quán',
    vessel: '衝脈 (樞)',
    x: 212,
    y: 278,
    desc: '足底陰竅，上通泥丸，周天循環之始終。',
    effect: '周天迴圈，息息相生',
  },
];

export const MeridianCirculation: React.FC<MeridianCirculationProps> = ({
  path,
  autoGainRate,
  realmName,
}) => {
  const [selectedNode, setSelectedNode] = useState<MeridianNode | null>(MERIDIAN_NODES[6]); // default to Qihai Dantian

  const isFa = path === 'fa';
  const mainStreamColor = isFa ? '#c5a059' : '#c84b31';
  const glowColor = isFa ? 'rgba(197, 160, 89, 0.7)' : 'rgba(200, 75, 49, 0.8)';
  const pulseBadgeColor = isFa ? 'bg-[#9e2a2b]' : 'bg-[#7a1c1d]';

  return (
    <div className="bg-white/60 border border-[#cbbea5] rounded-md p-3.5 shadow-xs relative overflow-hidden select-none animate-fadeIn">
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-[#cbbea5]/70 pb-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-[#9e2a2b] rounded-xs" />
          <h3 className="font-bold text-sm text-[#1f1f1f] font-calligraphy tracking-wide">
            經脈周天 · 靈氣運轉法相
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#2d6a4f] bg-[#e6f4ea] px-2 py-0.5 rounded border border-[#a3d9b5]">
            <Activity className="w-3 h-3 text-[#2d6a4f] animate-pulse" />
            <span>周天吐納: +{autoGainRate}/秒</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* SVG Meridian Meditation Silhouette Canvas */}
        <div className="relative w-64 h-64 sm:w-68 sm:h-68 rounded-md bg-[#ede4d2]/70 border border-[#d2c5b0] p-1 shadow-inner shrink-0 flex items-center justify-center overflow-hidden">
          {/* Subtle Yin Yang / Bagua watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
            <div className="w-48 h-48 rounded-full border-4 border-[#1f1f1f] border-dashed" />
          </div>

          <svg
            viewBox="0 0 320 310"
            className="w-full h-full"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' }}
          >
            <defs>
              {/* Radial gradient for glowing nodes */}
              <radialGradient id="nodeGlowGold" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fff" />
                <stop offset="40%" stopColor={mainStreamColor} />
                <stop offset="100%" stopColor={mainStreamColor} stopOpacity="0" />
              </radialGradient>

              {/* Stream Path Gradient */}
              <linearGradient id="streamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#c5a059" stopOpacity="0.9" />
                <stop offset="50%" stopColor={mainStreamColor} stopOpacity="1" />
                <stop offset="100%" stopColor="#2d6a4f" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Stylized Meditating Immortal Outline (打坐修士水墨剪影) */}
            <g opacity="0.28" fill="none" stroke="#3d372e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {/* Head */}
              <circle cx="160" cy="52" r="26" />
              {/* Neck & Shoulders */}
              <path d="M 148 76 C 140 85 110 92 88 108" />
              <path d="M 172 76 C 180 85 210 92 232 108" />
              {/* Arms down to meditation mudra on knees */}
              <path d="M 88 108 C 72 135 68 180 80 220 C 88 245 110 260 135 255" />
              <path d="M 232 108 C 248 135 252 180 240 220 C 232 245 210 260 185 255" />
              {/* Torso */}
              <path d="M 130 96 C 120 135 122 195 130 235" />
              <path d="M 190 96 C 200 135 198 195 190 235" />
              {/* Folded Crossed Legs (結跏趺坐) */}
              <path d="M 72 245 C 90 275 140 286 160 286 C 180 286 230 275 248 245 C 235 275 195 295 160 295 C 125 295 85 275 72 245 Z" fill="#2d261e" fillOpacity="0.04" />
              {/* Meditation Mudra hands in lap */}
              <ellipse cx="160" cy="245" rx="20" ry="10" />
            </g>

            {/* Du Vessel (督脈 - 后行脊柱線) */}
            <path
              d="M 160 36 C 145 45 135 70 135 104 C 135 145 132 170 132 188 C 132 215 145 245 160 260"
              fill="none"
              stroke="#8c816f"
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.6"
            />

            {/* Ren Vessel (任脈 - 前行中心線 - 帶動態流動光效) */}
            <path
              d="M 160 36 L 160 68 L 160 128 L 160 172 L 160 206 C 160 235 160 255 160 275"
              fill="none"
              stroke="url(#streamGrad)"
              strokeWidth="2.5"
              className="animate-meridian-stream"
            />

            {/* Meridian Leg Channels (足三陰三陽脈至湧泉) */}
            <path
              d="M 160 206 C 140 225 118 248 108 278"
              fill="none"
              stroke={mainStreamColor}
              strokeWidth="1.8"
              opacity="0.75"
              className="animate-meridian-stream"
            />
            <path
              d="M 160 206 C 180 225 202 248 212 278"
              fill="none"
              stroke={mainStreamColor}
              strokeWidth="1.8"
              opacity="0.75"
              className="animate-meridian-stream"
            />

            {/* Interactive Meridian Nodes */}
            {MERIDIAN_NODES.map((node) => {
              const isSelected = selectedNode?.id === node.id;

              return (
                <g
                  key={node.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedNode(node)}
                >
                  {/* Outer Pulsing Aura Circle */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? '14' : '9'}
                    fill="none"
                    stroke={mainStreamColor}
                    strokeWidth={isSelected ? '1.5' : '1'}
                    opacity={isSelected ? '0.85' : '0.4'}
                    className="animate-pulse"
                  />

                  {/* Inner Glowing Core */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={isSelected ? '6.5' : '4.5'}
                    fill={isSelected ? '#9e2a2b' : mainStreamColor}
                    stroke="#fff"
                    strokeWidth="1.2"
                    style={{
                      filter: isSelected
                        ? 'drop-shadow(0 0 6px rgba(158, 42, 43, 0.9))'
                        : `drop-shadow(0 0 3px ${glowColor})`,
                    }}
                  />

                  {/* Node label text on hover or selected */}
                  <text
                    x={node.x > 160 ? node.x + 10 : node.x - 10}
                    y={node.y + 4}
                    textAnchor={node.x > 160 ? 'start' : 'end'}
                    fill="#1f1f1f"
                    fontSize={isSelected ? '11' : '10'}
                    fontWeight={isSelected ? 'bold' : 'normal'}
                    className="font-calligraphy transition-all select-none"
                    style={{ textShadow: '1px 1px 2px #fff' }}
                  >
                    {node.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom helper prompt */}
          <div className="absolute bottom-1.5 left-2 text-[10px] text-[#736e63] flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-[#c5a059]" />
            <span>點擊穴位查閱經絡玄奧</span>
          </div>
        </div>

        {/* Selected Meridian Node Details & Insight */}
        <div className="flex-1 w-full bg-[#f8f4ec] border border-[#dfd5c2] rounded p-3 text-xs flex flex-col justify-between">
          {selectedNode ? (
            <div>
              <div className="flex items-center justify-between border-b border-[#cbbea5]/60 pb-1.5 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#9e2a2b] font-calligraphy">
                    {selectedNode.name}
                  </span>
                  <span className="text-[10px] text-[#736e63] font-mono">
                    {selectedNode.pinyin}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#e8ded0] text-[#59544c] rounded-xs font-mono">
                    {selectedNode.vessel}
                  </span>
                </div>
                <span className="text-[11px] text-[#2d6a4f] font-semibold">
                  周天暢通無阻
                </span>
              </div>

              <p className="text-[#4a4641] text-[11px] leading-relaxed mb-2">
                {selectedNode.desc}
              </p>

              <div className="p-2 rounded bg-white/70 border border-[#dfd5c2] flex items-center justify-between">
                <span className="text-[#736e63]">穴竅造化加持</span>
                <span className="font-bold text-[#2d6a4f]">
                  {selectedNode.effect}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-[#736e63]">
              點選經脈圖中穴竅，體悟經絡玄機。
            </div>
          )}

          {/* Real-time circulation heartbeat */}
          <div className="mt-3 pt-2 border-t border-[#cbbea5]/50 flex items-center justify-between text-[11px] text-[#6b6456]">
            <span>當前道行境界：<strong className="text-[#1f1f1f]">{realmName}</strong></span>
            <span className="text-[#9e2a2b] font-medium flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#9e2a2b] animate-ping" />
              大小周天自轉不息
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

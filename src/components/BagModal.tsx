import React from 'react';
import { PlayerState } from '../types/cultivation';
import { X, Package, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface BagModalProps {
  player: PlayerState;
  onUsePill: (pillKey: 'peiyuan' | 'concentrate' | 'bodyMarrow') => void;
  onClose: () => void;
}

export const BagModal: React.FC<BagModalProps> = ({
  player,
  onUsePill,
  onClose,
}) => {
  const inventoryItems = [
    {
      id: 'stone',
      name: '上品靈石',
      count: player.spiritStones,
      desc: '修仙界通用硬通貨，蘊含純正天地靈能。',
      category: '貨幣',
      action: null,
    },
    {
      id: 'sect',
      name: '宗門功績令',
      count: player.sectPoints,
      desc: '逍遙宗所賜之功德貢獻，可在藏寶閣兌換各類重寶。',
      category: '令符',
      action: null,
    },
    {
      id: 'herb',
      name: '千年靈草',
      count: player.herbs,
      desc: '產自各大秘境幽谷的珍稀草木，乃煉製高階丹藥的基石。',
      category: '靈材',
      action: null,
    },
    {
      id: 'core',
      name: '妖丹精華',
      count: player.monsterCores,
      desc: '大荒妖獸歷經數百年凝聚的內丹，可用於哺育靈獸或煉丹破境。',
      category: '靈材',
      action: null,
    },
    {
      id: 'egg',
      name: '太古靈獸蛋',
      count: player.petEggs,
      desc: '內蘊上古洪荒異獸殘魂的靈卵，可在靈獸園悉心孵化。',
      category: '異寶',
      action: null,
    },
    {
      id: 'peiyuan',
      name: '培元丹',
      count: player.pills.peiyuan,
      desc: '吞服後立即化作 50 點純淨修為。',
      category: '丹藥',
      action: () => {
        sound.play('click');
        onUsePill('peiyuan');
      },
      actionLabel: '服用 (+50)',
    },
    {
      id: 'concentrate',
      name: '凝神丹',
      count: player.pills.concentrate,
      desc: '吞服後令神念通明，立即化作 200 點修為。',
      category: '丹藥',
      action: () => {
        sound.play('click');
        onUsePill('concentrate');
      },
      actionLabel: '服用 (+200)',
    },
    {
      id: 'bodyMarrow',
      name: '洗髓金丹',
      count: player.pills.bodyMarrow,
      desc: '重塑凡軀經脈，永久提升洞府每秒 +5 靈氣汲取速度。',
      category: '神丹',
      action: () => {
        sound.play('click');
        onUsePill('bodyMarrow');
      },
      actionLabel: '重塑 (+5/秒)',
    },
    {
      id: 'breakPill',
      name: '破境丹',
      count: player.pills.breakPill,
      desc: '引動天劫突破時自動護住靈台，大幅提高 30% 渡劫成功率。',
      category: '靈丹',
      action: null,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs select-none animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#f4efe6] border-4 border-[#3d342a] rounded-lg shadow-2xl p-5 overflow-hidden paper-texture">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#b5ab96] pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-[#9e2a2b]" />
            <h2 className="text-xl font-bold text-[#1f1f1f] font-calligraphy">
              九品紫府乾坤儲物袋
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#6b6456] hover:text-[#1a1816] rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inventory grid */}
        <div className="max-h-[60vh] overflow-y-auto pr-1 space-y-2 text-xs">
          {inventoryItems.map((item) => (
            <div
              key={item.id}
              className="p-2.5 bg-white/70 border border-[#cbbea5] rounded flex items-center justify-between gap-3 hover:border-[#9e2a2b]/60 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#1f1f1f]">
                    {item.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-[#e9dfcb] text-[#6b6456] rounded-xs font-mono">
                    {item.category}
                  </span>
                  <span className="text-xs font-bold text-[#9e2a2b] font-mono tabular-nums">
                    x{item.count}
                  </span>
                </div>
                <p className="text-[11px] text-[#6b6456] mt-0.5">
                  {item.desc}
                </p>
              </div>

              {item.action && (
                <button
                  disabled={item.count <= 0}
                  onClick={item.action}
                  className={`px-3 py-1.5 rounded text-xs font-semibold shrink-0 transition-all ${
                    item.count > 0
                      ? 'bg-[#2d6a4f] hover:bg-[#22543d] text-white active:scale-95 cursor-pointer shadow-xs'
                      : 'bg-[#ded6c5] text-[#8c8577] cursor-not-allowed'
                  }`}
                >
                  {item.actionLabel}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-[#cbbea5]/60 text-right">
          <button
            onClick={onClose}
            className="px-5 py-1.5 text-xs font-semibold text-white bg-[#2b2823] hover:bg-[#1a1816] active:scale-95 rounded shadow-xs"
          >
            關閉儲物袋
          </button>
        </div>
      </div>
    </div>
  );
};

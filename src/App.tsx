/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useTransition } from 'react';
import {
  CultivationPath,
  PlayerState,
  GameLog,
  REALMS_FA,
  REALMS_TI,
  REALM_MAX_EXP,
  SECRET_REALMS,
  PET_CATALOG,
  PetData,
  TALENTS_CATALOG,
} from './types/cultivation';
import { loadSavedGame, saveGame, resetGame } from './utils/storage';
import { sound } from './utils/audio';

import { Header } from './components/Header';
import { CultivationCore } from './components/CultivationCore';
import { CaveTab } from './components/CaveTab';
import { AdventureTab } from './components/AdventureTab';
import { AlchemyTab } from './components/AlchemyTab';
import { PetTab } from './components/PetTab';
import { SectTab } from './components/SectTab';
import { TribulationModal } from './components/TribulationModal';
import { BagModal } from './components/BagModal';
import { AchievementsModal, Milestone } from './components/AchievementsModal';

import { Castle, Compass, Flame, ShieldAlert, Sparkles, Feather } from 'lucide-react';
import landscapeBg from './assets/images/ink_landscape_bg_1790866733505.jpg';

export default function App() {
  const [player, setPlayer] = useState<PlayerState>(() => loadSavedGame());
  const [activeTab, setActiveTab] = useState<'cultivate' | 'adventure' | 'alchemy' | 'pet' | 'sect'>('cultivate');

  const [logs, setLogs] = useState<GameLog[]>(() => [
    {
      id: 'init-1',
      text: '你已開闢洞府，引導天地靈氣運轉大小周天，仙途就此展開。',
      type: 'system',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    },
  ]);

  const [showTribulation, setShowTribulation] = useState(false);
  const [showBag, setShowBag] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [claimedMilestones, setClaimedMilestones] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('yinian_claimed_milestones');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const playerRef = useRef(player);
  playerRef.current = player;

  // Add Log Helper
  const addLog = (text: string, type: GameLog['type'] = 'system') => {
    const newLog: GameLog = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 49)]);
  };

  // Auto-Save interval
  useEffect(() => {
    const timer = setInterval(() => {
      saveGame(playerRef.current);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Calculate current auto-gain rate
  const getAutoGainRate = (p: PlayerState) => {
    const baseGain = (p.path === 'fa' ? 3 : 2) * (p.realmIndex + 1);
    const petMultiplier = p.pet && p.pet.bonusType === 'qi' ? (p.pet.level * p.pet.bonusPercent) / 100 : 0;
    const talentBonus = (((p.talents?.['qi_gather'] || 0) * 8) + (p.talents?.['qi_unity'] ? 30 : 0)) / 100;
    const finalRate = Math.floor(baseGain * (1 + petMultiplier) * (1 + talentBonus)) + p.permanentMarrowBonus;
    return Math.max(1, finalRate);
  };

  // Calculate click gain
  const getClickGain = (p: PlayerState) => {
    const base = p.path === 'fa' ? 4 : 7;
    const petMultiplier = p.pet && p.pet.bonusType === 'qi' ? (p.pet.level * p.pet.bonusPercent) / 100 : 0;
    const talentCycleBonus = ((p.talents?.['qi_cycle'] || 0) * 15) / 100;
    return Math.floor((base + p.realmIndex * 3) * (1 + petMultiplier) * (1 + talentCycleBonus));
  };

  // Cultivation & Adventure Background Game Loop (every 1.5s)
  useEffect(() => {
    const interval = setInterval(() => {
      setPlayer((prev) => {
        const rate = getAutoGainRate(prev);
        const newExp = prev.exp + rate;

        let newHerbs = prev.herbs;
        let newCores = prev.monsterCores;
        let newEggs = prev.petEggs;
        let newStones = prev.spiritStones;
        let slainCount = prev.stats.totalMonstersSlain;

        // Adventure encounter check (45% chance)
        const currentRealm =
          SECRET_REALMS.find((r) => r.id === prev.activeRealmId) || SECRET_REALMS[0];

        if (Math.random() < 0.45) {
          const monster =
            currentRealm.monsters[Math.floor(Math.random() * currentRealm.monsters.length)];
          const gatherBonus =
            prev.pet && prev.pet.bonusType === 'gather'
              ? (prev.pet.level * prev.pet.bonusPercent) / 100
              : 0;

          const stoneDrop = Math.floor(
            (currentRealm.stoneYield + Math.floor(Math.random() * 5)) * (1 + gatherBonus)
          );
          newStones += stoneDrop;
          slainCount += 1;

          let extraStr = '';

          // 50% chance for herb
          if (Math.random() < 0.5) {
            const herbDrop = Math.max(1, Math.floor(currentRealm.herbYield * (1 + gatherBonus)));
            newHerbs += herbDrop;
            extraStr += `、採集珍品靈草+${herbDrop}`;
          }

          const fortuneDropBonus = ((prev.talents?.['fortune_drop'] || 0) * 20) / 100;

          // Monster core drop (base 28% + fortune drop bonus)
          if (Math.random() < 0.28 * (1 + fortuneDropBonus)) {
            newCores += 1;
            extraStr += '、拾獲妖丹+1';
          }

          // Pet egg drop (base 6% + fortune drop bonus)
          if (Math.random() < 0.06 * (1 + fortuneDropBonus)) {
            newEggs += 1;
            extraStr += '、機緣巧獲【太古靈獸蛋】x1！';
          }

          addLog(
            `遭遇【${monster}】，祭出神通斬落！收穫靈石+${stoneDrop}${extraStr}`,
            'adventure'
          );
        }

        return {
          ...prev,
          exp: newExp,
          herbs: newHerbs,
          monsterCores: newCores,
          petEggs: newEggs,
          spiritStones: newStones,
          stats: {
            ...prev.stats,
            totalMonstersSlain: slainCount,
          },
        };
      });
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  // Realm texts & limits
  const realmNames = player.path === 'fa' ? REALMS_FA : REALMS_TI;
  const currentRealmName = realmNames[player.realmIndex] || `化境巔峰 (${player.realmIndex + 1} 重)`;
  const nextRealmName = realmNames[player.realmIndex + 1] || '大道飛升無上境';
  const currentMaxExp = REALM_MAX_EXP[player.realmIndex] || 9999999;
  const canBreakthrough = player.exp >= currentMaxExp && player.realmIndex < realmNames.length - 1;

  // Handlers
  const handleMeditateClick = () => {
    setPlayer((prev) => {
      const gain = getClickGain(prev);
      return {
        ...prev,
        exp: prev.exp + gain,
        stats: {
          ...prev.stats,
          totalClicks: prev.stats.totalClicks + 1,
        },
      };
    });
  };

  const handleSwitchPath = () => {
    sound.play('click');
    setPlayer((prev) => {
      const nextPath: CultivationPath = prev.path === 'fa' ? 'ti' : 'fa';
      addLog(`道心流轉，轉修為【${nextPath === 'fa' ? '法修 (御劍御法)' : '體修 (金身碎虛)'}】一脈！`, 'system');
      return { ...prev, path: nextPath };
    });
  };

  const handleOpenBreakthrough = () => {
    if (!canBreakthrough) return;
    sound.play('click');
    setShowTribulation(true);
  };

  const handleConfirmBreakthrough = (usePill: boolean) => {
    const baseRate = 0.65;
    const pillBonus = usePill && player.pills.breakPill > 0 ? 0.3 : 0;
    const successRate = Math.min(1, baseRate + pillBonus);

    const isSuccess = Math.random() < successRate;

    setPlayer((prev) => {
      let updatedPills = { ...prev.pills };
      if (usePill && updatedPills.breakPill > 0) {
        updatedPills.breakPill -= 1;
      }

      if (isSuccess) {
        sound.play('breakthrough');
        const newRealmIndex = prev.realmIndex + 1;
        const newRealmTitle =
          (prev.path === 'fa' ? REALMS_FA : REALMS_TI)[newRealmIndex] || '飛升大境';

        addLog(
          `【天劫散去 · 金光灌頂】成功渡過重重劫數，晉陞至【${newRealmTitle}】！獲天地玄機賜予【靈脈天賦點 +3】！`,
          'breakthrough'
        );

        return {
          ...prev,
          realmIndex: newRealmIndex,
          talentPoints: prev.talentPoints + 3,
          exp: Math.max(0, prev.exp - currentMaxExp),
          pills: updatedPills,
          stats: {
            ...prev.stats,
            breakthroughSuccesses: prev.stats.breakthroughSuccesses + 1,
          },
        };
      } else {
        sound.play('tribulation');
        const lossExp = Math.floor(prev.exp * 0.3);
        addLog(
          `【心魔翻湧 · 劫雷反噬】渡劫受阻，真元受創損耗了 ${lossExp.toLocaleString()} 點修為，速速調息撫平經脈！`,
          'breakthrough'
        );

        return {
          ...prev,
          exp: Math.max(0, prev.exp - lossExp),
          pills: updatedPills,
          stats: {
            ...prev.stats,
            breakthroughFails: prev.stats.breakthroughFails + 1,
          },
        };
      }
    });

    setShowTribulation(false);
  };

  // Fast hunt
  const handleFastHunt = () => {
    const currentRealm =
      SECRET_REALMS.find((r) => r.id === player.activeRealmId) || SECRET_REALMS[0];
    const gatherBonus =
      player.pet && player.pet.bonusType === 'gather'
        ? (player.pet.level * player.pet.bonusPercent) / 100
        : 0;
    const strikeBonus = ((player.talents?.['combat_strike'] || 0) * 15) / 100;

    const gainedStones = Math.floor((currentRealm.stoneYield * 3 + 20) * (1 + gatherBonus) * (1 + strikeBonus));
    const gainedHerbs = Math.max(2, Math.floor(currentRealm.herbYield * 2 * (1 + gatherBonus)));
    const gainedCores = Math.random() < 0.6 ? 1 : 0;

    setPlayer((prev) => ({
      ...prev,
      spiritStones: prev.spiritStones + gainedStones,
      herbs: prev.herbs + gainedHerbs,
      monsterCores: prev.monsterCores + gainedCores,
      stats: {
        ...prev.stats,
        totalMonstersSlain: prev.stats.totalMonstersSlain + 3,
      },
    }));

    addLog(
      `[神通鎮壓] 施展本命道法，氣貫如虹！群妖伏誅，獲靈石+${gainedStones}、靈草+${gainedHerbs}${
        gainedCores ? '、妖丹+1' : ''
      }！`,
      'adventure'
    );
  };

  // Craft pill
  const handleCraftPill = (recipeId: string, quantity: number) => {
    const alchemyExtraChance = ((player.talents?.['fortune_alchemy'] || 0) * 20) / 100;
    const isExtraBonus = Math.random() < alchemyExtraChance;
    const finalProducedQty = isExtraBonus ? quantity * 2 : quantity;

    setPlayer((prev) => {
      const recipe =
        recipeId === 'peiyuan'
          ? { herbs: 3, cores: 0, stones: 0 }
          : recipeId === 'breakPill'
          ? { herbs: 5, cores: 1, stones: 10 }
          : recipeId === 'concentrate'
          ? { herbs: 10, cores: 2, stones: 30 }
          : { herbs: 25, cores: 5, stones: 100 };

      const costHerbs = recipe.herbs * quantity;
      const costCores = recipe.cores * quantity;
      const costStones = recipe.stones * quantity;

      return {
        ...prev,
        herbs: Math.max(0, prev.herbs - costHerbs),
        monsterCores: Math.max(0, prev.monsterCores - costCores),
        spiritStones: Math.max(0, prev.spiritStones - costStones),
        pills: {
          ...prev.pills,
          [recipeId]: (prev.pills[recipeId as keyof typeof prev.pills] || 0) + finalProducedQty,
        },
        stats: {
          ...prev.stats,
          totalPillsCrafted: prev.stats.totalPillsCrafted + finalProducedQty,
        },
      };
    });

    const pillNames: Record<string, string> = {
      peiyuan: '培元丹',
      breakPill: '破境丹',
      concentrate: '凝神丹',
      bodyMarrow: '洗髓金丹',
    };
    addLog(
      `[丹房] 祥雲聚頂，成功煉出【${pillNames[recipeId]}】x${finalProducedQty} 枚！${
        isExtraBonus ? '【三昧真火異象：額外成丹翻倍！】' : ''
      }`,
      'alchemy'
    );
  };

  // Use pill
  const handleUsePill = (pillKey: 'peiyuan' | 'concentrate' | 'bodyMarrow') => {
    const pillTransMultiplier = 1 + ((player.talents?.['qi_pill'] || 0) * 20) / 100;

    setPlayer((prev) => {
      if (prev.pills[pillKey] <= 0) return prev;

      let addedExp = 0;
      let marrowBonus = 0;

      if (pillKey === 'peiyuan') addedExp = Math.floor(50 * pillTransMultiplier);
      if (pillKey === 'concentrate') addedExp = Math.floor(200 * pillTransMultiplier);
      if (pillKey === 'bodyMarrow') marrowBonus = 5;

      return {
        ...prev,
        exp: prev.exp + addedExp,
        permanentMarrowBonus: prev.permanentMarrowBonus + marrowBonus,
        pills: {
          ...prev.pills,
          [pillKey]: prev.pills[pillKey] - 1,
        },
      };
    });

    if (pillKey === 'peiyuan')
      addLog(
        `吞服【培元丹】，浩瀚藥力化作 ${Math.floor(50 * pillTransMultiplier)} 點純淨修為！`,
        'alchemy'
      );
    if (pillKey === 'concentrate')
      addLog(
        `吞服【凝神丹】，元神澄澈通透，修為暴漲 ${Math.floor(200 * pillTransMultiplier)} 點！`,
        'alchemy'
      );
    if (pillKey === 'bodyMarrow')
      addLog('吞服【洗髓金丹】，伐毛洗髓！永久提升每秒靈氣吸收 +5/秒！', 'alchemy');
  };

  // Hatch egg
  const handleHatchEgg = () => {
    if (player.petEggs <= 0) return;

    const chosen = PET_CATALOG[Math.floor(Math.random() * PET_CATALOG.length)];
    const newPet: PetData = {
      ...chosen,
      level: 1,
    };

    setPlayer((prev) => ({
      ...prev,
      petEggs: prev.petEggs - 1,
      pet: newPet,
    }));

    addLog(`【仙靈出世】靈蛋霞光裂開，祥瑞通靈異獸【${newPet.name}】正式奉你為主！`, 'beast');
  };

  // Feed pet
  const handleFeedPet = () => {
    if (!player.pet || player.monsterCores <= 0) return;

    setPlayer((prev) => {
      if (!prev.pet) return prev;
      const updatedPet = {
        ...prev.pet,
        level: prev.pet.level + 1,
      };

      return {
        ...prev,
        monsterCores: prev.monsterCores - 1,
        pet: updatedPet,
      };
    });

    addLog(`[靈園] 靈獸進食妖丹本源，仙光大作，晉陞至【${player.pet.level + 1} 階】！`, 'beast');
  };

  // Attack Sect Boss
  const handleAttackBoss = () => {
    const combatPowerMultiplier =
      1 + (((player.talents?.['combat_power'] || 0) * 10) + (player.talents?.['combat_chaos'] ? 35 : 0)) / 100;
    const bossCritBonus = ((player.talents?.['combat_boss'] || 0) * 6) / 100;
    const bossCritDmgBonus = ((player.talents?.['combat_boss'] || 0) * 25) / 100;
    const isCrit = Math.random() < (0.25 + bossCritBonus);

    const petCombatBonus =
      player.pet && player.pet.bonusType === 'combat'
        ? (player.pet.level * player.pet.bonusPercent) / 100
        : 0;

    const baseDmg = (player.realmIndex + 1) * (player.path === 'fa' ? 320 : 450) * combatPowerMultiplier;
    const multiplier = (isCrit ? (2.2 + bossCritDmgBonus) : 1.0) * (1 + petCombatBonus);
    const finalDmg = Math.floor(baseDmg * multiplier + Math.random() * 120);

    const gainPoints = Math.max(15, Math.floor(finalDmg / 25));
    const gainStones = Math.floor(finalDmg / 50);

    setPlayer((prev) => {
      const remainingHp = prev.bossCurrentHp - finalDmg;
      const bossDefeated = remainingHp <= 0;

      if (bossDefeated) {
        sound.play('reward');
        addLog(
          `【太古撼天魔猿已被剿滅！】宗門頒發天階重賞：貢獻+300、靈石+500！大陣重新聚靈，兇獸再度重生！`,
          'sect'
        );

        return {
          ...prev,
          bossDefeats: prev.bossDefeats + 1,
          bossMaxHp: Math.floor(prev.bossMaxHp * 1.25),
          bossCurrentHp: Math.floor(prev.bossMaxHp * 1.25),
          sectPoints: prev.sectPoints + gainPoints + 300,
          spiritStones: prev.spiritStones + gainStones + 500,
        };
      }

      return {
        ...prev,
        bossCurrentHp: remainingHp,
        sectPoints: prev.sectPoints + gainPoints,
        spiritStones: prev.spiritStones + gainStones,
      };
    });

    addLog(
      `[宗門伏魔] 與同門萬仙並肩出手${isCrit ? '【致命暴擊】' : ''}，重創撼天魔猿 ${finalDmg.toLocaleString()} 傷害！獲貢獻+${gainPoints}、靈石+${gainStones}！`,
      'sect'
    );
  };

  // Buy item in Sect shop
  const handleBuySectItem = (itemId: string, cost: number, type: string, amount: number) => {
    setPlayer((prev) => {
      let updated = {
        ...prev,
        sectPoints: prev.sectPoints - cost,
      };

      if (type === 'egg') updated.petEggs += amount;
      if (type === 'breakPill') updated.pills.breakPill += amount;
      if (type === 'core') updated.monsterCores += amount;
      if (type === 'herb') updated.herbs += amount;
      if (type === 'stone') updated.spiritStones += amount;

      return updated;
    });

    addLog(`[藏寶閣] 消耗 ${cost} 點宗門貢獻，成功兌換重寶！已放入儲物袋。`, 'sect');
  };

  // Claim achievement milestone
  const handleClaimMilestone = (m: Milestone) => {
    if (claimedMilestones.includes(m.id)) return;

    const newClaimed = [...claimedMilestones, m.id];
    setClaimedMilestones(newClaimed);
    localStorage.setItem('yinian_claimed_milestones', JSON.stringify(newClaimed));

    setPlayer((prev) => ({
      ...prev,
      spiritStones: prev.spiritStones + (m.reward.stones || 0),
      sectPoints: prev.sectPoints + (m.reward.points || 0),
      herbs: prev.herbs + (m.reward.herbs || 0),
      monsterCores: prev.monsterCores + (m.reward.cores || 0),
      petEggs: prev.petEggs + (m.reward.eggs || 0),
      permanentMarrowBonus: prev.permanentMarrowBonus + (m.reward.bodyMarrow ? 5 : 0),
      pills: {
        ...prev.pills,
        breakPill: prev.pills.breakPill + (m.reward.breakPill || 0),
        bodyMarrow: prev.pills.bodyMarrow + (m.reward.bodyMarrow || 0),
      },
    }));

    addLog(`[仙途成就] 達成【${m.title}】，領取天道犒賞：${m.rewardText}！`, 'system');
  };

  // Upgrade talent
  const handleUpgradeTalent = (talentId: string) => {
    setPlayer((prev) => {
      if (prev.talentPoints <= 0) return prev;
      const currentLvl = prev.talents?.[talentId] || 0;
      const talentDef = TALENTS_CATALOG.find((t) => t.id === talentId);
      if (!talentDef || currentLvl >= talentDef.maxLevel) return prev;

      const updatedTalents = {
        ...(prev.talents || {}),
        [talentId]: currentLvl + 1,
      };

      addLog(`[靈脈參悟] 運轉經脈周天，成功參悟【${talentDef.name}】至 ${currentLvl + 1} 階！`, 'system');

      return {
        ...prev,
        talentPoints: prev.talentPoints - 1,
        talents: updatedTalents,
      };
    });
  };

  // Reset talents
  const handleResetTalents = () => {
    setPlayer((prev) => {
      const spent = Object.values(prev.talents || {}).reduce((a, b) => a + (b || 0), 0);
      if (spent === 0) return prev;

      addLog(`[洗髓通絡] 經脈逆轉重塑，返還了 ${spent} 點靈脈天賦！`, 'system');

      return {
        ...prev,
        talentPoints: prev.talentPoints + spent,
        talents: {},
      };
    });
  };

  // Reset Game
  const handleResetGame = () => {
    if (window.confirm('確定要散盡修為，轉世重修嗎？（所有境界、丹藥、靈獸將重置為初始狀態）')) {
      const initial = resetGame();
      setPlayer(initial);
      setClaimedMilestones([]);
      localStorage.removeItem('yinian_claimed_milestones');
      addLog('散盡畢生修為，轉世重啟仙途。', 'system');
      sound.play('breakthrough');
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center py-2 sm:py-6 px-0 sm:px-4 bg-[#1e1c19] text-[#1f1f1f] relative overflow-hidden font-sans"
      style={{
        backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(55,45,35,0.85) 0%, #161412 100%)`,
      }}
    >
      {/* Decorative desktop ink background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 hidden md:block bg-center bg-cover bg-no-repeat filter blur-[1px]"
        style={{ backgroundImage: `url(${landscapeBg})` }}
      />

      {/* Main Game Scroll Container Frame */}
      <div
        id="game-frame"
        className="w-full max-w-[480px] h-[98vh] sm:h-[94vh] max-h-[880px] bg-[#f4efe6] rounded-none sm:rounded-xl shadow-2xl flex flex-col relative overflow-hidden paper-texture border-0 sm:border-[6px] border-[#382f25]"
        style={{
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.85), inset 0 0 60px rgba(180, 160, 130, 0.45)',
        }}
      >
        {/* Top Header */}
        <Header
          path={player.path}
          realmName={currentRealmName}
          spiritStones={player.spiritStones}
          sectPoints={player.sectPoints}
          herbs={player.herbs}
          cores={player.monsterCores}
          onOpenBag={() => setShowBag(true)}
          onOpenAchievements={() => setShowAchievements(true)}
          onResetGame={handleResetGame}
        />

        {/* Center Tai-Chi Interactive Cultivation Core */}
        <CultivationCore
          path={player.path}
          exp={player.exp}
          maxExp={currentMaxExp}
          autoGainRate={getAutoGainRate(player)}
          clickGain={getClickGain(player)}
          canBreakthrough={canBreakthrough}
          onMeditateClick={handleMeditateClick}
          onSwitchPath={handleSwitchPath}
          onBreakthrough={handleOpenBreakthrough}
        />

        {/* Content Area for 5 Tabs */}
        <main className="flex-1 overflow-y-auto px-3.5 py-3 relative">
          {activeTab === 'cultivate' && (
            <CaveTab
              path={player.path}
              realmIndex={player.realmIndex}
              realmName={currentRealmName}
              autoGainRate={getAutoGainRate(player)}
              pet={player.pet}
              permanentMarrowBonus={player.permanentMarrowBonus}
              totalKills={player.stats.totalMonstersSlain}
              pillsCrafted={player.stats.totalPillsCrafted}
              talentPoints={player.talentPoints}
              talents={player.talents || {}}
              spiritStones={player.spiritStones}
              onUpgradeTalent={handleUpgradeTalent}
              onResetTalents={handleResetTalents}
            />
          )}

          {activeTab === 'adventure' && (
            <AdventureTab
              currentRealmIndex={player.realmIndex}
              activeRealmId={player.activeRealmId}
              logs={logs}
              onSelectRealm={(id) => setPlayer((prev) => ({ ...prev, activeRealmId: id }))}
              onFastHunt={handleFastHunt}
              onClearLogs={() => setLogs([])}
            />
          )}

          {activeTab === 'alchemy' && (
            <AlchemyTab
              herbs={player.herbs}
              cores={player.monsterCores}
              spiritStones={player.spiritStones}
              pills={player.pills}
              onCraftPill={handleCraftPill}
              onUsePill={handleUsePill}
            />
          )}

          {activeTab === 'pet' && (
            <PetTab
              pet={player.pet}
              petEggs={player.petEggs}
              monsterCores={player.monsterCores}
              onHatchEgg={handleHatchEgg}
              onFeedPet={handleFeedPet}
            />
          )}

          {activeTab === 'sect' && (
            <SectTab
              bossHp={player.bossCurrentHp}
              bossMaxHp={player.bossMaxHp}
              bossDefeats={player.bossDefeats}
              sectPoints={player.sectPoints}
              realmIndex={player.realmIndex}
              onAttackBoss={handleAttackBoss}
              onBuyItem={handleBuySectItem}
            />
          )}
        </main>

        {/* Bottom Tab Navigation */}
        <nav className="flex items-center justify-around bg-[#ded5bf] border-t-2 border-[#b5ab96] shrink-0 select-none shadow-md">
          <button
            onClick={() => {
              sound.play('click');
              setActiveTab('cultivate');
            }}
            className={`flex-1 py-2 sm:py-2.5 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'cultivate'
                ? 'text-[#9e2a2b] font-bold bg-white/40 shadow-inner'
                : 'text-[#59544c] hover:text-[#1a1816]'
            }`}
          >
            <Castle className="w-4 h-4" />
            <span className="text-xs font-calligraphy tracking-wider">洞府</span>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setActiveTab('adventure');
            }}
            className={`flex-1 py-2 sm:py-2.5 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'adventure'
                ? 'text-[#9e2a2b] font-bold bg-white/40 shadow-inner'
                : 'text-[#59544c] hover:text-[#1a1816]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span className="text-xs font-calligraphy tracking-wider">秘境</span>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setActiveTab('alchemy');
            }}
            className={`flex-1 py-2 sm:py-2.5 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'alchemy'
                ? 'text-[#9e2a2b] font-bold bg-white/40 shadow-inner'
                : 'text-[#59544c] hover:text-[#1a1816]'
            }`}
          >
            <Flame className="w-4 h-4" />
            <span className="text-xs font-calligraphy tracking-wider">丹房</span>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setActiveTab('pet');
            }}
            className={`flex-1 py-2 sm:py-2.5 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'pet'
                ? 'text-[#9e2a2b] font-bold bg-white/40 shadow-inner'
                : 'text-[#59544c] hover:text-[#1a1816]'
            }`}
          >
            <Feather className="w-4 h-4" />
            <span className="text-xs font-calligraphy tracking-wider">靈獸</span>
          </button>

          <button
            onClick={() => {
              sound.play('click');
              setActiveTab('sect');
            }}
            className={`flex-1 py-2 sm:py-2.5 flex flex-col items-center gap-1 transition-all ${
              activeTab === 'sect'
                ? 'text-[#9e2a2b] font-bold bg-white/40 shadow-inner'
                : 'text-[#59544c] hover:text-[#1a1816]'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-calligraphy tracking-wider">宗門</span>
          </button>
        </nav>

        {/* Heavenly Tribulation Modal */}
        {showTribulation && (
          <TribulationModal
            currentRealmName={currentRealmName}
            nextRealmName={nextRealmName}
            breakPillCount={player.pills.breakPill}
            onConfirmBreakthrough={handleConfirmBreakthrough}
            onClose={() => setShowTribulation(false)}
          />
        )}

        {/* Bag Modal */}
        {showBag && (
          <BagModal
            player={player}
            onUsePill={handleUsePill}
            onClose={() => setShowBag(false)}
          />
        )}

        {/* Achievements Modal */}
        {showAchievements && (
          <AchievementsModal
            player={player}
            claimedIds={claimedMilestones}
            onClaimMilestone={handleClaimMilestone}
            onClose={() => setShowAchievements(false)}
          />
        )}
      </div>
    </div>
  );
}

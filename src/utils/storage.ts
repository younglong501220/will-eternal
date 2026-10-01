import { PlayerState } from '../types/cultivation';

const SAVE_KEY = 'yinian_xiaoyao_cultivation_save_v1';

export const INITIAL_PLAYER_STATE: PlayerState = {
  path: 'fa',
  realmIndex: 0,
  exp: 0,
  spiritStones: 30,
  sectPoints: 10,
  herbs: 6,
  monsterCores: 1,
  petEggs: 1,
  pills: {
    peiyuan: 2,
    breakPill: 1,
    concentrate: 0,
    bodyMarrow: 0,
  },
  permanentMarrowBonus: 0,
  pet: null,
  activeRealmId: 'valley',
  bossCurrentHp: 12000,
  bossMaxHp: 12000,
  bossDefeats: 0,
  talents: {},
  talentPoints: 0,
  stats: {
    totalClicks: 0,
    totalMonstersSlain: 0,
    totalPillsCrafted: 0,
    breakthroughSuccesses: 0,
    breakthroughFails: 0,
  },
};

export function loadSavedGame(): PlayerState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return INITIAL_PLAYER_STATE;
    const parsed = JSON.parse(raw);
    const realmIndex = parsed.realmIndex ?? 0;
    const talents = parsed.talents || {};
    const totalEarned = realmIndex * 3;
    const totalSpent = Object.values(talents as Record<string, number>).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
    const points = typeof parsed.talentPoints === 'number' ? parsed.talentPoints : Math.max(0, totalEarned - totalSpent);

    return {
      ...INITIAL_PLAYER_STATE,
      ...parsed,
      talents,
      talentPoints: points,
      pills: {
        ...INITIAL_PLAYER_STATE.pills,
        ...(parsed.pills || {}),
      },
      stats: {
        ...INITIAL_PLAYER_STATE.stats,
        ...(parsed.stats || {}),
      },
    };
  } catch {
    return INITIAL_PLAYER_STATE;
  }
}

export function saveGame(state: PlayerState): void {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save state:', err);
  }
}

export function resetGame(): PlayerState {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {}
  return INITIAL_PLAYER_STATE;
}

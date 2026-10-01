/**
 * Cultivation Game Type Definitions & Configuration
 * 《一念逍遙》風格水墨修仙
 */

export type CultivationPath = 'fa' | 'ti';

export interface GameLog {
  id: string;
  text: string;
  type: 'system' | 'cultivate' | 'adventure' | 'alchemy' | 'beast' | 'sect' | 'breakthrough';
  timestamp: string;
}

export interface PetData {
  id: string;
  name: string;
  type: string;
  title: string;
  level: number;
  bonusType: 'qi' | 'combat' | 'gather';
  bonusPercent: number;
  description: string;
}

export interface SecretRealm {
  id: string;
  name: string;
  minRealmIndex: number;
  description: string;
  monsters: string[];
  bossName: string;
  herbYield: number;
  stoneYield: number;
}

export interface PillRecipe {
  id: string;
  name: string;
  costHerbs: number;
  costCores: number;
  costStones: number;
  effectDescription: string;
  description: string;
}

export interface TalentDef {
  id: string;
  name: string;
  branch: 'qi' | 'combat' | 'fortune';
  branchName: string;
  maxLevel: number;
  reqSpent: number;
  effectName: string;
  getDesc: (level: number) => string;
  getNextDesc: (level: number) => string;
}

export interface PlayerState {
  path: CultivationPath;
  realmIndex: number;
  exp: number;
  spiritStones: number;
  sectPoints: number;
  herbs: number;
  monsterCores: number;
  petEggs: number;
  pills: {
    peiyuan: number;      // 培元丹: +50 修為
    breakPill: number;    // 破境丹: 突破 +30% 成功率
    concentrate: number;  // 凝神丹: +200 修為
    bodyMarrow: number;   // 洗髓金丹: 永久 +5 基礎吸收率
  };
  permanentMarrowBonus: number;
  pet: PetData | null;
  activeRealmId: string;
  bossCurrentHp: number;
  bossMaxHp: number;
  bossDefeats: number;
  talents: Record<string, number>;
  talentPoints: number;
  stats: {
    totalClicks: number;
    totalMonstersSlain: number;
    totalPillsCrafted: number;
    breakthroughSuccesses: number;
    breakthroughFails: number;
  };
}

export const REALMS_FA = [
  "練氣一層",
  "練氣前期",
  "練氣圓滿",
  "築基初期",
  "築基後期",
  "結丹大圓滿",
  "元嬰神通",
  "化神真尊",
  "返虛道祖",
  "合體天尊",
  "大乘真仙"
];

export const REALMS_TI = [
  "通脈一層",
  "通脈精純",
  "通脈圓滿",
  "鍛骨洗髓",
  "鍛骨金身",
  "煉腑凝罡",
  "凝魄不滅",
  "神力破虛",
  "碎虛金剛",
  "萬劫不壞",
  "混沌神軀"
];

export const REALM_MAX_EXP = [
  100,      // 0
  280,      // 1
  750,      // 2
  2000,     // 3
  4800,     // 4
  11000,    // 5
  24000,    // 6
  60000,    // 7
  150000,   // 8
  380000,   // 9
  1000000   // 10
];

export const SECRET_REALMS: SecretRealm[] = [
  {
    id: 'valley',
    name: '幻境幽谷',
    minRealmIndex: 0,
    description: '靈氣微薄的世外凡谷，藏匿著諸多初生靈狐與毒蜂。',
    monsters: ['九尾毒蜂', '幽影草精', '赤焰幼狐', '綠林藤妖', '鐵背蒼狼'],
    bossName: '幽谷千面蛛母',
    herbYield: 1,
    stoneYield: 5,
  },
  {
    id: 'abyss',
    name: '墜魔深淵',
    minRealmIndex: 3,
    description: '魔氣翻湧的古老裂谷，妖煞濃烈，盛產千年玄草與魔核。',
    monsters: ['噬魂妖蝠', '雙頭黑蛟', '炎魔石怪', '玄冥鬼蛛', '裂地暴熊'],
    bossName: '深淵魔骨龍',
    herbYield: 2,
    stoneYield: 14,
  },
  {
    id: 'ancient_forest',
    name: '萬妖古林',
    minRealmIndex: 5,
    description: '萬載荒蕪的巨木之森，盤踞著結丹期以上的強橫洪荒遺種。',
    monsters: ['金翼魔鵬', '三眼靈猿', '九曲毒蚺', '撼山巨象', '赤血天狼'],
    bossName: '太古嘯月狼王',
    herbYield: 4,
    stoneYield: 30,
  },
  {
    id: 'fairy_island',
    name: '蓬萊仙島',
    minRealmIndex: 7,
    description: '雲霧縹緲的海外仙山，靈瀑垂天，仙草遍地，造化萬千。',
    monsters: ['碧霄彩鸞', '混元靈龜', '踏浪玄龜', '五彩孔雀', '九霄天龍'],
    bossName: '蓬萊巡海蛟皇',
    herbYield: 8,
    stoneYield: 65,
  },
];

export const PET_CATALOG: Omit<PetData, 'level'>[] = [
  {
    id: 'fox',
    name: '墨玉靈狐',
    type: '靈獸·水墨幻狐',
    title: '通靈瑞獸',
    bonusType: 'qi',
    bonusPercent: 12,
    description: '吸納九幽墨韻而生的通靈妖狐，周身墨雲縈繞，大幅增幅修真者修為運轉速率。',
  },
  {
    id: 'deer',
    name: '踏雲白鹿',
    type: '仙獸·踏霞神鹿',
    title: '福澤靈獸',
    bonusType: 'gather',
    bonusPercent: 20,
    description: '四蹄生蓮，踏空無痕，能感應天地草木靈韻，使秘境靈草與靈石採獲翻倍。',
  },
  {
    id: 'ape',
    name: '金睛神猿',
    type: '荒獸·鬥戰魔猿',
    title: '通天神猿',
    bonusType: 'combat',
    bonusPercent: 25,
    description: '火眼金睛，氣血如滔天海嘯，大幅增幅修士鬥法神威與宗門鎮魔殺傷。',
  },
  {
    id: 'phoenix',
    name: '焚天朱雀',
    type: '神獸·南明離火',
    title: '萬禽之尊',
    bonusType: 'qi',
    bonusPercent: 30,
    description: '掌控天地神焰的離火朱雀，羽翼一展萬里流光，全方位大幅淬煉真元速度。',
  },
  {
    id: 'dragon',
    name: '太古青龍',
    type: '聖獸·九霄真龍',
    title: '蒼天龍尊',
    bonusType: 'combat',
    bonusPercent: 40,
    description: '四象至尊之長，龍吟震碎九霄，擁有凌駕萬妖的毀滅殺伐之威。',
  },
];

export const PILL_RECIPES: PillRecipe[] = [
  {
    id: 'peiyuan',
    name: '培元丹',
    costHerbs: 3,
    costCores: 0,
    costStones: 0,
    effectDescription: '吞服後立即轉化為 +50 點純淨修為。',
    description: '煉氣築基必備基礎丹藥，採集天地晨露靈草煉製而成。',
  },
  {
    id: 'breakPill',
    name: '破境丹',
    costHerbs: 5,
    costCores: 1,
    costStones: 10,
    effectDescription: '突破渡劫時自動消耗，大幅提升 30% 成功機率並護住靈台。',
    description: '以妖丹本源融合五味靈草，逆天改命，專破修行桎梏。',
  },
  {
    id: 'concentrate',
    name: '凝神丹',
    costHerbs: 10,
    costCores: 2,
    costStones: 30,
    effectDescription: '吞服後立即轉化為 +200 點浩瀚真元修為。',
    description: '凝鍊百草之精萃與大妖妖丹，能令元神豁然開朗。',
  },
  {
    id: 'bodyMarrow',
    name: '洗髓金丹',
    costHerbs: 25,
    costCores: 5,
    costStones: 100,
    effectDescription: '永久提升洞府每秒修為吸納速度 +5/秒！',
    description: '九品玄階神丹，伐毛洗髓，重塑先天靈根經脈。',
  },
];

export const SECT_SHOP_ITEMS = [
  {
    id: 'shop_egg',
    name: '太古靈獸蛋',
    cost: 150,
    description: '深山龍穴所得靈蛋，可在靈園孵化極品神獸。',
    type: 'egg',
    amount: 1,
  },
  {
    id: 'shop_break_pill',
    name: '長老破境丹',
    cost: 80,
    description: '宗門長老親手煉製的純淨破境丹。',
    type: 'breakPill',
    amount: 1,
  },
  {
    id: 'shop_cores',
    name: '大荒妖丹袋',
    cost: 60,
    description: '內含 5 顆凝縮的妖丹精粹，可用於餵養靈獸或煉丹。',
    type: 'core',
    amount: 5,
  },
  {
    id: 'shop_herbs',
    name: '萬藥靈草捆',
    cost: 40,
    description: '宗門藥圃產出的上好靈草 15 株。',
    type: 'herb',
    amount: 15,
  },
  {
    id: 'shop_stones',
    name: '上品靈石箱',
    cost: 50,
    description: '含 200 枚純淨天地靈石。',
    type: 'stone',
    amount: 200,
  },
];

export const TALENTS_CATALOG: TalentDef[] = [
  // 氣海靈脈
  {
    id: 'qi_gather',
    name: '聚靈通脈',
    branch: 'qi',
    branchName: '氣海靈脈',
    maxLevel: 5,
    reqSpent: 0,
    effectName: '洞府修為吸納速度',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `洞府每秒自動修為汲取速度 +${lvl * 8}%`),
    getNextDesc: (lvl) => `洞府每秒自動修為汲取速度 +${(lvl + 1) * 8}%`,
  },
  {
    id: 'qi_cycle',
    name: '周天綿長',
    branch: 'qi',
    branchName: '氣海靈脈',
    maxLevel: 5,
    reqSpent: 0,
    effectName: '點擊吐納收穫',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `點擊聚靈吐納修為收穫 +${lvl * 15}%`),
    getNextDesc: (lvl) => `點擊聚靈吐納修為收穫 +${(lvl + 1) * 15}%`,
  },
  {
    id: 'qi_pill',
    name: '草木吞納',
    branch: 'qi',
    branchName: '氣海靈脈',
    maxLevel: 3,
    reqSpent: 3,
    effectName: '丹藥修為轉化',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `吞服培元丹/凝神丹修為轉化效果 +${lvl * 20}%`),
    getNextDesc: (lvl) => `吞服培元丹/凝神丹修為轉化效果 +${(lvl + 1) * 20}%`,
  },
  {
    id: 'qi_unity',
    name: '天地同壽',
    branch: 'qi',
    branchName: '氣海靈脈',
    maxLevel: 1,
    reqSpent: 6,
    effectName: '修為極致昇華',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `天人合一！洞府整體修為汲取速率額外永久提升 +30%`),
    getNextDesc: (lvl) => `天人合一！洞府整體修為汲取速率額外永久提升 +30%`,
  },

  // 玄煞神脈
  {
    id: 'combat_power',
    name: '真元凝罡',
    branch: 'combat',
    branchName: '玄煞神脈',
    maxLevel: 5,
    reqSpent: 0,
    effectName: '真元/氣血底蘊',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `法術真元 / 氣血金身基礎威力 +${lvl * 10}%`),
    getNextDesc: (lvl) => `法術真元 / 氣血金身基礎威力 +${(lvl + 1) * 10}%`,
  },
  {
    id: 'combat_strike',
    name: '一念破萬法',
    branch: 'combat',
    branchName: '玄煞神脈',
    maxLevel: 5,
    reqSpent: 0,
    effectName: '秘境神通威力',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `秘境瞬殺神通威力提升，每次鎮壓靈石產出 +${lvl * 15}%`),
    getNextDesc: (lvl) => `秘境瞬殺神通威力提升，每次鎮壓靈石產出 +${(lvl + 1) * 15}%`,
  },
  {
    id: 'combat_boss',
    name: '撼天神威',
    branch: 'combat',
    branchName: '玄煞神脈',
    maxLevel: 3,
    reqSpent: 3,
    effectName: '宗門鎮魔暴擊',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `宗門鎮魔暴擊率 +${lvl * 6}%，暴擊殺傷倍率 +${lvl * 25}%`),
    getNextDesc: (lvl) => `宗門鎮魔暴擊率 +${(lvl + 1) * 6}%，暴擊殺傷倍率 +${(lvl + 1) * 25}%`,
  },
  {
    id: 'combat_chaos',
    name: '混沌神魔印',
    branch: 'combat',
    branchName: '玄煞神脈',
    maxLevel: 1,
    reqSpent: 6,
    effectName: '至高殺伐法相',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `神魔降世！所有鬥法殺傷、神通與鎮魔威能額外永久提升 +35%`),
    getNextDesc: (lvl) => `神魔降世！所有鬥法殺傷、神通與鎮魔威能額外永久提升 +35%`,
  },

  // 造化福緣
  {
    id: 'fortune_drop',
    name: '天生福緣',
    branch: 'fortune',
    branchName: '造化福緣',
    maxLevel: 3,
    reqSpent: 0,
    effectName: '秘境珍寶機緣',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `秘境歷練妖丹與靈獸蛋機緣爆率 +${lvl * 20}%`),
    getNextDesc: (lvl) => `秘境歷練妖丹與靈獸蛋機緣爆率 +${(lvl + 1) * 20}%`,
  },
  {
    id: 'fortune_alchemy',
    name: '三昧真火',
    branch: 'fortune',
    branchName: '造化福緣',
    maxLevel: 3,
    reqSpent: 0,
    effectName: '開爐丹道異象',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `煉丹時有 ${lvl * 20}% 機率引動祥雲，額外爆出一倍丹藥`),
    getNextDesc: (lvl) => `煉丹時有 ${(lvl + 1) * 20}% 機率引動祥雲，額外爆出一倍丹藥`,
  },
  {
    id: 'fortune_spirit',
    name: '萬靈共鳴',
    branch: 'fortune',
    branchName: '造化福緣',
    maxLevel: 3,
    reqSpent: 2,
    effectName: '靈獸共生血契',
    getDesc: (lvl) => (lvl === 0 ? '尚未參悟' : `伴生靈獸全屬性協戰效果額外增幅 +${lvl * 20}%`),
    getNextDesc: (lvl) => `伴生靈獸全屬性協戰效果額外增幅 +${(lvl + 1) * 20}%`,
  },
];


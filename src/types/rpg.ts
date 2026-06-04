/**
 * RPG 레벨·경험치 규칙
 *
 * 누적 XP 기준:
 *   Lv.1 → 0    Lv.2 → 100   Lv.3 → 250
 *   Lv.4 → 450  Lv.5 → 700   … (구간마다 +50씩 늘어나는 추가 XP)
 */

export const XP_REWARDS = {
  task_complete: 5,
  journal_write: 10,
} as const;

/** index 0 = Lv.1 시작 XP, index 1 = Lv.2 도달 XP, … */
export const LEVEL_THRESHOLDS: readonly number[] = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700,
];

function thresholdForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level - 1 < LEVEL_THRESHOLDS.length) {
    return LEVEL_THRESHOLDS[level - 1];
  }
  const lastDefined = LEVEL_THRESHOLDS.length;
  const lastXp = LEVEL_THRESHOLDS[lastDefined - 1];
  const prevXp = LEVEL_THRESHOLDS[lastDefined - 2];
  let gap = lastXp - prevXp;
  let xp = lastXp;
  for (let lv = lastDefined + 1; lv <= level; lv++) {
    gap += 50;
    xp += gap;
  }
  return xp;
}

/** 누적 XP → 현재 레벨 (최소 1) */
export function levelFromTotalXp(totalXp: number): number {
  let level = 1;
  while (thresholdForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

/** 경험치 바: 현재 레벨 내 진행도 */
export function xpProgressInLevel(totalXp: number): {
  level: number;
  currentInLevel: number;
  neededForLevel: number;
  percent: number;
} {
  const level = levelFromTotalXp(totalXp);
  const floor = thresholdForLevel(level);
  const ceiling = thresholdForLevel(level + 1);
  const currentInLevel = totalXp - floor;
  const neededForLevel = ceiling - floor;
  const percent =
    neededForLevel <= 0 ? 100 : Math.min(100, (currentInLevel / neededForLevel) * 100);

  return { level, currentInLevel, neededForLevel, percent };
}

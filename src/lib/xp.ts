// XP & level math
export function levelFromXp(xp: number): number {
  // Level n requires 100 * n*(n+1)/2 cumulative XP. Inverse:
  // xp = 50 * n * (n+1)  => n = (-1 + sqrt(1 + 8*xp/100)) / 2
  return Math.max(1, Math.floor((-1 + Math.sqrt(1 + (8 * xp) / 100)) / 2) + 1);
}

export function xpForLevel(level: number): number {
  // cumulative XP required to *reach* this level
  const n = level - 1;
  return 50 * n * (n + 1);
}

export function progressInLevel(xp: number) {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return {
    level,
    current: xp - base,
    needed: next - base,
    pct: Math.min(100, Math.round(((xp - base) / (next - base)) * 100)),
  };
}

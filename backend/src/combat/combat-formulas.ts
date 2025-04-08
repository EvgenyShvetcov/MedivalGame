import { Player } from 'src/player/entities/player.entity';
import { Unit } from 'src/unit/entities/unit.entity';
import { UnitType } from 'src/unit/unit-type.enum';

/**
 * Расчёт урона с учётом силы, защиты и типа юнита.
 */
export function calculateDamage(
  attacker: Player,
  defender: Player,
  unit: Unit,
): number {
  const base = unit.level * 10;
  const strengthBonus = attacker.strength * 1; // Сила даёт урон
  const defenseReduction = defender.defense * 0.4; // Общая защита
  const typeReduction = getTypeDefense(defender, unit.type) * 0.6;

  const finalDamage = Math.max(
    0,
    Math.floor(base + strengthBonus - defenseReduction - typeReduction),
  );

  return finalDamage;
}

/**
 * Защита от типа юнита
 */
function getTypeDefense(defender: Player, type: UnitType): number {
  switch (type) {
    case UnitType.ARCHER:
      return defender.archerDefense;
    case UnitType.INFANTRY:
      return defender.infantryDefense;
    case UnitType.CAVALRY:
      return defender.cavalryDefense;
    default:
      return 0;
  }
}

/**
 * Шанс крита: базовый 3%, +0.7% за каждую ловкость
 */
export function calculateCritChance(player: Player): number {
  return 3 + player.agility * 0.7;
}

/**
 * Шанс уклонения: базовый 2%, +0.4% за каждую ловкость
 */
export function calculateDodgeChance(player: Player): number {
  return 2 + player.agility * 0.4;
}

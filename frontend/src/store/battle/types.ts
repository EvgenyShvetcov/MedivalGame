import { IBattleUnit, IPlayer } from "../player/types";

export interface IBattle {
  id: string;
  playerOne: IPlayer;
  playerTwo: IPlayer;
  winner: IPlayer | null;
  currentTurn: number;
  isFinished: boolean;
  turnStartedAt: string | null;
  turnDuration: number;
  attackerSelectedUnit: IBattleUnit | null;
  defenderSelectedUnit: IBattleUnit | null;
  logs?: IBattleLog[];
}

export type UnitType = "INFANTRY" | "ARCHER" | "CAVALRY";

export interface IUnit {
  id: string;
  type: UnitType;
  level: number;
  amount: number;
  baseDamage: number;
  specialEffect?: string;
  owner: {
    id: string;
    username: string;
  };
  playerId: string;
  imageUrl?: string;
}

export interface IBattleState {
  current: IBattle | null;
  isLoading: boolean;
  error: string | null;
  isSearching: boolean;
  logs: IBattleLog[]; // вот это нужно
}

export interface IBattleLog {
  id: string;
  turnNumber: number;
  damageDealtToDefender: number;
  damageDealtToAttacker: number;
  attackerCrit: boolean;
  defenderCrit: boolean;
  attackerDodged: boolean;
  defenderDodged: boolean;
  createdAt: string;
  attacker: { username: string };
  defender: { username: string };
  attackerUnit: { type: UnitType };
  defenderUnit: { type: UnitType };
}

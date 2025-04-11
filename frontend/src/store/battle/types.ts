import { IPlayer } from "../player/types";

export interface IBattle {
  id: string;
  playerOne: IPlayer;
  playerTwo: IPlayer;
  winner: IPlayer | null;
  currentTurn: number;
  isFinished: boolean;
  turnStartedAt: string | null;
  turnDuration: number;
  attackerSelectedUnit: IUnit | null;
  defenderSelectedUnit: IUnit | null;
  logs?: any[]; // пока можно оставить
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
}

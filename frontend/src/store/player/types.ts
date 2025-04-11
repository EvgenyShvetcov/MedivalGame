import { IUnit } from "../battle/types";
import { Location } from "../location/types";

export interface IPlayer {
  id: string;
  authId: string;
  username: string;
  password?: string;

  level: number;
  experience: number;
  gold: number;
  health: number;
  strength: number;
  agility: number;
  defense: number;

  infantryCount: number;
  archerCount: number;
  cavalryCount: number;
  unitLevel: number;

  infantryAttack: number;
  infantryDefense: number;
  archerAttack: number;
  archerDefense: number;
  cavalryAttack: number;
  cavalryDefense: number;

  attributePoints: number;
  units?: IUnit[];
  location?: Location;

  currentBattleId: string | null;
  lastBattleEndedAt: string | null; // Date приходит в string
  lastSeenAt?: string;
  isBot: boolean;

  isOnline?: boolean; // добавлено клиентом
}

export interface IPlayerState {
  data: IPlayer | null;
  isLoading: boolean;
  error: string | null;
}

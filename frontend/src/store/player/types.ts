export interface IPlayer {
  id: string;
  authId: string;
  username: string;
  level: number;
  health: number;
  gold: number; // ← добавь это
  experience: number; // ← и это, если тоже будешь использовать
  attributePoints: number;
  strength: number;
  agility: number;
  defense: number;
  infantryAttack: number;
  archerAttack: number;
  cavalryAttack: number;
  infantryDefense: number;
  archerDefense: number;
  cavalryDefense: number;
  location: string;
}

export interface IPlayerState {
  data: IPlayer | null;
  isLoading: boolean;
  error: string | null;
}

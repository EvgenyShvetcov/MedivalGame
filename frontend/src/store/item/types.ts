export interface IItem {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  rarity: string;
  slot: string;
  requiredLevel: number;
  bonuses: Record<string, number>;
}

export interface IPlayerItem {
  id: string;
  item: IItem;
  isEquipped: boolean;
}

export interface IItemState {
  items: IPlayerItem[];
  equipped: IPlayerItem[];
  isLoading: boolean;
  error: string | null;
}

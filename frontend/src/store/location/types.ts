export interface Location {
  id: string;
  key: string;
  name: string;
  description?: string;
  imageUrl?: string;
  isBattleArena: boolean;
  isShop: boolean;
  isCity: boolean;
  availableDestinations: {
    id: string;
    key: string;
    name: string;
    description?: string;
  }[];
}

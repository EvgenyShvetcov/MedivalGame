export enum ShopItemType {
  UNIT = "UNIT",
  ITEM = "ITEM",
}

export interface IShopItem {
  id: string;
  shopId: string;
  itemType: ShopItemType;
  unitType?: string;
  level?: number;
  price: number;
  name?: string;
  description?: string;
  imageUrl?: string;
  stock?: number;
  itemId?: string;
}

export interface IShop {
  id: string;
  name: string;
  items: IShopItem[];
}

export interface IShopState {
  shops: IShop[];
  currentShop: IShop | null;
  isLoading: boolean;
  error: string | null;
}

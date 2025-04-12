import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  fetchShopsRequest,
  fetchShopByIdRequest,
  buyItemRequest,
} from "@/store/shop";
import { ShopWrapper, ShopTitle, ShopItem, ItemList } from "./styled";
import { Button } from "@/components/Button/Button";
import Spinner from "@/components/Spinner/Spinner";

const ShopPanel: FC = () => {
  const dispatch = useDispatch();
  const { selectedShop, items, isLoading, error } = useSelector(
    (state: RootState) => state.shop
  );
  const player = useSelector((state: RootState) => state.player.data);

  useEffect(() => {
    dispatch(fetchShopsRequest());
  }, [dispatch]);

  useEffect(() => {
    if (player?.location?.id) {
      dispatch(fetchShopByIdRequest(player.location.id));
    }
  }, [dispatch, player]);

  const handleBuyItem = (itemId: string) => {
    dispatch(buyItemRequest(itemId));
  };

  if (isLoading)
    return <Spinner variant="default" text="Загрузка магазина..." />;
  if (error) return <div>{error}</div>;

  return (
    <ShopWrapper>
      <ShopTitle>{selectedShop?.name || "Магазин"}</ShopTitle>

      <ItemList>
        {items &&
          items.map((item) => (
            <ShopItem key={item.id}>
              <span>{item.name || item.unitType}</span>
              <span>💰 {item.price}</span>
              <Button variant="default" onClick={() => handleBuyItem(item.id)}>
                Купить
              </Button>
            </ShopItem>
          ))}
      </ItemList>
    </ShopWrapper>
  );
};

export default ShopPanel;

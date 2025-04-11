import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeLocationRequest } from "@/store/player";
import {
  searchBattleRequest,
  startBotBattleRequest,
  cancelSearchRequest,
} from "@/store/battle";
import Spinner from "@/components/Spinner/Spinner";
import { ActionsWrapper, Title, Description, DestinationsList } from "./styled";
import { Button } from "@/components/Button/Button";

const LocationActions: FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player.data);
  const location = player?.location;
  const destinations = location?.availableDestinations ?? [];
  const isSearching = useSelector(
    (state: RootState) => state.battle.isSearching
  );

  const handleMove = (key: string) => {
    dispatch(changeLocationRequest(key));
  };

  const renderLocationUI = () => {
    if (location?.isBattleArena) {
      return (
        <>
          <h3>⚔️ Вы на арене</h3>

          {isSearching ? (
            <>
              <Spinner variant="battle" text="⏳ Идёт поиск соперника..." />
              <Button
                variant="battle"
                onClick={() => dispatch(cancelSearchRequest())}
              >
                ❌ Отменить поиск
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="battle"
                onClick={() => dispatch(startBotBattleRequest())}
              >
                🤖 Начать бой с ботом
              </Button>
              <Button
                variant="battle"
                onClick={() => dispatch(searchBattleRequest())}
              >
                🧑 Найти соперника
              </Button>
            </>
          )}
        </>
      );
    }

    if (location?.isShop) {
      return (
        <>
          <h3>🛒 Вы в магазине</h3>
          <Button variant="default" disabled>
            📦 Открыть ассортимент (заглушка)
          </Button>
        </>
      );
    }

    return <p>Исследуйте местность или переходите в другую локацию.</p>;
  };

  return (
    <ActionsWrapper>
      <Title>{location?.name}</Title>
      <Description>{location?.description}</Description>

      {renderLocationUI()}

      <h4 style={{ marginTop: "1.2rem" }}>Доступные переходы:</h4>
      <DestinationsList>
        {destinations.map((loc) => (
          <Button
            key={loc.key}
            onClick={() => handleMove(loc.key)}
            variant="location"
          >
            Перейти в {loc.name}
          </Button>
        ))}
      </DestinationsList>
    </ActionsWrapper>
  );
};

export default LocationActions;

import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeLocationRequest } from "@/store/player";
import {
  ActionsWrapper,
  Title,
  Description,
  DestinationsList,
  MoveButton,
} from "./styled";

const LocationActions: FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player.data);
  const location = player?.location;
  const destinations = location?.availableDestinations ?? [];

  const handleMove = (key: string) => {
    dispatch(changeLocationRequest(key));
  };

  const renderLocationUI = () => {
    if (location?.isBattleArena) {
      return (
        <>
          <h3>⚔️ Вы на арене</h3>
          <MoveButton disabled>🔍 Найти соперника (заглушка)</MoveButton>
        </>
      );
    }

    if (location?.isShop) {
      return (
        <>
          <h3>🛒 Вы в магазине</h3>
          <MoveButton disabled>📦 Открыть ассортимент (заглушка)</MoveButton>
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
          <MoveButton key={loc.key} onClick={() => handleMove(loc.key)}>
            Перейти в {loc.name}
          </MoveButton>
        ))}
      </DestinationsList>
    </ActionsWrapper>
  );
};

export default LocationActions;

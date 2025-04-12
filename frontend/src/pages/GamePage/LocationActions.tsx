import { FC, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { changeLocationRequest } from "@/store/player";
import {
  searchBattleRequest,
  startBotBattleRequest,
  cancelSearchRequest,
} from "@/store/battle";
import Spinner from "@/components/Spinner/Spinner";
import {
  ActionsWrapper,
  Title,
  Description,
  DestinationsList,
  Section,
  SectionTitle,
  ButtonsGroup,
} from "./styled";
import { Button } from "@/components/Button/Button";
import Sidebar from "@/components/Sidebar/Sidebar";
import ShopPanel from "@/pages/ShopPanel/ShopPanel";

const LocationActions: FC = () => {
  const dispatch = useDispatch();
  const player = useSelector((state: RootState) => state.player.data);
  const location = player?.location;
  const destinations = location?.availableDestinations ?? [];
  const isSearching = useSelector(
    (state: RootState) => state.battle.isSearching
  );

  const [showShopPanel, setShowShopPanel] = useState(false);
  const shopButtonRef = useRef<HTMLButtonElement>(null);

  const handleMove = (key: string) => {
    dispatch(changeLocationRequest(key));
  };

  const renderLocationUI = () => {
    if (location?.isBattleArena) {
      return (
        <Section>
          <SectionTitle>⚔️ Вы на арене</SectionTitle>

          {isSearching ? (
            <>
              <Spinner variant="battle" text="⏳ Идёт поиск соперника..." />
              <Button
                variant="darkWood"
                onClick={() => dispatch(cancelSearchRequest())}
              >
                ❌ Отменить поиск
              </Button>
            </>
          ) : (
            <ButtonsGroup>
              <Button
                variant="darkWood"
                onClick={() => dispatch(startBotBattleRequest())}
              >
                🤖 Начать бой с ботом
              </Button>
              <Button
                variant="darkWood"
                onClick={() => dispatch(searchBattleRequest())}
              >
                🧑 Найти соперника
              </Button>
            </ButtonsGroup>
          )}
        </Section>
      );
    }

    if (location?.isShop) {
      return (
        <Section>
          <SectionTitle>🛒 Вы в магазине</SectionTitle>
          <Button
            variant="default"
            onClick={() => setShowShopPanel(true)}
            ref={shopButtonRef}
          >
            📦 Открыть ассортимент
          </Button>
        </Section>
      );
    }

    return <p>Исследуйте местность или переходите в другую локацию.</p>;
  };

  return (
    <ActionsWrapper>
      <Title>{location?.name}</Title>
      <Description>{location?.description}</Description>

      {renderLocationUI()}

      <Section>
        <SectionTitle>🚪 Доступные переходы:</SectionTitle>
        <DestinationsList>
          {destinations.map((loc) => (
            <Button
              key={loc.key}
              onClick={() => handleMove(loc.key)}
              variant="darkWood"
            >
              Перейти в {loc.name}
            </Button>
          ))}
        </DestinationsList>
      </Section>

      {showShopPanel && (
        <Sidebar
          onClose={() => setShowShopPanel(false)}
          title="Магазин"
          position="right"
          ignoreRef={shopButtonRef}
        >
          <ShopPanel />
        </Sidebar>
      )}
    </ActionsWrapper>
  );
};

export default LocationActions;

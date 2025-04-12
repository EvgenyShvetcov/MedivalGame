import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  getBattleRequest,
  getCurrentBattleRequest,
  makeTurnRequest,
  processTurnRequest,
} from "@/store/battle";

import BattleInfo from "./components/BattleInfo";
import UnitCard from "./components/UnitCard";
import BattleLog from "./components/BattleLog";
import { Button } from "@/components/Button/Button";
import VictoryScreen from "./components/VictroyScreen";
import BattleTimer from "./components/BattleTimer";
import SelectedUnits from "./components/SelectedUnits";
import { fetchPlayerRequest } from "@/store/player";
import BattleLayout, {
  Center,
  EnemyPanel,
  LogSection,
  Sidebar,
} from "@/layouts/BattleLayout";

const BattlePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const battle = useSelector((state: RootState) => state.battle.current);
  const playerId = useSelector((state: RootState) => state.player.data?.id);
  const logs = useSelector((state: RootState) => state.battle.logs);

  useEffect(() => {
    if (!playerId) {
      dispatch(fetchPlayerRequest());
    }
  }, [playerId]);

  useEffect(() => {
    if (id) {
      dispatch(getBattleRequest(id)); // ✅ при загрузке страницы
    } else {
      dispatch(getCurrentBattleRequest());
    }
  }, [id]);

  useEffect(() => {
    if (!id && battle?.id) {
      navigate(`/battle/${battle.id}`, { replace: true });
    }
  }, [battle?.id, id]);

  useEffect(() => {
    if (
      battle &&
      !battle.isFinished &&
      battle.attackerSelectedUnit &&
      battle.defenderSelectedUnit
    ) {
      dispatch(processTurnRequest(battle.id));
    }
  }, [
    battle?.attackerSelectedUnit?.id,
    battle?.defenderSelectedUnit?.id,
    battle?.id,
    battle?.isFinished,
  ]);

  if (!battle?.playerOne || !battle?.playerTwo || !playerId)
    return <p>Загрузка боя...</p>;

  if (battle.isFinished) {
    return <VictoryScreen winner={battle.winner} logs={logs} />;
  }

  const isPlayerOne = battle.playerOne.id === playerId;
  const player = isPlayerOne ? battle.playerOne : battle.playerTwo;
  const opponent = isPlayerOne ? battle.playerTwo : battle.playerOne;
  const selectedUnitId = isPlayerOne
    ? battle.attackerSelectedUnit?.id
    : battle.defenderSelectedUnit?.id;
  const isUnitSelected = isPlayerOne
    ? !!battle.attackerSelectedUnit
    : !!battle.defenderSelectedUnit;

  const handleChoose = (unitId: string) => {
    dispatch(makeTurnRequest({ unitId }));
  };

  return (
    <BattleLayout>
      <Sidebar>
        <h3>🧱 Ваши юниты</h3>
        {player.units?.length ? (
          player.units.map((unit) => (
            <UnitCard
              key={unit.id}
              unit={unit}
              onSelect={handleChoose}
              selected={unit.id === selectedUnitId}
            />
          ))
        ) : (
          <p>У вас нет юнитов для выбора.</p>
        )}
      </Sidebar>

      <Center>
        <BattleInfo
          player={player}
          opponent={opponent}
          currentTurn={battle.currentTurn}
        />
        <BattleTimer
          battleId={battle.id}
          turnStartedAt={battle.turnStartedAt}
          turnDuration={battle.turnDuration}
          isUnitSelected={isUnitSelected}
        />
        <SelectedUnits
          isPlayerOne={isPlayerOne}
          attackerSelectedUnit={battle.attackerSelectedUnit}
          defenderSelectedUnit={battle.defenderSelectedUnit}
        />
        <Button variant="darkWood" onClick={() => navigate("/game")}>
          ⬅️ Выйти из боя
        </Button>
      </Center>

      <EnemyPanel>
        <h3>👹 Противник</h3>
        <p>{opponent.username}</p>
        <p>❤️ {opponent.health} HP</p>
      </EnemyPanel>

      <LogSection>
        <BattleLog logs={logs} />
      </LogSection>
    </BattleLayout>
  );
};

export default BattlePage;

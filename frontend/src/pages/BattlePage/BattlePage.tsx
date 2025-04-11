import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import {
  getBattleRequest,
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

const BattlePage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const battle = useSelector((state: RootState) => state.battle.current);
  const playerId = useSelector((state: RootState) => state.player.data?.id);
  const logs = useSelector((state: RootState) => state.battle.logs);

  useEffect(() => {
    const interval = setInterval(() => {
      if (id) dispatch(getBattleRequest(id));
    }, 5000);

    return () => clearInterval(interval);
  }, [id]);

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

  if (!battle || !playerId) return <p>Загрузка боя...</p>;

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
    if (opponent.isBot) {
      dispatch(processTurnRequest(battle.id));
    }
  };

  return (
    <div>
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

      <h3>Выберите юнита:</h3>
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
      <Button variant="location" onClick={() => navigate("/game")}>
        ⬅️ Выйти из боя
      </Button>

      <BattleLog logs={battle.logs ?? []} />
    </div>
  );
};

export default BattlePage;

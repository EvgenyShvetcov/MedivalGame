import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { processTurnRequest } from "@/store/battle";
import { IBattleUnit } from "@/store/player/types";

const TimerWrapper = styled.div<{ $danger?: boolean }>`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: ${({ $danger }) => ($danger ? "#ff5555" : "#fff")};
  font-weight: bold;
`;

interface Props {
  battleId: string;
  turnStartedAt: string | null;
  turnDuration: number;
  selectedUnitId: string | null;
  playerUnits: IBattleUnit[];
}

const BattleTimer: FC<Props> = ({
  battleId,
  turnStartedAt,
  turnDuration,
  playerUnits,
  selectedUnitId,
}) => {
  const dispatch = useDispatch();
  const [timeLeft, setTimeLeft] = useState(turnDuration);

  useEffect(() => {
    if (!turnStartedAt) return;

    const started = new Date(turnStartedAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - started) / 1000);
      const remaining = Math.max(0, turnDuration - elapsed);
      setTimeLeft(remaining);

      const selectedUnit = playerUnits.find((u) => u.id === selectedUnitId);

      if (remaining <= 0) {
        clearInterval(interval);

        if (selectedUnit) {
          dispatch(processTurnRequest(battleId));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [battleId, turnStartedAt, turnDuration, playerUnits, selectedUnitId]);

  return (
    <TimerWrapper $danger={timeLeft <= 5}>
      ⏳ Осталось времени: {timeLeft} сек
    </TimerWrapper>
  );
};

export default BattleTimer;

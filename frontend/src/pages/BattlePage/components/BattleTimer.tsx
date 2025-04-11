import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { processTurnRequest } from "@/store/battle";

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
  isUnitSelected: boolean;
}

const BattleTimer: FC<Props> = ({
  battleId,
  turnStartedAt,
  turnDuration,
  isUnitSelected,
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

      if (remaining <= 0) {
        clearInterval(interval);
        if (isUnitSelected) {
          dispatch(processTurnRequest(battleId));
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [battleId, turnStartedAt, turnDuration, isUnitSelected]);

  return (
    <TimerWrapper $danger={timeLeft <= 5}>
      ⏳ Осталось времени: {timeLeft} сек
    </TimerWrapper>
  );
};

export default BattleTimer;

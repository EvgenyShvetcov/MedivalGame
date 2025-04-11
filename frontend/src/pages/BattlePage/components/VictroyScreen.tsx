import { FC } from "react";
import styled from "styled-components";
import { Button } from "@/components/Button/Button";
import { IBattleLog } from "@/store/battle/types";
import { useNavigate } from "react-router-dom";
import BattleLog from "./BattleLog";
import { IPlayer } from "@/store/player/types";
import { leaveBattleRequest } from "@/store/battle";
import { useDispatch } from "react-redux";

interface Props {
  winner: IPlayer | null;
  logs: IBattleLog[];
}

const Wrapper = styled.div`
  padding: 2rem;
  background: rgba(0, 0, 0, 0.7);
  border-radius: 12px;
  color: #fff;
  font-family: "MedievalSharp", serif;
  text-align: center;
`;

const WinnerName = styled.span`
  color: #ffd700;
  font-size: 1.5rem;
  font-weight: bold;
  text-shadow: 0 0 6px #fff;
`;

const VictoryScreen: FC<Props> = ({ winner, logs }) => {
  const dispatch = useDispatch();

  return (
    <Wrapper>
      <h2>🏁 Битва завершена</h2>
      <p>
        Победитель: <WinnerName>{winner?.username || "???"}</WinnerName>
      </p>

      <BattleLog logs={logs} />

      <Button onClick={() => dispatch(leaveBattleRequest())}>
        🚪 Выйти из боя
      </Button>
    </Wrapper>
  );
};

export default VictoryScreen;

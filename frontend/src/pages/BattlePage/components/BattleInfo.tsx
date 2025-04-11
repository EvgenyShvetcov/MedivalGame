import { FC } from "react";
import styled from "styled-components";
import { IPlayer } from "@/store/player/types";

interface Props {
  player: IPlayer;
  opponent: IPlayer;
  currentTurn: number;
}

const Wrapper = styled.div`
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: rgba(30, 30, 30, 0.7);
  border: 1px solid #444;
  border-radius: 8px;
  color: #f0f0f0;
  font-family: "MedievalSharp", serif;
`;

const Health = styled.div`
  margin-top: 0.3rem;
  font-size: 0.9rem;
`;

const BattleInfo: FC<Props> = ({ player, opponent, currentTurn }) => {
  return (
    <Wrapper>
      <h2>⚔️ Битва</h2>
      <p>Раунд: {currentTurn}</p>
      <p>
        🧍‍♂️ Вы: <strong>{player.username}</strong>
      </p>
      <Health>❤️ Здоровье: {player.health}</Health>
      <p>
        🧟 Противник: <strong>{opponent.username}</strong>
      </p>
      <Health>❤️ Здоровье: {opponent.health}</Health>
    </Wrapper>
  );
};

export default BattleInfo;

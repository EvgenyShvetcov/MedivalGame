import { FC } from "react";
import styled from "styled-components";
import { IUnit } from "@/store/battle/types";
import { IBattleUnit } from "@/store/player/types";

const Wrapper = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(20, 20, 20, 0.5);
  border-radius: 8px;
  color: #eee;
  font-family: "MedievalSharp", serif;
`;

interface Props {
  isPlayerOne: boolean;
  attackerSelectedUnit: IBattleUnit | null;
  defenderSelectedUnit: IBattleUnit | null;
}

const SelectedUnits: FC<Props> = ({
  isPlayerOne,
  attackerSelectedUnit,
  defenderSelectedUnit,
}) => {
  const myUnit = isPlayerOne ? attackerSelectedUnit : defenderSelectedUnit;
  const unit = myUnit?.originalUnit;

  return (
    <Wrapper>
      <h4>🧙 Выбранные юниты:</h4>
      <p>
        🧍‍♂️ Вы: {unit ? `${unit.type} (ур. ${myUnit.level})` : "— не выбран"}
      </p>
      <p>🧟 Противник: — ожидается выбор</p>
    </Wrapper>
  );
};

export default SelectedUnits;

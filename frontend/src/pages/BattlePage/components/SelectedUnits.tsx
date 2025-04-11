import { FC } from "react";
import styled from "styled-components";
import { IUnit } from "@/store/battle/types";

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
  attackerSelectedUnit: IUnit | null;
  defenderSelectedUnit: IUnit | null;
}

const SelectedUnits: FC<Props> = ({
  isPlayerOne,
  attackerSelectedUnit,
  defenderSelectedUnit,
}) => {
  const myUnit = isPlayerOne ? attackerSelectedUnit : defenderSelectedUnit;

  return (
    <Wrapper>
      <h4>🧙 Выбранные юниты:</h4>
      <p>
        🧍‍♂️ Вы: {myUnit ? `${myUnit.type} (ур. ${myUnit.level})` : "— не выбран"}
      </p>
      <p>🧟 Противник: — ожидается выбор</p>
    </Wrapper>
  );
};

export default SelectedUnits;

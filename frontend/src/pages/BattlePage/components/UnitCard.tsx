import { FC } from "react";
import { IUnit } from "@/store/battle/types";
import { Button } from "@/components/Button/Button";
import styled from "styled-components";
import { getUnitIcon } from "@/utils/unitIcons";
import { IBattleUnit } from "@/store/player/types";

const Card = styled.div<{ $selected?: boolean }>`
  background: rgba(0, 0, 0, 0.6);
  border: 2px solid ${({ $selected }) => ($selected ? "#ffd700" : "#444")};
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  color: #fff;
  font-family: "MedievalSharp", serif;
  box-shadow: ${({ $selected }) =>
    $selected ? "0 0 10px rgba(255, 215, 0, 0.6)" : "none"};
  transition: all 0.2s ease-in-out;
  cursor: ${({ $selected }) => ($selected ? "default" : "pointer")};

  &:hover {
    border-color: ${({ $selected }) => ($selected ? "#ffd700" : "#666")};
  }
`;

const ButtonStub = styled(Button)`
  pointer-events: none;
  opacity: 0.8;
`;

interface Props {
  unit: IBattleUnit;
  onSelect: (id: string) => void;
  selected?: boolean;
}

const UnitCard: FC<Props> = ({ unit, onSelect, selected }) => {
  const handleClick = () => {
    if (!selected) {
      onSelect(unit.id);
    }
  };

  return (
    <Card $selected={selected} onClick={handleClick}>
      <p>
        <strong>Тип:</strong> {getUnitIcon(unit.originalUnit.type)}{" "}
        {unit.originalUnit.type}
      </p>
      <p>Уровень: {unit.level}</p>
      <p>Количество: {unit.remaining}</p>
      <ButtonStub variant="battle">
        {selected ? "✅ Выбран" : "Выбрать"}
      </ButtonStub>
    </Card>
  );
};

export default UnitCard;

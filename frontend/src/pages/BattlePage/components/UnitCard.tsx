import { FC } from "react";
import { IUnit } from "@/store/battle/types";
import { Button } from "@/components/Button/Button";
import styled from "styled-components";
import { getUnitIcon } from "@/utils/unitIcons";

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
`;

interface Props {
  unit: IUnit;
  onSelect: (id: string) => void;
  selected?: boolean;
}

const UnitCard: FC<Props> = ({ unit, onSelect, selected }) => {
  return (
    <Card $selected={selected}>
      <p>
        <strong>Тип:</strong> {getUnitIcon(unit.type)} {unit.type}
      </p>
      <p>Уровень: {unit.level}</p>
      <p>Количество: {unit.amount}</p>
      <Button onClick={() => onSelect(unit.id)} disabled={selected}>
        {selected ? "✅ Выбран" : "Выбрать"}
      </Button>
    </Card>
  );
};

export default UnitCard;

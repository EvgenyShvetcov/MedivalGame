import { FC } from "react";
import { Row, Name, Value, PlusButton } from "./styled";
import { useDispatch, useSelector } from "react-redux";
import { assignAttributesRequest } from "@/store/player";
import { RootState } from "@/store";

interface Props {
  name: string;
  value: number;
  field:
    | "strength"
    | "agility"
    | "defense"
    | "infantryAttack"
    | "infantryDefense"
    | "archerAttack"
    | "archerDefense"
    | "cavalryAttack"
    | "cavalryDefense";
}

const AttributeRow: FC<Props> = ({ name, value, field }) => {
  const dispatch = useDispatch();
  const { attributePoints } = useSelector(
    (state: RootState) => state.player.data!
  );

  const handleAdd = () => {
    dispatch(assignAttributesRequest({ [field]: 1 }));
  };

  return (
    <Row>
      <Name>{name}</Name>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <PlusButton onClick={handleAdd} disabled={attributePoints <= 0}>
          ➕
        </PlusButton>
        <Value $highlight={attributePoints > 0}>{value}</Value>
      </div>
    </Row>
  );
};

export default AttributeRow;

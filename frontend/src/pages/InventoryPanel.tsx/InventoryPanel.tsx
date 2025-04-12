import {
  InventoryWrapper,
  InventoryGrid,
  EquipmentSection,
  Slot,
  PlaceholderItem,
  InventoryList,
  InventoryItem,
} from "./styled";
import { FC } from "react";

const InventoryPanel: FC = () => {
  return (
    <InventoryWrapper>
      <EquipmentSection>
        <div style={{ gridArea: "head" }}>Шлем</div>
        <div style={{ gridArea: "chest" }}>Броня</div>
        <div style={{ gridArea: "legs" }}>Штаны</div>
        <div style={{ gridArea: "boots" }}>Сапоги</div>
        <div style={{ gridArea: "weapon" }}>Оружие</div>
        <div style={{ gridArea: "shield" }}>Щит</div>
        <div style={{ gridArea: "ring" }}>Кольцо</div>
        <div style={{ gridArea: "amulet" }}>Амулет</div>
      </EquipmentSection>

      <InventoryList>
        {Array.from({ length: 12 }).map((_, i) => (
          <InventoryItem key={i}>Пусто</InventoryItem>
        ))}
      </InventoryList>
    </InventoryWrapper>
  );
};

export default InventoryPanel;

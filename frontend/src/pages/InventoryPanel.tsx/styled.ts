import styled from "styled-components";

export const InventoryWrapper = styled.div`
  display: flex;
  gap: 2rem;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #3b2e22, #1c120c);
  padding: 1rem;
  color: #f5f5f5;
  font-family: "MedievalSharp", serif;
  overflow-y: auto;
`;

export const EquipmentSection = styled.div`
  flex-shrink: 0;
  display: grid;
  grid-template-areas:
    "head"
    "chest"
    "legs"
    "boots"
    "weapon"
    "shield"
    "ring"
    "amulet";
  gap: 1rem;

  div {
    width: 64px;
    height: 64px;
    border: 2px solid #7b6147;
    background: #22180f;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    box-shadow: inset 0 0 4px #000;
    font-size: 0.75rem;
    color: #c9b18f;
  }
`;

export const InventoryList = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
`;

export const InventoryItem = styled.div`
  display: flex;
  align-items: center;
  background: #1e1e1e;
  border: 2px solid #5a4636;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: inset 0 0 3px #000;
  font-size: 0.9rem;
  color: #ddd;
  height: 48px;

  &::before {
    content: "📦";
    margin-right: 0.6rem;
  }
`;

export const Title = styled.h2`
  margin-bottom: 1rem;
  color: #f3e3c3;
  text-shadow: 1px 1px 2px #000;
`;

export const InventoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 64px);
  gap: 0.75rem;
`;

export const Slot = styled.div`
  width: 64px;
  height: 64px;
  background: #1e1e1e;
  border: 2px solid #5a4636;
  border-radius: 6px;
  box-shadow: inset 0 0 4px #000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const PlaceholderItem = styled.div`
  width: 40px;
  height: 40px;
  background: #444;
  border-radius: 4px;
  opacity: 0.5;
`;

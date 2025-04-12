import styled from "styled-components";

export const ShopWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, #3b2e22, #1c120c);
  padding: 1rem;
  color: #f5f5f5;
  font-family: "MedievalSharp", serif;
  overflow-y: auto;
`;

export const ShopTitle = styled.h2`
  color: #f3e3c3;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 2px #000;
`;

export const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const ShopItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #1e1e1e;
  border: 2px solid #5a4636;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  box-shadow: inset 0 0 3px #000;
  font-size: 0.9rem;
  color: #ddd;
  height: 48px;

  span:first-child {
    flex-grow: 1;
  }

  span:last-child {
    margin-right: 1rem;
  }
`;

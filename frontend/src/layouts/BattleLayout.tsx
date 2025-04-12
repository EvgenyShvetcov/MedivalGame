// BattleLayout.tsx
import styled from "styled-components";

// layouts/BattleLayout/BattleLayout.tsx
import { FC, PropsWithChildren } from "react";

const BattleLayout: FC<PropsWithChildren> = ({ children }) => {
  return <Layout>{children}</Layout>;
};

export default BattleLayout;

export const Layout = styled.div`
  display: grid;
  grid-template-areas:
    "sidebar center enemy"
    "log log log";
  grid-template-columns: 1fr 2fr 1fr;
  grid-template-rows: auto 200px;
  height: calc(100vh - 100px); // учтём футер
  background: #121212;
  color: #fff;
  padding: 1rem;
  gap: 1rem;
  font-family: "MedievalSharp", serif;
`;

export const Sidebar = styled.div`
  grid-area: sidebar;
`;

export const Center = styled.div`
  grid-area: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const EnemyPanel = styled.div`
  grid-area: enemy;
  text-align: right;
`;

export const LogSection = styled.div`
  grid-area: log;
  overflow-y: auto;
  background: rgba(30, 30, 30, 0.6);
  padding: 1rem;
  border-radius: 8px;
  max-height: 200px;
`;

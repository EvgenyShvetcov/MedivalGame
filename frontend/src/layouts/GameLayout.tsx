import { FC } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled from "styled-components";
import Footer from "@/components/Footer/Footer";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #121212;

  /* ⬇️ учёт футера, чтобы контент не перекрывался */
  padding-bottom: 100px;
`;

const Content = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const GameLayout: FC = () => {
  const { pathname } = useLocation();
  const isBattlePage = pathname.startsWith("/battle");

  return (
    <GameContainer>
      <Content>
        <Outlet />
      </Content>
      {!isBattlePage && <Footer />} {/* ⬅️ скрываем футер в бою */}
    </GameContainer>
  );
};

export default GameLayout;

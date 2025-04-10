// GamePage.tsx
import { FC } from "react";
import { Wrapper } from "./styled";

const GamePage: FC = () => {
  return (
    <Wrapper>
      <h1>Текущая локация: ???</h1>
      <p>Имя игрока: ???</p>
      <p>Здоровье: ??? / ???</p>
      <p>Золото: ???</p>
    </Wrapper>
  );
};

export default GamePage;

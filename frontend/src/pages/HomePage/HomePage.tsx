import { Subtitle, Wrapper, Title } from "../styled";
import background from "@/assets/homepage.png";

const HomePage = () => {
  return (
    <Wrapper background={background}>
      <Title>Medival</Title>
      <Subtitle>Пора пустить кровь. Война ждёт.</Subtitle>
    </Wrapper>
  );
};

export default HomePage;

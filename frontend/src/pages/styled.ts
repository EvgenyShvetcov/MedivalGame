import styled from "styled-components";
import background from "@/assets/homepage.png";
import { Link } from "react-router-dom";

interface WrapperProps {
  background?: string;
}

export const Wrapper = styled.div<WrapperProps>`
  height: 100vh;
  background-image: ${({ background }) => `url(${background})`};
  background-size: cover;
  background-position: center -85px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #f0f0f0;
  text-align: center;
`;

// Можно указать дефолтный фон, если пропс не передан
Wrapper.defaultProps = {
  background: background,
};

export const Title = styled.h1`
  font-size: 4rem;
  margin-top: 100px;
`;

export const Subtitle = styled.p`
  font-size: 1.5rem;
  margin: 1rem 0;
  opacity: 0.8;
`;

export const RegisterLink = styled(Link)`
  margin-top: 1rem;
  font-size: 1.1rem;
  color: rgb(255, 255, 255);
  opacity: 0.8;
  text-decoration: underline;

  &:hover {
    opacity: 1;
  }
`;

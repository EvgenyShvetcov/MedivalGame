import styled from "styled-components";
import background from "@/assets/homepage.png";

export const Wrapper = styled.div`
  height: 100vh;
  background-image: url(${background});
  background-size: cover;
  background-position: center -85px;
  display: flex;
  flex-direction: column;
  // justify-content: center;
  align-items: center;
  color: #f0f0f0;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 4rem;
  margin-top: 100px;
`;

export const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-top: 1rem;
  opacity: 0.8;
`;

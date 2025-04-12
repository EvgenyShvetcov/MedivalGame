import styled from "styled-components";

export const FooterWrapper = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px;

  background: radial-gradient(
      circle at 20% 30%,
      rgba(50, 50, 50, 0.2) 0%,
      transparent 40%
    ),
    radial-gradient(
      circle at 80% 70%,
      rgba(80, 80, 80, 0.15) 0%,
      transparent 50%
    ),
    linear-gradient(to top, #0a0a0a, #151515);

  border-top: 3px solid #2a2a2a;

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2rem;

  z-index: 1000;
`;

export const LeftGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export const RightGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
`;

export const PlayerStats = styled.div`
  display: flex;
  align-items: center;
  gap: 10px; // общий отступ между блоками
  font-size: 1rem;
  color: #f8f8f8;
  font-weight: bold;
  font-family: "MedievalSharp", serif;

  span {
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;

    & .label {
      display: inline-block;
      min-width: 1.6em; // выравнивание по ширине "иконок"
      text-align: center;
    }
  }
`;

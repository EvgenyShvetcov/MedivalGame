// Spinner.tsx
import styled, { keyframes } from "styled-components";
import { FC } from "react";

interface SpinnerProps {
  variant?: "default" | "battle" | "location";
  text?: string;
}

const Spinner: FC<SpinnerProps> = ({
  variant = "default",
  text = "Загрузка...",
}) => {
  return (
    <SpinnerWrapper>
      <MedievalSpinner $variant={variant} />
      <Text>{text}</Text>
    </SpinnerWrapper>
  );
};

export default Spinner;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const SpinnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1.5rem;
`;

const MedievalSpinner = styled.div<{ $variant: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 6px solid transparent;
  border-top: 6px solid
    ${({ $variant }) =>
      $variant === "battle"
        ? "#c0392b"
        : $variant === "location"
        ? "#2980b9"
        : "#a78d47"};
  border-right: 6px solid
    ${({ $variant }) =>
      $variant === "battle"
        ? "#922b21"
        : $variant === "location"
        ? "#1b4f72"
        : "#705c2e"};
  animation: ${spin} 1s linear infinite;
  background: radial-gradient(circle, #1c1c1c 40%, #0f0f0f 100%);
  box-shadow: 0 0 10px #00000090, 0 0 20px #00000060, inset 0 0 8px #000000aa;
`;

const Text = styled.div`
  margin-top: 0.75rem;
  font-size: 0.95rem;
  color: #f0e6d2;
  font-family: "Georgia", serif;
  text-shadow: 1px 1px 2px #000;
`;

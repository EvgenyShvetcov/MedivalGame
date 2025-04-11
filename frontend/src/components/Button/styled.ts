import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

// Анимация свечения (от факела)
const flicker = keyframes`
  0%, 100% {
    box-shadow:
      0 0 8px rgba(255, 153, 51, 0.3),
      0 0 12px rgba(255, 153, 51, 0.2);
  }
  50% {
    box-shadow:
      0 0 10px rgba(255, 153, 51, 0.6),
      0 0 14px rgba(255, 153, 51, 0.4);
  }
`;

// styled.ts
export const StyledButton = styled.button<{ $variant?: string }>`
  all: unset;
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;

  color: ${({ $variant }) =>
    $variant === "battle"
      ? "#ffcccc"
      : $variant === "location"
      ? "#d0e0ff"
      : "#d6d6d6"};

  background: ${({ $variant }) =>
    $variant === "battle"
      ? "linear-gradient(to bottom, #4e0000, #220000)"
      : $variant === "location"
      ? "linear-gradient(to bottom, #001f3f, #001020)"
      : "linear-gradient(to bottom, #1e1e1e, #0f0f0f)"};

  border: 2px solid #444;
  border-radius: 6px;
  font-family: "MedievalSharp", serif;
  text-shadow: 1px 1px 2px #000;
  cursor: pointer;
  text-align: center;
  text-decoration: none;

  box-shadow: 0 3px 0 #000, 0 6px 10px rgba(0, 0, 0, 0.6);
  transition: all 0.2s ease-in-out;

  &:hover {
    border-color: #666;
    animation: ${flicker} 1.2s ease-in-out infinite;
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 0 4px rgba(255, 153, 51, 0.3), 0 1px 0 #000,
      0 2px 4px rgba(0, 0, 0, 0.6);
  }
`;

export const StyledLinkButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #d6d6d6;

  background: linear-gradient(to bottom, #1e1e1e, #0f0f0f);
  border: 2px solid #444;
  border-radius: 6px;

  font-family: "MedievalSharp", serif;
  text-shadow: 1px 1px 2px #000;

  cursor: pointer;
  text-align: center;
  text-decoration: none;

  box-shadow: 0 3px 0 #000, 0 6px 10px rgba(0, 0, 0, 0.6);
  transition: all 0.2s ease-in-out;

  &:hover {
    background: linear-gradient(to bottom, #2a2a2a, #151515);
    border-color: #666;
    animation: ${flicker} 1.2s ease-in-out infinite;
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 0 4px rgba(255, 153, 51, 0.3), 0 1px 0 #000,
      0 2px 4px rgba(0, 0, 0, 0.6);
  }
`;

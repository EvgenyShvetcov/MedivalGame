import { Link } from "react-router-dom";
import styled, { css, keyframes } from "styled-components";

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
  font-family: "MedievalSharp", serif;
  text-align: center;
  text-shadow: 1px 1px 2px #000;
  cursor: pointer;
  border-radius: 6px;

  ${({ $variant }) =>
    $variant === "iron" &&
    css`
      background: linear-gradient(to bottom, #2a2a2a, #0f0f0f);
      border: 2px solid #555;
      color: #ccc;
      box-shadow: inset 0 0 4px #000, 0 2px 6px rgba(0, 0, 0, 0.7);

      &:hover {
        background: linear-gradient(to bottom, #1e1e1e, #050505);
        border-color: #777;
        box-shadow: 0 0 6px rgba(150, 150, 150, 0.3);
      }
    `}

  ${({ $variant }) =>
    $variant === "stone" &&
    css`
      background: linear-gradient(to bottom, #3c3c3c, #1a1a1a);
      border: 2px solid #444;
      color: #e0e0e0;
      box-shadow: inset 1px 1px 2px #000, 0 4px 4px rgba(0, 0, 0, 0.6);

      &:hover {
        background: linear-gradient(to bottom, #2e2e2e, #121212);
        border-color: #666;
        box-shadow: 0 0 4px rgba(120, 120, 120, 0.2);
      }
    `}

    ${({ $variant }) =>
    $variant === "darkWood" &&
    css`
      background: linear-gradient(to bottom, #3b2e22, #1c120c);
      border: 2px solid #5a4636;
      color: #f3e3c3;
      box-shadow: inset 0 0 3px #000, 0 3px 6px rgba(0, 0, 0, 0.7);

      &:hover {
        background: linear-gradient(to bottom, #2e2218, #0f0a06);
        border-color: #7b6147;
        box-shadow: 0 0 5px rgba(240, 210, 180, 0.3);
      }
    `}

    ${({ $variant }) =>
    $variant === "blackenedSteel" &&
    css`
      background: linear-gradient(to bottom, #1e1e1e, #000);
      border: 2px solid #3a3a3a;
      color: #aaa;
      box-shadow: 0 0 2px #000, 0 4px 4px rgba(0, 0, 0, 0.8);

      &:hover {
        background: linear-gradient(to bottom, #2a2a2a, #080808);
        border-color: #555;
        box-shadow: 0 0 6px rgba(100, 100, 100, 0.2);
      }
    `}
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

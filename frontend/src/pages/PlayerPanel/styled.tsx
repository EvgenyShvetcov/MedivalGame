import styled, { css } from "styled-components";

export const PanelWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0; /* левый край */
  width: 320px;
  height: 100%;
  background: #1a1a1a;
  border-right: 3px solid #444;
  padding: 1.5rem;
  z-index: 1000;

  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  color: #f0f0f0;
  box-shadow: 4px 0 10px rgba(0, 0, 0, 0.5);
`;

export const Title = styled.h2`
  margin-bottom: 1rem;
`;

export const AttributeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
`;

export const Name = styled.span`
  flex: 1;
  color: #f9d57e;
  font-weight: bold;
  text-shadow: 0 0 2px #000;
`;

export const Value = styled.span<{ $highlight?: boolean }>`
  min-width: 30px;
  text-align: right;
  font-weight: bold;
  color: #e8e8e8;
  text-shadow: 0 0 3px #000;

  ${({ $highlight }) =>
    $highlight &&
    css`
      color: #ffd700;
      text-shadow: 0 0 6px #ffcc00;
    `}
`;

export const PlusButton = styled.button`
  padding: 2px 8px;
  font-size: 1rem;
  cursor: pointer;
  background-color: #2d2d2d;
  border: 1px solid #555;
  border-radius: 4px;
  color: white;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  &:hover:enabled {
    background-color: #444;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: transparent;
  color: #fff;
  font-size: 1.2rem;
  border: none;
  cursor: pointer;
`;

export const ExperienceBar = styled.div`
  margin: 1rem 0;
  width: 100%;
  height: 20px;
  background-color: #222;
  border: 1px solid #444;
  border-radius: 10px;
  position: relative;

  div {
    height: 100%;
    background: linear-gradient(to right, #bb8400, #ffaa00);
    border-radius: 10px 0 0 10px;
    transition: width 0.3s ease;
  }

  span {
    position: absolute;
    width: 100%;
    text-align: center;
    font-size: 0.9rem;
    top: 0;
    left: 0;
    color: #fff;
    line-height: 20px;
  }
`;

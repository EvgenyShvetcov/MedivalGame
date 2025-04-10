// styled.ts
import styled from "styled-components";

export const Wrapper = styled.div`
  padding: 40px;
  color: #f0f0f0;
`;

export const ActionsWrapper = styled.div`
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid #555;
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 600px;
  width: 100%;
  color: #fff;
`;

export const Title = styled.h2`
  margin: 0 0 0.5rem;
  font-size: 1.5rem;
`;

export const Description = styled.p`
  font-size: 1rem;
  color: #ccc;
`;

export const DestinationsList = styled.div`
  margin-top: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ActionButton = styled.button`
  background: #3e6bd6;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  font-size: 0.95rem;
  color: white;
  cursor: pointer;

  &:hover {
    background: #2c53b7;
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

export const BackgroundWrapper = styled.div<{ imageUrl?: string }>`
  min-height: 100vh;
  background-image: ${({ imageUrl }) =>
    imageUrl ? `url(${imageUrl})` : "none"};
  background-size: cover;
  background-position: center;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  padding: 2rem;
`;

export const MoveButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border: none;
  border-radius: 6px;
  background: #3e6bd6;
  color: white;
  cursor: pointer;

  &:hover {
    background: #2b4fb0;
  }

  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

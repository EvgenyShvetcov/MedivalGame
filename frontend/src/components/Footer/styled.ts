import styled from "styled-components";

export const FooterWrapper = styled.footer`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 100px;

  background-color: #1e1e1e;

  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;

  padding: 10px;
  border-top: 4px solid #444;

  z-index: 3;

  button {
    padding: 10px 20px;
    background-color: #2f2f2f;
    color: #f8f8f8;
    border: 2px solid #777;
    border-radius: 6px;
    font-weight: bold;
    font-size: 1rem;
    font-family: "Arial", sans-serif;

    cursor: pointer;
    transition: background 0.2s;

    &:hover {
      background-color: #444;
    }
  }
`;

export const PlayerStats = styled.div`
  position: absolute;
  right: 20px;
  bottom: 15px;

  display: flex;
  gap: 20px;

  font-size: 1.1rem;
  color: #f8f8f8;
  font-weight: bold;

  span {
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

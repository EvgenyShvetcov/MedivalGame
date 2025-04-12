import styled from "styled-components";

export const SidebarWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 700px; // 💡 Была 350px
  height: 100vh;
  background-color: #1b1b1b;
  border-right: 4px solid #333;
  padding: 1rem;
  z-index: 10;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 1rem;

  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #f0f0f0;
  }
`;

export const CloseButton = styled.button`
  align-self: flex-end;
  font-size: 1.2rem;
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

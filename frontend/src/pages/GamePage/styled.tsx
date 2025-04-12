import styled from "styled-components";

export const ActionsWrapper = styled.div`
  background: rgba(0, 0, 0, 0.65);
  border: 1px solid #555;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  color: #fff;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const Title = styled.h2`
  margin: 0;
  font-size: 1.8rem;
`;

export const Description = styled.p`
  font-size: 1rem;
  color: #ccc;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const SectionTitle = styled.h4`
  margin: 0;
  font-size: 1.2rem;
  color: #eee;
`;

export const DestinationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

export const ButtonsGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

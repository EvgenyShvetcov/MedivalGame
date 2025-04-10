import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLocationsRequest } from "@/store/location";
import { RootState } from "@/store";
import { Wrapper, Subtitle } from "../styled";
import styled from "styled-components";
import PageLoaderWrapper from "@/components/PageLoaderWrapper/PageLoaderWrapper";

const GamePage: FC = () => {
  const dispatch = useDispatch();

  const {
    data: locations,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.location);

  useEffect(() => {
    dispatch(fetchLocationsRequest());
  }, [dispatch]);

  return (
    <Wrapper>
      <Subtitle>Выберите локацию</Subtitle>

      <PageLoaderWrapper isLoading={isLoading} error={error}>
        <LocationsList>
          {locations.map((loc) => (
            <LocationItem key={loc.id}>
              <h3>{loc.name}</h3>
              <p>{loc.description}</p>
            </LocationItem>
          ))}
        </LocationsList>
      </PageLoaderWrapper>
    </Wrapper>
  );
};

export default GamePage;

const Status = styled.div`
  margin-top: 1rem;
  font-size: 1rem;
  color: #ccc;
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 1rem;
  font-size: 0.9rem;
`;

const LocationsList = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const LocationItem = styled.div`
  padding: 1rem;
  background: #2e2e2e;
  border: 1px solid #444;
  border-radius: 6px;
  color: #f0f0f0;

  h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  p {
    margin-top: 0.5rem;
    font-size: 0.95rem;
    color: #aaa;
  }
`;

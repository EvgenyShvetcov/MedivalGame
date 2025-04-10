import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayerRequest } from "@/store/player";
import { RootState } from "@/store";
import styled from "styled-components";
import PageLoaderWrapper from "@/components/PageLoaderWrapper/PageLoaderWrapper";
import LocationActions from "./LocationActions";

const GamePage: FC = () => {
  const dispatch = useDispatch();

  const {
    data: player,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.player);

  useEffect(() => {
    if (!player) dispatch(fetchPlayerRequest());
  }, [dispatch, player]);

  // 🔥 Формируем абсолютный путь
  const baseBackendUrl = "https://medival-backend.onrender.com";
  const imageUrl = player?.location?.imageUrl
    ? `${baseBackendUrl}${player.location.imageUrl}`
    : undefined;

  return (
    <BackgroundWrapper $imageUrl={imageUrl}>
      <PageLoaderWrapper isLoading={isLoading} error={error}>
        <LocationActions />
      </PageLoaderWrapper>
    </BackgroundWrapper>
  );
};

export default GamePage;

const BackgroundWrapper = styled.div<{ $imageUrl?: string }>`
  min-height: 100vh;
  background: ${({ $imageUrl }) =>
    $imageUrl ? `url(${$imageUrl}) center/cover no-repeat` : "#111"};
  display: flex;
  justify-content: center;
  align-items: start;
  padding: 2rem;
`;

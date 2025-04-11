import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayerRequest } from "@/store/player";
import { RootState } from "@/store";
import styled from "styled-components";
import PageLoaderWrapper from "@/components/PageLoaderWrapper/PageLoaderWrapper";
import LocationActions from "./LocationActions";
import FadeBackground from "@/components/FadeBackground/FadeBackground";

const GamePage: FC = () => {
  const dispatch = useDispatch();
  const [prevImage, setPrevImage] = useState<string | undefined>();

  const {
    data: player,
    isLoading,
    error,
  } = useSelector((state: RootState) => state.player);

  useEffect(() => {
    if (!player) dispatch(fetchPlayerRequest());
  }, [dispatch, player]);

  const baseBackendUrl = "https://medival-backend.onrender.com";
  const imageUrl = player?.location?.imageUrl
    ? `${baseBackendUrl}${player.location.imageUrl}`
    : undefined;

  // если фон изменился — обновляем старое изображение (для кроссфейда)
  useEffect(() => {
    if (imageUrl && imageUrl !== prevImage) {
      setPrevImage(imageUrl);
    }
  }, [imageUrl]);

  return (
    <FadeBackground imageUrl={imageUrl}>
      <PageLoaderWrapper isLoading={isLoading} error={error}>
        <LocationActions />
      </PageLoaderWrapper>
    </FadeBackground>
  );
};

export default GamePage;

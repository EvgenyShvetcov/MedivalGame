import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlayerRequest } from "@/store/player";
import { RootState } from "@/store";
import PageLoaderWrapper from "@/components/PageLoaderWrapper/PageLoaderWrapper";
import LocationActions from "./LocationActions";
import { BackgroundWrapper } from "./styled";

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

  const imageUrl = player?.location?.imageUrl;

  return (
    <BackgroundWrapper imageUrl={imageUrl}>
      <PageLoaderWrapper isLoading={isLoading} error={error}>
        <LocationActions />
      </PageLoaderWrapper>
    </BackgroundWrapper>
  );
};

export default GamePage;

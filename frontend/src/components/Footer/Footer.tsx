import { FC } from "react";
import { FooterWrapper, PlayerStats } from "./styled";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/auth";
import { shouldShowLogout } from "@/utils/common";
import { Button } from "@/components/Button/Button";
import { ROUTES } from "@/routes";

const Footer: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: player } = useSelector((state: RootState) => state.player);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <FooterWrapper>
      <Button onClick={() => navigate(`/player/${player?.id}`)}>
        Персонаж
      </Button>
      <Button onClick={() => navigate("/inventory")}>Инвентарь</Button>
      <Button>Карта</Button>
      <Button>Меню</Button>
      {shouldShowLogout(location.pathname, isAuthenticated) && (
        <Button onClick={handleLogout}>Выйти из игры</Button>
      )}

      {player && (
        <PlayerStats>
          <span>🪙 {player.gold}</span>
          <span>🧪 {player.experience}</span>
        </PlayerStats>
      )}
    </FooterWrapper>
  );
};

export default Footer;

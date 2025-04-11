import { FC, useState } from "react";
import { FooterWrapper, PlayerStats } from "./styled";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/auth";
import { shouldShowLogout } from "@/utils/common";
import { Button } from "@/components/Button/Button";
import { ROUTES } from "@/routes";
import Sidebar from "@/components/Sidebar/Sidebar";
import PlayerPanelContent from "@/pages/PlayerPanel/PlayerPanelContent";

const Footer: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: player } = useSelector((state: RootState) => state.player);

  const [showPanel, setShowPanel] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <FooterWrapper>
        <Button onClick={() => setShowPanel((prev) => !prev)}>Персонаж</Button>
        <Button onClick={() => navigate("/inventory")}>Инвентарь</Button>
        <Button>Карта</Button>
        <Button>Меню</Button>
        {shouldShowLogout(location.pathname, isAuthenticated) && (
          <Button onClick={handleLogout}>Выйти из игры</Button>
        )}

        {player && (
          <PlayerStats>
            <span>🧬 Уровень: {player.level}</span>
            <span>Опыт: {player.experience}</span>
            <span>❤️ {player.health}</span>
            <span>🪙 {player.gold}</span>
          </PlayerStats>
        )}
      </FooterWrapper>

      {showPanel && (
        <Sidebar onClose={() => setShowPanel(false)} title="Персонаж">
          <PlayerPanelContent />
        </Sidebar>
      )}
    </>
  );
};

export default Footer;

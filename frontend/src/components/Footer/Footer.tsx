import { FC, useRef, useState } from "react";
import { FooterWrapper, LeftGroup, RightGroup, PlayerStats } from "./styled";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/store/auth";
import { shouldShowLogout } from "@/utils/common";
import { Button } from "@/components/Button/Button";
import Sidebar from "@/components/Sidebar/Sidebar";
import PlayerPanelContent from "@/pages/PlayerPanel/PlayerPanelContent";
import InventoryPanel from "@/pages/InventoryPanel.tsx/InventoryPanel";

const Footer: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { data: player } = useSelector((state: RootState) => state.player);

  const [showPlayerPanel, setShowPlayerPanel] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const playerButtonRef = useRef<HTMLButtonElement>(null);
  const inventoryButtonRef = useRef<HTMLButtonElement>(null);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <FooterWrapper>
        <LeftGroup>
          {shouldShowLogout(location.pathname, isAuthenticated) && (
            <Button onClick={handleLogout} variant="iron">
              ⬅️ Выйти из игры
            </Button>
          )}
        </LeftGroup>

        <RightGroup>
          <Button
            onClick={() => {
              setShowPlayerPanel((prev) => {
                if (!prev) setShowInventory(false);
                return !prev;
              });
            }}
            variant="iron"
            ref={playerButtonRef}
          >
            🧙 Персонаж
          </Button>

          <Button
            onClick={() => {
              setShowInventory((prev) => {
                if (!prev) setShowPlayerPanel(false);
                return !prev;
              });
            }}
            variant="iron"
            ref={inventoryButtonRef}
          >
            🎒 Инвентарь
          </Button>

          {player && (
            <PlayerStats>
              <span>
                <span className="label">🧬</span>
                {player.level}
              </span>
              <span>
                <span className="label">XP</span>
                {player.experience}
              </span>
              <span>
                <span className="label">❤️</span>
                {player.health}
              </span>
              <span>
                <span className="label">🪙</span>
                {player.gold}
              </span>
            </PlayerStats>
          )}
        </RightGroup>
      </FooterWrapper>

      {showPlayerPanel && (
        <Sidebar
          onClose={() => setShowPlayerPanel(false)}
          title="Персонаж"
          ignoreRef={playerButtonRef}
        >
          <PlayerPanelContent />
        </Sidebar>
      )}

      {showInventory && (
        <Sidebar
          onClose={() => setShowInventory(false)}
          title="Инвентарь"
          ignoreRef={playerButtonRef}
        >
          <InventoryPanel />
        </Sidebar>
      )}
    </>
  );
};

export default Footer;

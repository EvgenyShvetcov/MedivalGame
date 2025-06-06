import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "@/routes";
import HomePage from "@/pages/HomePage/HomePage";
import LoginPage from "@/pages/LoginPage/LoginPage";
import RegisterPage from "@/pages/RegisterPage/RegisterPage";
import GamePage from "@/pages/GamePage/GamePage";
import PlayerProfilePage from "@/pages/PlayerProfilePage/PlayerProfilePage";
import BattlePage from "@/pages/BattlePage/BattlePage";
import WithTopBarLayout from "@/layouts/WithTopBarLayout";
import GameLayout from "@/layouts/GameLayout";
import PrivateRoute from "@/components/PrivateRoute/PrivateRoute";
import { setNavigate } from "./utils/navigation";

const AppRoutes = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate]);

  return (
    <Routes>
      {/* Публичные страницы с TopBar */}
      <Route element={<WithTopBarLayout />}>
        <Route path={ROUTES.home} element={<HomePage />} />
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.register} element={<RegisterPage />} />
      </Route>

      {/* Игровые — без TopBar, но с футером */}
      <Route element={<PrivateRoute />}>
        <Route element={<GameLayout />}>
          <Route path={ROUTES.game} element={<GamePage />} />
          <Route path={ROUTES.battle} element={<BattlePage />} />
          <Route path={ROUTES.playerProfile} element={<PlayerProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;

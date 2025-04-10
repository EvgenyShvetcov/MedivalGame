import { FC } from "react";
import {
  TopBarWrapper,
  Decoration,
  HeaderButton,
  HeaderLinkButton,
} from "./styled";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { logout } from "@/store/auth";
import {
  shouldShowHome,
  shouldShowLogin,
  shouldShowRegister,
  shouldShowLogout,
} from "@/utils/common";

const Header: FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const pathname = location.pathname;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <TopBarWrapper>
      <Decoration />

      {shouldShowHome(pathname) && (
        <HeaderLinkButton as={Link} to="/">
          На главную
        </HeaderLinkButton>
      )}
      {shouldShowLogin(pathname, isAuthenticated) && (
        <HeaderLinkButton as={Link} to="/login">
          Войти
        </HeaderLinkButton>
      )}
      {shouldShowRegister(pathname, isAuthenticated) && (
        <HeaderLinkButton as={Link} to="/register">
          Зарегистрироваться
        </HeaderLinkButton>
      )}
      {shouldShowLogout(pathname, isAuthenticated) && (
        <HeaderButton onClick={handleLogout}>Выйти из игры</HeaderButton>
      )}
    </TopBarWrapper>
  );
};

export default Header;

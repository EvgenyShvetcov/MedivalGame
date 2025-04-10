import { FC, PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";

const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { pathname } = useLocation();

  const isInGame =
    pathname.startsWith("/game") ||
    pathname.includes("/player") ||
    pathname.includes("/battle");

  return (
    <>
      <Header />
      <main>{children}</main>
      {isInGame && <Footer />}
    </>
  );
};

export default Layout;

import { FC } from "react";
import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer/Footer";

const GameLayout: FC = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default GameLayout;

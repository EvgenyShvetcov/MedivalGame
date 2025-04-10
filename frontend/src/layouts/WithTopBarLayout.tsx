import { FC } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "@/components/Header/Header";

const WithTopBarLayout: FC = () => {
  return (
    <>
      <TopBar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default WithTopBarLayout;

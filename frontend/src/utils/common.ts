export const isAuthPage = (pathname: string) =>
  pathname === "/login" || pathname === "/register";

export const shouldShowHome = (pathname: string) => isAuthPage(pathname);

export const shouldShowLogin = (pathname: string, isAuth: boolean) =>
  !isAuth && pathname !== "/login";

export const shouldShowRegister = (pathname: string, isAuth: boolean) =>
  !isAuth && pathname !== "/register";

export const shouldShowLogout = (pathname: string, isAuth: boolean) =>
  isAuth && !isAuthPage(pathname);

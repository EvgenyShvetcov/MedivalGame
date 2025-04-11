let navigate: ((path: string) => void) | null = null;

export const setNavigate = (nav: (path: string) => void) => {
  navigate = nav;
};

export const navigateTo = (path: string) => {
  if (navigate) {
    navigate(path);
  } else {
    console.warn("Навигатор ещё не инициализирован");
  }
};

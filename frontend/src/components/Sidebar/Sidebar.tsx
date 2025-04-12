import { FC, ReactNode, useEffect, useRef } from "react";
import { CloseButton, SidebarWrapper } from "./styled";

interface Props {
  onClose: () => void;
  children: ReactNode;
  title?: string;
  ignoreRef?: React.RefObject<HTMLElement>;
}

const Sidebar: FC<Props> = ({ onClose, children, title, ignoreRef }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      // если клик был по ref кнопке — ничего не делаем
      if (ignoreRef?.current && ignoreRef.current.contains(target)) return;

      if (ref.current && !ref.current.contains(target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <SidebarWrapper ref={ref}>
      <CloseButton onClick={onClose}>✖</CloseButton>
      {title && <h2>{title}</h2>}
      {children}
    </SidebarWrapper>
  );
};

export default Sidebar;

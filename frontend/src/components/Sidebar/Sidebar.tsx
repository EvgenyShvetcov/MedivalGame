import { FC, ReactNode, useEffect, useRef } from "react";
import { CloseButton, SidebarWrapper } from "./styled";

interface Props {
  onClose: () => void;
  children: ReactNode;
  title?: string;
}

const Sidebar: FC<Props> = ({ onClose, children, title }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
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

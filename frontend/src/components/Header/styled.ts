import styled from "styled-components";
import stone from "@/assets/stone.jpg";
import { Button } from "@/components/Button/Button";
import { StyledLinkButton } from "@/components/Button/styled";

export const HeaderLinkButton = styled(StyledLinkButton)`
  position: relative;
  top: 10px;
  margin-left: 12px;
  padding: 6px 14px;
  font-size: 0.85rem;
  z-index: 2;
`;

export const HeaderButton = styled(Button)`
  position: relative;
  top: 10px;
  margin-left: 12px;
  padding: 6px 14px;
  font-size: 0.85rem;
  z-index: 2;
`;

export const TopBarWrapper = styled.header`
  position: absolute;
  width: 100%;
  height: 70px;
  z-index: 2;
`;

export const Decoration = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 70px;
  background-image: url(${stone});
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  pointer-events: none;
  z-index: 1;
  -webkit-mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 75%,
    rgba(0, 0, 0, 0) 100%
  );
  mask-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 1) 70%,
    rgba(0, 0, 0, 0) 100%
  );
`;

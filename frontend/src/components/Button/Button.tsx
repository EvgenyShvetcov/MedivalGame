import React, { ComponentPropsWithoutRef, ElementType } from "react";
import { StyledButton } from "./styled";

type Props<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export const Button = <T extends ElementType = "button">(props: Props<T>) => {
  return <StyledButton {...props} />;
};

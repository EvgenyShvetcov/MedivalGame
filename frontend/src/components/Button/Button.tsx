import React, { ComponentPropsWithoutRef, ElementType } from "react";
import { StyledButton } from "./styled";

type Props<T extends ElementType> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export const Button = <T extends ElementType = "button">({
  as,
  variant = "default",
  ...props
}: Props<T> & { variant?: "default" | "battle" | "location" }) => {
  return <StyledButton as={as} $variant={variant} {...props} />;
};

import React, {
  ComponentPropsWithoutRef,
  ElementType,
  forwardRef,
  Ref,
} from "react";
import { StyledButton } from "./styled";

type Props<T extends ElementType> = {
  as?: T;
  variant?:
    | "default"
    | "battle"
    | "location"
    | "iron"
    | "stone"
    | "blackenedSteel"
    | "darkWood";
} & ComponentPropsWithoutRef<T>;

// Привязка типа ref к HTMLButtonElement
export const Button = forwardRef<HTMLButtonElement, Props<"button">>(
  ({ as, variant = "default", ...props }, ref: Ref<HTMLButtonElement>) => {
    return <StyledButton as={as} $variant={variant} ref={ref} {...props} />;
  }
);

Button.displayName = "Button";

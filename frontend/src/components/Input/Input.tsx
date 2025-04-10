import React from "react";
import { StyledInput } from "./styled";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  return <StyledInput ref={ref} {...props} />;
});

Input.displayName = "Input";

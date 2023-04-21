import styled from "@emotion/styled";
import { HTMLAttributes, ReactNode } from "react";

import { Typography, typography as typographyObject } from "./token";

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | "normal" | "bold" | "bolder" | "lighter";

interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "strong" | "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: number;
  weight?: FontWeight;
  variant?: Typography;
  children: ReactNode;
}

export function Text({
  size = 1,
  weight = "normal",
  color = "black",
  children,
  variant,
  as = "span",
  ...rest
}: TextProps) {
  return (
    <StyledText size={size} weight={weight} color={color} variant={variant} as={as} {...rest}>
      {children}
    </StyledText>
  );
}

type StyleProps = Pick<TextProps, "size" | "weight" | "color" | "variant">;

const StyledText = styled("span")<StyleProps>`
  font-family: ${({ size }) => size}rem;
  font-size: ${({ size }) => size}rem;
  font-weight: ${({ weight }) => weight};
  color: ${({ color }) => color};
  letter-spacing: -0.6px;
  line-height: 100%;
`;

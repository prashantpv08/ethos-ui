import React from 'react';
import { Typography, TypographyProps } from '@mui/material';
import { styled } from '@mui/material/styles';

type Weight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface CustomTypographyProps extends TypographyProps {
  variant:
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'subtitle1'
    | 'subtitle2'
    | 'body1';
  weight?: Weight;
  color?: string;
}

const weightStyles = {
  regular: { fontWeight: 400 },
  medium: { fontWeight: 500 },
  semibold: { fontWeight: 600 },
  bold: { fontWeight: 700 },
};

const variantMapping = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  subtitle1: 'h6',
  subtitle2: 'h6',
  body1: 'p',
};

const StyledTypography = styled(Typography)<CustomTypographyProps>(
  ({ theme, weight, color }) => {
    return {
      ...(weight && weightStyles[weight]),
      color: color || theme.palette.primary.dark,
    };
  }
);

const Heading: React.FC<CustomTypographyProps> = ({
  variant,
  weight = 'regular',
  children,
  color,
  ...props
}) => {
  const Component = variantMapping[variant] as React.ElementType;
  return (
    <StyledTypography
      variant={variant}
      component={Component}
      weight={weight}
      color={color}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};

const Label: React.FC<CustomTypographyProps> = ({
  variant,
  weight = 'regular',
  children,
  color,
  ...props
}) => {
  return (
    <StyledTypography
      variant={variant}
      component="span"
      weight={weight}
      color={color}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};

const Paragraph: React.FC<CustomTypographyProps> = ({
  variant = 'body1',
  weight = 'regular',
  children,
  color,
  ...props
}) => {
  return (
    <StyledTypography
      variant={variant}
      component="p"
      weight={weight}
      color={color}
      {...props}
    >
      {children}
    </StyledTypography>
  );
};

export { Paragraph, Heading, Label };

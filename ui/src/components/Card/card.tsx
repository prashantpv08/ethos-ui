import React from 'react';
import {
  Card as MuiCard,
  CardHeader,
  CardContent,
  styled,
} from '@mui/material';
import { Heading } from '@ethos-frontend/ui';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  button?: React.ReactNode;
}

const StyledCard = styled(MuiCard)(({ theme }) => ({
  boxShadow: '5px 17px 19.2px 0px #00000012',
  border: '1px solid #e6e6e6',
  borderRadius: '12px',
  '& .MuiCardHeader-root': {
    borderBottom: '1px solid #e6e6e6',
    paddingBottom: theme.spacing(2),
  },
}));

const StyledContent = styled(CardContent)(() => ({
  position: 'relative',
}));

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className,
  button,
}) => {
  return (
    <StyledCard className={className}>
      {(title || button) && (
        <CardHeader
          title={
            <Heading variant="h5" component="div" weight="semibold">
              {title}
            </Heading>
          }
          action={button}
        />
      )}
      <StyledContent>{children}</StyledContent>
    </StyledCard>
  );
};

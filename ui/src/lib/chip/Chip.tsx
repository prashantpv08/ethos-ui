import React, { ReactElement } from 'react';
import { Chip as BaseChip, ChipProps, styled } from '@mui/material';
import { Iconbutton } from '../iconButton';

export interface CustomChipProps extends ChipProps {
  label: string;
}

export interface CustomChipWithIconProps extends CustomChipProps {
  onDelete: () => void;
  deleteIcon?: ReactElement;
}

const StyledChip = styled(BaseChip)<ChipProps & { hasDeleteIcon?: boolean }>(
  ({ theme, color, hasDeleteIcon, size }) => ({
    ...theme.typography.body1,
    background: color === 'default' ? '#F2F2F2' : undefined,
    color: color === 'default' ? '#3f3f3f' : undefined,
    borderRadius: '3px',
    padding: size === 'small' ? '2px' : '4px',

    '& .MuiChip-label': {
      padding: hasDeleteIcon
        ? size === 'small'
          ? '0 8px 0 4px'
          : '0 12px 0 6px'
        : size === 'small'
        ? '0 8px'
        : '0 12px',
    },
    '& .MuiButtonBase-root': {
      padding: 0,
      marginRight: 0,
    },
  })
);

const Chip: React.FC<CustomChipProps> = ({
  label,
  color = 'default',
  variant = 'filled',
  size = 'medium',
  ...props
}) => {
  return (
    <StyledChip
      label={label}
      color={color}
      variant={variant}
      size={size}
      {...props}
    />
  );
};

const ChipWithIcon: React.FC<CustomChipWithIconProps> = ({
  label,
  onDelete,
  deleteIcon,
  color = 'default',
  variant = 'filled',
  size = 'medium',
  ...props
}) => {
  return (
    <StyledChip
      label={label}
      deleteIcon={<Iconbutton name="close" iconColor="#7C7C7C" />}
      onDelete={onDelete}
      color={color}
      size={size}
      variant={variant}
      hasDeleteIcon={!!deleteIcon}
      {...props}
    />
  );
};

Chip.displayName = 'Chip';
ChipWithIcon.displayName = 'ChipWithIcon';

export default Chip;
export { ChipWithIcon };

import React from 'react';
import {
  TextareaAutosize as MuiTextarea,
  TextareaAutosizeProps,
  styled,
} from '@mui/material';

import { Label } from '../typography';

const StyledTextarea = styled(MuiTextarea)(({ theme }) => ({
  width: '100%',
  borderRadius: 5,
  borderColor: theme.palette.secondary.light,
  ...theme.typography.subtitle1,
  padding: '14px 16px',
  '&:focus': {
    outline: 'none',
    borderColor: theme.palette.primary.main,
  },
}));

export interface CustomTextareaAutosizeProps extends TextareaAutosizeProps {
  label?: string;
}

const TextareaAutosize: React.FC<CustomTextareaAutosizeProps> = ({
  label,
  ...props
}) => {
  return (
    <div>
      {label && (
        <Label
          variant="subtitle2"
          style={{ marginBottom: 12, display: 'block' }}
        >
          {label}
        </Label>
      )}
      <StyledTextarea {...props} />
    </div>
  );
};

export default TextareaAutosize;

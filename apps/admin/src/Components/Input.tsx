import React from 'react';
import { Box, FormLabel, TextField } from '@mui/material';
import { Controller } from 'react-hook-form';
import CustomPopover from './CustomPopover';
interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  name: string;
  type?: string;
  helperText?: any;
  error?: boolean;
  disabled?: boolean;
  // value?: string | number;
  defaultValue?: string | number;
  variant?: 'outlined' | 'standard' | 'filled' | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onBlur?:
    | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
    | undefined;
  value?: string;
  startAdornment?: React.ReactElement | null;
  endAdornment?: React.ReactElement | null;
  control?: null | any;
  tooltip?: boolean;
  popoverContent?: React.ReactElement | null;
  requiredField?: boolean;
  maxLength?: number | undefined;
  inputProps?: any;
  onKeyPress?: any;
  onKeyUp?: any;
  phone?: boolean;
  getOnChangeValues?: any;
  readOnly?: boolean;
}

const InputField: React.FC<Props> = (props) => {
  const {
    id,
    label,
    placeholder,
    name,
    type,
    helperText,
    error,
    disabled,
    defaultValue,
    variant,
    value,
    startAdornment,
    endAdornment,
    onChange,
    control,
    tooltip,
    popoverContent,
    onKeyDown,
    onPaste,
    requiredField,
    maxLength,
    inputProps,

    onKeyUp,
    phone,
    getOnChangeValues,
    readOnly,
  } = props;

  return (
    <Box>
      <FormLabel className="formLabel">
        {label} {requiredField ? <sup>*</sup> : null}
        {tooltip ? (
          <CustomPopover
            id=""
            children={popoverContent}
            arrow
            anchorOrigin_vertical="top"
            anchorOrigin_horizontal="center"
            transformOrigin_vertical={145}
            transformOrigin_horizonral={202}
          />
        ) : null}
      </FormLabel>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, onBlur, value, ref } }) => (
            <TextField
              id={id}
              size="small"
              name={name}
              type={type}
              helperText={helperText}
              variant={variant}
              error={error}
              placeholder={placeholder}
              disabled={disabled}
              color="primary"
              onChange={(e) => {
                if (maxLength) {
                  if (phone && e.target.value.length > maxLength) {
                    e.preventDefault();
                    return;
                  }
                }

                onChange(e);
                getOnChangeValues && getOnChangeValues(e);
              }}
              value={value || ''}
              inputProps={{
                ...(maxLength && { maxLength: maxLength, pattern: '[0-9]*' }),
                ...(readOnly && { readOnly: readOnly }),
              }}
              fullWidth
              InputProps={{
                startAdornment,
                autoComplete: 'off',
                endAdornment: endAdornment,
              }}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
              onPaste={onPaste}
            />
          )}
        />
      ) : (
        <TextField
          id={id}
          size="small"
          name={name}
          type={type}
          helperText={helperText}
          variant={variant}
          error={error}
          placeholder={placeholder}
          disabled={disabled}
          color="primary"
          onChange={onChange}
          defaultValue={defaultValue}
          value={value}
          fullWidth
          InputProps={
            inputProps
              ? inputProps
              : {
                  startAdornment,
                  autoComplete: 'off',
                  endAdornment: endAdornment,
                }
          }
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
      )}
    </Box>
  );
};

InputField.defaultProps = {
  placeholder: '',
  error: false,
  disabled: false,
  variant: 'outlined',
  type: 'text',
  startAdornment: null,
  endAdornment: null,
};

export default InputField;

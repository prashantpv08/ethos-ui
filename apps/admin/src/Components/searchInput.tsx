import React, { useState } from "react";
import { Box, FormLabel, IconButton, Popover, TextField } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { Error } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CustomPopover from "./CustomPopover";
interface Props {
  id: string;
  label?: string;
  placeholder?: string;
  name: string;
  type?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  // value?: string | number;
  defaultValue?: string | number;
  variant?: "outlined" | "standard" | "filled" | undefined;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: any;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onPaste?: (event: React.ClipboardEvent<HTMLInputElement>) => void;
  onBlur?: any;
  value?: string;
  startAdornment?: React.ReactElement | null;
  endAdornment?: React.ReactElement | null;
  control?: null | any;
  tooltip?: boolean;
  popoverContent?: React.ReactElement | null;
  requiredField?: boolean;
}

const SearchInput: React.FC<Props> = (props) => {
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
    onBlur,
    startAdornment,
    endAdornment,
    onChange,
    onFocus,
    control,
    tooltip,
    popoverContent,
    onKeyDown,
    onPaste,
    requiredField,
  } = props;

  return (
    <Box className="searchInput">
      <FormLabel className="formLabel">
        {label} {requiredField ? <sup>*</sup> : null}
        {tooltip ? (
          <>
            <CustomPopover
              id=""
              children={popoverContent}
              arrow
              anchorOrigin_vertical="top"
              anchorOrigin_horizontal="center"
              transformOrigin_vertical={145}
              transformOrigin_horizonral={202}
            />
          </>
        ) : // <ToolTipComponent title='Your password must meet the following criteria' theme='light' arrow>
        //   <IconButton disableRipple><HelpOutlineOutlinedIcon/></IconButton>
        //    </ToolTipComponent>

        null}
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
              onChange={onChange}
              value={value || ""}
              // value={value || ''}
              // onChange={onChange}
              //   fullWidth
              InputProps={{
                startAdornment,
                autoComplete: "off",
                endAdornment: endAdornment,
              }}
              // ref={ref}
              onKeyDown={onKeyDown}
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
          onFocus={onFocus}
          // value={value || ''}
          onChange={onChange}
          defaultValue={defaultValue}
          value={value}
          fullWidth
          InputProps={{
            startAdornment,
            autoComplete: "off",
            endAdornment: endAdornment,
          }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
        />
      )}
    </Box>
  );
};

SearchInput.defaultProps = {
  placeholder: "",
  error: false,
  disabled: false,
  variant: "outlined",
  type: "text",
  startAdornment: null,
  endAdornment: null,
};

export default SearchInput;

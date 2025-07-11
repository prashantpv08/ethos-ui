// @ts-nocheck
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import React from 'react';
import {
  Autocomplete,
  Box,
  FormHelperText,
  FormLabel,
  TextField,
  createFilterOptions,
} from '@mui/material';
import { Controller } from 'react-hook-form';
import InputCheckbox from './CheckBox';

interface Props {
  id: string;
  labelText?: string;
  placeHolderText?: any;
  name?: string;
  error?: boolean;
  helperText?: any;
  defaultValue?: string | any;
  disabled?: boolean;
  value?: any;
  onChange?: any;
  options: any;
  control?: null | any;
  setValue?: any;
  isError?: boolean;
  isCountryField?: boolean;
  multiple?: boolean;
  isCheckbox?: boolean;
  requiredField?: boolean;
  limit?: number;
  disableClearable?: boolean;
}
export default function AutocompleteSelect(props: Props) {
  const {
    id,
    labelText,
    placeHolderText,
    name = '',
    error,
    helperText,
    defaultValue,
    disabled,
    options,
    control,
    setValue,
    isCountryField = false,
    multiple,
    isCheckbox,
    requiredField,
    limit = 1,
    disableClearable = false,
  } = props;

  const [label, setLabel] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  return (
    <FormControl
      fullWidth
      className="customAutocomplete"
      error={error ? true : false}
    >
      <FormLabel
        className="formLabel"
        style={{ display: labelText ? 'block' : 'none' }}
      >
        {labelText} {requiredField ? <sup>*</sup> : null}{' '}
      </FormLabel>
      {/* {/ <InputLabel >{labelText}</InputLabel> /} */}
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue ? defaultValue : null}
          render={({ field }) => (
            <Autocomplete
              // open={open}
              // onOpen={() => setOpen(true)}
              // onClose={() => setOpen(false)}
              clearIcon
              {...field}
              limitTags={limit}
              disableClearable={disableClearable}
              disableCloseOnSelect={multiple}
              disablePortal
              multiple={multiple}
              id="combo-box-demo"
              size="small"
              // placeholder={placeHolderText}
              getOptionLabel={
                isCountryField
                  ? (option) => (option ? option.name : '')
                  : undefined
              }
              defaultValue={defaultValue}
              renderOption={
                isCountryField
                  ? (props, option) => (
                      <Box
                        key={option.id}
                        component="li"
                        sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
                        {...props}
                      >
                        <img
                          key={option.id}
                          loading="lazy"
                          width="20"
                          srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                          alt=""
                        />
                        {option.name} ({option.code})
                      </Box>
                    )
                  : isCheckbox
                  ? (props, options, { selected }) => (
                      <li {...props}>
                        {isCheckbox ? (
                          <InputCheckbox
                            id={`check_${id}`}
                            name={`check_${name}`}
                            checked={selected}
                          />
                        ) : (
                          ''
                        )}
                        {options}
                      </li>
                    )
                  : undefined
              }
              options={options}
              onChange={(event, newValue: any, reason) => {
                setValue(name, newValue);
              }}
              sx={{ width: '100%' }}
              renderInput={(params) => (
                <TextField
                  placeholder={placeHolderText}
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    type: 'search',
                  }}
                  error={error ? true : false}
                />
              )}
            />
          )}
        />
      ) : (
        <Autocomplete
          // open={open}
          // onOpen={() => setOpen(true)}
          // onClose={() => setOpen(false)}
          clearIcon
          disablePortal
          limitTags={limit}
          disableClearable={disableClearable}
          disableCloseOnSelect={multiple}
          id="combo-box-demo"
          size="small"
          options={options}
          // placeholder={placeHolderText}
          multiple={multiple}
          sx={{ width: '100%' }}
          renderOption={
            isCheckbox
              ? (props, Options: any, { selected }) => (
                  <li {...props}>
                    {isCheckbox ? (
                      <InputCheckbox
                        id={`check_${id}`}
                        name={`check_${name}`}
                        checked={selected}
                      />
                    ) : (
                      ''
                    )}
                    {Options}
                  </li>
                )
              : undefined
          }
          renderInput={(params) => (
            <TextField
              placeholder={placeHolderText}
              {...params}
              error={error ? true : false}
            />
          )}
        />
      )}

      <FormHelperText className={error ? 'Mui-error' : ''}>
        {helperText}
      </FormHelperText>
    </FormControl>
  );
}

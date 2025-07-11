import React from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import {
  Autocomplete,
  Box,
  FormHelperText,
  FormLabel,
  TextField,
  createFilterOptions,
} from "@mui/material";
import { Controller } from "react-hook-form";
import InputCheckbox from "./CheckBox";

interface Props {
  id: string;
  labelText?: string;
  placeHolderText?: string;
  clearIcon?: boolean;
  name?: string;
  error?: any;
  helperText?: any;
  defaultValue?: string | any;
  disabled?: boolean;
  value?: any;
  isCountryField?: boolean;

  onChange?: any;
  options: any;
  control?: null | any;
  setValue?: any;
  isError?: boolean;
  multiple?: boolean;
  isCheckbox?: boolean;
  requiredField?: boolean;
  limit?: number;
  disableClearable?: boolean;
  keyName?: string;
  errors?: any;
  height?: boolean;
}

export default function MUIAutoComplete(props: Props) {
  const {
    id,
    labelText,
    placeHolderText,
    name = "",
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
    keyName = "",
    clearIcon,
    errors,
    height,
  } = props;

  //   console.log("Errors =>", error)
  const [label, setLabel] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  return (
    <FormControl
      fullWidth
      className={height ? "customAutocomplete" : ""}
      error={error ? true : false}
    >
      <FormLabel
        className="formLabel"
        style={{ display: labelText ? "block" : "none" }}
      >
        {labelText} {requiredField ? <sup>*</sup> : null}{" "}
      </FormLabel>
      {/* {/ <InputLabel >{labelText}</InputLabel> /} */}
      {control ? (
        <Controller
          name={name}
          control={control}
          defaultValue={defaultValue ? defaultValue : null}
          render={({ field }) => (
            <Autocomplete
              {...field}
              limitTags={limit}
              disableClearable={true}
              disableCloseOnSelect={true}
              disablePortal
              disabled={disabled}
              multiple={multiple}
              id="combo-box-demo"
              size="small"
              // placeholder={placeHolderText}
              isOptionEqualToValue={(option, value) =>
                option?.[keyName] === value?.[keyName]
              }
              getOptionLabel={(option) => (option ? option?.[keyName] : "")}
              //   defaultValue={defaultValue}
              renderOption={(props, options, { selected }) => {
                return (
                  <li {...props}>
                    <InputCheckbox
                      id={`check_studio`}
                      name={`check_studio`}
                      checked={selected}
                    />

                    {options?.[keyName]}
                  </li>
                );
              }}
              options={options}
              onChange={(event, newValue: any, reason) => {
                setValue(name, newValue);
              }}
              sx={{ width: "100%" }}
              renderInput={(params) => (
                <TextField
                  placeholder={placeHolderText}
                  {...params}
                  InputProps={{
                    ...params.InputProps,
                    type: "search",
                  }}
                  //   error={error ? true : false}
                  error={error ? true : false}
                  //   helperText={errors?.[name] && errors?.[name]?.message}
                />
              )}
            />
          )}
        />
      ) : (
        <Autocomplete
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
          sx={{ width: "100%" }}
          renderOption={
            isCheckbox
              ? (props, options: any, { selected }) => (
                  <li {...props}>
                    {isCheckbox ? (
                      <InputCheckbox
                        id={`check_${id}`}
                        name={`check_${name}`}
                        checked={selected}
                      />
                    ) : (
                      ""
                    )}
                    {options}
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

      <FormHelperText className={error ? "Mui-error" : ""}>
        {error}
      </FormHelperText>
    </FormControl>
  );
}

import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import React from 'react'
import { FormHelperText, FormLabel } from '@mui/material'
import { Controller } from 'react-hook-form'

interface Props {
  id: string
  labelText?: string
  placeHolderText?: string
  name?: string
  error?: boolean
  helperText?: any
  defaultValue?: string
  disabled?: boolean
  value?: any
  onChange?: any
  options: any
  control?: null | any
  isError?: boolean
  requiredField?: boolean
  studioFilter?: boolean
  lableName?: any
}
export default function CustomSelect(props: Props) {
  const {
    id,
    labelText,
    placeHolderText,
    name = '',
    error,
    helperText,
    defaultValue,
    disabled,
    value,
    onChange,
    options,
    control,
    isError,
    requiredField,
    studioFilter,
    lableName,
  } = props

  const [currentValue, setcurrentValue] = React.useState('')
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event)
    setcurrentValue(event.target.value as string)
  }
  const [open, setOpen] = React.useState(true)
  return (
    <FormControl
      fullWidth
      className="customSelect"
      error={error ? true : false}
    >
      <FormLabel className="formLabel">
        {labelText} {requiredField ? <sup>*</sup> : null}{' '}
      </FormLabel>
      {control ? (
        <Controller
          name={name}
          control={control}
          render={({ field }) =>
            field && (
              <Select
                //   open={open}
                // onOpen={() => setOpen(true)}
                // onClose={() => setOpen(false)}
                labelId={id}
                // defaultValue={defaultValue}
                disabled={disabled}
                size="small"
                id="select"
                placeholder={placeHolderText}
                {...field}
                value={field.value}
              >
                {options.map((item: any) => {
                  return <MenuItem key={item} value={item}>{item}</MenuItem>
                })}
              </Select>
            )
          }
        />
      ) : studioFilter ? (
        <Select
          // open={open}
          // onOpen={() => setOpen(true)}
          // onClose={() => setOpen(false)}
          labelId={id}
          id="select"
          size="small"
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeHolderText}
          MenuProps={{
            PaperProps: {
              style: {
                maxHeight: '320px',
              },
            },
          }}
        >
          {options.map((item: any) => {
            return <MenuItem key={item} value={item?._id}>{item?.[lableName]}</MenuItem>
          })}
        </Select>
      ) : (
        <Select
          labelId={id}
          id="select"
          size="small"
          value={value}
          disabled={disabled}
          defaultValue={defaultValue}
          onChange={onChange}
          placeholder={placeHolderText}
        >
          {options.map((item: any) => {
            return <MenuItem value={item}>{item}</MenuItem>
          })}
        </Select>
      )}

      <FormHelperText className={error ? 'Mui-error' : ''}>
        {helperText}
      </FormHelperText>
    </FormControl>
  )
}

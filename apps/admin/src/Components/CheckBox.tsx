import React from 'react'
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
} from '@mui/material'
import { Controller } from 'react-hook-form'
import Images from '../Utils/images'

interface Props {
  id: string
  label?: string
  name: string
  disabled?: boolean
  checked?: boolean
  indeterminate?: boolean
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  control?: null | any
  helperText?: String
  isError?: boolean
  labelColor?: any,
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'dander'
  labelSize?: 'small' | 'medium' | 'large' //14 - 16- 18
}

const InputCheckbox: React.FC<Props> = (props) => {
  const {
    id,
    label,
    name,
    disabled,
    checked,
    indeterminate,
    onChange,
    value,
    control,
    isError,
    helperText,
    labelColor = '#000000',
    color,
    labelSize = 'small'
  } = props
  return (
    <FormGroup>
      <FormControlLabel
        label={<span 
          className={`switchLabel ${labelSize  === 'small' ? 'small' : labelSize  === 'medium' ? 'medium' : 'large' }`}
          style={{
              color: labelColor
          }}
          >{label}</span>}
        id={id}
        name={name}
        className={`checkbox ${isError ? 'checkError' : ''} ${color ? `check_${color}` : ''}`}
        control={
          control ? (
            <Controller
              control={control}
              name={name}
              defaultValue={false}
              render={({ field }) => (
                <Checkbox
                  disableRipple
                  {...field}
                  icon={<img src={isError ? Images.CHECK_RED : Images.CHECK} />}
                  checkedIcon={<img src={Images.CHECK_TICK} />}
                  className={`switchLabel ${labelSize  === 'small' ? 'small' : labelSize  === 'medium' ? 'medium' : 'large' }`}
                />
              )}
            />
          ) : (
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              disabled={disabled}
              onChange={onChange}
              disableRipple
              value={value}
              icon={<img src={isError ? Images.CHECK_RED : Images.CHECK} />}
              checkedIcon={<img src={Images.CHECK_TICK} />}
            />
          )
        }
      >
        {/* <FormHelperText className={isError ? 'Mui-error' : 'Mui-error'}>
          some error
        </FormHelperText> */}
      </FormControlLabel>
      {/* <FormHelperText className={isError ? 'Mui-error' : ''}>
        {helperText}
      </FormHelperText> */}
    </FormGroup>
  )
}

InputCheckbox.defaultProps = {
  disabled: false,
  indeterminate: false,
  label: '',
}

export default InputCheckbox

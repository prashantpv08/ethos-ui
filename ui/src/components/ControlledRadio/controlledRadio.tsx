import React from 'react';
import { Radio } from '../../lib/radio';
import { Controller, FieldValues, Path } from 'react-hook-form';

interface ControlledRadioProps<T extends FieldValues> {
  name: Path<T>;
  control: any;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  align?: 'horizontal' | 'vertical';
  label?: string;
  variant?: 'default' | 'tile';
}

export const ControlledRadio = <T extends FieldValues>({
  name,
  control,
  options,
  label,
  onChange,
  variant = 'default',
  align = 'vertical',
  value,
}: ControlledRadioProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onChange: controllerOnChange, value: controllerValue },
        fieldState: { error },
      }) => (
        <>
          <Radio
            options={options}
            label={label}
            name={name}
            value={value || controllerValue}
            onChange={(event) => {
              controllerOnChange(event);
              if (onChange) {
                onChange(event);
              }
            }}
            variant={variant}
            align={align}
          />
          {error && <p className="error">{error.message}</p>}
        </>
      )}
    />
  );
};

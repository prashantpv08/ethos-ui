import React from 'react';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { Checkbox } from '../../lib/checkbox';

interface ControlledCheckboxProps<T extends FieldValues> {
  name: Path<T>;
  control: any;
  options: { label: string; value: string }[];
  selectedValues: { label: string; value: string }[];
  align?: 'horizontal' | 'vertical';
  label?: string;
  handleChange?: (selectedValues: { label: string; value: string }[]) => void;
}

export const ControlledCheckbox = <T extends FieldValues>({
  name,
  control,
  options,
  selectedValues,
  align = 'vertical',
  label,
  handleChange,
}: ControlledCheckboxProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <>
          <Checkbox
            align={align}
            label={label}
            variant="group"
            selectedValues={selectedValues}
            onGroupChange={(newSelectedValues) => {
              onChange(newSelectedValues);
              if (handleChange) {
                handleChange(newSelectedValues);
              }
            }}
            options={options}
          />
          {error && <p className="error">{error.message}</p>}
        </>
      )}
    />
  );
};

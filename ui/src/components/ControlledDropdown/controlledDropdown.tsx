import { AutoComplete } from '@ethos-frontend/ui';
import {
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  get,
} from 'react-hook-form';

interface ItemProps {
  value: string;
  label: string;
}
interface ControlledDropdownProps<T extends FieldValues> {
  name: Path<T>;
  control: any;
  placeholder: string;
  options: ItemProps[];
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  multiple?: boolean;
  errors?: FieldErrors<T>;
  fullWidth?: boolean;
  disabled?: boolean;
  helperText?: FieldErrors<T>;
  required?: boolean;
  searchDisable?: boolean;
  onOpen?: () => void;
  loading?: boolean;
}

export const ControlledDropdown = <T extends FieldValues>({
  name,
  control,
  placeholder,
  options,
  errors,
  multiple,
  disabled = false,
  fullWidth = true,
  onChange,
  value,
  required = false,
  searchDisable = false,
  onOpen,
  loading,
}: ControlledDropdownProps<T>) => {
  const selectValue = multiple
    ? Array.isArray(value)
      ? value.map(
          (val: string) =>
            options?.find((option) => option.value === val) || null
        )
      : []
    : options?.find((option) => option.value === value) || null;

  const currentError = errors ? get(errors, name) : undefined;
  const errorMessage = currentError ? (currentError?.message as string) : '';

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleChange = (
          _: unknown,
          data: ItemProps | ItemProps[] | null
        ) => {
          if (multiple) {
            const selectedValues = (data as ItemProps[])?.map(
              (item: ItemProps) => item.value
            );
            field.onChange(selectedValues);
            onChange?.(selectedValues);
          } else {
            const newValue = data ? (data as ItemProps).value : '';
            field.onChange(newValue);
            onChange?.(newValue);
          }
        };
        return (
          <AutoComplete
            multiple={multiple}
            label={placeholder}
            fullWidth={fullWidth}
            onChange={handleChange}
            value={selectValue as ItemProps | ItemProps[] | null}
            helperText={errorMessage || ''}
            error={!!currentError}
            disabled={disabled}
            options={options}
            required={required}
            searchDisable={searchDisable}
            onOpen={onOpen}
            loading={loading}
          />
        );
      }}
    />
  );
};

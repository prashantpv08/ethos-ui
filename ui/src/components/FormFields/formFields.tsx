import { FieldErrors, Control } from 'react-hook-form';
import { ControlledInput } from '../ControlledInput';
import { ControlledDropdown } from '../ControlledDropdown';
import { PhoneInputWithCountry } from '../PhoneInputWithCountry';
import { ControlledRadio } from '../ControlledRadio';

export interface FormFieldProps {
  fields: Array<{
    type: string;
    name: string;
    label?: string;
    options?: { value: string; label: string }[];
    required?: boolean;
    value?: string | string[];
    onChange?: (value: string | string[]) => void;
    onPhoneChange?: (value: string, name: string) => void;
    placeholder?: string;
    className?: string;
    searchDisable?: boolean;
    onRadioChange?: (value: string) => void;
    multiple?: boolean;
    inputType?: string;
    multiline?: boolean
  }>;
  control: Control<any>;
  errors: FieldErrors<any>;
}

export const FormFields = ({ fields, control, errors }: FormFieldProps) => {
  return (
    <>
      {fields.map((field, index) => {
        if (field.type === 'input') {
          return (
            <ControlledInput
              key={index}
              type={field.inputType || 'text'}
              name={field.name}
              label={field.label}
              control={control}
              required={field.required}
              errors={errors}
              helperText={errors}
              fullWidth
              multiline={field.multiline}
              rows={5}
            />
          );
        }

        if (field.type === 'dropdown') {
          return (
            <ControlledDropdown
              key={index}
              name={field.name}
              control={control}
              placeholder={field.placeholder as string}
              options={field.options || []}
              required={field.required}
              errors={errors}
              helperText={errors}
              onChange={(e: string | string[]) => field.onChange?.(e)}
              value={field.value}
              searchDisable={field.searchDisable}
              multiple={field.multiple}
            />
          );
        }

        if (field.type === 'phone') {
          return (
            <PhoneInputWithCountry
              key={index}
              name={field.name}
              control={control}
              placeholder={field.placeholder as string}
              error={!!errors[field.name]}
              helperText={errors[field.name]?.message as string}
              onChange={(value) => field.onPhoneChange?.(field.name, value)}
              value={field.value as string}
              dropdownClass={field.className}
            />
          );
        }

        if (field.type === 'radio') {
          return (
            <ControlledRadio
              control={control}
              label={field.label}
              name={field.name}
              align="horizontal"
              onChange={(e) => field.onRadioChange?.(e.target.value)}
              options={field.options || []}
              value={field.value as string}
            />
          );
        }

        return null;
      })}
    </>
  );
};

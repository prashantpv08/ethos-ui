import { Control, FieldErrors, FieldValues, UseFieldArrayAppend } from 'react-hook-form';

/**
 * Represents a single "Extras" group in the form.
 */
export interface ExtraField {
  groupName: string;
  isRequired?: boolean;
  isMultiple?: boolean;
  products: string[];
}

/**
 * Standard option shape for dropdowns, etc.
 */
export interface OptionsProps {
  value: string;
  label: string;
}

/**
 * Basic fields for adding or editing a Product.
 */
export interface ProductBasicFormValues extends FieldValues {
  categoryId: string;
  name: string;
  type: string;
  calory: number;
  code: string;
  characteristicIds: string[];
  taxCode: string;
  price: number;
  discount: number;
  description: string;
  availability: { value: string; label: string }[];
}

/**
 * Basic fields for adding or editing a Combo.
 * Inherits all Product basic fields, plus the combos array.
 */
export interface ComboBasicFormValues extends ProductBasicFormValues {
  combos: Array<{
    type: 'Single' | 'Multiple';
    product?: string;
    comboTitle?: string;
    options?: Array<{ comboProduct: string; comboProductPrice: number }>;
    id?: string;
  }>;
}

/**
 * Full form values for the Product form (includes extras and files).
 */
export interface ProductFormValues extends ProductBasicFormValues {
  files: string[];
  extras: ExtraField[];
}

/**
 * Full form values for the Combo form (includes extras and files).
 */
export interface ComboFormValues extends ComboBasicFormValues {
  files: string[];
  extras: ExtraField[];
}

/** Props used to manage the Combo product selector section */
export interface ComboDetailsProps {
  control: Control<ComboFormValues>;
  productList: OptionsProps[];
  watchCombos: ComboFormValues['combos'];
  comboProducts: Record<number, string[]>;
  singleComboProducts: Record<number, string>;
  append: UseFieldArrayAppend<ComboFormValues, 'combos'>;
  handleComboProductChange: (
    comboIndex: number,
    optionIndex: number,
    value: string
  ) => void;
  handleSingleProductChange: (comboIndex: number, value: string) => void;
  onRemoveCombo: (comboIndex: number) => void;
  errors: FieldErrors<ComboFormValues>;
}

/** Props for the BasicDetails component */
export interface IBasicDetails<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  category: string;
  character: string[];
  tax: string;
  finalPrice: number;
  productType: string;
  handleNextClick: () => void;
  setCategory: (value: string) => void;
  setProductType: (value: string) => void;
  setCharacter: (value: string[]) => void;
  setTax: (value: string) => void;
  combo?: boolean;
  comboDetails?: ComboDetailsProps;
}
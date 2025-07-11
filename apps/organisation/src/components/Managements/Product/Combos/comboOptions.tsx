import { useFieldArray, Control, FieldErrors } from 'react-hook-form';
import { useEffect } from 'react';
import {
  ControlledDropdown,
  ControlledInput,
} from '@ethos-frontend/components';
import { Iconbutton, PrimaryButton } from '@ethos-frontend/ui';
import { Add } from '@mui/icons-material';
import { ComboFormValues } from '../ProductForm/formTypes';
import { useTranslation } from 'react-i18next';

interface ComboOptionsProps {
  control: Control<ComboFormValues>;
  comboIndex: number;
  productList: { value: string; label: string }[];
  comboProducts: Record<number, string[]>;
  handleComboProductChange: (i: number, j: number, v: string) => void;
  errors: FieldErrors<ComboFormValues>;
}

export function ComboOptions({
  control,
  comboIndex,
  productList,
  comboProducts,
  handleComboProductChange,
  errors,
}: ComboOptionsProps) {
  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray<ComboFormValues>({
    control,
    name: `combos.${comboIndex}.options` as const,
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ comboProduct: '', comboProductPrice: 0 });
    }
  }, [fields.length, append]);

  return (
    <>
      {fields.map((opt, optIndex) => {
        return (
          <div className="flex gap-4 w-full" key={opt.id}>
            <ControlledDropdown
              name={
                `combos.${comboIndex}.options.${optIndex}.comboProduct` as const
              }
              control={control}
              options={productList}
              placeholder={t('product.productName')}
              value={comboProducts[comboIndex]?.[optIndex] || ''}
              onChange={(v) =>
                handleComboProductChange(comboIndex, optIndex, v as string)
              }
              errors={errors}
              helperText={errors}
            />
            <ControlledInput
              name={
                `combos.${comboIndex}.options.${optIndex}.comboProductPrice` as const
              }
              control={control}
              type="number"
              label={t('tableData.price')}
              fullWidth
              errors={errors}
              helperText={errors}
            />
            {fields.length > 1 && (
              <Iconbutton
                name="delete"
                iconColor="red"
                onClick={() => remove(optIndex)}
              />
            )}
          </div>
        );
      })}
      <PrimaryButton
        onClick={() => append({ comboProduct: '', comboProductPrice: 0 })}
        variant="outlined"
        size="small"
        startIcon={<Add fontSize="small" />}
      >
        {t('product.addOption')}
      </PrimaryButton>
    </>
  );
}

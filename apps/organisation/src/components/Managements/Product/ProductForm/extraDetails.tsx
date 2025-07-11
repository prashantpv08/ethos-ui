import {
  Iconbutton,
  Paragraph,
  PrimaryButton,
  Switch,
} from '@ethos-frontend/ui';
import {
  ArrayPath,
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  useFieldArray,
  useWatch,
} from 'react-hook-form';
import {
  ControlledDropdown,
  ControlledInput,
} from '@ethos-frontend/components';
import { useDropdownData } from '@ethos-frontend/hook';
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { DeleteGroupConfirmModal } from '../../../Common';
import { useTranslation } from 'react-i18next';

interface ExtraDetailsProps<TFormValues extends FieldValues> {
  control: Control<TFormValues>;
  errors: FieldErrors<TFormValues>;

  isFormChanged: boolean;
  name: ArrayPath<TFormValues>;
  isSubmitting: boolean;
}

export function ExtraDetails<TFormValues extends Record<string, any>>({
  control,
  errors,
  isFormChanged,
  name,
  isSubmitting,
}: ExtraDetailsProps<TFormValues>) {
  const {t} = useTranslation();
  const { id } = useParams();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const { fields, append, remove } = useFieldArray<TFormValues, typeof name>({
    control,
    name,
  });

  const {
    data: extraData,
    isLoading: isExtrasLoading,
    refetch: fetchExtrasData,
  } = useDropdownData(
    'extraDropdown',
    'admin/extra/dropdown',
    (data) =>
      data?.map((val: { _id: string; name: string }) => ({
        value: val._id,
        label: val.name,
      })),
    { enabled: !!id },
  );

  const fetchExtras = () => {
    if (extraData.length === 0) {
      fetchExtrasData();
    }
  };

  const handleDeleteClick = (index: number) => {
    if (id && fields[index]) {
      setDeleteIndex(index);
      setIsDialogOpen(true);
    } else {
      remove(index);
    }
  };

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      remove(deleteIndex);
      setDeleteIndex(null);
    }
    setIsDialogOpen(false);
  };

  const extrasValues = useWatch<TFormValues>({
    control,
    name: `${name}` as any, // will give you the full extras array
  }) as Array<{ products?: string[] }> | undefined;

  return (
    <>
      {fields.map((field, index) => {
        const productsValue = extrasValues?.[index]?.products ?? [];
        return (
          <div key={field.id} className="flex gap-2 pb-4 flex-col">
            <div className="flex justify-between">
              <Paragraph variant="h5">{t('product.group')} {index + 1}</Paragraph>
              <Iconbutton
                name="delete"
                onClick={() => handleDeleteClick(index)}
                iconColor="red"
              />
            </div>
            <hr />
            <div className="flex gap-4">
              <Controller
                name={`extras[${index}].isRequired` as Path<TFormValues>}
                control={control}
                render={({ field }) => (
                  <Switch
                    label={t('product.isRequired')}
                    {...field}
                    checked={field.value}
                  />
                )}
              />
              <Controller
                name={`extras[${index}].isMultiple` as Path<TFormValues>}
                control={control}
                render={({ field }) => (
                  <Switch
                    label={t('product.isMultiSelect')}
                    {...field}
                    checked={field.value}
                  />
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ControlledInput
                type="text"
                name={`extras.${index}.groupName`}
                control={control}
                label={t('product.groupName')}
                helperText={errors}
                errors={errors}
              />
              <ControlledDropdown
                name={`extras.${index}.products`}
                control={control}
                placeholder={t('product.chooseProducts')}
                multiple
                options={extraData}
                value={productsValue || []}
                helperText={errors}
                errors={errors}
                onOpen={fetchExtras}
                loading={isExtrasLoading}
              />
            </div>
          </div>
        );
      })}
      <div className="flex justify-between">
        <PrimaryButton
          onClick={() =>
            append({
              groupName: '',
              isRequired: false,
              isMultiple: false,
              products: [],
            } as any)
          }
        >
          {t('product.addGroup')}
        </PrimaryButton>
        <div>
          <PrimaryButton
            type="submit"
            disabled={!isFormChanged}
            loading={isSubmitting}
          >
            {t('submit')}
          </PrimaryButton>
        </div>
      </div>
      <DeleteGroupConfirmModal
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onDelete={confirmDelete}
        deleteIndex={deleteIndex}
      />
    </>
  );
}

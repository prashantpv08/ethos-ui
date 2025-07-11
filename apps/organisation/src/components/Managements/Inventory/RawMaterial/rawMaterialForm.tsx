import { PrimaryButton, Modal } from '@ethos-frontend/ui';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ERROR_MESSAGES } from '@ethos-frontend/constants';
import { GridContainer, FormFields } from '@ethos-frontend/components';
import { useEffect } from 'react';
import { ISubmitRawMaterial } from './rawMaterial';
import { useTranslation } from 'react-i18next';

interface IRawMaterialForm {
  setIsModalOpen: (val: boolean) => void;
  isModalOpen: boolean;
  selectedRow: ISubmitRawMaterial | null;
  unitListData: { value: string; label: string }[];
  selectedUnit: string;
  onSubmit: (data: any) => void;
  setSelectedRow: (value: ISubmitRawMaterial | null) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  code: Yup.string().required(ERROR_MESSAGES.REQUIRED),
  cost: Yup.number().required(ERROR_MESSAGES.REQUIRED),
  uom: Yup.string(),
  description: Yup.string(),
  status: Yup.string(),
});

export const RawMaterialForm = ({
  setIsModalOpen,
  isModalOpen,
  selectedRow,
  unitListData,
  selectedUnit,
  onSubmit,
  setSelectedRow,
}: IRawMaterialForm) => {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      cost: 0,
      status: 'active',
      uom: '',
    },
  });

  useEffect(() => {
    if (selectedRow) {
      reset({
        code: selectedRow.code,
        name: selectedRow.name,
        description: selectedRow.description,
        uom: selectedRow.uom,
        status: selectedRow.status,
        cost: selectedRow.cost,
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        uom: '',
        cost: 0,
        status: 'active',
      });
    }
  }, [selectedRow, reset, isModalOpen]);

  const fields = [
    { type: 'input', name: 'name', label: t('tableData.name'), required: true },
    { type: 'input', name: 'code', label: t('tableData.code'), required: true },
    {
      type: 'dropdown',
      name: 'uom',
      placeholder: t('tableData.units'),
      options: unitListData,
      value: selectedUnit,
    },
    {
      type: 'input',
      name: 'cost',
      label: t('tableData.price'),
      required: true,
      inputType: 'number',
    },
    {
      type: 'input',
      name: 'description',
      label: t('tableData.description'),
      multiline: true,
    },
  ];

  return (
    <Modal
      open={isModalOpen}
      onClose={() => {
        setIsModalOpen(false);
        setSelectedRow(null);
        reset({
          code: '',
          name: '',
          description: '',
          uom: '',
          cost: 0,
          status: 'active',
        });
      }}
      title={selectedRow ? t('rawMaterial.edit') : t('rawMaterial.add')}
      size="md"
    >
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <GridContainer columns={1}>
          <FormFields fields={fields} control={control} errors={errors} />
          <PrimaryButton className="!ml-auto" type="submit">
            {!selectedRow ? t('rawMaterial.add') : t('rawMaterial.edit')}
          </PrimaryButton>
        </GridContainer>
      </form>
    </Modal>
  );
};

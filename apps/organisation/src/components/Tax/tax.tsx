import styles from './tax.module.scss';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteModal, Header } from '../Common';
import {
  Iconbutton,
  Table,
  PrimaryButton,
  Switch,
  Paragraph,
  Modal,
} from '@ethos-frontend/ui';
import {
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
  getTaxTypes,
  noSpace,
  SUCCESS_TEMPLATES,
} from '@ethos-frontend/constants';
import { FormFieldProps, FormFields } from '@ethos-frontend/components';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { toast } from 'react-toastify';
import { t } from 'i18next';

interface ITax {
  permissions?: string[];
}

interface ITaxDetail {
  _id: string;
  description: string;
  code: string;
  value: number;
  elementDetails: { code: string }[];
  status: string;
  element?: string[];
}

const validationSchema = Yup.object().shape({
  code: Yup.string()
    .matches(noSpace, t(ERROR_MESSAGES.NO_SPACES_ALLOWED))
    .required(t(ERROR_MESSAGES.REQUIRED)),
  selectTaxMethod: Yup.string(),
  status: Yup.string(),
  description: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  element: Yup.array().when('selectTaxMethod', (selectTaxMethod, schema) => {
    if (selectTaxMethod && selectTaxMethod[0] === '2') {
      return schema.of(Yup.string().required(t(ERROR_MESSAGES.REQUIRED)));
    }
    return schema;
  }),

  // Conditional validation for value field
  value: Yup.number().when('selectTaxMethod', (selectTaxMethod, schema) => {
    if (selectTaxMethod && selectTaxMethod[0] === '1') {
      return schema.required(t(ERROR_MESSAGES.REQUIRED));
    }
    return schema;
  }),
});

export const Tax = ({ permissions }: ITax) => {
  const [taxData, setTaxData] = useState<Record<string, unknown>[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [taxList, setTaxList] = useState<{ value: string; label: string }[]>(
    [],
  );
  const [selectedTax, setSelectedTax] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [value, setValue] = useState('1');
  const [search, setSearch] = useState('');
  const [selectedElements, setSelectedElements] = useState<string[]>([]);

  const sortBy = sortUser[0]?.field;
  const sortOrder = sortUser[0]?.sort === 'asc' ? 1 : -1;

  const { isLoading, refetch } = useRestQuery(
    ['fetch-tax-list', { sortBy, sortOrder, search, page }],
    `${API_URL.tax}?${
      sortBy ? `sortBy=${sortBy}` : ''
    }&sortOrder=${sortOrder}&limit=${page.limit}&pageNo=${page.pageNo}${
      search ? `&searchKey=${search}` : ''
    }`,
    {
      onSuccess: (data) => {
        const taxData = data.data;
        setTotalItems(taxData?.totalItems);
        const categoryRes = taxData?.data?.map((val: ITaxDetail, i: number) => {
          return {
            id: val._id,
            description: val.description,
            code: val.code,
            value: val.value,
            element: val?.elementDetails,
            status: val.status,
          };
        });

        setTaxData(categoryRes);
      },
      onError: () => {
        toast.error(t('errors.general'));
      },
    },
  );

  useRestQuery('taxDropdown', API_URL.taxElements, {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      const data = res.data;
      const taxData = data?.map((val: { _id: string; code: string }) => {
        return {
          value: val._id,
          label: val.code,
        };
      });
      setTaxList(taxData);
    },
  });

  const addTaxMutation = useRestMutation(
    API_URL.tax,
    { method: API_METHODS.POST },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success(SUCCESS_TEMPLATES.added(t('tax.tax')));
        refetch();
      },
    },
  );

  const { mutateAsync } = useRestMutation(`${API_URL.tax}/${selectedTax}`, {
    method: API_METHODS.PATCH,
  });

  const deleteMutation = useRestMutation(
    `${API_URL.tax}/${selectedTax}`,
    { method: API_METHODS.DELETE },
    {
      onSuccess: () => {
        setIsDeleteOpen(false);
        toast.success(SUCCESS_TEMPLATES.deleted(setSelectedTax?.name));
        refetch();
      },
    },
  );

  const handleActions = (
    category: { id: string; element: { _id: string }[]; status: string },
    key: string,
  ) => {
    if (!category) return;
    setSelectedTax(category.id);
    if (key === 'edit') {
      const element = category.element?.map((detail) => detail._id) || [];
      setSelectedElements(element);
      setValue(element.length > 0 ? '2' : '1');
      reset({ ...category, element });
      setIsModalOpen(true);
    } else if (key === 'delete') {
      setIsDeleteOpen(true);
    }
  };

  const handleStatusChange = useCallback(
    (row: Record<string, unknown>) => {
      setSelectedTax(row.id as string);
      const newStatus = row.status === 'active' ? 'deleted' : 'active';
      mutateAsync({ id: row.id, status: newStatus }).then(() => {
        toast.success(
          SUCCESS_TEMPLATES.status(
            (row?.code as string) ?? '',
            newStatus === 'deleted' ? t('inactive') : t('active'),
          ),
        );

        refetch();
      });
    },
    [mutateAsync],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      code: '',
      value: 0,
      element: [],
      description: '',
      status: 'active',
      selectTaxMethod: '1',
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const body = {
      code: data.code,
      description: data.description,
      value: data.value,
      element: data.element,
    };
    if (value === '1') {
      delete body.element;
    }

    if (selectedTax) {
      mutateAsync(body).then(() => {
        setIsDeleteOpen(false);
        toast.success(SUCCESS_TEMPLATES.updated(t('tax.tax')));
        refetch();
      });
    } else {
      addTaxMutation.mutate(body);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const handleDeleteTax = () => {
    deleteMutation.mutate(undefined);
  };

  const handleElementSelection = (value: string | string[]) => {
    if (Array.isArray(value)) {
      setSelectedElements(value);
    }
  };

  const taxTypes = getTaxTypes();
  const fields: FormFieldProps['fields'] = [
    {
      type: 'input',
      name: 'code',
      label: t('tableData.code'),
      required: true,
    },
    {
      type: 'input',
      name: 'description',
      label: t('tableData.description'),
      required: true,
    },
    ...(taxList.length > 1
      ? [
          {
            type: 'radio',
            name: 'selectTaxMethod',
            options: taxTypes,
            label: t('tax.selectTaxType'),
            onRadioChange: (value: string) => setValue(value),
            value: value,
          },
        ]
      : []),
    ...(value === '2'
      ? [
          {
            type: 'dropdown',
            name: 'element',
            options: taxList,
            placeholder: t('tax.element'),
            multiple: true,
            value: selectedElements,
            onChange: handleElementSelection,
          },
        ]
      : []),
    ...(value === '1'
      ? [
          {
            type: 'input',
            inputType: 'number',
            name: 'value',
            label: t('tax.value'),
          },
        ]
      : []),
  ];

  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.code'),
        field: 'code',
        flex: 1,
      },
      {
        headerName: t('tableData.description'),
        field: 'description',
        flex: 1,
      },
      {
        headerName: t('tax.element'),
        field: 'element',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <div>
              {params.row?.element?.map((val: { code: string }) => (
                <Paragraph className="pb-2" variant="subtitle2">
                  {val.code}
                </Paragraph>
              ))}
            </div>
          );
        },
      },
      {
        headerName: t('tax.value'),
        field: 'value',
        flex: 1,
      },
      {
        headerName: t('tableData.status'),
        field: 'status',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row;
          return (
            <Switch
              checked={row.status === 'active'}
              onChange={() => handleStatusChange(row)}
            />
          );
        },
      },
      {
        headerName: t('tableData.action'),
        field: 'action',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const category = params.row;
          return (
            <div className={styles.action}>
              <Iconbutton
                name="edit"
                disabled={!permissions?.includes('edit')}
                onClick={() => handleActions(category, 'edit')}
              />

              <Iconbutton
                name="delete"
                iconColor="red"
                disabled={!permissions?.includes('delete')}
                onClick={() => handleActions(category, 'delete')}
              />
            </div>
          );
        },
      },
    ],
    [permissions, handleActions, handleStatusChange],
  );

  return (
    <>
      <Header
        title={t('tax.title')}
        onClick={() => {
          setSelectedTax('');
          reset({
            code: '',
            value: 0,
            element: [],
            description: '',
          });
          setIsModalOpen(true);
        }}
        buttonText={t('tax.addTax')}
        handleChange={handleChange}
        permission={!permissions?.includes('add')}
      />
      <Table
        columns={columns}
        rows={taxData}
        page={page.pageNo - 1}
        pageSize={page.limit}
        onPageChange={(page) =>
          setPage((prev) => ({ ...prev, pageNo: page + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setPage((prev) => ({ ...prev, limit: pageSize }))
        }
        rowCount={totalItems}
        loading={isLoading}
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />

      <Modal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setValue('1');
        }}
        size="md"
        title={selectedTax ? t('tax.editTax') : t('tax.addTax')}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid gap-5"
        >
          <FormFields fields={fields} control={control} errors={errors} />
          <PrimaryButton type="submit">{t('submit')}</PrimaryButton>
        </form>
      </Modal>
      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={handleDeleteTax}
      />
    </>
  );
};

import { useState, useMemo, useCallback } from 'react';
import {
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
  noSpace,
  productType,
  SUCCESS_TEMPLATES,
} from '@ethos-frontend/constants';
import {
  Iconbutton,
  Modal,
  PrimaryButton,
  Switch,
  Table,
} from '@ethos-frontend/ui';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { toast } from 'react-toastify';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import { DeleteModal, Header } from '../../../Common';
import { FormFieldProps, FormFields } from '@ethos-frontend/components';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { t } from 'i18next';
import { useForm } from 'react-hook-form';

interface ModifierProps {
  permissions?: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  code: Yup.string()
    .matches(noSpace, t(ERROR_MESSAGES.NO_SPACES_ALLOWED))
    .required(t(ERROR_MESSAGES.REQUIRED)),
  price: Yup.number()
    .required(t(ERROR_MESSAGES.REQUIRED))
    .typeError(t(ERROR_MESSAGES.REQUIRED)),
  type: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
});

export const Modifier = ({ permissions }: ModifierProps) => {
  const [search, setSearch] = useState('');
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryData, setCategoryData] = useState<Record<string, unknown>[]>(
    [],
  );
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState({ limit: 10, pageNo: 1 });
  const [selectedCategory, setSelectedCategory] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const getProductType = productType();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      type: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const { refetch, isLoading } = useRestQuery(
    ['fetch-extra-list', page, sortUser, search],
    `${API_URL.extra}?pageNo=${page.pageNo}&limit=${page.limit}${
      sortUser[0]?.field ? `&sortBy=${sortUser[0]?.field}` : ''
    }&sortOrder=${sortUser[0]?.sort === 'asc' ? 1 : -1}${
      search ? `&searchKey=${search}` : ''
    }`,
    {
      onSuccess: (res) => {
        setIsDeleteOpen(false);
        const data = res.data;
        setTotalItems(data.totalItems);
        const categoryRes = data.data?.map(
          (val: Record<string, unknown>, i: number) => {
            return {
              id: val._id,
              name: val.name,
              code: val.code,
              status: val.status,
              price: val.price,
              type: val.type,
            };
          },
        );
        setCategoryData(categoryRes);
      },
    },
  );

  const { mutate } = useRestMutation(
    `${API_URL.extra}/${selectedCategory?.id}`,
    { method: API_METHODS.DELETE },
    {
      onSuccess: () => {
        toast.success(SUCCESS_TEMPLATES.deleted(`${selectedCategory?.name}`));
        refetch();
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  const { mutate: addExtra } = useRestMutation(
    API_URL.extra,
    { method: API_METHODS.POST },
    {
      onSuccess: (res) => {
        toast.success(SUCCESS_TEMPLATES.added(`${res.data?.code}`));
        refetch();
        setIsModalOpen(false);
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  const handleActions = (category: Record<string, unknown>, key: string) => {
    if (key === 'edit') {
      const editCategory = {
        ...category,
      };
      setSelectedCategory(editCategory);
      reset(editCategory);
      setIsModalOpen(true);
    }
    if (key === 'delete') {
      setIsDeleteOpen(true);
      setSelectedCategory(category);
    }
  };

  const { mutateAsync } = useRestMutation(
    `${API_URL.extra}/${selectedCategory?.id}`,
    { method: API_METHODS.PATCH },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        refetch();
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  const handleStatusChange = useCallback(
    (row: Record<string, unknown>) => {
      const newStatus = row.status === 'active' ? 'deleted' : 'active';
      mutateAsync({ id: row.id, status: newStatus }).then(() => {
        toast.success(
          SUCCESS_TEMPLATES.status(
            (row?.name as string) ?? '',
            newStatus === 'deleted' ? t('inactive') : t('active'),
          ),
        );
      });
    },
    [mutateAsync],
  );

  const columns = useMemo(
    () => [
      {
        headerName: t('modifier.title'),
        field: 'name',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: t('tableData.code'),
        field: 'code',
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: t('tableData.price'),
        field: 'price',
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: t('tableData.type'),
        field: 'type',
        flex: 1,
        minWidth: 100,
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
              onChange={() => {
                handleStatusChange(row);
              }}
            />
          );
        },
      },
      {
        headerName: t('tableData.action'),
        field: 'action',
        flex: 1,
        minWidth: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const category = params.row;
          return (
            <div className="flex gap-2">
              <Iconbutton
                name="edit"
                disabled={!permissions?.includes('edit')}
                onClick={() => handleActions(category, 'edit')}
              />
              <Iconbutton
                disabled={!permissions?.includes('delete')}
                onClick={() => handleActions(category, 'delete')}
                name="delete"
                iconColor="red"
              />
            </div>
          );
        },
      },
    ],
    [handleStatusChange],
  );

  const debouncedHandleChange = (e: any) => {
    setSearch(e.target.value);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const onDeleteHandler = () => {
    if (selectedCategory) {
      mutate(undefined);
    }
  };

  const onSubmit = async (data: {
    name: string;
    code: string;
    price: number;
    type: string;
  }) => {
    const body = {
      name: data.name,
      code: data.code,
      price: data.price,
      type: data.type,
      url: ['']
    };
    if (selectedCategory) {
      mutateAsync(body).then(() => {
        toast.success(SUCCESS_TEMPLATES.updated(`${selectedCategory?.name}`));
      });
    } else {
      addExtra(body);
    }
  };

  const fields: FormFieldProps['fields'] = [
    {
      type: 'input',
      name: 'name',
      label: t('tableData.name'),
      required: true,
    },
    {
      type: 'input',
      name: 'code',
      label: t('tableData.code'),
      required: true,
    },
    {
      type: 'dropdown',
      name: 'type',
      options: getProductType,
      placeholder: t('tableData.type'),
      value: selectedCategory?.type as string,
    },
    {
      type: 'input',
      name: 'price',
      label: t('tableData.price'),
      required: true,
    },
  ];

  return (
    <>
      <Header
        title={t('modifier.title')}
        onClick={() => {
          setSelectedCategory(null);
          reset({
            code: '',
            name: '',
            type: '',
            price: 0
          });
          setIsModalOpen(true);
        }}
        handleChange={debouncedHandleChange}
        buttonText={t('modifier.add')}
        permission={!permissions?.includes('add')}
      />
      <Table
        rows={categoryData}
        columns={columns}
        loading={isLoading}
        page={page.pageNo - 1}
        pageSize={page.limit}
        onPageChange={(newPage) =>
          setPage((prev) => ({ ...prev, pageNo: newPage + 1 }))
        }
        onPageSizeChange={(newPageSize) =>
          setPage((prev) => ({ ...prev, limit: newPageSize }))
        }
        rowCount={totalItems}
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedCategory ? t('modifier.edit') : t('modifier.add')}
        size="md"
      >
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <FormFields fields={fields} control={control} errors={errors} />
          <div className="flex gap-4 ml-auto">
            <PrimaryButton
              variant="outlined"
              onClick={() => setIsModalOpen(false)}
            >
              {t('cancel')}
            </PrimaryButton>
            <PrimaryButton type="submit">{t('submit')}</PrimaryButton>
          </div>
        </form>
      </Modal>

      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={onDeleteHandler}
      />
    </>
  );
};

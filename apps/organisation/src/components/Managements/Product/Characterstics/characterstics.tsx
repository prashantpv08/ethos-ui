import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteModal, Header } from '../../../Common';
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
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import {
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
  SUCCESS_TEMPLATES,
} from '@ethos-frontend/constants';
import {
  FormFieldProps,
  FormFields,
} from '@ethos-frontend/components';
import { toast } from 'react-toastify';
import { t } from 'i18next';

const validationSchema = Yup.object().shape({
  name: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  code: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
});

interface ICharaterstics {
  permissions?: string[];
}

export const Characterstics = ({ permissions }: ICharaterstics) => {
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [categoryData, setCategoryData] = useState<Record<string, unknown>[]>(
    [],
  );
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const {
    isLoading: loading,
    refetch,
    data,
  } = useRestQuery(
    ['fetch-characterstics', page, search, sortUser],
    `${API_URL.characteristic}?pageNo=${page.pageNo}&limit=${page.limit}${
      search ? `&searchKey=${search}` : ''
    }${sortUser[0]?.field ? `&sortBy=${sortUser[0]?.field}` : ''}&sortOrder=${
      sortUser[0]?.sort === 'asc' ? 1 : -1
    }`,
    {
      onSuccess: (res) => {
        const characteristicData = res.data;
        setTotalItems(characteristicData.totalItems);
        const categoryRes = characteristicData?.data?.map(
          (val: Record<string, unknown>, i: number) => {
            return {
              id: val._id,
              name: val.name,
              code: val.code,
              status: val.status,
            };
          },
        );
        setCategoryData(categoryRes);
      },
    },
  );

  const { mutate } = useRestMutation(
    API_URL.characteristic,
    { method: API_METHODS.POST },
    {
      onSuccess: (res) => {
        setIsModalOpen(false);
        refetch();
        toast.success(SUCCESS_TEMPLATES.added(`${res.data?.name}`));
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  const { mutateAsync: updateCategory } = useRestMutation(
    `${API_URL.characteristic}/${selectedCategory?.id}`,
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

  const { mutate: deleteCategory } = useRestMutation(
    `${API_URL.characteristic}/${selectedCategory?.id}`,
    { method: API_METHODS.DELETE },
    {
      onSuccess: () => {
        refetch();
        setIsDeleteModal(false);
        toast.success(SUCCESS_TEMPLATES.deleted(`${selectedCategory?.name}`));
      },
      onError: (err) => {
        if (
          (err?.response?.data as Record<string, unknown>)?.message ===
          'Characteristic in use'
        ) {
          toast.error(t(ERROR_MESSAGES.IN_USE));
          setIsDeleteModal(false);
        } else {
          toast.error(t(ERROR_MESSAGES.GENERAL));
        }
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
      setIsDeleteModal(true);
      setSelectedCategory(category);
    }
  };

  const handleStatusChange = useCallback(
    (row: Record<string, unknown>) => {
      const newStatus = row.status === 'active' ? 'deleted' : 'active';
      updateCategory({ id: row.id, status: newStatus }).then(() => {
        toast.success(
          SUCCESS_TEMPLATES.status(
            (row?.name as string) ?? '',
            newStatus === 'deleted' ? t('inactive') : t('active'),
          ),
        );
      });
    },
    [selectedCategory],
  );

  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.category'),
        field: 'name',
        flex: 1,
      },
      {
        headerName: t('tableData.code'),
        field: 'code',
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
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const category = params.row;
          return (
            <div className='flex'>
              <Iconbutton
                name="edit"
                onClick={() => handleActions(category, 'edit')}
                disabled={!permissions?.includes('edit')}
              />

              <Iconbutton
                name="delete"
                iconColor="red"
                onClick={() => handleActions(category, 'delete')}
                disabled={!permissions?.includes('delete')}
              />
            </div>
          );
        },
      },
    ],
    [handleActions, data],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const body: {
      name: unknown;
      code: unknown;
      status?: string;
    } = {
      name: data.name,
      code: data.code,
    };

    if (selectedCategory) {
      updateCategory(body).then(() => {
        toast.success(SUCCESS_TEMPLATES.updated(`${selectedCategory?.name}`));
      });
    } else {
      mutate(body);
    }
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const fields: FormFieldProps['fields'] = [
    {
      type: 'input',
      name: 'name',
      label: t('categoryName'),
      required: true,
    },
    {
      type: 'input',
      name: 'code',
      label: t('tableData.code'),
      required: true,
    },
  ];

  return (
    <div>
      <Header
        title={t('characteristics.title')}
        permission={!permissions?.includes('add')}
        onClick={() => {
          setSelectedCategory(null);
          reset({
            code: '',
            name: '',
          });
          setIsModalOpen(true);
        }}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        buttonText={t('characteristics.add')}
      />
      <Table
        columns={columns}
        rows={categoryData}
        rowCount={totalItems}
        loading={loading}
        page={page.pageNo - 1}
        pageSize={page.limit}
        onPageChange={(page) =>
          setPage((prev) => ({ ...prev, pageNo: page + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setPage((prev) => ({ ...prev, limit: pageSize }))
        }
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          selectedCategory
            ? t('characteristics.edit')
            : t('characteristics.add')
        }
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
        open={isDeleteModal}
        onClose={() => setIsDeleteModal(false)}
        onSubmit={() => deleteCategory(undefined)}
      />
    </div>
  );
};

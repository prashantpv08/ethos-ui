import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react';
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
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
  noSpace,
  productCategoryType,
  SUCCESS_TEMPLATES,
} from '@ethos-frontend/constants';
import {
  GridContainer,
  FormFields,
  FormFieldProps,
} from '@ethos-frontend/components';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import {
  GridRenderCellParams,
  GridRowOrderChangeParams,
} from '@mui/x-data-grid-premium';
import { toast } from 'react-toastify';
import { t } from 'i18next';

interface ICategory {
  permissions?: string[];
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  code: Yup.string()
    .matches(noSpace, t(ERROR_MESSAGES.NO_SPACES_ALLOWED))
    .required(ERROR_MESSAGES.REQUIRED),
  categoryType: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  status: Yup.string(),
});

export const Category = ({ permissions }: ICategory) => {
  const [categoryData, setCategoryData] = useState<Record<string, unknown>[]>(
    [],
  );
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [selectedCategory, setSelectedCategory] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const getProductType = productCategoryType();

  const { data, isLoading, refetch } = useRestQuery(
    ['fetch-category', page, search],
    `${API_URL.category}?pageNo=${page.pageNo}&limit=${page.limit}${
      search ? `&searchKey=${search}` : ''
    }`,
  );

  useEffect(() => {
    if (data?.data?.data) {
      setIsModalOpen(false);
      setIsDeleteOpen(false);
      setTotalItems(data.data.totalItems);
      const categoryRes = data.data.data
        .map(
          (val: {
            _id: string;
            name: string;
            code: string;
            category_type: string;
            status: string;
            order: number;
          }) => ({
            id: val._id,
            name: val.name,
            code: val.code,
            category_type:
              val.category_type === 'default' ? t('single') : t('combo'),
            status: val.status,
            order: val.order,
          }),
        )
        .sort(
          (a: { order: number }, b: { order: number }) => a.order - b.order,
        );

      setCategoryData(categoryRes);
    }
  }, [data]);

  const { mutate } = useRestMutation(
    API_URL.category,
    { method: API_METHODS.POST },
    {
      onSuccess: (res) => {
        toast.success(SUCCESS_TEMPLATES.added(`${res.data?.name}`));
        refetch();
      },
      onError: (err) => {
        if (err.status === 400) {
          toast.error(err?.message);
        } else {
          toast.error(t(ERROR_MESSAGES.GENERAL));
        }
      },
    },
  );

  const { mutateAsync: updateCategory } = useRestMutation(
    `${API_URL.categoryUpdate}/${selectedCategory?.id}`,
    { method: API_METHODS.PATCH },
    {
      onSuccess: () => {
        toast.success(SUCCESS_TEMPLATES.updated(`${selectedCategory?.name}`));
        refetch();
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  const { mutate: deleteCategory } = useRestMutation(
    `${API_URL.category}/${selectedCategory?.id}`,
    { method: API_METHODS.DELETE },
    {
      onSuccess: () => {
        toast.success(SUCCESS_TEMPLATES.deleted(`${selectedCategory?.name}`));
        refetch();
      },
      onError: (err) => {
        if (err.status !== 409) {
          toast.error(t(ERROR_MESSAGES.GENERAL));
        }
      },
    },
  );

  const handleActions = (category: Record<string, unknown>, key: string) => {
    if (key === 'edit') {
      const editCategory = {
        ...category,
        status: category.status === 'Active' ? 'active' : 'blocked',
        categoryType: category.category_type === 'Single' ? 'default' : 'combo',
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
        refetch();
      });
    },
    [updateCategory],
  );

  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.category'),
        field: 'name',
        flex: 1,
        sortable: false,
      },
      {
        headerName: t('tableData.code'),
        field: 'code',
        flex: 1,
        sortable: false,
      },
      {
        headerName: t('tableData.categoryType'),
        field: 'category_type',
        flex: 1,
        sortable: false,
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
        sortable: false,
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const category = params.row;
          return (
            <div className="flex">
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
    [data],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: {
    name: string;
    code: string;
    categoryType: string;
  }) => {
    const body: {
      name: string;
      code: string;
      category_type: string;
    } = {
      name: data.name,
      code: data.code,
      category_type: data.categoryType,
    };

    if (selectedCategory) {
      updateCategory(body);
    } else {
      mutate(body);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleRowOrderChange = async (params: GridRowOrderChangeParams) => {
    setSelectedCategory(params.row);
    const reorderedRows = {
      id: params.row.id,
      order: params.targetIndex + 1,
    };

    updateCategory({ ...reorderedRows }).then(() => {
      toast.success(SUCCESS_TEMPLATES.updated(`${selectedCategory?.name}`));
      refetch();
    });
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
      name: 'categoryType',
      options: getProductType,
      placeholder: t('tableData.categoryType'),
      value: selectedCategory?.categoryType as string,
    },
  ];

  return (
    <>
      <Header
        title={t('category.title')}
        onClick={() => {
          setSelectedCategory(null);
          reset({
            code: '',
            name: '',
            status: '',
            categoryType: '',
          });
          setIsModalOpen(true);
        }}
        handleChange={handleChange}
        buttonText={t('category.add')}
        permission={!permissions?.includes('add')}
      />
      <Table
        columns={columns}
        rows={categoryData}
        rowCount={totalItems}
        loading={isLoading}
        page={page.pageNo - 1}
        rowReordering
        onRowOrderChange={handleRowOrderChange}
        pageSize={page.limit}
        onPageChange={(page) =>
          setPage((prev) => ({ ...prev, pageNo: page + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setPage((prev) => ({ ...prev, limit: pageSize }))
        }
      />

      <Modal
        open={isModalOpen}
        title={selectedCategory ? t('category.edit') : t('category.add')}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <GridContainer columns={1}>
            <FormFields fields={fields} control={control} errors={errors} />
            <div className="ml-auto">
              <PrimaryButton
                disabled={selectedCategory ? !isDirty : false}
                type="submit"
              >
                {t('submit')}
              </PrimaryButton>
            </div>
          </GridContainer>
        </form>
      </Modal>
      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={() => deleteCategory(undefined)}
      />
    </>
  );
};

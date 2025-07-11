import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Header } from '../../../../components/Common';
import { Iconbutton, Modal, PrimaryButton, Table } from '@ethos-frontend/ui';
import {
  API_METHODS,
  API_URL,
  SUCCESS_TEMPLATES,
} from '@ethos-frontend/constants';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRODUCT_LIST } from '@organisation/api/queries/ProductManagement';
import { ControlledDropdown } from '@ethos-frontend/components';
import { DeleteModal } from '../../../Common';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { OptionsProps } from '../ProductForm/formTypes';

const validationSchema = Yup.object().shape({
  complementoryProduct: Yup.array().of(Yup.string()),
});

interface IComplementaryProduct {
  permissions?: string[];
}

export const ComplementaryProduct = ({
  permissions,
}: IComplementaryProduct) => {
  const { t } = useTranslation();
  const [productList, setProductList] = useState<Record<string, unknown>[]>([]);
  const [productOptions, setProductOptions] = useState<OptionsProps[]>([]);
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState<any>(0);
  const [selectedCategory, setSelectedCategory] = useState<Record<
    string,
    unknown
  > | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);

  useQuery(GET_ALL_PRODUCT_LIST, {
    onCompleted: (res) => {
      const data = res.dropdown.data.map((ele: any) => ({
        label: ele.name,
        value: ele._id,
      }));
      setProductOptions(data);
    },
  });

  const { isLoading, refetch, data } = useRestQuery(
    ['fetch-product', search, sortUser],
    `${API_URL.complementaryList}?${
      search ? `&searchKey=${search}` : ''
    }&sortBy=${sortUser[0]?.field}&sortOrder=${
      sortUser[0]?.sort === 'asc' ? 1 : -1
    }`,
  );

  useEffect(() => {
    if (data) {
      const responseData = data.data?.map((val: any, i: number) => {
        return {
          id: val._id,
          name: val.name,
        };
      });
      setProductList(responseData);
    }
  }, [data]);

  const { mutate: updateCategory } = useRestMutation(
    API_URL.complementary,
    { method: API_METHODS.PATCH },
    {
      onSuccess: () => {
        refetch();
        setIsModalOpen(false);
        toast.success(SUCCESS_TEMPLATES.added(t('complementary.title')));
      },
    },
  );

  const { mutate: deleteCategory } = useRestMutation(
    `${API_URL.complementary}/${selectedCategory?.id}`,
    { method: API_METHODS.DELETE },
    {
      onSuccess: () => {
        refetch();
        setIsDeleteOpen(false);
        toast.success(
          SUCCESS_TEMPLATES.deleted(selectedCategory?.name as string),
        );
      },
    },
  );

  const handleActions = (category: Record<string, unknown>) => {
    setIsDeleteOpen(true);
    setSelectedCategory(category);
  };

  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.name'),
        field: 'name',
        flex: 1,
      },
      {
        headerName: t('tableData.action'),
        field: 'action',
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const category = params.row;
          return (
            <Iconbutton
              name="delete"
              iconColor="red"
              onClick={() => handleActions(category)}
              disabled={!permissions?.includes('delete')}
            />
          );
        },
      },
    ],
    [],
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (data: any) => {
    updateCategory({
      ids: data.complementoryProduct,
    });
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };
  return (
    <>
      <Header
        title={t('complementary.title')}
        onClick={() => {
          setSelectedCategory(null);
          setIsModalOpen(true);
        }}
        handleChange={(e: ChangeEvent<HTMLInputElement>) =>
          setSearch(e.target.value)
        }
        permission={!permissions?.includes('add')}
        buttonText={t('complementary.add')}
      />
      <Table
        columns={columns}
        rows={productList}
        rowCount={totalItems}
        loading={isLoading}
        hideFooter
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('complementary.add')}
        size="md"
      >
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4"
        >
          <ControlledDropdown
            name="complementoryProduct"
            control={control}
            multiple
            placeholder={t('complementary.title')}
            options={productOptions}
            errors={errors}
            helperText={errors}
          />
          <div className="ml-auto">
            <PrimaryButton type="submit">{t('submit')}</PrimaryButton>
          </div>
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

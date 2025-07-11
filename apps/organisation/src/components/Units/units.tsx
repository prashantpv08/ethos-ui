import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { DeleteModal, Header } from '../Common';
import { Iconbutton, Modal, PrimaryButton, Table } from '@ethos-frontend/ui';
import { ERROR_MESSAGES, SUCCESS_TEMPLATES } from '@ethos-frontend/constants';
import { useMutation, useQuery } from '@apollo/client';
import { ControlledInput, GridContainer } from '@ethos-frontend/components';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { GET_UNITS_LIST } from '@organisation/api/queries/Units';
import {
  ADD_UNTIS,
  DELETE_UNITS,
  UPDATE_UNITS,
} from '@organisation/api/mutations/Units';
import { toast } from 'react-toastify';
import { t } from 'i18next';

interface IUnits {
  permissions?: string[];
}

const validationSchema = Yup.object().shape({
  description: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  code: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
});

export const Units = ({ permissions }: IUnits) => {
  const [categoryData, setCategoryData] = useState<Record<string, unknown>[]>(
    [],
  );
  const [totalItems, setTotalItems] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Record<
    string,
    unknown
  > | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { loading, data } = useQuery(GET_UNITS_LIST, {
    variables: {
      params: {
        pageNo: page.pageNo,
        limit: page.limit,
        searchKey: searchKey,
        sortBy: sortUser[0]?.field,
        sortOrder: sortUser[0]?.sort === 'asc' ? 1 : -1,
      },
    },
  });

  useEffect(() => {
    if (data) {
      setIsModalOpen(false);
      setIsDeleteOpen(false);
      setTotalItems(data.uoms.totalItems);
      const uomList = data.uoms.data;
      const categoryRes = uomList?.map(
        (val: Record<string, unknown>, i: number) => {
          return {
            id: val._id,
            description: val.description,
            code: val.code,
          };
        },
      );
      setCategoryData(categoryRes);
    }
  }, [data]);

  const [addUnits] = useMutation(ADD_UNTIS, {
    onCompleted: () => {
      setIsModalOpen(false);
      toast.success(SUCCESS_TEMPLATES.added('Units'));
    },
    refetchQueries: [GET_UNITS_LIST],
  });

  const [updateUnits] = useMutation(UPDATE_UNITS, {
    onCompleted: () => {
      setIsModalOpen(false);
      toast.success(SUCCESS_TEMPLATES.updated(`${selectedCategory?.code}`));
    },
    refetchQueries: [GET_UNITS_LIST],
  });

  const [deleteUnits] = useMutation(DELETE_UNITS, {
    onCompleted: () => {
      setIsDeleteOpen(false);
      toast.success(SUCCESS_TEMPLATES.deleted(`${selectedCategory?.code}`));
    },
    refetchQueries: [GET_UNITS_LIST],
  });

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
        headerName: t('tableData.action'),
        field: 'action',
        flex: 1,
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
    [],
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
      description: unknown;
      code: unknown;
    } = {
      description: data.description,
      code: data.code,
    };

    if (selectedCategory) {
      updateUnits({
        variables: { data: { ...body, id: selectedCategory.id } },
      });
    } else {
      addUnits({ variables: { data: body } });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    setPage({ limit: 10, pageNo: 1 });
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  return (
    <div>
      <Header
        title={t('units.title')}
        onClick={() => {
          setSelectedCategory(null);
          reset({
            code: '',
            description: '',
          });
          setIsModalOpen(true);
        }}
        buttonText={t('units.add')}
        handleChange={handleChange}
        permission={!permissions?.includes('add')}
      />
      <Table
        columns={columns}
        rows={categoryData}
        rowCount={totalItems}
        page={page.pageNo - 1}
        pageSize={page.limit}
        onPageChange={(page) =>
          setPage((prev) => ({ ...prev, pageNo: page + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setPage((prev) => ({ ...prev, limit: pageSize }))
        }
        loading={loading}
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />

      <Modal
        title={selectedCategory ? t('units.edit') : t('units.add')}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="md"
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <GridContainer columns={1}>
            <ControlledInput
              type="text"
              name="code"
              control={control}
              required
              label={t('tableData.code')}
              errors={errors}
              helperText={errors}
              fullWidth
            />
            <ControlledInput
              type="text"
              name="description"
              control={control}
              required
              label={t('tableData.name')}
              errors={errors}
              helperText={errors}
              fullWidth
            />
            <div className="ml-auto">
              <PrimaryButton type="submit">{t('submit')}</PrimaryButton>
            </div>
          </GridContainer>
        </form>
      </Modal>

      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={() =>
          deleteUnits({ variables: { id: selectedCategory?.id } })
        }
      />
    </div>
  );
};

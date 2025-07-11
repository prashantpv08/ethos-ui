import { DeleteModal, Header } from '../../../Common';
import styles from '../ProductMaster/productManagement.module.scss';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_COMBOS_LIST } from '../../../../api/queries/ProductManagement';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ChevronRight } from '@mui/icons-material';
import { Iconbutton, Label, Link, Switch, Table } from '@ethos-frontend/ui';
import { useNavigate } from 'react-router-dom';
import {
  DELETE_COMBO_PRODUCT,
  UPDATE_COMBO_PRODUCT,
} from '../../../../api/mutations/ProductManagement';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { toast } from 'react-toastify';
import { ERROR_MESSAGES, SUCCESS_TEMPLATES } from '@ethos-frontend/constants';
import { useTranslation } from 'react-i18next';

interface ComboProps {
  permissions?: string[];
}

export const Combos = ({permissions}: ComboProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [comboProductData, setComboProductData] = useState<
    Record<string, unknown>[]
  >([]);
  const [searchKey, setSearchKey] = useState<string>('');
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [totalItems, setTotalItems] = useState(0);
  const [sortUser, setSortUser] = useState<GridSortItem[]>([
    { field: 'firstName', sort: 'asc' },
  ]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<Record<string, unknown>>();

  const handleActions = (category: Record<string, unknown>, key: string) => {
    if (key === 'edit') {
      navigate(`/combos/edit/${category.id}`);
    }
    if (key === 'delete') {
      if (key === 'delete') {
        setDeleteModal(true);
        setSelectedRecord(category);
      }
    }
  };

  const [getProducts, { data }] = useLazyQuery(GET_COMBOS_LIST, {
    variables: {
      params: {
        searchKey: searchKey,
        limit: page.limit,
        pageNo: page.pageNo,
        sortBy: sortUser[0]?.field,
        sortOrder: sortUser[0]?.sort === 'asc' ? 1 : -1,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const [deleteProduct] = useMutation(DELETE_COMBO_PRODUCT, {
    onCompleted: () => {
      toast.success(SUCCESS_TEMPLATES.deleted(`${selectedRecord?.name}`));
      setDeleteModal(false);
    },
    refetchQueries: [GET_COMBOS_LIST],
    onError: () => {
      toast.error(t(ERROR_MESSAGES.GENERAL));
    },
  });

  const [updateProduct] = useMutation(UPDATE_COMBO_PRODUCT);

  const handleStatusChange = (row: Record<string, unknown>) => {
    const newStatus = row.status === 'active' ? 'blocked' : 'active';
    updateProduct({
      variables: {
        updateCombo: { id: row.id, status: newStatus },
      },
    }).then(() => {
      toast.success(
        SUCCESS_TEMPLATES.status(
          (row?.name as string) ?? '',
          newStatus === 'blocked' ? t('inactive') : t('active'),
        ),
      );
    });
  };

  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.code'),
        field: 'code',
        flex: 1,
        minWidth: 100,
      },
      {
        headerName: t('products'),
        field: 'name',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams) => {
          const product = params.row;
          return (
            <div className={styles.productName}>
              <img src={(product?.img as string[])[0]} alt="Product" />
              <Label variant="subtitle2">
                <Link to={`/combos/${product.id}`}>
                  {product?.name as string}
                </Link>
              </Label>
            </div>
          );
        },
      },

      {
        headerName: t('tableData.price'),
        field: 'price',
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
        minWidth: 150,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => (
          <div className={styles.action}>
            <Iconbutton
              name="edit"
              onClick={() => handleActions(params.row, 'edit')}
              disabled={!permissions?.includes('edit')}
            />

            <Iconbutton
              name="delete"
              iconColor="red"
              onClick={() => handleActions(params.row, 'delete')}
              disabled={!permissions?.includes('delete')}
            />

            <Iconbutton
              MuiIcon={ChevronRight}
              onClick={() => navigate(`/product/${params.row.id}`)}
            />
          </div>
        ),
      },
    ],
    [],
  );

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (data) {
      const responseData = data?.combos?.data?.map(
        (val: Record<string, unknown>) => {
          return {
            id: val._id,
            code: val.code,
            name: val.name,
            price: val.comboPrice,
            status: val.status,
            availability: val.availability,
            description: val.description,
            discount: val.discount,
            type: val.type,
            img: val.imgUrl,
          };
        },
      );
      setTotalItems(data?.combos?.totalItems);
      setComboProductData(responseData);
    }
  }, [data]);

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    setPage({ limit: 10, pageNo: 1 });
  };

  const onDeleteHandler = () => {
    if (selectedRecord) {
      deleteProduct({ variables: { deleteComboId: selectedRecord?.id } });
    }
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  return (
    <>
      <Header
        title={t('product.productCombo')}
        buttonText={t('product.addCombo')}
        onClick={() => navigate('/combos/add')}
        handleChange={onSearchHandler}
        permission={!permissions?.includes('add')}
      />
      <Table
        rows={comboProductData}
        columns={columns}
        page={page.pageNo - 1}
        pageSize={page.limit}
        onPageChange={(page) =>
          setPage((prev) => ({ ...prev, pageNo: page + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setPage((prev) => ({ ...prev, limit: pageSize }))
        }
        rowCount={totalItems}
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />

      <DeleteModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        onSubmit={onDeleteHandler}
      />
    </>
  );
};

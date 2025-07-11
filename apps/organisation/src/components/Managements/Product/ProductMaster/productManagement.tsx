import { DeleteModal, Header } from '../../../Common';
import styles from './productManagement.module.scss';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_PRODUCT_LIST } from '@organisation/api/queries/ProductManagement';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { ChevronRight } from '@mui/icons-material';
import { Iconbutton, Label, Link, Switch, Table } from '@ethos-frontend/ui';
import { ProductModalProps } from '../Product.modal';
import { useNavigate } from 'react-router-dom';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { toast } from 'react-toastify';
import {
  DELETE_PRODUCT,
  UPDATE_PRODUCT,
} from '@organisation/api/mutations/ProductManagement';
import { useTranslation } from 'react-i18next';
import { ERROR_MESSAGES, SUCCESS_TEMPLATES } from '@ethos-frontend/constants';

interface IProduct {
  permissions?: string[];
}

export const ProductManagement = ({ permissions }: IProduct) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [productData, setProductData] = useState<Record<string, unknown>[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchKey, setSearchKey] = useState<string>('');
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [sortUser, setSortUser] = useState<GridSortItem[]>([
    { field: 'name', sort: 'asc' },
  ]);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedRecord, setSelectedRecord] =
    useState<Record<string, unknown>>();

  const handleActions = (category: Record<string, unknown>, key: string) => {
    if (key === 'edit') {
      navigate(`/product/edit/${category.id}`);
    }
    if (key === 'delete') {
      setDeleteModal(true);
      setSelectedRecord(category);
    }
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
                <Link to={`/product/${product.id}`}>
                  {product?.name as string}
                </Link>
              </Label>
            </div>
          );
        },
      },
      {
        headerName: t('tableData.category'),
        field: 'categoryName',
        flex: 1,
        minWidth: 150,
      },
      {
        headerName: t('tableData.calories'),
        field: 'calory',
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

  const [getProducts, { data, loading }] = useLazyQuery(GET_PRODUCT_LIST, {
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

  const [deleteProduct] = useMutation(DELETE_PRODUCT, {
    onCompleted: () => {
      toast.success(SUCCESS_TEMPLATES.added(selectedRecord?.name as string));
      setDeleteModal(false);
    },
    refetchQueries: [GET_PRODUCT_LIST],
    onError: () => {
      toast.error(t(ERROR_MESSAGES.GENERAL));
    },
  });

  const [updateProduct] = useMutation(UPDATE_PRODUCT);

  const handleStatusChange = (row: Record<string, unknown>) => {
    const newStatus = row.status === 'active' ? 'blocked' : 'active';
    updateProduct({
      variables: {
        data: { id: row.id, status: newStatus },
      },
    }).then(() => {
      setProductData((prevData) =>
        prevData.map((product) =>
          product.id === row.id ? { ...product, status: newStatus } : product,
        ),
      );
      toast.success(
        SUCCESS_TEMPLATES.status(
          (row?.code as string) ?? '',
          newStatus === 'blocked' ? t('inactive') : t('active'),
        ),
      );
    });
  };

  useEffect(() => {
    getProducts();
  }, [getProducts]);

  useEffect(() => {
    if (data) {
      const responseData = data?.products?.data?.map(
        (val: ProductModalProps) => {
          return {
            id: val._id,
            code: val.code,
            name: val.name,
            categoryName: val.categoryDetail?.name,
            calory: val.calory,
            price: val.price,
            // status: 'Active',
            availability: val.availability,
            description: val.description,
            discount: val.discount,
            type: val.type,
            img: val.imgUrl,
            status: val.status,
          };
        },
      );
      setTotalItems(data?.products?.totalItems);
      setProductData(responseData);
    }
  }, [data]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    setPage({ limit: 10, pageNo: 1 });
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const onDeleteHandler = () => {
    if (selectedRecord) {
      deleteProduct({ variables: { deleteProductId: selectedRecord?.id } });
    }
  };

  return (
    <>
      <Header
        title={t('product.title')}
        buttonText={t('product.addProduct')}
        onClick={() => navigate('/product/add')}
        handleChange={handleChange}
        permission={!permissions?.includes('add')}
      />
      <Table
        rows={productData}
        loading={loading}
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

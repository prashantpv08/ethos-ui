import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { Iconbutton, Switch, Table } from '@ethos-frontend/ui';
import { Header } from '../Common/Header';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import {
  API_METHODS,
  API_URL,
  getTransactionStatus,
  SUCCESS_TEMPLATES,
} from '@ethos-frontend/constants';
import { DeleteModal } from '../Common';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { TransactionFormModal } from './transactionFormModal';

interface ITransaction {
  permissions?: string[];
}

export interface TransactionRecord {
  id: string;
  name: string;
  code: string;
  description: string;
  transaction_status: string;
  status?: 'active' | 'deleted';
}

export const Transaction = ({ permissions }: ITransaction) => {
  const { t } = useTranslation();
  const transactionStatus = getTransactionStatus();
  const [transactionCode, setTransactionCode] = useState<
    Record<string, unknown>[]
  >([]);
  const [search, setSearch] = useState('');
  const [totalItems, setTotalItems] = useState(0);
  const [selectedRecord, setSelectedRecord] =
    useState<TransactionRecord | null>(null);

  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddSuccess, setIsAddSuccess] = useState(false);
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });

  const { isLoading: loading, refetch } = useRestQuery(
    ['fetch-codes', page, search, sortUser],
    `${API_URL.transactionCode}?pageNo=${page.pageNo}&limit=${page.limit}${
      search ? `&searchKey=${search}` : ''
    }${sortUser[0]?.field ? `&sortBy=${sortUser[0]?.field}` : ''}&sortOrder=${
      sortUser[0]?.sort === 'asc' ? 1 : -1
    }`,
    {
      onSuccess: (resp) => {
        setIsModalOpen(false);
        setIsDeleteOpen(false);
        const data = resp.data.data;
        setTotalItems(resp.data.totalItems);
        const transactionCodeResp = data?.map(
          (val: Record<string, unknown>, i: number) => {
            return {
              id: val._id,
              name: val.name,
              description: val.description,
              code: val.code,
              transaction_status: val.transaction_status,
              status: val.status,
            };
          },
        );
        setTransactionCode(transactionCodeResp);
      },
    },
  );

  const mutation = useRestMutation(
    API_URL.transactionCode,
    { method: API_METHODS.POST },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success(
          SUCCESS_TEMPLATES.added(t('transactionCode.transactionCode')),
        );
        setIsAddSuccess(true);
        refetch();
      },
      onError: () => {
        setIsModalOpen(true);
      },
    },
  );

  const updateTransactionMutation = useRestMutation(
    `${API_URL.transactionCode}/${selectedRecord?.id}`,
    { method: API_METHODS.PATCH },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        refetch();
      },
      onError: () => {
        setIsModalOpen(true);
      },
    },
  );

  const deleteMutation = useRestMutation(
    `${API_URL.transactionCode}/${selectedRecord?.id}`,
    { method: API_METHODS.DELETE },
    {
      onSuccess: () => {
        toast.success(SUCCESS_TEMPLATES.deleted(`${selectedRecord?.name}`));
        refetch();
      },
    },
  );

  const handleActions = (category: TransactionRecord, key: string) => {
    if (key === 'edit') {
      setSelectedRecord(category);
      setIsModalOpen(true);
    }
    if (key === 'delete') {
      setIsDeleteOpen(true);
      setSelectedRecord(category);
    }
  };

  const handleStatusChange = useCallback(
    (row: Record<string, unknown>) => {
      const newStatus = row.status === 'active' ? 'deleted' : 'active';
      updateTransactionMutation
        .mutateAsync({ id: row.id, status: newStatus })
        .then(() => {
          toast.success(
            SUCCESS_TEMPLATES.status(
              (row?.name as string) ?? '',
              newStatus === 'deleted' ? t('inactive') : t('active'),
            ),
          );
          return;
        });
    },
    [updateTransactionMutation],
  );

  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.name'),
        field: 'name',
        flex: 1,
        sortable: true,
      },
      {
        headerName: t('tableData.code'),
        field: 'code',
        flex: 1,
        sortable: true,
      },
      {
        headerName: t('tableData.description'),
        field: 'description',
        flex: 1,
        sortable: true,
      },
      {
        headerName: t('tableData.transactionStatus'),
        field: 'transaction_status',
        flex: 1,
        sortable: true,
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

  const onSubmit = (data: Omit<TransactionRecord, 'id'>) => {
    const body: {
      name: unknown;
      code: unknown;
      description: unknown;
      transaction_status: unknown;
      status?: string;
    } = {
      name: data.name,
      code: data.code,
      description: data.description,
      transaction_status: data.transaction_status,
    };

    if (selectedRecord) {
      updateTransactionMutation.mutateAsync(body).then(() => {
        toast.success(SUCCESS_TEMPLATES.updated(`${selectedRecord?.name}`));
      });
    } else {
      mutation.mutate(body);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  return (
    <>
      <Header
        title={t('transactionCode.title')}
        onClick={() => {
          setSelectedRecord(null);
          setIsModalOpen(true);
        }}
        buttonText={t('transactionCode.add')}
        handleChange={handleChange}
        permission={!permissions?.includes('add')}
      />

      <Table
        columns={columns}
        rows={transactionCode}
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

      <TransactionFormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmit}
        initialData={selectedRecord ?? undefined}
        transactionStatusOptions={transactionStatus}
        title={
          selectedRecord ? t('transactionCode.edit') : t('transactionCode.add')
        }
        isAddSuccess={isAddSuccess}
      />
      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={() => deleteMutation.mutate(undefined)}
      />
    </>
  );
};

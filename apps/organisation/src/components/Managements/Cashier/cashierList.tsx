import {
  AutoComplete,
  Paragraph,
  PrimaryButton,
  Table,
} from '@ethos-frontend/ui';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { GET_EMPLOYEE_LIST } from '../../../api/queries/UserManagement';
import { useQuery } from '@apollo/client';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { Header } from '../../Common';

import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getStatus } from '@ethos-frontend/constants';

interface ICashierUserList {
  _id: string;
  status: string;
  firstName: string;
  lastName: string;
}

export const Cashier = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const getUserStatus = getStatus();
  const [statusFilter, setStatusFilter] = useState({
    value: 'active',
    label: t('active'),
  });

  const columns = useMemo(
    () => [
      {
        field: 'firstName',
        headerName: t('tableData.firstName'),
        flex: 1,
        minWidth: 150,
        sortable: true,
      },
      {
        field: 'lastName',
        headerName: t('tableData.lastName'),
        flex: 1,
        minWidth: 150,
        sortable: true,
      },
      {
        field: 'status',
        headerName: t('tableData.status'),
        flex: 1,
        minWidth: 100,
        sortable: true,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Paragraph variant="h5">
              {params.row.status === 'active' ? t('active') : t('inactive')}
            </Paragraph>
          );
        },
      },
      {
        field: 'cashierReport',
        headerName: t('tableData.cashierReport'),
        flex: 1,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <PrimaryButton
              onClick={() =>
                navigate(
                  `/cashier-report/user/${params.row.id}/name/${params?.row?.firstName}`,
                )
              }
              variant="text"
            >
              {t('cashier.viewReport')}
            </PrimaryButton>
          );
        },
      },
    ],
    [],
  );

  const [userList, setUserList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [sortUser, setSortUser] = useState<GridSortItem[]>([
    { field: 'firstName', sort: 'asc' },
  ]);

  const { loading, data, refetch } = useQuery(GET_EMPLOYEE_LIST, {
    variables: {
      params: {
        limit: page.limit,
        pageNo: page.pageNo,
        searchKey: searchKey,
        sortBy: sortUser[0]?.field,
        sortOrder: sortUser[0]?.sort === 'asc' ? 1 : -1,
        status: statusFilter?.value,
      },
    },
  });

  useEffect(() => {
    if (data) {
      const userListData = data.employees.data.map((val: ICashierUserList) => ({
        id: val._id,
        status: val.status,
        firstName: val.firstName,
        lastName: val.lastName,
      }));
      setUserList(userListData);
      setTotalItems(data.employees.totalItems);
    }
  }, [data]);

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    setPage({ limit: 10, pageNo: 1 });
  };

  const handleStatusFilterChange = (_e: any, value: any) => {
    if (value) {
      setStatusFilter(value);
      setPage({ limit: 10, pageNo: 1 });
      refetch();
    }
  };

  return (
    <>
      <Header title={t('cashier.title')} handleChange={onSearchHandler}>
        <div className="w-2/12">
          <AutoComplete
            options={getUserStatus}
            value={statusFilter}
            onChange={handleStatusFilterChange}
            label={t('cashier.filterByStatus')}
            fullWidth
          />
        </div>
      </Header>
      <Table
        columns={columns}
        rows={userList}
        page={page.pageNo - 1}
        pageSize={page.limit}
        onPageChange={(page) =>
          setPage((prev) => ({ ...prev, pageNo: page + 1 }))
        }
        onPageSizeChange={(pageSize) =>
          setPage((prev) => ({ ...prev, limit: pageSize }))
        }
        rowCount={totalItems}
        loading={loading}
        sortModel={sortUser}
        onSortModelChange={handleSortModelChange}
      />
    </>
  );
};

import { useMutation, useQuery } from '@apollo/client';
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { GET_EMPLOYEE_LIST } from '@organisation/api/queries/UserManagement';
import {
  AutoComplete,
  Iconbutton,
  Label,
  Modal,
  PrimaryButton,
  Switch,
  Table,
} from '@ethos-frontend/ui';
import { Header } from '../Common';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { UserForm } from './userForm';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  API_METHODS,
  EMPLOYEE_API_URL,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@ethos-frontend/constants';
import { toast } from 'react-toastify';
import { UPDATE_USER } from '../../api/mutations/UserManagement';
import { useRestMutation } from '@ethos-frontend/hook';
import { t } from 'i18next';

export interface ITableUserData {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  access: { module: string; pages: string[] }[];
  id: string;
}

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  lastName: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  email: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  status: Yup.boolean(),
  access: Yup.array()
    .transform(function (value, originalValue) {
      if (typeof originalValue === 'object' && !Array.isArray(originalValue)) {
        return Object.keys(originalValue).map((module) => ({
          module: module,
          pages: originalValue[module].map((page: string) =>
            page.replace(/"/g, ''),
          ),
        }));
      }
      return value;
    })
    .of(
      Yup.object().shape({
        module: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
        pages: Yup.array()
          .of(Yup.string().required())
          .min(1)
          .required(t(ERROR_MESSAGES.REQUIRED)),
      }),
    )
    .min(1, t(ERROR_MESSAGES.AT_LEAST_ONE))
    .required(t(ERROR_MESSAGES.REQUIRED)),
});

export const UserList = () => {
  const [userList, setUserList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [searchKey, setSearchKey] = useState('');
  const [statusFilter, setStatusFilter] = useState({
    value: 'active',
    label: t('active'),
  });
  const [userFormModal, setUserFormModal] = useState(false);
  const [editForm, setEditForm] = useState(false);
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [sortUser, setSortUser] = useState<GridSortItem[]>([
    { field: 'firstName', sort: 'asc' },
  ]);

  const [selectedModules, setSelectedModules] = useState<{
    [key: string]: string[];
  }>({});

  const { mutate } = useRestMutation(
    EMPLOYEE_API_URL.resetPassword,
    { method: API_METHODS.PATCH },
    {
      onSuccess: () => {
        toast.success(t(SUCCESS_MESSAGES.EMPLOYEE_NEW_PASSWORD));
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

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
        minWidth: 100,
        sortable: true,
      },
      {
        field: 'email',
        headerName: t('tableData.email'),
        flex: 1,
        minWidth: 150,
        sortable: true,
      },

      {
        field: 'status',
        headerName: t('tableData.status'),
        minWidth: 50,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row;
          return (
            <Switch
              checked={row.status === 'active'}
              onChange={() => handleStatusChange(row.id, row.status)}
            />
          );
        },
      },
      {
        field: 'resetPassword',
        headerName: t('users.resetPassword'),
        flex: 1,
        minWidth: 150,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <PrimaryButton
              variant="outlined"
              size="small"
              onClick={() => mutate({ _id: params.id })}
            >
              {t('users.resetPassword')}
            </PrimaryButton>
          );
        },
      },
      {
        field: 'access',
        headerName: t('users.groupOfAccess'),
        flex: 1,
        sortable: false,
        minWidth: 300,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <div className="flex flex-col gap-3">
              {params.row.access.map(
                (module: { module: string; pages: string[] }) => {
                  const pages = module.pages.join(', ');
                  return (
                    <div className="" key={module.module}>
                      <Label
                        variant="subtitle1"
                        weight="semibold"
                        className="capitalize"
                      >
                        {module.module}:{' '}
                      </Label>
                      <Label variant="subtitle1" className="capitalize">
                        {pages}
                      </Label>
                    </div>
                  );
                },
              )}
            </div>
          );
        },
      },
      {
        field: 'action',
        headerName: 'Action',
        minWidth: 100,
        sortable: false,
        renderCell: (params: GridRenderCellParams) => {
          const row = params.row;
          return (
            <Iconbutton
              name="edit"
              onClick={() => handleActionHandler(row, 'edit')}
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
    reset,
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(validationSchema),
  });
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
    fetchPolicy: 'cache-and-network',
  });

  const [updateUser] = useMutation(UPDATE_USER, {
    refetchQueries: [GET_EMPLOYEE_LIST],
  });

  const handleStatusChange = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'deleted' : 'active';
    updateUser({
      variables: {
        params: {
          id,
          status: newStatus,
        },
      },
    }).then(() => {
      toast.success(
        t(`users.success.status`, {
          newStatus: newStatus === 'deleted' ? t('inactive') : t('active'),
        }),
      );
    });
  };

  const resetForm = () => {
    reset({
      email: '',
      firstName: '',
      lastName: '',
      status: true,
      access: [],
    });
    setSelectedModules({});
  };

  useEffect(() => {
    if (data) {
      const userListData = data.employees.data.map((val: ITableUserData) => ({
        id: val._id,
        email: val.email,
        role: val.role,
        status: val.status,
        firstName: val.firstName,
        lastName: val.lastName,
        access: val.access,
      }));
      setUserList(userListData);
      setTotalItems(data.employees.totalItems);
      setEditForm(false);
      resetForm();
    }
  }, [data]);

  const handleStatusFilterChange = (_e: any, value: any) => {
    if (value) {
      setStatusFilter(value);
      setPage({ limit: 10, pageNo: 1 });
      refetch();
    }
  };

  const onSearchHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
    setPage({ limit: 10, pageNo: 1 });
  };

  const handleActionHandler = (row: ITableUserData, key: string) => {
    if (key === 'edit') {
      const formattedAccess = row.access.map((module) => ({
        module: module.module,
        pages: module.pages,
      }));

      const selectedModulesData = formattedAccess.reduce(
        (acc: { [key: string]: string[] }, curr) => {
          acc[curr.module] = curr.pages;
          return acc;
        },
        {},
      );

      setSelectedModules(selectedModulesData);

      reset({
        ...row,
        access: formattedAccess,
        status: row.status === 'active',
      });
      setEditForm(true);
      setUserFormModal(true);
    }
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const onModalClose = () => {
    resetForm();
    setUserFormModal(false);
    setEditForm(false);
  };

  return (
    <>
      <div className="flex">
        <Header
          title="User List"
          handleChange={onSearchHandler}
          buttonText={t('users.addUser')}
          onClick={() => setUserFormModal(true)}
        >
          <div className="w-2/12">
            <AutoComplete
              options={[
                { value: 'active', label: t('active') },
                { value: 'deleted', label: t('inactive') },
              ]}
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label={t('users.filterByStatus')}
              fullWidth
            />
          </div>
        </Header>
      </div>
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
      <Modal
        open={userFormModal}
        title={editForm ? t('users.updateUser') : t('users.updateUser')}
        onClose={onModalClose}
        size="md"
      >
        <UserForm
          setUserFormModal={setUserFormModal}
          control={control}
          handleSubmit={handleSubmit}
          errors={errors}
          editForm={editForm}
          selectedModules={selectedModules}
          setSelectedModules={setSelectedModules}
          onModalClose={onModalClose}
        />
      </Modal>
    </>
  );
};

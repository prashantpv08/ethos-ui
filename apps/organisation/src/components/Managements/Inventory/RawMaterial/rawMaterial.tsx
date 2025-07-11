import { ChangeEvent, useMemo, useState } from 'react';
import { useRestMutation, useRestQuery } from '@ethos-frontend/hook';
import { Header } from '../../../../components/Common/Header';
import {
  Iconbutton,
  Paragraph,
  PrimaryButton,
  Switch,
  Table,
} from '@ethos-frontend/ui';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { DeleteModal } from '../../../Common';
import {
  API_METHODS,
  API_URL,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  SUCCESS_TEMPLATES,
} from '@ethos-frontend/constants';
import { toast } from 'react-toastify';

import { RawMaterialForm } from './rawMaterialForm';
import { useTranslation } from 'react-i18next';
import { DownloadForOfflineOutlined } from '@mui/icons-material';
import { priceWithSymbolAdmin } from '@ethos-frontend/utils';
import { useUser } from '../../../../context/user';

interface IRawMaterial {
  _id: string;
  name: string;
  code: string;
  cost: number;
  uom: { code: string; _id: string };
  description: string;
  status: string;
  uomId?: string;
  id?: string | undefined;
}

export interface ISubmitRawMaterial {
  name: string;
  code: string;
  cost: number;
  description: string;
  uom: string;
  status?: string;
  id?: string;
}

export const RawMaterial = () => {
  const { t } = useTranslation();
  const { userData } = useUser();
  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.name'),
        field: 'name',
        flex: 1,
      },
      {
        headerName: t('tableData.description'),
        field: 'description',
        flex: 1,
      },
      {
        headerName: t('tableData.code'),
        field: 'code',
        flex: 1,
      },
      {
        headerName: t('tableData.uom'),
        field: 'uom',
        flex: 1,
      },
      {
        headerName: t('tableData.price'),
        field: 'cost',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
          <Paragraph variant="body1">
            {priceWithSymbolAdmin(params.row.cost, userData?.currency)}
          </Paragraph>
        ),
      },
      {
        headerName: t('tableData.status'),
        field: 'status',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const isActive = params.value === 'Active';
          return (
            <Switch
              checked={isActive}
              onChange={(e) => handleStatusChange(params.row, e.target.checked)}
            />
          );
        },
      },
      {
        headerName: 'Action',
        field: 'action',
        flex: 1,
        renderCell: (params: GridRenderCellParams) => (
          <div className="flex">
            <Iconbutton
              name="edit"
              onClick={() => handleActions(params.row, 'edit')}
            />

            <Iconbutton
              name="delete"
              iconColor="red"
              onClick={() => handleActions(params.row, 'delete')}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const [unitListData, setUnitListData] = useState([]);
  const [selectedUnit, setSelectedUnit] = useState<string>('');
  const [rawMaterialData, setRawMaterialData] = useState<IRawMaterial[]>([]);
  const [selectedRow, setSelectedRow] = useState<ISubmitRawMaterial | null>(
    null,
  );
  const [totalItems, setTotalItems] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });

  useRestQuery('fetch-unit-list', 'admin/uom/dropdown', {
    onSuccess: (res) => {
      const unitList = res.data.map((val: { code: string; _id: string }) => {
        return {
          label: val.code,
          value: val._id,
        };
      });
      setUnitListData(unitList);
    },
  });

  const sortBy = sortUser[0]?.field;
  const sortOrder = sortUser[0]?.sort === 'asc' ? 1 : -1;

  const { isLoading, refetch } = useRestQuery(
    ['fetch-raw-material', search, page, sortUser],
    `admin/raw?pageNo=${page.pageNo}&limit=${page.limit}${
      sortBy ? `&sortBy=${sortBy}` : ''
    }&sortOrder=${sortOrder}${search ? `&searchKey=${search}` : ''}`,
    {
      onSuccess: (res) => {
        setIsModalOpen(false);
        setIsDeleteOpen(false);
        const rawMaterialResData = res.data;
        setTotalItems(rawMaterialResData.totalItems);
        const rawMaterialList = rawMaterialResData?.data?.map(
          (val: IRawMaterial) => {
            return {
              id: val._id,
              name: val.name,
              code: val.code,
              cost: val.cost,
              uom: val.uom.code,
              uomId: val?.uom?._id,
              description: val.description,
              status: val.status === 'active' ? 'Active' : 'Inactive',
            };
          },
        );

        setRawMaterialData(rawMaterialList);
      },
    },
  );

  const { mutate: addRawMaterial } = useRestMutation(
    API_URL.rawMaterial,
    { method: API_METHODS.POST },
    {
      onSuccess: (res) => {
        setIsModalOpen(false);
        toast.success(SUCCESS_TEMPLATES.added(`${res.data?.name}`));
        refetch();
        setSelectedRow(null);
      },
    },
  );

  const { mutate: updateRawMaterial } = useRestMutation(
    `${API_URL.rawMaterial}/${selectedRow?.id}`,
    { method: API_METHODS.PATCH },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success(SUCCESS_TEMPLATES.deleted(`${selectedRow?.name}`));
        refetch();
        setSelectedRow(null);
      },
    },
  );

  const { mutate: deleteRawMaterial, isPending } = useRestMutation(
    `${API_URL.rawMaterial}/${selectedRow?.id}`,
    { method: API_METHODS.DELETE },
    {
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success(SUCCESS_TEMPLATES.deleted(`${selectedRow?.name}`));
        refetch();
        setSelectedRow(null);
      },
    },
  );

  const handleStatusChange = (row: ISubmitRawMaterial, checked: boolean) => {
    const newStatus = checked ? 'active' : 'blocked';
    setSelectedRow(row);
    updateRawMaterial({
      status: newStatus,
    });
  };

  const handleActions = (row: IRawMaterial, key: string) => {
    const uom = row.uomId;
    const editRow = {
      ...row,
      uom: uom || '',
    };
    if (key === 'edit') {
      setSelectedUnit(uom as string);
      setSelectedRow(editRow);
      setIsModalOpen(true);
    }
    if (key === 'delete') {
      setIsDeleteOpen(true);
      setSelectedRow(editRow);
    }
  };

  const onSubmit = (data: any) => {
    const body: ISubmitRawMaterial = {
      name: data.name,
      code: data.code,
      cost: data.cost,
      uom: data.uom,
      description: data.description,
    };

    if (selectedRow) {
      updateRawMaterial(body);
    } else {
      addRawMaterial(body);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const { refetch: exportInventoryQuery, isFetching } = useRestQuery(
    ['export-raw-material-report'],
    `${API_URL.exportRawReport}`,
    {
      enabled: false,
      onSuccess: (response: any) => {
        const fileUrl = response.data;
        const link = document.createElement('a');
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t(SUCCESS_MESSAGES.INVENTORY_REPORT_DOWNLOAD));
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  return (
    <>
      <div className="flex items-start gap-4">
        <Header
          title={t('rawMaterial.title')}
          onClick={() => {
            setSelectedUnit('');
            setIsModalOpen(true);
          }}
          handleChange={handleChange}
          buttonText={t('rawMaterial.add')}
        />
        <PrimaryButton
          startIcon={<DownloadForOfflineOutlined />}
          variant="outlined"
          onClick={() => exportInventoryQuery()}
          loading={isFetching}
        >
          {t('rawMaterial.exportInventory')}
        </PrimaryButton>
      </div>
      <Table
        columns={columns}
        rows={rawMaterialData}
        rowCount={totalItems}
        loading={isLoading}
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

      <RawMaterialForm
        setIsModalOpen={setIsModalOpen}
        isModalOpen={isModalOpen}
        selectedRow={selectedRow}
        unitListData={unitListData}
        selectedUnit={selectedUnit}
        onSubmit={onSubmit}
        setSelectedRow={setSelectedRow}
      />
      <DeleteModal
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSubmit={() => deleteRawMaterial(undefined)}
        loading={isPending}
      />
    </>
  );
};

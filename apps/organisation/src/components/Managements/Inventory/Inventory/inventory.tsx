import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { ExportReportModal, Header } from '../../../../components/Common';
import {
  ControlledDropdown,
  ControlledInput,
  GridContainer,
} from '@ethos-frontend/components';
import { Iconbutton, PrimaryButton, Table, Modal } from '@ethos-frontend/ui';
import {
  API_URL,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '@ethos-frontend/constants';
import { useRestQuery } from '@ethos-frontend/hook';
import { GET_INVENTORY_LIST } from '../../../../api/queries/Inventory';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_INVENTORY } from '../../../../api/mutations/Inventory';
import {
  GridRenderCellParams,
  GridSortItem,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { toast } from 'react-toastify';
import { DownloadForOfflineOutlined } from '@mui/icons-material';
import { t } from 'i18next';
import { useTransactionCodes } from '../../../../hooks';
interface IInventory {
  code: string;
  id: string;
  name: string;
  qty: number;
  transactionCodeId?: string;
  rawId?: string;
  uom: string;
  description?: string;
}

const validationSchema = Yup.object().shape({
  rawName: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  transactionCodeId: Yup.string().required(t(ERROR_MESSAGES.REQUIRED)),
  qty: Yup.number(),
  currentqty: Yup.number()
    .required(t(ERROR_MESSAGES.REQUIRED))
    .typeError(t(ERROR_MESSAGES.SHOULD_NUMBER)),
});

export const Inventory = () => {
  const columns = useMemo(
    () => [
      {
        headerName: t('tableData.code'),
        field: 'code',
        flex: 1,
      },
      {
        headerName: t('tableData.name'),
        field: 'name',
        flex: 1,
      },
      {
        headerName: t('tableData.quantity'),
        field: 'qty',
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
        renderCell: (params: GridRenderCellParams) => (
          <div className="flex">
            <Iconbutton name="edit" onClick={() => handleActions(params.row)} />
          </div>
        ),
      },
    ],
    [],
  );

  const [inventoryData, setInventoryData] = useState<IInventory[]>([]);
  const [searchKey, setSearchKey] = useState<string>('');
  const [selectedInventory, setSelectednventory] = useState<IInventory>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState({
    limit: 10,
    pageNo: 1,
  });
  const [sortUser, setSortUser] = useState<GridSortItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const {
    options: transactionCodeData,
    isLoading: isTransactionCodeLoading,
    loadTransactionCodes,
  } = useTransactionCodes();

  const [start, end] = dateRange;

  let startTs;
  let endTs;

  if (start && end) {
    startTs = Date.UTC(
      start.getFullYear(),
      start.getMonth(),
      start.getDate(),
      0,
      0,
      0,
      0,
    );

    endTs = Date.UTC(
      end.getFullYear(),
      end.getMonth(),
      end.getDate(),
      23,
      59,
      59,
      999,
    );
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { data, loading, refetch } = useQuery(GET_INVENTORY_LIST, {
    variables: {
      params: {
        searchKey: searchKey,
        limit: page.limit,
        pageNo: page.pageNo,
        sortBy: sortUser[0]?.field,
        sortOrder: sortUser[0]?.sort === 'asc' ? 1 : -1,
      },
    },
  });

  useEffect(() => {
    if (data) {
      setIsModalOpen(false);
      const categoryRes = data?.inventories?.data?.map(
        (val: Record<string, unknown>) => {
          return {
            id: val._id,
            code: val.code,
            name: val.rawName,
            qty: val.qty,
            transactionCodeId: val.transactionCodeId,
            rawId: val.rawId,
            description: val.description,
            uom: val.uom,
          };
        },
      );
      setTotalItems(data?.inventories?.totalItems);
      setInventoryData(categoryRes);
    }
  }, [data]);

  const [updateInventory] = useMutation(UPDATE_INVENTORY, {
    onCompleted: () => {
      setIsModalOpen(false);
      toast.success(SUCCESS_MESSAGES.INVENTORY_UPDATED);
      refetch();
    },
    onError: () => {
      setIsModalOpen(true);
      toast.error(t(ERROR_MESSAGES.GENERAL));
    },
  });

  const handleActions = (category: IInventory) => {
    setIsModalOpen(true);

    const editCategory = {
      ...category,
      rawName: category.name,
    };

    delete editCategory.description;
    delete editCategory.transactionCodeId;

    setSelectednventory(editCategory);
    reset(editCategory);
  };

  const onSubmit = (data: Record<string, unknown>) => {
    const body = {
      transactionCodeId: data?.transactionCodeId,
      rawId: selectedInventory?.rawId,
      qty: data.currentqty,
      description: data?.description,
    };

    if (selectedInventory) {
      updateInventory({
        variables: { data: { ...body, id: selectedInventory.id } },
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchKey(e.target.value);
  };

  const handleSortModelChange = (newSortModel: GridSortModel) => {
    setSortUser([...newSortModel]);
  };

  const { refetch: exportInventoryQuery, isFetching } = useRestQuery(
    ['export-inventory-report'],
    `${API_URL.exportInventoryReport}?startDate=${startTs}&endDate=${endTs}`,
    {
      enabled: false,
      onSuccess: (response: any) => {
        const fileUrl = response.data;
        const link = document.createElement('a');
        link.href = fileUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(SUCCESS_MESSAGES.INVENTORY_REPORT_DOWNLOAD);
      },
      onError: () => {
        toast.error(t(ERROR_MESSAGES.GENERAL));
      },
    },
  );

  const fetchTransactionCode = () => {
    if (transactionCodeData.length === 0) {
      loadTransactionCodes();
    }
  };

  return (
    <>
      <div className="flex items-start gap-4">
        <Header title={t('inventoryList.title')} handleChange={handleChange} />
        <PrimaryButton
          startIcon={<DownloadForOfflineOutlined />}
          variant="outlined"
          onClick={() => setOpenExportModal(true)}
        >
          {t('inventoryList.exportInventoryConsumption')}
        </PrimaryButton>
      </div>
      <Table
        columns={columns}
        rows={inventoryData}
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
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          reset({
            transactionCodeId: '',
            rawName: '',
            qty: 0,
          });
        }}
        size="md"
        title={t('inventoryList.editInventory')}
      >
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <GridContainer columns={1}>
            <ControlledInput
              type="text"
              name="rawName"
              control={control}
              label={t('rawMaterial.title')}
              errors={errors}
              helperText={errors}
              fullWidth
              disabled
            />

            <ControlledDropdown
              name="transactionCodeId"
              control={control}
              placeholder={t('transactionCode.title')}
              errors={errors}
              helperText={errors}
              fullWidth
              options={transactionCodeData}
              onOpen={fetchTransactionCode}
              loading={isTransactionCodeLoading}
            />
            <div className="flex gap-2 xs:flex-col flex-row">
              {selectedInventory && (
                <ControlledInput
                  type="number"
                  name="qty"
                  control={control}
                  disabled
                  label={t('inventoryList.currentStock')}
                  errors={errors}
                  helperText={errors}
                  fullWidth
                />
              )}
              <ControlledInput
                type="text"
                name="uom"
                control={control}
                label={t('units.title')}
                errors={errors}
                helperText={errors}
                fullWidth
                disabled
              />
            </div>
            <ControlledInput
              type="number"
              name="currentqty"
              control={control}
              required
              label={t('inventoryList.transactionQuantity')}
              errors={errors}
              helperText={errors}
              fullWidth
            />
            <ControlledInput
              type="text"
              name="description"
              control={control}
              label={t('inventoryList.note')}
              fullWidth
              multiline
              rows={5}
            />
            <PrimaryButton className="!ml-auto" type="submit">
              {t('inventoryList.update')}
            </PrimaryButton>
          </GridContainer>
        </form>
      </Modal>
      <ExportReportModal
        title={t('inventoryList.exportConsumptionReport')}
        open={openExportModal}
        onClose={() => setOpenExportModal(false)}
        onSubmit={exportInventoryQuery}
        dateRange={[start, end]}
        setDateRange={setDateRange}
        loading={isFetching}
      />
    </>
  );
};

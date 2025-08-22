import { ChangeEvent, useEffect, useState } from "react";
import {
  Table,
  TextField,
  Heading,
  PrimaryButton,
  Iconbutton,
} from "@ethos-frontend/ui";
import {
  GridColDef,
  GridRowsProp,
  GridSortModel,
} from "@mui/x-data-grid-premium";
import { Menu, MenuItem } from "@mui/material";
import { getOrgList, deleteORG, updateUserAction, blockOrg } from "./action";
import WarningDialog from "../../Components/WarningDialog";
import RejectDialog from "../../Components/RejectDialog";
import CommissionDialog from "../../Components/CommissionDialog";
import { toast } from "react-toastify";
import { Search, MoreVert } from "@mui/icons-material";
import { useTranslation } from "react-i18next";

export default function List() {
  const { t } = useTranslation();
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    { field: "email", sort: "asc" },
  ]);
  const [query, setQuery] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const openMenu = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLButtonElement>, row: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    deleteORG(selectedRow.id, () => {
      setDeleteOpen(false);
      fetchData();
    });
  };

  const handleReject = (comment: string) => {
    updateUserAction({ id: selectedRow.id, type: "rejected", comment }, () => {
      setRejectOpen(false);
      fetchData();
    });
  };

  const fetchData = () => {
    setLoading(true);
    getOrgList(
      {
        pageNo: page + 1,
        limit: pageSize,
        sortBy: sortModel[0]?.field,
        sortOrder: sortModel[0]?.sort === "asc" ? 1 : -1,
        searchKey: search,
      },
      (data: any) => {
        const mapped = (data?.data || []).map((org: any) => ({
          id: org._id,
          name: `${org.ownerFName} ${org.ownerLName}`,
          email: org.email,
          status: org.status,
          orgNumber: org.orgNumber,
          businessType: org.businessType,
          orgName: org.orgName,
        }));
        setRows(mapped);
        setRowCount(data?.totalItems || 0);
        setLoading(false);
      },
      () => setLoading(false)
    );
  };

  useEffect(fetchData, [page, pageSize, sortModel, search]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const columns: GridColDef[] = [
    { field: "orgName", headerName: "Organisation Name", flex: 1 },
    { field: "name", headerName: "Owner Name", flex: 1 },
    { field: "orgNumber", headerName: "Organisation Number", flex: 1 },
    { field: "email", headerName: "Email", flex: 1, minWidth: 300 },
    { field: "businessType", headerName: "Business Type", flex: 1 },
    { field: "status", headerName: "Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 0.5,
      renderCell: (params) => (
        <Iconbutton
          MuiIcon={MoreVert}
          onClick={(e) => handleMenu(e as any, params.row)}
        />
      ),
    },
  ];

  const handleUserAction = (status: string) => {
    if (status === "blocked") {
      blockOrg({ id: selectedRow._id }, () => {
        toast.success("Status has been updated successfully.");
        setAnchorEl(null);
        fetchData();
      });
    } else {
      updateUserAction({ id: selectedRow._id, type: status }, () => {
        toast.success("Status has been updated successfully.");
        setAnchorEl(null);
        fetchData();
      });
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between pb-4">
        <Heading variant="h5">Organisation</Heading>
        <div className="flex items-center gap-2">
          <TextField
            onChange={handleSearch}
            placeholder={t("search")}
            label={t("search")}
            leftIcon={<Search />}
            size="medium"
            name="search"
          />
          <PrimaryButton
            variant="contained"
            onClick={() => setCommissionOpen(true)}
          >
            Add Commission
          </PrimaryButton>
        </div>
      </div>
      <Table
        columns={columns}
        rows={rows}
        page={page}
        pageSize={pageSize}
        rowCount={rowCount}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        sortModel={sortModel}
        onSortModelChange={setSortModel}
        loading={loading}
      />
      <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
        {selectedRow?.status !== "active" &&
          selectedRow?.status !== "rejected" &&
          selectedRow?.status !== "blocked" && (
            <MenuItem onClick={() => handleUserAction("active")}>
              Approve
            </MenuItem>
          )}
        {selectedRow?.status === "active" && (
          <MenuItem onClick={() => handleUserAction("blocked")}>Block</MenuItem>
        )}

        {selectedRow?.status === "blocked" && (
          <MenuItem onClick={() => handleUserAction("blocked")}>
            Active
          </MenuItem>
        )}

        {selectedRow?.status !== "rejected" &&
          selectedRow?.status !== "active" &&
          selectedRow?.status !== "blocked" && (
            <MenuItem
              onClick={() => {
                setRejectOpen(true);
                handleMenuClose();
              }}
            >
              Reject
            </MenuItem>
          )}
        <MenuItem
          onClick={() => {
            setDeleteOpen(true);
            handleMenuClose();
          }}
        >
          Delete
        </MenuItem>
      </Menu>
      <CommissionDialog
        open={commissionOpen}
        onClose={() => setCommissionOpen(false)}
        onSaved={fetchData}
      />
      <RejectDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
      />
      <WarningDialog
        open={deleteOpen}
        handleClose={() => setDeleteOpen(false)}
        title="Delete"
        description="Do you want to delete this Organisation ?"
        type="delete"
        onClick={handleDelete}
        cancelBtnText="Cancel"
        confirmBtnText="Delete"
      />
    </div>
  );
}

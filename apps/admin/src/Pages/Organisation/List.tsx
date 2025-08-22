import { ChangeEvent, useEffect, useState } from 'react';
import { Table, TextField, Heading } from '@ethos-frontend/ui';
import {
  GridColDef,
  GridRowsProp,
  GridSortModel,
} from '@mui/x-data-grid-premium';
import { getOrgList } from './action';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
];

export default function List(): JSX.Element {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowCount, setRowCount] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    setLoading(true);
    getOrgList(
      {
        pageNo: page + 1,
        limit: pageSize,
        sortBy: sortModel[0]?.field,
        sortOrder: sortModel[0]?.sort === 'asc' ? 1 : -1,
        searchKey: search,
      },
      (data: any) => {
        const mapped = (data?.data || []).map((org: any) => ({
          id: org._id,
          name: org.name,
          email: org.email,
        }));
        setRows(mapped);
        setRowCount(data?.totalItems || 0);
        setLoading(false);
      },
      () => setLoading(false),
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

  return (
    <div className="p-4">
      <div className="flex items-center justify-between pb-4">
        <Heading variant="h5">Organisation</Heading>
        <TextField
          size="small"
          name="search"
          placeholder="Search"
          onChange={handleSearch}
        />
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
    </div>
  );
}

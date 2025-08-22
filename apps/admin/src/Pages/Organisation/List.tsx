import { useState } from 'react';
import { Table } from '@ethos-frontend/ui';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
];

const rows: GridRowsProp = [
  { id: 1, name: 'Admin One', email: 'admin1@example.com' },
  { id: 2, name: 'Admin Two', email: 'admin2@example.com' },
];

export default function List(): JSX.Element {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="p-4">
      <Table
        columns={columns}
        rows={rows}
        page={page}
        pageSize={pageSize}
        rowCount={rows.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  );
}

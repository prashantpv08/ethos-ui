import { Table } from '@ethos-frontend/ui';

const columns = [
  { field: 'id', headerName: 'ID', flex: 1 },
  { field: 'name', headerName: 'Name', flex: 1 },
  { field: 'email', headerName: 'Email', flex: 1 },
];

const rows = [
  { id: 1, name: 'Admin One', email: 'admin1@example.com' },
  { id: 2, name: 'Admin Two', email: 'admin2@example.com' },
];

export default function List(): JSX.Element {
  return (
    <div className="p-4">
      <Table columns={columns} rows={rows} pagination={false} />
    </div>
  );
}

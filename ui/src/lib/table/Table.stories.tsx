import { Meta, Story } from '@storybook/react';
import Table from './Table';
import { GridColDef, GridRowsProp } from '@mui/x-data-grid-premium';
import { useState } from 'react';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'name', headerName: 'Name', width: 150 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 110,
  },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    type: 'date',
    width: 180,
  },
  {
    field: 'lastLogin',
    headerName: 'Last Login',
    type: 'dateTime',
    width: 220,
  },
];

const rows: GridRowsProp = [
  {
    id: 1,
    name: 'John Doe',
    age: 30,
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 2,
    name: 'Jane Smith',
    age: 25,
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
  {
    id: 3,
    name: 'Steve Brown',
    age: 40,
    dateCreated: new Date(),
    lastLogin: new Date(),
  },
];

export default {
  title: 'components/Table',
  component: Table,
} as Meta;

const Template: Story = (args) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);

  return (
    <Table
      {...args}
      page={page}
      pageSize={pageSize}
      onPageChange={setPage}
      onPageSizeChange={setPageSize}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  columns,
  rows,
};

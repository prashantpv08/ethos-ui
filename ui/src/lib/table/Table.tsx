import React from 'react';
import {
  DataGridPremium,
  DataGridPremiumProps,
  GridColDef,
  GridRowsProp,
} from '@mui/x-data-grid-premium';
import { Box, styled, useTheme } from '@mui/material';
import { DataArray } from '@mui/icons-material';
import { Paragraph } from '../typography';
import { borderBottom } from '@mui/system';

export interface DataGridPremiumComponentProps extends DataGridPremiumProps {
  columns: GridColDef[];
  rows: GridRowsProp;
  pageSize?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  checkboxSelection?: boolean;
  loading?: boolean;
  rowCount?: number;
  pagination?: boolean;
}

const StyledDataGrid = styled(DataGridPremium)(({ theme }) => ({
  '&.MuiDataGrid-root': {
    border: 'none',
  },
  '& .MuiDataGrid-detailPanelToggleCell': {
    padding: 0,
  },
  '& .MuiDataGrid-columnHeaders': {
    background: theme.palette.primary.light,
    ...theme.typography.subtitle2,
    fontWeight: 500,
    border: 'none',
    borderRadius: '12px',
    color: theme.palette.secondary.main,
  },
  '& .MuiDataGrid-row': {
    ...theme.typography.subtitle2,
    '& .MuiDataGrid-cell': {
      borderBottom: `2px solid ${theme.palette.primary.light}`,
    },
    '&:last-child .MuiDataGrid-cell':{
      borderBottom: 'none'
    }
  },
  '& .MuiDataGrid-footerContainer': {
    border: 'none',
  },
  '& .MuiTablePagination-displayedRows': {
    ...theme.typography.subtitle2,
  },
}));

const Table: React.FC<DataGridPremiumComponentProps> = ({
  columns,
  rows,
  pageSize = 10,
  page = 0,
  onPageChange,
  onPageSizeChange,
  checkboxSelection,
  rowCount,
  loading,
  pagination = true,
  ...props
}) => {
  const theme = useTheme();
  return (
    <Box
      width="100%"
      sx={{
        overflowX: 'auto',
        display: 'flex',
        flexDirection: 'column',
        '& .MuiDataGrid-root': {
          minWidth: theme.breakpoints.up('sm') ? 'auto' : '1000px',
          '& .MuiDataGrid-cellConten': {
            wordWrap: 'break-word',
          },
        },
        '& .MuiDataGrid-root--densityCompact .MuiDataGrid-cell': {
          padding: '8px',
        },
        '& .MuiDataGrid-root--densityStandard .MuiDataGrid-cell': {
          padding: '15px',
        },
        '& .MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': {
          padding: '22px',
        },
      }}
    >
      <StyledDataGrid
        loading={loading}
        getRowHeight={() => 'auto'}
        slots={{
          noRowsOverlay: () => (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              flexDirection="column"
              gap="12px"
            >
              <DataArray />
              <Paragraph variant="subtitle1">No data available</Paragraph>
            </Box>
          ),
        }}
        rows={rows}
        autosizeOptions={{ includeOutliers: true, includeHeaders: true }}
        checkboxSelection={checkboxSelection}
        columns={columns}
        disableColumnMenu
        pagination={pagination}
        paginationMode="server"
        rowCount={rowCount}
        pageSizeOptions={[10, 25, 50, 100]}
        disableColumnSelector
        disableRowSelectionOnClick
        paginationModel={{ page, pageSize }}
        onPaginationModelChange={({ page, pageSize }) => {
          onPageChange?.(page);
          onPageSizeChange?.(pageSize);
        }}
        sortingMode="server"
        {...props}
      />
    </Box>
  );
};

export default Table;

import * as React from 'react'
import Pagination from '@mui/material/Pagination'
import PaginationItem from '@mui/material/PaginationItem'
import Stack from '@mui/material/Stack'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

export default function TablePagination({count , onPageChange , page} :any) {
  // console.log("Working ", page)
  return (
    <Pagination
      count={count}
      shape="rounded"
      color="primary"
      variant="outlined"
      className="reelPagination"
      page={page}
      onChange={onPageChange}
      siblingCount={0}
      boundaryCount={1}
      renderItem={(item) => {
        // console.log("item =>", item)
        return (
        <PaginationItem
          slots={{
            previous: ArrowBackIcon,
            next: ArrowForwardIcon,
          }}
          {...item}
        />
      )}}
    />
  )
}

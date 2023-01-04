import React, { useState } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, Checkbox, TableCell, TableContainer, TablePagination, TableSortLabel } from "@mui/material";
import Pagination from './pagination';
import { useLocation } from "react-router";
import { UIColor } from "app/utils/constant";
import { visuallyHidden } from '@mui/utils';

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, headCells, disableCheckBox, extraPaddingOnFirstColumn } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow >
        {!disableCheckBox &&
          <TableCell padding="checkbox" sx={{ backgroundColor: UIColor }}>
            <Checkbox
              sx={{ color: "#fff" }}
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
        }
        {headCells.map((headCell, i) => (
          <TableCell sx={{ backgroundColor: UIColor, color: "#fff !important", fontWeight: 500, fontSize: "15px", pr: (headCell?.action) ? "18px" : 0, paddingLeft: (!!extraPaddingOnFirstColumn && (i == 0)) ? '15px' : '0px' }}
            key={headCell.id}
            width={headCell?.width ?? "100%"}
            align={headCell?.align ? headCell?.align : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {!headCell?.sortDisable ?
              <TableSortLabel
                sx={{
                  backgroundColor: UIColor, color: "#fff !important",
                  '& .MuiTableSortLabel-icon': {
                    color: 'white !important',
                  },
                }}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
              :
              <>
                {(numSelected > 0 && headCell?.action) ? headCell?.renderCell : headCell.label}
              </>
            }
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const TableComponent = (props) => {
  let { rows, columns, selected, renderRow, page, totalCount, rowsPerPage, handleChangeRowsPerPage, handleChangePage, handleSelectAllClick, disableCheckBox, disableColumns, extraDisable, disablePagination, extraPaddingOnFirstColumn } = props;
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  // This method is created for cross-browser compatibility, if you don't
  // need to support IE11, you can use Array.prototype.sort() directly
  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  return (
    <Box sx={!extraDisable ? { width: '98%', mx: "auto", mt: 2 } : {}}>
      <Paper sx={{ width: '100%' }}>
        <TableContainer>
          <Table
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            {!disableColumns &&
              <EnhancedTableHead
                numSelected={selected?.length}
                disableColumns={disableColumns}
                order={order}
                extraPaddingOnFirstColumn={extraPaddingOnFirstColumn}
                disableCheckBox={disableCheckBox ?? false}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
                headCells={columns}
              />
            }
            <TableBody>
              {/* if you don't need to support IE11, you can replace the `stableSort` call with:
               rows.sort(getComparator(order, orderBy)).slice() */}
              {stableSort(rows, getComparator(order, orderBy))
                .map(renderRow)}
            </TableBody>
          </Table>
        </TableContainer>
        {!disablePagination &&
          <TablePagination
            rowsPerPageOptions={[1, 10, 20, 25]}
            component="div"
            count={totalCount ?? 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        }
      </Paper>
    </Box>
  );
};

export default TableComponent

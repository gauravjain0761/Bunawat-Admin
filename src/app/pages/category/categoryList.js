import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import { mockDataCategoryManagement } from 'fake-db/data/category/categoryManagement';
import TableComponent from 'app/components/table';
import { Button, Card, Fade, IconButton, Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';

const CategoryList = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(mockDataCategoryManagement);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
  const [actionAllOpen, setActionAllOpen] = useState(null);

  const columns = [
    {
      id: "category",
      label: "Parent Category Name",
      width: 200
    },
    {
      id: "subCategory",
      label: "Parent Sub Category Name",
      width: 250
    },
    {
      id: "name",
      label: "Category Name",
      width: 200
    },
    {
      id: "slug",
      label: "Code",
      width: 80
    },
    {
      id: "count",
      label: "Count",
      width: 80
    },
    {
      id: "status",
      label: "Status",
      width: 80
    },
    {
      id: "action",
      label: "Action",
      action: true,
      width: 80,
      sortDisable: true,
      renderCell: (
        <>
          <IconButton
            aria-label="more"
            id="long-button"
            sx={{ color: "#fff" }}
            aria-controls={Boolean(actionAllOpen) ? 'long-menu' : undefined}
            aria-expanded={Boolean(actionAllOpen) ? 'true' : undefined}
            aria-haspopup="true"
            onClick={(e) => setActionAllOpen(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="fade-menu"
            MenuListProps={{
              'aria-labelledby': 'fade-button',
            }}
            anchorEl={actionAllOpen}
            open={Boolean(actionAllOpen)}
            onClose={() => setActionAllOpen(null)}
            TransitionComponent={Fade}
          >
            <MenuItem onClick={() => {
              setOpen(true);
              setActionAllOpen(null)
            }}>Delete</MenuItem>
          </Menu>
        </>
      )
    }
  ];

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleActionClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    let temp = [...actionOpen];
    if (!temp[index]) {
      temp = temp.map(() => { return null })
    }
    temp[index] = event.currentTarget
    setActionOpen(temp)
  };

  const handleActionClose = () => {
    let temp = [...actionOpen];
    temp = temp.map(() => { return null })
    setActionOpen(temp)
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  const CardHeader = styled(Box)(() => ({
    display: 'flex',
    paddingLeft: '24px',
    paddingRight: '24px',
    marginBottom: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',
  }));

  const Title = styled('span')(() => ({
    fontSize: '1rem',
    fontWeight: '500',
    textTransform: 'capitalize',
  }));
  return (
    <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
      <CardHeader>
        <Title>Category List</Title>
        <Button onClick={() => navigate(`/category/details/list`)} sx={{
          backgroundColor: UIColor, color: "#fff",
          "&:hover": {
            backgroundColor: UIColor, color: "#fff"
          }
        }}>Add Category</Button>
      </CardHeader>
      <TableComponent
        rows={rows}
        columns={columns}
        selected={selected}
        renderRow={(row, index) => {
          const isItemSelected = isSelected(row.name);
          const labelId = `enhanced-table-checkbox-${index}`;
          return (
            <TableRow
              hover
              role="checkbox"
              aria-checked={isItemSelected}
              tabIndex={-1}
              key={row.name}
              selected={isItemSelected}
            >
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  onClick={(event) => handleClick(event, row.name)}
                  checked={isItemSelected}
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </TableCell>
              <TableCell align="center">{row.category}</TableCell>
              <TableCell align="center">{row.subCategory}</TableCell>
              <TableCell align="center" > {row.name} </TableCell>
              <TableCell align="center">{row.slug}</TableCell>
              <TableCell align="center">{row.count}</TableCell>
              <TableCell align="center">{row.count}</TableCell>
              <TableCell align="center" >
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={Boolean(actionOpen[index]) ? 'long-menu' : undefined}
                  aria-expanded={Boolean(actionOpen[index]) ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={(e) => handleActionClick(e, index)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  id="fade-menu"
                  MenuListProps={{
                    'aria-labelledby': 'fade-button',
                  }}
                  anchorEl={actionOpen[index]}
                  open={Boolean(actionOpen[index])}
                  onClose={handleActionClose}
                  TransitionComponent={Fade}
                >
                  <MenuItem onClick={() => navigate(`/category/details/list/${row.id}`)}>Edit</MenuItem>
                  <MenuItem onClick={() => {
                    setOpen(true);
                    handleActionClose();
                  }}>Delete</MenuItem>
                </Menu>
              </TableCell>
            </TableRow>
          );
        }}
        page={page}
        rowsPerPage={rowsPerPage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        handleChangePage={handleChangePage}
        handleSelectAllClick={handleSelectAllClick}
      />

      <DeleteModel open={open} handleClose={() => setOpen(false)} />
    </Card>
  );
}

export default CategoryList;
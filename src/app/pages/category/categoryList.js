import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Fade, Icon, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { Span } from 'app/components/Typography';
import { ApiGet, ApiPut } from 'app/service/api';
import { toast } from 'material-react-toastify';
import { API_URL } from 'app/constant/api';
import DeleteCategoryModel from 'app/views/category/model/deleteCategoryModel';
import DeleteAllModel from 'app/views/models/deleteModel';

const CategoryList = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
  const [actionAllOpen, setActionAllOpen] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [deleteData, setDeleteData] = useState(null);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);

  const columns = [
    {
      id: "pName",
      label: "Parent Category Name",
      width: 200
    },
    {
      id: "sName",
      label: "Parent Sub Category Name",
      width: 250
    },
    {
      id: "name",
      label: "Category Name",
      width: 200
    },
    {
      id: "code",
      label: "Code",
      width: 80
    },
    {
      id: "product_count",
      label: "Count",
      width: 80,
      align: "center"
    },
    {
      id: "isActive",
      label: "Status",
      width: 80,
      align: "center"
    },
    {
      id: "action",
      label: "Action",
      action: true,
      align: 'right',
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
              setDeleteAllOpen(true);
              setActionAllOpen(null)
            }}>Delete</MenuItem>
          </Menu>
        </>
      )
    }
  ];

  const getData = async () => {
    await ApiGet(`${API_URL.getCategorys}?page=${page}&limit=${rowsPerPage}`)
      .then((response) => {
        setRows(response?.data?.map(item => {
          return {
            ...item,
            pName: item?.parent_cateogry_id?.name,
            sName: item?.sub_category_id?.name,
          }
        }) ?? []);
        setTotalCount(response?.totalCount);
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }

  const editStatusData = async (id, status) => {
    await ApiPut(`${API_URL.editCategory}/${id}`, {
      isActive: status
    })
      .then((response) => {
        toast.success('Edit Successfully!')
        getData()
      })
      .catch((error) => {
        toast.error(error?.error)
        console.log("Error", error);
      });
  }

  React.useEffect(() => {
    getData();
  }, [page, rowsPerPage])

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
    setPage(newPage + 1);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
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
      <CardHeader className="searchBoxSeaprate">
        <Title>Category List</Title>
        <Box display="flex" className="searchBoxSeaprate">
          <Box display="flex" alignItems="center" className="searchBoxWidth" sx={{
            border: "1px solid #000",
            borderRadius: "6px",
            mr: "20px",
          }}>
            <Box component="input" sx={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '1rem',
              p: 0,
              paddingLeft: '20px',
              height: '36px',
              background: "transparent",
              color: "#000",
            }} type="text" autoFocus value={searchText} onChange={(e) => {
              setSearchText(e.target.value)
            }} placeholder="Search here..." />
            <IconButton onClick={() => setSearchText('')} sx={{ verticalAlign: 'middle' }}>
              <Icon sx={{ color: "#000" }}>{!searchText ? 'search' : 'close'}</Icon>
            </IconButton>
          </Box>

          <Button color="primary" variant="contained" type="submit" onClick={() => navigate(`/category/details/list`)} sx={{
            backgroundColor: UIColor, color: "#fff",
            "&:hover": {
              backgroundColor: UIColor, color: "#fff"
            }
          }}>
            <Icon>add</Icon>
            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add Category</Span>
          </Button>
        </Box>
      </CardHeader>
      <TableComponent
        rows={rows}
        columns={columns}
        selected={selected}
        totalCount={totalCount}
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
              <TableCell>{row?.pName}</TableCell>
              <TableCell>{row?.sName}</TableCell>
              <TableCell > {row.name} </TableCell>
              <TableCell>{row.code}</TableCell>
              <TableCell align="center">{row?.product_count}</TableCell>
              <TableCell align="center">
                {row?.isActive ?
                  <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "green", textTransform: "capitalize" }}>
                    Active
                  </Typography>
                  :
                  <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "red", fontWeight: 500, textTransform: "capitalize" }}>
                    InActive
                  </Typography>
                }
              </TableCell>
              <TableCell align='right' sx={{ pr: "18px" }}>
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
                  <MenuItem onClick={() => editStatusData(row?._id, !row?.isActive)}>{!row?.isActive ? "Active" : "InActive"}  </MenuItem>
                  <MenuItem onClick={() => navigate(`/category/details/list/${row?._id}`)}>Edit</MenuItem>
                  <MenuItem onClick={() => {
                    setDeleteData(row)
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


      <DeleteCategoryModel open={open} deleteData={deleteData} getData={getData} handleClose={() => {
        setDeleteData(null);
        setOpen(false);
      }} />


      <DeleteAllModel open={deleteAllOpen} handleClose={() => {
        setDeleteAllOpen(false);
      }} />
    </Card>
  );
}

export default CategoryList;
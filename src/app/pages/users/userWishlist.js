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
import { mockDataUserWishList } from 'fake-db/data/user/userWishlist';

const UserWishlist = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(mockDataUserWishList);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
  const [actionAllOpen, setActionAllOpen] = useState(null);
  const [searchText, setSearchText] = useState('');

  const columns = [
    {
      id: "Title",
      label: "Title",
      width: 120
    },
    {
      id: "Author",
      label: "Author",
      width: 120
    },
    {
      id: "Privacy",
      label: "Privacy",
      width: 120
    },
    {
      id: "Items In Wishlists",
      label: "Items In\nWishlists",
      align: "center",
      width: 120
    },
    {
      id: "Followers",
      label: "Followers",
      align: "center",
      width: 120
    },
    {
      id: "Date Of Creation",
      label: "Date Of\nCreation",
      width: 120
    },
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
    setPage(newPage + 1);
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
      <Box className="searchBoxSeaprate"
        sx={{
          paddingLeft: "10px !important",
          paddingRight: "10px !important",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Title>User Wishlist</Title>
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
            }} type="text" value={searchText} onChange={(e) => {
              setSearchText(e.target.value)
            }} placeholder="Search here..." />
            <IconButton onClick={() => setSearchText('')} sx={{ verticalAlign: 'middle' }}>
              <Icon sx={{ color: "#000" }}>{!searchText ? 'search' : 'close'}</Icon>
            </IconButton>
          </Box>

          {/* <Button color="primary" variant="contained" type="submit"
                        // onClick={() => navigate(`/order/add`)}
                        sx={{
                            backgroundColor: UIColor, color: "#fff",
                            "&:hover": {
                                backgroundColor: UIColor, color: "#fff"
                            }
                        }}>
                        <Icon>add</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add Order</Span>
                    </Button> */}
        </Box>
      </Box>
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
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.author}</TableCell>
              <TableCell >{row.privacy}</TableCell>
              <TableCell align="center">{row.wishlistNo}</TableCell>
              <TableCell align="center">{row.followersNo}</TableCell>
              <TableCell>{row.date}</TableCell>
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

export default UserWishlist;
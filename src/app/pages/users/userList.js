import {
  Box,
  Button,
  Card,
  Icon,
  IconButton,
  Menu,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';
import Fade from '@mui/material/Fade';
import { DataGrid } from '@mui/x-data-grid';
import { Paragraph } from 'app/components/Typography';
import { mockDataUserList } from 'fake-db/data/user/userList';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { isMobile } from 'app/utils/utils';
import { DEFAULT_STATE, UIColor } from 'app/utils/constant';
import DeleteModel from 'app/views/models/deleteModel';
import TableComponent from 'app/components/table';

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

const ProductTable = styled(Table)(() => ({
  minWidth: 400,
  height: '75vh',
  padding: "20px",
  whiteSpace: 'pre',
  '& small': {
    width: 50,
    height: 15,
    borderRadius: 500,
    boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
  },
  '& td': { borderBottom: 'none' },
  '& td:first-of-type': { paddingLeft: '16px !important' },
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#232a45",
    borderBottom: "none",
  },
  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#fff",
  },
  "& .MuiDataGrid-columnHeaders .MuiCheckbox-root svg": {
    fill: "#fff",
  },
  "& .MuiDataGrid-columnHeaders .MuiDataGrid-iconButtonContainer  svg": {
    fill: "#fff",
  },
  "& .MuiDataGrid-columnHeaders .MuiDataGrid-menuIcon svg": {
    fill: "#fff",
  },
  "& .MuiDataGrid-columnHeaders .MuiDataGrid-columnSeparator ": {
    visibility: "hidden"
  },
}));

const Small = styled('small')(({ bgcolor }) => ({
  width: 50,
  height: 15,
  color: '#fff',
  padding: '2px 8px',
  borderRadius: '4px',
  overflow: 'hidden',
  background: bgcolor,
  boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.12), 0 2px 2px 0 rgba(0, 0, 0, 0.24)',
}));

const UserList = ({ data = [], type }) => {
  const { palette } = useTheme();
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(DEFAULT_STATE);
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;

  const navigate = useNavigate();
  const [actionOpen, setActionOpen] = useState(data.map(() => { return null }));


  const handleClick = (event, index) => {
    event.preventDefault();
    event.stopPropagation();
    let temp = [...actionOpen];
    if (!temp[index]) {
      temp = temp.map(() => { return null })
    }
    temp[index] = event.currentTarget
    setActionOpen(temp)
  };

  const handleClose = () => {
    let temp = [...actionOpen];
    temp = temp.map(() => { return null })
    setActionOpen(temp)
  };

  const columns = [
    { field: "id", headerName: "ID", width: 75 },
    // {
    //   field: "image", headerName: "User", flex: 0.5,
    //   renderCell: ({ row: { firstName } }) => {
    //     return (
    //       <Box display="flex" alignItems="center" >
    //         <Avatar name={firstName} round={true} size={isMobile() ? "25" : "50"} />
    //       </Box>
    //     );
    //   }
    // },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
      renderCell: ({ row: { firstName, lastName } }) => {
        return (
          <Box display="flex" alignItems="center">
            {`${firstName} ${lastName}`}
          </Box>
        );
      }
    },
    {
      field: "mobile",
      headerName: "Mobile",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: ({ row: { id } }) => {
        return (
          <Box display="flex" alignItems="center">
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/user/details/${type}/${id}`)
                handleClose();
              }}>
              <Icon color="primary">edit</Icon>
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setOpen(true)
                handleClose();
              }}>
              <Icon color="error">delete</Icon>
            </IconButton>
          </Box >
        );
      }
    }
  ];


  // const columns = [
  //   { id: 'name', label: 'Name', width: 150 },
  //   { id: 'mobile', label: 'Mobile', width: 200 },
  //   { id: 'email', label: 'Email', width: 300 },
  //   { id: 'Action', label: 'Action', width: 300 },
  // ]


  const handlePageData = (limit, page = 1) => {
    setState({
      ...state,
      limit,
      page
    })
  }

  const handlePage = (page) => {
    setState({
      ...state,
      page
    })
  }

  return (
    <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
      <CardHeader >
        <Title>{type} List</Title>
        <Button onClick={() => navigate(`/user/add/${type}`)} sx={{
          backgroundColor: UIColor, color: "#fff",
          "&:hover": {
            backgroundColor: UIColor, color: "#fff"
          }
        }}>Add {type}</Button>
        {/* <Select size="small" defaultValue="this_month">
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="last_month">Last Month</MenuItem>
          </Select> */}
      </CardHeader>

      <Box overflow="auto">
        {/* <TableComponent
          rows={data}
          columns={columns}
          handlePageData={handlePageData}
          handlePage={handlePage}
          state={state}
          renderColumn={(column, index) => {
            return (
              <TableCell align="center" sx={{ backgroundColor: UIColor, color: "#fff" }} key={column.id} width={column?.width ?? undefined}>
                {column.label}
              </TableCell>
            )
          }}
          renderRow={(row, index) => {
            return (
              <TableRow key={index} hover role="checkbox" style={{
                background: 'white',
              }} tabIndex={-1} >
                <TableCell width="150px" className="min-w-[200px]" align="center" component="th" scope="row">
                  {`${row.firstName} ${row.lastName}`}
                </TableCell>
                <TableCell className="min-w-[200px]" align="center" component="th" scope="row">
                  <span className='flex gap-2 items-center justify-center'>
                    {row?.mobile}
                  </span>
                </TableCell>
                <TableCell className="min-w-[200px]" align="center" component="th" scope="row">
                  {row.email}
                </TableCell>
                <TableCell className="min-w-[200px]" align="center" component="th" scope="row">
                  <IconButton
                    aria-label="more"
                    id="long-button"
                    aria-controls={Boolean(actionOpen[index]) ? 'long-menu' : undefined}
                    aria-expanded={Boolean(actionOpen[index]) ? 'true' : undefined}
                    aria-haspopup="true"
                    onClick={(e) => handleClick(e, index)}>
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="fade-menu"
                    MenuListProps={{
                      'aria-labelledby': 'fade-button',
                    }}
                    anchorEl={actionOpen[index]}
                    open={Boolean(actionOpen[index])}
                    onClose={handleClose}
                    TransitionComponent={Fade}
                  >
                    <MenuItem onClick={() => console.log(row)}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                    <MenuItem onClick={handleClose}>Logout</MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            )
          }}
        /> */}
        <ProductTable>
          <DataGrid
            rows={data}
            columns={columns}
            checkboxSelection
            disableColumnMenu
          />
        </ProductTable>
      </Box>

      <DeleteModel open={open} handleClose={() => setOpen(false)} />
    </Card>
  );
};

export default UserList;

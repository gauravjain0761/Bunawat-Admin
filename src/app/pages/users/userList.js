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
import { DataGrid } from '@mui/x-data-grid';
import { Paragraph } from 'app/components/Typography';
import { mockDataUserList } from 'fake-db/data/user/userList';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { isMobile } from 'app/utils/utils';
import { UIColor } from 'app/utils/constant';

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

const UserList = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;

  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
                navigate(`/user/details/${id}`)
                handleClose();
              }}>
              <Icon color="primary">edit</Icon>
            </IconButton>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleClose();
              }}>
              <Icon color="error">delete</Icon>
            </IconButton>
          </Box >
        );
      }
    }
  ];

  return (
    <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
      <CardHeader >
        <Title>User List</Title>
        <Button onClick={() => navigate(`/user/details`)} sx={{
          backgroundColor: UIColor, color: "#fff",
          "&:hover": {
            backgroundColor: UIColor, color: "#fff"
          }
        }}>Add User</Button>
        {/* <Select size="small" defaultValue="this_month">
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="last_month">Last Month</MenuItem>
          </Select> */}
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <DataGrid
            rows={mockDataUserList}
            columns={columns}
            checkboxSelection
            disableColumnMenu
          />
        </ProductTable>
      </Box>
    </Card>
  );
};

export default UserList;

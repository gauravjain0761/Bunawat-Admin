import {
    Avatar,
    Box,
    Card,
    Icon,
    IconButton,
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
import { mockDataUserPayment, mockDataUserPaymentHistory } from 'fake-db/data/user/userPaymentHistory';
  
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
  
  const UserPaymentHistory = () => {
    const { palette } = useTheme();
    const bgError = palette.error.main;
    const bgPrimary = palette.primary.main;
    const bgSecondary = palette.secondary.main;
    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell"
        },
        {
            field: "type",
            headerName: "Type",
            flex: 1,
        },
        {
            field: "amount",
            headerName: "Amount",
            flex: 1,
        },
        {
            field: "details",
            headerName: "Details",
            flex: 1,
        },
        {
            field: "createdBy",
            headerName: "Created By",
            flex: 1,
        },
        {
            field: "date",
            headerName: "Date",
            flex: 1,
        }
    ];

  
    return (
      <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
        <CardHeader>
          <Title>User Payment History</Title>
          {/* <Select size="small" defaultValue="this_month">
            <MenuItem value="this_month">This Month</MenuItem>
            <MenuItem value="last_month">Last Month</MenuItem>
          </Select> */}
        </CardHeader>
  
        <Box overflow="auto">
          <ProductTable>
          <DataGrid
          rows={mockDataUserPaymentHistory}
          columns={columns}
          checkboxSelection
        />
          </ProductTable>
        </Box>
      </Card>
    );
  };
  
  export default UserPaymentHistory;
  
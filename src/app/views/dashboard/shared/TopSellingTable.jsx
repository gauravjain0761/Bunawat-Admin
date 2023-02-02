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
  height: 350,
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

const TopSellingTable = () => {
  const { palette } = useTheme();
  const bgError = palette.error.main;
  const bgPrimary = palette.primary.main;
  const bgSecondary = palette.secondary.main;

  const columns = [
    { field: 'id', headerName: 'id', sortable: true, minWidth: 20 },
    {
      field: 'name', headerName: 'Name',
      flex: 1,
      minWidth: 200,
      renderCell: ({ row: { imgUrl, name } }) => {
        return (
          <Box display="flex" alignItems="center">
            <Avatar src={imgUrl} />
            <Paragraph sx={{ m: 0, ml: 4 }}>{name}</Paragraph>
          </Box>
        );
      },
    },
    {
      field: 'price', headerName: 'Revenue',
      flex: 1,
      renderCell: ({ row: { price } }) => {
        return (
          <Box>
            ${price > 999 ? (price / 1000).toFixed(1) + 'k' : price}
          </Box>
        );
      },
    },
    {
      field: 'available', headerName: 'Stock Status',
      flex: 1,
      renderCell: ({ row: { available } }) => {
        return (
          <Box>
            {available ? (
              available < 20 ? (
                <Small bgcolor={bgSecondary}>{available} available</Small>
              ) : (
                <Small bgcolor={bgPrimary}>in stock</Small>
              )
            ) : (
              <Small bgcolor={bgError}>out of stock</Small>
            )}
          </Box>
        );
      },
    },
    {
      field: 'id1', headerName: 'Action',
      flex: 1,
      renderCell: ({ row: { available } }) => {
        return (
          <Box>
            <IconButton>
              <Icon color="primary">edit</Icon>
            </IconButton>
          </Box>
        );
      },
    },
  ];

  return (
    <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
      <CardHeader>
        <Title>top selling products</Title>
        <Select size="small" defaultValue="this_month">
          <MenuItem value="this_month">This Month</MenuItem>
          <MenuItem value="last_month">Last Month</MenuItem>
        </Select>
      </CardHeader>

      <Box overflow="auto">
        <ProductTable>
          <DataGrid
            rows={productList}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
          />
        </ProductTable>
      </Box>
    </Card>
  );
};

const productList = [
  {
    id: 1,
    imgUrl: '/assets/images/dashboard/product-1.png',
    name: 'Product-1',
    price: 1100,
    available: 15,
  },
  {
    id: 2,
    imgUrl: '/assets/images/dashboard/product-2.png',
    name: 'Product-2',
    price: 1500,
    available: 30,
  },
  {
    id: 3,
    imgUrl: '/assets/images/dashboard/product-3.png',
    name: 'Product-3',
    price: 2500,
    available: 30,
  },
];

export default TopSellingTable;

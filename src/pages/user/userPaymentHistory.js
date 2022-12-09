import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../component/Header";
import { useTheme } from "@mui/material";
import { mockDataUserPaymentHistory } from "../../data/user/userPaymentHistory";

const UserPaymentHistory = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        {
            field: "id", headerName: "ID",
            sortable: false,
            disableColumnMenu: true, flex: 0.5
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            cellClassName: "name-column--cell"
        },
        {
            field: "type",
            headerName: "Type",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        },
        {
            field: "amount",
            sortable: false,
            disableColumnMenu: true,
            headerName: "Amount",
            flex: 1,
        },
        {
            field: "details",
            headerName: "Details",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        },
        {
            field: "createdBy",
            headerName: "Created By",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        },
        {
            field: "date",
            headerName: "Date",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        }
    ];

    return (
        <Box m="20px">
            <Header
                title="User Payment History"
                subtitle=""
            />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: colors.blueAccent[700],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[700],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.grey[100]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={mockDataUserPaymentHistory}
                    columns={columns}
                // components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default UserPaymentHistory;

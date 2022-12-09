import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../component/Header";
import { useTheme } from "@mui/material";
import { mockDataUserList } from "../../data/user/userList";

const Userlist = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        {
            field: "id",
            sortable: false,
            disableColumnMenu: true, headerName: "ID", flex: 0.5
        },
        {
            field: "userName",
            sortable: false,
            disableColumnMenu: true, headerName: "UserName"
        },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
            cellClassName: "name-column--cell",
        },
        {
            field: "email",
            headerName: "Email",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        },
        {
            field: "role",
            headerName: "Role",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
        },
        {
            field: "wallentBalance",
            headerName: "Wallent Balance",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        },
        {
            field: "gender",
            headerName: "Gender",
            sortable: false,
            disableColumnMenu: true,
            flex: 1,
        },
    ];

    return (
        <Box m="20px">
            <Header
                title="User List"
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
                    rows={mockDataUserList}
                    columns={columns}
                // components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default Userlist;

import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../component/Header";
import { useTheme } from "@mui/material";
import { mockDataUserWishList } from "../../data/user/userWishlist";

const UserWishlist = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        {
            field: "id", headerName: "ID",
            sortable: false,
            disableColumnMenu: true, flex: 0.5
        },
        {
            field: "title",
            sortable: false,
            disableColumnMenu: true, headerName: "Title"
        },
        {
            field: "author",
            headerName: "Author",
            flex: 1,
            cellClassName: "name-column--cell",
            sortable: false,
            disableColumnMenu: true,
        },
        {
            field: "privacy",
            headerName: "Privacy",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
        },
        {
            field: "wishlistNo",
            headerName: "Items In Wishlists",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
        },
        {
            field: "followersNo",
            headerName: "Followers",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
        },
        {
            field: "date",
            headerName: "Date Of Creation",
            flex: 1,
            sortable: false,
            disableColumnMenu: true,
        },
    ];

    return (
        <Box m="20px">
            <Header
                title="User Wishlist"
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
                    rows={mockDataUserWishList}
                    columns={columns}
                // components={{ Toolbar: GridToolbar }}
                />
            </Box>
        </Box>
    );
};

export default UserWishlist;

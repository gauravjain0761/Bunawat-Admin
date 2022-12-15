import {
    Box,
    Button,
    Card,
    Checkbox,
    Container,
    FormControl,
    Grid,
    Icon,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Select,
    Stack,
    styled,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Paragraph, Span } from 'app/components/Typography';
import { useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import Avatar from 'react-avatar';
import { UIColor } from 'app/utils/constant';
import { mockDataProductSize } from 'fake-db/data/product/size/sizeList';
import { mockDataProductColor } from 'fake-db/data/product/color/colorList';
import { mockDataProductAttribute } from 'fake-db/data/product/attribute/attributeList';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { SimpleCard } from 'app/components';
import { isMdScreen, isMobile } from 'app/utils/utils';
import DeleteModel from 'app/views/models/deleteModel';
import { mockDataCategoryTreeManagement } from 'fake-db/data/category/categoryTreeList';

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

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const ParentCategory = () => {
    const { palette } = useTheme();
    const bgError = palette.error.main;
    const bgPrimary = palette.primary.main;
    const bgSecondary = palette.secondary.main;

    const navigate = useNavigate();

    const [formData, setFormData] = useState({});

    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
    };

    const handleChange = (event) => {
        if (event.target.name == "home") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const {
        name,
        pCategory,
        subName
    } = formData;

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);
    const openAnchor = Boolean(anchorEl);
    const handleClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const columns = [
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "description",
            headerName: "Description",
            flex: 1,
        },
        {
            field: "slug",
            headerName: "Code",
            flex: 1,
        },
        {
            field: "count",
            headerName: "Count",
            flex: 1,
        },
        {
            field: "active",
            headerName: "Status",
            flex: 1,
            renderCell: ({ row: { active } }) => {
                return (
                    <>
                        {active ?
                            <Typography sx={{ width: 'fit-content', flexShrink: 0, fontSize: "14px", color: "green", textTransform: "capitalize" }}>
                                Active
                            </Typography>
                            :
                            <Typography sx={{ width: 'fit-content', flexShrink: 0, fontSize: "14px", color: "red", fontWeight: 500, textTransform: "capitalize" }}>
                                InActive
                            </Typography>
                        }
                    </>
                );
            }
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
                                handleClose();
                            }}>
                            <Icon color="primary">edit</Icon>
                        </IconButton>
                        <IconButton
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setOpen(true);
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
        <Card elevation={3} sx={{ mb: 3 }}>
            <CardHeader sx={{ mt: 2 }}>
                <Title>Parent Category List</Title>
                <Button onClick={() => navigate(`/category/details/parent`)} sx={{
                    backgroundColor: UIColor, color: "#fff",
                    "&:hover": {
                        backgroundColor: UIColor, color: "#fff"
                    }
                }}>Add Parent Category</Button>
            </CardHeader>
            <Box overflow="auto" sx={{ mt: 2 }}>
                <ProductTable>
                    <DataGrid
                        rows={mockDataCategoryTreeManagement}
                        columns={columns}
                        checkboxSelection
                        disableSelectionOnClick
                        disableColumnMenu
                    />
                </ProductTable>
            </Box>

            <DeleteModel open={open} handleClose={() => setOpen(false)} />
        </Card>
    );
};

export default ParentCategory;

import {
    Box,
    Button,
    Card,
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
    height: '40vh',
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

const AttributeList = () => {
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
        id,
        name,
        slug,
        orderBy,
    } = formData;

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
        { field: "id", headerName: "ID", flex: 0.5 },
        {
            field: "name",
            headerName: "Name",
            flex: 1,
            cellClassName: "name-column--cell",
            renderCell: ({ row: { name, slug } }) => {
                return (
                    <Box display="flex" sx={{
                        cursor: "pointer",
                        "&:hover": {
                            color: "blue",
                        },
                    }} alignItems="center" onClick={() => navigate(`/product/${slug}`)}>
                        {name}
                    </Box >
                );
            }
        },
        {
            field: "slug",
            headerName: "Slug",
            flex: 1,
        },
        {
            field: "orderBy",
            headerName: "Order By",
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
            <Stack spacing={3}>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <SimpleCard title="Add Attribute">
                        <Grid container spacing={12}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>

                                <TextField
                                    type="text"
                                    name="name"
                                    label="Name"
                                    onChange={handleChange}
                                    value={name || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="slug"
                                    label="slug"
                                    value={slug || ""}
                                    onChange={handleChange}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Order By</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={orderBy}
                                        name="orderBy"
                                        label="Order By"
                                        onChange={handleChange}>
                                        <MenuItem value="Custom ordering">Custom ordering</MenuItem>
                                        <MenuItem value="Name">Name</MenuItem>
                                        <MenuItem value="Name (numeric)">Name (numeric)</MenuItem>
                                        <MenuItem value="Term ID">Term ID</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>

                        </Grid>
                        <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                            <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                                <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }}>
                                    <Icon>send</Icon>
                                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                                </Button>
                            </Box>
                        </Box>
                    </SimpleCard>

                </ValidatorForm>
            </Stack>
            <CardHeader sx={{ mt: 2 }}>
                <Title>Attribute List</Title>
            </CardHeader>
            <Box overflow="auto" sx={{ mt: 2 }}>
                <ProductTable>
                    <DataGrid
                        rows={mockDataProductAttribute}
                        columns={columns}
                        checkboxSelection
                        disableSelectionOnClick
                        disableColumnMenu
                    />
                </ProductTable>
            </Box>
        </Card>
    );
};

export default AttributeList;

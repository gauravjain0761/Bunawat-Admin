import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Container, Fade, FormControl, FormControlLabel, FormLabel, Grid, Icon, IconButton, Menu, MenuItem, Radio, RadioGroup, Stack, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { SimpleCard } from 'app/components';
import { toast } from 'material-react-toastify';
import { isMdScreen, isMobile } from 'app/utils/utils';
import { Span } from 'app/components/Typography';
import { ApiGet, ApiPost } from 'app/service/api';
import { API_URL } from 'app/constant/api';
import DeleteAttributesModel from 'app/views/product/model/deleteAttributesModel';
import { LoadingButton } from '@mui/lab';
import DeleteAllModel from 'app/views/models/deleteModel';

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));


const AttributeList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState({});
    const [loading, setLoading] = useState(false);
    const [deleteData, setDeleteData] = useState(null);
    const [deleteAllOpen, setDeleteAllOpen] = useState(false);

    const getData = async () => {
        await ApiGet(`${API_URL.getAttributes}?page=${page}&limit=${rowsPerPage}&q=${searchText}`)
            .then((response) => {
                setRows(response?.data ?? []);
                setTotalCount(response?.totalCount);
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        getData();
    }, [page, rowsPerPage, searchText])

    const handleSubmit = async (event) => {
        setLoading(true)
        await ApiPost(`${API_URL.addAttribute}`, {
            name: formData?.name?.trim() ?? '',
            multiselect: false,
        })
            .then((response) => {
                setLoading(false)
                toast.success('Add Successfully!')
                setFormData({ ...formData, name: "", multiselect: false });
                getData();
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error?.error)
                console.log("Error", error);
            });
    };

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const columns = [
        {
            id: "name",
            label: "Name",
            width: 100
        },
        {
            id: "slug",
            label: "Slug",
            width: 80
        },
        // {
        //     id: "multiselect",
        //     label: "Type",
        //     align: "center",
        //     width: 80
        // },
        {
            id: "count",
            label: "Variant",
            sortDisable: true,
            width: 250
        },
        {
            id: "isActive",
            label: "Status",
            align: "center",
            width: 80
        },
        {
            id: "action",
            label: "Action",
            action: true,
            align: 'right',
            width: 80,
            sortDisable: true,
            renderCell: (
                <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        sx={{ color: "#fff" }}
                        aria-controls={Boolean(actionAllOpen) ? 'long-menu' : undefined}
                        aria-expanded={Boolean(actionAllOpen) ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(e) => setActionAllOpen(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={actionAllOpen}
                        open={Boolean(actionAllOpen)}
                        onClose={() => setActionAllOpen(null)}
                        TransitionComponent={Fade}>
                        <MenuItem onClick={() => {
                            setDeleteAllOpen(true);
                            setActionAllOpen(null)
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            )
        }
    ];

    const editStatusData = async (id, status) => {
        // await ApiPut(`${API_URL.editCollect}/${id}`, {
        //   isActive: status
        // })
        //   .then((response) => {
        // toast.success('Edit Successfully!')
        //     getData(type)
        //     handleActionClose()
        //   })
        //   .catch((error) => {
        // toast.error(error?.error)
        //     console.log("Error", error);
        //   });
    }

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n?._id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        console.log("namename", name)
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
        setPage(1);
    };

    const {
        name,
        multiselect,
    } = formData;

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
    const handleError = async (event) => {
        let tempError = { ...formError }
        setFormError(tempError)
    }

    return (
        <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
            <Container>
                <Stack spacing={3}>
                    <ValidatorForm onSubmit={handleSubmit} onError={handleError}>
                        <SimpleCard title="Add Attribute">
                            <Grid container spacing={12}>
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>

                                    <TextField
                                        sx={{
                                            width: "100%",
                                            marginBottom: "16px",
                                        }}
                                        type="text"
                                        name="name"
                                        label="Name"
                                        onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                                        value={name || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />

                                    {/* <FormControl sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'center'
                                    }}>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>Multiselect</FormLabel>
                                        <RadioGroup
                                            row
                                            value={multiselect ?? false}
                                            onChange={handleChange}
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="multiselect">
                                            <FormControlLabel value={true} control={<Radio />} label="Enable" />
                                            <FormControlLabel value={false} control={<Radio />} label="Disable" />
                                        </RadioGroup>
                                    </FormControl> */}

                                </Grid>

                            </Grid>
                            <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                                <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                                    <LoadingButton
                                        loading={loading}
                                        loadingPosition="start"
                                        type="submit"
                                        sx={{ mr: 2, mt: 2 }}
                                        startIcon={<Icon>send</Icon>}
                                        variant="contained">
                                        Save
                                    </LoadingButton>
                                </Box>
                            </Box>
                        </SimpleCard>
                    </ValidatorForm>
                </Stack>
            </Container>
            <Box sx={{
                mt: 2,
                display: 'flex',
                paddingLeft: '24px',
                paddingRight: '24px',
                marginBottom: '12px',
                alignItems: 'center',
                justifyContent: 'space-between',
            }} className="searchBoxSeaprate">
                <Title>Attribute List</Title>
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
                </Box>
            </Box>
            <TableComponent
                rows={rows}
                columns={columns}
                totalCount={totalCount}
                selected={selected}
                renderRow={(row, index) => {
                    const isItemSelected = isSelected(row?._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row?._id}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    onClick={(event) => handleClick(event, row._id)}
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </TableCell>
                            <TableCell>{row.name} </TableCell>
                            <TableCell>{row.slug}</TableCell>
                            {/* <TableCell align="center">
                                {row?.multiselect ? 'Multiselect' : 'Single'}
                            </TableCell> */}
                            <TableCell>
                                {row?.variants?.map((item) => item?.name)?.join(", ")}
                            </TableCell>
                            <TableCell align="center">
                                {row?.isActive ?
                                    <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "green", textTransform: "capitalize" }}>
                                        Active
                                    </Typography>
                                    :
                                    <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "red", fontWeight: 500, textTransform: "capitalize" }}>
                                        InActive
                                    </Typography>
                                }
                            </TableCell>
                            <TableCell align='right' sx={{ pr: "18px" }}>
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={Boolean(actionOpen[index]) ? 'long-menu' : undefined}
                                    aria-expanded={Boolean(actionOpen[index]) ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => handleActionClick(e, index)}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="fade-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={actionOpen[index]}
                                    open={Boolean(actionOpen[index])}
                                    onClose={handleActionClose}
                                    TransitionComponent={Fade}>
                                    {/* <MenuItem onClick={() => editStatusData(row?._id, !row?.isActive)}>{!row?.isActive ? "Active" : "InActive"}  </MenuItem> */}
                                    <MenuItem onClick={() => {
                                        navigate(`/product/attributes/${row?._id}`)
                                    }}>Add</MenuItem>
                                    <MenuItem onClick={() => {
                                        setDeleteData(row)
                                        setOpen(true);
                                        handleActionClose();
                                    }}>Delete</MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    );
                }}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleChangePage={handleChangePage}
                handleSelectAllClick={handleSelectAllClick}
            />

            <DeleteAttributesModel open={open} deleteData={deleteData} getData={getData} handleClose={() => {
                setDeleteData(null);
                setOpen(false);
            }} />


            <DeleteAllModel open={deleteAllOpen} handleClose={() => {
                setDeleteAllOpen(false);
            }} />
        </Card>
    );
}

export default AttributeList;
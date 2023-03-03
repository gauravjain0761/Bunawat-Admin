import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Collapse, Fade, Icon, IconButton, Menu, MenuItem, Table, TableBody, TableContainer, TableHead, TextField, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import { toast } from 'material-react-toastify';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { mockDataInventoryManagement } from 'fake-db/data/inventory/inventoryData';
import MoveQTYModel from 'app/views/inventory/model/moveQTY';
import { API_URL } from 'app/constant/api';
import { ApiGet, ApiPut } from 'app/service/api';
import { LoadingButton } from '@mui/lab';

const InventoryList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [moveQTYPopUP, setMoveQTYPopUP] = useState(false);
    const [saveChanges, setSaveChanges] = useState(false);
    const [changeData, setChangeData] = useState([]);
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);
    const [singleMoveQTY, setSingleMoveQTY] = useState({});
    const [selectedSKU, setSelectedSKU] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState([]);
    const [loading, setLoading] = useState(false);
    const [actionCollapseOpen, setActionCollapseOpen] = useState([]);
    const [collapseOpen, setCollapseOpen] = useState([]);
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [rowLoading, setRowLoading] = useState(false);
    const columns = [
        {
            id: "design_num",
            label: `Design \nNo/SKU`,
            width: 120
        },
        {
            id: "name",
            label: "Product \nName",
            width: 100
        },
        {
            id: "variant_count",
            label: "Variant \nCount",
            align: "center",
            width: 80
        },
        {
            id: "total_inStock_qty",
            label: "InStock \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "total_preOrder_qty",
            label: "PreOrder \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "total_product_qty",
            label: "Total \nQTY",
            align: "center",
            width: 80
        },
        {
            id: "total_threshold_qty",
            label: "Threshold \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "mappedvariant",
            label: "Mapped \nVariant",
            align: "center",
            width: 100
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
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => {
                            setOpen(true);
                            setActionAllOpen(null)
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            )
        }
    ];


    const getData = async () => {
        setRowLoading(true)
        await ApiGet(`${API_URL.getProducts}?page=${page}&limit=${rowsPerPage}&q=${searchText}`)
            .then((response) => {
                setRowLoading(false)
                setRows(response?.data ?? []);
                setActionOpen(response?.data?.map(() => { return null }))
                setActionCollapseOpen(response?.data?.map((x) => { return x?.sku_data?.map(() => { return null }) }))
                setCollapseOpen(response?.data?.map(() => { return false }))
                setTotalCount(response?.totalCount);
                // setRows(mockDataInventoryManagement);
                // setActionOpen(mockDataInventoryManagement.map(() => { return null }))
                // setActionCollapseOpen(mockDataInventoryManagement.map((x) => { return x?.sku_data?.map(() => { return null }) }))
                // setCollapseOpen(mockDataInventoryManagement.map(() => { return false }))
                // setTotalCount(1);
            })
            .catch((error) => {
                setRowLoading(false)
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        getData();
    }, [page, rowsPerPage, searchText])

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n?._id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
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

    const handleCollapseClick = (index) => {
        let temp = [...collapseOpen];
        if (!temp[index]) {
            temp = temp.map(() => { return false })
        }
        temp[index] = !temp[index]
        setCollapseOpen(temp)
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

    const handleActionCollapseClick = (event, index, c_index) => {
        event.preventDefault();
        event.stopPropagation();
        let temp = [...actionCollapseOpen];
        if (!temp[index][c_index]) {
            temp = temp.map((x) => { return x.map(() => { return null }) })
        }
        temp[index][c_index] = event.currentTarget
        setActionCollapseOpen(temp)
    };

    const handleActionCollapseClose = () => {
        let temp = [...actionCollapseOpen];
        temp = temp.map((x) => { return x.map(() => { return null }) })
        setActionCollapseOpen(temp)
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

    const handleChange = (event, main, child) => {
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        let tempData = [...rows]
        let tempSKUData = [...tempData?.[main]?.sku_data]
        let tempChangeData = [...changeData]
        tempSKUData[child] = { ...tempSKUData[child], [event.target.name]: onlyNums }
        tempData[main] = { ...tempData[main], sku_data: tempSKUData }
        if (tempChangeData?.filter(x => x?._id == tempSKUData?.[child]?._id)?.length > 0) {
            let findIndex = tempChangeData?.findIndex(x => x?._id == tempSKUData?.[child]?._id)
            tempChangeData[findIndex] = {
                ...tempChangeData[findIndex],
                [event.target.name]: onlyNums
            }
        } else {
            tempChangeData = [...tempChangeData, {
                "inStock_qty": tempSKUData?.[child]?.inStock_qty,
                "preOrder_qty": tempSKUData?.[child]?.preOrder_qty,
                "_id": tempSKUData?.[child]?._id,
            }]
        }
        setChangeData(tempChangeData)
        // setRows(tempData);
        setSaveChanges(true);
    };

    const handleSubmitData = async () => {
        setLoading(true)
        await ApiPut(`${API_URL.editSKU}`, changeData)
            .then((response) => {
                setLoading(false)
                setSaveChanges(false)
                setChangeData([])
                toast.success('Edit Successfully!')
                getData();
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error?.error)
                console.log("Error", error);
            });
    }

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
    return (
        <Box sx={{ position: 'relative' }}>
            <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
                <Box className="searchBoxSeaprate"
                    sx={{
                        paddingLeft: "10px !important",
                        paddingRight: "10px !important",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}
                >
                    <Title>Inventory List</Title>
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

                        {/* <Button color="primary" variant="contained" type="submit" onClick={() => navigate(`/inventory/add`)} sx={{
                        backgroundColor: UIColor, color: "#fff",
                        "&:hover": {
                            backgroundColor: UIColor, color: "#fff"
                        }
                    }}>
                        <Icon>add</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add Inventory</Span>
                    </Button> */}
                    </Box>
                </Box>
                <TableComponent
                    rows={rows}
                    columns={columns}
                    isLoading={rowLoading}
                    extraPaddingOnFirstColumn={true}
                    disableCheckBox={true}
                    selected={selected}
                    totalCount={totalCount}
                    renderRow={(row, index) => {
                        const isItemSelected = isSelected(row?._id);
                        const labelId = `enhanced-table-checkbox-${index}`;
                        return (
                            <>
                                <TableRow
                                    hover
                                    role="checkbox"
                                    aria-checked={isItemSelected}
                                    tabIndex={-1}
                                    key={row?._id}
                                    selected={isItemSelected}
                                >
                                    <TableCell sx={{ pl: '15px' }}>{row?.design_num}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {row?.image && <img style={{ marginRight: '5px' }} src={row?.image} width='50px' height='50px' />
                                            }
                                            {row?.name}
                                        </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{ cursor: 'pointer', color: '#2271b1' }} onClick={() => handleCollapseClick(index)}>{row?.variant_count}</TableCell>
                                    <TableCell align="center">{row?.total_inStock_qty}</TableCell>
                                    <TableCell align="center">{row?.total_preOrder_qty}</TableCell>
                                    <TableCell align="center">{row?.total_product_qty}</TableCell>
                                    <TableCell align="center">{row?.total_threshold_qty}</TableCell>
                                    <TableCell align="center"></TableCell>
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
                                            // open={Boolean(actionOpen[index])}
                                            open={false}
                                            onClose={handleActionClose}
                                            TransitionComponent={Fade}
                                        >
                                            <MenuItem onClick={() => {
                                                // setOpen(true);
                                                // handleActionClose();
                                            }}>Add Variant</MenuItem>
                                        </Menu>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }} colSpan={9}>
                                        <Collapse in={collapseOpen[index]} timeout="auto" unmountOnExit>
                                            <TableComponent
                                                rows={row?.sku_data ?? []}
                                                columns={columns}
                                                disableColumns={true}
                                                disableCheckBox={true}
                                                extraDisable={true}
                                                disablePagination={true}
                                                renderRow={(sku_row, c_index) => {
                                                    return (
                                                        <TableRow
                                                            hover
                                                            role="checkbox"
                                                            tabIndex={-1}
                                                            key={sku_row?._id}
                                                        >
                                                            <TableCell align="center" width={120 ?? "100%"}>↳ {sku_row?.sku}</TableCell>
                                                            <TableCell width={100 ?? "100%"}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    {sku_row?.product_name}
                                                                </Box>
                                                            </TableCell>
                                                            <TableCell width={80 ?? "100%"} align="center">Variation</TableCell>
                                                            <TableCell width={100 ?? "100%"} align="center">
                                                                <TextField
                                                                    type="text"
                                                                    name="inStock_qty"
                                                                    label="In Stock"
                                                                    onChange={(e) => handleChange(e, index, c_index)}
                                                                    value={changeData?.length > 0 ? (changeData?.filter(x => x?._id == sku_row?._id)?.length > 0 ? changeData?.find(x => x?._id == sku_row?._id)?.inStock_qty : sku_row?.inStock_qty || "") : sku_row?.inStock_qty || ""}
                                                                    validators={["required"]}
                                                                    errorMessages={["this field is required"]}
                                                                />
                                                            </TableCell>
                                                            <TableCell width={100 ?? "100%"} align="center">
                                                                <TextField
                                                                    type="text"
                                                                    name="preOrder_qty"
                                                                    label="Preorder"
                                                                    onChange={(e) => handleChange(e, index, c_index)}
                                                                    value={changeData?.length > 0 ? (changeData?.filter(x => x?._id == sku_row?._id)?.length > 0 ? changeData?.find(x => x?._id == sku_row?._id)?.preOrder_qty : sku_row?.preOrder_qty || "") : sku_row?.preOrder_qty || ""}
                                                                    validators={["required"]}
                                                                    errorMessages={["this field is required"]}
                                                                />
                                                            </TableCell>
                                                            <TableCell width={80 ?? "100%"} align="center">{sku_row?.total_qty}</TableCell>
                                                            <TableCell width={100 ?? "100%"} align="center">{sku_row?.threshold}</TableCell>
                                                            <TableCell width={100 ?? "100%"} align="center">{sku_row?.mapVariant?.join(", ")}</TableCell>
                                                            <TableCell width={80 ?? "100%"} align='right' sx={{ pr: "18px" }}>
                                                                <IconButton
                                                                    aria-label="more"
                                                                    id="long-button"
                                                                    aria-controls={Boolean(actionCollapseOpen[index][c_index]) ? 'long-menu' : undefined}
                                                                    aria-expanded={Boolean(actionCollapseOpen[index][c_index]) ? 'true' : undefined}
                                                                    aria-haspopup="true"
                                                                    onClick={(e) => handleActionCollapseClick(e, index, c_index)}>
                                                                    <MoreVertIcon />
                                                                </IconButton>
                                                                <Menu
                                                                    id="fade-menu"
                                                                    MenuListProps={{
                                                                        'aria-labelledby': 'fade-button',
                                                                    }}
                                                                    anchorEl={actionCollapseOpen[index][c_index]}
                                                                    open={Boolean(actionCollapseOpen[index][c_index])}
                                                                    onClose={handleActionCollapseClose}
                                                                    TransitionComponent={Fade}>
                                                                    <MenuItem onClick={() => {
                                                                        setMoveQTYPopUP(true);
                                                                        setSingleMoveQTY(sku_row)
                                                                        setSelectedSKU(row?.sku_data ?? [])
                                                                        handleActionCollapseClose();
                                                                    }}>Edit</MenuItem>
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
                                        </Collapse>
                                    </TableCell>
                                </TableRow>
                            </>
                        );
                    }}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    handleChangePage={handleChangePage}
                    handleSelectAllClick={handleSelectAllClick}
                />

                <DeleteModel open={open} handleClose={() => setOpen(false)} />
                <MoveQTYModel open={moveQTYPopUP} handleClose={() => {
                    setMoveQTYPopUP(false)
                    setSingleMoveQTY({})
                }} data={singleMoveQTY} selectedSKU={selectedSKU} getData={getData} />
            </Card>
            {saveChanges &&
                <Box sx={{
                    width: '100%', height: '60px', background: '#fff',
                    position: 'sticky',
                    bottom: 0,
                    boxShadow: '0 -8px 16px 0 rgb(85 93 102 / 30%)'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <Box sx={{
                            mr: 3
                        }}>
                            <Button onClick={() => {
                                setChangeData([])
                                setSaveChanges(false)
                            }} sx={{ border: '1px solid #232a45', color: '#232a45' }}>
                                Discard changes
                            </Button>
                            <LoadingButton
                                loading={loading}
                                loadingPosition="center"
                                onClick={handleSubmitData}
                                sx={{
                                    background: '#232a45', ml: 2, color: '#fff',
                                    "&:hover": {
                                        background: '#232a45', color: '#fff'
                                    }
                                }}
                                variant="contained">
                                Save all changes
                            </LoadingButton>
                        </Box>
                    </Box>
                </Box>
            }
        </Box>
    );
}

export default InventoryList;
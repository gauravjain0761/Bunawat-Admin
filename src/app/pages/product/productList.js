import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, ClickAwayListener, Fade, Icon, IconButton, Menu, MenuItem, Paper, Stack, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { Span } from 'app/components/Typography';
import { API_URL } from 'app/constant/api';
import { toast } from 'material-react-toastify';
import { ApiGet, ApiPut } from 'app/service/api';
import DeleteAllModel from 'app/views/models/deleteModel';
import DeleteProductModel from 'app/views/category/model/deleteProductModel';
import DragTableComponent, { DragHandle } from 'app/components/table/dragTable';
import { arrayMove, SortableElement } from 'react-sortable-hoc';

const ProductList = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const getSearchQuery = searchParams.get("collection")
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);
    const [rowLoading, setRowLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalCount, setTotalCount] = useState(0);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [deleteData, setDeleteData] = useState(null);
    const [deleteAllOpen, setDeleteAllOpen] = useState(false);

    const columns = [
        {
            id: "name",
            label: "Name",
            width: 200
        },
        {
            id: "design_num",
            label: "Design No",
            width: 100
        },
        {
            id: "variant_count",
            label: "Variant Count",
            align: "center",
            width: 120
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
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => {
                            setDeleteAllOpen(true);
                            setActionAllOpen(null)
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            )
        }
    ];

    const getData = async () => {
        setRowLoading(true)
        await ApiGet(`${API_URL.getProducts}?page=${page}&limit=${rowsPerPage}&q=${searchText}&id=${getSearchQuery ? getSearchQuery : ""}`)
            .then((response) => {
                setRowLoading(false)
                setRows(response?.data ?? []);
                setTotalCount(response?.totalCount);
            })
            .catch((error) => {
                setRowLoading(false)
                console.log("Error", error);
            });
    }

    const editInActiveStatusData = async (id, status) => {
        await ApiPut(`${API_URL.editProduct}/${id}`, {
            status: "INACTIVE"
        })
            .then((response) => {
                toast.success('Edit Successfully!')
                getData()
                handleActionClose()
            })
            .catch((error) => {
                toast.error(error?.error)
                console.log("Error", error);
            });
    }

    const editActiveStatusData = async (id, status) => {
        await ApiPut(`${API_URL.editProduct}/${id}`, {
            status: "ACTIVE"
        })
            .then((response) => {
                toast.success('Edit Successfully!')
                getData()
                handleActionClose()
            })
            .catch((error) => {
                toast.error(error?.error)
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        getData();
    }, [page, rowsPerPage, searchText, getSearchQuery])

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n._id);
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

    const handleActionClick = (event, index) => {
        event.preventDefault();
        event.stopPropagation();
        let temp = [...actionOpen];
        if (!temp[index]) {
            temp = temp.map(() => { return null })
        }
        temp[index] = event.currentTarget
        console.log(index, "temp", temp)
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


    const isSelected = (name) => selected.indexOf(name) !== -1;

    const getIndex = (newIndex) => {
        if (page == 1) {
            return newIndex
        }
        return ((page - 1) * rowsPerPage) + newIndex
    }

    const onSortEnd = async ({ oldIndex, newIndex }) => {
        if (oldIndex != newIndex) {
            await ApiPut(`${API_URL.editProductOrdering}`, {
                item_id: rows[oldIndex]?._id,
                order: getIndex(newIndex)
            })
                .then((response) => {
                    getData();
                    toast.success('Drag Successfully!')
                })
                .catch((error) => {
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        }
    }

    const SortableItem = SortableElement(({ row, mainIndex }) => {
        const isItemSelected = isSelected(row._id);
        const labelId = `enhanced-table-checkbox-${mainIndex}`;
        return (
            <TableRow
                hover
                role="checkbox"
                aria-checked={isItemSelected}
                tabIndex={-1}
                key={mainIndex}
                selected={isItemSelected}
            >
                <TableCell sx={{ textAlign: 'center' }}>
                    <DragHandle />
                </TableCell>
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
                <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', pr: 2, gap: 2 }}>
                        <Box sx={{ width: "60px", height: "60px" }}>
                            <img src={row?.image ? row?.image : "/assets/images/bunawat_avatar.svg"} width='50px' height='50px' />
                        </Box>
                        <Typography sx={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'initial',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                        }}>
                            {row?.name}
                        </Typography>
                    </Box>
                </TableCell>
                <TableCell>{row?.design_num}</TableCell>
                <TableCell align="center">{row?.variant_count}</TableCell>
                <TableCell align="center">
                    <Typography sx={{
                        flexShrink: 0, fontSize: "14px", color: (theme) =>
                            row?.status === "ACTIVE" ?
                                theme.palette.success.main
                                :
                                row?.status === "INACTIVE" ?
                                    theme.palette.error.main
                                    :
                                    theme.palette.success.light
                        , textTransform: "capitalize"
                    }}>
                        {row?.status}
                    </Typography>

                </TableCell>
                <TableCell align='right' sx={{ pr: "18px" }}>
                    <Box position='relative'>
                        <IconButton
                            aria-label="more"
                            id="long-button"
                            aria-controls={Boolean(actionAllOpen) ? 'long-menu' : undefined}
                            aria-expanded={Boolean(actionAllOpen) ? 'true' : undefined}
                            aria-haspopup="true"
                            onClick={(e) => handleActionClick(e, mainIndex)}>
                            <MoreVertIcon />
                        </IconButton>
                        <ClickAwayListener onClickAway={handleActionClose}>
                            <Box sx={{ width: '100px', zIndex: 999, boxShadow: 'rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px', borderRadius: '4px', height: 'auto', background: '#fff', position: 'absolute', bottom: '-12px', right: '15px', display: Boolean(actionOpen[mainIndex]) ? 'block' : 'none', padding: '8px 0px' }}>
                                <MenuItem onTouchEnd={() => {
                                    if (row?.status === "ACTIVE") {
                                        editInActiveStatusData(row?._id, !row?.status)
                                    } else if (row?.status === "INQUALITY" || row?.status === "INACTIVE") {
                                        editActiveStatusData(row?._id, !row?.status)
                                    }

                                }} onClick={() => {
                                    if (row?.status === "ACTIVE") {
                                        editInActiveStatusData(row?._id, !row?.status)
                                    } else if (row?.status === "INQUALITY" || row?.status === "INACTIVE") {
                                        editActiveStatusData(row?._id, !row?.status)
                                    }

                                }}>{row?.status === "ACTIVE" ? "InActive" : "Active"}  </MenuItem>
                                <MenuItem onTouchEnd={() => {
                                    navigate(`/product/add/${row?._id}`)
                                }} onClick={() => navigate(`/product/add/${row?._id}`)}>Edit</MenuItem>
                                <MenuItem onClick={() => {
                                    setDeleteData(row)
                                    setOpen(true);
                                    handleActionClose();
                                }} onTouchEnd={() => {
                                    setDeleteData(row)
                                    setOpen(true);
                                    handleActionClose();
                                }}>Delete</MenuItem>
                            </Box>
                        </ClickAwayListener>
                    </Box>
                </TableCell>
            </TableRow>
        )
    });

    const RowData = SortableElement(({ row, mainIndex, ...other }) => {
        return (
            <SortableItem key={`item-${row._id}`} index={mainIndex} mainIndex={mainIndex} row={row} />
        );
    })

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
                <Title>Product List</Title>
                <Box display="flex" className="searchBoxSeaprate">
                    <Stack direction="row" spacing={{ md: 3, sm: 1, xs: 1 }}>
                        <Box display="flex" alignItems="center" className="searchBoxWidth" sx={{
                            border: "1px solid #000",
                            borderRadius: "6px",
                            mr: "0px",
                        }}>
                            <Box
                                component="input"
                                sx={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    p: 0,
                                    paddingLeft: '20px',
                                    height: '36px',
                                    background: "transparent",
                                    color: "#000",
                                }}
                                type="text"
                                value={searchText}
                                onChange={(e) => {
                                    setSearchText(e.target.value)
                                }}
                                placeholder="Search here..." />
                            <IconButton onClick={() => setSearchText('')} sx={{ verticalAlign: 'middle' }}>
                                <Icon sx={{ color: "#000" }}>{!searchText ? 'search' : 'close'}</Icon>
                            </IconButton>
                        </Box>

                        <Button color="primary" variant="contained" type="submit" onClick={() => navigate(`/product/add`)} sx={{
                            backgroundColor: UIColor, color: "#fff",
                            "&:hover": {
                                backgroundColor: UIColor, color: "#fff"
                            }
                        }}>
                            <Icon>add</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize", width: { md: "auto", sm: "200px", xs: "200px" } }}>Add Product</Span>
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <DragTableComponent
                rows={rows}
                columns={columns}
                onSortEnd={onSortEnd}
                isLoading={rowLoading}
                totalCount={totalCount}
                selected={selected}
                renderRow={(row, index) => {
                    return (
                        <RowData
                            mainIndex={index}
                            index={index}
                            key={index}
                            row={row} />
                    )
                }}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleChangePage={handleChangePage}
                handleSelectAllClick={handleSelectAllClick}
            />

            <DeleteProductModel deleteData={deleteData} open={open} getData={getData} handleClose={() => setOpen(false)} />

            <DeleteAllModel open={deleteAllOpen} handleClose={() => {
                setDeleteAllOpen(false);
            }}
                getData={getData}
                type="product"
                deleteData={selected}
            />
        </Card>
    );
}

export default ProductList;
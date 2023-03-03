import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Fade, Icon, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { Span } from 'app/components/Typography';
import { mockDataCouponManagement } from 'fake-db/data/marketing/couponData';
import { ApiGet, ApiPut } from 'app/service/api';
import { API_URL } from 'app/constant/api';
import { toast } from 'material-react-toastify';

const CouponList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [rowLoading, setRowLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteData, setDeleteData] = useState(null);


    const getData = async () => {
        setRowLoading(true)
        await ApiGet(`${API_URL.getCoupons}?page=${page}&limit=${rowsPerPage}&q=${searchText}`)
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

    React.useEffect(() => {
        getData();
    }, [page, rowsPerPage, searchText]);

    const columns = [
        {
            id: "code",
            label: "Coupon Code",
            width: 120
        },
        // {
        //     id: "Description",
        //     label: "Description",
        //     width: 120
        // },
        {
            id: "discount_type",
            label: "Discount Type",
            width: 130
        },
        {
            id: "discount_value",
            label: "Value",
            width: 100
        },
        {
            id: "use_count",
            label: "Uses/Limit",
            width: 110
        },
        {
            id: "start_date",
            label: "Start Date",
            width: 110
        },
        {
            id: "end_date",
            label: "Expiry Date",
            width: 110
        },
        {
            id: "isActive",
            label: "isActive",
            width: 110
        },
        {
            id: "action",
            label: "Action",
            action: true,
            align: 'right',
            width: 80,
            sortDisable: true,
            renderCell: ({ row }) => (
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

    const editStatusData = async (id, status) => {
        await ApiPut(`${API_URL.editCoupon}/${id}`, {
            isActive: status
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
                <Title>Coupon List</Title>
                <Box display="flex" className="searchBoxSeaprate">
                    <Stack direction="row" spacing={{ md: 3, sm: 1, xs: 1 }}>
                        <Box display="flex" alignItems="center" className="searchBoxWidth" sx={{
                            border: "1px solid #000",
                            borderRadius: "6px",
                            mr: "0px",
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

                        <Button color="primary" variant="contained" type="submit"
                            onClick={() => navigate(`/coupons/add`)}
                            sx={{
                                backgroundColor: UIColor, color: "#fff",
                                "&:hover": {
                                    backgroundColor: UIColor, color: "#fff"
                                }
                            }}>
                            <Icon>add</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize", width: { md: "auto", sm: "200px", xs: "200px" } }}>Add Coupon</Span>
                        </Button>
                    </Stack>
                </Box>
            </Box>
            <TableComponent
                rows={rows}
                columns={columns}
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
                                    onClick={(event) => handleClick(event, row?._id)}
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </TableCell>
                            <TableCell>{row.code}</TableCell>
                            <TableCell>{row.discount_type}</TableCell>
                            <TableCell >{row.discount_value}</TableCell>
                            {/* <TableCell >{row.description}</TableCell> */}
                            <TableCell>{row.use_count}/{row.max_limit}</TableCell>
                            <TableCell >{row?.start_date && row?.start_date.split("T")[0]}</TableCell>
                            <TableCell >{row?.end_date && row?.end_date.split("T")[0]}</TableCell>
                            <TableCell >{row?.isActive ?
                                <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "green", textTransform: "capitalize" }}>
                                    Active
                                </Typography>
                                :
                                <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "red", fontWeight: 500, textTransform: "capitalize" }}>
                                    InActive
                                </Typography>
                            }</TableCell>
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
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={() => editStatusData(row?._id, !row?.isActive)}>{!row?.isActive ? "Active" : "InActive"}  </MenuItem>
                                    <MenuItem onClick={() => {
                                        navigate(`/coupons/view/${row?._id}`)
                                    }}>View</MenuItem>
                                    <MenuItem onClick={() => {
                                        setOpen(true);
                                        handleActionClose();
                                        setDeleteData(row)
                                    }}>Delete</MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    );
                }}
                page={page}
                totalCount={totalCount}
                rowsPerPage={rowsPerPage}
                isLoading={rowLoading}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleChangePage={handleChangePage}
                handleSelectAllClick={handleSelectAllClick}
            />

            <DeleteModel deleteData={[deleteData?._id]} getData={getData} type="coupon" open={open} handleClose={() => {
                setOpen(false)
                setDeleteData(null);
            }} />
        </Card>
    );
}

export default CouponList;
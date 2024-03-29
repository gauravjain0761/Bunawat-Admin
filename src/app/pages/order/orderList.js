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
import StatusModel from 'app/views/order/models/statusModel';
import PaymentModel from 'app/views/order/models/paymentModel';
import TrackingModel from 'app/views/order/models/trackingModel';
import { ApiGet } from 'app/service/api';
import { API_URL } from 'app/constant/api';
import moment from 'moment';

const OrderList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [statusPopup, setStatusPopup] = useState(false);
    const [trackingPopup, setTrackingPopup] = useState(false);
    const [paymentPopup, setPaymentPopup] = useState(false);
    const [rows, setRows] = useState([]);
    const [rowLoading, setRowLoading] = useState(false);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedeData, setSelectedeData] = useState({});
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');

    const columns = [
        {
            id: "order_num",
            label: "Order No",
            width: 150
        },
        {
            id: "createdAt",
            label: "Date",
            width: 100
        },
        {
            id: "order_type",
            label: "Type",
            width: 100
        },
        {
            id: "user_type",
            label: "User Type",
            width: 100
        },
        {
            id: "user.fname",
            label: "UserName",
            width: 100
        },
        {
            id: "order_status",
            label: "Status",
            align: "center",
            width: 150
        },
        {
            id: "total_amount",
            label: "Amount",
            align: "center",
            width: 100
        },
        {
            id: "transaction.amount",
            label: "Credit Amount",
            align: "center",
            width: 100
        },
        {
            id: "return.refund_amount",
            label: "Refund Amount",
            align: "center",
            width: 100
        },
        {
            id: "shipping_date",
            label: "Shipping Date",
            align: "center",
            width: 100
        },
        {
            id: "member.name",
            label: "Team Member",
            align: "center",
            sortDisable: true,
            width: 100
        },
        {
            id: "order_age",
            label: "Age",
            align: "center",
            width: 60
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
        await ApiGet(`${API_URL.getOrders}?page=${page}&limit=${rowsPerPage}&q=${searchText}`)
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

    const getAge = (age) => {
        if (age <= 24) {
            return `${age} Hour`
        }
        if (age > 24) {
            return `${Math.floor(age / 24)} Day`
        }
        return "-"
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const getColor = (status) => {
        let color = '#777';
        let background = '#e5e5e5';
        if (status == "Pending payment") {
            color = '#777'
            background = '#e5e5e5'
        }
        if (status == "Processing") {
            color = '#fff'
            background = '#5b841b'
        }
        if (status == "Confirmed") {
            color = '#2e4453'
            background = '#c8d7e1'
        }
        if (status == "Shipped") {
            color = '#94660c'
            background = '#f8dda7'
        }
        if (status == "Return") {
            color = '#777'
            background = '#e5e5e5'
        }
        if (status == "Cancelled") {
            color = '#777'
            background = '#e5e5e5'
        }
        return {
            color,
            background
        }
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
                <Title>Order List</Title>
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
                            onClick={() => navigate(`/order/add`)}
                            sx={{
                                backgroundColor: UIColor, color: "#fff",
                                "&:hover": {
                                    backgroundColor: UIColor, color: "#fff"
                                }
                            }}>
                            <Icon>add</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize", width: { md: "auto", sm: "150px", xs: "150px" } }}>Add Order</Span>
                        </Button>
                    </Stack>
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
                            selected={isItemSelected}>
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
                            <TableCell>{row?.order_num}</TableCell>
                            <TableCell>{row?.createdAt?.split("T")[0]}</TableCell>
                            <TableCell >{row.order_type}</TableCell>
                            <TableCell >{row.user_type}</TableCell>
                            <TableCell>{row.user?.fname} {row.user?.lname}</TableCell>
                            <TableCell align="center"><Box component='span' sx={{
                                ...getColor(row.order_status),
                                padding: '10px',
                                borderRadius: '4px'
                            }}>{row.order_status}</Box></TableCell>
                            <TableCell align="center">{row?.total_amount}</TableCell>
                            <TableCell align="center">{row?.transaction?.amount ?? "-"}</TableCell>
                            <TableCell align="center">{row?.return?.refund_amount ?? "-"}</TableCell>
                            <TableCell align="center">{row?.shipping_date ? moment(row?.shipping_date).format("DD/MM/YYYY") : '-'}</TableCell>
                            <TableCell align="center">{row?.member?.name ?? "-"}</TableCell>
                            <TableCell align="center">{getAge(row?.order_age)}</TableCell>
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
                                    <MenuItem onClick={() => {
                                        setStatusPopup(true);
                                        handleActionClose();
                                        setSelectedeData(row);
                                    }}>Update Status</MenuItem>
                                    {/* <MenuItem onClick={() => {
                                        setTrackingPopup(true);
                                        handleActionClose();
                                    }}>Update Tracking No</MenuItem>
                                    <MenuItem onClick={() => {
                                        setPaymentPopup(true);
                                        handleActionClose();
                                    }}>Update Payment Info</MenuItem> */}
                                    <MenuItem onClick={() => {
                                        navigate(`/order/detail/${row?._id}`);
                                        handleActionClose();
                                    }}>View Order</MenuItem>
                                    <MenuItem onClick={() => {
                                        navigate(`/order/edit/${row?._id}`);
                                        handleActionClose();
                                    }}>Edit Order</MenuItem>
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

            <DeleteModel open={open} handleClose={() => setOpen(false)} />
            <StatusModel open={statusPopup} handleClose={() => {
                setStatusPopup(false)
                setSelectedeData({})
            }} getData={getData} selectedeData={selectedeData} />
            <TrackingModel open={trackingPopup} handleClose={() => setTrackingPopup(false)} />
            <PaymentModel open={paymentPopup} handleClose={() => setPaymentPopup(false)} />
        </Card >
    );
}

export default OrderList;
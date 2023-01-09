import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Fade, Icon, IconButton, Menu, MenuItem, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { mockDataOrderManagement } from 'fake-db/data/order/orderData';
import { Span } from 'app/components/Typography';
import StatusModel from 'app/views/order/models/statusModel';
import PaymentModel from 'app/views/order/models/paymentModel';
import TrackingModel from 'app/views/order/models/trackingModel';

const OrderList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [statusPopup, setStatusPopup] = useState(false);
    const [trackingPopup, setTrackingPopup] = useState(false);
    const [paymentPopup, setPaymentPopup] = useState(false);
    const [rows, setRows] = useState(mockDataOrderManagement);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');

    const columns = [
        {
            id: "OrderNo",
            label: "Order No",
            width: 100
        },
        {
            id: "OrderDate",
            label: "Date",
            width: 100
        },
        {
            id: "OrderType",
            label: "Type",
            width: 100
        },
        {
            id: "OrderUserType",
            label: "User Type",
            width: 100
        },
        {
            id: "UserName",
            label: "UserName",
            width: 100
        },
        {
            id: "OrderStatus",
            label: "Status",
            align: "center",
            width: 150
        },
        {
            id: "OrderAmount",
            label: "Amount",
            align: "center",
            width: 100
        },
        {
            id: "Source",
            label: "Source",
            align: "center",
            width: 100
        },
        {
            id: "Age",
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

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
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
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getColor = (status) => {
        let color = '#777';
        let background = '#e5e5e5';
        if (status == "Pending payment") {
            color = '#777'
            background = '#e5e5e5'
        }
        if (status == "Processing") {
            color = '#5b841b'
            background = '#5b841b'
        }
        if (status == "On hold") {
            color = '#94660c'
            background = '#f8dda7'
        }
        if (status == "Completed") {
            color = '#2e4453'
            background = '#c8d7e1'
        }
        if (status == "Cancelled") {
            color = '#777'
            background = '#e5e5e5'
        }
        if (status == "Refunded") {
            color = '#777'
            background = '#e5e5e5'
        }
        if (status == "Failed") {
            color = '#761919'
            background = '#eba3a3'
        }
        if (status == "Packed") {
            color = '#777'
            background = '#e5e5e5'
        }
        if (status == "Shipped") {
            color = '#777'
            background = '#e5e5e5'
        }
        if (status == "Replaced") {
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
            <CardHeader className="searchBoxSeaprate">
                <Title>Order List</Title>
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
                        }} type="text" autoFocus value={searchText} onChange={(e) => {
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
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add Order</Span>
                    </Button>
                </Box>
            </CardHeader>
            <TableComponent
                rows={rows}
                columns={columns}
                selected={selected}
                renderRow={(row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    onClick={(event) => handleClick(event, row.name)}
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </TableCell>
                            <TableCell>{row.no}</TableCell>
                            <TableCell>{row.date}</TableCell>
                            <TableCell >{row.ordertype}</TableCell>
                            <TableCell >{row.orderusertype}</TableCell>
                            <TableCell>{row.username}</TableCell>
                            <TableCell align="center"><Box component='span' sx={{
                                ...getColor(row.status),
                                padding: '10px',
                                borderRadius: '4px'
                            }}>{row.status}</Box></TableCell>
                            <TableCell align="center">{row.amount}</TableCell>
                            <TableCell align="center">Direct</TableCell>
                            <TableCell align="center">20</TableCell>
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
                                    }}>Update Status</MenuItem>
                                    <MenuItem onClick={() => {
                                        setTrackingPopup(true);
                                        handleActionClose();
                                    }}>Update Tracking No</MenuItem>
                                    <MenuItem onClick={() => {
                                        setPaymentPopup(true);
                                        handleActionClose();
                                    }}>Update Payment Info</MenuItem>
                                    <MenuItem onClick={() => {
                                        navigate('/order/detail');
                                        handleActionClose();
                                    }}>View Order</MenuItem>
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
            <StatusModel open={statusPopup} handleClose={() => setStatusPopup(false)} />
            <TrackingModel open={trackingPopup} handleClose={() => setTrackingPopup(false)} />
            <PaymentModel open={paymentPopup} handleClose={() => setPaymentPopup(false)} />
        </Card>
    );
}

export default OrderList;
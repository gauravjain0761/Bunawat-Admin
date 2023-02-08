import { CheckBox } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import TableComponent from "app/components/table";
import TextEditor from "app/components/textEditor";
import { Span } from "app/components/Typography";
import { API_URL } from "app/constant/api";
import { ApiGet } from "app/service/api";
import { UIColor } from "app/utils/constant";
import { isMdScreen, isMobile } from "app/utils/utils";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import ReactDatePicker from "react-datepicker";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import PaymentModel from "./models/paymentModel";
import StatusModel from "./models/statusModel";
import TrackingModel from "./models/trackingModel";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const OrderDetailForm = ({ data = {} }) => {
    const { id } = useParams();
    const [formData, setFormData] = useState({ ...data, userType: 'customer' });
    const navigate = useNavigate();
    const [statusPopup, setStatusPopup] = useState(false);
    const [trackingPopup, setTrackingPopup] = useState(false);
    const [paymentPopup, setPaymentPopup] = useState(false);
    let [searchParams, setSearchParams] = useSearchParams();
    const [viewOrder, setViewOrder] = React.useState({});
    const [rows, setRows] = useState([]);


    const getViewOrderData = async (customerPhone) => {
        await ApiGet(`${API_URL.getOrder}/${id}`).then((response) => {
            if (response.status) {
                const { data } = response;
                setViewOrder(data);
                setRows(data?.items)
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    React.useEffect(() => {
        if (id) {
            getViewOrderData();
        }
    }, [id]);

    const columns = [
        {
            id: "item",
            label: "Item",
            sortDisable: true,
            width: 380
        },
        {
            id: "cost",
            label: "Cost",
            align: "center",
            sortDisable: true,
            width: 80
        },
        {
            id: "qty",
            label: "QTY",
            align: "center",
            sortDisable: true,
            width: 80
        },
        {
            id: "total",
            label: "Total",
            align: "center",
            sortDisable: true,
            width: 80
        },
        {
            id: "12% IGST",
            align: "center",
            label: "12% IGST",
            sortDisable: true,
            width: 80
        },
    ];

    useEffect(() => {
        setFormData({ ...data, userType: 'customer' })
    }, [data])


    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
        navigate(`/notifications/list`)
    };

    const handleChange = (event) => {
        if (event.target.name == "same") {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
        } else if (event.target.name == "phone" || event.target.name == "qty") {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length < 10) {
                setFormData({ ...formData, [event.target.name]: onlyNums });
            } else if (onlyNums.length === 10) {
                const number = onlyNums.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    '($1) $2-$3'
                );
                setFormData({ ...formData, [event.target.name]: onlyNums });
            }
        } else if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const DateCustomInput = ({ value, label, onClick, className }) => (
        <TextField
            type="text"
            name={label}
            className={className}
            id="standard-basic"
            value={value || ""}
            onClick={onClick}
        />
    );

    const {
        status,
        create_date
    } = formData;

    return (
        <Box>
            <Box sx={{ m: '30px', mt: 0 }}>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={3}>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <SimpleCard title="Order Details" backArrow={false}>
                                <Grid container spacing={2}>
                                    <Grid item lg={4} md={12} sm={12} xs={12}>
                                        <Stack>
                                            <Typography variant="h6">General</Typography>
                                            {/* <Stack flexDirection='row' alignItems='center'>
                                                <Typography sx={{ color: '#777' }}>Date created:</Typography>
                                                <Typography sx={{ ml: 1 }}>{moment(new Date()).format("DD/MM/YYYY")}</Typography>
                                            </Stack> */}
                                            <Typography sx={{ color: '#777' }}>Order No:</Typography>
                                            <Typography></Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Date created:</Typography>
                                            <Typography>{moment(viewOrder?.createdAt?.split("T")[0]).format("DD/MM/YYYY")}</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Order Type:</Typography>
                                            <Typography>{viewOrder?.order_type}</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Order User Type:</Typography>
                                            <Typography>{viewOrder?.user_type}</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Order Status:</Typography>
                                            <Typography>{viewOrder?.order_status}</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Amount:</Typography>
                                            <Typography>{viewOrder?.amount}</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Payment Mode:</Typography>
                                            <Typography >{viewOrder?.total_amount}</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Source:</Typography>
                                            <Typography>Direct</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Customer</Typography>
                                            <Typography></Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <Stack>
                                            <Typography variant="h6">Billing</Typography>
                                            <Typography sx={{ color: '#777' }}>Name:</Typography>
                                            <Typography></Typography>
                                            <Typography sx={{ mt: 1, color: '#777' }}>Address:</Typography>
                                            <Typography>{viewOrder?.billing_address?.address_1}</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Email address:</Typography>
                                            <Typography></Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Phone:</Typography>
                                            <Typography>{viewOrder?.billing_address?.phone}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <Stack>
                                            <Typography variant="h6">Shipping</Typography>
                                            <Typography sx={{ color: '#777' }}>Name:</Typography>
                                            <Typography></Typography>
                                            <Typography sx={{ mt: 1, color: '#777' }}>Address:</Typography>
                                            <Typography>{viewOrder?.shipping_address?.address_1}</Typography>
                                            {/* <Typography>Rourkela 769004</Typography>
                                            <Typography>Odisha</Typography> */}
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </SimpleCard>
                        </Grid>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <Box sx={{ border: '1px solid', borderRadius: '4px' }}>
                                <TableComponent
                                    rows={rows}
                                    extraPaddingOnFirstColumn={true}
                                    extraDisable={true}
                                    disablePagination={true}
                                    disableCheckBox={true}
                                    columns={columns}
                                    renderRow={(row, index) => {
                                        return (
                                            <>
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={index}>
                                                    <TableCell sx={{ pl: '15px' }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                        }}>
                                                            <Box>
                                                                <img src="https://img.freepik.com/premium-photo/clothes-rail-with-t-shirts_23-2147669592.jpg?w=2000" width='40px' height='40px' />
                                                            </Box>
                                                            <Stack sx={{
                                                                ml: 2
                                                            }}>
                                                                <Typography></Typography>
                                                                <Box sx={{ display: 'flex', }}>
                                                                    <Typography sx={{ color: '#777' }}>Size: </Typography>
                                                                    <Typography ></Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', }}>
                                                                    <Typography sx={{ color: '#777' }}>Color: </Typography>
                                                                    <Typography ></Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                    <Typography sx={{ color: '#777' }}>Tracking number: </Typography>
                                                                    <Typography>
                                                                        <TextField
                                                                            sx={{
                                                                                '&.MuiFormControl-root': {
                                                                                    m: 0,
                                                                                    mb: 0
                                                                                },
                                                                                'input': {
                                                                                    p: 1,
                                                                                },
                                                                            }}
                                                                            type="text"
                                                                            name="trackingNumber"
                                                                            defaultValue=''
                                                                        />
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">{row?.price}</TableCell>
                                                    <TableCell align="center">
                                                        <TextField
                                                            sx={{
                                                                '&.MuiFormControl-root': {
                                                                    m: 0,
                                                                    mb: 0
                                                                },
                                                                'input': {
                                                                    p: 2,
                                                                },
                                                            }}
                                                            type="text"
                                                            name="qty"
                                                            defaultValue={row?.qty}
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">{row?.amount}</TableCell>
                                                    <TableCell align="center"></TableCell>
                                                </TableRow>

                                            </>
                                        );
                                    }}
                                />
                                <Box sx={{
                                    width: '100%',
                                    justifyContent: 'flex-end',
                                    display: 'flex'
                                }}>
                                    <Table sx={{ maxWidth: 320, width: '100%' }} aria-label="simple table">
                                        <TableBody>
                                            <TableRow sx={{ border: 'none' }}>
                                                <TableCell sx={{ border: 'none' }} align='right'>Items Subtotal:</TableCell>
                                                <TableCell sx={{ border: 'none' }} align="right">₹{viewOrder?.total_amount}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ border: 'none' }} align='right'>Fees</TableCell>
                                                <TableCell sx={{ border: 'none' }} align="right">₹</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ border: 'none' }} align='right'>12% IGST:</TableCell>
                                                <TableCell sx={{ border: 'none' }} align="right">₹</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ border: 'none' }} align='right'>Order Total:</TableCell>
                                                <TableCell sx={{ border: 'none' }} align="right">₹{viewOrder?.total_amount}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                                <Box sx={{
                                    width: '100%',
                                    borderTop: '1px solid'
                                }}>
                                    <Table sx={{ width: '100%' }} aria-label="simple table">
                                        <TableBody>
                                            <TableRow sx={{ border: 'none' }}>
                                                <TableCell sx={{ border: 'none', pl: { lg: 2, xs: 1 } }} align='left'>
                                                    <Box sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: 1,
                                                        justifyContent: 'space-between',
                                                        flexWrap: 'wrap'
                                                    }}>
                                                        <Box sx={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            justifyContent: 'flex-start',
                                                            flexWrap: 'wrap'
                                                        }}>
                                                            <Button variant="outlined">Refund</Button>
                                                            <Button variant="outlined" onClick={() => setStatusPopup(true)}>Status</Button>
                                                            <Button variant="outlined" onClick={() => setTrackingPopup(true)}>Tracking No</Button>
                                                            <Button variant="outlined" onClick={() => setPaymentPopup(true)}>Payment Info</Button>
                                                            <Button variant="outlined">Notes</Button>
                                                            <Button variant="outlined">Invoice</Button>
                                                            <Button variant="outlined">Packing Slip</Button>
                                                        </Box>
                                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                            <Icon>info</Icon>
                                                            <Typography> This order is no longer editable.</Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Box >
            <StatusModel open={statusPopup} handleClose={() => setStatusPopup(false)} />
            <TrackingModel open={trackingPopup} handleClose={() => setTrackingPopup(false)} />
            <PaymentModel open={paymentPopup} handleClose={() => setPaymentPopup(false)} />
        </Box >
    );
};

export default OrderDetailForm;

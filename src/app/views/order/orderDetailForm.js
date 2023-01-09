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
import { UIColor } from "app/utils/constant";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import ReactDatePicker from "react-datepicker";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useSearchParams } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const OrderDetailForm = ({ data = {} }) => {
    const [formData, setFormData] = useState({ ...data, userType: 'customer' });
    const navigate = useNavigate();
    const [rows, setRows] = useState([{}, {}, {}]);
    let [searchParams, setSearchParams] = useSearchParams();

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
                                            <Stack>
                                                <Typography sx={{ color: '#777' }}>Date created:</Typography>
                                                <ReactDatePicker
                                                    selected={create_date ? create_date : new Date()}
                                                    onChange={(date) => setFormData({ ...formData, create_date: date })}
                                                    selectsStart
                                                    className="create_date"
                                                    customInput={<DateCustomInput label="Date" className="create_date" />}
                                                />
                                            </Stack>
                                            <FormControl fullWidth sx={{ mt: '5px' }}>
                                                <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={status}
                                                    name="status"
                                                    label="Select Status"
                                                    onChange={handleChange}>
                                                    <MenuItem value="Pending payment">Pending payment</MenuItem>
                                                    <MenuItem value="Processing">Processing</MenuItem>
                                                    <MenuItem value="Packed">Packed</MenuItem>
                                                    <MenuItem value="Shipped">Shipped</MenuItem>
                                                    <MenuItem value="On hold">On hold</MenuItem>
                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                    <MenuItem value="Refunded">Refunded</MenuItem>
                                                    <MenuItem value="Failed">Failed</MenuItem>
                                                    <MenuItem value="Replaced">Replaced</MenuItem>
                                                    <MenuItem value="Draft">Draft</MenuItem>
                                                </Select>
                                            </FormControl>
                                            <Stack sx={{ mt: '5px' }}>
                                                <Typography sx={{ color: '#777' }}>Customer</Typography>
                                                <Typography>Juhi Bagaria (#4331 &ndash; bagaria.namrata@gmail.com)</Typography>
                                            </Stack>
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <Stack>
                                            <Typography variant="h6">Billing</Typography>
                                            <Typography>Juhi Bagaria</Typography>
                                            <Typography>M-19,Civil Town ship</Typography>
                                            <Typography>Rourkela 769004</Typography>
                                            <Typography>Odisha</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Email address:</Typography>
                                            <Typography>bagaria.namrata@gmail.com</Typography>

                                            <Typography sx={{ mt: 1, color: '#777' }}>Phone:</Typography>
                                            <Typography>9348046722</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <Stack>
                                            <Typography variant="h6">Shipping</Typography>
                                            <Typography>Juhi Bagaria</Typography>
                                            <Typography>M-19,Civil Town ship</Typography>
                                            <Typography>Rourkela 769004</Typography>
                                            <Typography>Odisha</Typography>
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
                                                                <Typography>Alluring Mustard Chiffon Crop Top And Skirt - S, Mustard</Typography>
                                                                <Box sx={{ display: 'flex', }}>
                                                                    <Typography sx={{ color: '#777' }}>Size: </Typography>
                                                                    <Typography >S</Typography>
                                                                </Box>
                                                                <Box sx={{ display: 'flex', }}>
                                                                    <Typography sx={{ color: '#777' }}>Color: </Typography>
                                                                    <Typography >Mustard</Typography>
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
                                                                            defaultValue='8994570947'
                                                                        />
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">20</TableCell>
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
                                                            defaultValue='12'
                                                        />
                                                    </TableCell>
                                                    <TableCell align="center">20</TableCell>
                                                    <TableCell align="center">20</TableCell>
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
                                                <TableCell sx={{ border: 'none' }} align="right">₹3,302.68</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ border: 'none' }} align='right'>Fees</TableCell>
                                                <TableCell sx={{ border: 'none' }} align="right">₹3,302.68</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ border: 'none' }} align='right'>12% IGST:</TableCell>
                                                <TableCell sx={{ border: 'none' }} align="right">₹3,302.68</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell sx={{ border: 'none' }} align='right'>Order Total:</TableCell>
                                                <TableCell sx={{ border: 'none' }} align="right">₹3,302.68</TableCell>
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
                                                <TableCell width='120px' sx={{ border: 'none', pl: 2 }} align='left'>
                                                    <Button variant="outlined">Refund</Button>
                                                </TableCell>
                                                <TableCell sx={{ border: 'none', pr: 2 }} align="right">
                                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                        <Icon>info</Icon>
                                                        <Typography> This order is no longer editable.</Typography>
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
        </Box >
    );
};

export default OrderDetailForm;

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
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useSearchParams } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const OrderForm = ({ data = {} }) => {
    const [formData, setFormData] = useState({ ...data, userType: 'customer' });
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    const columns = [
        {
            id: "pName",
            label: "Product Name",
            sortDisable: true,
            width: 100
        },
        {
            id: "In Stoke QTY",
            label: "In Stoke QTY",
            align: 'center',
            sortDisable: true,
            width: 100
        },
        {
            id: "qty",
            label: "QTY",
            align: 'center',
            sortDisable: true,
            width: 100
        },
        {
            id: "Action",
            label: "Action",
            action: true,
            sortDisable: true,
            align: 'right',
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

    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const addProductToCart = () => {
        let temp = formData?.productList ?? [];
        temp = [...temp, { qty, pName }]
        setFormData({ ...formData, productList: temp, pName: '', qty: '' });
    }

    const handleDeleteProduct = (index) => {
        let temp = formData?.productList ?? [];
        temp = temp.filter((data, i) => i != index)
        setFormData({ ...formData, productList: temp, pName: '', qty: '' });
    }

    const {
        userType,
        teamMember,
        reseller,
        pName,
        qty,
        productList,
        same,
        fname,
        lname,
        phone,
        aPhone,
        email,
        state,
        district,
        city,
        address_one,
        address_two,
        post_code,
        paymentType,
        transactionId,
        image
    } = formData;

    return (
        <Box>
            <Box sx={{ m: '30px', mt: 0 }}>
                <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={12} sm={12} xs={12} >
                            <SimpleCard title="Order" backArrow={false}>
                                <Grid container spacing={12}>
                                    <Grid item lg={12} md={12} sm={12} xs={12} >
                                        <FormControl sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>User Type</FormLabel>
                                            <RadioGroup
                                                row
                                                value={userType ?? "customer"}
                                                onChange={handleChange}
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="userType">
                                                <FormControlLabel value="customer" control={<Radio />} label="Customer" />
                                                <FormControlLabel value="reseller" control={<Radio />} label="Reseller" />
                                            </RadioGroup>
                                        </FormControl>

                                        {userType == 'customer' && <FormControl fullWidth sx={{ mt: 2 }}>
                                            <InputLabel id="demo-simple-select-label">Team Member</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={teamMember}
                                                name="teamMember"
                                                label="Team Member"
                                                onChange={handleChange}>
                                                <MenuItem value="test">test</MenuItem>
                                                <MenuItem value="demo">demo</MenuItem>
                                            </Select>
                                        </FormControl>
                                        }

                                        {userType == 'reseller' && <FormControl fullWidth sx={{ mt: 2 }}>
                                            <InputLabel id="demo-simple-select-label">Reseller</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={reseller}
                                                name="reseller"
                                                label="Reseller"
                                                onChange={handleChange}>
                                                <MenuItem value="test">test</MenuItem>
                                                <MenuItem value="demo">demo</MenuItem>
                                            </Select>
                                        </FormControl>
                                        }

                                        <Autocomplete
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            multiple={false}
                                            id="tags-outlined"
                                            value={pName ?? ''}
                                            onChange={(event, newValue) => setFormData({ ...formData, pName: newValue })}
                                            options={['P_01', 'P_02', 'P_03']}
                                            getOptionLabel={(option) => option}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Select Product"
                                                />
                                            )}
                                        />

                                        {/* {pName && 
                                    <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 700 }}>Product Name: &nbsp;</Typography>
                                    <Typography>{pName}</Typography>
                                    </Box>
                                    
                                    </Box>
                                } */}


                                        {pName &&
                                            <Box>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">Price</TableCell>
                                                                <TableCell align="center">In Stock QTY</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell align="center" component="th" scope="row">{pName == 'P_02' ? 1000 : 1500}</TableCell>
                                                                <TableCell align="center" component="th" scope="row">{pName == 'P_02' ? 75 : 44}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <TextField
                                                            type="text"
                                                            name="qty"
                                                            sx={{ mt: 2 }}
                                                            label="QTY"
                                                            onChange={handleChange}
                                                            value={qty || ""}
                                                        />
                                                    </Box>
                                                    <Button color="primary" variant="contained" type="button" sx={{ width: { lg: "150px", md: '100px' }, height: '53px', ml: 2 }} onClick={addProductToCart}>
                                                        <Icon>add</Icon>
                                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add</Span>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }

                                        {productList?.length > 0 &&
                                            productList?.map((data, index) => {
                                                return (
                                                    <Box>
                                                        <Box sx={{ mt: 1, background: UIColor, color: '#fff', p: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Typography sx={{ fontWeight: 700 }}>{data?.pName}</Typography>
                                                            <Icon onClick={() => handleDeleteProduct(0)} sx={{
                                                                color: "#fff",
                                                                cursor: "pointer",
                                                            }}>delete</Icon>
                                                        </Box>
                                                        <Table sx={{ minWidth: '100%', border: '1px solid' }} aria-label="simple table">
                                                            <TableHead>
                                                                <TableRow sx={{ border: 'none' }}>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>DesignNo/SKU</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>ABCD1234</Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>QTY</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>
                                                                                <TextField
                                                                                    className="numberRemove"
                                                                                    sx={{
                                                                                        border: 'none',
                                                                                        px: '5px',
                                                                                        '&.MuiFormControl-root': {
                                                                                            m: 0,
                                                                                            mb: 0
                                                                                        },
                                                                                        'input': {
                                                                                            p: 0,
                                                                                            textAlign: 'center'
                                                                                        },
                                                                                        'fieldset': {
                                                                                            border: 'none',
                                                                                        },
                                                                                    }}
                                                                                    type="text"
                                                                                    defaultValue={data?.qty}
                                                                                    name="qty"
                                                                                />
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow sx={{ border: 'none' }}>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>Price</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>1000</Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>Total Amount</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>5000</Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                        {/* <Box sx={{ border: '0.5px solid' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: { sm: 'row', xs: 'column' }, flexWrap: 'wrap', p: '5px' }}>
                                                                        <Box sx={{ flex: 2 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                                <Typography sx={{ fontWeight: 700 }}>Price&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                                                                <Typography sx={{ fontWeight: 700 }}>:&nbsp; 1000</Typography>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                                <Typography sx={{ fontWeight: 700, color: 'red' }}>Total Amt.&nbsp;&nbsp;</Typography>
                                                                                <Typography sx={{ fontWeight: 700, color: 'red' }}>:&nbsp; {1000 * data?.qty}</Typography>
                                                                            </Box>
                                                                        </Box>
                                                                        <Box sx={{ flex: 2 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}>
                                                                                <Typography sx={{ fontWeight: 700 }}>QTY&nbsp; :&nbsp;</Typography>
                                                                                <Typography sx={{ fontWeight: 700 }}>
                                                                                    <input defaultValue={data?.qty} type="text" name="qty" style={{ width: '100%' }} />
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>
                                                                </Box> */}
                                                    </Box>
                                                )
                                            })}
                                    </Grid>
                                </Grid>
                            </SimpleCard>
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12} >
                            <SimpleCard title="Order Detail" backArrow={false}>
                                <Typography variant="h6">Billing Address</Typography>
                                <Grid container spacing={1}>
                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                        <TextField
                                            type="text"
                                            name="fname"
                                            label="First Name"
                                            onChange={handleChange}
                                            value={fname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="lname"
                                            label="Last Name"
                                            onChange={handleChange}
                                            value={lname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="email"
                                            name="email"
                                            label="Email"
                                            value={email || ""}
                                            onChange={handleChange}
                                            validators={["required", "isEmail"]}
                                            errorMessages={["this field is required", "email is not valid"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="phone"
                                            label="Phone Nubmer"
                                            onChange={handleChange}
                                            value={phone || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />

                                        <TextField
                                            name="text"
                                            type="post_code"
                                            label="Post Code"
                                            value={post_code || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            type="text"
                                            name="aPhone"
                                            label="Alternate Phone Nubmer"
                                            onChange={handleChange}
                                            value={aPhone || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                        <TextField
                                            type="text"
                                            name="state"
                                            value={state || ""}
                                            label="State"
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="district"
                                            label="District"
                                            value={district || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="city"
                                            label="City"
                                            value={city || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="address_one"
                                            label="Address - 1"
                                            value={address_one || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="address_two"
                                            label="Address - 2"
                                            value={address_two || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                    </Grid>
                                </Grid>

                                <Box display='flex' alignItems='center'>
                                    <Typography variant="h6">Shipping Address </Typography>
                                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center', ml: 2 }} component="div" variant="standard">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox checked={same} onChange={handleChange} name="same" />
                                                }
                                                label="Same as Above"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                                <Grid container spacing={1}>
                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                        <TextField
                                            type="text"
                                            name="fname"
                                            label="First Name"
                                            onChange={handleChange}
                                            value={fname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="lname"
                                            label="Last Name"
                                            onChange={handleChange}
                                            value={lname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="email"
                                            name="email"
                                            label="Email"
                                            value={email || ""}
                                            onChange={handleChange}
                                            validators={["required", "isEmail"]}
                                            errorMessages={["this field is required", "email is not valid"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="phone"
                                            label="Phone Nubmer"
                                            onChange={handleChange}
                                            value={phone || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />

                                        <TextField
                                            name="text"
                                            type="post_code"
                                            label="Post Code"
                                            value={post_code || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="aPhone"
                                            label="Alternate Phone Nubmer"
                                            onChange={handleChange}
                                            value={aPhone || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                        <TextField
                                            type="text"
                                            name="state"
                                            value={state || ""}
                                            label="State"
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="district"
                                            label="District"
                                            value={district || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="city"
                                            label="City"
                                            value={city || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="address_one"
                                            label="Address - 1"
                                            value={address_one || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="address_two"
                                            label="Address - 2"
                                            value={address_two || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                    </Grid>
                                </Grid>

                                <Typography variant="h6">Payment Info</Typography>
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>Payment Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={paymentType ?? "cod"}
                                        onChange={handleChange}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="paymentType">
                                        <FormControlLabel value="cod" control={<Radio />} label="COD" />
                                        <FormControlLabel value="online" control={<Radio />} label="Online" />
                                        <FormControlLabel value="credits" control={<Radio />} label="Credits" />
                                        <FormControlLabel value="partialCredits" control={<Radio />} label="Partial Credits" />
                                    </RadioGroup>
                                </FormControl>
                                {paymentType == 'online' &&
                                    <>
                                        <TextField
                                            type="text"
                                            name="transactionId"
                                            label="Transaction Id"
                                            onChange={handleChange}
                                            value={transactionId || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        {image ?
                                            <Box
                                                sx={{
                                                    width: "150px",
                                                    height: "170px",
                                                    margin: "10px 10px 0 0",
                                                    position: "relative"
                                                }}>
                                                <img src={image} width="100%" height="90%" />
                                                <Box sx={{ height: "10%" }} display="flex" alignItems="center" justifyContent="end">
                                                    <Icon onClick={() => handleDeleteImage()} sx={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                    }}>delete</Icon> <Span onClick={() => handleDeleteImage()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                                </Box>
                                            </Box>
                                            :
                                            <Button
                                                variant="contained"
                                                component="label"
                                                sx={{
                                                    width: "150px",
                                                    height: "150px",
                                                    background: "transparent",
                                                    color: "#000",
                                                    border: "2px dashed",
                                                    margin: "10px 10px 0 0",

                                                    "&:hover": {
                                                        background: "transparent",
                                                    }
                                                }} >
                                                <Icon>add</Icon>
                                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Upload File</Span>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/png, image/gif, image/jpeg"
                                                    hidden
                                                    onClick={(event) => { event.target.value = '' }}
                                                    onChange={handleChange} />
                                            </Button>
                                        }
                                    </>
                                }
                            </SimpleCard>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Box >
            {productList?.length > 0 && <Box sx={{
                width: '100%', height: '80px', background: '#fff',
                position: 'sticky',
                zIndex: 999,
                bottom: 0,
                boxShadow: '0 -8px 16px 0 rgb(85 93 102 / 30%)'
            }}>
                <Box sx={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: { sm: 'row', xs: 'column' }, ml: 3, gap: { sm: '10px', xs: '0px' } }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Typography sx={{ fontWeight: 700 }}>Total Items</Typography>
                            <Typography sx={{ fontWeight: 500 }}>:&nbsp; {productList?.length ?? 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Typography sx={{ fontWeight: 700 }}>Total QTY</Typography>
                            <Typography sx={{ fontWeight: 500 }}>:&nbsp; {productList?.reduce((t, x) => t + Number(x?.qty), 0) ?? 0}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                            <Typography sx={{ fontWeight: 700, color: 'red' }}>Total Amount</Typography>
                            <Typography sx={{ fontWeight: 500, color: 'red' }}>: {1000 * (productList?.reduce((t, x) => t + Number(x?.qty), 0) ?? 0)}</Typography>
                        </Box>
                    </Box>
                    <Box sx={{
                        mr: 3
                    }}>
                        <Button onClick={() => navigate(-1)} sx={{ border: '1px solid #232a45', color: '#232a45', display: { sm: 'initial', xs: 'none' } }}>
                            Back
                        </Button>
                        <Button sx={{
                            background: '#232a45', ml: 2, color: '#fff',
                            "&:hover": {
                                background: '#232a45', color: '#fff'
                            }
                        }}>
                            Save
                        </Button>
                    </Box>
                </Box>
            </Box>
            }
        </Box >
    );
};

export default OrderForm;

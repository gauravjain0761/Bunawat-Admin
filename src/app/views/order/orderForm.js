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
    Radio,
    RadioGroup,
    Select,
    styled,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import TextEditor from "app/components/textEditor";
import { Span } from "app/components/Typography";
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
    const [formData, setFormData] = useState(data);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setFormData(data)
    }, [data])


    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
        navigate(`/notifications/list`)
    };

    const handleChange = (event) => {
        if (event.target.name == "phone") {
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

    const {
        userType,
        teamMember,
        reseller,
        pName,
        qty,
        productList,
        fname,
        lname,
        phone,
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
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <Box display="flex" justifyContent='flex-end' alignItems='center'>
                    <Box display="flex" alignItems='center'>
                        <Button color="primary" variant="contained" type="button" sx={{ mr: 2, mt: 2 }} onClick={() => navigate(-1)}>
                            <Icon>arrow_back</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
                        </Button>
                        <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }}>
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                        </Button>
                    </Box>
                </Box>
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
                                            value={userType ?? ""}
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

                                    {pName && <Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ fontWeight: 700 }}>Product Name: &nbsp;</Typography>
                                            <Typography>{pName}</Typography>
                                        </Box>
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
                                    {productList?.length > 0 && productList?.map((data) => {
                                        return (
                                            <Box sx={{
                                                border: '1px solid',
                                                borderRadius: '4px',
                                                padding: '10px',
                                                position: 'relative',
                                                my: 2
                                            }}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography sx={{ fontWeight: 700 }}>Product Name: &nbsp;</Typography>
                                                    <Typography>{data?.pName}</Typography>
                                                </Box>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Typography sx={{ fontWeight: 700 }}>QTY: &nbsp;</Typography>
                                                    <Typography>{data?.qty}</Typography>
                                                </Box>
                                                <Icon onClick={() => handleDeleteImage()} sx={{
                                                    color: "red",
                                                    position: 'absolute',
                                                    right: '-10px',
                                                    top: '-10px',
                                                    cursor: "pointer",
                                                }}>delete</Icon>
                                            </Box>
                                        )
                                    })}
                                </Grid>
                            </Grid>
                        </SimpleCard>
                    </Grid>
                    <Grid item lg={6} md={12} sm={12} xs={12} >
                        <SimpleCard title="Info" backArrow={false}>
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

                            <Typography variant="h6">Shipping Address</Typography>
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
        </div >
    );
};

export default OrderForm;

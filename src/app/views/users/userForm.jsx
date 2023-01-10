import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
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
import { Span } from "app/components/Typography";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isMdScreen, isMobile } from "app/utils/utils";
import { forwardRef, useEffect, useState } from "react";
import Avatar from "react-avatar";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";
import { UIColor } from "app/utils/constant";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";
import DeleteModel from "./model/deleteModel";
import { ApiGet, ApiPut } from "app/service/api";
import { API_URL } from "app/constant/api";
import moment from "moment";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const UserForm = ({ data = {}, userType, id }) => {
    const [formData, setFormData] = useState(data);
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [collectionData, setCollectionData] = useState([]);

    const handleChangeExpand = (panel) => (event, isExpanded) => {
        console.log(event.target, isExpanded)
        setExpanded(isExpanded ? panel : false);
    };

    const getCollection = async () => {
        await ApiGet(API_URL.getCollections)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setCollectionData(response?.data?.map((item) => {
                        return {
                            label: item?.name,
                            value: item?._id
                        }
                    }))
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    };

    const navigate = useNavigate();
    useEffect(() => {
        setFormData(data)
    }, [data])

    useEffect(() => {
        getCollection()
    }, [])


    const getURL = (role) => {
        if (role == 'Customer') {
            return API_URL.editCustomer
        }
        if (role == 'Reseller') {
            return API_URL.editResller
        }
        if (role == 'influencer') {
            return API_URL.editInfluencer
        }
    }

    const getBack = (role) => {
        if (role == 'Customer') {
            navigate("/customer")
        }
        if (role == 'Reseller') {
            navigate("/reseller")
        }
        if (role == 'influencer') {
            navigate("/influncer")
        }
    }

    const handleSubmit = async (event) => {
        const { shipping, ...payload } = formData
        if (getURL() != "") {
            await ApiPut(`${getURL(userType)}/${id}`, { ...payload, shipping_address: shipping })
                .then((response) => {
                    getBack(userType)
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        } else {

        }
    };

    const handleChange = (event, subName) => {
        if (event.target.name == "phone" || event.target.name == "baseCommission" || event.target.name == "thresholdCommission" || event.target.name == "additionalCommission") {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length < 10) {
                if (subName) {
                    setFormData({ ...formData, [subName]: { ...formData?.[subName], [event.target.name]: onlyNums } });
                } else {
                    setFormData({ ...formData, [event.target.name]: onlyNums });
                }
            } else if (onlyNums.length === 10) {
                const number = onlyNums.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    '($1) $2-$3'
                );
                if (subName) {
                    setFormData({ ...formData, [subName]: { ...formData?.[subName], [event.target.name]: onlyNums } });
                } else {
                    setFormData({ ...formData, [event.target.name]: onlyNums });
                }
            }
        } else {
            if (subName) {
                setFormData({ ...formData, [subName]: { ...formData?.[subName], [event.target.name]: event.target.value } });
            } else {
                setFormData({ ...formData, [event.target.name]: event.target.value });
            }
        }
        console.log(formData, !!subName, collectionData)
    };

    const {
        fname,
        lname,
        phone,
        email,
        password,
        state,
        district,
        city,
        address_1,
        address_2,
        collections,
        pan,
        pincode,
        bank_name,
        account_number,
        bank_ifsc,
        upi,
        agency_name,
        notes,
        shipping,
        commission
    } = formData;

    const DateCustomInput = ({ value, label, onClick, className }) => (
        <TextField
            type="text"
            name={label}
            className={className}
            id="standard-basic"
            value={value || ""}
            onClick={onClick}
            label={label}
        />
    );

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>

                <SimpleCard title={`${userType} Details`} backArrow={true}>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            {/* <Box sx={{ mb: 3.5 }} display="flex" alignItems="center">
                                <Avatar name={fname} round={true} size="50" />
                                <Button>
                                    Change
                                </Button>
                            </Box> */}

                            <TextField
                                type="text"
                                name="fname"
                                label="First Name"
                                onChange={(e) => handleChange(e)}
                                value={fname || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="lname"
                                label="Last Name"
                                onChange={(e) => handleChange(e)}
                                value={lname || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="email"
                                name="email"
                                label="Email"
                                value={email || ""}
                                onChange={(e) => handleChange(e)}
                                validators={["required", "isEmail"]}
                                errorMessages={["this field is required", "email is not valid"]}
                            />

                            <TextField
                                type="text"
                                name="phone"
                                label="Phone Nubmer"
                                onChange={(e) => handleChange(e)}
                                value={phone || ""}
                                validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                            />

                            <TextField
                                name="password"
                                type="password"
                                label="Password"
                                value={password || ""}
                                onChange={(e) => handleChange(e)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            {(userType == "Reseller" || userType == "influencer") &&
                                <TextField
                                    name="pan"
                                    type="text"
                                    label="Pan Number"
                                    value={pan || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                            }

                            {/* {userType == "Customer" &&
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Customer Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={customerType ?? "Active"}
                                        onChange={(e) => handleChange(e)}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="customerType">
                                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                                        <FormControlLabel value="Passive" control={<Radio />} label="Passive" />
                                    </RadioGroup>
                                </FormControl>
                            } */}

                            {(userType == "influencer") &&
                                <>
                                    <TextField
                                        type="text"
                                        name="agency_name"
                                        label="Agency Name"
                                        onChange={(e) => handleChange(e)}
                                        value={agency_name || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />

                                    <TextField
                                        type="text"
                                        name="notes"
                                        label="Notes"
                                        onChange={(e) => handleChange(e)}
                                        value={notes || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />
                                </>
                            }



                        </Grid>

                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="text"
                                name="state"
                                value={state || ""}
                                label="State"
                                onChange={(e) => handleChange(e)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            <TextField
                                name="district"
                                type="text"
                                label="District"
                                value={district || ""}
                                onChange={(e) => handleChange(e)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            <TextField
                                name="city"
                                type="text"
                                label="City"
                                value={city || ""}
                                onChange={(e) => handleChange(e)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            <TextField
                                name="address_1"
                                type="text"
                                label="Address - 1"
                                value={address_1 || ""}
                                onChange={(e) => handleChange(e)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            <TextField
                                name="address_2"
                                type="text"
                                label="Address - 2"
                                value={address_2 || ""}
                                onChange={(e) => handleChange(e)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            <TextField
                                name="pincode"
                                type="text"
                                label="Post Code"
                                value={pincode || ""}
                                onChange={(e) => handleChange(e)}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            {(userType == "influencer") &&
                                <FormControl fullWidth >
                                    <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={collections ?? ""}
                                        defaultValue={collections ?? ""}
                                        name="collections"
                                        label="Collection"
                                        onChange={(e) => handleChange(e)}>
                                        {collectionData?.map((item) => {
                                            return (
                                                <MenuItem key={item?.value} value={item?.value}>{item?.label}</MenuItem>
                                            )
                                        })}
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                    </Grid>
                </SimpleCard>

                {/* {(userType == "Reseller") && <Accordion expanded={expanded === 'Billing'} onChange={handleChangeExpand('Billing')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
                    <AccordionSummary
                        sx={{ backgroundColor: UIColor, color: "#fff" }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header">
                        <Typography sx={{ width: '50%', flexShrink: 0, fontSize: "1rem", fontWeight: 500, textTransform: "capitalize" }}>
                            Billing Address
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ border: `2px solid ${UIColor}`, borderRadius: "0 0 8px 8px" }}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="userName"
                                    id="standard-basic"
                                    value={userName || ""}
                                    onChange={(e) => handleChange(e)}
                                    label="Username (Min length 4, Max length 10)"
                                />

                                <TextField
                                    type="text"
                                    name="fname"
                                    label="First Name"
                                    onChange={(e) => handleChange(e)}
                                    value={fname || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="lname"
                                    label="Last Name"
                                    onChange={(e) => handleChange(e)}
                                    value={lname || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="email"
                                    name="email"
                                    label="Email"
                                    value={email || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required", "isEmail"]}
                                    errorMessages={["this field is required", "email is not valid"]}
                                />

                                <TextField
                                    type="text"
                                    name="phone"
                                    label="Phone Nubmer"
                                    onChange={(e) => handleChange(e)}
                                    value={phone || ""}
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
                                    onChange={(e) => handleChange(e)}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="text"
                                    type="district"
                                    label="District"
                                    value={district || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="text"
                                    type="city"
                                    label="City"
                                    value={city || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="text"
                                    type="address_one"
                                    label="Address - 1"
                                    value={address_one || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="text"
                                    type="address_two"
                                    label="Address - 2"
                                    value={address_two || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="text"
                                    type="post_code"
                                    label="Post Code"
                                    value={post_code || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                } */}

                {(userType == "influencer") && <Accordion expanded={expanded === 'Shipping'} onChange={handleChangeExpand('Shipping')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
                    <AccordionSummary
                        sx={{ backgroundColor: UIColor, color: "#fff" }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header">
                        <Typography sx={{ width: '50%', flexShrink: 0, fontSize: "1rem", fontWeight: 500, textTransform: "capitalize" }}>
                            Shipping Address
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ border: `2px solid ${UIColor}`, borderRadius: "0 0 8px 8px" }}>
                        <Grid container spacing={6}>
                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="username"
                                    id="standard-basic"
                                    value={shipping?.username || ""}
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    label="Username (Min length 4, Max length 10)"
                                />

                                <TextField
                                    type="text"
                                    name="fname"
                                    label="First Name"
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    value={shipping?.fname || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="lname"
                                    label="Last Name"
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    value={shipping?.lname || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="email"
                                    name="email"
                                    label="Email"
                                    value={shipping?.email || ""}
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    validators={["required", "isEmail"]}
                                    errorMessages={["this field is required", "email is not valid"]}
                                />

                                <TextField
                                    type="text"
                                    name="phone"
                                    label="Phone Nubmer"
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    value={shipping?.phone || ""}
                                    validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                    errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                />


                            </Grid>

                            <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="state"
                                    value={shipping?.state || ""}
                                    label="State"
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="district"
                                    label="District"
                                    value={shipping?.district || ""}
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    type="text"
                                    name="city"
                                    label="City"
                                    value={shipping?.city || ""}
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="address_1"
                                    type="text"
                                    label="Address - 1"
                                    value={shipping?.address_1 || ""}
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="address_2"
                                    type="text"
                                    label="Address - 2"
                                    value={shipping?.address_2 || ""}
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    name="pincode"
                                    type="text"
                                    label="Post Code"
                                    value={shipping?.pincode || ""}
                                    onChange={(e) => handleChange(e, 'shipping')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                }

                {(userType == "influencer") && <Accordion expanded={expanded === 'Commission'} onChange={handleChangeExpand('Commission')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
                    <AccordionSummary
                        sx={{ backgroundColor: UIColor, color: "#fff" }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header">
                        <Typography sx={{ width: '50%', flexShrink: 0, fontSize: "1rem", fontWeight: 500, textTransform: "capitalize" }}>
                            Commission Details
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ border: `2px solid ${UIColor}`, borderRadius: "0 0 8px 8px" }}>
                        <Grid container spacing={12}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>

                                <Box display="flex" alignItems="center" sx={{
                                    width: "50%",

                                    "& .react-datepicker-popper": {
                                        zIndex: "999"
                                    },
                                    "& .startDate": {
                                        mr: "10px"
                                    },
                                    "& .endDate": {
                                        ml: "10px"
                                    }
                                }}>
                                    <ReactDatePicker
                                        selected={commission?.start_date ? new Date(commission?.start_date) : new Date()}
                                        onChange={(date) => setFormData({ ...formData, commission: { ...formData?.commission, start_date: date } })}
                                        selectsStart
                                        className="startDate"
                                        customInput={<DateCustomInput label="Start Date" className="startDate" />}
                                        startDate={commission?.start_date ? new Date(commission?.start_date) : new Date()}
                                        endDate={commission?.end_date ? new Date(commission?.end_date) : new Date()}
                                    />
                                    <ReactDatePicker
                                        selected={commission?.end_date ? new Date(commission?.end_date) : new Date()}
                                        onChange={(date) => setFormData({ ...formData, commission: { ...formData?.commission, end_date: date } })}
                                        selectsEnd
                                        customInput={<DateCustomInput label="End Date" className="endDate" />}
                                        className="endDate"
                                        startDate={commission?.start_date ? commission?.start_date : new Date()}
                                        endDate={commission?.end_date ? commission?.end_date : new Date()}
                                        minDate={commission?.start_date ? commission?.start_date : new Date()}
                                    />
                                </Box>

                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label"> Base Commission Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={commission?.base_commission_type ?? "FIX"}
                                        onChange={(e) => handleChange(e, 'commission')}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="base_commission_type">
                                        <FormControlLabel value="FIX" control={<Radio />} label="Fixed" />
                                        <FormControlLabel value="PCT" control={<Radio />} label="Percentage" />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    type="text"
                                    name="base_commission"
                                    id="standard-basic"
                                    value={commission?.base_commission ?? ""}
                                    onChange={(e) => handleChange(e, 'commission')}
                                    label="Base Commission"
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="thersold_commission"
                                    label="Threshold Commission"
                                    value={commission?.thersold_commission ?? ""}
                                    onChange={(e) => handleChange(e, 'commission')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Additional Commission Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={commission?.additional_commission_type ?? "PCT"}
                                        onChange={(e) => handleChange(e, 'commission')}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="additional_commission_type">
                                        <FormControlLabel value="FIX" control={<Radio />} label="Fixed" />
                                        <FormControlLabel value="PCT" control={<Radio />} label="Percentage" />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    type="text"
                                    name="additional_commission"
                                    label="Additional Commission"
                                    value={commission?.additional_commission ?? ""}
                                    onChange={(e) => handleChange(e, 'commission')}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                }

                {(userType == "Reseller" || userType == "influencer") && <Accordion expanded={expanded === 'Account'} onChange={handleChangeExpand('Account')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
                    <AccordionSummary
                        sx={{ backgroundColor: UIColor, color: "#fff" }}
                        expandIcon={<ExpandMoreIcon sx={{ color: "#fff" }} />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header">
                        <Typography sx={{ width: '50%', flexShrink: 0, fontSize: "1rem", fontWeight: 500, textTransform: "capitalize" }}>
                            Account Details
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ border: `2px solid ${UIColor}`, borderRadius: "0 0 8px 8px" }}>
                        <Grid container spacing={12}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <TextField
                                    type="text"
                                    name="bank_name"
                                    id="standard-basic"
                                    value={bank_name || ""}
                                    onChange={(e) => handleChange(e)}
                                    label="Bank Name"
                                />

                                <TextField
                                    type="text"
                                    name="account_number"
                                    label="Bank Account Number"
                                    onChange={(e) => handleChange(e)}
                                    value={account_number || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="bank_ifsc"
                                    label="Bank IFSC Code"
                                    onChange={(e) => handleChange(e)}
                                    value={bank_ifsc || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="upi"
                                    label="UPI ID"
                                    value={upi || ""}
                                    onChange={(e) => handleChange(e)}
                                    validators={["required", "isEmail"]}
                                    errorMessages={["this field is required", "email is not valid"]}
                                />

                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                }

                <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                    <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                        <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }} onClick={() => navigate(-1)}>
                            <Icon>arrow_back</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
                        </Button>
                        <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }}>
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                        </Button>
                        <Button color="error" variant="contained" onClick={() => setOpen(true)} sx={{ mr: 2, mt: 2 }}>
                            <Icon>delete</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</Span>
                        </Button>
                    </Box>
                    {(userType == "Customer") && <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"} >
                        <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }}
                            onClick={() => navigate("/user/wishlist")}
                        >
                            <Icon>star_rate</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>User wishlist</Span>
                        </Button>
                        <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }}
                            onClick={() => navigate("/user/cart/details")}
                        >
                            <Icon>star_rate</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>User Cart Details</Span>
                        </Button>
                        <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }}
                            onClick={() => navigate("/user/payment/history")}
                        >
                            <Icon>star_rate</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>User payment history</Span>
                        </Button>
                    </Box>
                    }
                </Box>
            </ValidatorForm>
            <DeleteModel open={open} deleteData={formData} type={userType} handleClose={() => setOpen(false)} />
        </div >
    );
};

export default UserForm;

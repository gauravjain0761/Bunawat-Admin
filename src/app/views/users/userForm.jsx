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
import DeleteModel from "../models/deleteModel";
import ReactDatePicker from "react-datepicker";
import { format } from "date-fns";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const UserForm = ({ data = {}, userType }) => {
    const [formData, setFormData] = useState(data);
    const [open, setOpen] = useState(false);
    const [isOpenStart, setIsOpenStart] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const [expanded, setExpanded] = useState(false);

    const handleChangeExpand = (panel) => (event, isExpanded) => {
        console.log(event.target, isExpanded)
        setExpanded(isExpanded ? panel : false);
    };

    const navigate = useNavigate();
    useEffect(() => {
        setFormData(data)
    }, [data])

    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
    };

    const handleChange = (event) => {
        if (event.target.name == "phone" || event.target.name == "baseCommission" || event.target.name == "thresholdCommission" || event.target.name == "additionalCommission") {
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
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const {
        image,
        userName,
        fname,
        lname,
        phone,
        email,
        password,
        state,
        district,
        city,
        address_one,
        address_two,
        post_code,
        collection,
        pan_number,
        type,
        bankName,
        bankAccountNumber,
        bankIFSC,
        upiID,
        customerType,
        agencyName,
        notes,
        commissionType,
        baseCommission,
        thresholdCommission,
        additionalcommissionType,
        additionalCommission
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
                                name="password"
                                type="password"
                                label="Password"
                                value={password || ""}
                                onChange={handleChange}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            {(type == "reseller" || type == "influncer") &&
                                <TextField
                                    name="text"
                                    type="pan_number"
                                    label="Pan Number"
                                    value={pan_number || ""}
                                    onChange={handleChange}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                            }

                            {/* {type == "customer" &&
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Customer Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={customerType ?? "Active"}
                                        onChange={handleChange}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="customerType">
                                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                                        <FormControlLabel value="Passive" control={<Radio />} label="Passive" />
                                    </RadioGroup>
                                </FormControl>
                            } */}

                            {(type == "influncer") &&
                                <>
                                    <TextField
                                        type="text"
                                        name="agencyName"
                                        label="Agency Name"
                                        onChange={handleChange}
                                        value={agencyName || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />

                                    <TextField
                                        type="text"
                                        name="notes"
                                        label="Notes"
                                        onChange={handleChange}
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
                            <TextField
                                name="text"
                                type="post_code"
                                label="Post Code"
                                value={post_code || ""}
                                onChange={handleChange}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            {(type == "influncer") &&
                                <FormControl fullWidth >
                                    <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={collection}
                                        name="collection"
                                        label="Collection"
                                        onChange={handleChange}>
                                        <MenuItem value="Ethnic Sets">Ethnic Sets</MenuItem>
                                        <MenuItem value="Floor Length Designs">Floor Length Designs</MenuItem>
                                        <MenuItem value="Lehengas">Lehengas</MenuItem>
                                        <MenuItem value="Shararas">Shararas</MenuItem>
                                        <MenuItem value="Shararas">Shararas</MenuItem>
                                        <MenuItem value="Stylised Drapes">Stylised Drapes</MenuItem>
                                    </Select>
                                </FormControl>
                            }
                        </Grid>
                    </Grid>
                </SimpleCard>

                {(type == "reseller") && <Accordion expanded={expanded === 'Billing'} onChange={handleChangeExpand('Billing')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
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
                                    onChange={handleChange}
                                    label="Username (Min length 4, Max length 10)"
                                />

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
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                }

                {(type == "influncer") && <Accordion expanded={expanded === 'Shipping'} onChange={handleChangeExpand('Shipping')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
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
                                    name="userName"
                                    id="standard-basic"
                                    value={userName || ""}
                                    onChange={handleChange}
                                    label="Username (Min length 4, Max length 10)"
                                />

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
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                }

                {(type == "influncer") && <Accordion expanded={expanded === 'Commission'} onChange={handleChangeExpand('Commission')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
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
                                        selected={startDate}
                                        onChange={(date) => setStartDate(date)}
                                        selectsStart
                                        className="startDate"
                                        customInput={<DateCustomInput label="Start Date" className="startDate" />}
                                        startDate={startDate}
                                        endDate={endDate}
                                    />
                                    <ReactDatePicker
                                        selected={endDate}
                                        onChange={(date) => setEndDate(date)}
                                        selectsEnd
                                        customInput={<DateCustomInput label="End Date" className="endDate" />}
                                        className="endDate"
                                        startDate={startDate}
                                        endDate={endDate}
                                        minDate={startDate}
                                    />
                                </Box>

                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label"> Base Commission Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={commissionType ?? "Fixed"}
                                        onChange={handleChange}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="commissionType">
                                        <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                                        <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    type="text"
                                    name="baseCommission"
                                    id="standard-basic"
                                    value={baseCommission || ""}
                                    onChange={handleChange}
                                    label="Base Commission"
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="thresholdCommission"
                                    label="Threshold Commission"
                                    onChange={handleChange}
                                    value={thresholdCommission || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Additional Commission Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={additionalcommissionType ?? "Percentage"}
                                        onChange={handleChange}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="additionalcommissionType">
                                        <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                                        <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                                    </RadioGroup>
                                </FormControl>

                                <TextField
                                    type="text"
                                    name="additionalCommission"
                                    label="Additional Commission"
                                    onChange={handleChange}
                                    value={additionalCommission || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                }

                {(type == "reseller" || type == "influncer") && <Accordion expanded={expanded === 'Account'} onChange={handleChangeExpand('Account')} sx={{ borderRadius: "0 0 8px 8px", mt: 2 }}>
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
                                    name="userName"
                                    id="standard-basic"
                                    value={bankName || ""}
                                    onChange={handleChange}
                                    label="Bank Name"
                                />

                                <TextField
                                    type="text"
                                    name="bankAccountNumber"
                                    label="Bank Account Number"
                                    onChange={handleChange}
                                    value={bankAccountNumber || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="lname"
                                    label="Bank IFSC Code"
                                    onChange={handleChange}
                                    value={bankIFSC || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="email"
                                    label="UPI ID"
                                    value={upiID || ""}
                                    onChange={handleChange}
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
                    {(type == "customer") && <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"} >
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
            <DeleteModel open={open} handleClose={() => setOpen(false)} />
        </div >
    );
};

export default UserForm;

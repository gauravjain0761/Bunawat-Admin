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
    Radio,
    RadioGroup,
    styled,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import { Span } from "app/components/Typography";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";
import { UIColor } from "app/utils/constant";
import DeleteModel from "../models/deleteModel";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const UserForm = ({ data = {}, userType }) => {
    const [formData, setFormData] = useState(data);
    const [open, setOpen] = useState(false);


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
        if (event.target.name == "mobile") {
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
        firstName,
        lastName,
        mobile,
        email,
        password,
        state,
        district,
        city,
        address_one,
        address_two,
        post_code,
        pan_number,
        type,
        bankName,
        bankAccountNumber,
        bankIFSC,
        upiID,
        customerType,
        agencyName
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title={`${userType} Details`} backArrow={true}>
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            {/* <Box sx={{ mb: 3.5 }} display="flex" alignItems="center">
                                <Avatar name={firstName} round={true} size="50" />
                                <Button>
                                    Change
                                </Button>
                            </Box> */}

                            <TextField
                                type="text"
                                name="firstName"
                                label="First Name"
                                onChange={handleChange}
                                value={firstName || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="lastName"
                                label="Last Name"
                                onChange={handleChange}
                                value={lastName || ""}
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
                                name="mobile"
                                label="Mobile Nubmer"
                                onChange={handleChange}
                                value={mobile || ""}
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

                            {type == "customer" &&
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
                            }

                            {(type == "influncer") &&
                                <TextField
                                    type="text"
                                    name="agencyName"
                                    label="Agency Name"
                                    onChange={handleChange}
                                    value={agencyName || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
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
                        </Grid>
                    </Grid>
                </SimpleCard>

                {(type == "reseller") && <SimpleCard title="Billing Address">
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
                                name="firstName"
                                label="First Name"
                                onChange={handleChange}
                                value={firstName || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="lastName"
                                label="Last Name"
                                onChange={handleChange}
                                value={lastName || ""}
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
                                name="mobile"
                                label="Mobile Nubmer"
                                onChange={handleChange}
                                value={mobile || ""}
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
                </SimpleCard>
                }

                {(type == "influncer") && <SimpleCard title="Shipping Address">
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
                                name="firstName"
                                label="First Name"
                                onChange={handleChange}
                                value={firstName || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="lastName"
                                label="Last Name"
                                onChange={handleChange}
                                value={lastName || ""}
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
                                name="mobile"
                                label="Mobile Nubmer"
                                onChange={handleChange}
                                value={mobile || ""}
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
                    {!(type == "reseller" || type == "influncer") && <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                        <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                            <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }} onClick={() => navigate(-1)}>
                                <Icon>arrow_back</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
                            </Button>
                            <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }}>
                                <Icon>send</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                            </Button>
                            <Button color="error" variant="contained" sx={{ mr: 2, mt: 2 }}>
                                <Icon>delete</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</Span>
                            </Button>
                        </Box>
                        {/* <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"} >
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/wishlist")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User wishlist</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/cart/details")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User Cart Details</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/payment/history")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User payment history</Span>
                            </Button>
                        </Box> */}
                    </Box>
                    }
                </SimpleCard>
                }

                {/* <Accordion sx={{ backgroundColor: UIColor, color: "#fff", p: 2, mt: 2 }} expanded={expanded === 'panel1'} onChange={handleChangeExpand('panel1')}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header">
                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                            User Account Details
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                       
                    </AccordionDetails>
                </Accordion> */}

                {(type == "reseller" || type == "influncer") && <SimpleCard title="Account Details">
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
                                name="firstName"
                                label="Bank Account Number"
                                onChange={handleChange}
                                value={bankAccountNumber || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="lastName"
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
                </SimpleCard>
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
                    {/* <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"} >
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/wishlist")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User wishlist</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/cart/details")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User Cart Details</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/payment/history")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User payment history</Span>
                            </Button>
                        </Box> */}
                </Box>
            </ValidatorForm>
            <DeleteModel open={open} handleClose={() => setOpen(false)} />
        </div >
    );
};

export default UserForm;

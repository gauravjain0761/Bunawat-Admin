import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    Icon,
    Radio,
    RadioGroup,
    styled,
} from "@mui/material";
import { SimpleCard } from "app/components";
import { Span } from "app/components/Typography";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const UserForm = ({ data = {} }) => {
    const [formData, setFormData] = useState(data);
    const navigate = useNavigate();
    useEffect(() => {
        setFormData(data)
    }, [data])


    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
    };

    const handleChange = (event) => {
        event.persist();
        setFormData({ ...formData, [event.target.name]: event.target.value });
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
        post_code
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="User Details">
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <Box sx={{ mb: 3.5 }} display="flex" alignItems="center">
                                <Avatar name={firstName} round={true} size="50" />
                                <Button>
                                    Change
                                </Button>
                            </Box>

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
                                type="number"
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

                <SimpleCard title="User Billing Address">
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="text"
                                name="userName"
                                id="standard-basic"
                                value={userName || ""}
                                onChange={handleChange}
                                errorMessages={["this field is required"]}
                                label="Username (Min length 4, Max length 9)"
                                validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
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
                                type="number"
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

                <SimpleCard title="User Shipping Address">
                    <Grid container spacing={6}>
                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 2 }}>
                            <TextField
                                type="text"
                                name="userName"
                                id="standard-basic"
                                value={userName || ""}
                                onChange={handleChange}
                                errorMessages={["this field is required"]}
                                label="Username (Min length 4, Max length 9)"
                                validators={["required", "minStringLength: 4", "maxStringLength: 9"]}
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
                                type="number"
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
                    <Box display="flex" alignItems="center">
                        <Button color="primary" variant="contained" type="submit">
                            <Icon>send</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                        </Button>
                        <Button color="error" variant="contained" sx={{ ml: 2 }}>
                            <Icon>delete</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</Span>
                        </Button>
                        <Button color="primary" variant="contained" sx={{ ml: 2 }} onClick={() => navigate("/user/wishlist")}>
                            <Icon>star_rate</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>User wishlist</Span>
                        </Button>
                        <Button color="primary" variant="contained" sx={{ ml: 2 }} onClick={() => navigate("/user/cart/details")}>
                            <Icon>star_rate</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>User Cart Details</Span>
                        </Button>
                        <Button color="primary" variant="contained" sx={{ ml: 2 }} onClick={() => navigate("/user/payment/history")}>
                            <Icon>star_rate</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>User payment history</Span>
                        </Button>
                    </Box>
                </SimpleCard>

            </ValidatorForm>
        </div >
    );
};

export default UserForm;

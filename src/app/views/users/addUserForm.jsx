import {
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
} from "@mui/material";
import { SimpleCard } from "app/components";
import { Span } from "app/components/Typography";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const AddUserForm = ({ data = {}, disableRole = false }) => {
    const [formData, setFormData] = useState(data ?? {});
    const navigate = useNavigate();
    useEffect(() => {
        if (data) {
            setFormData(data)
        }
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
        firstName,
        lastName,
        mobile,
        email,
        password,
        role,
        customerType
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title={`Add ${role ? role : "User"}`}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
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

                            <FormControl fullWidth >
                                <InputLabel id="demo-simple-select-label">User Role</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={role}
                                    name="role"

                                    inputProps={{ readOnly: disableRole }}
                                    label="User Role"
                                    onChange={handleChange}>
                                    <MenuItem value="Customer">Customer</MenuItem>
                                    <MenuItem value="Reseller">Reseller</MenuItem>
                                    <MenuItem value="Influncer">Influncer</MenuItem>
                                </Select>
                            </FormControl>

                            {role == "Customer" &&
                                <FormControl sx={{ mt: 2 }}>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Customer Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={customerType}
                                        onChange={handleChange}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="customerType">
                                        <FormControlLabel value="Active" control={<Radio />} label="Active" />
                                        <FormControlLabel value="Passive" control={<Radio />} label="Passive" />
                                    </RadioGroup>
                                </FormControl>
                            }
                        </Grid>
                    </Grid>
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
                        </Box>
                    </Box>
                </SimpleCard>

            </ValidatorForm>
        </div >
    );
};

export default AddUserForm;

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
import { API_URL } from "app/constant/api";
import { toast } from 'material-react-toastify';
import { ApiPost } from "app/service/api";
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


    const getURL = (role) => {
        if (role == 'Customer') {
            return API_URL.addCustomer
        }
        if (role == 'Reseller') {
            return API_URL.addResller
        }
        if (role == 'influencer') {
            return API_URL.addInfluencer
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

    const handleSubmit = async () => {
        if (getURL() != "") {
            await ApiPost(getURL(formData?.role), formData)
                .then((response) => {
                    toast.success('Add Successfully!')
                    getBack(formData?.role)
                })
                .catch((error) => {
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        } else {

        }
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
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const {
        fname,
        lname,
        phone,
        email,
        password,
        role,
        customerType
    } = formData;

    if (!ValidatorForm.hasValidationRule('isPassword')) {
        ValidatorForm.addValidationRule('isPassword', (value) => {
            const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
            return strongRegex.test(value);
        });
    }

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title={`Add ${role ? role : "User"}`}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
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
                                errorMessages={["this field is required", "Enter valid number", "Enter strong number"]}
                            />

                            <TextField
                                name="password"
                                type="password"
                                label="Password"
                                value={password || ""}
                                onChange={handleChange}
                                validators={["required", "isPassword"]}
                                errorMessages={["this field is required", "Enter valid password"]}
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
                                    <MenuItem value="influencer">Influencer</MenuItem>
                                </Select>
                            </FormControl>

                            {/* {role == "Customer" &&
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
                            } */}
                        </Grid>
                    </Grid>
                    <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                        <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
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
                </SimpleCard>
            </ValidatorForm>
        </div >
    );
};

export default AddUserForm;

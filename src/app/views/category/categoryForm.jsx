import { CheckBox } from "@mui/icons-material";
import {
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

const CategoryForm = ({ data = {} }) => {
    const [formData, setFormData] = useState({ ...data, pCategory: "None" });
    const navigate = useNavigate();
    useEffect(() => {
        setFormData({ ...data, pCategory: "None" })
    }, [data])


    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
    };

    const handleChange = (event) => {
        console.log("handleChange", formData)
        if (event.target.name == "home" || event.target.name == "men" || event.target.name == "women" || event.target.name == "wedding_store") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const {
        name,
        slug,
        description,
        count,
        pCategory,
        visibility,
        product_id
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="Category" backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="demo-simple-select-label">Parent Category</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={pCategory}
                                    name="pCategory"
                                    label="Parent Category"
                                    onChange={handleChange}>
                                    <MenuItem value="None">None</MenuItem>
                                    <MenuItem value="Ethnic Sets">Ethnic Sets</MenuItem>
                                    <MenuItem value="Floor Length Designs">Floor Length Designs</MenuItem>
                                    <MenuItem value="Lehengas">Lehengas</MenuItem>
                                    <MenuItem value="Shararas">Shararas</MenuItem>
                                    <MenuItem value="Shararas">Shararas</MenuItem>
                                    <MenuItem value="Stylised Drapes">Stylised Drapes</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                type="text"
                                name="name"
                                label="Name"
                                onChange={handleChange}
                                value={name || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="slug"
                                label="slug"
                                value={slug || ""}
                                onChange={handleChange}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
                            <TextField
                                type="text"
                                name="description"
                                label="Description"
                                onChange={handleChange}
                                value={description || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <FormControl sx={{}} component="fieldset" variant="standard">
                                <FormLabel component="legend">Visibility</FormLabel>
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={visibility?.home} onChange={handleChange} name="home" />
                                        }
                                        label="Home"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={visibility?.men} onChange={handleChange} name="men" />
                                        }
                                        label="Men"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={visibility?.women} onChange={handleChange} name="women" />
                                        }
                                        label="Women"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={visibility?.wedding_store} onChange={handleChange} name="wedding_store" />
                                        }
                                        label="Wedding store"
                                    />
                                </FormGroup>
                            </FormControl>

                            <TextField
                                type="text"
                                sx={{ mt: 2 }}
                                name="product_id"
                                label="Product IDs for Collection page"
                                onChange={handleChange}
                                value={product_id || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />
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
                </SimpleCard>

            </ValidatorForm>
        </div >
    );
};

export default CategoryForm;

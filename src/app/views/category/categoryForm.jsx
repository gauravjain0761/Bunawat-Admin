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

const CategoryForm = ({ data = {}, type }) => {
    const [formData, setFormData] = useState(data);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setFormData(data)
    }, [data])


    const handleSubmit = (event) => {
        if (!searchParams.get("redirect")) {
            alert("Success")
            console.log("submitted");
            console.log(event);
        } else {
            navigate(`/category/details/${searchParams.get("redirect")}`)
        }
    };

    const handleChange = (event) => {
        if (event.target.name == "home") {
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
        sCategory,
        pCategory,
        visibility,
        categoryCode
    } = formData;

    const getTitle = () => {
        if (type == "parent") {
            return "Parent Category"
        } else if (type == "sub") {
            return "Parent Sub Category"
        } else if (type == "list") {
            return "Category"
        } else {
            return "Category"
        }
    };

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title={getTitle()} backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>

                            {(type == "sub" || type == "list") &&
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Parent Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={pCategory}
                                        name="pCategory"
                                        label="Parent Category"
                                        onChange={handleChange}>
                                        <MenuItem value="Ethnic Sets">Ethnic Sets</MenuItem>
                                        {/* <MenuItem value="Palazzo Sets">&nbsp;&nbsp;&nbsp;Palazzo Sets</MenuItem>
                                        <MenuItem value="Pant Sets">&nbsp;&nbsp;&nbsp;Pant Sets</MenuItem>
                                        <MenuItem value="Skirt Sets">&nbsp;&nbsp;&nbsp;Skirt Sets</MenuItem> */}
                                        <MenuItem value="Floor Length Designs">Floor Length Designs</MenuItem>
                                        {/* <MenuItem value="Floor Length Anarkalis">&nbsp;&nbsp;&nbsp;Floor Length Anarkalis</MenuItem>
                                        <MenuItem value="Gowns">&nbsp;&nbsp;&nbsp;Gowns</MenuItem> */}
                                        <MenuItem value="Lehengas">Lehengas</MenuItem>
                                        <MenuItem value="Shararas">Shararas</MenuItem>
                                        <MenuItem value="Stylised Drapes">Stylised Drapes</MenuItem>
                                    </Select>
                                    <Typography onClick={() => navigate(`/category/details/parent?redirect=${type}`)} sx={{ width: "fit-content", mt: 1, flexShrink: 0, cursor: "pointer", fontSize: "14px", color: "blue", fontWeight: 500, textTransform: "capitalize" }}>
                                        Add Parent Category
                                    </Typography>
                                </FormControl>
                            }

                            {(type == "list") &&
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Parent Sub Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={sCategory}
                                        name="sCategory"
                                        label="Parent Sub Category"
                                        onChange={handleChange}>
                                        <MenuItem value="Palazzo Sets">Palazzo Sets</MenuItem>
                                        <MenuItem value="Pant Sets">Pant Sets</MenuItem>
                                        <MenuItem value="Skirt Sets">Skirt Sets</MenuItem>
                                        <MenuItem value="Floor Length Anarkalis">Floor Length Anarkalis</MenuItem>
                                        <MenuItem value="Gowns">Gowns</MenuItem>
                                    </Select>
                                    <Typography onClick={() => navigate(`/category/details/sub?redirect=${type}`)} sx={{ width: "fit-content", mt: 1, flexShrink: 0, cursor: "pointer", fontSize: "14px", color: "blue", fontWeight: 500, textTransform: "capitalize" }}>
                                        Add Parent Sub Category
                                    </Typography>
                                </FormControl>
                            }

                            <TextField
                                type="text"
                                name="name"
                                label="Name"
                                onChange={handleChange}
                                value={name || ""}
                            />

                            <TextField
                                type="text"
                                name="slug"
                                label="Slug"
                                value={slug || ""}
                                onChange={handleChange}
                            />
                            <TextField
                                type="text"
                                name="description"
                                label="Description"
                                onChange={handleChange}
                                value={description || ""}
                            />
                            <TextField
                                type="text"
                                name="categoryCode"
                                label="Code"
                                onChange={handleChange}
                                value={categoryCode || ""}
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
                                </FormGroup>
                            </FormControl>

                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={["Saree", "Dress", "Full Dress"]}
                                sx={{ mt: 2 }}
                                renderInput={(params) => <TextField {...params} label="Link with category or collection" />}
                            />
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
                            {/* <Button color="error" variant="contained" sx={{ mr: 2, mt: 2 }}>
                                <Icon>delete</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</Span>
                            </Button> */}
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

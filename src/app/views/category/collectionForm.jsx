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
} from "@mui/material";
import { SimpleCard } from "app/components";
import TextEditor from "app/components/textEditor";
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

const CollectionForm = ({ data = {} }) => {
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
        if (event.target.name == "home") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };


    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const {
        name,
        slug,
        description,
        count,
        pCategory,
        visibility,
        productId,
        image
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="Collection" backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>

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
                            {/* <TextField
                                type="text"
                                name="description"
                                label="Description"
                                onChange={handleChange}
                                value={description || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            /> */}

                            <Box sx={{ mb: 2 }}>
                                <TextEditor />
                            </Box>

                            <Autocomplete
                                disablePortal
                                id="combo-box-demo"
                                options={["Saree", "Dress", "Full Dress"]}
                                renderInput={(params) => <TextField {...params} label="Link with category or collection" />}
                            />

                            <FormControl sx={{ flexDirection: 'row', alignItems: 'center' }} component="div" variant="standard" >
                                {/* <FormLabel component="legend">Visibility</FormLabel> */}
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={visibility?.home} onChange={handleChange} name="home" />
                                        }
                                        label="Home Visibility"
                                    />
                                </FormGroup>
                            </FormControl>

                            {visibility?.home &&
                                <>
                                    <Box display="flex" flexDirection="column">
                                        <Span sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: "18px" }}>Media</Span>
                                        <Box sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                        }}>
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
                                        </Box>
                                    </Box>

                                    <TextField
                                        sx={{ mt: 3 }}
                                        type="text"
                                        name="productId"
                                        label="Link with productId"
                                        onChange={handleChange}
                                        value={productId || ""}
                                    />

                                </>
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
                            {/* <Button color="error" variant="contained" sx={{ mr: 2, mt: 2 }}>
                                <Icon>delete</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</Span>
                            </Button> */}
                        </Box>
                    </Box>
                </SimpleCard>

            </ValidatorForm>
        </div >
    );
};

export default CollectionForm;

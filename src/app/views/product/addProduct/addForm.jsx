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
    Switch,
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

const ProductForm = ({ data = {} }) => {
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
        console.log(event.target.name)
        if (event.target.name == "home") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else if (event.target.name == "image") {
            const images = formData[event.target.name] ?? []
            setFormData({ ...formData, [event.target.name]: [...images, { url: URL.createObjectURL(event.target.files[0]), checked: false }] });
        } else if (event.target.name == "videos") {
            const videos = formData[event.target.name] ?? []
            setFormData({ ...formData, [event.target.name]: [...videos, { url: URL.createObjectURL(event.target.files[0]), checked: false }] });
        } else if (event.target.name == "mrp" || event.target.name == "salePrice" || event.target.name == "reSellerPrice" || event.target.name == "partyCommission") {
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


    const handleDeleteImage = (index) => {
        let images = formData?.image ?? []
        images = images?.filter((img, i) => i != index)
        setFormData({ ...formData, image: images });
    };

    const handleSwitchImage = (index, max = 5) => {
        let images = formData?.image ?? []
        if (images?.filter((img) => img.checked).length < max) {
            images[index] = { ...images[index], checked: !images[index].checked }
            setFormData({ ...formData, image: images });
        }
    };

    const handleDeleteVideo = (index) => {
        console.log(index)
        let videos = formData?.videos ?? []
        videos = videos?.filter((img, i) => i != index)
        setFormData({ ...formData, videos: videos });
    };

    const handleSwitchVideo = (index, max = 4) => {
        console.log(max)
        let videos = formData?.videos ?? []
        if (videos?.filter((video) => video.checked).length < max) {
            videos[index] = { ...videos[index], checked: !videos[index].checked }
            setFormData({ ...formData, videos: videos });
        }
    };

    const {
        category,
        collection,
        designNo,
        name,
        description,
        image,
        videos,
        mrp,
        salePrice,
        reSellerPrice,
        partyCommissionType,
        partyCommission,
        taxType,
        isActive
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="Product" backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel htmlFor="grouped-native-select">Category</InputLabel>
                                <Select id="grouped-native-select" label="Category"
                                    value={category}
                                    name="category"
                                    onChange={handleChange}>
                                    <MenuItem value="Ethnic Sets" disabled sx={{
                                        fontWeight: 600,
                                        color: "#000",
                                        opacity: "1 !important"
                                    }}>Ethnic Sets</MenuItem>
                                    <MenuItem value="Palazzo Sets">&nbsp;&nbsp;&nbsp;Palazzo Sets</MenuItem>
                                    <MenuItem value="Pant Sets" disabled sx={{
                                        fontWeight: 600,
                                        color: "#000",
                                        opacity: "1 !important"
                                    }}>&nbsp;&nbsp;&nbsp;Pant Sets</MenuItem>
                                    <MenuItem value="Shararas">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Shararas</MenuItem>
                                    <MenuItem value="Lehengas">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lehengas</MenuItem>
                                    <MenuItem value="Skirt Sets">&nbsp;&nbsp;&nbsp;Skirt Sets</MenuItem>
                                    <MenuItem value="Floor Length Designs" disabled sx={{
                                        fontWeight: 600,
                                        color: "#000",
                                        opacity: "1 !important"
                                    }}>Floor Length Designs</MenuItem>
                                    <MenuItem value="Floor Length Anarkalis">&nbsp;&nbsp;&nbsp;Floor Length Anarkalis</MenuItem>
                                    <MenuItem value="Gowns">&nbsp;&nbsp;&nbsp;Gowns</MenuItem>
                                    <MenuItem value="Lehengas">Lehengas</MenuItem>
                                    <MenuItem value="Shararas">Shararas</MenuItem>
                                    <MenuItem value="Stylised Drapes">Stylised Drapes</MenuItem>

                                </Select>
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={collection}
                                    name="collection"
                                    label="Collection"
                                    onChange={handleChange}>
                                    <MenuItem disabled value="Ethnic Sets">Ethnic Sets</MenuItem>
                                    <MenuItem value="Floor Length Designs">Floor Length Designs</MenuItem>
                                    <MenuItem value="Lehengas">Lehengas</MenuItem>
                                    <MenuItem value="Shararas">Shararas</MenuItem>
                                    <MenuItem value="Shararas">Shararas</MenuItem>
                                    <MenuItem value="Stylised Drapes">Stylised Drapes</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                type="text"
                                name="designNo"
                                label="Design No"
                                onChange={handleChange}
                                value={designNo || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

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
                                name="description"
                                label="Description"
                                onChange={handleChange}
                                value={description || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
                                <Span sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: "18px" }}>Media</Span>
                                <Box sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}>
                                    {image?.length > 0 && image?.map((img, i) => (
                                        <Box key={i}
                                            sx={{
                                                width: "160px",
                                                height: "200px",
                                                margin: "10px 10px 0 0",
                                                position: "relative"
                                            }}>
                                            <img src={img.url} width="100%" height="160px" />
                                            <Box sx={{ height: "40px" }} display="flex" alignItems="center" justifyContent="end">
                                                <Switch
                                                    sx={{
                                                        color: "red",
                                                        cursor: "pointer"
                                                    }}
                                                    checked={img.checked}
                                                    onChange={() => handleSwitchImage(i)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                /> <Span sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>{img.checked ? "Active" : "InActive"}</Span>
                                                <Icon onClick={() => handleDeleteImage(i)} sx={{
                                                    color: "red",
                                                    cursor: "pointer",
                                                }}>delete</Icon> <Span onClick={() => handleDeleteImage(i)} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                            </Box>
                                        </Box>
                                    ))}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            width: "160px",
                                            height: "160px",
                                            background: "transparent",
                                            color: "#000",
                                            border: "2px dashed",
                                            margin: "10px 10px 0 0",

                                            "&:hover": {
                                                background: "transparent",
                                            }
                                        }} >
                                        <Icon>add</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Upload Image</Span>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/png, image/gif, image/jpeg"
                                            hidden
                                            onClick={(event) => { event.target.value = '' }}
                                            onChange={handleChange} />
                                    </Button>
                                </Box>

                                <Box sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}>
                                    {videos?.length > 0 && videos?.map((video, i) => (
                                        <Box key={i}
                                            sx={{
                                                width: "160px",
                                                height: "200px",
                                                margin: "20px 10px 0 0",
                                                position: "relative"
                                            }}>
                                            <video width="100%" height="160px" autoPlay={true} muted={true} loop={true} playsInline={true}
                                                style={{ objectFit: "fill", borderRadius: "10px" }}>
                                                <source src={video.url} type="video/mp4" />
                                            </video>
                                            <Box sx={{ height: "40px" }} display="flex" alignItems="center" justifyContent="end">
                                                <Switch
                                                    sx={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                        zIndex: "999"
                                                    }}
                                                    checked={video.checked}
                                                    onChange={() => handleSwitchVideo(i, 4)}
                                                    inputProps={{ 'aria-label': 'controlled' }}
                                                /> <Span sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>{video.checked ? "Active" : "InActive"}</Span>
                                                <Icon onClick={() => handleDeleteVideo(i)} sx={{
                                                    color: "red",
                                                    cursor: "pointer",
                                                    zIndex: "999"
                                                }}>delete</Icon> <Span onClick={() => handleDeleteVideo(i)} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                            </Box>
                                        </Box>
                                    ))}
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            width: "160px",
                                            height: "160px",
                                            background: "transparent",
                                            color: "#000",
                                            border: "2px dashed",
                                            margin: "20px 10px 0 0",

                                            "&:hover": {
                                                background: "transparent",
                                            }
                                        }} >
                                        <Icon>add</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Upload Video</Span>
                                        <input
                                            type="file"
                                            name="videos"
                                            accept="video/mp4,video/x-m4v,video/*"
                                            hidden
                                            onClick={(event) => { event.target.value = '' }}
                                            onChange={handleChange} />
                                    </Button>
                                </Box>
                            </Box>

                            <TextField
                                type="text"
                                name="mrp"
                                sx={{ mt: 1 }}
                                label="MRP"
                                onChange={handleChange}
                                value={mrp || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="salePrice"
                                label="Sale Price"
                                onChange={handleChange}
                                value={salePrice || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="reSellerPrice"
                                label="ReSeller Price"
                                onChange={handleChange}
                                value={reSellerPrice || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label"> Party Commission Type</FormLabel>
                                <RadioGroup
                                    row
                                    value={partyCommissionType ?? "Fixed"}
                                    onChange={handleChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="partyCommissionType">
                                    <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                                    <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                                </RadioGroup>
                            </FormControl>

                            <TextField
                                type="text"
                                name="partyCommission"
                                label="Party Commission"
                                onChange={handleChange}
                                value={partyCommission || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={taxType}
                                    name="taxType"
                                    label="Tax Type"
                                    onChange={handleChange}>
                                    <MenuItem value="Standard">Standard</MenuItem>
                                    <MenuItem value="6%">6% CGST/IGST</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Is Active</FormLabel>
                                <RadioGroup
                                    row
                                    value={isActive ?? "active"}
                                    onChange={handleChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="isActive">
                                    <FormControlLabel value="active" control={<Radio />} label="Active" />
                                    <FormControlLabel value="inactive" control={<Radio />} label="InActive" />
                                </RadioGroup>
                            </FormControl>
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

export default ProductForm;

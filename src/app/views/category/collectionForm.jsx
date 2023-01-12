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
import { API_URL } from "app/constant/api";
import { ApiGet, ApiPost, ApiPut } from "app/service/api";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import { toast } from 'material-react-toastify';
import Avatar from "react-avatar";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const CollectionForm = ({ data = {}, id }) => {
    const [formData, setFormData] = useState(data);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setFormData(data)
        setDescription(data?.description)
    }, [data])

    const getCategory = async () => {
        await ApiGet(`${API_URL.getCategorys}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setCategoryList(response?.data?.map(item => {
                        return {
                            value: item?._id,
                            label: item?.name
                        }
                    }) ?? []);
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const getCollection = async () => {
        await ApiGet(`${API_URL.getCollections}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setCollectionList(response?.data?.map(item => {
                        return {
                            value: item?._id,
                            label: item?.name
                        }
                    }) ?? []);
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        getCategory();
        getCollection();
    }, [])

    const handleSubmit = async () => {
        setLoading(true)
        if (id) {
            await ApiPut(`${API_URL.editCollection}/${id}`, {
                "name": formData?.name,
                "description": description,
                "colleciton_list": formData?.linkType == 'collection' ? [formData?.linkValue?.value] : [],
                "categories_list": formData?.linkType == 'collection' ? [] : [formData?.linkValue?.value],
                "product_list": [formData?.productId]
            })
                .then((response) => {
                    setLoading(false)
                    toast.success('Edit Successfully!')
                    navigate("/collection/list")
                })
                .catch((error) => {
                    setLoading(false)
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        } else {
            await ApiPost(API_URL.addCollection, {
                "name": formData?.name,
                "description": description,
                "colleciton_list": formData?.linkType == 'collection' ? [formData?.linkValue?.value] : [],
                "categories_list": formData?.linkType == 'collection' ? [] : [formData?.linkValue?.value],
                "product_list": [formData?.productId]
            })
                .then((response) => {
                    setLoading(false)
                    toast.success('Add Successfully!')
                    navigate("/collection/list")
                })
                .catch((error) => {
                    setLoading(false)
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        }
    };

    const handleChange = (event) => {
        if (event.target.name == "home") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else if (event.target.name == "linkType") {
            setFormData({ ...formData, linkValue: null, [event.target.name]: event.target.value });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };


    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const {
        name,
        linkType,
        linkValue,
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

                            <Box sx={{ mb: 2 }}>
                                <TextEditor data={description} setData={(d) => setDescription(d)} />
                            </Box>

                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>Link with </FormLabel>
                                <RadioGroup
                                    row
                                    value={linkType ?? "category"}
                                    onChange={handleChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="linkType">
                                    <FormControlLabel value="category" control={<Radio />} label="Category" />
                                    <FormControlLabel value="collection" control={<Radio />} label="Collection" />
                                </RadioGroup>
                            </FormControl>

                            {linkType == 'collection' ?
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    onChange={(e, newValue) => {
                                        setFormData({ ...formData, linkValue: newValue });
                                    }}
                                    value={linkValue ?? null}
                                    options={collectionList}
                                    getOptionLabel={(option) => option?.label}
                                    renderInput={(params) => <TextField {...params} label="Link with collection " />}
                                />
                                :
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    onChange={(e, newValue) => {
                                        setFormData({ ...formData, linkValue: newValue });
                                    }}
                                    value={linkValue ?? null}
                                    options={categoryList}
                                    getOptionLabel={(option) => option?.label}
                                    renderInput={(params) => <TextField {...params} label="Link with category" />}
                                />
                            }


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
                            <LoadingButton
                                loading={loading}
                                loadingPosition="start"
                                type="submit"
                                sx={{ mr: 2, mt: 2 }}
                                startIcon={<Icon>send</Icon>}
                                variant="contained">
                                Save
                            </LoadingButton>
                        </Box>
                    </Box>
                </SimpleCard>

            </ValidatorForm>
        </div >
    );
};

export default CollectionForm;

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
import TextEditor from "app/components/textEditor";
import { Span } from "app/components/Typography";
import { API_URL } from "app/constant/api";
import { ApiGet, ApiPost, ApiPut } from "app/service/api";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { toast } from 'material-react-toastify';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const CategoryForm = ({ data = {}, id, type }) => {
    const [formData, setFormData] = useState(data);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [parentCategoryList, setParentCategoryList] = useState([]);
    const [parentSubCategoryList, setParentSubCategoryList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);

    useEffect(() => {
        let temp = { ...data }
        if (temp?.link_with == 'COLLECTION') {
            temp = { ...temp, linkValue: temp?.colleciton_list?.[0], productId: temp?.product_list?.[0] ?? '' }
        } else {
            temp = { ...temp, linkValue: temp?.categories_list?.[0], productId: temp?.product_list?.[0] ?? '' }
        }
        setFormData(temp)
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

    const getParentCategory = async () => {
        await ApiGet(`${API_URL.getParentCategorys}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setParentCategoryList(response?.data?.map(item => {
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

    const getParentSubCategory = async () => {
        await ApiGet(`${API_URL.getParentSubCategorys}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setParentSubCategoryList(response?.data?.map(item => {
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
        if (type == "sub" || type == "list") getParentCategory();
        if (type == "list") getParentSubCategory();
        getCategory();
        getCollection();
    }, [type])

    const getEditURL = (role) => {
        if (role == 'parent') {
            return API_URL.editParentCategory
        }
        if (role == 'sub') {
            return API_URL.editParentSubCategory
        }
        if (role == 'list') {
            return API_URL.editCategory
        }
    }

    const getURL = (role) => {
        if (role == 'parent') {
            return API_URL.addParentCategory
        }
        if (role == 'sub') {
            return API_URL.addParentSubCategory
        }
        if (role == 'list') {
            return API_URL.addCategory
        }
    }

    const handleSubmit = async (event) => {
        setLoading(true)
        const { link_with, linkValue, productId, ...payload } = formData
        if (id) {
            await ApiPut(`${getEditURL(type)}/${id}`, {
                description,
                ...payload,
                link_with: link_with ?? 'CATEGORY',
                "image": "",
                "colleciton_list": link_with == 'COLLECTION' ? [linkValue] : [],
                "categories_list": link_with == 'COLLECTION' ? [] : [linkValue],
                "product_list": productId ? [productId] : []
            })
                .then((response) => {
                    toast.success('Edit Successfully!')
                    setLoading(false)
                    if (!searchParams.get("redirect")) {
                        navigate(`/category/${type}`)
                    } else {
                        navigate(`/category/details/${searchParams.get("redirect")}`)
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        } else {
            await ApiPost(`${getURL(type)}`, {
                description,
                ...payload,
                link_with: link_with ?? 'CATEGORY',
                "image": "",
                "colleciton_list": linkValue ? (link_with == 'COLLECTION' ? [linkValue] : []) : [],
                "categories_list": linkValue ? (link_with == 'COLLECTION' ? [] : [linkValue]) : [],
                "product_list": productId ? [productId] : []
            })
                .then((response) => {
                    toast.success('Add Successfully!')
                    setLoading(false)
                    if (!searchParams.get("redirect")) {
                        navigate(`/category/${type}`)
                    } else {
                        navigate(`/category/details/${searchParams.get("redirect")}`)
                    }
                })
                .catch((error) => {
                    setLoading(false)
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        }
    };

    const handleChange = (event) => {
        if (event.target.name == "home_visibilty") {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
        } else if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else if (event.target.name == "link_with") {
            setFormData({ ...formData, linkValue: '', [event.target.name]: event.target.value });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const {
        name,
        sub_category_id,
        title,
        parent_cateogry_id,
        home_visibilty,
        productId,
        image,
        link_with,
        linkValue,
        code
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
                                        value={parent_cateogry_id ?? ''}
                                        name="parent_cateogry_id"
                                        label="Parent Category"
                                        onChange={handleChange}>
                                        {parentCategoryList?.map((item) => (
                                            <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                        ))}
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
                                        value={sub_category_id ?? ''}
                                        name="sub_category_id"
                                        label="Parent Sub Category"
                                        onChange={handleChange}>
                                        {parentSubCategoryList?.map((item) => (
                                            <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                        ))}
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
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="title"
                                label="Title"
                                onChange={handleChange}
                                value={title || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <TextField
                                type="text"
                                name="code"
                                label="Code"
                                onChange={handleChange}
                                value={code || ""}
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
                                    value={link_with ?? "category"}
                                    onChange={handleChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="link_with">
                                    <FormControlLabel value="CATEGORY" control={<Radio />} label="Category" />
                                    <FormControlLabel value="COLLECTION" control={<Radio />} label="Collection" />
                                </RadioGroup>
                            </FormControl>

                            {link_with == 'COLLECTION' ?
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Link with collection</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={linkValue ?? ''}
                                        name="linkValue"
                                        label="Link with collection"
                                        onChange={handleChange}>
                                        {collectionList?.map((item) => (
                                            <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                :
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Link with category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={linkValue ?? ''}
                                        name="linkValue"
                                        label="Link with category"
                                        onChange={handleChange}>
                                        {categoryList?.map((item) => (
                                            <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            }

                            <FormControl sx={{ mb: 1, flexDirection: 'row', alignItems: 'center' }} component="div" variant="standard">
                                {/* <FormLabel component="legend">Visibility</FormLabel> */}
                                <FormGroup>
                                    <FormControlLabel
                                        control={
                                            <Checkbox checked={home_visibilty ?? false} onChange={handleChange} name="home_visibilty" />
                                        }
                                        label="Home Visibility"
                                    />
                                </FormGroup>
                            </FormControl>

                            {home_visibilty &&
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
                            <Button color="primary" variant="contained" type="button" sx={{ mr: 2, mt: 2 }} onClick={() => navigate(-1)}>
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

export default CategoryForm;

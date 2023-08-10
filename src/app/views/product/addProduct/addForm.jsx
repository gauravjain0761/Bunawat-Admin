import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    Grid,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    styled,
    Switch,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import useEyeDropper from 'use-eye-dropper'
import { toast } from 'material-react-toastify';
import { Span } from "app/components/Typography";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import TextEditor from "app/components/textEditor";
import { API_URL } from "app/constant/api";
import { ApiGet, ApiPost } from "app/service/api";
import React from "react";
import { LoadingButton } from "@mui/lab";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const ProductForm = ({ data = {}, ProductType }) => {
    const { open, close, isSupported } = useEyeDropper()
    const [dOpen, setDopen] = useState(false)
    const [description, setDescription] = useState("");
    const [categoryList, setCategoryList] = useState([])
    const [collectionList, setCollectionList] = useState([])
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [isErrorDescription, setIsErrorDescription] = useState(false);
    const [formError, setFormError] = useState({});
    const [formData, setFormData] = useState({
        ...data,
        collection_id: [],
        image: [],
        pCategory: "None",

        color: '#000',

        attributeData: [{
            type: 'single',
            name: 'color',
            value: null
        }, {
            type: 'multi',
            name: 'size',
            value: []
        }, {
            type: 'single',
            name: 'swatch',
            value: "#000"
        }]
    });
    const navigate = useNavigate();
    useEffect(() => {
        setFormData({
            ...data, pCategory: "None",
            collection_id: [], color: '#000', attributeData: [{
                type: 'single',
                name: 'color',
                value: null
            }, {
                type: 'multi',
                name: 'size',
                value: []
            }, {
                type: 'single',
                name: 'swatch',
                value: "#000"
            }]
        })
    }, [data])

    const getCategoryList = async () => {
        await ApiGet(`${API_URL.getCategoryList}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    let temp = [...response?.data]
                    let categoryList = [];
                    temp = temp?.map(level1 => {
                        if (level1?.sub_categories?.length == 0) {
                            categoryList.push({
                                label: level1?.name,
                                value: level1?._id,
                                disabled: false,
                                fontWeight: 600,
                                type: 'parent'
                            })
                        } else {
                            categoryList.push({
                                label: level1?.name,
                                value: level1?._id,
                                disabled: true,
                                fontWeight: 600,
                                type: 'parent'
                            })
                            level1?.sub_categories?.map(level2 => {
                                if (level2?.categories?.length == 0) {
                                    categoryList.push({
                                        label: level2?.name,
                                        value: level2?._id,
                                        disabled: false,
                                        fontWeight: 500,
                                        type: 'sub'
                                    })
                                } else {
                                    categoryList.push({
                                        label: level2?.name,
                                        value: level2?._id,
                                        disabled: true,
                                        fontWeight: 500,
                                        type: 'sub'
                                    })
                                    level2?.categories?.map(level3 => {
                                        categoryList.push({
                                            label: level3?.name,
                                            value: level3?._id,
                                            fontWeight: 400,
                                            disabled: false,
                                            type: 'category'
                                        })
                                    })
                                }
                            })
                        }
                    }) ?? [];
                    setCategoryList(categoryList);
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const getCollectionList = async () => {
        await ApiGet(`${API_URL.getCollectionList}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setCollectionList(response?.data?.map(item => ({
                        label: item?.name,
                        value: item?._id
                    })) ?? []);
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        getCategoryList();
        getCollectionList();
    }, [])

    const handleSubmit = async (event) => {
        let tempError = { ...formError }
        if (!description) {
            setIsErrorDescription(true)
        }
        if (!category_id) {
            tempError = { ...tempError, category_id: true }
        }
        if (!tax) {
            tempError = { ...tempError, tax: true }
        }
        if (!!description && Object.values(tempError).every(x => !x)) {
            if ((formData?.image && formData?.image.length >= 1)) {
                setLoading(true);
                await ApiPost(API_URL.addProduct, {
                    ...formData,
                    description,
                    status: "INACTIVE"
                })
                    .then((response) => {
                        setLoading(false)
                        toast.success('Add Successfully!')
                        navigate("/product/list")
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error(error?.error)
                        console.log("Error", error);
                    });
            } else {
                toast.error("Please upload 1 images.")
            }
        }
        setFormError(tempError)
    };

    const handleImageUpload = async (event) => {
        const MAX_FILE_SIZE = 5120 // 30MB

        const filesData = new FormData();
        Object.values(event?.target?.files).forEach((value) => {
            const fileSizeKiloBytes = value?.size / 1024;
            if (!(fileSizeKiloBytes > MAX_FILE_SIZE)) {
                filesData.append(`file`, value);
            }
        });

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        setFormError({ ...formError, image: false })
        setImageLoading(true);
        const images = formData?.image ?? []
        await ApiPost(API_URL.fileUploadProduct, filesData, config)
            .then((response) => {
                if (response?.data) {
                    let ImagesData = [];
                    response?.data && response?.data?.forEach((element) => {
                        ImagesData.push({
                            url: element?.Location,
                            isActive: false,
                            type: 'IMAGE'
                        })
                    })
                    setFormData({
                        ...formData, image: [...images, ...ImagesData]
                    });
                }
                setImageLoading(false)
            })
            .catch((error) => {
                setImageLoading(false)
                console.log("Error", error);
            });
    }
    const handleDeleteImage = async (index) => {
        setImageLoading(true)
        await ApiPost(API_URL.fileRemove, {
            url: formData?.image?.[index]?.url,
            type: ProductType
        })
            .then((response) => {
                setImageLoading(false)
                if (response?.data) {
                    let images = formData?.image ?? []
                    images = images?.filter((img, i) => i != index)
                    setFormData({ ...formData, image: images });
                }
            })
            .catch((error) => {
                setImageLoading(false)
                console.log("Error", error);
            });
    }

    const handleImageVideo = async (event) => {
        const MAX_FILE_SIZE = 5120 // 50MB

        const filesData = new FormData();
        Object.values(event?.target?.files).forEach((value) => {
            const fileSizeKiloBytes = value?.size / 1024;
            if (!(fileSizeKiloBytes > MAX_FILE_SIZE)) {
                filesData.append(`video`, value);
            }
        });

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        setFormError({ ...formError, videos: false })
        setVideoLoading(true)
        const videosList = formData?.videos ?? []
        await ApiPost(API_URL.videoFileUpload, filesData, config)
            .then((response) => {
                if (response?.data) {
                    let VideosData = [];
                    console.log("response?.data", response?.data)
                    response?.data && response?.data?.forEach((element) => {
                        VideosData.push({
                            url: element?.Location,
                            isActive: false,
                            type: 'VIDEO'
                        })
                    })
                    setFormData({
                        ...formData, videos: [...videosList, ...VideosData]
                    });
                }
                setVideoLoading(false)
            })
            .catch((error) => {
                setVideoLoading(false)
                console.log("Error", error);
            });
    }

    const handleDeleteVideo = async (index) => {
        setVideoLoading(true)
        await ApiPost(API_URL.fileRemove, {
            url: formData?.videos?.[index]?.url,
            type: ProductType
        })
            .then((response) => {
                setVideoLoading(false)
                if (response?.data) {
                    let videos = formData?.videos ?? []
                    videos = videos?.filter((img, i) => i != index)
                    setFormData({ ...formData, videos: videos });
                }
            })
            .catch((error) => {
                setVideoLoading(false)
                console.log("Error", error);
            });
    };

    const handleChange = (event) => {
        if (event.target.name == "home") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else if (event.target.name == "image") {
            handleImageUpload(event)
        } else if (event.target.name == "category_id") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, category_id: false })
        } else if (event.target.name == "tax") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, tax: false })
        } else if (event.target.name == "videos") {
            handleImageVideo(event)
        } else if (event.target.name == "mrp" || event.target.name == "sale_price" || event.target.name == "cost_price" || event.target.name == "reseller_price" || event.target.name == "influncerCommission") {
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

    const handleAddAttribute = () => {
        let attributesList = formData?.attributeList ?? []
        let attributesData = formData?.attributeData ?? []
        attributesList = [...attributesList, attributesData]
        attributesData = [{
            type: 'single',
            name: 'color',
            value: null
        }, {
            type: 'multi',
            name: 'size',
            value: []
        }, {
            type: 'single',
            name: 'swatch',
            value: "#000"
        }]
        setFormData({ ...formData, color: '#000', attributeData: attributesData, attributeList: attributesList });
    }

    const handleDeleteAttribute = (index) => {
        let attributesList = formData?.attributeList ?? []
        attributesList = attributesList.filter((item, i) => i != index)
        setFormData({ ...formData, attributeList: attributesList });
    }

    const handleAddValueAttribute = (type, name, value) => {
        let attributes = formData?.attributeData ?? []
        let index = attributes.findIndex(i => i.name == name)
        if (index == -1) {
            attributes = [...attributes, {
                type,
                name,
                value
            }]
        } else if (index >= 0) {
            attributes[index] = {
                type,
                name,
                value
            }
        }
        console.log(attributes)
        setFormData({ ...formData, attributeData: attributes });
    }

    const handleSwitchImage = (index, max = 5) => {
        let images = formData?.image ?? []
        if (images?.filter((img) => img?.isActive).length < max) {
            images[index] = { ...images[index], isActive: !images[index]?.isActive }
            setFormData({ ...formData, image: images });
        } else {
            if (images[index]?.isActive) {
                images[index] = { ...images[index], isActive: !images[index]?.isActive }
                setFormData({ ...formData, image: images });
            }
        }
    };

    const handleSwitchVideo = (index, max = 4) => {
        let videos = formData?.videos ?? []
        if (videos?.filter((video) => video?.isActive).length < max) {
            videos[index] = { ...videos[index], isActive: !videos[index]?.isActive }
            setFormData({ ...formData, videos: videos });
        } else {
            if (videos[index]?.isActive) {
                videos[index] = { ...videos[index], isActive: !videos[index]?.isActive }
                setFormData({ ...formData, videos: videos });
            }
        }
    };

    const pickColor = () => {
        open()
            .then(color => {
                handleAddValueAttribute('single', 'swatch', color.sRGBHex)
                setDopen(false)
            })
            .catch(e => {
                setDopen(false)
                console.log(e)
            })
    }

    const {
        category_id,
        collection_id,
        name,
        image,
        videos,
        cost_price,
        mrp,
        sale_price,
        reseller_price,
        tax,
    } = formData;


    console.log("formDataformData", formData?.image);


    const handleError = async (event) => {
        let tempError = { ...formError }
        if (!description) {
            setIsErrorDescription(true)
        }
        if (!category_id) {
            tempError = { ...tempError, category_id: true }
        }
        if (!tax) {
            tempError = { ...tempError, tax: true }
        }
        setFormError(tempError)
    }

    const disableInventoryList = ['instock_qty', 'threshold_qty', 'instock_lead_time', 'preorder_qty', 'preorder_lead_time', 'mapped_variant'];

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setFormData({ ...formData, image: arrayMove(image, oldIndex, newIndex) });
    }

    const onSortVideoEnd = ({ oldIndex, newIndex }) => {
        setFormData({ ...formData, videos: arrayMove(videos, oldIndex, newIndex) });
    }


    const SortableImageItem = SortableElement(({ item, i }) => {
        return (
            <Box key={i} sx={{ width: "100%" }}>
                <img src={item.url} width="100%" 
                    height="100%" 
                    // height="350px" 
                />
                <Box sx={{ height: "40px", width: "100%" }} display="flex" alignItems="center" justifyContent="space-between">
                    <div>
                        <Stack direction="row" alignItems="center">
                            <Switch
                                size="small"
                                sx={{
                                    color: "red",
                                    cursor: "pointer",
                                    fontSize: "10px !impoprtant",
                                    // '& .MuiSwitch-input': {
                                    //     width: "100% !important"
                                    // }
                                }}
                                checked={item?.isActive}
                                onChange={() => handleSwitchImage(i)}
                                inputProps={{ 'aria-label': 'controlled' }}
                            /> <Span sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>{item?.isActive ? "Active" : "InActive"}</Span>
                        </Stack>
                    </div>
                    <div>
                        <Stack direction="row" alignItems="center">
                            <IconButton size="small">
                                <Icon fontSize="small" onMouseDown={(e) => handleDeleteImage(i)} sx={{
                                    color: "red",
                                    cursor: "pointer",
                                }}>delete</Icon>
                            </IconButton> <Span onMouseDown={() => handleDeleteImage(i)} sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>Delete</Span>
                        </Stack>
                    </div>
                </Box>
            </Box>
        )
    });

    const SortableVideoItem = SortableElement(({ item, i }) => {
        return (
            <Box key={i}
                sx={{ width: "100%" }}>
                <video width="100%" height="350px" autoPlay={true} muted={true} loop={true} playsInline={true}
                    style={{ objectFit: "fill", borderRadius: "10px" }}>
                    <source src={item.url} type="video/mp4" />
                </video>
                <Box sx={{ height: "40px", width: "100%" }} display="flex" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center">
                        <Switch
                            size="small"
                            sx={{
                                color: "red",
                                cursor: "pointer",
                                zIndex: "999",
                                fontSize: "10px !impoprtant",
                                // '& .MuiSwitch-input': {
                                //     width: "100% !important"
                                // }
                            }}
                            checked={item?.isActive}
                            onChange={() => handleSwitchVideo(i, 4)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        /> <Span sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>{item?.isActive ? "Active" : "InActive"}</Span>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <Icon fontSize="small" onMouseDown={() => handleDeleteVideo(i)} sx={{
                            color: "red",
                            cursor: "pointer",
                            zIndex: "999"
                        }}>delete</Icon> <Span onMouseDown={() => handleDeleteVideo(i)} sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>Delete</Span>
                    </Stack>
                </Box>
            </Box>
        )
    });

    const SortableList = SortableContainer(({ items }) => {
        return (
            <Box className="list-group" sx={{ width: "100%" }}>
                <Grid container spacing={2}>
                    {items?.map((item, index) => {
                        return (
                            <Grid key={`List-Image${index}`} item lg={3} md={3} sm={6} xs={6}>
                                <SortableImageItem axis="xy" key={index} index={index} i={index} item={item} />
                            </Grid>
                        );
                    })}
                </Grid>
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
                    {!imageLoading &&
                        <input
                            type="file"
                            name="image"
                            multiple={true}
                            accept="image/png, image/gif, image/jpeg"
                            hidden
                            // onClick={(event) => { event.target.value = '' }}
                            onChange={handleChange} />
                    }
                </Button>
            </Box>
        );
    });

    const SortableVideoList = SortableContainer(({ items }) => {
        return (
            <Box className="list-group" sx={{ width: "100%" }}>
                <Grid container spacing={2}>
                    {items?.map((item, index) => {
                        return (
                            <Grid key={`List-Video-${index}`} item lg={3} md={3} sm={6} xs={6}>
                                <SortableVideoItem axis="xy" key={index} index={index} i={index} item={item} />
                            </Grid>
                        );
                    })}
                </Grid>
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
                    {!videoLoading &&
                        <input
                            type="file"
                            name="videos"
                            multiple={true}
                            accept="video/mp4,video/x-m4v,video/*"
                            hidden
                            onClick={(event) => { event.target.value = '' }}
                            onChange={handleChange} />
                    }
                </Button>
            </Box>
        );
    });

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={handleError}>
                <Container maxWidth>
                    <SimpleCard title="Product" backArrow={true}>
                        <Grid container spacing={12}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel htmlFor="grouped-native-select">Category</InputLabel>
                                    <Select id="grouped-native-select" label="Category"
                                        value={category_id}
                                        name="category_id"
                                        sx={{
                                            border: formError?.category_id ? '1px solid #FF3D57' : ''
                                        }}
                                        onChange={handleChange}>
                                        {categoryList?.map(item => (
                                            <MenuItem key={item?.value} value={item?.value} disabled={item?.disabled} sx={{
                                                fontWeight: item?.fontWeight,
                                                color: "#000",
                                                opacity: "1 !important"
                                            }}>{item?.type == "sub" ?
                                                <>&nbsp;&nbsp;&nbsp;{item?.label}</> : (item?.type == "category" ? <>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{item?.label}</> : item?.label)}</MenuItem>
                                        ))}
                                    </Select>
                                    {formError?.category_id && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                </FormControl>

                                {/* <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={collection_id}
                                        name="collection_id"
                                        sx={{
                                            border: formError?.collection_id ? '1px solid #FF3D57' : ''
                                        }}
                                        label="Collection"
                                        onChange={handleChange}>
                                        {collectionList?.map(item => (
                                            <MenuItem key={item?.value} value={item?.value}>{item?.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {formError?.collection_id && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                </FormControl> */}

                                <Autocomplete
                                    fullWidth
                                    multiple={true}
                                    id="tags-outlined"
                                    value={collection_id?.map(list => collectionList.find(x => x?.value == list)) ?? []}
                                    onChange={(event, newValue) => {
                                        setFormData({ ...formData, collection_id: newValue?.map(x => x?.value) })
                                    }}
                                    options={collectionList}
                                    getOptionLabel={(option) => option?.label}
                                    filterSelectedOptions
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Collection"
                                        />
                                    )}
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

                                <Box sx={{ mb: 2 }} className={isErrorDescription ? "error" : ''}>
                                    <TextEditor data={description} setData={(d) => {
                                        setIsErrorDescription(false)
                                        setDescription(d)
                                    }} />
                                    {isErrorDescription && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                </Box>

                                <TextField
                                    type="text"
                                    name="cost_price"
                                    label="Cost Price"
                                    sx={{ mt: 1 }}
                                    onChange={handleChange}
                                    value={cost_price || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="mrp"
                                    label="MRP"
                                    onChange={handleChange}
                                    value={mrp || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="sale_price"
                                    label="Sale Price"
                                    onChange={handleChange}
                                    value={sale_price || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                <TextField
                                    type="text"
                                    name="reseller_price"
                                    label="ReSeller Price"
                                    onChange={handleChange}
                                    value={reseller_price || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                {/* <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Influncer Commission Type</FormLabel>
                                <RadioGroup
                                    row
                                    value={influncerCommissionType ?? "Fixed"}
                                    onChange={handleChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="influncerCommissionType">
                                    <FormControlLabel value="Fixed" control={<Radio />} label="Fixed" />
                                    <FormControlLabel value="Percentage" control={<Radio />} label="Percentage" />
                                </RadioGroup>
                            </FormControl>

                            <TextField
                                type="text"
                                name="influncerCommission"
                                label="Influncer Commission"
                                onChange={handleChange}
                                value={influncerCommission || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            /> */}

                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel id="demo-simple-select-label">Tax Type</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={tax}
                                        name="tax"
                                        sx={{
                                            border: formError?.tax ? '1px solid #FF3D57' : ''
                                        }}
                                        label="Tax Type"
                                        onChange={handleChange}>
                                        <MenuItem value={10}>Standard</MenuItem>
                                        <MenuItem value={2.5}>2.5% CGST/IGST</MenuItem>
                                    </Select>
                                    {formError?.tax && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                </FormControl>


                                <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
                                    <Span sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: "18px" }}>Media</Span>
                                    <Box className="list-group">
                                        <SortableList axis={"xy"} items={image} onSortEnd={onSortEnd} />
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1
                                    }}>
                                        {imageLoading && <CircularProgress sx={{ color: 'rgba(52, 49, 76, 0.54)', width: '20px !important', height: '20px  !important' }} />}
                                        <Typography sx={{ color: formError?.image ? '#FF3D57' : 'rgba(52, 49, 76, 0.54)', fontWeight: 400, fontSize: '0.75rem', m: '3px 0px', ml: 1 }}>Upload image size is max 5MB only.</Typography>
                                    </Box>

                                    <Box className="list-group">
                                        <SortableVideoList axis={"xy"} items={videos} onSortEnd={onSortVideoEnd} />
                                    </Box>
                                    <Box sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        mt: 1
                                    }}>
                                        {videoLoading && <CircularProgress sx={{ color: 'rgba(52, 49, 76, 0.54)', width: '20px !important', height: '20px  !important' }} />}
                                        <Typography sx={{ color: formError?.videos ? '#FF3D57' : 'rgba(52, 49, 76, 0.54)', fontWeight: 400, fontSize: '0.75rem', m: '3px 0px', ml: 1 }}>Upload video size is max 5MB only.</Typography>
                                    </Box>
                                </Box>
                            </Grid>
                        </Grid>
                        <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                            <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                                <Stack direction="row" spacong={2}>
                                    <Box>
                                        <Button color="primary" variant="outlined" sx={{ mr: 2, mt: 2 }} onClick={() => navigate(-1)}>
                                            <Icon>arrow_back</Icon>
                                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
                                        </Button>
                                    </Box>
                                    <Box>
                                        <LoadingButton
                                            loading={loading}
                                            loadingPosition="start"
                                            type="submit"
                                            sx={{ mr: 0, mt: 2 }}
                                            startIcon={<Icon>send</Icon>}
                                            variant="contained">
                                            Save
                                        </LoadingButton>
                                    </Box>
                                </Stack>
                            </Box>
                        </Box>
                    </SimpleCard>
                </Container>
            </ValidatorForm>
        </div >
    );
};

export default ProductForm;

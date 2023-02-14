import { CheckBox } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Icon,
    IconButton,
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
import { filter } from "lodash";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const CategoryForm = ({ data = {}, id, type }) => {
    const [formData, setFormData] = useState(data ? data : {});
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();
    const [mediaLoading, setMediaLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [parentCategoryList, setParentCategoryList] = useState([]);
    const [parentSubCategoryList, setParentSubCategoryList] = useState([]);
    const [collectionList, setCollectionList] = useState([]);
    const [isErrorDescription, setIsErrorDescription] = useState(false);
    const [formError, setFormError] = useState({});

    useEffect(() => {
        let temp = { ...data }
        if (temp?.link_with == 'COLLECTION') {
            temp = { ...temp, linkValue: temp?.colleciton_list?.[0], productId: temp?.product_list?.[0] ?? '', parent_cateogry_id: temp?.parent_cateogry_id?._id, sub_category_id: temp?.sub_category_id?._id }
        } else {
            temp = { ...temp, linkValue: temp?.categories_list?.[0], productId: temp?.product_list?.[0] ?? '', parent_cateogry_id: temp?.parent_cateogry_id?._id, sub_category_id: temp?.sub_category_id?._id }
        }
        setFormData(temp)
        setDescription(data?.description)
    }, [data])


    const getCategory = async () => {
        await ApiGet(`${API_URL.getCategorys}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    if (type == 'list' && data?.name) {
                        setCategoryList(response?.data?.filter(filter => filter?.name != data?.name)?.map(item => {
                            return {
                                value: item?._id,
                                label: item?.name
                            }
                        }) ?? []);
                    } else {
                        setCategoryList(response?.data?.map(item => {
                            return {
                                value: item?._id,
                                label: item?.name
                            }
                        }) ?? []);
                    }
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        getCategory();
    }, [type, data])

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
                            label: item?.name,
                            parent_cateogry_id: item?.parent_cateogry_id,
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
        const { link_with, linkValue, productId, image, mediaType, ...payload } = formData
        let tempError = { ...formError }
        let tempMediaType = formData?.mediaType ?? 'image'
        if (!description) {
            setIsErrorDescription(true)
        }
        if ((type == 'sub' || type == 'list') && !parent_cateogry_id) {
            tempError = { ...tempError, parent_cateogry_id: true }
        }
        if ((type == 'list') && !sub_category_id) {
            tempError = { ...tempError, sub_category_id: true }
        }
        if (link_with && !linkValue) {
            tempError = { ...tempError, linkValue: true }
        }
        if (home_visibilty && (tempMediaType == 'image') && !image) {
            tempError = { ...tempError, image: true }
        }
        if (home_visibilty && (tempMediaType == 'video') && !video) {
            tempError = { ...tempError, video: true }
        }
        if (!!description && Object.values(tempError).every(x => !x)) {
            setLoading(true)
            if (id) {
                await ApiPut(`${getEditURL(type)}/${id}`, {
                    ...payload,
                    description,
                    link_with: link_with ?? '',
                    image: image ?? "",
                    mediaType: tempMediaType,
                    "colleciton_list": link_with == 'COLLECTION' ? [linkValue] : [],
                    "categories_list": link_with == 'CATEGORY' ? [linkValue] : [],
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
                    ...payload,
                    description,
                    link_with: link_with ?? '',
                    image: image ?? "",
                    mediaType: tempMediaType,
                    "colleciton_list": linkValue ? (link_with == 'COLLECTION' ? [linkValue] : []) : [],
                    "categories_list": linkValue ? (link_with == 'CATEGORY' ? [linkValue] : []) : [],
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
        }
        setFormError(tempError)
    };

    const handleImageUpload = async (event) => {
        const MAX_FILE_SIZE = 30720 // 30MB
        const fileSizeKiloBytes = event?.target?.files?.[0]?.size / 1024
        if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            // setFormError({ ...formError, image: true })
        } else {
            setMediaLoading(true)
            let imageData = new FormData();
            imageData.append('file', event.target.files[0]);
            await ApiPost(API_URL.fileUploadCategory, imageData)
                .then((response) => {
                    if (response?.data) {
                        setFormData({ ...formData, [event.target.name]: response?.data && response?.data[0]?.Location });
                        setMediaLoading(false)
                    }
                })
                .catch((error) => {
                    console.log("Error", error);
                    setMediaLoading(false)
                });
        }
    }

    const handleDeleteImage = async (event) => {
        setMediaLoading(true)
        await ApiPost(API_URL.fileRemove, {
            url: image
        })
            .then((response) => {
                if (response?.data) {
                    setFormData({ ...formData, image: null });
                    setMediaLoading(false)
                }
            })
            .catch((error) => {
                console.log("Error", error);
                setMediaLoading(false)
            });
    }

    const handleImageVideo = async (event) => {
        const MAX_FILE_SIZE = 51200 // 50MB
        const fileSizeKiloBytes = event?.target?.files?.[0]?.size / 1024
        if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            // setFormError({ ...formError, video: true })
        } else {
            setMediaLoading(true)
            let videoData = new FormData();
            videoData.append('video', event.target.files[0]);
            await ApiPost(API_URL.videoFileUpload, videoData)
                .then((response) => {
                    if (response?.data) {
                        console.log("response?.data", response?.data[0]?.Location)
                        setFormData({
                            ...formData, video: response?.data && response?.data[0]?.Location
                        });
                        setMediaLoading(false)
                    }
                })
                .catch((error) => {
                    setMediaLoading(false)
                    console.log("Error", error);
                });
        }
    }

    const handleDeleteVideo = async (event) => {
        setMediaLoading(true)
        await ApiPost(API_URL.fileRemove, {
            url: video
        })
            .then((response) => {
                if (response?.data) {
                    setFormData({ ...formData, video: null });
                    setMediaLoading(false)
                }
            })
            .catch((error) => {
                console.log("Error", error);
                setMediaLoading(false)
            });
    }

    const handleChange = (event) => {
        if (event.target.name == "home_visibilty") {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
            setFormError({ ...formError, image: false })
        } else if (event.target.name == "parent_cateogry_id") {
            setFormData({ ...formData, [event.target.name]: event.target.value, sub_category_id: "" });
            setFormError({ ...formError, parent_cateogry_id: false })
        } else if (event.target.name == "sub_category_id") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, sub_category_id: false })
        } else if (event.target.name == "code") {
            const onlyUpper = event.target.value.replace(/[^A-Za-z]/g, '');
            setFormData({ ...formData, [event.target.name]: onlyUpper?.toUpperCase() });
        } else if (event.target.name == "image") {
            handleImageUpload(event)
            setFormError({ ...formError, image: false, video: false })
        } else if (event.target.name == "video") {
            handleImageVideo(event)
            setFormError({ ...formError, image: false, video: false })
        } else if (event.target.name == "link_with") {
            setFormData({ ...formData, linkValue: '', [event.target.name]: event.target.value });
        } else if (event.target.name == "linkValue") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, linkValue: false })
        } else if (event.target.name == "productId") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, productId: false })
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const {
        name,
        sub_category_id,
        title,
        parent_cateogry_id,
        home_visibilty,
        productId,
        mediaType,
        image,
        video,
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

    const handleError = async (event) => {
        let tempError = { ...formError }
        let tempMediaType = mediaType ?? 'image'
        if (!description) {
            setIsErrorDescription(true)
        }
        if ((type == 'sub' || type == 'list') && !parent_cateogry_id) {
            tempError = { ...tempError, parent_cateogry_id: true }
        }
        if ((type == 'list') && !sub_category_id) {
            tempError = { ...tempError, sub_category_id: true }
        }
        if (home_visibilty && (tempMediaType == 'image') && !image) {
            tempError = { ...tempError, image: true }
        }
        if (home_visibilty && (tempMediaType == 'video') && !video) {
            tempError = { ...tempError, video: true }
        }
        setFormError(tempError)
    }


    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={handleError}>
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
                                        sx={{
                                            border: formError?.parent_cateogry_id ? '1px solid #FF3D57' : ''
                                        }}
                                        label="Parent Category"
                                        onChange={handleChange}>
                                        {parentCategoryList?.map((item) => (
                                            <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {formError?.parent_cateogry_id && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
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
                                        sx={{
                                            border: formError?.sub_category_id ? '1px solid #FF3D57' : ''
                                        }}
                                        onChange={handleChange}>
                                        {parentSubCategoryList?.filter(x => x?.parent_cateogry_id?._id == parent_cateogry_id)?.length == 0 && <MenuItem value="" disabled>No Options.</MenuItem>}
                                        {parentSubCategoryList?.filter(x => x?.parent_cateogry_id?._id == parent_cateogry_id)?.map((item) => (
                                            <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                        ))}
                                    </Select>
                                    {formError?.sub_category_id && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
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

                            <Box sx={{ mb: 2 }} className={isErrorDescription ? "error" : ''}>
                                <TextEditor data={description} setData={(d) => {
                                    setIsErrorDescription(false)
                                    setDescription(d)
                                }} />
                                {isErrorDescription && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                            </Box>

                            <FormControl sx={{ flexDirection: 'row', alignItems: 'center' }} component="div" variant="standard">
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

                                    {link_with == 'COLLECTION' &&
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="demo-simple-select-label">Link with collection</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={linkValue ?? ''}
                                                name="linkValue"
                                                label="Link with collection"
                                                sx={{
                                                    border: formError?.linkValue ? '1px solid #FF3D57' : ''
                                                }}
                                                onChange={handleChange}>
                                                {collectionList?.map((item) => (
                                                    <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                                ))}
                                            </Select>
                                            {formError?.linkValue && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                        </FormControl>
                                    }
                                    {link_with == 'CATEGORY' &&
                                        <FormControl fullWidth sx={{ mb: 2 }}>
                                            <InputLabel id="demo-simple-select-label">Link with category</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={linkValue ?? ''}
                                                name="linkValue"
                                                sx={{
                                                    border: formError?.linkValue ? '1px solid #FF3D57' : ''
                                                }}
                                                label="Link with category"
                                                onChange={handleChange}>
                                                {categoryList?.map((item) => (
                                                    <MenuItem value={item?.value}>{item?.label}</MenuItem>
                                                ))}
                                            </Select>
                                            {formError?.linkValue && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                        </FormControl>
                                    }

                                    <Box display="flex" flexDirection="column">
                                        <Span sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: "18px" }}>Media</Span>
                                        <FormControl sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>Media Type </FormLabel>
                                            <RadioGroup
                                                row
                                                value={mediaType ?? "IMAGE"}
                                                onChange={handleChange}
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="mediaType">
                                                <FormControlLabel value="IMAGE" control={<Radio />} label="Image" />
                                                <FormControlLabel value="VIDEO" control={<Radio />} label="Video" />
                                            </RadioGroup>
                                        </FormControl>
                                        <Box sx={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                        }}>
                                            {mediaLoading ? <>
                                                <Box>
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
                                                        <CircularProgress />
                                                    </Button>
                                                </Box>
                                            </> : <>
                                                {mediaType == 'VIDEO' ? <>
                                                    {video ?
                                                        <Box
                                                            sx={{
                                                                width: "150px",
                                                                height: "170px",
                                                                margin: "10px 10px 0 0",
                                                                position: "relative"
                                                            }}>
                                                            <video width="100%" height="90%" autoPlay={true} muted={true} loop={true} playsInline={true}
                                                                style={{ objectFit: "fill", borderRadius: "10px" }}>
                                                                <source src={video} type="video/mp4" />
                                                            </video>
                                                            <Box sx={{ height: "auto" }} display="flex" alignItems="center" justifyContent="end">
                                                                <IconButton size="small">
                                                                    <Icon fontSize="small" onClick={() => handleDeleteVideo()} sx={{
                                                                        color: "red",
                                                                        cursor: "pointer",
                                                                    }}>delete</Icon>
                                                                </IconButton> <Span onClick={() => handleDeleteVideo()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                                            </Box>
                                                        </Box>
                                                        :
                                                        <Box>
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
                                                                    name="video"
                                                                    accept="video/mp4,video/x-m4v,video/*"
                                                                    hidden
                                                                    onClick={(event) => { event.target.value = '' }}
                                                                    onChange={handleChange} />
                                                            </Button>
                                                            <Typography sx={{ color: 'rgba(52, 49, 76, 0.54)', fontWeight: 400, fontSize: '0.75rem', m: '3px 0px' }}>Upload video size is max 50MB only.</Typography>
                                                            {formError?.image && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>please select video</Typography>}
                                                        </Box>
                                                    }
                                                </> : <>
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
                                                                <IconButton size="small">
                                                                    <Icon fontSize="small" onClick={() => handleDeleteImage()} sx={{
                                                                        color: "red",
                                                                        cursor: "pointer",
                                                                    }}>delete</Icon>
                                                                </IconButton> <Span onClick={() => handleDeleteImage()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                                            </Box>
                                                        </Box>
                                                        :
                                                        <Box>
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
                                                            <Typography sx={{ color: 'rgba(52, 49, 76, 0.54)', fontWeight: 400, fontSize: '0.75rem', m: '3px 0px' }}>Upload image size is max 30MB only.</Typography>
                                                            {formError?.image && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>please select image</Typography>}
                                                        </Box>
                                                    }
                                                </>}
                                            </>}
                                        </Box>
                                    </Box>

                                    <TextField
                                        sx={{ mt: 3 }}
                                        type="text"
                                        name="productId"
                                        label="Link with product design number"
                                        onChange={handleChange}
                                        value={productId || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />
                                    {formError?.productId && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}

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

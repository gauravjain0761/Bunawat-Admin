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
    Stack,
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
    const [mediaLoading, setMediaLoading] = useState(false);
    const [categoryList, setCategoryList] = useState([]);
    const [isErrorDescription, setIsErrorDescription] = useState(false);
    const [collectionList, setCollectionList] = useState([]);
    const [formError, setFormError] = useState({});
    const navigate = useNavigate();



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
                    setCollectionList(response?.data?.filter(filter => filter?.name != data?.name)?.map(item => {
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
        getCollection();
    }, [data])

    useEffect(() => {
        getCategory();
    }, [])

    const handleSubmit = async () => {
        let tempError = { ...formError }
        let tempMediaType = formData?.mediaType ?? 'image'
        if (!description) {
            setIsErrorDescription(true)
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
                await ApiPut(`${API_URL.editCollection}/${id}`, {
                    "name": formData?.name,
                    title: formData?.title,
                    image: formData?.image ?? "",
                    home_visibilty: formData?.home_visibilty,
                    video: formData?.video,
                    mediaType: tempMediaType,
                    link_with: formData?.link_with ?? '',
                    "description": description,
                    "colleciton_list": link_with == 'COLLECTION' ? [formData?.linkValue] : [],
                    "categories_list": link_with == 'CATEGORY' ? [formData?.linkValue] : [],
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
                    title: formData?.title,
                    image: formData?.image ?? "",
                    video: formData?.video,
                    home_visibilty: formData?.home_visibilty,
                    mediaType: tempMediaType,
                    link_with: formData?.link_with ?? '',
                    "description": description,
                    "colleciton_list": link_with == 'COLLECTION' ? [formData?.linkValue] : [],
                    "categories_list": link_with == 'CATEGORY' ? [formData?.linkValue] : [],
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
            await ApiPost(API_URL.fileUploadCollection, imageData)
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
                setMediaLoading(false)
                console.log("Error", error);
            });
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

    const handleChange = (event) => {
        if (event.target.name == "home_visibilty") {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
            setFormError({ ...formError, image: false })
        } else if (event.target.name == "image") {
            handleImageUpload(event)
            setFormError({ ...formError, image: false, video: false })
        } else if (event.target.name == "video") {
            handleImageVideo(event)
            setFormError({ ...formError, image: false, video: false })
        } else if (event.target.name == "link_with") {
            setFormData({ ...formData, linkValue: '', [event.target.name]: event.target.value });
        } else if (event.target.name == "linkType") {
            setFormData({ ...formData, linkValue: null, [event.target.name]: event.target.value });
        } else if (event.target.name == "linkValue") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, linkValue: false })
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const {
        name,
        title,
        link_with,
        linkValue,
        home_visibilty,
        productId,
        mediaType,
        image,
        video
    } = formData;


    console.log("image", image)

    const handleError = async (event) => {
        let tempError = { ...formError }
        let tempMediaType = mediaType ?? 'image'
        if (!description) {
            setIsErrorDescription(true)
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
        setFormError(tempError)
    }

    console.log("mediaType", mediaType, "hi");


    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={handleError}>
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
                                name="title"
                                label="Title"
                                onChange={handleChange}
                                value={title || ""}
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
                                                            <Box sx={{ height: "10%" }} display="flex" alignItems="center" justifyContent="end">
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
                                                            {formError?.video && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>please select video</Typography>}
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
                                                                    }}>delete</Icon></IconButton> <Span onClick={() => handleDeleteImage()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
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

                                </>
                            }
                        </Grid>

                    </Grid>
                    <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                        <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                            <Stack direction="row" spacing={2}>
                                <Box>
                                    <Button color="primary" variant="outlined" type="button" sx={{ mr: 0, mt: 2 }} onClick={() => navigate(-1)}>
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

            </ValidatorForm>
        </div >
    );
};

export default CollectionForm;

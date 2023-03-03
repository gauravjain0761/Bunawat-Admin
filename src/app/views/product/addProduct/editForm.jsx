import {
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fade,
    FormControl,
    FormControlLabel,
    Grid,
    Icon,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    styled,
    Switch,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import useEyeDropper from 'use-eye-dropper'
import { Span } from "app/components/Typography";
import React, { useEffect, useState } from "react";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import TableComponent from "app/components/table";
import TextEditor from "app/components/textEditor";
import { toast } from 'material-react-toastify';
import { ApiGet, ApiPost, ApiPut } from "app/service/api";
import { API_URL } from "app/constant/api";
import { LoadingButton } from "@mui/lab";
import MappedVariantModel from "../model/mappedVariant";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';


const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const ProductEditForm = ({ getIDData, data = {}, id, ProductType }) => {
    const { open, close, isSupported } = useEyeDropper()
    const [mOpen, setMOpen] = useState(false);
    const [dOpen, setDopen] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [collectionList, setCollectionList] = useState([])
    const [loading, setLoading] = useState(false);
    const [imageLoading, setImageLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);
    const [isErrorDescription, setIsErrorDescription] = useState(false);
    const [formData, setFormData] = useState(data ?? {})
    const [selectedSKU, setSelectedSKU] = useState({})
    const [selectedSKUIndex, setSelectedSKUIndex] = useState(-1)
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [actionOpen, setActionOpen] = useState(formData?.attributeList?.map(() => { return null }) ?? []);
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [attributes, setAttributes] = useState([]);
    const [SKUData, setSKUData] = useState([]);
    const [formError, setFormError] = useState({});

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 3,
        initialSlide: 0,
        arrows: false,
    };

    useEffect(() => {
        setDescription(data?.description ?? '')
        setFormData(data ?? {})
    }, [data])

    const getData = async () => {
        await ApiGet(`${API_URL.getAttributes}`)
            .then((response) => {
                setAttributes(response?.data?.map((item) => {
                    return {
                        type: item?.slug == "size" ? 'multi' : 'single',
                        name: item?.slug,
                        value: item?.slug == "size" ? [] : null,
                        options: item?.variants?.map(x => ({ id: x?._id, name: x?.name }))
                    }
                }) ?? []);
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const getSKUData = async () => {
        await ApiGet(`${API_URL.getSKUS}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setSKUData(response?.data?.map(item => ({
                        value: item?._id,
                        name: item?.sku
                    })))
                }
            })
            .catch((error) => {
                toast.error(error?.error)
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        getData();
        getSKUData();
    }, [])

    const columns = [
        {
            id: "sku",
            label: "SKU",
            width: 120
        },
        {
            id: "inStock_qty",
            label: "InStock \nQTY",
            align: "center",
            width: 100
        },
        // {
        //     id: "inStock_lead",
        //     label: "InStock \nLead Time",
        //     align: "center",
        //     width: 100
        // },
        {
            id: "preOrder_qty",
            label: "PreOrder \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "preOrder_lead",
            label: "PreOrder \nLead Time",
            align: "center",
            width: 100
        },
        {
            id: "threshold",
            label: "InStock \nThreshold",
            align: "center",
            width: 100
        },
        {
            id: "Swatch",
            label: "Swatch",
            align: "center",
            sortDisable: true,
            width: 100
        },
        {
            id: "mappedvariant",
            label: "Mapped \nVariant",
            sortDisable: true,
            align: "center",
            width: 100
        },
        {
            id: "isActive",
            label: "Status",
            align: "center",
            width: 80
        },
        {
            id: "action",
            label: "Action",
            action: true,
            align: 'right',
            width: 80,
            sortDisable: true,
            renderCell: (
                <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        sx={{ color: "#fff" }}
                        aria-controls={Boolean(actionAllOpen) ? 'long-menu' : undefined}
                        aria-expanded={Boolean(actionAllOpen) ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(e) => setActionAllOpen(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={actionAllOpen}
                        open={Boolean(actionAllOpen)}
                        onClose={() => setActionAllOpen(null)}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => {
                            setActionAllOpen(null)
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            )
        }
    ];


    const handleActionClick = (event, index) => {
        event.preventDefault();
        event.stopPropagation();
        let temp = [...actionOpen];
        if (!temp[index]) {
            temp = temp.map(() => { return null })
        }
        temp[index] = event.currentTarget
        setActionOpen(temp)
    };

    const handleActionClose = () => {
        let temp = [...actionOpen];
        temp = temp.map(() => { return null })
        setActionOpen(temp)
    };


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
            if (formData?.status === "ACTIVE" && (formData?.image && formData?.image.length >= 3 && formData?.videos && formData?.videos.length >= 2 && formData?.sku_data && formData?.sku_data.length > 0)) {
                setLoading(true)
                await ApiPut(`${API_URL.editProduct}/${id}`, {
                    ...formData,
                    description,
                    sku_data: formData?.sku_data ?? []
                })
                    .then((response) => {
                        setLoading(false)
                        toast.success('Edit Successfully!')
                        navigate("/product/list")
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error(error?.error)
                        console.log("Error", error);
                    });
            } else if (formData?.status !== "ACTIVE") {
                setLoading(true)
                await ApiPut(`${API_URL.editProduct}/${id}`, {
                    ...formData,
                    description,
                    sku_data: formData?.sku_data ?? []
                })
                    .then((response) => {
                        setLoading(false)
                        toast.success('Edit Successfully!')
                        navigate("/product/list")
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error(error?.error)
                        console.log("Error", error);
                    });
            } else {
                toast.error("Please upload 4 images, 3 videos and atleast one sku data")
            }
        }
        setFormError(tempError)
    };

    const handleImageUpload = async (event) => {
        const MAX_FILE_SIZE = 30720 // 30MB
        const fileSizeKiloBytes = event?.target?.files?.[0]?.size / 1024;

        const filesData = new FormData();
        Object.values(event?.target?.files).forEach((value) => {
            filesData.append(`file`, value);
        });

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        // if (fileSizeKiloBytes > MAX_FILE_SIZE) {
        //     setFormError({ ...formError, image: true })
        // } else {
        setFormError({ ...formError, image: false })
        setImageLoading(true);
        // let imageData = new FormData();
        const images = formData?.image ?? []
        // imageData.append('file', event.target.files[0]);
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
        // }
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
        const MAX_FILE_SIZE = 51200 // 50MB

        const filesData = new FormData();
        Object.values(event?.target?.files).forEach((value) => {
            filesData.append(`video`, value);
        });

        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        // const fileSizeKiloBytes = event?.target?.files?.[0]?.size / 1024
        // if (fileSizeKiloBytes > MAX_FILE_SIZE) {
        //     setFormError({ ...formError, videos: true })
        // } else {
        setFormError({ ...formError, videos: false })
        setVideoLoading(true)
        const videosList = formData?.videos ?? []
        // let videoData = new FormData();
        // videoData.append('video', event.target.files[0]);
        await ApiPost(API_URL.videoFileUpload, filesData, config)
            .then((response) => {
                if (response?.data) {
                    let VideosData = [];
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
        // }
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
        } else if (event.target.name == "category_id") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, category_id: false })
        } else if (event.target.name == "tax") {
            setFormData({ ...formData, [event.target.name]: event.target.value });
            setFormError({ ...formError, tax: false })
        } else if (event.target.name == "image") {
            handleImageUpload(event)
        } else if (event.target.name == "videos") {
            handleImageVideo(event)
        } else if (event.target.name == "mrp" || event.target.name == "salePrice" || event.target.name == "costPrice" || event.target.name == "reSellerPrice" || event.target.name == "influncerCommission") {
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

    const handleSKUData = (event, index) => {
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        let tempSKU = [...formData?.sku_data] ?? []
        tempSKU[index] = { ...tempSKU[index], [event.target.name]: onlyNums }
        setFormData({ ...formData, sku_data: tempSKU });
    };

    const handleAddAttribute = async () => {
        let attributesData = [...attributes] ?? []
        let finalData = []
        if (attributesData?.filter(x => !!x?.value)?.length > 0) {
            if (attributesData?.find(x => x?.name == "size")?.value?.length > 0) {
                attributesData?.find(x => x?.name == "size")?.value?.map(list => {
                    let selectedAttributes = attributesData?.filter(x => x?.name != "size")?.filter(x => !!x?.value)?.map(data => data?.value?.id);
                    selectedAttributes = [...selectedAttributes, list?.id]
                    finalData.push(selectedAttributes)
                })
            } else {
                const selectedAttributes = attributesData?.filter(x => x?.name != "size")?.filter(x => !!x?.value)?.map(data => data?.value?.id);
                finalData.push(selectedAttributes)
            }
            await ApiPost(API_URL.addSKU, {
                product_id: id,
                attr: finalData ?? []
            })
                .then((response) => {
                    if (response?.data?.length > 0) {
                        setFormData({ ...formData, sku_data: [...formData?.sku_data, ...response?.data] });
                        toast.success('Add Successfully!')
                    }
                })
                .catch((error) => {
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        } else {
            toast.error('Select Attributes First!')
        }
        // attributesList = [...attributesList, attributesData]
        // attributesData = [{
        //     type: 'single',
        //     name: 'color',
        //     value: null
        // }, {
        //     type: 'single',
        //     name: 'size',
        //     value: null
        // }]
        // setFormData({ ...formData, color: '#000', attributeData: attributesData, attributeList: attributesList });
    }

    const handleDeleteAttribute = (index) => {
        let attributesList = formData?.attributeList ?? []
        attributesList = attributesList.filter((item, i) => i != index)
        setFormData({ ...formData, attributeList: attributesList });
    }

    const handleAddValueAttribute = (name, value) => {
        let attributesData = [...attributes] ?? []
        let index = attributesData?.findIndex(i => i.name == name)
        if (index >= 0) {
            attributesData[index] = {
                ...attributesData[index],
                value
            }
        }
        console.log(attributesData, index)
        setAttributes(attributesData ?? []);
        // setFormData({ ...formData, attributeData: attributess });
    }

    const handleSwitchImage = async (index, item, max = 5) => {
        let images = formData?.image ?? [];
        if (images?.filter((img) => img?.isActive).length < max && !images[index]?.isActive) {
            images[index] = { ...images[index], isActive: !images[index]?.isActive }
            setFormData({ ...formData, image: images });
            await ApiPut(`${API_URL.fileStatus}/${item?._id}`, {
                isActive: true
            }).then((response) => {
                if (response?.data) {
                    toast.success(response?.data?.message)
                    getIDData(id)
                }
            }).catch((error) => {
                toast.error(error.error)
                console.log("Error", error);
            });
        } else {
            if (images[index]?.isActive) {
                images[index] = { ...images[index], isActive: !images[index]?.isActive }
                setFormData({ ...formData, image: images });
                await ApiPut(`${API_URL.fileStatus}/${item?._id}`, {
                    isActive: false
                }).then((response) => {
                    if (response?.data) {
                        toast.success(response?.data?.message)
                        getIDData(id)
                    }
                }).catch((error) => {
                    toast.error(error.error)
                    console.log("Error", error);
                });
            }
        }
    };

    const handleSwitchVideo = async (index, item, max = 4) => {
        let videos = formData?.videos ?? [];
        if (videos?.filter((video) => video?.isActive).length < max && !videos[index]?.isActive) {
            videos[index] = { ...videos[index], isActive: !videos[index]?.isActive }
            setFormData({ ...formData, videos: videos });
            await ApiPut(`${API_URL.fileStatus}/${item?._id}`, {
                isActive: true
            }).then((response) => {
                if (response?.data) {
                    toast.success(response?.data?.message)
                    getIDData(id)
                }
            }).catch((error) => {
                toast.error(error.error)
                console.log("Error", error);
            });
        } else {
            if (videos[index]?.isActive) {
                videos[index] = { ...videos[index], isActive: !videos[index]?.isActive }
                setFormData({ ...formData, videos: videos });
                await ApiPut(`${API_URL.fileStatus}/${item?._id}`, {
                    isActive: false
                }).then((response) => {
                    if (response?.data) {
                        toast.success(response?.data?.message)
                        getIDData(id)
                    }
                }).catch((error) => {
                    toast.error(error.error)
                    console.log("Error", error);
                });
            }
        }
    };

    const pickColor = () => {
        open()
            .then(color => {
                let tempSKU = [...formData?.sku_data] ?? []
                tempSKU[selectedSKUIndex] = { ...tempSKU[selectedSKUIndex], swatch: color.sRGBHex }
                setFormData({ ...formData, sku_data: tempSKU });
                setSelectedSKUIndex(-1)
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
        attributeList,
        isActive,
        status,
        sku_data
    } = formData;


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

    const onSortEnd = ({ oldIndex, newIndex }) => {
        setFormData({ ...formData, image: arrayMove(image, oldIndex, newIndex) });
    }

    const onSortVideoEnd = ({ oldIndex, newIndex }) => {
        setFormData({ ...formData, videos: arrayMove(videos, oldIndex, newIndex) });
    }


    const SortableImageItem = SortableElement(({ item, i }) => {
        return (
            <Box sx={{ width: "100%" }}>
                <img src={item.url} width="100%" height="200px" />
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
                                onChange={(e) => handleSwitchImage(i, item)}
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
            <Box sx={{ width: "100%" }}>
                <video width="100%" height="200px" autoPlay={true} muted={true} loop={true} playsInline={true}
                    style={{ objectFit: "fill", borderRadius: "10px" }}>
                    <source src={item.url} type="video/mp4" />
                </video>
                <Box sx={{ height: "40px" }} display="flex" alignItems="center" justifyContent="space-between">
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
                            onChange={() => handleSwitchVideo(i, item, 4)}
                            inputProps={{ 'aria-label': 'controlled' }}
                        /> <Span sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>{item?.isActive ? "Active" : "InActive"}</Span>
                    </Stack>
                    <Stack direction="row" alignItems="center">
                        <IconButton size="small">
                            <Icon fontSize="small" onMouseDown={() => handleDeleteVideo(i)} sx={{
                                color: "red",
                                cursor: "pointer",
                                zIndex: "999"
                            }}>delete</Icon>
                        </IconButton> <Span onMouseDown={() => handleDeleteVideo(i)} sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>Delete</Span>
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
                    <input
                        type="file"
                        name="image"
                        multiple
                        accept="image/png, image/gif, image/jpeg"
                        hidden
                        onClick={(event) => { event.target.value = '' }}
                        onChange={handleChange} />
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
                    <input
                        type="file"
                        name="videos"
                        multiple
                        accept="video/mp4,video/x-m4v,video/*"
                        hidden
                        onClick={(event) => { event.target.value = '' }}
                        onChange={handleChange} />
                </Button>
            </Box>
        );
    });

    return (
        <Box sx={{ position: 'relative' }}>
            <ValidatorForm onSubmit={handleSubmit} onError={handleError}>
                <Box sx={{ m: { lg: '50px', xs: '20px' } }}>
                    <SimpleCard title="Product" backArrow={true} paddingZero={true}>
                        <Grid container spacing={12}>
                            <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                <Box sx={{ padding: '20px 24px 0px 24px' }}>
                                    <FormControl fullWidth sx={{ mb: 2 }}>
                                        <InputLabel htmlFor="grouped-native-select">Category</InputLabel>
                                        <Select id="grouped-native-select" label="Category"
                                            value={category_id ?? ''}
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
                                            value={collection_id ?? ''}
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
                                            value={tax ?? 0}
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
                                            <Typography sx={{ color: formError?.image ? '#FF3D57' : 'rgba(52, 49, 76, 0.54)', fontWeight: 400, fontSize: '0.75rem', m: '3px 0px', ml: 1 }}>Upload image size is max 30MB only.</Typography>
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
                                            <Typography sx={{ color: formError?.videos ? '#FF3D57' : 'rgba(52, 49, 76, 0.54)', fontWeight: 400, fontSize: '0.75rem', m: '3px 0px', ml: 1 }}>Upload video size is max 50MB only.</Typography>
                                        </Box>
                                    </Box>
                                </Box>
                                <SimpleCard title="Add Attributes" backArrow={false} borderRadiusZero={true}>
                                    <Grid container spacing={12}>
                                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: "10px", mt: 2 }}>
                                                {attributes?.filter(x => x?.type == "multi")?.map((data, index) => {
                                                    return (
                                                        <Autocomplete
                                                            key={index}
                                                            sx={{ width: "400px" }}
                                                            multiple={data?.type == 'single' ? false : true}
                                                            id="tags-outlined"
                                                            value={data?.value}
                                                            onChange={(event, newValue) => handleAddValueAttribute(data?.name, newValue)}
                                                            options={data?.options}
                                                            getOptionLabel={(option) => option?.name}
                                                            filterSelectedOptions
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label={data?.name ? data?.name.charAt(0).toUpperCase() + data?.name.slice(1) : ""}
                                                                />
                                                            )}
                                                        />
                                                    )
                                                })}
                                                {attributes?.filter(x => x?.type == "single")?.map((data, index) => {
                                                    return (
                                                        <Autocomplete
                                                            key={index}
                                                            sx={{ width: "400px" }}
                                                            multiple={data?.type == 'single' ? false : true}
                                                            id="tags-outlined"
                                                            value={data?.value}
                                                            onChange={(event, newValue) => handleAddValueAttribute(data?.name, newValue)}
                                                            options={data?.options}
                                                            getOptionLabel={(option) => option?.name}
                                                            filterSelectedOptions
                                                            renderInput={(params) => (
                                                                <TextField
                                                                    {...params}
                                                                    label={data?.name ? data?.name.charAt(0).toUpperCase() + data?.name.slice(1) : ""}
                                                                />
                                                            )}
                                                        />
                                                    )
                                                })}
                                                <Box sx={{ width: "100%", textAlign: "end" }}>
                                                    <Button color="primary" variant="contained" type="button" sx={{ width: "150px", height: '53px' }} onClick={() => handleAddAttribute()}>
                                                        <Icon>add</Icon>
                                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add</Span>
                                                    </Button>
                                                </Box>
                                            </Box>

                                            {sku_data?.length > 0 && <Box sx={{ mt: 1 }}>
                                                <TableComponent
                                                    rows={sku_data ?? []}
                                                    columns={columns}
                                                    extraPaddingOnFirstColumn={true}
                                                    disablePagination={true}
                                                    extraDisable={true}
                                                    disableCheckBox={true}
                                                    renderRow={(row, index) => {
                                                        return (
                                                            <TableRow
                                                                hover
                                                                role="checkbox"
                                                                tabIndex={-1}
                                                                key={index}
                                                                sx={{ border: '1px solid' }}
                                                            >
                                                                <TableCell sx={{ pl: '15px' }}>{row?.sku}</TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type="text"
                                                                        label="InStock QTY"
                                                                        value={row?.inStock_qty ?? 0}
                                                                        name="inStock_qty"
                                                                        onChange={(e) => handleSKUData(e, index)}
                                                                        sx={{
                                                                            "&.MuiFormControl-root": {
                                                                                mb: 0
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                {/* <TableCell align="center">
                                                                    <TextField
                                                                        type="text"
                                                                        label="InStock Lead Time"
                                                                        value={row?.inStock_lead ?? 0}
                                                                        onChange={(e) => handleSKUData(e, index)}
                                                                        name="inStock_lead"
                                                                        sx={{
                                                                            "&.MuiFormControl-root": {
                                                                                mb: 0
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell> */}
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type="text"
                                                                        label="PreOrder QTY"
                                                                        value={row?.preOrder_qty ?? 0}
                                                                        onChange={(e) => handleSKUData(e, index)}
                                                                        name="preOrder_qty"
                                                                        sx={{
                                                                            "&.MuiFormControl-root": {
                                                                                mb: 0
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type="text"
                                                                        label="PreOrder Lead Time"
                                                                        value={row?.preOrder_lead ?? 0}
                                                                        onChange={(e) => handleSKUData(e, index)}
                                                                        name="preOrder_lead"
                                                                        sx={{
                                                                            "&.MuiFormControl-root": {
                                                                                mb: 0
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <TextField
                                                                        type="text"
                                                                        label="InStock Threshold QTY"
                                                                        value={row?.threshold ?? 0}
                                                                        onChange={(e) => handleSKUData(e, index)}
                                                                        name="threshold"
                                                                        sx={{
                                                                            "&.MuiFormControl-root": {
                                                                                mb: 0
                                                                            }
                                                                        }}
                                                                    />
                                                                </TableCell>
                                                                <TableCell align="center">
                                                                    <Box sx={{
                                                                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center        '
                                                                    }} onClick={() => {
                                                                        setSelectedSKUIndex(index)
                                                                        setDopen(true)
                                                                    }}>
                                                                        <Box sx={{
                                                                            width: '30px', height: '30px', background: row?.swatch ? row?.swatch : '#000', borderRadius: '50%'
                                                                        }}></Box>
                                                                    </Box>
                                                                </TableCell>
                                                                <TableCell align="center">{row?.mapVariant?.map(x => x?.name)?.join(", ")}</TableCell>
                                                                <TableCell align="center">
                                                                    {row?.isActive ?? true ?
                                                                        <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "green", textTransform: "capitalize" }}>
                                                                            Active
                                                                        </Typography>
                                                                        :
                                                                        <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "red", fontWeight: 500, textTransform: "capitalize" }}>
                                                                            InActive
                                                                        </Typography>
                                                                    }
                                                                </TableCell>
                                                                <TableCell align='right' sx={{ pr: "18px" }}>
                                                                    <IconButton
                                                                        aria-label="more"
                                                                        id="long-button"
                                                                        aria-controls={Boolean(actionOpen[index]) ? 'long-menu' : undefined}
                                                                        aria-expanded={Boolean(actionOpen[index]) ? 'true' : undefined}
                                                                        aria-haspopup="true"
                                                                        onClick={(e) => handleActionClick(e, index)}>
                                                                        <MoreVertIcon />
                                                                    </IconButton>
                                                                    <Menu
                                                                        id="fade-menu"
                                                                        MenuListProps={{
                                                                            'aria-labelledby': 'fade-button',
                                                                        }}
                                                                        anchorEl={actionOpen[index]}
                                                                        open={Boolean(actionOpen[index])}
                                                                        onClose={handleActionClose}
                                                                        TransitionComponent={Fade}
                                                                    >
                                                                        <MenuItem onClick={() => {
                                                                            setSelectedSKU(row)
                                                                            setSelectedSKUIndex(index)
                                                                            setMOpen(true)
                                                                            handleActionClose();
                                                                        }}>Add Mapped Variant</MenuItem>
                                                                    </Menu>
                                                                </TableCell>
                                                            </TableRow>
                                                        );
                                                    }}
                                                />
                                            </Box>
                                            }
                                        </Grid>
                                    </Grid>

                                    <Dialog
                                        open={dOpen}
                                        aria-labelledby="responsive-dialog-title"
                                    >
                                        <DialogTitle id="responsive-dialog-title">
                                            Pick Color
                                        </DialogTitle>
                                        <DialogContent>
                                            <Carousel showThumbs={false}>
                                                {image?.length > 0 ? image?.map(list => (
                                                    <div>
                                                        <img src={list?.url} width="100%" height="360px" />
                                                    </div>
                                                ))
                                                    :
                                                    <>Please Select Image First.</>
                                                }

                                            </Carousel>



                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setDopen(false)} type='button'>
                                                Cancel
                                            </Button>
                                            <Button onClick={() => pickColor()} type='button'>
                                                Pick Color
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </SimpleCard>
                                <Box sx={{ padding: '0px 24px', my: 2 }}>
                                    <FormControl>
                                        <RadioGroup
                                            row
                                            value={status ?? "ACTIVE"}
                                            onChange={handleChange}
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                            name="status">
                                            <FormControlLabel value={"ACTIVE"} control={<Radio />} label="Active" />
                                            <FormControlLabel value={"INACTIVE"} control={<Radio />} label="InActive" />
                                            <FormControlLabel value={"INQUALITY"} control={<Radio />} label="InQuality" />
                                        </RadioGroup>
                                    </FormControl>
                                </Box>
                            </Grid>
                        </Grid>
                        <MappedVariantModel open={mOpen} handleClose={() => {
                            setSelectedSKU({});
                            setSelectedSKUIndex(-1);
                            setMOpen(false)
                        }} formData={formData} SKUData={sku_data} selectedSKU={selectedSKU} selectedSKUIndex={selectedSKUIndex} setFormData={setFormData} />
                    </SimpleCard>
                </Box>

                <Box sx={{
                    width: '100%', height: '80px', background: '#fff',
                    position: 'sticky',
                    zIndex: 999,
                    bottom: 0,
                    boxShadow: '0 -8px 16px 0 rgb(85 93 102 / 30%)'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}>
                        <Box sx={{
                            ml: 3
                        }}>
                            <Stack direction="row" spacing={2}>
                                <Box>
                                    <Button startIcon={<Icon>arrow_back</Icon>} variant="outlined" color="primary" onClick={() => navigate(-1)} >
                                        Back
                                    </Button>
                                </Box>
                                <Box>
                                    <LoadingButton
                                        loading={loading}
                                        loadingPosition="start"
                                        type="submit"
                                        startIcon={<Icon>send</Icon>}
                                        color="primary"
                                        variant="contained">
                                        Save
                                    </LoadingButton>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                </Box>
            </ValidatorForm>
        </Box >
    );
};

export default ProductEditForm;

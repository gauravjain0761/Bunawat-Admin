import { CheckBox } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
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
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import useEyeDropper from 'use-eye-dropper'
import { toast } from 'material-react-toastify';
import { Span } from "app/components/Typography";
import { isMdScreen, isMobile } from "app/utils/utils";
import { mockDataProductColor } from "fake-db/data/product/color/colorList";
import { mockDataProductSize } from "fake-db/data/product/size/sizeList";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
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

const ProductForm = ({ data = {} }) => {
    const { open, close, isSupported } = useEyeDropper()
    const [dOpen, setDopen] = useState(false)
    const [description, setDescription] = useState("");
    const [categoryList, setCategoryList] = useState([])
    const [collectionList, setCollectionList] = useState([])
    const [loading, setLoading] = useState(false);
    const [isErrorDescription, setIsErrorDescription] = useState(false);
    const [formError, setFormError] = useState({});
    const [formData, setFormData] = useState({
        ...data, pCategory: "None", color: '#000', attributeData: [{
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
            ...data, pCategory: "None", color: '#000', attributeData: [{
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
            setLoading(true)
            await ApiPost(API_URL.addProduct, {
                ...formData,
                description,
                isActive: true
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
        }
        setFormError(tempError)
    };

    const handleImageUpload = async (event) => {
        let imageData = new FormData();
        const images = formData?.image ?? []
        imageData.append('file', event.target.files[0]);
        await ApiPost(API_URL.fileUploadProduct, imageData)
            .then((response) => {
                if (response?.data) {
                    setFormData({
                        ...formData, image: [...images, {
                            url: response?.data?.Location,
                            isActive: false,
                            type: 'IMAGE'
                        }]
                    });
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    // const handleDeleteImage = async (event) => {
    //     await ApiPost(API_URL.fileRemove, {
    //         url: image
    //     })
    //         .then((response) => {
    //             if (response?.data) {
    //                 setFormData({ ...formData, image: null });
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("Error", error);
    //         });
    // }

    const handleImageVideo = async (event) => {
        const videosList = formData?.videos ?? []
        let videoData = new FormData();
        videoData.append('video', event.target.files[0]);
        await ApiPost(API_URL.videoFileUpload, videoData)
            .then((response) => {
                if (response?.data) {
                    setFormData({
                        ...formData, videos: [...videosList, {
                            url: response?.data?.Location,
                            isActive: false,
                            type: 'VIDEO'
                        }]
                    });
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

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

    const handleDeleteImage = (index) => {
        let images = formData?.image ?? []
        images = images?.filter((img, i) => i != index)
        setFormData({ ...formData, image: images });
    };

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

    const handleDeleteVideo = (index) => {
        let videos = formData?.videos ?? []
        videos = videos?.filter((img, i) => i != index)
        setFormData({ ...formData, videos: videos });
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
            <Box key={i} sx={{
                width: "160px",
                height: "200px",
                margin: "10px 10px 0 0",
                position: "relative"
            }}>
                <img src={item.url} width="100%" height="160px" />
                <Box sx={{ height: "40px" }} display="flex" alignItems="center" justifyContent="end">
                    <Switch
                        sx={{
                            color: "red",
                            cursor: "pointer"
                        }}
                        checked={item?.isActive}
                        onChange={() => handleSwitchImage(i)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    /> <Span sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>{item?.isActive ? "Active" : "InActive"}</Span>
                    <Icon onMouseDown={(e) => handleDeleteImage(i)} sx={{
                        color: "red",
                        cursor: "pointer",
                    }}>delete</Icon> <Span onMouseDown={() => handleDeleteImage(i)} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                </Box>
            </Box>
        )
    });

    const SortableVideoItem = SortableElement(({ item, i }) => {
        return (
            <Box key={i}
                sx={{
                    width: "160px",
                    height: "200px",
                    margin: "20px 10px 0 0",
                    position: "relative"
                }}>
                <video width="100%" height="160px" autoPlay={true} muted={true} loop={true} playsInline={true}
                    style={{ objectFit: "fill", borderRadius: "10px" }}>
                    <source src={item.url} type="video/mp4" />
                </video>
                <Box sx={{ height: "40px" }} display="flex" alignItems="center" justifyContent="end">
                    <Switch
                        sx={{
                            color: "red",
                            cursor: "pointer",
                            zIndex: "999"
                        }}
                        checked={item?.isActive}
                        onChange={() => handleSwitchVideo(i, 4)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    /> <Span sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>{item?.isActive ? "Active" : "InActive"}</Span>
                    <Icon onMouseDown={() => handleDeleteVideo(i)} sx={{
                        color: "red",
                        cursor: "pointer",
                        zIndex: "999"
                    }}>delete</Icon> <Span onMouseDown={() => handleDeleteVideo(i)} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                </Box>
            </Box>
        )
    });

    const SortableList = SortableContainer(({ items }) => {
        return (
            <Box className="list-group">
                {items?.map((item, index) => {
                    return (
                        <SortableImageItem axis="xy" key={index} index={index} i={index} item={item} />
                    );
                })}
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
                        multiple={false}
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
            <Box className="list-group">
                {items?.map((item, index) => {
                    return (
                        <SortableVideoItem axis="xy" key={index} index={index} i={index} item={item} />
                    );
                })}
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
                        multiple={false}
                        accept="video/mp4,video/x-m4v,video/*"
                        hidden
                        onClick={(event) => { event.target.value = '' }}
                        onChange={handleChange} />
                </Button>
            </Box>
        );
    });

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={handleError}>
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

                            <FormControl fullWidth sx={{ mb: 2 }}>
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
                                    <MenuItem value={6}>6% CGST/IGST</MenuItem>
                                </Select>
                                {formError?.tax && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                            </FormControl>


                            <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
                                <Span sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: "18px" }}>Media</Span>
                                <Box className="list-group">
                                    <SortableList axis={"xy"} items={image} onSortEnd={onSortEnd} />
                                </Box>

                                <Box className="list-group">
                                    <SortableVideoList axis={"xy"} items={videos} onSortEnd={onSortVideoEnd} />
                                </Box>
                            </Box>
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

export default ProductForm;

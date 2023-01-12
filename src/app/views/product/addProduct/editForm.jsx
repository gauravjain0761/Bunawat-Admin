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
    Fade,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Icon,
    IconButton,
    InputLabel,
    Menu,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    styled,
    Switch,
    TableCell,
    TableRow,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import useEyeDropper from 'use-eye-dropper'
import { Span } from "app/components/Typography";
import { isMdScreen, isMobile } from "app/utils/utils";
import { mockDataProductColor } from "fake-db/data/product/color/colorList";
import { mockDataProductSize } from "fake-db/data/product/size/sizeList";
import React, { useEffect, useState } from "react";
import Avatar from "react-avatar";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate } from "react-router-dom";
import { arrayMove, SortableContainer, SortableElement } from "react-sortable-hoc";
import TableComponent from "app/components/table";
import TextEditor from "app/components/textEditor";
import { toast } from 'material-react-toastify';
import { ApiGet, ApiPut } from "app/service/api";
import { API_URL } from "app/constant/api";
import { LoadingButton } from "@mui/lab";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const ProductEditForm = ({ data = {} }) => {
    const { open, close, isSupported } = useEyeDropper()
    const [mOpen, setMOpen] = useState(false);
    const [dOpen, setDopen] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [collectionList, setCollectionList] = useState([])
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState(data ?? {})
    const navigate = useNavigate();
    const [description, setDescription] = useState("");
    const [actionOpen, setActionOpen] = useState(formData?.attributeList?.map(() => { return null }) ?? []);
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [attributes, setAttributes] = useState([]);

    useEffect(() => {
        setDescription(data?.[0]?.description ?? '')
        setFormData(data?.[0] ?? {})
    }, [data])

    const getData = async () => {
        await ApiGet(`${API_URL.getAttributes}`)
            .then((response) => {
                setAttributes(response?.data?.map((item) => {
                    return {
                        type: 'single',
                        name: item?.slug,
                        value: null,
                        options: item?.variants?.map(x => x?.name)
                    }
                }) ?? []);
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        getData();
    }, [])

    const columns = [
        {
            id: "dnumber",
            label: "SKU",
            width: 120
        },
        {
            id: "in_stock",
            label: "InStock \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "in_stock_leaqdtime",
            label: "InStock \nLead Time",
            align: "center",
            width: 100
        },
        {
            id: "preorder_qty",
            label: "PreOrder \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "preorder_leaqdtime",
            label: "PreOrder \nLead Time",
            align: "center",
            width: 100
        },
        {
            id: "in_stock_threshold",
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
        await ApiGet(`${API_URL.getCollections}`)
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
        setLoading(true)
        await ApiPut(API_URL.editProduct, {
            ...formData,
            description,
            sku_data: []
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
    };

    const handleChange = (event) => {
        if (event.target.name == "home") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else if (event.target.name == "image") {
            const images = formData[event.target.name] ?? []
            const newImages = Array.prototype.slice.call(event.target.files).map((image) => {
                return {
                    url: URL.createObjectURL(image),
                    checked: false
                }
            })
            setFormData({ ...formData, [event.target.name]: [...images, ...newImages] });
        } else if (event.target.name == "videos") {
            const videos = formData[event.target.name] ?? []
            const newVideos = Array.prototype.slice.call(event.target.files).map((video) => {
                return {
                    url: URL.createObjectURL(video),
                    checked: false
                }
            })
            setFormData({ ...formData, [event.target.name]: [...videos, ...newVideos] });
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

    const handleAddAttribute = () => {
        let attributesList = formData?.attributeList ?? []
        let attributesData = formData?.attributeData ?? []
        attributesList = [...attributesList, attributesData]
        attributesData = [{
            type: 'single',
            name: 'color',
            value: null
        }, {
            type: 'single',
            name: 'size',
            value: null
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
        if (images?.filter((img) => img.checked).length < max) {
            images[index] = { ...images[index], checked: !images[index].checked }
            setFormData({ ...formData, image: images });
        } else {
            if (images[index].checked) {
                images[index] = { ...images[index], checked: !images[index].checked }
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
        if (videos?.filter((video) => video.checked).length < max) {
            videos[index] = { ...videos[index], checked: !videos[index].checked }
            setFormData({ ...formData, videos: videos });
        } else {
            if (videos[index].checked) {
                videos[index] = { ...videos[index], checked: !videos[index].checked }
                setFormData({ ...formData, videos: videos });
            }
        }
    };

    const pickColor = () => {
        open()
            .then(color => {
                // handleAddValueAttribute('single', 'swatch', color.sRGBHex)
                setDopen(false)
            })
            .catch(e => {
                setDopen(false)
                console.log(e)
            })
    }
    console.log("formDataformData", formData)
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
        sku_data
    } = formData;

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
                        checked={item.checked}
                        onChange={() => handleSwitchImage(i)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    /> <Span sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>{item.checked ? "Active" : "InActive"}</Span>
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
                        checked={item.checked}
                        onChange={() => handleSwitchVideo(i, 4)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    /> <Span sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>{item.checked ? "Active" : "InActive"}</Span>
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
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="Product" backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel htmlFor="grouped-native-select">Category</InputLabel>
                                <Select id="grouped-native-select" label="Category"
                                    value={category_id}
                                    name="category_id"
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
                            </FormControl>

                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={collection_id}
                                    name="collection_id"
                                    label="Collection"
                                    onChange={handleChange}>
                                    {collectionList?.map(item => (
                                        <MenuItem key={item?.value} value={item?.value}>{item?.label}</MenuItem>
                                    ))}
                                </Select>
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


                            <Box sx={{ mb: 2 }}>
                                <TextEditor data={description} setData={(d) => setDescription(d)} />
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
                                label="MRP---   "
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
                                    label="Tax Type"
                                    onChange={handleChange}>
                                    <MenuItem value="Standard">Standard</MenuItem>
                                    <MenuItem value="6%">6% CGST/IGST</MenuItem>
                                </Select>
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

                            <Span sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: "18px" }}>Add Attributes</Span>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: "10px", mt: 2 }}>
                                {attributes?.map((data, index) => {
                                    return (
                                        <Autocomplete
                                            key={index}
                                            sx={{ width: "400px" }}
                                            multiple={data?.type == 'single' ? false : true}
                                            id="tags-outlined"
                                            // value={data?.value}
                                            // onChange={(event, newValue) => handleAddValueAttribute(data?.type, data?.name, newValue)}
                                            options={data?.options}
                                            getOptionLabel={(option) => option}
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

                                <Button color="primary" variant="contained" type="button" sx={{ width: "150px", height: '53px' }} onClick={() => handleAddAttribute()}>
                                    <Icon>add</Icon>
                                    <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add</Span>
                                </Button>
                            </Box>

                            {attributeList?.length > 0 && <Box sx={{ mt: 1 }}>
                                <TableComponent
                                    rows={attributeList ?? []}
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
                                                <TableCell sx={{ pl: '15px' }}>ABCD1234BlueM</TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        label="InStock QTY"
                                                        defaultValue={0}
                                                        sx={{
                                                            "&.MuiFormControl-root": {
                                                                mb: 0
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        label="InStock Lead Time"
                                                        defaultValue={0}
                                                        sx={{
                                                            "&.MuiFormControl-root": {
                                                                mb: 0
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        label="PreOrder QTY"
                                                        defaultValue={0}
                                                        sx={{
                                                            "&.MuiFormControl-root": {
                                                                mb: 0
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        label="PreOrder Lead Time"
                                                        defaultValue={0}
                                                        sx={{
                                                            "&.MuiFormControl-root": {
                                                                mb: 0
                                                            }
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="center">
                                                    <TextField
                                                        type="number"
                                                        label="InStock Threshold QTY"
                                                        defaultValue={0}
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
                                                        setDopen(true)
                                                    }}>
                                                        <Box sx={{
                                                            width: '30px', height: '30px', background: '#000', borderRadius: '50%'
                                                        }}></Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">ABCD123,XYZ456</TableCell>
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

                            <FormControl>
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
                        </Box>
                    </Box>

                    <Dialog
                        open={dOpen}
                        aria-labelledby="responsive-dialog-title">
                        <DialogTitle id="responsive-dialog-title">
                            Pick Color
                        </DialogTitle>
                        <DialogContent>
                            {image?.[0]?.url ?
                                <img src={image?.[0]?.url} width="100%" height="160px" />
                                :
                                <>Please Select Image First.</>
                            }
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

                    <Dialog
                        open={mOpen}
                        fullWidth
                        maxWidth="sm"
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                            Mapped Variant
                        </DialogTitle>
                        <DialogContent>
                            <Autocomplete
                                multiple={true}
                                id="tags-outlined"
                                sx={{ mt: 2, }}
                                options={['ABCD12', 'XYZ67']}
                                getOptionLabel={(option) => option}
                                filterSelectedOptions
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label='Mapped Variant List'
                                    />
                                )}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setMOpen(false)}>
                                Cancel
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
                        </DialogActions>
                    </Dialog>
                </SimpleCard>
            </ValidatorForm>
        </div >
    );
};

export default ProductEditForm;

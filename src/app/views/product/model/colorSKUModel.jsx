import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Grid, Icon, IconButton, Radio, RadioGroup, Stack, Switch, TextField, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import { API_URL } from 'app/constant/api'
import { ApiDelete, ApiGet, ApiPost, ApiPut } from 'app/service/api'
import { UIColor } from 'app/utils/constant'
import { toast } from 'material-react-toastify';
import React, { useEffect, useState } from 'react'
import { arrayMove, SortableContainer, SortableElement } from 'react-sortable-hoc'

const ColorSKUModel = ({ open, selectedSKU, id, getData, handleClose, ProductType = "Product", formColorData, setFormColorData }) => {
    const [formData, setFormData] = useState({});
    const [formError, setFormError] = useState({});
    const [imageLoading, setImageLoading] = useState(false);
    const [videoLoading, setVideoLoading] = useState(false);

    useEffect(() => {
        let tempData = [...formColorData]
        let findIndex = tempData?.findIndex(x => x?._id == selectedSKU?._id)
        setFormData({
            ...formData, image: tempData[findIndex]?.images ?? [], videos: tempData[findIndex]?.videos ?? []
        });
    }, [formColorData, selectedSKU])

    const handleChange = (event) => {
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        if (event.target.name == "image") {
            handleImageUpload(event)
        } else if (event.target.name == "videos") {
            handleImageVideo(event)
        } else {
            setFormData({ ...formData, [event.target.name]: onlyNums });
        }
    };

    const {
        image,
        videos,
    } = formData;

    const getSKUData = async () => {
        await ApiGet(`${API_URL.getSkuFiles}/${selectedSKU?._id}`).then((response) => {
            let tempData = [...formColorData]
            let findIndex = tempData?.findIndex(x => x?._id == selectedSKU?._id)
            tempData[findIndex] = { ...tempData[findIndex], images: response?.data?.images, videos: response?.data?.videos }
            setFormColorData(tempData)
            handleClose()
        })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const handleSubmit = async () => {
        // if ((formData?.image.length >= 3 && formData?.videos.length >= 2)) {
        await ApiPost(`${API_URL.SKUMediaCreate}/${selectedSKU?._id}`, {
            images: image ?? [],
            videos: videos ?? []
        }).then((response) => {
            getSKUData();
        })
            .catch((error) => {
                console.log("Error", error);
            });
        // } else {
        //     toast.error("Please upload 4 images, 3 videos")
        // }
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

    const handleSwitchImage = async (index, item, max = 5) => {
        let images = formData?.image ?? [];
        if (images?.filter((img) => img?.isActive).length < max && !images[index]?.isActive) {
            images[index] = { ...images[index], isActive: !images[index]?.isActive }
            setFormData({ ...formData, image: images });
            await ApiPut(`${API_URL.SKUFileStatus}/${item?._id}`, {
                isActive: true
            }).then((response) => {
                if (response?.data) {
                    toast.success(response?.data?.message)
                }
            }).catch((error) => {
                toast.error(error.error)
                console.log("Error", error);
            });
        } else {
            if (images[index]?.isActive) {
                images[index] = { ...images[index], isActive: !images[index]?.isActive }
                setFormData({ ...formData, image: images });
                await ApiPut(`${API_URL.SKUFileStatus}/${item?._id}`, {
                    isActive: false
                }).then((response) => {
                    if (response?.data) {
                        toast.success(response?.data?.message)
                    }
                }).catch((error) => {
                    toast.error(error.error)
                    console.log("Error", error);
                });
            }
        }
    };

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

    const handleSwitchVideo = async (index, item, max = 4) => {
        let videos = formData?.videos ?? [];
        if (videos?.filter((video) => video?.isActive).length < max && !videos[index]?.isActive) {
            videos[index] = { ...videos[index], isActive: !videos[index]?.isActive }
            setFormData({ ...formData, videos: videos });
            await ApiPut(`${API_URL.SKUFileStatus}/${item?._id}`, {
                isActive: true
            }).then((response) => {
                if (response?.data) {
                    toast.success(response?.data?.message)
                }
            }).catch((error) => {
                toast.error(error.error)
                console.log("Error", error);
            });
        } else {
            if (videos[index]?.isActive) {
                videos[index] = { ...videos[index], isActive: !videos[index]?.isActive }
                setFormData({ ...formData, videos: videos });
                await ApiPut(`${API_URL.SKUFileStatus}/${item?._id}`, {
                    isActive: false
                }).then((response) => {
                    if (response?.data) {
                        toast.success(response?.data?.message)
                    }
                }).catch((error) => {
                    toast.error(error.error)
                    console.log("Error", error);
                });
            }
        }
    };

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            // onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h6'>Media</Typography>
                    <Icon sx={{ cursor: 'pointer' }} onClick={handleClose}>close</Icon>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Box display="flex" flexDirection="column" sx={{ mb: 2 }}>
                        <Box className="list-group">
                            <Box className="list-group" sx={{ width: "100%" }}>
                                <Grid container spacing={2}>
                                    {image?.map((item, index) => {
                                        return (
                                            <Grid key={`List-Image${index}`} item lg={3} md={3} sm={6} xs={6}>
                                                <Box sx={{ width: "100%" }}>
                                                    <img src={item.url} width="100%" height="200px" />
                                                    <Box sx={{ height: "40px", width: "100%" }} display="flex" alignItems="center" justifyContent="space-between">
                                                        <div>
                                                            {!!item?._id ?
                                                                <Stack direction="row" alignItems="center">
                                                                    <Switch
                                                                        size="small"
                                                                        sx={{
                                                                            color: "red",
                                                                            cursor: "pointer",
                                                                            fontSize: "10px !impoprtant",
                                                                        }}
                                                                        checked={item?.isActive}
                                                                        onChange={(e) => handleSwitchImage(index, item)}
                                                                        inputProps={{ 'aria-label': 'controlled' }}
                                                                    /> <Span sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>{item?.isActive ? "Active" : "InActive"}</Span>
                                                                </Stack>
                                                                : null}
                                                        </div>
                                                        <div>
                                                            <Stack direction="row" alignItems="center">
                                                                <IconButton size="small">
                                                                    <Icon fontSize="small" onMouseDown={(e) => handleDeleteImage(index)} sx={{
                                                                        color: "red",
                                                                        cursor: "pointer",
                                                                    }}>delete</Icon>
                                                                </IconButton>
                                                                {/* <Span onMouseDown={() => handleDeleteImage(index)} sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>Delete</Span> */}
                                                            </Stack>
                                                        </div>
                                                    </Box>
                                                </Box>
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
                            <Box className="list-group" sx={{ width: "100%" }}>
                                <Grid container spacing={2}>
                                    {videos?.map((item, index) => {
                                        return (
                                            <Grid key={`List-Video-${index}`} item lg={3} md={3} sm={6} xs={6}>
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
                                                                onChange={() => handleSwitchVideo(index, item, 4)}
                                                                inputProps={{ 'aria-label': 'controlled' }}
                                                            /> <Span sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>{item?.isActive ? "Active" : "InActive"}</Span>
                                                        </Stack>
                                                        <Stack direction="row" alignItems="center">
                                                            <IconButton size="small">
                                                                <Icon fontSize="small" onMouseDown={() => handleDeleteVideo(index)} sx={{
                                                                    color: "red",
                                                                    cursor: "pointer",
                                                                    zIndex: "999"
                                                                }}>delete</Icon>
                                                            </IconButton>
                                                            {/* <Span onMouseDown={() => handleDeleteVideo(index)} sx={{ fontWeight: 600, fontSize: { md: "14px", sm: "12px", xs: "12px" }, cursor: "pointer" }}>Delete</Span> */}
                                                        </Stack>
                                                    </Box>
                                                </Box>
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
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ColorSKUModel
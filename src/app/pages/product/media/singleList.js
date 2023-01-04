import { Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Icon, IconButton, Paper, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs } from '@mui/material'
import { mockDataProductMedia } from 'fake-db/data/product/media/data'
import styled from '@emotion/styled';
import React, { useState } from 'react'
import { Menu, MenuItem } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { UIColor } from 'app/utils/constant';
import { useNavigate, useParams } from 'react-router-dom';

const ProductMediaSingleList = () => {
    const navigate = useNavigate();
    const { designNo } = useParams();
    const [dOpen, setDopen] = useState(false)
    const [dData, setDData] = useState(null)
    const [tab, setTab] = React.useState(0);
    const [selectedImage, setImageSelected] = useState(mockDataProductMedia.filter(x => x.type == 'image').map(() => { return false }));
    const [selectedVideo, setVideoSelected] = useState(mockDataProductMedia.filter(x => x.type == 'video').map(() => { return false }));
    const [actionImageOpen, setActionImageOpen] = useState(mockDataProductMedia.filter(x => x.type == 'image').map(() => { return null }));
    const [actionVideoOpen, setActionVideoOpen] = useState(mockDataProductMedia.filter(x => x.type == 'video').map(() => { return null }));

    const handleChange = (event, newValue) => {
        setTab(newValue);
    };

    const CardHeader = styled(Box)(() => ({
        display: 'flex',
        paddingLeft: '24px',
        paddingRight: '24px',
        marginBottom: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
    }));

    const Title = styled('span')(() => ({
        fontSize: '1rem',
        fontWeight: '500',
        textTransform: 'capitalize',
    }));

    return (
        <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
            <CardHeader >
                <Title >
                    <Stack flexDirection='row' alignItems='center' justifyContent='center'>
                        <IconButton sx={{ color: "#000", p: 0, mr: 1 }} onClick={() => navigate(-1)}>
                            <Icon>arrow_back</Icon>
                        </IconButton>
                        Media List ( ABCD1234 )
                    </Stack>
                </Title>
            </CardHeader>
            <Box sx={{ width: { lg: '50%', md: '75%', sm: '100%' }, px: 3, mb: 2 }}>
                <TableContainer component={Paper} sx={{ border: '1px solid #000' }}>
                    <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: UIColor, color: "#fff !important", fontWeight: 500, fontSize: "15px", pr: 0, borderBottom: 'none' }} align="center">Size</TableCell>
                                <TableCell align="center">M</TableCell>
                                <TableCell align="center">L</TableCell>
                                <TableCell align="center">XL</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell sx={{ backgroundColor: UIColor, color: "#fff !important", fontWeight: 500, fontSize: "15px", pr: 0, borderBottom: 'none' }} align="center">Quantity</TableCell>
                                <TableCell align="center">15</TableCell>
                                <TableCell align="center">76</TableCell>
                                <TableCell align="center">84</TableCell>
                            </TableRow>
                        </TableHead>
                    </Table>
                </TableContainer>
            </Box>
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '0 20px'
            }}>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs sx={{
                            ".MuiTabs-scroller .Mui-selected": {
                                color: UIColor
                            },
                            ".MuiTabs-scroller .MuiTabs-indicator ": {
                                background: UIColor
                            }
                        }}
                            value={tab} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Images" />
                            <Tab label="Videos" />
                        </Tabs>
                    </Box>
                </Box>
                {tab == 0 &&
                    <>
                        {selectedImage.filter(x => x).length > 0 && <Stack alignItems='center' flexDirection='row' justifyContent='space-between' sx={{
                            width: '100%',
                        }}><Box component='span' sx={{
                            fontWeight: 700,
                            fontSize: '16px'
                        }}>Select All
                                <Checkbox sx={{
                                    color: '#000',
                                }}
                                    checked={selectedImage.filter(x => x).length == selectedImage.length}
                                    indeterminate={selectedImage.filter(x => x).length != selectedImage.length}
                                    onChange={(e) => {
                                        let tempSelect = [...selectedImage]
                                        tempSelect = tempSelect.map(x => e.target.checked)
                                        setImageSelected(tempSelect)
                                    }}
                                />
                            </Box>
                            <Box component='span' sx={{
                                fontWeight: 700,
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}>Share
                            </Box>
                        </Stack>}
                        {mockDataProductMedia.filter(x => x.type == 'image').map((item, i) => {
                            return (
                                <Box key={item.id} sx={{
                                    width: "200px",
                                    height: "200px",
                                    margin: "0px 10px 0 0",
                                    position: "relative",
                                    cursor: 'pointer'
                                }} onClick={(e) => {
                                    // setDopen(true)
                                    // setDData(item)
                                }}>
                                    <img src={item.url} width="100%" height="200px" />
                                    <Checkbox sx={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        color: '#000',
                                        background: '#fff'
                                    }}
                                        checked={selectedImage[i]}
                                        onChange={(e) => {
                                            let tempSelect = [...selectedImage]
                                            tempSelect[i] = !tempSelect[i]
                                            setImageSelected(tempSelect)
                                        }}
                                    />
                                    <IconButton
                                        aria-label="more"
                                        sx={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '2px',
                                            color: '#000',
                                            background: '#fff'
                                        }}
                                        id="long-button"
                                        aria-controls={Boolean(actionImageOpen[i]) ? 'long-menu' : undefined}
                                        aria-expanded={Boolean(actionImageOpen[i]) ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={(e) => {
                                            let temp = [...actionImageOpen];
                                            if (!temp[i]) {
                                                temp = temp.map(() => { return null })
                                            }
                                            temp[i] = e.currentTarget
                                            setActionImageOpen(temp)
                                        }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'fade-button',
                                        }}
                                        anchorEl={actionImageOpen[i]}
                                        open={Boolean(actionImageOpen[i])}
                                        onClose={() => {
                                            let temp = [...actionImageOpen];
                                            temp = temp.map(() => { return null })
                                            setActionImageOpen(temp)
                                        }}
                                        TransitionComponent={Fade} >
                                        <MenuItem onClick={() => { }}>Share</MenuItem>
                                        <MenuItem onClick={() => {
                                            setDopen(true)
                                            setDData(item)
                                            let temp = [...actionImageOpen];
                                            temp = temp.map(() => { return null })
                                            setActionImageOpen(temp)
                                        }}>View</MenuItem>
                                    </Menu>
                                </Box>
                            )
                        })}
                    </>
                }

                {tab == 1 &&
                    <>
                        {selectedVideo.filter(x => x).length > 0 && <Stack alignItems='center' flexDirection='row' justifyContent='space-between' sx={{
                            width: '100%',
                        }}><Box component='span' sx={{
                            fontWeight: 700,
                            fontSize: '16px'
                        }}>Select All
                                <Checkbox sx={{
                                    color: '#000',
                                }}
                                    checked={selectedVideo.filter(x => x).length == selectedVideo.length}
                                    indeterminate={selectedVideo.filter(x => x).length != selectedVideo.length}
                                    onChange={(e) => {
                                        let tempSelect = [...selectedVideo]
                                        tempSelect = tempSelect.map(x => e.target.checked)
                                        setVideoSelected(tempSelect)
                                    }}
                                />
                            </Box>
                            <Box component='span' sx={{
                                fontWeight: 700,
                                fontSize: '16px',
                                cursor: 'pointer'
                            }}>Share
                            </Box>
                        </Stack>}
                        {mockDataProductMedia.filter(x => x.type == 'video').map((item, i) => {
                            return (
                                <Box key={item.id} sx={{
                                    width: "200px",
                                    height: "200px",
                                    margin: "0px 10px 0 0",
                                    position: "relative",
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    // setDopen(true)
                                    // setDData(item)
                                }}>
                                    <video width="100%" height="200px" autoPlay={true} muted={true} loop={true} playsInline={true}
                                        style={{ objectFit: "fill" }}>
                                        <source src={item.url} type="video/mp4" />
                                    </video>
                                    <Checkbox sx={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: '2px',
                                        color: '#000',
                                        background: '#fff'
                                    }}
                                        value={selectedVideo[i]}
                                        onChange={(e) => {
                                            let tempSelect = [...selectedVideo]
                                            tempSelect[i] = !tempSelect[i]
                                            setVideoSelected(tempSelect)
                                        }}
                                    />
                                    <IconButton
                                        aria-label="more"
                                        sx={{
                                            position: 'absolute',
                                            top: '2px',
                                            right: '2px',
                                            color: '#000',
                                            background: '#fff'
                                        }}
                                        id="long-button"
                                        aria-controls={Boolean(actionVideoOpen[i]) ? 'long-menu' : undefined}
                                        aria-expanded={Boolean(actionVideoOpen[i]) ? 'true' : undefined}
                                        aria-haspopup="true"
                                        onClick={(e) => {
                                            let temp = [...actionVideoOpen];
                                            if (!temp[i]) {
                                                temp = temp.map(() => { return null })
                                            }
                                            temp[i] = e.currentTarget
                                            setActionVideoOpen(temp)
                                        }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        id="fade-menu"
                                        MenuListProps={{
                                            'aria-labelledby': 'fade-button',
                                        }}
                                        anchorEl={actionVideoOpen[i]}
                                        open={Boolean(actionVideoOpen[i])}
                                        onClose={() => {
                                            let temp = [...actionVideoOpen];
                                            temp = temp.map(() => { return null })
                                            setActionVideoOpen(temp)
                                        }}
                                        TransitionComponent={Fade} >
                                        <MenuItem onClick={() => { }}>Share</MenuItem>
                                        <MenuItem onClick={() => {
                                            setDopen(true)
                                            setDData(item)
                                            let temp = [...actionVideoOpen];
                                            temp = temp.map(() => { return null })
                                            setActionVideoOpen(temp)
                                        }}>View</MenuItem>
                                    </Menu>
                                </Box>
                            )
                        })}
                    </>
                }
                <Dialog
                    open={dOpen}
                    fullWidth
                    maxWidth="lg"
                    aria-labelledby="responsive-dialog-title">
                    <DialogTitle id="responsive-dialog-title">
                        Attachment details
                        <Icon onClick={() => {
                            setDopen(false)
                            setDData(null)
                        }} sx={{
                            position: 'absolute',
                            right: '5px',
                            top: '5px',
                            color: "black",
                            cursor: "pointer",
                            zIndex: "999",
                            background: '#000',
                            color: '#fff',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            display: 'flex !important',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>close</Icon>
                    </DialogTitle>
                    <DialogContent>
                        <Box
                            sx={{
                                display: 'flex',
                            }} className="mediaPart">
                            <Box sx={{
                                flex: 2,
                                p: 2
                            }}>
                                {dData?.type == 'image' ?
                                    <Box>
                                        <img src={dData?.url} width="100%" height="600px" />
                                    </Box>
                                    :
                                    <Box>
                                        <video width="100%" height="600px" autoPlay={true} muted={true} loop={true} playsInline={true}
                                            style={{ objectFit: "fill" }}>
                                            <source src={dData?.url} type="video/mp4" />
                                        </video>
                                    </Box>
                                }
                            </Box>
                            <Box sx={{
                                flex: 1,
                                p: 2
                            }}>
                                <Box display='flex' flexDirection='column'>
                                    <Box component='span' sx={{
                                        fontWeight: 700,
                                        color: '#646970'
                                    }}>Design No: <Box component='span' sx={{ fontWeight: 400 }}>{" "} 1234567</Box></Box>

                                    <Box component='span' sx={{
                                        fontWeight: 700,
                                        color: '#646970'
                                    }}>Uploaded on:  <Box component='span' sx={{ fontWeight: 400 }}>{" "} November 4, 2022</Box></Box>

                                    <Box component='span' sx={{
                                        fontWeight: 700,
                                        color: '#646970'
                                    }}> Uploaded by: <Box component='span' sx={{ fontWeight: 400 }}>{" "} junisha</Box></Box>

                                    <Box component='span' sx={{
                                        fontWeight: 700,
                                        color: '#646970'
                                    }}>File name:  <Box component='span' sx={{ fontWeight: 400 }}>{" "} LCTS2673-3-scaled.jpg</Box></Box>

                                    <Box component='span' sx={{
                                        fontWeight: 700,
                                        color: '#646970'
                                    }}>File type: <Box component='span' sx={{ fontWeight: 400 }}>{" "} image/jpeg</Box></Box>

                                    <Box component='span' sx={{
                                        fontWeight: 700,
                                        color: '#646970'
                                    }}> File size: <Box component='span' sx={{ fontWeight: 400 }}>{" "} 462 KB</Box></Box>

                                    <Box component='span' sx={{
                                        fontWeight: 700,
                                        color: '#646970'
                                    }}>File name:  <Box component='span' sx={{ fontWeight: 400 }}>{" "} LCTS2673-3-scaled.jpg</Box></Box>

                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                </Dialog>
            </Box>
        </Card >
    )
}

export default ProductMediaSingleList
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Icon, Tab, Tabs } from '@mui/material'
import { mockDataProductMedia } from 'fake-db/data/product/media/data'
import styled from '@emotion/styled';
import React, { useState } from 'react'
import { UIColor } from 'app/utils/constant';

const ProductMedia = () => {
    const [dOpen, setDopen] = useState(false)
    const [dData, setDData] = useState(null)
    const [tab, setTab] = React.useState(0);

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
                <Title>Media List</Title>
            </CardHeader>
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
                        {mockDataProductMedia.filter(x => x.type == 'image').map((item, i) => {
                            return (
                                <Box key={item.id} sx={{
                                    width: "200px",
                                    height: "200px",
                                    margin: "10px 10px 0 0",
                                    position: "relative",
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    setDopen(true)
                                    setDData(item)
                                }}>
                                    <img src={item.url} width="100%" height="200px" />
                                    <Box sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '40px',
                                        bottom: 0,
                                        background: '#00000075',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        ABCD1234
                                    </Box>
                                </Box>
                            )
                        })}
                    </>
                }

                {tab == 1 &&
                    <>
                        {mockDataProductMedia.filter(x => x.type == 'video').map((item, i) => {
                            return (
                                <Box key={item.id} sx={{
                                    width: "200px",
                                    height: "200px",
                                    margin: "10px 10px 0 0",
                                    position: "relative",
                                    cursor: 'pointer'
                                }} onClick={() => {
                                    setDopen(true)
                                    setDData(item)
                                }}>
                                    <video width="100%" height="200px" autoPlay={true} muted={true} loop={true} playsInline={true}
                                        style={{ objectFit: "fill" }}>
                                        <source src={item.url} type="video/mp4" />
                                    </video>
                                    <Box sx={{
                                        position: 'absolute',
                                        width: '100%',
                                        height: '40px',
                                        bottom: 0,
                                        background: '#00000075',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        ABCD1234
                                    </Box>
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
        </Card>
    )
}

export default ProductMedia
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import { mockDataProductMedia } from 'fake-db/data/product/media/data'
import React, { useState } from 'react'

const ProductMedia = () => {
    const [dOpen, setDopen] = useState(false)
    const [dData, setDData] = useState(null)
    return (
        <Box sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            padding: '20px'
        }}>
            {mockDataProductMedia.map((item, i) => {
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
                        {item?.type == 'image' ?
                            <Box>
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
                                    FileName
                                </Box>
                            </Box>
                            :
                            <Box>
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
                                    FileName
                                </Box>
                            </Box>
                        }
                    </Box>
                )
            })}
            <Dialog
                open={dOpen}
                fullWidth
                maxWidth="lg"
                aria-labelledby="responsive-dialog-title">
                <DialogTitle id="responsive-dialog-title">
                    Attachment details
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
                <DialogActions>
                    <Button onClick={() => {
                        setDopen(false)
                        setDData(null)
                    }} type='button'>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ProductMedia
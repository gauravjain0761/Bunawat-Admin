import { Box, Button, Card, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Icon, IconButton, Menu, MenuItem, Stack, Tab, Tabs } from '@mui/material'
import { mockDataProductMedia } from 'fake-db/data/product/media/data'
import styled from '@emotion/styled';
import React, { useState } from 'react'
import { UIColor } from 'app/utils/constant';
import { useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { API_URL } from 'app/constant/api';
import { ApiGet } from 'app/service/api';

const ProductMedia = () => {
    const navigate = useNavigate();
    const [selectedImage, setImageSelected] = useState([]);
    const [actionImageOpen, setActionImageOpen] = useState([]);
    const [dOpen, setDopen] = useState(false)
    const [dData, setDData] = useState(null)
    const [rowLoading, setRowLoading] = useState(false);
    const [rows, setRows] = useState([]);

    const getData = async () => {
        setRowLoading(true)
        await ApiGet(`${API_URL.getProducts}`)
            .then((response) => {
                setRowLoading(false)
                setRows(response?.data ?? []);
                setImageSelected(response?.data?.map(() => { return false }) ?? []);
                setActionImageOpen(response?.data?.map(() => { return null }) ?? []);
            })
            .catch((error) => {
                setRowLoading(false)
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        getData();
    }, [])

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
            {selectedImage.filter(x => x).length > 0 && <Stack alignItems='center' flexDirection='row' justifyContent='space-between' sx={{
                width: '100%',
            }}><Box component='span' sx={{
                fontWeight: 700,
                fontSize: '16px',
                padding: '0 20px'
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
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                padding: '0 20px'
            }}>
                {rows.map((item, i) => {
                    return (
                        <Box key={item._id} sx={{
                            width: "200px",
                            height: "200px",
                            margin: "10px 10px 0 0",
                            position: "relative",
                            cursor: 'pointer'
                        }}>
                            <img src={item?.image} width="100%" height="200px" onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                navigate(`/product/media/${item._id}`)
                            }} />
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
                                {item?.design_num}
                            </Box>
                            <Checkbox sx={{
                                position: 'absolute',
                                top: '2px',
                                left: '2px',
                                color: '#000',
                                background: '#fff'
                            }}
                                checked={selectedImage[i] ?? false}
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
                                <MenuItem onClick={() => { }}>Share Image</MenuItem>
                                <MenuItem onClick={() => { }}>Share Image With Description</MenuItem>
                            </Menu>
                        </Box>
                    )
                })}

            </Box>
        </Card>
    )
}

export default ProductMedia
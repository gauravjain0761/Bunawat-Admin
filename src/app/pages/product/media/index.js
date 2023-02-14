import { Box, Button, Card, Checkbox, Container, Dialog, DialogActions, DialogContent, DialogTitle, Fade, Grid, Icon, IconButton, Menu, MenuItem, Stack, Tab, Tabs } from '@mui/material'
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
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [searchText, setSearchText] = useState('');

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

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
        <>
            <CardHeader sx={{ paddingLeft: "10px !important", paddingRight: "10px !important" }}>
                <Box display="flex" justifyContent='space-between' width="100%">
                    <Box></Box>
                    <Box display="flex" alignItems="center" className="searchBoxWidth" sx={{
                        border: "1px solid #000",
                        borderRadius: "6px",
                        mr: "0px",
                        width: '300px',
                        marginTop: '20px',
                        // marginLeft: '26rem',
                    }}>
                        <Box component="input" sx={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '1rem',
                            p: 0,
                            paddingLeft: '20px',
                            height: '36px',
                            background: "transparent",
                            color: "#000",
                        }} type="text" autoFocus value={searchText} onChange={(e) => {
                            setSearchText(e.target.value)
                        }} placeholder="Search here..." />
                        <IconButton onClick={() => setSearchText('')} sx={{ verticalAlign: 'middle' }}>
                            <Icon sx={{ color: "#000" }}>{!searchText ? 'search' : 'close'}</Icon>
                        </IconButton>
                    </Box>
                </Box>
            </CardHeader>
            <Card elevation={3} sx={{ border: "1px solid #232a45", margin: "10px", paddingBottom: "20px" }}>
                <CardHeader sx={{ background: "#232a45", padding: "1.4rem 2rem", color: "#fff", fontSize: '16px', fontWeight: '700', paddingLeft: "10px !important", paddingRight: "10px !important" }}>
                    {/* <Title>Media List</Title> */}
                    <Stack alignItems='center' flexDirection='row' justifyContent='space-between' sx={{
                        width: '100%',
                        height: '20px',
                    }}><Box component='span' sx={{
                        fontWeight: 700,
                        fontSize: '16px',
                        padding: '0'
                    }}>
                            <Checkbox sx={{
                                color: '#fff !important',
                            }}
                                checked={selectedImage.filter(x => x).length == selectedImage.length}
                                // indeterminate={selectedImage.filter(x => x).length != selectedImage.length}
                                onChange={(e) => {
                                    let tempSelect = [...selectedImage]
                                    tempSelect = tempSelect.map(x => e.target.checked)
                                    setImageSelected(tempSelect)
                                }}
                            />
                            Media List
                        </Box>


                        <Box component='span' sx={{
                            fontWeight: 700,
                            fontSize: '16px',
                            cursor: 'pointer'
                        }}>
                            <IconButton
                                id="menu-appbar"
                                color="inherit"
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                            >
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                // keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={handleClose}>Share Image</MenuItem>
                                <MenuItem onClick={handleClose}>Share Image With Description</MenuItem>
                            </Menu>
                        </Box>
                    </Stack>
                    {/* {selectedImage.filter(x => x).length > 0 && <Stack alignItems='center' flexDirection='row' justifyContent='space-between' sx={{
                    width: '100%',
                    height: '20px',
                }}><Box component='span' sx={{
                    fontWeight: 700,
                    fontSize: '16px',
                    padding: '0 20px'
                }}>
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
                        Media List
                    </Box>
                    <Box component='span' sx={{
                        fontWeight: 700,
                        fontSize: '16px',
                        cursor: 'pointer'
                    }}>
                    <IconButton
                        id="menu-appbar"
                        color="inherit"
                        size="large"
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={handleClose}>Profile</MenuItem>
                        <MenuItem onClick={handleClose}>My account</MenuItem>
                    </Menu>
                    </Box>
                </Stack>} */}
                </CardHeader>
                <Container maxWidth>
                    <Grid container spacing={4}>
                        {rows.map((item, i) => {
                            return (
                                <Grid item lg={3} md={3} sm={6} xs={6} key={item._id}>
                                    <Box sx={{
                                        width: "100%",
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
                                                    (tempSelect)
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
                                </Grid>
                            )
                        })}

                    </Grid>
                </Container>
            </Card>
        </>
    )
}

export default ProductMedia
import { LoadingButton } from '@mui/lab';
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, IconButton, TextField } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiDelete, ApiGet, ApiPost } from 'app/service/api'
import { UIColor } from 'app/utils/constant';
import { toast } from 'material-react-toastify';
import React, { useEffect } from 'react'
import { useState } from 'react';

const ShareMediaModel = ({ open, handleClose, selectedProductIds, enableDescription = false }) => {
    const [productIds, setProductIds] = useState(selectedProductIds ?? []);
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [users, setUsers] = useState([]);
    console.log("selectedProductIds", selectedProductIds)
    useEffect(() => {
        setProductIds(selectedProductIds ?? [])
        setUsers([])
    }, [selectedProductIds])

    const popupClose = () => {
        setDescription('')
        setPhone('')
        setUsers([])
        handleClose();
    }

    const handleChange = (e) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        if (onlyNums.length < 11) {
            setPhone(onlyNums)
        }
    }

    const handleAdd = () => {
        if (phone?.length == 10) {
            setPhone('')
            if (users?.some(list => phone == list)) {
                toast.error("Number already selected!")
            } else {
                setUsers([...users, phone])
            }
        } else {
            toast.error("Enter Valid Number!")
        }
    }

    const handleRemoveUser = (index) => {
        let temp = [...users]
        temp = temp?.filter((_, i) => i != index) ?? [];
        setUsers(temp)
    }

    const handleShare = async () => {
        if (users?.length > 0) {
            await ApiPost(API_URL.shareMedia, {
                product_id: productIds,
                users: users,
                message: description
            })
                .then((response) => {
                    popupClose()
                    toast.success('Share Successfully!')
                })
                .catch((error) => {
                    toast.error(error?.error)
                    console.log("Error", error);
                });
        } else {
            toast.error("Select Users First!")
        }
    }

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                Share Media
            </DialogTitle>
            <DialogContent>
                {enableDescription &&
                    <TextField
                        type="text"
                        fullWidth
                        sx={{
                            mt: 2
                        }}
                        name="description"
                        label="Enter Message"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description || ""}
                    />
                }
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2
                }}>
                    <TextField
                        type="text"
                        fullWidth
                        name="phone"
                        label="Enter Mobile Number"
                        onChange={handleChange}
                        value={phone || ""}
                    />
                    <LoadingButton
                        sx={{
                            background: UIColor,
                            color: '#fff',
                            height: '53px',
                            width: '100px',
                            ml: 2
                        }}
                        loading={false}
                        onClick={handleAdd}
                        loadingPosition="start"
                        color="primary"
                        variant="contained">
                        Add
                    </LoadingButton>
                </Box>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mt: 2,
                    gap: '10px'
                }}>
                    {users?.map((list, index) => (
                        <Box sx={{
                            border: '1px solid',
                            borderRadius: '4px',
                            padding: '10px'
                        }}>
                            <Box component='span' sx={{
                            }}>{list}</Box>
                            <IconButton onClick={() => handleRemoveUser(index)} size="small">
                                <Icon fontSize="small" sx={{
                                    color: "red",
                                }}>delete</Icon>
                            </IconButton>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={popupClose}>
                    Cancel
                </Button>
                <Button onClick={handleShare}>
                    Share
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShareMediaModel
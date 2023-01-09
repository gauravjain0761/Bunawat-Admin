import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Icon, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiDelete } from 'app/service/api'
import React, { useState } from 'react'

const StatusModel = ({ open, deleteData, getData, handleClose }) => {
    const [formData, setFormData] = useState({});
    // const handleDelete = async () => {
    //     await ApiDelete(`${API_URL.deleteCollection}/${deleteData?._id}`)
    //         .then((response) => {
    //             if (getData) getData()
    //             handleClose()
    //         })
    //         .catch((error) => {
    //             console.log("Error", error);
    //         });
    // }


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };


    const {
        status
    } = formData;

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            // onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h6'>Status</Typography>
                    <Icon sx={{ cursor: 'pointer' }} onClick={handleClose}>close</Icon>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <FormControl fullWidth sx={{ mt: 1 }}>
                        <InputLabel id="demo-simple-select-label">Select Status</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={status}
                            name="status"
                            label="Select Status"
                            onChange={handleChange}>
                            <MenuItem value="Pending payment">Pending payment</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Packed">Packed</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="On hold">On hold</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                            <MenuItem value="Refunded">Refunded</MenuItem>
                            <MenuItem value="Failed">Failed</MenuItem>
                            <MenuItem value="Replaced">Replaced</MenuItem>
                            <MenuItem value="Draft">Draft</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default StatusModel
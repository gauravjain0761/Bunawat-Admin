import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Icon, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import { API_URL } from 'app/constant/api'
import { ApiDelete } from 'app/service/api'
import { UIColor } from 'app/utils/constant'
import { toast } from 'material-react-toastify';
import React, { useState } from 'react'

const TrackingModel = ({ open, deleteData, getData, handleClose }) => {
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

    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const {
        trackingNo,
    } = formData;

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
                    <Typography variant='h6'>Tracking No</Typography>
                    <Icon sx={{ cursor: 'pointer' }} onClick={handleClose}>close</Icon>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Box sx={{ color: '#000', mt: 1 }}>
                        <TextField
                            type="text"
                            fullWidth
                            name="trackingNo"
                            label="Tracking No"
                            onChange={handleChange}
                            value={trackingNo || ""}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                        />
                    </Box>
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

export default TrackingModel
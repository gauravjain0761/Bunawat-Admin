import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Icon, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import { API_URL } from 'app/constant/api'
import { ApiDelete, ApiPut } from 'app/service/api'
import { UIColor } from 'app/utils/constant'
import { toast } from 'material-react-toastify';
import React, { useState } from 'react'

const PositionModel = ({ open, id, selectedData, getData, handleClose }) => {
    const [formData, setFormData] = useState({});

    const handleChange = (event) => {
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        if (Number(onlyNums) >= 0) {
            setFormData({ ...formData, [event.target.name]: onlyNums });
        }
    };

    const handleSubmit = async () => {
        await ApiPut(`${API_URL.editProductOrdering}`, {
            type_id: id,
            product_id: selectedData?._id,
            order: Number(formData?.position)
        })
            .then((response) => {
                getData();
                handleClose();
                toast.success('Drag Successfully!')
            })
            .catch((error) => {
                toast.error(error?.error)
                console.log("Error", error);
            });
    };

    const {
        position,
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
                    <Typography variant='h6'>Set Position</Typography>
                    <Icon sx={{ cursor: 'pointer' }} onClick={handleClose}>close</Icon>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Box sx={{ color: '#000', mt: 1 }}>
                        <TextField
                            type="text"
                            fullWidth
                            name="position"
                            label="Enter Position"
                            onChange={handleChange}
                            value={position || ""}
                            validators={["required"]}
                            errorMessages={["this field is required"]}
                        />
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

export default PositionModel
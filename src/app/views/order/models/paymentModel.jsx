import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Icon, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import { API_URL } from 'app/constant/api'
import { ApiDelete } from 'app/service/api'
import { UIColor } from 'app/utils/constant'
import { toast } from 'material-react-toastify';
import React, { useState } from 'react'

const PaymentModel = ({ open, deleteData, getData, handleClose }) => {
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
        if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const {
        paymentType,
        transactionId,
        image
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
                    <Typography variant='h6'>Payment Info</Typography>
                    <Icon sx={{ cursor: 'pointer' }} onClick={handleClose}>close</Icon>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Box sx={{ color: '#000' }}>
                        <FormControl sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}>
                            <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1, color: '#000' }}>Payment Type</FormLabel>
                            <RadioGroup
                                row
                                value={paymentType ?? "cod"}
                                onChange={handleChange}
                                aria-labelledby="demo-row-radio-buttons-group-label"
                                name="paymentType">
                                <FormControlLabel value="cod" control={<Radio />} label="COD" />
                                <FormControlLabel value="online" control={<Radio />} label="Online" />
                                <FormControlLabel value="credits" control={<Radio />} label="Credits" />
                                <FormControlLabel value="partialCredits" control={<Radio />} label="Partial Credits" />
                            </RadioGroup>
                        </FormControl>
                        {paymentType == 'online' &&
                            <Stack>
                                <TextField
                                    type="text"
                                    name="transactionId"
                                    label="Transaction Id"
                                    onChange={handleChange}
                                    value={transactionId || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                {image ?
                                    <Box
                                        sx={{
                                            width: "150px",
                                            height: "170px",
                                            margin: "10px 10px 0 0",
                                            position: "relative"
                                        }}>
                                        <img src={image} width="100%" height="90%" />
                                        <Box sx={{ height: "10%" }} display="flex" alignItems="center" justifyContent="end">
                                            <Icon onClick={() => handleDeleteImage()} sx={{
                                                color: "red",
                                                cursor: "pointer",
                                            }}>delete</Icon> <Span onClick={() => handleDeleteImage()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                        </Box>
                                    </Box>
                                    :
                                    <Button
                                        variant="contained"
                                        component="label"
                                        sx={{
                                            width: "150px",
                                            height: "150px",
                                            background: "transparent",
                                            color: "#000",
                                            border: "2px dashed",
                                            margin: "10px 10px 0 0",

                                            "&:hover": {
                                                background: "transparent",
                                            }
                                        }} >
                                        <Icon>add</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Upload File</Span>
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/png, image/gif, image/jpeg"
                                            hidden
                                            onClick={(event) => { event.target.value = '' }}
                                            onChange={handleChange} />
                                    </Button>
                                }
                            </Stack>
                        }
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

export default PaymentModel
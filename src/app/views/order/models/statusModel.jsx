import { LoadingButton } from '@mui/lab';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Icon, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material'
import { pdf } from '@react-pdf/renderer';
import { API_URL } from 'app/constant/api'
import { ApiDelete, ApiGet, ApiPost, ApiPut } from 'app/service/api'
import InvoicesDocument from 'app/views/order/invoicePDF/Invoice';
import { toast } from 'material-react-toastify';
import React, { useEffect, useState } from 'react'
import PackingSlipDocument from '../invoicePDF/packingSlip';

const StatusModel = ({ open, selectedeData, getData, handleClose }) => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        order_status: selectedeData?.order_status,
    });

    const [errors, setErrors] = useState({
        credit_amount: false
    })

    useEffect(() => {
        setFormData({
            order_status: selectedeData?.order_status
        })
    }, [selectedeData])

    const generatePdfDocument = async (data = {}, slipData = {}) => {
        let payload = [];
        // const blobIInvoices = await pdf((
        //     <InvoicesDocument data={data} />
        // )).toBlob()
        // let readerInvoices = new FileReader();
        // readerInvoices.readAsDataURL(blobIInvoices);
        // readerInvoices.onloadend = async function () {
        //     const base64 = readerInvoices.result;
        //     payload.push({
        //         type: "invoice",
        //         base64
        //     })
        await ApiPost(`${API_URL.generateInvoicePDF}`, {
            orderId: selectedeData?._id
        })
            .then(async (response) => {
            })
            .catch((error) => {
                console.log("Error", error);
            });
        const blobPackingSlip = await pdf((
            <PackingSlipDocument data={data} slipData={slipData} />
        )).toBlob()
        let readerPackingSlip = new FileReader();
        readerPackingSlip.readAsDataURL(blobPackingSlip);
        readerPackingSlip.onloadend = async function () {
            const base64 = readerPackingSlip.result;
            payload.push({
                type: "packing_slip",
                base64
            })
            await ApiPost(`${API_URL.generateInvoice}/${selectedeData?._id}`, payload)
                .then(async (response) => {
                    if (getData) getData()
                    handleClose()
                    setLoading(false)
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        }
        // }
    };

    const handeSubmit = async () => {
        let payload = { order_status: formData?.order_status };
        if (payload?.order_status == "Shipped") {
            payload = {
                order_status: formData?.order_status,
                delivery_name: formData?.delivery_name,
                delivery_id: formData?.delivery_id,
                delivery_partner: formData?.delivery_partner,
            }
        }
        if (payload?.order_status == "Return") {

            if (formData?.return_type == "CREDIT") {
                if (!formData?.credit_amount) {
                    setErrors({ ...errors, credit_amount: true })
                    setLoading(false)
                    return
                }
            }
            payload = {
                order_status: formData?.order_status,
                delivery_name: formData?.delivery_name,
                delivery_id: formData?.delivery_id,
                return_type: formData?.return_type ?? "CREDIT",
                credit_amount: formData?.credit_amount
            }
            await ApiPut(`${API_URL.returnOrderUpdate}/${selectedeData?._id}`, payload)
                .then(async (response) => {
                    await ApiPut(`${API_URL.editOrder}/${selectedeData?._id}`, { order_status: formData?.order_status })
                        .then(async (response) => {
                            if (getData) getData()
                            handleClose()
                            setLoading(false)
                        })
                        .catch((error) => {
                            console.log("Error", error);
                        });
                })
                .catch((error) => {
                    toast.error(error?.error ?? "Something went wrong")
                    setLoading(false)
                    console.log("Error", error);
                });
        } else {
            await ApiPut(`${API_URL.editOrder}/${selectedeData?._id}`, payload)
                .then(async (response) => {
                    if (formData?.order_status == "Shipped") {
                        await ApiPost(`${API_URL.generatePackingSlip}/${selectedeData?._id}`, {})
                            .then(async (response2) => {
                                generatePdfDocument(response?.data ?? {}, response2?.data ?? {})
                            })
                            .catch((error) => {
                                console.log("Error", error);
                            });
                    } else {
                        if (getData) getData()
                        handleClose()
                        setLoading(false)
                    }
                })
                .catch((error) => {
                    console.log("Error", error);
                });
        }
    }


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
        setErrors({ ...errors, [event.target.name]: false })
    };


    const {
        order_status,
        delivery_partner,
        delivery_id,
        delivery_name,
        return_type
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
                            value={order_status}
                            name="order_status"
                            label="Select Status"
                            onChange={handleChange}>
                            {selectedeData?.payment_mode == "COD" ? null : <MenuItem disabled={selectedeData?.order_status == "Shipped"} value="Pending">Pending payment</MenuItem>}
                            {selectedeData?.payment_mode == "COD" ? <MenuItem disabled={selectedeData?.order_status == "Shipped"} value="Processing">Processing</MenuItem> : null}
                            <MenuItem disabled={selectedeData?.order_status == "Shipped"} value="Confirmed">Confirmed</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Delivered">Delivered</MenuItem>
                            <MenuItem disabled value="Return Scheduled">Return Scheduled</MenuItem>
                            <MenuItem value="Return">Return</MenuItem>
                            <MenuItem value="Quality Pass">Return Quality Pass</MenuItem>
                            <MenuItem value="Quality Fail">Return Quality Fail</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                            <MenuItem value="Closed">Closed</MenuItem>
                        </Select>
                    </FormControl>
                    {order_status == "Shipped" &&
                        <>
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                mt: 2
                            }}>
                                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1, color: '#000' }}>Delivery Partner </FormLabel>
                                <RadioGroup
                                    row
                                    value={delivery_partner ?? "DELHIVERY"}
                                    onChange={(e) => setFormData({ ...formData, delivery_partner: e.target.value, delivery_id: '', delivery_name: '' })}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="delivery_partner">
                                    <FormControlLabel value="DELHIVERY" control={<Radio />} label="Delivery" />
                                    <FormControlLabel value="OTHERS" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </FormControl>
                            {delivery_partner == "OTHERS" &&
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <TextField
                                        type="text"
                                        sx={{
                                            mt: 2
                                        }}
                                        fullWidth
                                        name="delivery_id"
                                        label="Delivery Id"
                                        onChange={handleChange}
                                        value={delivery_id || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />
                                    <TextField
                                        type="text"
                                        fullWidth
                                        sx={{
                                            mt: 2
                                        }}
                                        name="delivery_name"
                                        label="Delivery Name"
                                        onChange={handleChange}
                                        value={delivery_name || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />
                                </Box>
                            }
                        </>
                    }
                    {order_status == "Return" &&
                        <>
                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                mt: 2
                            }}>
                                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1, color: '#000' }}>Payment Type</FormLabel>
                                <RadioGroup
                                    row
                                    value={return_type ?? "REFUND"}
                                    onChange={(e) => setFormData({ ...formData, return_type: e.target.value })}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="return_type">
                                    <FormControlLabel value="REFUND" control={<Radio />} label="Refund" />
                                    <FormControlLabel value="CREDIT" control={<Radio />} label="Credit" />
                                </RadioGroup>
                            </FormControl>
                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                            }}>
                                <TextField
                                    type="text"
                                    sx={{
                                        mt: 2
                                    }}
                                    fullWidth
                                    name="delivery_id"
                                    label="Delivery Id"
                                    onChange={handleChange}
                                    value={delivery_id || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                                <TextField
                                    type="text"
                                    fullWidth
                                    sx={{
                                        mt: 2
                                    }}
                                    name="delivery_name"
                                    label="Delivery Name"
                                    onChange={handleChange}
                                    value={delivery_name || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />

                                {
                                    (return_type == "CREDIT") && (
                                        <TextField
                                            type="text"
                                            fullWidth
                                            sx={{
                                                mt: 2
                                            }}
                                            name="credit_amount"
                                            label="Credit Amount"
                                            onChange={handleChange}
                                            value={formData?.credit_amount || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                            error={errors?.credit_amount}
                                        />
                                    )
                                }


                            </Box>
                        </>
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    loading={loading}
                    loadingPosition="center"
                    onClick={() => {
                        setLoading(true);
                        handeSubmit();
                    }}
                    sx={{
                        background: 'none', color: '#232a45', boxShadow: 'none',
                        "&:hover": {
                            background: 'none', color: '#232a45', boxShadow: 'none'
                        }
                    }}
                    variant="contained">
                    Save
                </LoadingButton>
            </DialogActions>
        </Dialog >
    )
}

export default StatusModel
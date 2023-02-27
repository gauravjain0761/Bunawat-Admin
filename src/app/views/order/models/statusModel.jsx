import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Icon, InputLabel, MenuItem, Select, Typography } from '@mui/material'
import { pdf } from '@react-pdf/renderer';
import { API_URL } from 'app/constant/api'
import { ApiDelete, ApiPost, ApiPut } from 'app/service/api'
import InvoicesDocument from 'app/views/order/invoicePDF/Invoice';
import { toast } from 'material-react-toastify';
import React, { useEffect, useState } from 'react'
import PackingSlipDocument from '../invoicePDF/packingSlip';

const StatusModel = ({ open, selectedeData, getData, handleClose }) => {
    const [formData, setFormData] = useState({
        order_status: selectedeData?.order_status
    });

    useEffect(() => {
        setFormData({
            order_status: selectedeData?.order_status
        })
    }, [selectedeData])


    const generatePdfDocument = async (data = {}) => {
        let payload = [];
        const blobIInvoices = await pdf((
            <InvoicesDocument data={data} isPackingSlip={false} />
        )).toBlob()
        let readerInvoices = new FileReader();
        readerInvoices.readAsDataURL(blobIInvoices);
        readerInvoices.onloadend = async function () {
            const base64 = readerInvoices.result;
            payload.push({
                type: "invoice",
                base64
            })
            const blobPackingSlip = await pdf((
                <PackingSlipDocument data={data} isPackingSlip={true} />
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
                    })
                    .catch((error) => {
                        console.log("Error", error);
                    });
            }
        }
    };

    const handeSubmit = async () => {
        await ApiPut(`${API_URL.editOrder}/${selectedeData?._id}`, formData)
            .then(async (response) => {
                if (formData?.order_status == "Shipped") {
                    generatePdfDocument(response?.data ?? {})
                } else {
                    if (getData) getData()
                    handleClose()
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }


    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };


    const {
        order_status
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
                            <MenuItem value="Pending">Pending payment</MenuItem>
                            <MenuItem value="Processing">Processing</MenuItem>
                            <MenuItem value="Confirmed">Confirmed</MenuItem>
                            <MenuItem value="Shipped">Shipped</MenuItem>
                            <MenuItem value="Return">Return</MenuItem>
                            <MenuItem value="Cancelled">Cancelled</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handeSubmit} >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default StatusModel
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import { API_URL } from 'app/constant/api';
import { ApiPut } from 'app/service/api';
import React, { useEffect, useState } from 'react'
import { toast } from 'material-react-toastify';
import { LoadingButton } from '@mui/lab';

const MoveQTYModel = ({ open, handleClose, data, selectedSKU, getData }) => {
    const [formData, setFormData] = useState(data ?? {});
    const [loading, setLoading] = useState(false);
    const [SKUData, setSKUData] = useState(selectedSKU);

    useEffect(() => {
        setFormData(data ?? {})
    }, [data])
    useEffect(() => {
        setSKUData(selectedSKU?.map(x => x?.sku) ?? {})
    }, [selectedSKU])

    const handleSubmit = async () => {
        setLoading(true)
        await ApiPut(`${API_URL.editSKU}`, [{
            "inStock_lead": 0,
            "inStock_qty": formData?.inStock_qty,
            "mapVariant": formData?.mapVariant,
            "preOrder_lead": formData?.preOrder_lead,
            "preOrder_qty": formData?.preOrder_qty,
            "threshold": formData?.threshold,
            "_id": formData?._id,
        }])
            .then((response) => {
                setLoading(false)
                getData()
                toast.success('Edit Successfully!')
            })
            .catch((error) => {
                setLoading(false)
                toast.error(error?.error)
                console.log("Error", error);
            });
    }

    const handleChange = (event) => {
        const onlyNums = event.target.value.replace(/[^0-9]/g, '');
        setFormData({ ...formData, [event.target.name]: onlyNums });
    };

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title" >
            <DialogTitle id="responsive-dialog-title">
                Edit
            </DialogTitle>
            <DialogContent>
                {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>Product Name: &nbsp;</Typography>
                    <Typography>{data?.name}</Typography>
                </Box> */}
                <TextField
                    type="text"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="inStock_qty"
                    label="In Stock QTY"
                    onChange={handleChange}
                    // value={row.instock || ""}
                    value={formData?.inStock_qty || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <TextField
                    type="text"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="threshold"
                    label="Threshold QTY"
                    onChange={handleChange}
                    value={formData?.threshold || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                {/* <TextField
                    type="text"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="inStock_lead"
                    label="In Stock Lead Time"
                    onChange={handleChange}
                    value={formData?.inStock_lead || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                /> */}
                <TextField
                    type="text"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="preOrder_qty"
                    label="Preorder QTY"
                    onChange={handleChange}
                    value={formData.preOrder_qty || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <TextField
                    type="text"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="preOrder_lead"
                    label="Preorder Lead Time"
                    onChange={handleChange}
                    value={formData?.preOrder_lead || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <Autocomplete
                    multiple={true}
                    id="tags-outlined"
                    sx={{ mt: 2, }}
                    value={formData?.mapVariant ?? []}
                    onChange={(e, newValue) => {
                        setFormData({ ...formData, mapVariant: newValue });
                    }}
                    options={SKUData?.filter(x => x != data?.sku) ?? []}
                    getOptionLabel={(option) => option}
                    filterSelectedOptions
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label='Mapped Variant List'
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    Cancel
                </Button>
                <LoadingButton
                    loading={loading}
                    loadingPosition="center"
                    onClick={handleSubmit}
                    // sx={{
                    //     background: '#1976d2', ml: 2, color: '#fff',
                    //     "&:hover": {
                    //         background: '#1976d2', color: '#fff'
                    //     }
                    // }}
                    variant="contained">
                    Save
                </LoadingButton>
            </DialogActions>
        </Dialog>
    )
}

export default MoveQTYModel
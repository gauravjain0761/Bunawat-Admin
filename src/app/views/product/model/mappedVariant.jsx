import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiDelete, ApiGet } from 'app/service/api'
import { toast } from 'material-react-toastify';
import React, { useEffect } from 'react'
import { useState } from 'react';

const MappedVariantModel = ({ open, handleClose, formData, SKUData, selectedSKU, selectedSKUIndex, setFormData }) => {
    const [data, setData] = useState(SKUData);
    useEffect(() => {
        // setData(SKUData?.filter(x => ((x?.sku != selectedSKU?.sku) && (x?.varients?.color == selectedSKU?.varients?.color))))
        setData(SKUData?.filter(x => x?.sku != selectedSKU?.sku))
    }, [selectedSKU])

    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                Mapped Variant
            </DialogTitle>
            <DialogContent>
                <Autocomplete
                    multiple={true}
                    id="tags-outlined"
                    sx={{ mt: 2, }}
                    value={formData?.sku_data?.[selectedSKUIndex]?.mapVariant ?? []}
                    onChange={(e, newValue) => {
                        let tempSKU = [...formData?.sku_data] ?? []
                        tempSKU[selectedSKUIndex] = { ...tempSKU[selectedSKUIndex], mapVariant: newValue }
                        setFormData({ ...formData, sku_data: tempSKU });
                    }}
                    options={data}
                    getOptionLabel={(option) => option?.sku}
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
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                <Button onClick={handleClose}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MappedVariantModel
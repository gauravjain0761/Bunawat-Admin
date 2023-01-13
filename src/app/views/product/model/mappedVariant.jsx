import { LoadingButton } from '@mui/lab';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Icon, TextField } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiDelete, ApiGet } from 'app/service/api'
import { toast } from 'material-react-toastify';
import React, { useEffect } from 'react'
import { useState } from 'react';

const MappedVariantModel = ({ open, handleClose, formData, SKUData, selectedSKU, setFormData }) => {
    const [data, setData] = useState(SKUData);

    useEffect(() => {
        setData(SKUData?.filter(x => x?.name != selectedSKU?.sku))
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
                    // value={}
                    // onChange={(e, newValue)=>{

                    // }}
                    options={data}
                    getOptionLabel={(option) => option?.name}
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
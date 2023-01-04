import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
import React from 'react'

const MoveQTYModel = ({ open, handleClose, data }) => {
    return (
        <Dialog
            open={open}
            fullWidth
            maxWidth="sm"
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                Edit
            </DialogTitle>
            <DialogContent>
                {/* <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>Product Name: &nbsp;</Typography>
                    <Typography>{data?.name}</Typography>
                </Box> */}
                <TextField
                    type="number"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="instock"
                    label="In Stock QTY"
                    // onChange={handleChange}
                    // value={row.instock || ""}
                    defaultValue={data.instock || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <TextField
                    type="number"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="threshold"
                    label="Threshold QTY"
                    // onChange={handleChange}
                    // value={row.instock || ""}
                    defaultValue={data.threshold || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <TextField
                    type="number"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="instock_leadtime"
                    label="In Stock Lead Time"
                    // onChange={handleChange}
                    // value={row.instock || ""}
                    defaultValue={""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <TextField
                    type="number"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="preorder"
                    label="Preorder QTY"
                    // onChange={handleChange}
                    // value={row.instock || ""}
                    defaultValue={data.preorder || ""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <TextField
                    type="number"
                    fullWidth
                    sx={{ mt: 2, }}
                    name="preorder_leadtime"
                    label="Preorder Lead Time"
                    // onChange={handleChange}
                    // value={row.instock || ""}
                    defaultValue={""}
                    validators={["required"]}
                    errorMessages={["this field is required"]}
                />
                <Autocomplete
                    multiple={true}
                    id="tags-outlined"
                    sx={{ mt: 2, }}
                    options={['ABCD12', 'XYZ67']}
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
                <Button onClick={handleClose} autoFocus>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default MoveQTYModel
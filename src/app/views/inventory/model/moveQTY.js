import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
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
                Map QTY
            </DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>Product Name: &nbsp;</Typography>
                    <Typography>{data?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>In Stoke: &nbsp;</Typography>
                    <Typography>{data?.instock}</Typography>
                </Box>
                <FormControl fullWidth sx={{ mt: 2, }}>
                    <InputLabel id="demo-simple-select-label">Variant List</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="taxType"
                        label="Variant List">
                        <MenuItem value="Standard">ABCD</MenuItem>
                        <MenuItem value="6%">PQRS</MenuItem>
                    </Select>
                </FormControl>
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
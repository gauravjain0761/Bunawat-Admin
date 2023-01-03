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
                Move QTY
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
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>Shop: &nbsp;</Typography>
                    <Typography>{data?.shop}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 700 }}>Pre order: &nbsp;</Typography>
                    <Typography>{data?.preorder}</Typography>
                </Box>
                <FormControl fullWidth sx={{ my: 2, }}>
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
                <TextField
                    id="qty"
                    label="Qty"
                    type="number"
                    fullWidth
                    variant="standard"
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
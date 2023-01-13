import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiDelete } from 'app/service/api'
import { toast } from 'material-react-toastify';
import React from 'react'

const DeleteAllModel = ({ open, handleClose }) => {

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                Are You Sure Do You want to delete?
            </DialogTitle>
            {/* <DialogContent>
                <DialogContentText>
                Are You Sure Do You want to delete?
                </DialogContentText>
            </DialogContent> */}
            <DialogActions>
                <Button autoFocus onClick={handleClose}>
                    No
                </Button>
                <Button onClick={handleClose} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteAllModel
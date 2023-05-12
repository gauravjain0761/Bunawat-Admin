import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiPut } from 'app/service/api'
import { toast } from 'material-react-toastify';
import React from 'react'

const DeleteCollectionModel = ({ open, deleteData, getData, handleClose }) => {

    const handleDelete = async () => {
        await ApiPut(`${API_URL.deleteCollaction}/${deleteData?._id}`, {})
            .then((response) => {
                toast.success('Delete Successfully!')
                if (getData) getData()
                handleClose()
            })
            .catch((error) => {
                toast.error(error?.error)
                console.log("Error", error);
            });
    }

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
                <Button onClick={handleDelete} autoFocus>
                    Yes
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default DeleteCollectionModel
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiDelete } from 'app/service/api'
import React from 'react'

const DeleteModel = ({ open, deleteData, getData, type, handleClose }) => {

    const getURL = (role) => {
        if (role == 'Customer') {
            return API_URL.deleteCustomers
        }
        if (role == 'influencer') {
            return API_URL.deleteInfluencers
        }
        if (role == 'Reseller') {
            return API_URL.deleteResllers
        }
    }

    const handleDelete = async () => {
        await ApiDelete(`${getURL(type)}/${deleteData?._id}`)
            .then((response) => {
                getData(type)
                handleClose()
            })
            .catch((error) => {
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

export default DeleteModel
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { API_URL } from 'app/constant/api'
import { ApiDelete } from 'app/service/api'
import { toast } from 'material-react-toastify';
import React from 'react'

const DeleteAllModel = ({ open, deleteData, getData, handleClose, type }) => {
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
        if (role == 'parent_cateogry') {
            return API_URL.deleteParentCategory
        }
        if (role == 'sub_category') {
            return API_URL.deleteParentSubCategory
        }
        if (role == 'category') {
            return API_URL.deleteCategory
        }
        if (role == 'collection') {
            return API_URL.deleteCollection
        }
        if (role == 'attribute') {
            return API_URL.deleteAttribute
        }
        if (role == 'product') {
            return API_URL.deleteProduct
        }
        if (role == 'coupon') {
            return API_URL.deleteCoupon
        }
    }

    const handleDelete = async () => {
        await ApiDelete(`${getURL(type)}`, {
            ids: deleteData
        })
            .then((response) => {
                toast.success('Delete Successfully!')
                if (getData) getData(type)
                handleClose()
            })
            .catch((error) => {
                toast.error(error?.error)
                console.log("Error", error);
                handleClose();
            });
    }
    return (
        <Dialog
            open={open}
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

export default DeleteAllModel
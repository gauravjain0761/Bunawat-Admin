import { Box, Button, Stack, styled } from '@mui/material';
import { API_URL } from 'app/constant/api';
import { ApiPost, ApiPut } from 'app/service/api';
import { toast } from 'material-react-toastify';
import * as React from 'react';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "0px",
}));

const DiscountInput = ({ setFormData, userID, formData, discountType, discount_coupon, setDiscountApply, discountApply }) => {

    const handleApplyCoupon = async () => {
        let payload = {
            user: userID,
            value: "",
            type: discountType,
            items: formData?.items ?? []
        }
        if (payload?.type === "MANUAL") {
            payload = { ...payload, value: discountApply }
        } else {
            payload = { ...payload, value: formData?.discount_coupon }
        }
        console.log("payload", payload)
        if (payload?.items?.length > 0) {
            await ApiPost(`${API_URL.couponApply}`, payload).then((response) => {
                toast.success("Coupon Applied!")
                setFormData({ ...formData, coupenData: response?.data, coupon_id: response?.coupon_id })
            }).catch((error) => {
                console.log("Error", error);
                toast.error(error?.error)
            });
        } else {
            toast.error("First Select Product!")
        }
    }

    const handleCancleCoupon = async () => {
        setFormData({ ...formData, coupenData: [], discount_coupon: '', coupon_id: undefined })
    }

    return (
        <React.Fragment>
            <Box>
                <Stack direction="row" spacing={2} width="100%">
                    <Box sx={{ width: "100%" }}>
                        {discountType === "MANUAL" ?
                            <TextField
                                fullWidth
                                type="text"
                                label="Discount Amount"
                                onChange={(event) => {
                                    if (/^\d+$/.test(event.target.value)) {
                                        setDiscountApply(Number(event.target.value));
                                    } else {
                                        setDiscountApply("");
                                    }
                                }}
                                value={discountApply || ""}
                            />
                            :
                            <TextField
                                fullWidth
                                type="text"
                                label="Coupon Code"
                                onChange={(event) => {
                                    setFormData({ ...formData, discount_coupon: event.target.value })
                                }}
                                value={formData?.discount_coupon || ""}
                            />
                        }
                    </Box>
                    <Box>
                        {(formData?.coupenData && formData?.coupenData?.length > 0) ?
                            <Button onClick={handleCancleCoupon} sx={{ height: "100%", width: "100px" }} color="error" variant="contained">
                                Cancle
                            </Button>
                            :
                            <Button onClick={handleApplyCoupon} sx={{ height: "100%", width: "100px" }} color="primary" variant="contained">
                                Apply
                            </Button>
                        }
                    </Box>
                </Stack>
            </Box>

        </React.Fragment>
    )
}

export default DiscountInput
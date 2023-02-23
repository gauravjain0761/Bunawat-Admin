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

const DiscountInput = ({ setFormData, userID, formData, discountType, discountApply }) => {

    const handleApplyCoupon = async () => {
        let payload = {
            user: userID,
            value: "",
            type: discountType,
            items: formData?.items ?? []
        }
        if (payload?.type === "MANUAL") {
            payload = { ...payload, value: discountApply }
            if ((formData?.items?.length > 0 && (formData?.coupenData && formData?.coupenData?.length > 0) ? formData?.coupenData?.reduce((t, x) => t + Number(x?.final_amount), 0) ?? 0 : (formData?.items?.reduce((t, x) => t + Number(x?.amount), 0)) ?? 0) >= Number(formData?.coupenDataManual ?? 0)) {
                toast.success("Coupon Applied!")
                setFormData({ ...formData, coupenDataManualApply: true })
            } else {
                toast.error("Amount is too high!");
            }
        } else {
            payload = { ...payload, value: formData?.discount_coupon }
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
        console.log("payload", payload)

    }

    const handleCancleCoupon = async () => {
        setFormData({ ...formData, coupenData: [], discount_coupon: '', coupon_id: undefined, coupenDataManualApply: false, coupenDataManual: "" })
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
                                        setFormData({ ...formData, coupenDataManual: Number(event.target.value), coupenDataManualApply: false })
                                    } else {
                                        setFormData({ ...formData, coupenDataManual: "", coupenDataManualApply: false })
                                    }
                                }}
                                value={formData?.coupenDataManual ?? ""}
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
                        {((formData?.coupenData && formData?.coupenData?.length > 0) || (formData?.coupenDataManualApply ?? false)) ?
                            <Button onClick={handleCancleCoupon} sx={{ height: "100%", width: "130px" }} color="error" variant="contained">
                                Remove Code
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
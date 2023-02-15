import { Box, Button, Stack, styled } from '@mui/material';
import * as React from 'react';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "0px",
}));

const DiscountInput = ({ setFormData, formData, discountType, discount_coupon, setDiscountApply, discountApply }) => {

    const ApplyDiscountCoupon = () => {

        setFormData({
            ...formData, discount_amount: discountApply
        })

    }
    return (
        <React.Fragment>
            {discountType === "MANUAL" ?
                <Box>
                    <Stack direction="row" spacing={2} width="100%">
                        <Box sx={{ width: "100%" }}>
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
                        </Box>
                        <Box>
                            <Button onClick={() => ApplyDiscountCoupon()} sx={{ height: "100%", width: "100px" }} color="primary" variant="contained">
                                Apply
                            </Button>
                        </Box>
                    </Stack>
                </Box>
                :
                <form>
                    <Stack direction="row" spacing={2} width="100%">
                        <Box sx={{ width: "100%" }}>
                            <TextField
                                fullWidth
                                type="text"
                                label="Coupon Code"
                                onChange={(event) => {
                                    setFormData({ ...formData, discount_coupon: event.target.value })
                                }}
                                value={formData?.discount_coupon || ""}
                            />
                        </Box>
                        <Box>
                            <Button sx={{ height: "100%", width: "100px" }} color="primary" variant="contained">
                                Apply
                            </Button>
                        </Box>
                    </Stack>
                </form>
            }

        </React.Fragment>
    )
}

export default DiscountInput
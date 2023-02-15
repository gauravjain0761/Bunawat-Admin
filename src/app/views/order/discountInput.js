import { Box, Button, Stack, styled } from '@mui/material';
import * as React from 'react';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "0px",
}));

const DiscountInput = ({ setFormData, formData, discountType, coupon }) => {
    return (
        <React.Fragment>
            {discountType === "MANUAL" ?
                <TextField
                    fullWidth
                    type="text"
                    label="Discount"
                    onChange={(event) => {
                        if (/^\d+$/.test(event.target.value)) {
                            setFormData({ ...formData, discount_amount: Number(event.target.value) });
                        } else {
                            setFormData({ ...formData, discount_amount: "" });
                        }
                    }}
                    value={formData?.discount_amount || ""}
                />
                :
                <form>
                    <Stack direction="row" spacing={2} width="100%">
                        <Box sx={{ width: "100%" }}>
                            <TextField
                                fullWidth
                                type="text"
                                label="Coupon"
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
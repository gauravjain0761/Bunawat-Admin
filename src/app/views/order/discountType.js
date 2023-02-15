import { Stack, Typography } from '@mui/material'
import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import DiscountInput from './discountInput';

const DiscountType = (props) => {
    const { title, radioTitle, discountType, setDiscountType, formData, setFormData, discount_coupon } = props;

    const handleChange = (event) => {
        setDiscountType(event.target.value);
        setFormData({ ...formData, discount_amount: "" });
    };
    console.log("discountsetFormData", formData)
    return (
        <React.Fragment>
            <Stack spacing={1} width="100%">
                <Typography variant="h6">{title}</Typography>
                <FormControl>
                    <FormLabel id="demo-row-radio-buttons-group-label">{radioTitle}</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-row-radio-buttons-group-label"
                        name="discountType"
                        value={discountType}
                        onChange={handleChange}
                    >
                        <FormControlLabel value="COUPON" control={<Radio />} label="Coupon" />
                        <FormControlLabel value="MANUAL" control={<Radio />} label="Manual" />
                    </RadioGroup>
                </FormControl>
                <DiscountInput
                    formData={formData}
                    setFormData={setFormData}
                    discountType={discountType}
                    discount_coupon={discount_coupon}
                />
            </Stack>
        </React.Fragment>
    )
}

export default DiscountType
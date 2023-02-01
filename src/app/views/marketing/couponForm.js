import { CheckBox } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    styled,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import TextEditor from "app/components/textEditor";
import { Span } from "app/components/Typography";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const CouponForm = ({ data = {} }) => {
    const [formData, setFormData] = useState(data);
    // for input box show state
    const [showDiscountType, setShowDiscountType] = useState(false);
    const [showApplyOn, setShowApplyOn] = useState('');

    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        setFormData(data)
    }, [data])


    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
        navigate(`/coupons/list`)
    };

    const handleChange = (event) => {
        if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const {
        discountTypeValue,
        code,
        applyOnValue,
        minimumOrderAmount,
        maximumOrderAmount,
        limit,
        value,
        startDate,
        endDate
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="Add Coupon" backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                        
                                <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Discount Type</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel value="percentage" control={<Radio />} label="Percentage" onClick={() => setShowDiscountType(true)} />
                                    <FormControlLabel value="fixed_price" control={<Radio />} label="Fixed Price" onClick={() => setShowDiscountType(true)} />
                                </RadioGroup>
                                </FormControl>
                            {showDiscountType && 
                              <TextField
                                type="number"
                                name="discountTypeValue"
                                label="Discount Type Value"
                                onChange={handleChange}
                                value={discountTypeValue || ""}
                            />
                            }
                            
                            <TextField
                                type="text"
                                name="code"
                                label="Coupon Code"
                                onChange={handleChange}
                                value={code || ""}
                            />

                            
                                <FormControl>
                                <FormLabel id="demo-row-radio-buttons-group-label">Apply On</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                >
                                    <FormControlLabel value="all" control={<Radio />} label="All" onClick={() => setShowApplyOn('all')} />
                                    <FormControlLabel value="category" control={<Radio />} label="Category" onClick={() => setShowApplyOn('category')} />
                                    <FormControlLabel value="collection" control={<Radio />} label="Collection" onClick={() => setShowApplyOn('collection')} />
                                </RadioGroup>
                                </FormControl>
                            {showApplyOn === 'all' &&
                              <TextField
                                type="text"
                                name="applyOn"
                                label="Apply On"
                                onChange={handleChange}
                                value={applyOnValue || ""}
                            />
                            }
                            {showApplyOn === 'category' && 
                             <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={applyOnValue}
                                label="Category"
                                onChange={handleChange}
                                >
                                <MenuItem value={10}>Category 1</MenuItem>
                                <MenuItem value={20}>Category 2</MenuItem>
                                <MenuItem value={30}>Category 3</MenuItem>
                                </Select>
                            </FormControl>
                            }
                            {showApplyOn === 'collection' && 
                             <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={applyOnValue}
                                label="Category"
                                onChange={handleChange}
                                >
                                <MenuItem value={10}>Collection 1</MenuItem>
                                <MenuItem value={20}>Collection 2</MenuItem>
                                <MenuItem value={30}>Collection 3</MenuItem>
                                </Select>
                            </FormControl>
                            }

                            <Grid container spacing={1} mt={1}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        type="text"
                                        name="minimumOrderAmount"
                                        label="Minimum Order Amount"
                                        onChange={handleChange}
                                        value={minimumOrderAmount || ""}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        type="text"
                                        name="maximumOrderAmount"
                                        label="Maximum Order Amount"
                                        onChange={handleChange}
                                        value={maximumOrderAmount || ""}
                                    />
                                </Grid>
                            </Grid>
                           

                            <Box sx={{ mb: 2 }}>
                                <TextEditor />
                            </Box>

                            <TextField
                                type="text"
                                name="limit"
                                label="Number of Uses"
                                onChange={handleChange}
                                value={limit || ""}
                            />

                            <Grid container spacing={1}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <DatePicker
                                            value={startDate}
                                            onChange={(date) => setFormData({ ...formData, startDate: date })}
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    label="Start Date"
                                                />
                                            )} />
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <DatePicker
                                            value={endDate}
                                            onChange={(date) => setFormData({ ...formData, endDate: date })}
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    label="End Date"
                                                />
                                            )} />
                                    </Grid>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                        <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                            <Button color="primary" variant="contained" type="button" sx={{ mr: 2, mt: 2 }} onClick={() => navigate(-1)}>
                                <Icon>arrow_back</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
                            </Button>
                            <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }}>
                                <Icon>send</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                            </Button>
                            {/* <Button color="error" variant="contained" sx={{ mr: 2, mt: 2 }}>
                                <Icon>delete</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</Span>
                            </Button> */}
                        </Box>
                        {/* <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"} >
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/wishlist")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User wishlist</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/cart/details")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User Cart Details</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/payment/history")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User payment history</Span>
                            </Button>
                        </Box> */}
                    </Box>
                </SimpleCard>

            </ValidatorForm>
        </div >
    );
};

export default CouponForm;

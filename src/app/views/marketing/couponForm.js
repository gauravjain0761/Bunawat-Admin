import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    styled,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import TextEditor from "app/components/textEditor";
import { Span } from "app/components/Typography";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { DatePicker } from '@mui/lab'
import { ApiPost, ApiPut } from "app/service/api";
import { API_URL } from "app/constant/api";
import { toast } from "material-react-toastify";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const CouponForm = ({ data = {}, id }) => {
    const [formData, setFormData] = useState({
        // ...data,
        discount_type: "PERCENTAGE",
        code: "",
        min_order_amount: "",
        max_discount_amount: "",
        max_limit: "",
        discount_value: "",
        start_date: "",
        end_date: "",
    });
    const [description, setDescription] = useState("");
    const [formError, setFormError] = useState({});
    const [isErrorDescription, setIsErrorDescription] = useState(false);
    const [isErrorStartDate, setIsErrorStartDate] = useState(false);
    const [isErrorEndDate, setIsErrorEndDate] = useState(false);
    // for input box show state
    const [showApplyOn, setShowApplyOn] = useState('ALL');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();


    useEffect(() => {
        if (id && data) {
            setFormData(data);
            setDescription(data?.description)
        }
    }, [data, id])


    const handleSubmit = async (event) => {
        const { link_with, linkValue, productId, image, mediaType, ...payload } = formData
        let tempError = { ...formError }
        let tempMediaType = formData?.mediaType ?? 'image'
        if (!description) {
            setIsErrorDescription(true)
        }
        if (!start_date) {
            setIsErrorStartDate(true)
        }
        if (!end_date) {
            setIsErrorEndDate(true)
        }

        if (!!description && Object.values(tempError).every(x => !x)) {
            setLoading(true)
            if (id) {
                await ApiPut(`${API_URL.editCoupon}/${id}`, {
                    ...payload,
                    description,
                    apply_on: showApplyOn
                })
                    .then((response) => {
                        toast.success('Edit Successfully!')
                        setLoading(false)
                        navigate(`/coupons/list`);
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error(error?.error)
                        console.log("Error", error);
                    });
            } else {
                await ApiPost(`${API_URL.addCoupon}`, {
                    ...payload,
                    description,
                    apply_on: showApplyOn
                })
                    .then((response) => {
                        toast.success('Add Successfully!')
                        setLoading(false)
                        navigate(`/coupons/list`);
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast.error(error?.error)
                        console.log("Error", error);
                    });
            }
        }
        setFormError(tempError)
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
        discount_type,
        code,
        min_order_amount,
        max_discount_amount,
        max_limit,
        discount_value,
        start_date,
        end_date,
    } = formData;

    const handleError = async (event) => {
        let tempError = { ...formError }
        if (!description) {
            setIsErrorDescription(true)
        }
        if (!start_date) {
            setIsErrorStartDate(true)
        }
        if (!end_date) {
            setIsErrorEndDate(true)
        }

        setFormError(tempError)
    }

    console.log("formDataformData", formData)

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={handleError}>
                <SimpleCard title="Add Coupon" backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} >
                            <FormControl fullWidth>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="discount_type"
                                    value={discount_type}
                                    onChange={handleChange}
                                >
                                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{ marginTop: "12px", marginRight: "10px" }} >Discount Type</FormLabel>
                                    <FormControlLabel value="PERCENTAGE" control={<Radio />} label="Percentage" />
                                    <FormControlLabel value="FIXED" control={<Radio />} label="Fixed Price" />
                                </RadioGroup>
                            </FormControl>
                            <Box sx={{ mt: 1 }}>
                                <TextField
                                    type="text"
                                    name="discount_value"
                                    label="Discount Type Value"
                                    onChange={handleChange}
                                    value={discount_value || ""}
                                    sx={{
                                        marginBottom: '7px',
                                    }}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                            </Box>


                            <FormControl fullWidth sx={{ mt: 0 }}>
                                <RadioGroup
                                    row
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="row-radio-buttons-group"
                                    defaultValue={showApplyOn}
                                    value={showApplyOn}
                                >
                                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{ marginTop: "12px", marginRight: "10px" }}>Apply On</FormLabel>
                                    <FormControlLabel value="ALL" control={<Radio />} label="All" onClick={() => setShowApplyOn('ALL')} />
                                    <FormControlLabel value="CATEGORY" control={<Radio />} label="Category" onClick={() => setShowApplyOn('CATEGORY')} />
                                    <FormControlLabel value="COLLECTION" control={<Radio />} label="Collection" onClick={() => setShowApplyOn('COLLECTION')} />
                                </RadioGroup>
                            </FormControl>
                            {showApplyOn === 'CATEGORY' &&
                                <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
                                    <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={""}
                                        label="Category"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={10}>Category 1</MenuItem>
                                        <MenuItem value={20}>Category 2</MenuItem>
                                        <MenuItem value={30}>Category 3</MenuItem>
                                    </Select>
                                </FormControl>
                            }
                            {showApplyOn === 'COLLECTION' &&
                                <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
                                    <InputLabel id="demo-simple-select-label">Collection</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={""}
                                        label="Category"
                                        onChange={handleChange}
                                    >
                                        <MenuItem value={10}>Collection 1</MenuItem>
                                        <MenuItem value={20}>Collection 2</MenuItem>
                                        <MenuItem value={30}>Collection 3</MenuItem>
                                    </Select>
                                </FormControl>
                            }

                            <Box sx={{ mt: 1 }} >
                                <TextField
                                    type="text"
                                    name="code"
                                    label="Coupon Code"
                                    onChange={handleChange}
                                    value={code || ""}
                                    validators={["required"]}
                                    errorMessages={["this field is required"]}
                                />
                            </Box>


                            <Box sx={{ mb: 2 }}>
                                <TextEditor
                                    data={description} setData={(d) => {
                                        setIsErrorDescription(false)
                                        setDescription(d)
                                    }}
                                />
                                {isErrorDescription && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                            </Box>

                            <Grid container spacing={1}>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        type="text"
                                        name="min_order_amount"
                                        label="Minimum Order Amount"
                                        onChange={handleChange}
                                        value={min_order_amount || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />
                                </Grid>
                                <Grid item lg={6} md={6} sm={12} xs={12}>
                                    <TextField
                                        type="text"
                                        name="max_discount_amount"
                                        label="Maximum Discount Amount"
                                        onChange={handleChange}
                                        value={max_discount_amount || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />
                                </Grid>
                            </Grid>

                            <TextField
                                type="text"
                                name="max_limit"
                                label="Number of Uses"
                                onChange={handleChange}
                                value={max_limit || ""}
                                validators={["required"]}
                                errorMessages={["this field is required"]}
                            />

                            <Grid container spacing={1}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <DatePicker
                                            name="start_date"
                                            value={start_date || null}
                                            onChange={(date) => {
                                                setIsErrorStartDate(false)
                                                setFormData({ ...formData, start_date: date })
                                            }}
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    label="Start Date"
                                                />
                                            )}
                                        />
                                        {isErrorStartDate && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                    </Grid>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <DatePicker
                                            name="end_date"
                                            value={end_date || null}
                                            onChange={(date) => {
                                                setIsErrorEndDate(false)
                                                setFormData({ ...formData, end_date: date })
                                            }}
                                            renderInput={(props) => (
                                                <TextField
                                                    {...props}
                                                    label="End Date"
                                                />
                                            )}
                                        />
                                        {isErrorEndDate && <Typography sx={{ color: '#FF3D57', fontWeight: 400, fontSize: '0.75rem', m: '3px 14px 0px 14px' }}>this field is required</Typography>}
                                    </Grid>
                                </LocalizationProvider>
                            </Grid>
                        </Grid>

                    </Grid>
                    <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                        <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                            <Stack direction="row" spacing={2}>
                                <Box>
                                    <Button color="primary" variant="outlined" type="button" sx={{ mr: 0, mt: 2 }} onClick={() => navigate(-1)}>
                                        <Icon>arrow_back</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
                                    </Button>
                                </Box>
                                <Box>
                                    <Button color="primary" variant="contained" type="submit" sx={{ mr: 0, mt: 2 }}>
                                        <Icon>send</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                                    </Button>
                                </Box>
                            </Stack>
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

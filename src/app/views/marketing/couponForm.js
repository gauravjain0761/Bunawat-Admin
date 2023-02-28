import {
    Autocomplete,
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
import { ApiGet, ApiPost, ApiPut } from "app/service/api";
import { API_URL } from "app/constant/api";
import { toast } from "material-react-toastify";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const CouponForm = ({ data = {}, id, disabled }) => {
    const [formData, setFormData] = useState({
        discount_type: "PERCENTAGE",
        code: "",
        min_order_amount: "",
        max_discount_amount: "",
        max_limit: "",
        discount_value: "",
        start_date: "",
        end_date: "",
        ids: []
    });
    const [categoryList, setCategoryList] = useState([])
    const [collectionList, setCollectionList] = useState([])
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
            setShowApplyOn(data?.apply_on)
            setDescription(data?.description)
        }
    }, [data, id])

    const getCategoryList = async () => {
        await ApiGet(`${API_URL.getCategoryList}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    let temp = [...response?.data]
                    let categoryList = [];
                    temp = temp?.map(level1 => {
                        if (level1?.sub_categories?.length == 0) {
                            categoryList.push({
                                label: level1?.name,
                                value: level1?._id,
                            })
                        } else {
                            level1?.sub_categories?.map(level2 => {
                                if (level2?.categories?.length == 0) {
                                    categoryList.push({
                                        label: level2?.name,
                                        value: level2?._id,
                                    })
                                } else {
                                    level2?.categories?.map(level3 => {
                                        categoryList.push({
                                            label: level3?.name,
                                            value: level3?._id,
                                        })
                                    })
                                }
                            })
                        }
                    }) ?? [];
                    setCategoryList(categoryList);
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    const getCollectionList = async () => {
        await ApiGet(`${API_URL.getCollectionList}`)
            .then((response) => {
                if (response?.data?.length > 0) {
                    setCollectionList(response?.data?.map(item => ({
                        label: item?.name,
                        value: item?._id
                    })) ?? []);
                }
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        getCategoryList();
        getCollectionList();
    }, [])

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
        if (!disabled) {
            if (event.target.name == "image") {
                setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
            } else if (event.target.name == "discount_type") {
                setFormData({ ...formData, [event.target.name]: event.target.value, discount_value: "" });
            } else if (event.target.name == "discount_value") {
                const onlyNums = event.target.value.replace(/[^0-9]/g, '');
                if (formData?.discount_type == "PERCENTAGE") {
                    if (onlyNums <= 100) {
                        setFormData({ ...formData, [event.target.name]: onlyNums });
                    }
                } else {
                    setFormData({ ...formData, [event.target.name]: onlyNums });
                }
            } else if (event.target.name == "min_order_amount" || event.target.name == "max_discount_amount" || event.target.name == "max_limit") {
                const onlyNums = event.target.value.replace(/[^0-9]/g, '');
                setFormData({ ...formData, [event.target.name]: onlyNums });
            } else {
                setFormData({ ...formData, [event.target.name]: event.target.value });
            }
        }
    };

    const handleChangeApply = (type) => {
        if (!disabled) {
            setShowApplyOn(type)
            setFormData({ ...formData, ids: [] })
        }
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
                <SimpleCard title={`${disabled ? 'View' : 'Add'} Coupon`} backArrow={true}>
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
                                    <FormControlLabel value="ALL" control={<Radio />} label="All" onClick={() => handleChangeApply('ALL')} />
                                    <FormControlLabel value="CATEGORY" control={<Radio />} label="Category" onClick={() => handleChangeApply('CATEGORY')} />
                                    <FormControlLabel value="COLLECTION" control={<Radio />} label="Collection" onClick={() => handleChangeApply('COLLECTION')} />
                                </RadioGroup>
                            </FormControl>
                            {showApplyOn === 'CATEGORY' &&
                                <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
                                    <Autocomplete
                                        fullWidth
                                        sx={{
                                            '.MuiFormControl-root': {
                                                mb: 0
                                            },
                                        }}
                                        readOnly={disabled}
                                        multiple
                                        id="tags-outlined"
                                        value={formData?.ids?.map(list => categoryList?.find(item => item?.value == list))}
                                        onChange={(event, newValue) => {
                                            setFormData({ ...formData, ids: newValue?.map(list => list?.value) })
                                        }}
                                        options={categoryList}
                                        getOptionLabel={(option) => option?.label}
                                        filterSelectedOptions
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Category"
                                            />
                                        )}
                                    />
                                </FormControl>
                            }

                            {showApplyOn === 'COLLECTION' &&
                                <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
                                    <Autocomplete
                                        fullWidth
                                        sx={{
                                            '.MuiFormControl-root': {
                                                mb: 0
                                            },
                                        }}
                                        multiple
                                        readOnly={disabled}
                                        id="tags-outlined"
                                        value={formData?.ids?.map(list => collectionList?.find(item => item?.value == list))}
                                        onChange={(event, newValue) => {
                                            setFormData({ ...formData, ids: newValue?.map(list => list?.value) })
                                        }}
                                        options={collectionList}
                                        getOptionLabel={(option) => option?.label}
                                        filterSelectedOptions
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Select Collection"
                                            />
                                        )}
                                    />
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
                                    data={description} disabled={disabled} setData={(d) => {
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
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        {/* <DatePicker
                                            name="start_date"
                                            value={start_date || null}
                                            readOnly={disabled}
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
                                        />   */}
                                        <DesktopDatePicker
                                            label="Start Date"
                                            inputFormat="MM/DD/YYYY"
                                            name="start_date"
                                            value={start_date || null}
                                            minDate={new Date()}
                                            maxDate={end_date}
                                            readOnly={disabled}
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
                                        <DesktopDatePicker
                                            label="End Date"
                                            inputFormat="MM/DD/YYYY"
                                            name="end_date"
                                            minDate={start_date || new Date()}
                                            value={end_date || null}
                                            readOnly={disabled}
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
                                        {/* <DatePicker
                                            name="end_date"
                                            value={end_date || null}
                                            readOnly={disabled}
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
                                        /> */}
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
                                {!disabled ?
                                    <Box>
                                        <Button color="primary" variant="contained" type="submit" sx={{ mr: 0, mt: 2 }}>
                                            <Icon>send</Icon>
                                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                                        </Button>
                                    </Box>
                                    : null}
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

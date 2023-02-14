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
    Paper,
    Radio,
    RadioGroup,
    Select,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import TableComponent from "app/components/table";
import TextEditor from "app/components/textEditor";
import { Span } from "app/components/Typography";
import { UIColor } from "app/utils/constant";
import { toast } from 'material-react-toastify';
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import React from 'react';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ApiGet, ApiPost } from "app/service/api";
import { API_URL } from "app/constant/api";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const OrderForm = ({ data = {} }) => {
    const [formShippingData, setFormShippingData] = React.useState({
        fname: "",
        lname: "",
        email: "",
        phone: "",
        phone_secondary: "",
        address_1: "",
        address_2: "",
        city: "",
        district: "",
        pincode: "",
        state: ""
    });
    const [formData, setFormData] = useState({
        ...data,
        // user_type: 'CUSTOMER',
        billing_address: {
            fname: "",
            lname: "",
            email: "",
            phone: "",
            phone_secondary: "",
            address_1: "",
            address_2: "",
            city: "",
            district: "",
            pincode: "",
            state: ""
        },
        shipping_address: {
            fname: "",
            lname: "",
            email: "",
            phone: "",
            phone_secondary: "",
            address_1: "",
            address_2: "",
            city: "",
            district: "",
            pincode: "",
            state: ""
        },
        teamMember: "",
        reseller: "",
        product: null,
        qty: "",
        items: [],
        isSame: false,
        fname: "",
        lname: "",
        phone: "",
        phone_secondary: "",
        email: "",
        state: "",
        district: "",
        city: "",
        address_1: "",
        address_2: "",
        pincode: "",
        payment_mode: "cod",
        transactionId: "",
        image: ""

    });
    const navigate = useNavigate();
    const [customerNumber, setCustomerNumber] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    let [searchParams, setSearchParams] = useSearchParams();
    const [ProductName, setProductName] = React.useState(null);
    const [skuData, setSKUData] = React.useState(null);
    const [skuName, setSKUName] = React.useState(null);
    const [TeamData, setTeamData] = React.useState(null);
    const [TeamName, setTeamName] = React.useState(null);
    const [ResellerData, setResellerData] = React.useState(null);
    const [ResellerName, setResellerName] = React.useState(null);
    const [paymentMode, setPaymentMode] = React.useState("cod");
    const [user_type, setUserType] = React.useState("CUSTOMER")

    const {
        // user_type,
        teamMember,
        reseller,
        product,
        qty,
        items,
        billing_address,
        shipping_address,
        isSame,
        fname,
        lname,
        phone,
        phone_secondary,
        email,
        state,
        sku,
        district,
        city,
        address_1,
        address_2,
        pincode,
        payment_mode,
        transactionId,
        image
    } = formData;


    const getProductData = async (customerPhone) => {
        await ApiGet(`${API_URL.getProducts}`).then((response) => {
            if (response.status) {
                const { data } = response;
                console.log("productdata", data);
                let productData = [];
                data && data.forEach((element) => {
                    if (element.isActive) {
                        productData.push({
                            id: element?._id,
                            name: element?.name
                        })
                    }
                })
                setProducts(productData)
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    React.useEffect(() => {
        getProductData();
    }, []);

    const getTeamData = async () => {
        await ApiGet(`${API_URL.getTeams}`).then((response) => {
            if (response.status) {
                const { data } = response;
                console.log("teamData", data);
                let teamData = [];
                data && data.forEach((element) => {
                    teamData.push({
                        id: element?._id,
                        name: element?.name
                    })
                })
                setTeamData(teamData)
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    React.useEffect(() => {
        getTeamData();
    }, []);

    const getResellerData = async () => {
        await ApiGet(`${API_URL.getResllers}`).then((response) => {
            if (response.status) {
                const { data } = response;
                console.log("resellerData", data);
                let resellerData = [];
                data && data.forEach((element) => {
                    resellerData.push({
                        id: element?._id,
                        name: `${element?.fname} ${element?.lname}`
                    })
                })
                setResellerData(resellerData)
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    React.useEffect(() => {
        getResellerData();
    }, []);

    // React.useEffect(())

    const getSKUData = async (id) => {
        await ApiGet(`${API_URL.SKUGetProductID}/${id}`).then((response) => {
            if (response.status) {
                const { data } = response;
                console.log("skudata", data);
                let SKUData = [];
                data && data.forEach((element) => {
                    if (element.isActive) {
                        SKUData.push({
                            ...element,
                            id: element?._id,
                            name: element?.sku
                        })
                    }
                });
                setSKUData(SKUData)
                // setProducts(productData)
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    const getCustomerNumber = async () => {
        await ApiPost(`${API_URL.getUserNumber}`, {
            phone: customerNumber,
            user_type: user_type
        }).then((response) => {
            if (response.status) {
                const { data } = response;
                console.log("datadata", data)
                for (const [key] of Object.entries(formData)) {
                    if (key === "pincode") {
                        setFormData({ ...data, pincode: data?.pincode })
                    } else {
                        setFormData({ ...data, [key]: data[key] })
                    }
                }
                for (const [key] of Object.entries(formShippingData)) {
                    if (key === "pincode") {
                        setFormShippingData({ ...data, pincode: data?.pincode })
                    } else {
                        setFormShippingData({ ...data, [key]: data[key] })
                    }
                }
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }
    console.log("keykey12", formData)

    const columns = [
        {
            id: "product",
            label: "Product Name",
            sortDisable: true,
            width: 100
        },
        {
            id: "In Stoke QTY",
            label: "In Stoke QTY",
            align: 'center',
            sortDisable: true,
            width: 100
        },
        {
            id: "qty",
            label: "QTY",
            align: 'center',
            sortDisable: true,
            width: 100
        },
        {
            id: "Action",
            label: "Action",
            action: true,
            sortDisable: true,
            align: 'right',
            width: 80
        },
    ];
    // useEffect(() => {
    //     setFormData({ ...data, user_type: 'CUSTOMER' })
    // }, [data])




    const handleSubmit = async (event) => {
        const Address = {
            "fname": formData?.fname,
            "lname": formData?.lname,
            "email": formData?.email,
            "phone": formData?.phone,
            "phone_secondary": formData?.phone_secondary,
            "address_1": formData?.address_1,
            "address_2": formData?.address_2,
            "city": formData?.city,
            "district": formData?.district,
            "pincode": formData?.pincode,
            "state": formData?.state
        }
        const formDatas = {
            "member": formData?.teamMember,
            "user_type": user_type,
            "user": "63d12454d25d498f72165513",
            "billing_address": Address,
            "shipping_address": formShippingData,
            "isSame": formData?.isSame || false,
            "payment_mode": paymentMode.toUpperCase(),
            "total_items": formData?.items?.length,
            "total_qty": formData?.items?.reduce((t, x) => t + Number(x?.qty), 0) ?? 0,
            "total_amount": formData?.items?.reduce((t, x) => t + Number(x?.amount), 0) ?? 0,
            "items": formData?.items,
            "gst_amount": 0,
            "discount_amount": 0,
            "discount_coupon": null
        }
        await ApiPost(`${API_URL.addOrder}`, formDatas).then((response) => {
            if (response.status) {
                console.log("handleSubmit", response.data);
                toast.success('Add Successfully!')
                navigate(`/order/list`)
            }
        }).catch((error) => {
            console.log("Error", error);
            toast.error(error?.error)
        });
    };

    const handleChange = (event) => {
        if (event.target.name == "isSame") {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
        } else if (event.target.name == "phone" || event.target.name == "qty") {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length < 10) {
                setFormData({ ...formData, [event.target.name]: onlyNums });
            } else if (onlyNums.length === 10) {
                const number = onlyNums.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    '($1) $2-$3'
                );
                setFormData({ ...formData, [event.target.name]: onlyNums });
            }
        } else if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleShippingChange = (event) => {
        if (event.target.name == "isSame") {
            setFormShippingData({ ...formShippingData, [event.target.name]: event.target.checked });
        } else if (event.target.name == "phone" || event.target.name == "qty") {
            const onlyNums = event.target.value.replace(/[^0-9]/g, '');
            if (onlyNums.length < 10) {
                setFormShippingData({ ...formShippingData, [event.target.name]: onlyNums });
            } else if (onlyNums.length === 10) {
                const number = onlyNums.replace(
                    /(\d{3})(\d{3})(\d{4})/,
                    '($1) $2-$3'
                );
                setFormShippingData({ ...formShippingData, [event.target.name]: onlyNums });
            }
        } else if (event.target.name == "image") {
            setFormShippingData({ ...formShippingData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormShippingData({ ...formShippingData, [event.target.name]: event.target.value });
        }
    };



    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const addProductToCart = () => {
        if (Number(qty) <= Number(skuName?.inStock_qty)) {
            let temp = formData?.items ?? [];
            let sku = skuName?.name;
            let sku_id = skuName?.id;
            let price = Number(skuName?.sale_price);
            let productname = ProductName?.name;
            let qtys = Number(qty) || 1;
            let amount = Number(qtys) * Number(skuName?.sale_price);
            temp = [...temp, {
                productname: productname,
                qty: qtys,
                price: price,
                product: product,
                sku_id: sku_id,
                sku: sku,
                amount: amount
            }]
            setFormData({ ...formData, items: temp, product: '', qty: '' });
            setSKUName(null)
        } else {
            toast.error("Please add valid quantity")
        }
    }

    const handleDeleteProduct = (index) => {
        let temp = formData?.items ?? [];
        temp = temp.filter((data, i) => i != index)
        setFormData({ ...formData, items: temp, product: '', qty: '' });
    }

    React.useEffect(() => {
        if (customerNumber && customerNumber.length === 10) {
            getCustomerNumber(customerNumber)
        }
    }, [customerNumber, user_type]);


    // React.useEffect(() => {
    //     if (formData?.isSame) {
    //         setFormShippingData({
    //             fname: fname,
    //             lname: lname,
    //             email: email,
    //             phone: phone,
    //             phone_secondary: phone_secondary,
    //             address_1: address_1,
    //             address_2: address_2,
    //             city: city,
    //             district: district,
    //             pincode: pincode,
    //             state: state
    //         })
    //     } else {
    //         setFormShippingData({
    //             fname: "",
    //             lname: "",
    //             email: "",
    //             phone: "",
    //             phone_secondary: "",
    //             address_1: "",
    //             address_2: "",
    //             city: "",
    //             district: "",
    //             pincode: "",
    //             state: ""
    //         })
    //     }
    // }, [formData?.isSame]);

    console.log("datadataformData", formShippingData)


    console.log("customerPhoneformData", items)

    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <Box sx={{ m: '30px', mt: 0 }}>
                    <Grid container spacing={2}>
                        <Grid item lg={6} md={12} sm={12} xs={12} >
                            <SimpleCard title="Order" backArrow={false}>
                                <Grid container spacing={12}>
                                    <Grid item lg={12} md={12} sm={12} xs={12} >
                                        <FormControl sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            alignItems: 'center'
                                        }}>
                                            <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>User Type</FormLabel>
                                            <RadioGroup
                                                row
                                                value={user_type ?? "CUSTOMER"}
                                                onChange={(e) => setUserType(e.target.value)}
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="user_type">
                                                <FormControlLabel value="CUSTOMER" control={<Radio />} label="Customer" />
                                                <FormControlLabel value="RESELLER" control={<Radio />} label="Reseller" />
                                            </RadioGroup>
                                        </FormControl>

                                        <Box sx={{ mt: 1 }}>
                                            <TextField
                                                fullWidth
                                                type="text"
                                                label="Customer Phone"
                                                onChange={(event) => {
                                                    console.log("event.target", event.target)
                                                    if (/^\d+$/.test(event.target.value)) {
                                                        setCustomerNumber(event.target.value);
                                                    } else {
                                                        setCustomerNumber("");
                                                    }
                                                }}
                                                inputProps={{ maxLength: 10 }}
                                                value={customerNumber || ""}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />
                                        </Box>

                                        {user_type === 'CUSTOMER' &&
                                            <Autocomplete
                                                fullWidth
                                                sx={{ mt: 2 }}
                                                multiple={false}
                                                id="tags-outlined"
                                                value={TeamName}
                                                name="teamMember"
                                                onChange={(event, newValue) => {
                                                    setTeamName(newValue);
                                                    setFormData({ ...formData, teamMember: newValue.id });
                                                }}
                                                options={TeamData}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Team Member"
                                                        placeholder="Select Team Member"
                                                    />
                                                )}
                                            />
                                        }

                                        {user_type === 'RESELLER' &&
                                            <Autocomplete
                                                fullWidth
                                                sx={{ mt: 2 }}
                                                multiple={false}
                                                id="tags-outlined"
                                                value={ResellerName}
                                                name="reseller"
                                                onChange={(event, newValue) => {
                                                    setResellerName(newValue);
                                                    setFormData({ ...formData, reseller: newValue.id });
                                                }}
                                                options={ResellerData}
                                                getOptionLabel={(option) => option.name}
                                                getOptionValue={(option) => option.id}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Reseller"
                                                        placeholder="Select Reseller"
                                                    />
                                                )}
                                            />
                                        }

                                        <Autocomplete
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            multiple={false}
                                            id="tags-outlined"
                                            value={ProductName}
                                            onChange={(event, newValue) => {
                                                setProductName(newValue);
                                                setFormData({ ...formData, product: newValue.id });
                                                getSKUData(newValue.id);
                                            }}
                                            options={products}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Product"
                                                    placeholder="Select Product"
                                                />
                                            )}
                                        />

                                        {product && <Autocomplete
                                            fullWidth
                                            sx={{ mt: 2 }}
                                            multiple={false}
                                            id="tags-outlined"
                                            value={skuName}
                                            onChange={(event, newValue) => {
                                                setSKUName(newValue);
                                                setFormData({ ...formData, sku: newValue.id });
                                            }}
                                            options={skuData}
                                            getOptionLabel={(option) => option.name}
                                            getOptionValue={(option) => option.id}
                                            filterSelectedOptions
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="SKU"
                                                    placeholder="Select SKU"
                                                />
                                            )}
                                        />}

                                        {/* {product && 
                                    <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 700 }}>Product Name: &nbsp;</Typography>
                                    <Typography>{product}</Typography>
                                    </Box>
                                    
                                    </Box>
                                } */}


                                        {skuName &&
                                            <Box>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: '100%' }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="center">Price</TableCell>
                                                                <TableCell align="center">In Stock QTY</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell align="center" component="th" scope="row">{skuName?.sale_price}</TableCell>
                                                                <TableCell align="center" component="th" scope="row">{skuName?.inStock_qty}</TableCell>
                                                            </TableRow>
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box sx={{ flex: 1 }}>
                                                        <TextField
                                                            type="text"
                                                            name="qty"
                                                            sx={{ mt: 2 }}
                                                            label="QTY"
                                                            onChange={handleChange}
                                                            value={qty || ""}
                                                        />
                                                    </Box>
                                                    <Button color="primary" variant="contained" type="button" sx={{ width: { lg: "150px", md: '100px' }, height: '53px', ml: 2 }} onClick={addProductToCart}>
                                                        <Icon>add</Icon>
                                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add</Span>
                                                    </Button>
                                                </Box>
                                            </Box>
                                        }



                                        {items?.length > 0 &&
                                            items?.map((data, index) => {
                                                return (
                                                    <Box>
                                                        <Box sx={{ mt: 1, background: UIColor, color: '#fff', p: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <Typography sx={{ fontWeight: 700 }}>{data?.productname}</Typography>
                                                            <Icon onClick={() => handleDeleteProduct(index)} sx={{
                                                                color: "#fff",
                                                                cursor: "pointer",
                                                            }}>delete</Icon>
                                                        </Box>
                                                        <Table sx={{ minWidth: '100%', border: '1px solid' }} aria-label="simple table">
                                                            <TableHead>
                                                                <TableRow sx={{ border: 'none' }}>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>DesignNo/SKU</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>{data?.sku}</Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>QTY</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>
                                                                                <TextField
                                                                                    className="numberRemove"
                                                                                    sx={{
                                                                                        border: 'none',
                                                                                        px: '5px',
                                                                                        '&.MuiFormControl-root': {
                                                                                            m: 0,
                                                                                            mb: 0
                                                                                        },
                                                                                        'input': {
                                                                                            p: 0,
                                                                                            textAlign: 'center'
                                                                                        },
                                                                                        'fieldset': {
                                                                                            border: 'none',
                                                                                        },
                                                                                    }}
                                                                                    type="text"
                                                                                    defaultValue={data?.qty}
                                                                                    name={`qty`}
                                                                                />
                                                                            </Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow sx={{ border: 'none' }}>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>Price</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>{data?.price}</Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                    <TableCell sx={{ border: '1px solid' }} align="left">
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: { sm: 'column', xs: 'column' } }}>
                                                                            <Typography sx={{ fontWeight: 700 }}>Total Amount</Typography>
                                                                            <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}>{data?.amount}</Typography>
                                                                        </Box>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                        </Table>
                                                        {/* <Box sx={{ border: '0.5px solid' }}>
                                                                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: { sm: 'row', xs: 'column' }, flexWrap: 'wrap', p: '5px' }}>
                                                                        <Box sx={{ flex: 2 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                                <Typography sx={{ fontWeight: 700 }}>Price&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Typography>
                                                                                <Typography sx={{ fontWeight: 700 }}>:&nbsp; 1000</Typography>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                                                                                <Typography sx={{ fontWeight: 700, color: 'red' }}>Total Amt.&nbsp;&nbsp;</Typography>
                                                                                <Typography sx={{ fontWeight: 700, color: 'red' }}>:&nbsp; {1000 * data?.qty}</Typography>
                                                                            </Box>
                                                                        </Box>
                                                                        <Box sx={{ flex: 2 }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start', whiteSpace: 'nowrap' }}>
                                                                                <Typography sx={{ fontWeight: 700 }}>QTY&nbsp; :&nbsp;</Typography>
                                                                                <Typography sx={{ fontWeight: 700 }}>
                                                                                    <input defaultValue={data?.qty} type="text" name="qty" style={{ width: '100%' }} />
                                                                                </Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </Box>
                                                                </Box> */}
                                                    </Box>
                                                )
                                            })}
                                    </Grid>
                                </Grid>
                            </SimpleCard>
                        </Grid>
                        <Grid item lg={6} md={12} sm={12} xs={12} >
                            <SimpleCard title="Order Detail" backArrow={false}>
                                <Typography variant="h6">Billing Address</Typography>
                                <Grid container spacing={{ md: 1, sm: 0, xs: 0 }} sx={{ mt: 2 }}>
                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
                                        <TextField
                                            type="text"
                                            name="fname"
                                            label="First Name"
                                            onChange={handleChange}
                                            value={fname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="lname"
                                            label="Last Name"
                                            onChange={handleChange}
                                            value={lname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="email"
                                            name="email"
                                            label="Email"
                                            value={email || ""}
                                            onChange={handleChange}
                                            validators={["required", "isEmail"]}
                                            errorMessages={["this field is required", "email is not valid"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="phone"
                                            label="Phone Nubmer"
                                            onChange={handleChange}
                                            value={phone || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />

                                        <TextField
                                            name="pincode"
                                            type="pincode"
                                            label="Post Code"
                                            value={pincode || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            type="text"
                                            name="phone_secondary"
                                            label="Alternate Phone Nubmer"
                                            onChange={handleChange}
                                            inputProps={{ maxLength: 10 }}
                                            value={phone_secondary || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
                                        <TextField
                                            type="text"
                                            name="state"
                                            value={state || ""}
                                            label="State"
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="district"
                                            type="text"
                                            label="District"
                                            value={district || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="city"
                                            type="text"
                                            label="City"
                                            value={city || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="address_1"
                                            type="text"
                                            label="Address - 1"
                                            value={address_1 || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="address_2"
                                            type="text"
                                            label="Address - 2"
                                            value={address_2 || ""}
                                            onChange={handleChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                    </Grid>
                                </Grid>

                                <Box display='flex' alignItems='center'>
                                    <Typography variant="h6">Shipping Address </Typography>
                                    <FormControl sx={{ flexDirection: 'row', alignItems: 'center', ml: 2 }} component="div" variant="standard">
                                        <FormGroup>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox checked={isSame} onChange={handleChange} name="isSame" />
                                                }
                                                label="Same as Above"
                                            />
                                        </FormGroup>
                                    </FormControl>
                                </Box>
                                {!formData?.isSame && <Grid container spacing={{ md: 1, sm: 0, xs: 0 }} sx={{ mt: 2 }}>
                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <TextField
                                            type="text"
                                            name="fname"
                                            label="First Name"
                                            onChange={handleShippingChange}
                                            value={formShippingData.fname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="lname"
                                            label="Last Name"
                                            onChange={handleShippingChange}
                                            value={formShippingData.lname || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="email"
                                            name="email"
                                            label="Email"
                                            value={formShippingData.email || ""}
                                            onChange={handleShippingChange}
                                            validators={["required", "isEmail"]}
                                            errorMessages={["this field is required", "email is not valid"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="phone"
                                            label="Phone Nubmer"
                                            onChange={handleShippingChange}
                                            value={formShippingData.phone || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />

                                        <TextField
                                            name="text"
                                            type="pincode"
                                            label="Post Code"
                                            value={formShippingData.pincode || ""}
                                            onChange={handleShippingChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />

                                        <TextField
                                            type="text"
                                            name="phone_secondary"
                                            label="Alternate Phone Nubmer"
                                            inputProps={{ maxLength: 10 }}
                                            onChange={handleShippingChange}
                                            value={formShippingData.phone_secondary || ""}
                                            validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                        />
                                    </Grid>

                                    <Grid item lg={6} md={6} sm={12} xs={12}>
                                        <TextField
                                            type="text"
                                            name="state"
                                            value={formShippingData.state || ""}
                                            label="State"
                                            onChange={handleShippingChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="district"
                                            type="text"
                                            label="District"
                                            value={formShippingData.district || ""}
                                            onChange={handleShippingChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="city"
                                            type="text"
                                            label="City"
                                            value={formShippingData.city || ""}
                                            onChange={handleShippingChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="address_1"
                                            type="text"
                                            label="Address - 1"
                                            value={formShippingData.address_1 || ""}
                                            onChange={handleShippingChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        <TextField
                                            name="text"
                                            type="address_2"
                                            label="Address - 2"
                                            value={formShippingData.address_2 || ""}
                                            onChange={handleShippingChange}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                    </Grid>
                                </Grid>}

                                <Typography variant="h6">Payment Info</Typography>
                                <FormControl sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    alignItems: 'center'
                                }}>
                                    <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>Payment Type</FormLabel>
                                    <RadioGroup
                                        row
                                        value={paymentMode ?? "cod"}
                                        onChange={(e) => setPaymentMode(e.target.value)}
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                    // name="paymentMode"
                                    >
                                        <FormControlLabel value="cod" control={<Radio />} label="COD" />
                                        <FormControlLabel value="online" control={<Radio />} label="Online" />
                                        <FormControlLabel value="credits" control={<Radio />} label="Credits" />
                                        <FormControlLabel value="partialCredits" control={<Radio />} label="Partial Credits" />
                                    </RadioGroup>
                                </FormControl>
                                {payment_mode == 'online' &&
                                    <>
                                        <TextField
                                            type="text"
                                            name="transactionId"
                                            label="Transaction Id"
                                            onChange={handleChange}
                                            value={transactionId || ""}
                                            validators={["required"]}
                                            errorMessages={["this field is required"]}
                                        />
                                        {image ?
                                            <Box
                                                sx={{
                                                    width: "150px",
                                                    height: "170px",
                                                    margin: "10px 10px 0 0",
                                                    position: "relative"
                                                }}>
                                                <img src={image} width="100%" height="90%" />
                                                <Box sx={{ height: "10%" }} display="flex" alignItems="center" justifyContent="end">
                                                    <Icon onClick={() => handleDeleteImage()} sx={{
                                                        color: "red",
                                                        cursor: "pointer",
                                                    }}>delete</Icon> <Span onClick={() => handleDeleteImage()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                                </Box>
                                            </Box>
                                            :
                                            <Button
                                                variant="contained"
                                                component="label"
                                                sx={{
                                                    width: "150px",
                                                    height: "150px",
                                                    background: "transparent",
                                                    color: "#000",
                                                    border: "2px dashed",
                                                    margin: "10px 10px 0 0",

                                                    "&:hover": {
                                                        background: "transparent",
                                                    }
                                                }} >
                                                <Icon>add</Icon>
                                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Upload File</Span>
                                                <input
                                                    type="file"
                                                    name="image"
                                                    accept="image/png, image/gif, image/jpeg"
                                                    hidden
                                                    onClick={(event) => { event.target.value = '' }}
                                                    onChange={handleChange} />
                                            </Button>
                                        }
                                    </>
                                }
                            </SimpleCard>
                        </Grid>
                    </Grid>
                </Box >
                {items?.length > 0 && <Box sx={{
                    width: '100%', height: '80px', background: '#fff',
                    position: 'sticky',
                    zIndex: 999,
                    bottom: 0,
                    boxShadow: '0 -8px 16px 0 rgb(85 93 102 / 30%)'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: { sm: 'row', xs: 'column' }, ml: 3, gap: { sm: '10px', xs: '0px' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Typography sx={{ fontWeight: 700 }}>Total Items</Typography>
                                <Typography sx={{ fontWeight: 500 }}>:&nbsp; {items?.length ?? 0}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Typography sx={{ fontWeight: 700 }}>Total QTY</Typography>
                                <Typography sx={{ fontWeight: 500 }}>:&nbsp; {items?.length > 0 && <> {items?.reduce((t, x) => t + Number(x?.qty), 0) ?? 0}</>}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                <Typography sx={{ fontWeight: 700, color: 'red' }}>Total Amount</Typography>
                                <Typography sx={{ fontWeight: 500, color: 'red' }}>:
                                    {items?.length > 0 && <> {items?.reduce((t, x) => t + Number(x?.amount), 0) ?? 0}</>}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{
                            mr: 3
                        }}>
                            <Button onClick={() => navigate(-1)} sx={{ border: '1px solid #232a45', color: '#232a45', display: { sm: 'initial', xs: 'none' } }}>
                                Back
                            </Button>
                            <Button type="submit" sx={{
                                background: '#232a45', ml: 2, color: '#fff',
                                "&:hover": {
                                    background: '#232a45', color: '#fff'
                                }
                            }}>
                                Save
                            </Button>
                        </Box>
                    </Box>
                </Box>
                }
            </ValidatorForm>
        </Box >
    );
};

export default OrderForm;

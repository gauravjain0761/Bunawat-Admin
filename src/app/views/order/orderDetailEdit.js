import { CheckBox } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Divider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Icon,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Radio,
    RadioGroup,
    Select,
    Stack,
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
import React from 'react';
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ApiGet, ApiPost, ApiPut } from "app/service/api";
import { API_URL } from "app/constant/api";
import DiscountType from "./discountType";
import { sumBy } from "lodash";
import { DEFULT_STATE } from "app/constant/constant";
import { Country, State, City } from "country-state-city";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const OrderDetailEdit = ({ data = {} }) => {
    const { id } = useParams();
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
        state: null,
        country: null,
        country_code: null
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
            state: null,
            country: null,
            country_code: null,
            gstNo: ""
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
            state: null,
            country: null,
            country_code: null
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
        state: null,
        country: null,
        country_code: null,
        district: "",
        city: "",
        address_1: "",
        address_2: "",
        pincode: "",
        payment_mode: "cod",
        transactionId: "",
        image: "",
        user: "",
        discount_coupon: "",
    });
    const navigate = useNavigate();
    const [customerNumber, setCustomerNumber] = React.useState("");
    const [products, setProducts] = React.useState([]);
    const [ProductName, setProductName] = React.useState(null);
    const [skuData, setSKUData] = React.useState(null);
    const [skuName, setSKUName] = React.useState(null);
    const [TeamData, setTeamData] = React.useState(null);
    const [TeamName, setTeamName] = React.useState(null);
    const [ResellerData, setResellerData] = React.useState(null);
    const [ResellerName, setResellerName] = React.useState(null);
    const [paymentMode, setPaymentMode] = React.useState("cod");
    const [onlineData, setOnlineData] = React.useState({});
    const [mediaLoading, setMediaLoading] = useState(false);
    const [user_type, setUserType] = React.useState("CUSTOMER");
    const [userID, setUserID] = React.useState("")
    const [discountType, setDiscountType] = React.useState("COUPON");
    const [discountApply, setDiscountApply] = React.useState("");
    const {
        product,
        qty,
        items,
        coupenData,
        isSame,
        fname,
        lname,
        phone,
        phone_secondary,
        email,
        state,
        district,
        city,
        address_1,
        address_2,
        pincode,
        gst_mode,
        gst_number,
        coupenDataManual,
        coupenDataManualApply,
        discount_coupon,
        country,
        country_code,
        gst_available,
        gst_num,
        gstNo,
        shipping_charge,
        other_charge
    } = formData;

    const getCustomerNumber = async (itemData) => {
        await ApiPost(`${API_URL.getUserNumber}`, {
            phone: itemData?.user?.phone,
            user_type: itemData?.user?.user_type
        }).then((response) => {
            let finalData = { ...formData }
            if (response.status) {
                const { data } = response;
                setUserID(data?._id)
                setFormShippingData(itemData?.shipping_address)
                setUserType(itemData?.user?.user_type)
                setCustomerNumber(itemData?.user?.phone)
                setPaymentMode(itemData?.payment_mode?.toLowerCase())
                setTeamName(itemData?.member)
                finalData = { ...finalData, ...itemData?.billing_address, teamMember: itemData?.member, items: itemData?.items, product: '', qty: '', coupenData: [], discount_coupon: '', coupon_id: undefined, coupenDataManualApply: false, coupenDataManual: "", gst_available: !!itemData?.billing_address?.gstNo ? "yes" : "no", gst_num: itemData?.gst_num, shipping_charge: itemData?.shipping_charge, other_charge: itemData?.other_charge }
                setFormData(finalData);
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    const getOrederData = async (id) => {
        await ApiGet(`${API_URL.getOrder}/${id}`).then((response) => {
            getCustomerNumber(response?.data)
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    React.useEffect(() => {
        if (id) getOrederData(id);
    }, [id]);

    const getProductData = async () => {
        await ApiGet(`${API_URL.getProducts}`).then((response) => {
            if (response.status) {
                const { data } = response;
                let productData = [];
                data && data.forEach((element) => {
                    if (element.status === "ACTIVE" || element.status === "INQUALITY") {
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

    const getSKUData = async (id) => {
        await ApiGet(`${API_URL.SKUGetProductID}/${id}`).then((response) => {
            if (response.status) {
                const { data } = response;
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
                setSKUName(null);
                setSKUData(SKUData)
                // setProducts(productData)
            }
        }).catch((error) => {
            console.log("Error", error);
        });
    }

    const coutinLogicWithCoupon = (arr, ship = 0, other = 0) => {
        const totalAmount = (arr?.reduce((t, x) => t + ((Number(x?.price) > 1000) ? ((Number(x?.final_amount) * 100) / 112) : ((Number(x?.final_amount) * 100) / 105)), 0)) ?? 0
        const gstAmount = arr?.reduce((t, x) => t + ((Number(x?.price) > 1000) ?
            (Number(x?.final_amount) - ((Number(x?.final_amount) * 100) / 112))
            :
            (Number(x?.final_amount) - ((Number(x?.final_amount) * 100) / 105))), 0)

        const checkCodPR = arr?.some((x) => (Number(x?.price) > 1000))
        const shippingGSTCharge = ((ship * 100) / (checkCodPR ? 112 : 105))
        const otherGSTCharge = ((other * 100) / (checkCodPR ? 112 : 105))

        const shippingGSTExtraCharge = (ship - ((ship * 100) / (checkCodPR ? 112 : 105)))
        const otherGSTExtraCharge = (other - ((other * 100) / (checkCodPR ? 112 : 105)))

        if (paymentMode == "cod") {
            const codData = ((arr?.reduce((t, x) => t + Number(x?.final_amount), 0) * 2) / 100) ?? 0
            const finalCOD = ((codData >= 150) ? codData : 150)
            const codGST = (finalCOD - ((finalCOD * 100) / (checkCodPR ? 112 : 105)))
            const finalGSTCod = (finalCOD - codGST)
            const finalTotal = ((totalAmount + finalGSTCod) + (shippingGSTCharge + otherGSTCharge))
            const finalGST = ((gstAmount + codGST) + (shippingGSTExtraCharge + otherGSTExtraCharge))
            return {
                total: (finalTotal + finalGST)?.toFixed(2),
                subTotal: finalTotal?.toFixed(2),
                codData: finalGSTCod?.toFixed(2),
                gst_amount: finalGST?.toFixed(2)
            }
        } else {
            const finalGST = (gstAmount + shippingGSTExtraCharge + otherGSTExtraCharge)
            const finalTotal = (totalAmount + shippingGSTCharge + otherGSTCharge)
            return {
                total: (finalTotal + finalGST)?.toFixed(2),
                subTotal: finalTotal?.toFixed(2),
                codData: 0,
                gst_amount: finalGST?.toFixed(2)
            }
        }
    }

    const coutinLogicWithoutCoupon = (arr, ship = 0, other = 0) => {
        const totalAmount = (arr?.reduce((t, x) => t + ((Number(x?.price) > 1000) ? ((Number(x?.amount) * 100) / 112) : ((Number(x?.amount) * 100) / 105)), 0)) ?? 0
        const checkCodPR = arr?.some((x) => (Number(x?.price) > 1000))
        const shippingGSTCharge = ((ship * 100) / (checkCodPR ? 112 : 105))
        const otherGSTCharge = ((other * 100) / (checkCodPR ? 112 : 105))

        const shippingGSTExtraCharge = (ship - ((ship * 100) / (checkCodPR ? 112 : 105)))
        const otherGSTExtraCharge = (other - ((other * 100) / (checkCodPR ? 112 : 105)))

        const gstAmount = arr?.reduce((t, x) => t + ((Number(x?.price) > 1000) ?
            (Number(x?.amount) - ((Number(x?.amount) * 100) / 112))
            :
            (Number(x?.amount) - ((Number(x?.amount) * 100) / 105))), 0)
        if (paymentMode == "cod") {
            const codData = ((arr?.reduce((t, x) => t + Number(x?.amount), 0) * 2) / 100) ?? 0
            const finalCOD = ((codData >= 150) ? codData : 150)
            const codGST = (finalCOD - ((finalCOD * 100) / (checkCodPR ? 112 : 105)))
            const finalGSTCod = (finalCOD - codGST)
            const finalTotal = ((totalAmount + finalGSTCod) + (shippingGSTCharge + otherGSTCharge))
            const finalGST = ((gstAmount + codGST) + (shippingGSTExtraCharge + otherGSTExtraCharge))
            return {
                total: (finalTotal + finalGST)?.toFixed(2),
                subTotal: finalTotal?.toFixed(2),
                codData: finalGSTCod?.toFixed(2),
                gst_amount: finalGST?.toFixed(2)
            }
        } else {
            const finalGST = (gstAmount + shippingGSTExtraCharge + otherGSTExtraCharge)
            const finalTotal = (totalAmount + shippingGSTCharge + otherGSTCharge)
            return {
                total: (finalTotal + finalGST)?.toFixed(2),
                subTotal: finalTotal?.toFixed(2),
                codData: 0,
                gst_amount: finalGST?.toFixed(2)
            }
        }
    }

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
            "state": formData?.state,
            "gstNo": formData?.gstNo
        }
        const formDatas = {
            "member": formData?.teamMember,
            "user_type": user_type,
            "user": userID,
            "remark": formData?.remark,
            "transaction_id": paymentMode == "cod" ? "" : onlineData?.transaction_id,
            "transaction_doc": paymentMode == "cod" ? null : onlineData?.transaction_doc,
            "billing_address": Address,
            "shipping_address": formShippingData,
            "isSame": formData?.isSame || false,
            "payment_mode": paymentMode.toUpperCase(),
            "total_items": formData?.items?.length,
            "total_qty": formData?.items?.reduce((t, x) => t + Number(x?.qty), 0) ?? 0,
            "total_amount": (Number(formData?.items?.length > 0 && (formData?.coupenData && formData?.coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, formData?.shipping_charge, formData?.other_charge)?.total : coutinLogicWithoutCoupon(items, formData?.shipping_charge, formData?.other_charge)?.total)),
            "items": (formData?.coupenData && formData?.coupenData?.length > 0) ? formData?.coupenData?.filter(x => x?.qty ?? 0 > 0) : formData?.items?.filter(x => x?.qty ?? 0 > 0),
            "gst_amount": (formData?.items?.length > 0 && (formData?.coupenData && formData?.coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, formData?.shipping_charge, formData?.other_charge)?.gst_amount : coutinLogicWithoutCoupon(items, formData?.shipping_charge, formData?.other_charge)?.gst_amount),
            "cgst_amount": formData?.state == DEFULT_STATE ? (((formData?.items?.length > 0 && (formData?.coupenData && formData?.coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, formData?.shipping_charge, formData?.other_charge)?.gst_amount : coutinLogicWithoutCoupon(items, formData?.shipping_charge, formData?.other_charges)?.gst_amount)) / 2) : 0,
            "sgst_amount": formData?.state == DEFULT_STATE ? (((formData?.items?.length > 0 && (formData?.coupenData && formData?.coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, formData?.shipping_charge, formData?.other_charge)?.gst_amount : coutinLogicWithoutCoupon(items, formData?.shipping_charge, formData?.other_charge)?.gst_amount)) / 2) : 0,
            "igst_amount": formData?.state == DEFULT_STATE ? 0 : (formData?.items?.length > 0 && (formData?.coupenData && formData?.coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, formData?.shipping_charge, formData?.other_charge)?.gst_amount : coutinLogicWithoutCoupon(items, formData?.shipping_charge, formData?.other_charge)?.gst_amount),
            "discount_amount": (formData?.coupenDataManualApply ? (Number(formData?.coupenDataManual ?? 0)) : (formData?.items?.length > 0 && (formData?.coupenData && formData?.coupenData?.length > 0) ? formData?.coupenData?.reduce((t, x) => t + Number(x?.discounted_amount ?? 0), 0) ?? 0 : 0))?.toFixed(2),
            "discount_coupon": formData?.coupon_id,
            shipping_charge: formData?.shipping_charge ?? 0,
            other_charge: formData?.other_charge ?? 0
        }
        console.log("formDatasformDatas", formDatas)
        // if (formDatas?.items?.length > 0) {
        //     await ApiPut(`${API_URL.editOrder}/${id}`, formDatas).then((response) => {
        //         if (response.status) {
        //             toast.success('Add Successfully!')
        //             navigate(`/order/list`)
        //         }
        //     }).catch((error) => {
        //         console.log("Error", error);
        //         toast.error(error?.error)
        //     });
        // } else {
        //     toast.error("Please select product with qty First!")
        // }
    };


    const handleImageUpload = async (event) => {
        const MAX_FILE_SIZE = 30720 // 30MB
        const fileSizeKiloBytes = event?.target?.files?.[0]?.size / 1024
        if (fileSizeKiloBytes > MAX_FILE_SIZE) {
            // setFormError({ ...formError, image: true })
        } else {
            setMediaLoading(true)
            let imageData = new FormData();
            imageData.append('file', event.target.files[0]);
            await ApiPost(API_URL.fileUploadOrderDocs, imageData)
                .then((response) => {
                    if (response?.data) {
                        setOnlineData({ ...onlineData, [event.target.name]: response?.data && response?.data[0]?.Location })
                        setMediaLoading(false)
                    }
                })
                .catch((error) => {
                    console.log("Error", error);
                    setMediaLoading(false)
                });
        }
    }

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
        } else if (event.target.name == "transaction_doc") {
            handleImageUpload(event)
        } else if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleShippingChange = (event) => {
        if (event.target.name == "isSame") {
            setFormShippingData({ ...formShippingData, [event.target.name]: event.target.checked });
        } else if (event.target.name == "phone" || event.target.name == "phone_secondary" || event.target.name == "qty") {
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

    const handleDeleteImage = async () => {
        setMediaLoading(true)
        await ApiPost(API_URL.fileRemove, {
            url: onlineData?.transaction_doc,
            type: "order_docs"
        })
            .then((response) => {
                if (response?.data) {
                    setOnlineData({ ...onlineData, transaction_doc: null })
                    setMediaLoading(false)
                }
            })
            .catch((error) => {
                setMediaLoading(false)
                console.log("Error", error);
            });
    };

    const addProductToCart = () => {
        if ((Number(qty) <= Number(skuName?.inStock_qty)) && Number(qty ?? 0) != 0) {
            let temp = formData?.items ?? [];
            let sku = skuName?.name;
            let sku_id = skuName?.id;
            let price = Number(skuName?.sale_price) ?? 1;
            let productname = ProductName?.name;
            let qtys = Number(qty) ?? 0;
            let amount = Number(qtys) * Number(skuName?.sale_price);
            if (temp?.some(list => list?.sku_id == sku_id)) {
                let findIndex = temp?.findIndex(list => list?.sku_id == sku_id)
                let findQty = temp?.find(list => list?.sku_id == sku_id)?.qty
                if ((Number(findQty ?? 0) + Number(qtys)) <= Number(skuName?.inStock_qty)) {
                    temp[findIndex] = {
                        ...temp[findIndex],
                        productname: productname,
                        qty: Number(findQty ?? 0) + Number(qtys),
                        price: price,
                        inStock_qty: skuName?.inStock_qty,
                        product: product,
                        sku_id: sku_id,
                        sku: sku,
                        amount: (Number(findQty ?? 0) + Number(qtys)) * price
                    }
                    setFormData({ ...formData, items: temp, product: '', qty: '', coupenData: [], discount_coupon: '', coupon_id: undefined, coupenDataManualApply: false, coupenDataManual: "" });
                    setSKUName(null)
                    setProductName(null)
                } else {
                    toast.error("Please add valid quantity")
                }
            } else {
                temp = [...temp, {
                    productname: productname,
                    qty: qtys,
                    price: price,
                    inStock_qty: skuName?.inStock_qty,
                    product: product,
                    sku_id: sku_id,
                    sku: sku,
                    amount: amount
                }]
                setFormData({ ...formData, items: temp, product: '', qty: '', coupenData: [], discount_coupon: '', coupon_id: undefined, coupenDataManualApply: false, coupenDataManual: "" });
                setSKUName(null)
                setProductName(null)
            }
        } else {
            toast.error("Please add valid quantity")
        }
    }

    const handleDeleteProduct = (index) => {
        let temp = formData?.items ?? [];
        temp = temp.filter((data, i) => i != index)
        setFormData({ ...formData, items: temp, product: '', qty: '' });
    }

    const handleQTYChange = (e, index) => {
        const onlyNums = e.target.value.replace(/[^0-9]/g, '');
        let temp = formData?.items ?? [];
        let qtys = Number(onlyNums ?? 0);
        let amount = Number(qtys) * Number(temp[index]?.price);
        if ((Number(onlyNums) <= Number(temp[index]?.inStock_qty)) || (Number(onlyNums) < 0)) {
            temp[index] = { ...temp[index], qty: qtys, amount }
            setFormData({ ...formData, items: temp, coupenData: [], coupon_id: undefined, coupenDataManualApply: false, coupenDataManual: "" });
        } else {
            toast.error(`${temp[index]?.inStock_qty} InStock qty`)
        }
    }

    return (
        <Box>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <Box sx={{ m: '30px', mt: 0 }}>
                    <Grid container spacing={2}>
                        <Grid item lg={userID ? 6 : 12} md={12} sm={12} xs={12} >
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
                                                onChange={(e) => {
                                                    if (!id) setUserType(e.target.value)
                                                }}
                                                aria-labelledby="demo-row-radio-buttons-group-label"
                                                name="user_type">
                                                <FormControlLabel value="CUSTOMER" control={<Radio />} label="Customer" />
                                                <FormControlLabel value="RESELLER" control={<Radio />} label="Reseller" />
                                            </RadioGroup>
                                        </FormControl>

                                        <Box sx={{ mt: 1 }}>
                                            <TextField
                                                fullWidth
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                type="text"
                                                label={`${user_type === 'CUSTOMER' ? "Customer" : "Reseller"} Phone`}
                                                onChange={(event) => {
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
                                        {userID &&
                                            <>
                                                {user_type === 'CUSTOMER' &&
                                                    <Autocomplete
                                                        fullWidth
                                                        sx={{ mt: 2 }}
                                                        value={TeamData?.find(x => x?.id == TeamName) ?? null}
                                                        name="teamMember"
                                                        onChange={(event, newValue) => {
                                                            setTeamName(newValue?.id);
                                                            setFormData({ ...formData, teamMember: newValue?.id });
                                                        }}
                                                        options={TeamData ?? []}
                                                        getOptionLabel={(option) => option.name}
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
                                                        setFormData({ ...formData, product: newValue.id, sku: "" });
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
                                                        setFormData({ ...formData, sku: newValue?.id });
                                                    }}
                                                    options={skuData}
                                                    getOptionLabel={(option) => option?.name}
                                                    getOptionValue={(option) => option?.id}
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
                                                    (coupenData && coupenData?.length > 0) ?
                                                    coupenData?.map((data, index) => {
                                                        return (
                                                            <Box>
                                                                <Box sx={{ mt: 1, background: UIColor, color: '#fff', p: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Typography sx={{ fontWeight: 700 }}>{data?.productname ?? data?.product_name}</Typography>
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
                                                                                        {/* <TextField
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
                                                                                            value={data?.qty}
                                                                                            onChange={(e) => handleQTYChange(e, index)}
                                                                                            name="qty"
                                                                                        /> */}
                                                                                        {data?.qty}
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
                                                                                    <Typography sx={{ width: '100%', borderTop: '1px solid', px: '5px', textAlign: 'center' }}><s>{data?.amount}</s> {data?.final_amount}</Typography>
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
                                                    })
                                                    :
                                                    items?.map((data, index) => {
                                                        return (
                                                            <Box>
                                                                <Box sx={{ mt: 1, background: UIColor, color: '#fff', p: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                                    <Typography sx={{ fontWeight: 700 }}>{data?.productname ?? data?.product_name}</Typography>
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
                                                                                        {/* <TextField
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
                                                                                            value={data?.qty}
                                                                                            onChange={(e) => handleQTYChange(e, index)}
                                                                                            name="qty"
                                                                                        /> */}
                                                                                        {data?.qty}
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
                                                    })
                                                }
                                            </>
                                        }
                                    </Grid>
                                </Grid>
                            </SimpleCard>
                        </Grid>
                        {userID &&
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
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />

                                            <TextField
                                                type="text"
                                                name="lname"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Last Name"
                                                onChange={handleChange}
                                                value={lname || ""}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />

                                            <TextField
                                                type="email"
                                                name="email"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Email"
                                                value={email || ""}
                                                onChange={handleChange}
                                                validators={["required", "isEmail"]}
                                                errorMessages={["this field is required", "email is not valid"]}
                                            />

                                            <TextField
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                name="phone"
                                                label="Phone Nubmer"
                                                onChange={handleChange}
                                                value={phone || ""}
                                                validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                                errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                            />

                                            <TextField
                                                name="pincode"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                type="pincode"
                                                label="Post Code"
                                                value={pincode || ""}
                                                onChange={handleChange}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />
                                            <TextField
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                name="phone_secondary"
                                                label="Alternate Phone Nubmer"
                                                onChange={handleChange}
                                                inputProps={{ maxLength: 10 }}
                                                value={phone_secondary || ""}
                                            // validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                            // errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                            />
                                        </Grid>

                                        <Grid item lg={6} md={6} sm={12} xs={12} sx={{ mt: 0 }}>
                                            <Autocomplete
                                                fullWidth
                                                multiple={false}
                                                readOnly={!!id}
                                                value={Country.getAllCountries()?.find(x => x?.name == country) ?? null}
                                                name="country"
                                                onChange={(event, newValue) => {
                                                    setFormData({ ...formData, country: newValue?.name, country_code: newValue?.isoCode, state: null });
                                                }}
                                                options={Country.getAllCountries() ?? []}
                                                getOptionLabel={(option) => option?.name}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Country"
                                                    />
                                                )}
                                            />
                                            <Autocomplete
                                                fullWidth
                                                multiple={false}
                                                readOnly={!!id}
                                                value={state ?? null}
                                                name="state"
                                                onChange={(event, newValue) => {
                                                    setFormData({ ...formData, state: newValue });
                                                }}
                                                options={State?.getStatesOfCountry(country_code)?.map(x => x?.name)}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="State"
                                                    />
                                                )}
                                            />

                                            <TextField
                                                name="district"
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="District"
                                                value={district || ""}
                                                onChange={handleChange}
                                            />
                                            <TextField
                                                name="city"
                                                type="text"
                                                label="City"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                value={city || ""}
                                                onChange={handleChange}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />
                                            <TextField
                                                name="address_1"
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Address - 1"
                                                value={address_1 || ""}
                                                onChange={handleChange}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />
                                            <TextField
                                                name="address_2"
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Address - 2"
                                                value={address_2 || ""}
                                                onChange={handleChange}
                                            />

                                            <FormControl sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                marginTop: '-8px',
                                                gap: 2,
                                                height: '69px'
                                            }}>
                                                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ width: "100px" }}>GST Available</FormLabel>
                                                <RadioGroup
                                                    row
                                                    value={gst_available ?? "no"}
                                                    onChange={(e) => {
                                                        if (!id) setFormData({ ...formData, gst_available: e.target.value })
                                                    }}
                                                    aria-labelledby="demo-row-radio-buttons-group-label">
                                                    <Grid container>
                                                        <Grid item lg={12}>
                                                            <Stack direction="row" spacing={1}>
                                                                <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                                                                <FormControlLabel value="no" control={<Radio />} label="No" />
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </RadioGroup>
                                            </FormControl>

                                            {gst_available == "yes" ?
                                                <Grid item lg={12}>
                                                    <TextField
                                                        name="gstNo"
                                                        type="text"
                                                        InputProps={{
                                                            readOnly: !!id,
                                                        }}
                                                        label="GST Number"
                                                        onChange={handleChange}
                                                        value={gstNo || ""}
                                                        validators={["required"]}
                                                        errorMessages={["this field is required"]}
                                                    />
                                                </Grid>
                                                : null}
                                        </Grid>
                                    </Grid>

                                    {!formData?.isSame && <Grid container spacing={{ md: 1, sm: 0, xs: 0 }} sx={{ mt: 2 }}>
                                        <Grid item lg={6} md={6} sm={12} xs={12}>
                                            <TextField
                                                type="text"
                                                name="fname"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="First Name"
                                                onChange={handleShippingChange}
                                                value={formShippingData.fname || ""}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />

                                            <TextField
                                                type="text"
                                                name="lname"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Last Name"
                                                onChange={handleShippingChange}
                                                value={formShippingData.lname || ""}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />

                                            <TextField
                                                type="email"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                name="email"
                                                label="Email"
                                                value={formShippingData.email || ""}
                                                onChange={handleShippingChange}
                                                validators={["required", "isEmail"]}
                                                errorMessages={["this field is required", "email is not valid"]}
                                            />

                                            <TextField
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                name="phone"
                                                label="Phone Nubmer"
                                                onChange={handleShippingChange}
                                                value={formShippingData.phone || ""}
                                                validators={["required", "minStringLength:10", "maxStringLength: 10"]}
                                                errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                            />

                                            <TextField
                                                name="pincode"
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Post Code"
                                                value={formShippingData.pincode || ""}
                                                onChange={handleShippingChange}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />

                                            <TextField
                                                type="text"
                                                name="phone_secondary"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Alternate Phone Nubmer"
                                                inputProps={{ maxLength: 10 }}
                                                onChange={handleShippingChange}
                                                value={formShippingData.phone_secondary || ""}
                                            // validators={["minStringLength:10", "maxStringLength: 10"]}
                                            // errorMessages={["this field is required", "Enter valid number", "Enter valid number"]}
                                            />
                                        </Grid>

                                        <Grid item lg={6} md={6} sm={12} xs={12}>

                                            <Autocomplete
                                                fullWidth
                                                multiple={false}
                                                readOnly={!!id}
                                                value={Country.getAllCountries()?.find(x => x?.name == formShippingData?.country) ?? null}
                                                name="country"
                                                onChange={(event, newValue) => {
                                                    setFormShippingData({ ...formShippingData, country: newValue?.name, country_code: newValue?.isoCode, state: null });
                                                }}
                                                options={Country.getAllCountries() ?? []}
                                                getOptionLabel={(option) => option?.name}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Country"
                                                    />
                                                )}
                                            />

                                            <Autocomplete
                                                fullWidth
                                                multiple={false}
                                                readOnly={!!id}
                                                value={formShippingData.state ?? null}
                                                name="state"
                                                onChange={(event, newValue) => {
                                                    setFormShippingData({ ...formShippingData, state: newValue });
                                                }}
                                                options={State?.getStatesOfCountry(formShippingData?.country_code)?.map(x => x?.name)}
                                                filterSelectedOptions
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="State"
                                                    />
                                                )}
                                            />
                                            <TextField
                                                name="district"
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="District"
                                                value={formShippingData.district || ""}
                                                onChange={handleShippingChange}
                                            />
                                            <TextField
                                                name="city"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                type="text"
                                                label="City"
                                                value={formShippingData.city || ""}
                                                onChange={handleShippingChange}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />
                                            <TextField
                                                name="address_1"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                type="text"
                                                label="Address - 1"
                                                value={formShippingData.address_1 || ""}
                                                onChange={handleShippingChange}
                                                validators={["required"]}
                                                errorMessages={["this field is required"]}
                                            />
                                            <TextField
                                                name="address_2"
                                                type="text"
                                                InputProps={{
                                                    readOnly: !!id,
                                                }}
                                                label="Address - 2"
                                                value={formShippingData.address_2 || ""}
                                                onChange={handleShippingChange}
                                            />
                                        </Grid>
                                    </Grid>}

                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6">Shipping Charge</Typography>
                                    <Box sx={{
                                        mt: 2
                                    }}>
                                        <TextField
                                            name="shipping_charge"
                                            type="text"
                                            label="Enter Shipping Charge"
                                            value={formData?.shipping_charge || ""}
                                            onChange={handleChange}
                                        />
                                    </Box>

                                    <Typography variant="h6">Other Charge</Typography>
                                    <Box sx={{
                                        mt: 2
                                    }}>
                                        <TextField
                                            name="other_charge"
                                            type="text"
                                            label="Enter Other Charge"
                                            value={formData?.other_charge || ""}
                                            onChange={handleChange}
                                        />
                                    </Box>

                                    <Typography variant="h6">Remark</Typography>
                                    <Box sx={{
                                        mt: 2
                                    }}>
                                        <TextField
                                            name="remark"
                                            type="text"
                                            label="Enter Remark"
                                            value={formData?.remark || ""}
                                            onChange={handleChange}
                                        />
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <DiscountType
                                        title="Discount Info"
                                        radioTitle="Discount Type"
                                        setDiscountType={setDiscountType}
                                        discountType={discountType}
                                        formData={formData}
                                        setFormData={setFormData}
                                        discount_coupon={discount_coupon}
                                        discountApply={discountApply}
                                        setDiscountApply={setDiscountApply}
                                        userID={userID}
                                    />

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="h6">Payment Info</Typography>
                                    <FormControl sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        alignItems: 'start',
                                        gap: 2
                                    }}>
                                        <FormLabel id="demo-row-radio-buttons-group-label" sx={{ width: "120px", mt: 1.6 }}>Payment Type</FormLabel>
                                        <RadioGroup
                                            row
                                            value={paymentMode ?? "cod"}
                                            onChange={(e) => {
                                                if (!id) setPaymentMode(e.target.value)
                                            }}
                                            aria-labelledby="demo-row-radio-buttons-group-label"
                                        // name="paymentMode"
                                        >
                                            <Grid container>
                                                <Grid item lg={12}>
                                                    <Stack direction="row" spacing={1}>
                                                        <FormControlLabel value="cod" control={<Radio />} label="COD" />
                                                        <FormControlLabel value="online" control={<Radio />} label="Online" />
                                                    </Stack>
                                                </Grid>
                                                {/* <Grid item lg={12}>
                                                    <FormControlLabel value="credits" control={<Radio />} label="Credits" />
                                                    <FormControlLabel value="partialCredits" control={<Radio />} label="Partial Credits" />
                                                </Grid> */}
                                                {paymentMode == "online" ?
                                                    <Grid item lg={12} mt={2}>
                                                        <TextField
                                                            name="transaction_id"
                                                            type="text"
                                                            InputProps={{
                                                                readOnly: !!id,
                                                            }}
                                                            label="Transaction id"
                                                            value={onlineData?.transaction_id || ""}
                                                            onChange={(e) => {
                                                                setOnlineData({ ...onlineData, [e.target.name]: e.target.value })
                                                            }}
                                                            validators={["required"]}
                                                            errorMessages={["this field is required"]}
                                                        />
                                                        {mediaLoading ? <>
                                                            <Box>
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
                                                                    <CircularProgress />
                                                                </Button>
                                                            </Box>
                                                        </> :
                                                            <>
                                                                {onlineData?.transaction_doc ?
                                                                    <Box
                                                                        sx={{
                                                                            width: "150px",
                                                                            height: "170px",
                                                                            margin: "10px 10px 0 0",
                                                                            position: "relative"
                                                                        }}>
                                                                        <img src={onlineData?.transaction_doc} width="100%" height="90%" />
                                                                        <Box sx={{ height: "10%" }} display="flex" alignItems="center" justifyContent="end">
                                                                            <IconButton size="small">
                                                                                <Icon fontSize="small" onClick={() => handleDeleteImage()} sx={{
                                                                                    color: "red",
                                                                                    cursor: "pointer",
                                                                                }}>delete</Icon></IconButton> <Span onClick={() => handleDeleteImage()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                                                        </Box>
                                                                    </Box>
                                                                    :
                                                                    <Box>
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
                                                                                name="transaction_doc"
                                                                                accept="image/png, image/gif, image/jpeg"
                                                                                hidden
                                                                                onClick={(event) => { event.target.value = '' }}
                                                                                onChange={handleChange} />
                                                                        </Button>
                                                                        <Typography sx={{ color: 'rgba(52, 49, 76, 0.54)', fontWeight: 400, fontSize: '0.75rem', m: '3px 0px' }}>Upload image size is max 30MB only.</Typography>
                                                                    </Box>}
                                                            </>
                                                        }
                                                    </Grid>
                                                    : null}
                                            </Grid>
                                        </RadioGroup>
                                    </FormControl>

                                </SimpleCard>
                            </Grid>
                        }
                    </Grid>
                </Box >
                {items?.length > 0 && <Box sx={{
                    width: '100%', height: { xs: '130px', md: '80px' }, background: '#fff',
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
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', xl: 'row' }, ml: 3, gap: { md: '10px', xs: '0px' } }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, ml: 3, gap: { md: '10px', xs: '0px' } }} >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Typography sx={{ fontWeight: 700 }}>Total Items</Typography>
                                    <Typography sx={{ fontWeight: 500 }}>:&nbsp; {(coupenData && coupenData?.length > 0) ? coupenData?.length ?? 0 : items?.length ?? 0}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Typography sx={{ fontWeight: 700 }}>Total QTY</Typography>
                                    <Typography sx={{ fontWeight: 500 }}>:&nbsp; {items?.length > 0 && (coupenData && coupenData?.length > 0) ? coupenData?.reduce((t, x) => t + Number(x?.qty), 0) ?? 0 : items?.reduce((t, x) => t + Number(x?.qty), 0) ?? 0}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Typography sx={{ fontWeight: 700, color: 'red' }}>Total Sub Amount</Typography>
                                    <Typography sx={{ fontWeight: 500, color: 'red' }}>:
                                        {(items?.length > 0 && (coupenData && coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, shipping_charge, other_charge)?.subTotal ?? 0 : coutinLogicWithoutCoupon(items, shipping_charge, other_charge)?.subTotal)}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: { xs: 'column', md: 'row' }, ml: 3, gap: { md: '10px', xs: '0px' } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Typography sx={{ fontWeight: 700, color: 'red' }}>Total GST Amount</Typography>
                                    <Typography sx={{ fontWeight: 500, color: 'red' }}>:
                                        {(items?.length > 0 && (coupenData && coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, shipping_charge, other_charge)?.gst_amount : coutinLogicWithoutCoupon(items, shipping_charge, other_charge)?.gst_amount)}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Typography sx={{ fontWeight: 700, color: 'red' }}>Total Discount Amount</Typography>
                                    <Typography sx={{ fontWeight: 500, color: 'red' }}>:
                                        {(coupenDataManualApply ? (Number(coupenDataManual ?? 0)) : (items?.length > 0 && (coupenData && coupenData?.length > 0) ? coupenData?.reduce((t, x) => t + Number(x?.discounted_amount ?? 0), 0) ?? 0 : 0))?.toFixed(2)}
                                    </Typography>
                                </Box>
                                {paymentMode != 'online' &&
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                        <Typography sx={{ fontWeight: 700, color: 'red' }}>COD Amount</Typography>
                                        <Typography sx={{ fontWeight: 500, color: 'red' }}>:
                                            {(items?.length > 0 && (coupenData && coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData)?.codData : coutinLogicWithoutCoupon(items)?.codData)}
                                        </Typography>
                                    </Box>
                                }
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-evenly' }}>
                                    <Typography sx={{ fontWeight: 700, color: 'red' }}>Total Amount</Typography>
                                    <Typography sx={{ fontWeight: 500, color: 'red' }}>:
                                        {(items?.length > 0 && (coupenData && coupenData?.length > 0) ? coutinLogicWithCoupon(coupenData, shipping_charge, other_charge)?.total : coutinLogicWithoutCoupon(items, shipping_charge, other_charge)?.total)}
                                    </Typography>
                                </Box>
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

export default OrderDetailEdit;

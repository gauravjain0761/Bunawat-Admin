import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import OrderForm from "app/views/order/orderForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AddOrder = () => {
    const { id, type } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData({})
        }
    }, [id])

    return (
        <Stack spacing={3}>
            <OrderForm data={data} type={type} />
        </Stack>
    );
};

export default AddOrder;

import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import OrderDetailForm from "app/views/order/orderDetailForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderDetail = () => {
    const { id, type } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData({})
        }
    }, [id])

    return (
        <Stack spacing={3}>
            <OrderDetailForm data={data} type={type} />
        </Stack>
    );
};

export default OrderDetail;

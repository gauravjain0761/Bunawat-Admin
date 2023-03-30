import { Stack } from "@mui/material";
import OrderDetailEdit from "app/views/order/orderDetailEdit";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const OrderEdit = () => {
    const { id, type } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData([])
        }
    }, [id])

    return (
        <Stack spacing={3}>
            <OrderDetailEdit data={data} type={type} />
        </Stack>
    );
};

export default OrderEdit;

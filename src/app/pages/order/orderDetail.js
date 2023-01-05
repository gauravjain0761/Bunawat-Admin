import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import OrderForm from "app/views/order/orderForm";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const OrderDetail = () => {
    const { id, type } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData([])
        }
    }, [id])

    return (
        <Container sx={{ mt: 0 }}>
            <Stack spacing={3}>
                <OrderForm data={data} type={type} />
            </Stack>
        </Container>
    );
};

export default OrderDetail;

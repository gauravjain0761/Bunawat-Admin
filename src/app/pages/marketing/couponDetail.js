import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import CouponForm from "app/views/marketing/couponForm";
import { mockDataCouponManagement } from "fake-db/data/marketing/couponData";
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

const CouponDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData(mockDataCouponManagement.find(item => item.id == id))
        }
    }, [id])

    return (
        <Container>
            <Stack spacing={3}>
                <CouponForm data={data} id={id} />
            </Stack>
        </Container>
    );
};

export default CouponDetail;

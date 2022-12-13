import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import SizeForm from "app/views/product/size/sizeForm";
import { mockDataProductSize } from "fake-db/data/product/size/sizeList";
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

const SizeDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData(mockDataProductSize.find(item => item.id == id))
        }
    }, [id])

    return (
        <Container>
            <Stack spacing={3}>
                <SizeForm data={data} />
            </Stack>
        </Container>
    );
};

export default SizeDetail;

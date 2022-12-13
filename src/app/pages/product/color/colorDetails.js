import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import ColorForm from "app/views/product/color/coloeForm";
import { mockDataProductColor } from "fake-db/data/product/color/colorList";
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

const ColorDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData(mockDataProductColor.find(item => item.id == id))
        }
    }, [id])

    return (
        <Container>
            <Stack spacing={3}>
                <ColorForm data={data} />
            </Stack>
        </Container>
    );
};

export default ColorDetail;

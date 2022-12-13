import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import TagForm from "app/views/product/tag/tagForm";
import { mockDataProductTag } from "fake-db/data/product/tag/tagList";
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

const TagDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData(mockDataProductTag.find(item => item.id == id))
        }
    }, [id])

    return (
        <Container>
            <Stack spacing={3}>
                <TagForm data={data} />
            </Stack>
        </Container>
    );
};

export default TagDetail;

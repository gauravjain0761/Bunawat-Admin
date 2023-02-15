import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { API_URL } from "app/constant/api";
import { ApiGet } from "app/service/api";
import CollectionForm from "app/views/category/collectionForm";
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

const CategoryDetail = () => {
    const { id, type } = useParams();
    const [data, setData] = useState({});

    const getData = async (id) => {
        await ApiGet(`${API_URL.getCollection}/${id}`)
            .then((response) => {
                setData(response?.data ?? {});
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        if (id) {
            getData(id)
        }
    }, [id])

    return (
        <Container>
            <Stack spacing={3}>
                <CollectionForm type={type} data={data} id={id} />
            </Stack>
        </Container>
    );
};

export default CategoryDetail;

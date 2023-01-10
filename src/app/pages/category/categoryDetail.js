import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { SimpleCard } from "app/components";
import { API_URL } from "app/constant/api";
import { ApiGet } from "app/service/api";
import CategoryForm from "app/views/category/categoryForm";
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

    const getURL = (role) => {
        if (role == 'parent') {
            return API_URL.getParentCategory
        }
        if (role == 'sub') {
            return API_URL.getParentSubCategory
        }
        if (role == 'list') {
            return API_URL.getCategory
        }
    }

    const getData = async (id, type) => {
        await ApiGet(`${getURL(type)}/${id}`)
            .then((response) => {
                setData(response?.data ?? {});
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        if (id && type) {
            getData(id, type)
        } else {
            setData([])
        }
    }, [id, type])

    return (
        <Container>
            <Stack spacing={3}>
                <CategoryForm data={data} id={id} type={type} />
            </Stack>
        </Container>
    );
};

export default CategoryDetail;

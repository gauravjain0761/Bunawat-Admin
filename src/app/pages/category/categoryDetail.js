import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { SimpleCard } from "app/components";
import { API_URL } from "app/constant/api";
import { ApiGet } from "app/service/api";
import CategoryForm from "app/views/category/categoryForm";
import React, { useEffect, useState } from "react";
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
    const [newTypes, setNewTypes] = useState("list")

    const setTypes = () => {
        switch (type) {
            case "parentCategory":
                setNewTypes("parent")
                break;
            case "parentSubCategory":
                setNewTypes("sub")
                break;
            case "category":
                setNewTypes("list")
                break;
            default:
                setNewTypes("list")
                break;
        }
    }

    React.useEffect(() => {
        if (type) {
            setTypes()
        }
    }, [type])


    console.log("newTypesnewTypes", newTypes, type)

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

    const getData = async (id, types) => {
        await ApiGet(`${getURL(types)}/${id}`)
            .then((response) => {
                setData(response?.data ?? {});
            })
            .catch((error) => {
                console.log("Error", error);
            });
    }

    useEffect(() => {
        if (id && newTypes) {
            getData(id, newTypes)
        } else {
            setData([])
        }
    }, [id, newTypes]);


    return (
        <Container>
            <Stack spacing={3}>
                <CategoryForm data={data} id={id} type={newTypes} />
            </Stack>
        </Container>
    );
};

export default CategoryDetail;

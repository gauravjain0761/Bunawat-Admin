import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { API_URL } from "app/constant/api";
import { ApiGet } from "app/service/api";
import ProductForm from "app/views/product/addProduct/addForm";
import ProductEditForm from "app/views/product/addProduct/editForm";
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

const AddProduct = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    const getData = async (id) => {
        await ApiGet(`${API_URL.getProduct}/${id}`)
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
        } else {
            setData([])
        }
    }, [id])

    return (
        <>
            {id ?
                <ProductEditForm getIDData={getData} data={data} id={id} />
                :
                <ProductForm data={{}} />
            }
        </>
    );
};

export default AddProduct;

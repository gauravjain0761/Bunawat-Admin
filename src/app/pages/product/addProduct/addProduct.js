import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
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

    useEffect(() => {
        if (id) {
            setData([].find(item => item.id == id))
        }
    }, [id])

    console.log(data)
    return (
        <Container>
            <Stack spacing={3}>
                {id ?
                    <ProductEditForm data={data} />
                    :
                    <ProductForm data={{}} />
                }
            </Stack>
        </Container>
    );
};

export default AddProduct;

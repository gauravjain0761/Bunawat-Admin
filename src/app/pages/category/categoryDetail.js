import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { SimpleCard } from "app/components";
import CategoryForm from "app/views/category/categoryForm";
import { mockDataCategoryManagement } from "fake-db/data/category/categoryManagement";
import { mockDataUserList } from "fake-db/data/user/userList";
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

    useEffect(() => {
        if (id) {
            setData(mockDataCategoryManagement.find(item => item.id == id))
        }
    }, [id])

    return (
        <Container>
            <Stack spacing={3}>
                <CategoryForm data={data} type={type} />
            </Stack>
        </Container>
    );
};

export default CategoryDetail;

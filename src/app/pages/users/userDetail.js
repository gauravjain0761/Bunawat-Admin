import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { SimpleCard } from "app/components";
import UserForm from "app/views/users/userForm";
import { mockDataCustomerUserList, mockDataInfluncerUserList, mockDataResellerUserList } from "fake-db/data/user/userList";
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

const UserDetail = () => {
    const { id, type } = useParams();
    const [data, setData] = useState();

    useEffect(() => {
        if (id && type) {
            const finalData = type == "Customer" ? mockDataCustomerUserList : type == "Reseller" ? mockDataResellerUserList : mockDataInfluncerUserList
            setData(finalData.find(item => item.id == id))
        }
    }, [id, type])

    return (
        <Container>
            <Stack spacing={3}>
                <UserForm data={data} userType={type} />
            </Stack>
        </Container>
    );
};

export default UserDetail;

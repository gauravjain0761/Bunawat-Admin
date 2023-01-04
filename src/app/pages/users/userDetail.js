import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import { SimpleCard } from "app/components";
import { API_URL } from "app/constant/api";
import { ApiGet } from "app/service/api";
import UserForm from "app/views/users/userForm";
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
    const [data, setData] = useState({});

    const getURL = (role) => {
        if (role == 'Customer') {
            return API_URL.getCustomer
        }
        if (role == 'influencer') {
            return API_URL.getInfluencer
        }
        if (role == 'Reseller') {
            return API_URL.getResller
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

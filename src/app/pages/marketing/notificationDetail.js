import { Stack } from "@mui/material";
import { Box, styled } from "@mui/system";
import NotificationForm from "app/views/marketing/notificationForm";
import { mockDataNotificationManagement } from "fake-db/data/marketing/notificationData";
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

const NotificationDetail = () => {
    const { id } = useParams();
    const [data, setData] = useState({});

    useEffect(() => {
        if (id) {
            setData(mockDataNotificationManagement.find(item => item.id == id))
        }
    }, [id])

    return (
        <Container>
            <Stack spacing={3}>
                <NotificationForm data={data} />
            </Stack>
        </Container>
    );
};

export default NotificationDetail;

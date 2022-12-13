import { Stack } from "@mui/material";
import { styled } from "@mui/system";
import AddUserForm from "app/views/users/addUserForm";
import { useParams } from "react-router-dom";

const Container = styled("div")(({ theme }) => ({
    margin: "30px",
    [theme.breakpoints.down("sm")]: { margin: "16px" },
    "& .breadcrumb": {
        marginBottom: "30px",
        [theme.breakpoints.down("sm")]: { marginBottom: "16px" },
    },
}));

const AddUser = () => {
    const { type } = useParams();
    return (
        <Container>
            <Stack spacing={3}>
                <AddUserForm data={{ role: type ?? "" }} disableRole={type ? true : false} />
            </Stack>
        </Container>
    );
};

export default AddUser;

import { CheckBox } from "@mui/icons-material";
import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    Icon,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    Stack,
    styled,
    Typography,
} from "@mui/material";
import { SimpleCard } from "app/components";
import TextEditor from "app/components/textEditor";
import { Span } from "app/components/Typography";
import { isMdScreen, isMobile } from "app/utils/utils";
import { useEffect, useState } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { useNavigate, useSearchParams } from "react-router-dom";

const TextField = styled(TextValidator)(() => ({
    width: "100%",
    marginBottom: "16px",
}));

const NotificationForm = ({ data = {} }) => {
    const [formData, setFormData] = useState(data);
    const navigate = useNavigate();
    let [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        setFormData(data)
    }, [data])


    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
        navigate(`/notifications/list`)
    };

    const handleChange = (event) => {
        if (event.target.name == "image") {
            setFormData({ ...formData, [event.target.name]: URL.createObjectURL(event.target.files[0]) });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const handleDeleteImage = () => {
        setFormData({ ...formData, image: null });
    };

    const {
        title,
        image,
        notificationType,
        users,
        userType
    } = formData;

    return (
        <div>
            <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                <SimpleCard title="Notification" backArrow={true}>
                    <Grid container spacing={12}>
                        <Grid item lg={12} md={12} sm={12} xs={12} >

                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>Type</FormLabel>
                                <RadioGroup
                                    row
                                    value={notificationType ?? "Text"}
                                    onChange={handleChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="notificationType">
                                    <FormControlLabel value="text" control={<Radio />} label="Text" />
                                    <FormControlLabel value="image" control={<Radio />} label="Image" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}>
                                <FormLabel id="demo-row-radio-buttons-group-label" sx={{ mr: 1 }}>Users</FormLabel>
                                <RadioGroup
                                    row
                                    value={users ?? "single"}
                                    onChange={handleChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
                                    name="users">
                                    <FormControlLabel value="single" control={<Radio />} label="Single" />
                                    <FormControlLabel value="all" control={<Radio />} label="All" />
                                </RadioGroup>
                            </FormControl>

                            <FormControl fullWidth sx={{ my: 2 }}>
                                <InputLabel id="demo-simple-select-label">User Type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={userType}
                                    name="userType"
                                    label="User Type"
                                    onChange={handleChange}>
                                    <MenuItem value="Customer">Customer</MenuItem>
                                    <MenuItem value="Reseller">Reseller</MenuItem>
                                    <MenuItem value="Influncer">Influncer</MenuItem>
                                </Select>
                            </FormControl>

                            <TextField
                                type="text"
                                name="title"
                                label="Title"
                                onChange={handleChange}
                                value={title || ""}
                            />

                            <Box sx={{ mb: 2 }}>
                                <TextEditor />
                            </Box>

                            {notificationType == 'image' && <Box display="flex" flexDirection="column">
                                <Span sx={{ textTransform: "capitalize", fontWeight: 500, fontSize: "18px" }}>Media</Span>
                                <Box sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                }}>
                                    {image ?
                                        <Box
                                            sx={{
                                                width: "150px",
                                                height: "170px",
                                                margin: "10px 10px 0 0",
                                                position: "relative"
                                            }}>
                                            <img src={image} width="100%" height="90%" />
                                            <Box sx={{ height: "10%" }} display="flex" alignItems="center" justifyContent="end">
                                                <Icon onClick={() => handleDeleteImage()} sx={{
                                                    color: "red",
                                                    cursor: "pointer",
                                                }}>delete</Icon> <Span onClick={() => handleDeleteImage()} sx={{ fontWeight: 600, fontSize: "14px", cursor: "pointer" }}>Delete</Span>
                                            </Box>
                                        </Box>
                                        :
                                        <Button
                                            variant="contained"
                                            component="label"
                                            sx={{
                                                width: "150px",
                                                height: "150px",
                                                background: "transparent",
                                                color: "#000",
                                                border: "2px dashed",
                                                margin: "10px 10px 0 0",

                                                "&:hover": {
                                                    background: "transparent",
                                                }
                                            }} >
                                            <Icon>add</Icon>
                                            <Span sx={{ pl: 1, textTransform: "capitalize" }}>Upload File</Span>
                                            <input
                                                type="file"
                                                name="image"
                                                accept="image/png, image/gif, image/jpeg"
                                                hidden
                                                onClick={(event) => { event.target.value = '' }}
                                                onChange={handleChange} />
                                        </Button>
                                    }
                                </Box>
                            </Box>
                            }

                        </Grid>

                    </Grid>
                    <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                        <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                            <Stack direction="row" spacing={2}>
                                <Box>
                                    <Button color="primary" variant="outlined" type="button" sx={{ mr: 0, mt: 2 }} onClick={() => navigate(-1)}>
                                        <Icon>arrow_back</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Back</Span>
                                    </Button>
                                </Box>
                                <Box>
                                    <Button color="primary" variant="contained" type="submit" sx={{ mr: 0, mt: 2 }}>
                                        <Icon>send</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                                    </Button>
                                </Box>
                            </Stack>
                            {/* <Button color="error" variant="contained" sx={{ mr: 2, mt: 2 }}>
                                <Icon>delete</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>Delete</Span>
                            </Button> */}
                        </Box>
                        {/* <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"} >
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/wishlist")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User wishlist</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/cart/details")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User Cart Details</Span>
                            </Button>
                            <Button color="primary" variant="contained" sx={{ mr: 2, mt: 2 }} onClick={() => navigate("/user/payment/history")}>
                                <Icon>star_rate</Icon>
                                <Span sx={{ pl: 1, textTransform: "capitalize" }}>User payment history</Span>
                            </Button>
                        </Box> */}
                    </Box>
                </SimpleCard>

            </ValidatorForm>
        </div >
    );
};

export default NotificationForm;

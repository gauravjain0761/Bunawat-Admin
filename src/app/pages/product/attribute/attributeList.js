import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Container, Fade, Grid, Icon, IconButton, Menu, MenuItem, Stack } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { mockDataProductColor } from 'fake-db/data/product/color/colorList';
import { mockDataProductSize } from 'fake-db/data/product/size/sizeList';
import { mockDataProductAttribute } from 'fake-db/data/product/attribute/attributeList';
import { TextValidator, ValidatorForm } from 'react-material-ui-form-validator';
import { SimpleCard } from 'app/components';
import { isMdScreen, isMobile } from 'app/utils/utils';
import { Span } from 'app/components/Typography';

const AttributeList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState(mockDataProductAttribute);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionAllOpen, setActionAllOpen] = useState(null);

    const [formData, setFormData] = useState({});

    const handleSubmit = (event) => {
        console.log("submitted");
        console.log(event);
    };

    const handleChange = (event) => {
        if (event.target.name == "home") {
            let visibility = formData?.visibility ?? {}
            visibility = { ...visibility, [event.target.name]: event.target.checked }
            setFormData({ ...formData, visibility });
        } else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    };

    const {
        id,
        name,
        slug,
        orderBy,
    } = formData;
    const columns = [
        {
            id: "name",
            label: "Name",
            width: 150
        },
        {
            id: "slug",
            label: "Slug",
            width: 80
        },
        {
            id: "count",
            label: "Variant",
            width: 250
        },
        {
            id: "action",
            label: "Action",
            action: true,
            width: 80,
            sortDisable: true,
            renderCell: (
                <>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        sx={{ color: "#fff" }}
                        aria-controls={Boolean(actionAllOpen) ? 'long-menu' : undefined}
                        aria-expanded={Boolean(actionAllOpen) ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={(e) => setActionAllOpen(e.currentTarget)}>
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="fade-menu"
                        MenuListProps={{
                            'aria-labelledby': 'fade-button',
                        }}
                        anchorEl={actionAllOpen}
                        open={Boolean(actionAllOpen)}
                        onClose={() => setActionAllOpen(null)}
                        TransitionComponent={Fade}
                    >
                        <MenuItem onClick={() => {
                            setOpen(true);
                            setActionAllOpen(null)
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            )
        }
    ];

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.name);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleActionClick = (event, index) => {
        event.preventDefault();
        event.stopPropagation();
        let temp = [...actionOpen];
        if (!temp[index]) {
            temp = temp.map(() => { return null })
        }
        temp[index] = event.currentTarget
        setActionOpen(temp)
    };

    const handleActionClose = () => {
        let temp = [...actionOpen];
        temp = temp.map(() => { return null })
        setActionOpen(temp)
    };


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const isSelected = (name) => selected.indexOf(name) !== -1;

    const CardHeader = styled(Box)(() => ({
        display: 'flex',
        paddingLeft: '24px',
        paddingRight: '24px',
        marginBottom: '12px',
        alignItems: 'center',
        justifyContent: 'space-between',
    }));

    const Title = styled('span')(() => ({
        fontSize: '1rem',
        fontWeight: '500',
        textTransform: 'capitalize',
    }));


    const TextField = styled(TextValidator)(() => ({
        width: "100%",
        marginBottom: "16px",
    }));
    return (
        <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
            <Container>
                <Stack spacing={3}>
                    <ValidatorForm onSubmit={handleSubmit} onError={() => null}>
                        <SimpleCard title="Add Attribute">
                            <Grid container spacing={12}>
                                <Grid item lg={12} md={12} sm={12} xs={12} sx={{ mt: 2 }}>

                                    <TextField
                                        type="text"
                                        name="name"
                                        label="Name"
                                        onChange={handleChange}
                                        value={name || ""}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />

                                    <TextField
                                        type="text"
                                        name="slug"
                                        label="slug"
                                        value={slug || ""}
                                        onChange={handleChange}
                                        validators={["required"]}
                                        errorMessages={["this field is required"]}
                                    />

                                </Grid>

                            </Grid>
                            <Box display="flex" sx={{ alignItems: isMdScreen() ? "flex-start" : "center", flexDirection: isMdScreen() ? "column" : "row" }}>
                                <Box display="flex" alignItems={isMobile() ? "flex-start" : "center"} flexDirection={isMobile() ? "column" : "row"}>
                                    <Button color="primary" variant="contained" type="submit" sx={{ mr: 2, mt: 2 }}>
                                        <Icon>send</Icon>
                                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Save</Span>
                                    </Button>
                                </Box>
                            </Box>
                        </SimpleCard>

                    </ValidatorForm>
                </Stack>
            </Container>
            <CardHeader sx={{ mt: 2 }}>
                <Title>Attribute List</Title>
            </CardHeader>
            <TableComponent
                rows={rows}
                columns={columns}
                selected={selected}
                renderRow={(row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.name}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    onClick={(event) => handleClick(event, row.name)}
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </TableCell>
                            <TableCell align="center" sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    color: "blue",
                                },
                            }} onClick={() => navigate(`/product/${row.slug}`)}> {row.name} </TableCell>
                            <TableCell align="center" >{row.slug}</TableCell>
                            <TableCell align="center">
                                {row.slug == "color" && mockDataProductColor.map(color => color.name).join()}
                                {row.slug == "size" && mockDataProductSize.map(color => color.name).join()}
                            </TableCell>
                            <TableCell align="center" >
                                <IconButton
                                    aria-label="more"
                                    id="long-button"
                                    aria-controls={Boolean(actionOpen[index]) ? 'long-menu' : undefined}
                                    aria-expanded={Boolean(actionOpen[index]) ? 'true' : undefined}
                                    aria-haspopup="true"
                                    onClick={(e) => handleActionClick(e, index)}>
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="fade-menu"
                                    MenuListProps={{
                                        'aria-labelledby': 'fade-button',
                                    }}
                                    anchorEl={actionOpen[index]}
                                    open={Boolean(actionOpen[index])}
                                    onClose={handleActionClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={() => navigate(`/category/details/list/${row.id}`)}>Edit</MenuItem>
                                    <MenuItem onClick={() => {
                                        setOpen(true);
                                        handleActionClose();
                                    }}>Delete</MenuItem>
                                </Menu>
                            </TableCell>
                        </TableRow>
                    );
                }}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleChangePage={handleChangePage}
                handleSelectAllClick={handleSelectAllClick}
            />

            <DeleteModel open={open} handleClose={() => setOpen(false)} />
        </Card>
    );
}

export default AttributeList;
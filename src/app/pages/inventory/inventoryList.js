import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Collapse, Fade, Icon, IconButton, Menu, MenuItem, Table, TableBody, TableContainer, TableHead, TextField, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { mockDataInventoryManagement } from 'fake-db/data/inventory/inventoryData';
import MoveQTYModel from 'app/views/inventory/model/moveQTY';

const InventoryList = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [moveQTYPopUP, setMoveQTYPopUP] = useState(false);
    const [saveChanges, setSaveChanges] = useState(false);
    const [rows, setRows] = useState(mockDataInventoryManagement);
    const [selected, setSelected] = useState([]);
    const [singleMoveQTY, setSingleMoveQTY] = useState({});
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionCollapseOpen, setActionCollapseOpen] = useState(rows.map((x) => { return x.data.map(() => { return null }) }));
    const [collapseOpen, setCollapseOpen] = useState(rows.map(() => { return false }));
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');
    const columns = [
        {
            id: "dnumber",
            label: `Design \nNo/SKU`,
            width: 120
        },
        {
            id: "p_name",
            label: "Product \nName",
            width: 100
        },
        {
            id: "variant_count",
            label: "Variant \nCount",
            align: "center",
            width: 80
        },
        {
            id: "in_stock",
            label: "InStock \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "preorder_qty",
            label: "PreOrder \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "total_qty",
            label: "Total \nQTY",
            align: "center",
            width: 80
        },
        {
            id: "threshold_qty",
            label: "Threshold \nQTY",
            align: "center",
            width: 100
        },
        {
            id: "mappedvariant",
            label: "Mapped \nVariant",
            align: "center",
            width: 100
        },
        {
            id: "action",
            label: "Action",
            action: true,
            align: 'right',
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

    const handleCollapseClick = (index) => {
        let temp = [...collapseOpen];
        if (!temp[index]) {
            temp = temp.map(() => { return false })
        }
        temp[index] = !temp[index]
        setCollapseOpen(temp)
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

    const handleActionCollapseClick = (event, index, c_index) => {
        event.preventDefault();
        event.stopPropagation();
        let temp = [...actionCollapseOpen];
        if (!temp[index][c_index]) {
            temp = temp.map((x) => { return x.map(() => { return null }) })
        }
        temp[index][c_index] = event.currentTarget
        setActionCollapseOpen(temp)
    };

    const handleActionCollapseClose = () => {
        let temp = [...actionCollapseOpen];
        temp = temp.map((x) => { return x.map(() => { return null }) })
        setActionCollapseOpen(temp)
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

    const handleChange = (event) => {
        setSaveChanges(true);
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
    return (
        <Card elevation={3} sx={{ pt: '20px', mb: 3 }}>
            <CardHeader className="searchBoxSeaprate">
                <Title>Inventory List</Title>
                <Box display="flex" className="searchBoxSeaprate">
                    <Box display="flex" alignItems="center" className="searchBoxWidth" sx={{
                        border: "1px solid #000",
                        borderRadius: "6px",
                        mr: "20px",
                    }}>
                        <Box component="input" sx={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '1rem',
                            p: 0,
                            paddingLeft: '20px',
                            height: '36px',
                            background: "transparent",
                            color: "#000",
                        }} type="text" autoFocus value={searchText} onChange={(e) => {
                            setSearchText(e.target.value)
                        }} placeholder="Search here..." />
                        <IconButton onClick={() => setSearchText('')} sx={{ verticalAlign: 'middle' }}>
                            <Icon sx={{ color: "#000" }}>{!searchText ? 'search' : 'close'}</Icon>
                        </IconButton>
                    </Box>

                    {/* <Button color="primary" variant="contained" type="submit" onClick={() => navigate(`/inventory/add`)} sx={{
                        backgroundColor: UIColor, color: "#fff",
                        "&:hover": {
                            backgroundColor: UIColor, color: "#fff"
                        }
                    }}>
                        <Icon s>add</Icon>
                        <Span sx={{ pl: 1, textTransform: "capitalize" }}>Add Inventory</Span>
                    </Button> */}
                </Box>
            </CardHeader>
            <TableComponent
                rows={rows}
                columns={columns}
                extraPaddingOnFirstColumn={true}
                disableCheckBox={true}
                selected={selected}
                renderRow={(row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <>
                            <TableRow
                                hover
                                role="checkbox"
                                aria-checked={isItemSelected}
                                tabIndex={-1}
                                key={row.name}
                                selected={isItemSelected}
                            >
                                <TableCell sx={{ pl: '15px' }}>{row.dnumber}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <img style={{ marginRight: '5px' }} src="https://www.thoughtco.com/thmb/ctxxtfGGeK5f_-S3f8J-jbY-Gp8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/close-up-of-clothes-hanging-in-row-739240657-5a78b11f8e1b6e003715c0ec.jpg" width='50px' height='50px' />
                                        {row.name}
                                    </Box>
                                </TableCell>
                                <TableCell align="center" sx={{ cursor: 'pointer', color: '#2271b1' }} onClick={() => handleCollapseClick(index)}>{row.count}</TableCell>
                                <TableCell align="center">{row.instock}</TableCell>
                                <TableCell align="center">{row.preorder}</TableCell>
                                <TableCell align="center">{row.total}</TableCell>
                                <TableCell align="center">{row.threshold}</TableCell>
                                <TableCell align="center"></TableCell>
                                <TableCell align='right' sx={{ pr: "18px" }}>
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
                                        // open={Boolean(actionOpen[index])}
                                        open={false}
                                        onClose={handleActionClose}
                                        TransitionComponent={Fade}
                                    >
                                        <MenuItem onClick={() => {
                                            // setOpen(true);
                                            // handleActionClose();
                                        }}>Add Variant</MenuItem>
                                    </Menu>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell style={{ paddingBottom: 0, paddingTop: 0, padding: 0 }} colSpan={9}>
                                    <Collapse in={collapseOpen[index]} timeout="auto" unmountOnExit>
                                        <TableComponent
                                            rows={row.data}
                                            columns={columns}
                                            disableColumns={true}
                                            disableCheckBox={true}
                                            extraDisable={true}
                                            disablePagination={true}
                                            renderRow={(row, c_index) => {
                                                const isItemSelected = isSelected(row.name);
                                                const labelId = `enhanced-table-checkbox-${c_index}`;
                                                return (
                                                    <TableRow
                                                        hover
                                                        role="checkbox"
                                                        tabIndex={-1}
                                                        key={row.name}
                                                    >
                                                        <TableCell align="center" width={120 ?? "100%"}>↳ {row.dnumber}</TableCell>
                                                        <TableCell width={100 ?? "100%"}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <img style={{ marginRight: '5px' }} src="https://content.jdmagicbox.com/comp/bhawanipatna/t9/9999p6670.6670.181223085624.h8t9/catalogue/india-fashion-cloth-store-bazarpada-bhawanipatna-zh5wdnprwx.jpg?clr=5c470a" width='50px' height='50px' />
                                                                {row.name}
                                                            </Box>
                                                        </TableCell>
                                                        <TableCell width={80 ?? "100%"} align="center">Variation</TableCell>
                                                        <TableCell width={100 ?? "100%"} align="center">
                                                            <TextField
                                                                type="number"
                                                                name="instock"
                                                                label="In Stock"
                                                                onChange={handleChange}
                                                                // value={row.instock || ""}
                                                                defaultValue={row.instock || ""}
                                                                validators={["required"]}
                                                                errorMessages={["this field is required"]}
                                                            />
                                                        </TableCell>
                                                        <TableCell width={100 ?? "100%"} align="center">
                                                            <TextField
                                                                type="number"
                                                                name="preorder"
                                                                label="Preorder"
                                                                onChange={handleChange}
                                                                // value={row.instock || ""}
                                                                defaultValue={row.preorder || ""}
                                                                validators={["required"]}
                                                                errorMessages={["this field is required"]}
                                                            />
                                                        </TableCell>
                                                        <TableCell width={80 ?? "100%"} align="center">{row.total}</TableCell>
                                                        <TableCell width={100 ?? "100%"} align="center">{row.threshold}</TableCell>
                                                        <TableCell width={100 ?? "100%"} align="center">{row.mapvariant}</TableCell>
                                                        <TableCell width={80 ?? "100%"} align='right' sx={{ pr: "18px" }}>
                                                            <IconButton
                                                                aria-label="more"
                                                                id="long-button"
                                                                aria-controls={Boolean(actionCollapseOpen[index][c_index]) ? 'long-menu' : undefined}
                                                                aria-expanded={Boolean(actionCollapseOpen[index][c_index]) ? 'true' : undefined}
                                                                aria-haspopup="true"
                                                                onClick={(e) => handleActionCollapseClick(e, index, c_index)}>
                                                                <MoreVertIcon />
                                                            </IconButton>
                                                            <Menu
                                                                id="fade-menu"
                                                                MenuListProps={{
                                                                    'aria-labelledby': 'fade-button',
                                                                }}
                                                                anchorEl={actionCollapseOpen[index][c_index]}
                                                                open={Boolean(actionCollapseOpen[index][c_index])}
                                                                onClose={handleActionCollapseClose}
                                                                TransitionComponent={Fade}
                                                            >
                                                                <MenuItem onClick={() => {
                                                                    setMoveQTYPopUP(true);
                                                                    setSingleMoveQTY(row)
                                                                    handleActionCollapseClose();
                                                                }}>Edit</MenuItem>
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
                                    </Collapse>
                                </TableCell>
                            </TableRow>
                        </>
                    );
                }}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleChangePage={handleChangePage}
                handleSelectAllClick={handleSelectAllClick}
            />

            <DeleteModel open={open} handleClose={() => setOpen(false)} />
            <MoveQTYModel open={moveQTYPopUP} handleClose={() => {
                setMoveQTYPopUP(false)
                setSingleMoveQTY({})
            }} data={singleMoveQTY} />

            {saveChanges &&
                <Box sx={{
                    width: '100%', height: '60px', background: '#fff',
                    position: 'absolute',
                    bottom: 0,
                    boxShadow: '0 -8px 16px 0 rgb(85 93 102 / 30%)'
                }}>
                    <Box sx={{
                        display: 'flex',
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'flex-end'
                    }}>
                        <Box sx={{
                            mr: 3
                        }}>
                            <Button onClick={() => setSaveChanges(false)} sx={{ border: '1px solid #232a45', color: '#232a45' }}>
                                Discard changes
                            </Button>
                            <Button onClick={() => setSaveChanges(false)} sx={{
                                background: '#232a45', ml: 2, color: '#fff',
                                "&:hover": {
                                    background: '#232a45', color: '#fff'
                                }
                            }}>
                                Save all changes
                            </Button>
                        </Box>
                    </Box>
                </Box>
            }
        </Card>
    );
}

export default InventoryList;
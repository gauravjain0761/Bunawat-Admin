import * as React from 'react';
import Box from '@mui/material/Box';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableComponent from 'app/components/table';
import { Button, Card, Fade, Icon, IconButton, Menu, MenuItem, Stack, Typography } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate, useParams } from 'react-router-dom';
import { UIColor } from 'app/utils/constant';
import { useState } from 'react';
import { toast } from 'material-react-toastify';
import DeleteModel from 'app/views/models/deleteModel';
import styled from '@emotion/styled';
import { Span } from 'app/components/Typography';
import { API_URL } from 'app/constant/api';
import { ApiGet, ApiPut } from 'app/service/api';
import DeleteCollectionModel from 'app/views/category/model/deleteCollectionModel';
import DeleteAllModel from 'app/views/models/deleteModel';

const ReviewList = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [open, setOpen] = useState(false);
    const [rowLoading, setRowLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [deleteAllOpen, setDeleteAllOpen] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [actionOpen, setActionOpen] = useState(rows.map(() => { return null }));
    const [actionAllOpen, setActionAllOpen] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [deleteData, setDeleteData] = useState(null);

    const columns = [
        {
            id: "review",
            label: "Review",
            width: 200,
        },
        {
            id: "rating",
            label: "Rating",
            width: 300,
        },
        {
            id: "isActive",
            label: "Status",
            align: "center",
            width: 80
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
                            setDeleteAllOpen(true);
                            setActionAllOpen(null)
                        }}>Delete</MenuItem>
                    </Menu>
                </>
            )
        }
    ];
    const getData = async (id) => {
        setRowLoading(true)
        await ApiGet(`${API_URL.getReviewProduct}/${id}?q=${searchText}`)
            .then((response) => {
                setRowLoading(false)
                setRows(response?.data ?? []);
                setTotalCount(response?.totalCount);
            })
            .catch((error) => {
                setRowLoading(false)
                console.log("Error", error);
            });
    }

    const editStatusData = async (editId, status) => {
        await ApiPut(`${API_URL.editReviewProduct}/${editId}`, {
            isActive: status
        })
            .then((response) => {
                toast.success('Edit Successfully!')
                getData(id)
                handleActionClose()
            })
            .catch((error) => {
                toast.error(error?.error)
                console.log("Error", error);
            });
    }

    React.useEffect(() => {
        if (id) getData(id);
    }, [id, searchText])

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n?._id);
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
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
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
            <Box className="searchBoxSeaprate"
                sx={{
                    paddingLeft: "10px !important",
                    paddingRight: "10px !important",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                }}
            >
                <Title>Review List</Title>
                <Box display="flex" className="searchBoxSeaprate">
                    <Stack direction="row" spacing={{ md: 3, sm: 1, xs: 1 }}>
                        <Box display="flex" alignItems="center" className="searchBoxWidth" sx={{
                            border: "1px solid #000",
                            borderRadius: "6px",
                            mr: "0px",
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
                            }} type="text" value={searchText} onChange={(e) => {
                                setSearchText(e.target.value)
                            }} placeholder="Search here..." />
                            <IconButton onClick={() => setSearchText('')} sx={{ verticalAlign: 'middle' }}>
                                <Icon sx={{ color: "#000" }}>{!searchText ? 'search' : 'close'}</Icon>
                            </IconButton>
                        </Box>

                        {/* <Button color="primary" variant="contained" type="submit" onClick={() => navigate(`/collection/details/collection`)} sx={{
                            backgroundColor: UIColor, color: "#fff",
                            "&:hover": {
                                backgroundColor: UIColor, color: "#fff"
                            },
                        }}>
                            <Icon>add</Icon>
                            <Span sx={{ pl: 1, textTransform: "capitalize", width: { md: "auto", sm: "210px", xs: "210px" } }}>Add Collection</Span>
                        </Button> */}
                    </Stack>
                </Box>
            </Box>
            <TableComponent
                rows={rows}
                isLoading={rowLoading}
                columns={columns}
                disablePagination={true}
                selected={selected}
                totalCount={totalCount}
                renderRow={(row, index) => {
                    const isItemSelected = isSelected(row?._id);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                        <TableRow
                            hover
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row?._id}
                            selected={isItemSelected}
                        >
                            <TableCell padding="checkbox">
                                <Checkbox
                                    color="primary"
                                    onClick={(event) => handleClick(event, row?._id)}
                                    checked={isItemSelected}
                                    inputProps={{
                                        'aria-labelledby': labelId,
                                    }}
                                />
                            </TableCell>
                            <TableCell > {row?.review} </TableCell>
                            <TableCell > {row?.rating} </TableCell>
                            <TableCell align="center">
                                {row?.isActive ?
                                    <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "green", textTransform: "capitalize" }}>
                                        Active
                                    </Typography>
                                    :
                                    <Typography sx={{ flexShrink: 0, fontSize: "14px", color: "red", fontWeight: 500, textTransform: "capitalize" }}>
                                        InActive
                                    </Typography>
                                }
                            </TableCell>
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
                                    open={Boolean(actionOpen[index])}
                                    onClose={handleActionClose}
                                    TransitionComponent={Fade}
                                >
                                    <MenuItem onClick={() => editStatusData(row?._id, !row?.isActive)}>{!row?.isActive ? "Active" : "InActive"}  </MenuItem>
                                    <MenuItem onClick={() => navigate(`/collection/details/collection/${row?._id}`)}>Edit</MenuItem>
                                    <MenuItem onClick={() => {
                                        setDeleteData(row)
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

            <DeleteCollectionModel open={open} deleteData={deleteData} getData={getData} handleClose={() => {
                setDeleteData(null);
                setOpen(false);
            }} />


            <DeleteAllModel open={deleteAllOpen} handleClose={() => {
                setDeleteAllOpen(false);
            }}
                type="collection"
                getData={getData}
                deleteData={selected}
            />
        </Card>
    );
}

export default ReviewList;
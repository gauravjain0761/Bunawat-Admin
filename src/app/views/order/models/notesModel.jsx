import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormLabel, Icon, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material'
import { Span } from 'app/components/Typography'
import { API_URL } from 'app/constant/api'
import { ApiDelete } from 'app/service/api'
import { UIColor } from 'app/utils/constant'
import { toast } from 'material-react-toastify';
import React, { useState } from 'react'

const NotesModel = ({ open, deleteData, getData, handleClose }) => {
    const [note, setNote] = useState('');
    const [notesList, setNotesList] = useState([])

    const handleNotes = async () => {
        setNotesList([...notesList, note]);
        setNote('');
        // await ApiDelete(`${API_URL.deleteCollection}/${deleteData?._id}`)
        //     .then((response) => {
        //         if (getData) getData()
        //         handleClose()
        //     })
        //     .catch((error) => {
        //         console.log("Error", error);
        //     });
    }

    return (
        <Dialog
            fullWidth
            maxWidth="sm"
            open={open}
            // onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant='h6'>Notes</Typography>
                    <Icon sx={{ cursor: 'pointer' }} onClick={handleClose}>close</Icon>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Box className="scroll-chnage" sx={{ width: '100%', height: "60vh", background: '#00000010', overflow: 'hidden', overflowY: 'auto' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'left',
                                color: "#000"
                            }}>Massage 1</Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end'
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                padding: '0px 10px',
                                textAlign: 'right',
                                color: "#000"
                            }}>Massage 2</Box>
                        </Box>
                    </Box>
                    <Box sx={{ color: '#000', mt: 2 }}>
                        <Stack flexDirection='row'>
                            <TextField
                                type="text"
                                name="note"
                                fullWidth
                                label="Enter Note"
                                onChange={(e) => setNote(e.target.value)}
                                value={note || ""}
                            />
                            <Button sx={{ padding: '6px 50px', ml: 2 }} variant='contained'>Add</Button>
                        </Stack>
                    </Box>
                </DialogContentText>
            </DialogContent>
            {/* <DialogActions>
                <Button onClick={handleClose} >
                    Close
                </Button>
            </DialogActions> */}
        </Dialog>
    )
}

export default NotesModel
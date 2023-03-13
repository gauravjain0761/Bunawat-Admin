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
                    <Box className="scroll-chnage" sx={{ width: '100%', height: "60vh", background: '#fff', overflow: 'hidden', overflowY: 'auto', border: '1px solid', borderRadius: '5px' }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start',
                            flexDirection: 'column',
                            padding: '16px',
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                textAlign: 'left',
                                color: "#000",
                                margin: '0px',
                                background: UIColor,
                                borderRadius: '6px',
                                color: '#fff',
                                position: 'relative',
                                padding: '20px',

                                "&::after": {
                                    content: '""',
                                    position: 'absolute',
                                    display: 'block',
                                    top: '30%',
                                    right: '100%',
                                    marginTop: '-10px',
                                    width: 0,
                                    height: 0,
                                    borderTop: '8px solid transparent',
                                    borderBottom: '8px solid transparent',
                                    borderRight: `8px solid ${UIColor}`,
                                }
                            }}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </Box>
                            <Box component='p' sx={{
                                width: '70%',
                                textAlign: 'left',
                                margin: '0px',
                                color: UIColor,
                                fontWeight: 600,
                                mt: '6px'
                            }}>
                                9:02 PM
                            </Box>
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            flexDirection: 'column',
                            padding: '16px',
                        }}>
                            <Box component='p' sx={{
                                width: '70%',
                                textAlign: 'left',
                                color: "#000",
                                margin: '0px',
                                background: UIColor,
                                borderRadius: '6px',
                                color: '#fff',
                                position: 'relative',
                                padding: '20px',

                                "&::after": {
                                    content: '""',
                                    position: 'absolute',
                                    display: 'block',
                                    top: '30%',
                                    left: '100%',
                                    marginTop: '-10px',
                                    width: 0,
                                    height: 0,
                                    borderTop: '8px solid transparent',
                                    borderBottom: '8px solid transparent',
                                    borderLeft: `8px solid ${UIColor}`,
                                }
                            }}>
                                Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                            </Box>
                            <Box component='p' sx={{
                                width: '70%',
                                textAlign: 'right',
                                margin: '0px',
                                color: UIColor,
                                fontWeight: 600,
                                mt: '6px'
                            }}>
                                9:02 PM
                            </Box>
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
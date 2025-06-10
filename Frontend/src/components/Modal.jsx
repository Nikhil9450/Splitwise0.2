import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {closeModal } from '../redux/modal/modalSlice';
import { useSelector,useDispatch } from 'react-redux';
import {  DialogActions } from "@mui/material";
import TextField from '@mui/material/TextField';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid lightgrey',
  borderRadius:'10px',
  boxShadow: 24,
  p: 4,
};

export default function TransitionsModal() {
    const { isOpen, modalType, modalProps } = useSelector((state) => state.modal);
    const dispatch = useDispatch()
    const renderModalContent = () => {
    switch (modalType) {
        case "EDIT_NAME":
        return (
            <>
            <Typography variant="h6">Edit Your Name</Typography>
            <TextField
                label="Enter Name"
                defaultValue={modalProps.data}
                fullWidth
                sx={{ mt: 2 }}
            />
            <DialogActions>
                <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
                <Button onClick={() => console.log("Saved")} color="error">Save</Button>
            </DialogActions>
            </>
        );
        case "EDIT_EMAIL":
        return (
            <>
            <Typography variant="h6">Edit Your Email</Typography>
            <TextField
                label="Enter Email"
                defaultValue={modalProps.data}
                fullWidth
                sx={{ mt: 2 }}
            />
            <DialogActions>
                <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
                <Button onClick={() => console.log("Saved")} color="error">Save</Button>
            </DialogActions>
            </>
        );
        case "DELETE_CONFIRMATION":
        return (
            <>
            <Typography variant="h6">Confirmation</Typography>
            <Typography sx={{ mt: 2 }}>{modalProps.message}</Typography>
            <DialogActions>
                <Button onClick={() => dispatch(closeModal())}>Cancel</Button>
                <Button onClick={() => {
                modalProps.onConfirm?.();
                dispatch(closeModal());
                }} color="error">Delete</Button>
            </DialogActions>
            </>
        );

        // Add more cases as needed

        default:
        return null;
    }
    };

  return (
    <div>
      <Modal
        // sx={{borderRadius:'10px',border:'none'}}
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={isOpen}
        onClose={()=>dispatch(closeModal())}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={isOpen}>
            <Box sx={style}>
                {renderModalContent()}
            </Box>
        </Fade>
      </Modal>
    </div>
  );
}

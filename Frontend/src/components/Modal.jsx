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
  const {isOpen,modalContent} = useSelector((state)=>state.modal)
  const dispatch = useDispatch()

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
            <Typography id="transition-modal-title" variant="h6" component="h2">
              {modalContent.modalHeader && modalContent.modalHeader}
            </Typography>
            <Typography id="transition-modal-description" sx={{ mt: 2 }}>
              {modalContent.modalBody && modalContent.modalBody}
            </Typography>
            {modalContent.modalFooter && (
                <DialogActions>
                {modalContent.modalFooter}
                </DialogActions>
            )}
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

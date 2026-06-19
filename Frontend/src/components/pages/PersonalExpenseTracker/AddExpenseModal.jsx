import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Stack,
} from "@mui/material";

export default function AddExpenseModal({
  open,
  handleClose,
}) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
    >
      <DialogTitle>
        Add Expense
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} mt={1}>
          <TextField
            label="Title"
            fullWidth
          />

          <TextField
            label="Amount"
            fullWidth
          />

          <TextField
            label="Category"
            fullWidth
          />

          <Button
            variant="contained"
            size="large"
          >
            Save Expense
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleExpense } from '../../redux/expense/expenseSlice';
import { openModal } from '../../redux/modal/modalSlice';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Typography,
  Paper,
  Divider,
  Button,
  Box,
  IconButton
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';

const ExpenseDetails = () => {
  const navigate = useNavigate();
  const { id: expenseId } = useParams();
  const dispatch = useDispatch();

  const expenseDetails = useSelector(
    (state) => state.expenses.expenseDetail
  );

  const { UserGroupList } = useSelector(
    (state) => state.userGroups
  );

  const [groupId, setGroupId] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);

  /* ===============================
     Fetch Expense
  =============================== */
  useEffect(() => {
    if (!expenseId) return;
    dispatch(fetchSingleExpense(expenseId));
  }, [dispatch, expenseId]);

  /* ===============================
     Extract Group ID
  =============================== */
  useEffect(() => {
    if (!expenseDetails?.group) return;
    setGroupId(expenseDetails.group);
  }, [expenseDetails]);

  /* ===============================
     Fetch Group Members (LOCAL)
  =============================== */
  const fetchGroupById = useCallback(
    (id) => {
      const group = UserGroupList?.find(
        (item) => item.id === id
      );
      if (!group) return;
      setGroupMembers(group.members || []);
    },
    [UserGroupList]
  );

  useEffect(() => {
    if (!groupId) return;
    fetchGroupById(groupId);
  }, [groupId, fetchGroupById]);

  /* ===============================
     Guards (VERY IMPORTANT)
  =============================== */
  if (!expenseDetails || !expenseDetails._id) {
    return (
      <Typography sx={{ p: 2 }}>
        Loading expense details...
      </Typography>
    );
  }

  /* ===============================
     Handlers
  =============================== */
  const editExpenseHandler = () => {
    dispatch(
      openModal({
        modalType: 'ADD_EXPENSE',
        modalProps: {
          title: 'Edit Expense',
          groupId,
          groupMemberList: groupMembers,
          expenseDetail: expenseDetails
        }
      })
    );
  };

  const deleteExpenseHandler = () => {
    dispatch(
      openModal({
        modalType: 'DELETE_EXPENSE',
        modalProps: {
          title: 'Delete Expense',
          expenseId: expenseDetails._id,
          groupId
        }
      })
    );
  };

  /* ===============================
     UI
  =============================== */
  return (
    <Box
      // component={Paper}
      sx={{
        p: 3,
        width: '100%',
        height: '100%',
        mx: 'auto'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <IconButton size="small" onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Typography variant="h5" fontWeight={500} gutterBottom>
        {expenseDetails.description?.toUpperCase()}
      </Typography>

      <Typography variant="h4" color="primary" gutterBottom>
        ₹{expenseDetails.amount}
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Added by <strong>{expenseDetails.addedBy?.name}</strong> on{' '}
        <strong>
          {dayjs(expenseDetails.date).format('YYYY-MM-DD')}
        </strong>
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        <strong>{expenseDetails.paidBy?.name}</strong> paid ₹
        {expenseDetails.amount}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Split Details:
      </Typography>

      {expenseDetails.splitBetweenWithAmt?.map((member, idx) => (
        <Typography
          key={idx}
          variant="body2"
          color="text.secondary"
          sx={{ pl: 1 }}
        >
          {member.user?.name} owes ₹
          {Number(member.amount).toFixed(2)}
        </Typography>
      ))}

      <Box sx={{ display: 'flex', justifyContent: 'space-evenly', mt: 2 }}>
        <Button size="small" onClick={deleteExpenseHandler}>
          <DeleteIcon fontSize="small" sx={{ mr: 0.5 }} />
          DELETE EXPENSE
        </Button>

        <Button size="small" onClick={editExpenseHandler}>
          <EditIcon fontSize="small" sx={{ mr: 0.5 }} />
          EDIT EXPENSE
        </Button>
      </Box>
    </Box>
  );
};

export default ExpenseDetails;

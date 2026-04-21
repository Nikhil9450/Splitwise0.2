import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleExpense } from '../../redux/expense/expenseSlice';
import { openModal } from '../../redux/modal/modalSlice';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from "framer-motion";

import {
  Typography,
  Paper,
  Divider,
  Button,
  Box,
  IconButton,
  Avatar,
} from '@mui/material';

import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import dayjs from 'dayjs';

const fontStyle = {
  fontFamily: "Montserrat, sans-serif",
}
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
    setGroupMembers(expenseDetails.group.members|| []);

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
    console.log("groupMembers-------->",groupMembers);
    console.log("expenseDetails-------->",expenseDetails);
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
          description: expenseDetails.description,
          groupId
        }
      })
    );
  };

  /* ===============================
     UI
  =============================== */
  return (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    style={{
      height:'100%',
    }}
  > 
    <Box
      sx={{
        minHeight: '100%',
        bgcolor: '#DFE0DC',
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: '#25291C',
          color: '#DFE0DC',
          // borderRadius: 2,
          p: 3,
          mb: 3,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        {/* Back Button */}
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{ color: '#DFE0DC' }} />
          </IconButton>
        </Box>

        {/* Title */}
        <Typography
          sx={{
            color: '#129490',
            letterSpacing: 1,
            fontWeight: 600,
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          {expenseDetails.description?.toUpperCase()}
        </Typography>

        {/* Amount */}
        <Typography
          sx={{
            fontSize: '2rem',
            fontWeight: 700,
            mt: 1,
            color: '#FCFAF9',
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          ₹{expenseDetails.amount}
        </Typography>
      </Box>

      {/* Info Section */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: '2rem',
          p: 3,
          m: 2,
          border: '2px solid #25291C',
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <Typography sx={{ mb: 1, fontSize: '0.85rem',fontFamily: "Montserrat, sans-serif", fontWeight: 500, }}>
          Added by <strong>{expenseDetails.addedBy?.name}</strong>
        </Typography>

        <Typography sx={{ mb: 1, fontSize: '0.85rem' ,fontFamily: "Montserrat, sans-serif", fontWeight: 500,}}>
          Date:{" "}
          <strong>
            {dayjs(expenseDetails.date).format('DD MMM YYYY')}
          </strong>
        </Typography>

        <Typography sx={{ fontSize: '0.85rem' ,fontFamily: "Montserrat, sans-serif",fontWeight: 500, }}>
          <strong>{expenseDetails.paidBy?.name}</strong> paid ₹
          {expenseDetails.amount}
        </Typography>
      </Box>

      {/* Split Details */}
      <Box
        sx={{
          bgcolor: '#FFFFFF',
          borderRadius: '2rem',
          p: 3,
          m: 2,
          border: '2px solid #25291C',
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <Typography
          sx={{
            fontWeight: 600,
            mb: 2,
            color: '#129490',
            fontFamily: "Montserrat, sans-serif",
          }}
        >
          Split Details
        </Typography>

        {expenseDetails.splitBetweenWithAmt?.map((member, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              py: 1,
              borderBottom:
                idx !== expenseDetails.splitBetweenWithAmt.length - 1
                  ? '1px solid #DFE0DC'
                  : 'none',
            }}
          >
            <Typography sx={{ fontSize: '0.85rem' ,fontFamily: "Montserrat, sans-serif",fontWeight: 500}}>
              {member.user?.name}
            </Typography>

            <Typography
              sx={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: 600,
                fontSize: '0.85rem',
              }}
            >
              ₹{Number(member.amount).toFixed(2)}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Actions */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          mt: 3,
          fontFamily: "Montserrat, sans-serif",
          justifyContent: 'end',
          p:2
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          sx={{
            bgcolor: '#DFE0DC',
            color: '#25291C',
            borderRadius: '2rem',
            // fontWeight: 600,
            border: '2px solid #25291C',
            '&:hover': { bgcolor: '#FCFAF9' },
            height:'3rem',
            minWidth:'1rem',
            width:'3rem',
          }}
          onClick={deleteExpenseHandler}
        >
          <DeleteOutlineOutlinedIcon />
        </Button>

        <Button
          fullWidth
          variant="outlined"
          sx={{
            bgcolor: '#DFE0DC',
            color: '#25291C',
            borderRadius: '2rem',
            border: '2px solid #25291C',
            '&:hover': { bgcolor: '#FCFAF9' },
            height:'3rem',
            minWidth:'1rem',
            width:'3rem',
          }}
          onClick={editExpenseHandler}
        >
          <EditOutlinedIcon sx={{height:'1.5rem',width:'1.5rem', }} />
        </Button>
      </Box>
    </Box>
  </motion.div>
  );
};

export default ExpenseDetails;

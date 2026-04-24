import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchActivities } from '../../redux/Activity/activitySlice';
import { useParams } from 'react-router-dom';
import { Box, Typography, Avatar, List, ListItem } from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

const getIcon = (action) => {
  switch (action) {
    case "EXPENSE_ADD":
      return <ReceiptIcon fontSize="small" />;
    case "EXPENSE_DELETE":
      return <DeleteIcon fontSize="small" />;
    case "EXPENSE_EDIT":
      return <EditIcon fontSize="small" />;
    case "GROUP_CREATED":
      return <GroupAddIcon fontSize="small" />;
    default:
      return null;
  }
};

const getMessage = (item) => {
  const { action, details } = item;

  switch (action) {
    case "EXPENSE_ADD":
      return `${details.addedBy} added ₹${details.amount} for "${details.description}"`;
    case "EXPENSE_DELETE":
      return `${details.addedBy} deleted expense "${details.description}"`;
    case "EXPENSE_EDIT":
      return `${details.addedBy} updated expense "${details.description}" to ₹${details.amount}`;
    case "GROUP_CREATED":
      return `${details.addedBy} created group "${details.groupName}"`;
    default:
      return "Activity";
  }
};
const formatTime = (date) => {
  return new Date(date).toLocaleString();
};
const Activity = () => {
  const dispatch = useDispatch();
  const { groupId: groupId } = useParams();
  const { activities, loading, error } = useSelector((state) => state.activity);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchActivities(groupId));
    }
  }, [dispatch, groupId]);

  useEffect(() => {
    console.log('groupId:', groupId);
    console.log('Activities updated:', activities);
  }, [activities, groupId]);

  return (
 <Box
      sx={{
        p: 3,
        background: "#fff",
        maxWidth: 450,
        mx: "auto",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Title */}
      <Typography
        sx={{
          fontSize: "1.3rem",
          fontWeight: 600,
          mb: 2,
          fontFamily: "Montserrat, sans-serif",
          color: "#129490",
        }}
      >
        Activity
      </Typography>

      {/* List Container */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          background: "#f9fafb",
          borderRadius: "1.5rem",
          p: 1,
        }}
      >
        <List>
          {activities.data.map((item) => (
            <ListItem
              key={item._id}
              sx={{
                mb: 1,
                borderRadius: "1rem",
                background: "#fff",
                alignItems: "flex-start",
                gap: 1.5,
                px: 1.5,
                py: 1,
                transition: "0.2s",
                "&:hover": {
                  background: "#eef2ff",
                },
              }}
            >
              {/* Icon */}
              <Avatar
                sx={{
                  bgcolor: "#129490",
                  width: 32,
                  height: 32,
                }}
              >
                {getIcon(item.action)}
              </Avatar>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                <Typography
                  sx={{
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    fontFamily: "Montserrat, sans-serif",
                  }}
                >
                  {getMessage(item)}
                </Typography>

                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    color: "#888",
                    mt: 0.5,
                  }}
                >
                  {formatTime(item.createdAt)}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Activity;
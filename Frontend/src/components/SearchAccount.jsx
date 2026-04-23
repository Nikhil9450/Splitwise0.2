import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";

import { Box, Typography, IconButton, Button, CircularProgress, ClickAwayListener, Popper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import {
  deleteFriendRequest,
  removeFriend,
  acceptFriendRequest,
  sendFriendRequest,
} from "../redux/friendList/friendlistSlice";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/";

const SearchAccount = () => {
  const [emailToSearch, setEmailToSearch] = useState("");
  const [User, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const dispatch = useDispatch();
  const searchRef = useRef(null);

  const open = Boolean(anchorEl);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const searchUser = async () => {
    if (!emailToSearch) return;

    setAnchorEl(searchRef.current); // anchor to whole search bar
    setLoading(true);

    try {
      const user = await axios.get(`${API_URL}home/findUser`, {
        params: { email: emailToSearch },
        withCredentials: true,
      });

      setUser(user.data);
    } catch (error) {
      setUser(null);
      console.log("error in finding user --->", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("User ----------->", User);
  }, [User]);

  return (
    <>
      {/* SEARCH BAR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "end",
          mb: 2,
          fontFamily: "Montserrat, sans-serif",
        }}
      >
        <Box
          ref={searchRef}
          sx={{
            width: "100%",
            maxWidth: "20rem",
            display: "flex",
            alignItems: "center",
            borderRadius: "2rem",
            bgcolor: "#FFFFFF",
            px: .5,
            py: .5,
            border: "2px solid #129490",
            // boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <input
            type="email"
            placeholder="Find user by email"
            style={{
              border: "none",
              outline: "none",
              background: "none",
              flex: 1,
              marginLeft: 8,
              fontSize: "0.9rem",
              fontFamily: "Montserrat, sans-serif",
              color: "#25291C",
            }}
            onChange={(e) => setEmailToSearch(e.target.value)}
          />

          <IconButton
            onClick={searchUser}
            sx={{
              bgcolor: "#129490",
              borderRadius: "50%",
              width: 30,
              height: 30,
              "&:hover": { bgcolor: "#0f7f7c" },
            }}
          >
            {loading ? (
              <CircularProgress size={18} sx={{ color: "#FFFFFF" }} />
            ) : (
              <SearchIcon sx={{ color: "#FFFFFF", fontSize: 18 }} />
            )}
          </IconButton>
        </Box>
      </Box>

      {/* RESULT PANEL */}
      <Popper
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ zIndex: 1300 }}
      >
        <ClickAwayListener onClickAway={handleClose}>
          <Box
            sx={{
              width: "20rem",
              mt: 1,
              borderRadius: "2rem",
              border: "1px solid #2b2b2a",
              bgcolor: "#FFFFFF",
              padding: "0.5rem",
              boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            }}
          >
            {User ? (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                }}
              >
                {/* USER INFO */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      height: 40,
                      width: 40,
                      borderRadius: "50%",
                      bgcolor: "#DFE0DC",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 600,
                      color: "#25291C",
                    }}
                  >
                    {User.name?.charAt(0).toUpperCase()}
                  </Box>

                  <Box>
                    <Typography sx={{ fontWeight: 600, fontSize: "0.9rem" }}>
                      {User.name}
                    </Typography>

                    <Typography sx={{ fontSize: "0.75rem", color: "#9e9e9e" }}>
                      {User.email}
                    </Typography>
                  </Box>
                </Box>

                {/* ACTION BUTTON */}
                <Box>
                  {User.requestStatus === "incoming" && (
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        sx={{
                          bgcolor: "#129490",
                          borderRadius: "2rem",
                          fontSize: "0.7rem",
                        }}
                        onClick={(e) =>
                          {
                            e.stopPropagation();
                            dispatch(acceptFriendRequest(User.id))
                            setAnchorEl(null);
                          }
                        }
                      >
                        Accept
                      </Button>

                      <Button
                        size="small"
                        variant="outlined"
                        sx={{
                          borderColor: "#ED474A",
                          color: "#ED474A",
                          borderRadius: "2rem",
                          fontSize: "0.7rem",
                        }}
                        onClick={(e) =>
                          {
                            e.stopPropagation();
                            dispatch(deleteFriendRequest(User.id))
                            setAnchorEl(null);
                          }
                        }
                      >
                        Delete
                      </Button>
                    </Box>
                  )}

                  {User.requestStatus === "outgoing" && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#ED474A",
                        color: "#ED474A",
                        borderRadius: "2rem",
                        fontSize: "0.7rem",
                      }}
                      onClick={(e) =>
                        {
                          e.stopPropagation();
                          dispatch(deleteFriendRequest(User.id))
                          setAnchorEl(null);
                        }
                      }
                    >
                      Cancel
                    </Button>
                  )}

                  {User.requestStatus === "alreadyFriends" && (
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: "#ED474A",
                        color: "#ED474A",
                        borderRadius: "2rem",
                        fontSize: "0.7rem",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeFriend(User.id));
                        setAnchorEl(null);
                      }}
                    >
                      Remove
                    </Button>
                  )}

                  {User.requestStatus === "none" && (
                    <Button
                      size="small"
                      variant="contained"
                      sx={{
                        bgcolor: "#129490",
                        borderRadius: "2rem",
                        fontSize: "0.7rem",
                      }}
                      onClick={(e) =>
                       { 
                        e.stopPropagation();
                        dispatch(sendFriendRequest(User.id))
                        setAnchorEl(null)
                        }
                      }
                    >
                      Add
                    </Button>
                  )}
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography sx={{ fontSize: "0.85rem", color: "#9e9e9e" }}>
                  User not found
                </Typography>
              </Box>
            )}
          </Box>
        </ClickAwayListener>
      </Popper>
    </>
  );
};

export default SearchAccount;
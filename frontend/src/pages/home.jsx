import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
  AppBar,
  Toolbar,
} from "@mui/material";
import RestoreIcon from "@mui/icons-material/Restore";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../contexts/AuthContext";

function HomeComponent() {
  const navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");

  const { addToUserHistory } = useContext(AuthContext);

  const handleJoinVideoCall = async () => {
    await addToUserHistory(meetingCode);
    navigate(`/${meetingCode}`);
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: "#000000",
          borderBottom: "1px solid #1a1a1a",
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#ffffff" }}
          >
            BaatChit
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => navigate("/history")}
              sx={{ color: "#e5e7eb" }}
            >
              <RestoreIcon />
            </IconButton>

            <Button
              startIcon={<LogoutIcon />}
              sx={{ color: "#e5e7eb" }}
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/auth");
              }}
            >
              Logout
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          px: 2,
        }}
      >
        <Box sx={{ textAlign: "center", maxWidth: "520px" }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 600,
              color: "#ffffff",
              mb: 2,
            }}
          >
            Start a Video Call
          </Typography>

          <Typography
            sx={{
              color: "#a1a1aa",
              mb: 3,
              fontSize: "1rem",
              lineHeight: 1.6,
            }}
          >
            BaatChit lets you connect instantly through secure, high-quality
            video calls. Share moments, collaborate, and communicate — all in
            one simple place.
          </Typography>

          <Typography
            sx={{
              color: "#71717a",
              mb: 4,
              fontSize: "0.95rem",
            }}
          >
            Enter a meeting code below to join an existing conversation.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
            }}
          >
            <TextField
              label="Meeting Code"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value)}
              sx={inputStyle}
            />

            <Button
              variant="contained"
              startIcon={<VideoCallIcon />}
              onClick={handleJoinVideoCall}
              sx={{
                px: 3,
                backgroundColor: "#ffffff",
                color: "#000000",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#e5e7eb",
                },
              }}
            >
              Join
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}

const inputStyle = {
  "& input": { color: "#ffffff" },
  "& label": { color: "#a1a1aa" },
  "& fieldset": { borderColor: "#1a1a1a" },
};

export default withAuth(HomeComponent);

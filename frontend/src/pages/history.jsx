import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  Snackbar,
  Alert,
} from "@mui/material";

import HomeIcon from "@mui/icons-material/Home";
import HistoryIcon from "@mui/icons-material/History";

export default function History() {
  const { getHistoryOfUser } = useContext(AuthContext);
  const [meetings, setMeetings] = useState([]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "error",
  });

  const routeTo = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await getHistoryOfUser();
        setMeetings(history);
      } catch (err) {
        setToast({
          open: true,
          message:
            err?.response?.data?.message ||
            "Failed to load meeting history",
          severity: "error",
        });
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          <Typography sx={{ color: "#ffffff", fontWeight: 600 }}>
            Meeting History
          </Typography>

          <IconButton
            sx={{ color: "#e5e7eb" }}
            onClick={() => routeTo("/home")}
          >
            <HomeIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          backgroundColor: "#000000",
          px: { xs: 2, md: 6 },
          py: 4,
        }}
      >
        {meetings.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              mt: 8,
              color: "#a1a1aa",
            }}
          >
            <HistoryIcon sx={{ fontSize: 48, mb: 2 }} />
            <Typography variant="h6">No meeting history yet</Typography>
            <Typography fontSize="0.9rem">
              Your joined meetings will appear here.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 3,
            }}
          >
            {meetings.map((e, i) => (
              <Card
                key={i}
                variant="outlined"
                sx={{
                  backgroundColor: "#020617",
                  borderColor: "#1a1a1a",
                  color: "#ffffff",
                }}
              >
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#a1a1aa",
                      mb: 1,
                    }}
                  >
                    Meeting Code
                  </Typography>

                  <Typography sx={{ fontWeight: 600, mb: 2 }}>
                    {e.meetingCode}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#71717a",
                    }}
                  >
                    Date: {formatDate(e.date)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={toast.severity} sx={{ width: "100%" }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}

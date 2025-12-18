import React from "react";
import { Box, Button, Typography, AppBar, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

export default function LandingPage() {
  const router = useNavigate();

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

          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Typography
              sx={navItem}
              onClick={() => router("/aljk23")}
            >
              Join as Guest
            </Typography>

            <Typography
              sx={navItem}
              onClick={() => router("/auth")}
            >
              Register
            </Typography>

            <Button
              variant="outlined"
              sx={{
                color: "#ffffff",
                borderColor: "#1a1a1a",
                "&:hover": {
                  borderColor: "#ffffff",
                },
              }}
              onClick={() => router("/auth")}
            >
              Login
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
          px: { xs: 3, md: 8 },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            maxWidth: "720px",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              color: "#ffffff",
              mb: 2,
            }}
          >
            Connect with your loved ones
          </Typography>

          <Typography
            sx={{
              color: "#a1a1aa",
              fontSize: "1.1rem",
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            BaatChit helps you stay close no matter the distance.  
            Chat, talk, and connect instantly with secure video calls —
            simple, fast, and reliable.
          </Typography>

          <Button
            component={Link}
            to="/auth"
            variant="contained"
            sx={{
              px: 4,
              py: 1.4,
              fontSize: "1rem",
              backgroundColor: "#ffffff",
              color: "#000000",
              fontWeight: 600,
              "&:hover": {
                backgroundColor: "#e5e7eb",
              },
            }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </>
  );
}

const navItem = {
  color: "#a1a1aa",
  cursor: "pointer",
  fontSize: "0.95rem",
  "&:hover": {
    color: "#ffffff",
  },
};

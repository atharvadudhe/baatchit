import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";

import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { AuthContext } from "../contexts/AuthContext";
import { useContext } from "react";

const Authentication = () => {
  const { handleLogin, handleRegister } = useContext(AuthContext);

  const [formState, setFormState] = useState("LOGIN"); // LOGIN | SIGNUP
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = (message, severity = "success") => {
    setToast({ open: true, message, severity });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (formState === "LOGIN") {
        await handleLogin(username, password);
      } else {
        const res = await handleRegister(name, username, password);
        showToast(res || "Account created successfully");
        setFormState("LOGIN");
        setName("");
        setUsername("");
        setPassword("");
      }
    } catch (err) {
      showToast(
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ minHeight: "100vh", display: "flex" }}>
        <Box
          sx={{
            width: "420px",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#020617",
            color: "#e5e7eb",
            px: 4,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <ChatBubbleOutlineIcon
              sx={{ fontSize: 36, color: "#38bdf8", mb: 1 }}
            />

            <Typography
              variant="h4"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              {formState === "LOGIN" ? "Welcome to BaatChit" : "Create Account"}
            </Typography>

            <Typography sx={{ color: "#9ca3af", mb: 4 }}>
              {formState === "LOGIN"
                ? "Sign in to continue chatting"
                : "Start conversations instantly"}
            </Typography>

            {formState === "SIGNUP" && (
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={inputStyle}
              />
            )}

            <TextField
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={inputStyle}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={inputStyle}
            />

            <Button
              fullWidth
              startIcon={
                formState === "LOGIN" ? <LoginIcon /> : <PersonAddIcon />
              }
              onClick={handleSubmit}
              disabled={loading}
              sx={primaryButton}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : formState === "LOGIN" ? (
                "Login"
              ) : (
                "Sign Up"
              )}
            </Button>

            <Typography sx={{ mt: 3, fontSize: "0.9rem" }}>
              {formState === "LOGIN"
                ? "New to BaatChit?"
                : "Already have an account?"}{" "}
              <Button
                variant="text"
                size="small"
                onClick={() =>
                  setFormState(formState === "LOGIN" ? "SIGNUP" : "LOGIN")
                }
                sx={{ color: "#38bdf8", textTransform: "none" }}
              >
                {formState === "LOGIN" ? "Create account" : "Login"}
              </Button>
            </Typography>
          </Box>
        </Box>

        <Box sx={{ flex: 1, display: { xs: "none", md: "flex" } }}>
          <Box
            component="img"
            src="https://images.unsplash.com/photo-1525182008055-f88b95ff7980"
            alt="Chat"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </Box>
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
};

const inputStyle = {
  mb: 2,
  "& input": { color: "#e5e7eb" },
  "& label": { color: "#9ca3af" },
  "& fieldset": { borderColor: "#1f2933" },
};

const primaryButton = {
  py: 1.2,
  mt: 1,
  backgroundColor: "#38bdf8",
  color: "#020617",
  fontWeight: 600,
  "&:hover": {
    backgroundColor: "#0ea5e9",
  },
};

export default Authentication;

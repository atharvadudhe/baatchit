import React from "react";
import { Box, Button, Typography, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

const GITHUB_REPO_URL = "https://github.com/atharvadudhe/baatchit";

export default function LandingPage() {
  const router = useNavigate();

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "#000", borderBottom: "1px solid #1a1a1a" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontWeight: 600, color: "#fff" }}>
            BaatChit
          </Typography>

          <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
            <Typography sx={navItem} onClick={() => router("/aljk23")}>
              Join as Guest
            </Typography>
            <Typography sx={navItem} onClick={() => router("/auth")}>
              Register
            </Typography>
            <Button
              variant="outlined"
              sx={outlineBtn}
              onClick={() => router("/auth")}
            >
              Login
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ backgroundColor: "#000", color: "#fff" }}>
        <Section center>
          <Typography variant="h2" sx={heroHeading}>
            Real-Time Conversations,
            <br /> Made Simple.
          </Typography>

          <Typography sx={heroSub}>
            Seamless video calls, instant messaging, and screen sharing —
            powered by modern real-time web technologies.
            <br />
            Connect. Collaborate. Communicate — without friction.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 4,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <PrimaryBtn onClick={() => router("/aljk23")}>
              Start a Meeting
            </PrimaryBtn>
          </Box>
        </Section>

        <Section>
          <Typography sx={sectionTitle}>What is BaatChit?</Typography>

          <Typography sx={paragraph}>
            BaatChit is a real-time communication platform built using
            <strong> WebRTC, WebSockets, and Socket.IO</strong>, designed to
            make online meetings fast, secure, and effortless.
          </Typography>

          <Typography sx={paragraph}>
            From high-quality video & audio calls to in-call chat, screen
            sharing, and meeting history — everything works together in a single
            smooth experience.
          </Typography>

          <Typography sx={muted}>
            Built as a full-stack project to showcase real-time system design
            and scalable communication architecture.
          </Typography>
        </Section>

        <Section>
          <Typography sx={sectionTitle}>Features that feel instant</Typography>

          <Box sx={featureGrid}>
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} />
            ))}
          </Box>
        </Section>

        <Section>
          <Typography sx={sectionTitle}>How BaatChit Works</Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {steps.map((step, i) => (
              <Box key={i} sx={stepBox}>
                <Typography sx={stepIndex}>0{i + 1}</Typography>
                <Box>
                  <Typography sx={stepTitle}>{step.title}</Typography>
                  <Typography sx={paragraph}>{step.desc}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Section>

        <Section>
          <Typography sx={sectionTitle}>Built with modern tech</Typography>

          {tech.map((t, i) => (
            <Typography key={i} sx={paragraph}>
              <strong>{t.label}:</strong> {t.value}
            </Typography>
          ))}
        </Section>

        <Section>
          <Typography sx={sectionTitle}>Why BaatChit?</Typography>

          {why.map((w, i) => (
            <Typography key={i} sx={paragraph}>
              • {w}
            </Typography>
          ))}

          <Typography sx={muted}>
            Built from scratch to deeply understand how real-time systems work
            behind the scenes.
          </Typography>
        </Section>

        <Section center>
          <Typography sx={sectionTitle}>
            Experience real-time communication the modern way
          </Typography>

          <Typography sx={heroSub}>
            Try BaatChit or explore the full implementation on GitHub.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 3,
              justifyContent: "center",
            }}
          >
            <SecondaryBtn
              onClick={() => window.open(GITHUB_REPO_URL, "_blank")}
            >
              GitHub Repository
            </SecondaryBtn>
          </Box>

          <Typography sx={heroSub}>
            Made with ❤️ by{" "}
            <a
              href="https://github.com/atharvadudhe"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Atharva Dudhe
            </a>
          </Typography>
        </Section>
      </Box>
    </>
  );
}

const Section = ({ children, center }) => (
  <Box
    sx={{
      maxWidth: "1000px",
      mx: "auto",
      px: { xs: 3, md: 6 },
      py: { xs: 7, md: 10 },
      textAlign: center ? "center" : "left",
    }}
  >
    {children}
  </Box>
);

const FeatureCard = ({ title, desc }) => (
  <Box
    sx={{
      border: "1px solid #1a1a1a",
      borderRadius: "14px",
      p: 3,
      backgroundColor: "#050505",
      transition: "all 0.3s",
      "&:hover": {
        borderColor: "#fff",
        transform: "translateY(-4px)",
      },
    }}
  >
    <Typography sx={{ fontWeight: 600, mb: 1 }}>{title}</Typography>
    <Typography sx={paragraph}>{desc}</Typography>
  </Box>
);

const heroHeading = {
  fontWeight: 700,
  lineHeight: 1.2,
  mb: 2,
};

const heroSub = {
  color: "#a1a1aa",
  fontSize: "1.1rem",
  lineHeight: 1.7,
};

const sectionTitle = {
  fontSize: "1.8rem",
  fontWeight: 600,
  mb: 3,
};

const paragraph = {
  color: "#d4d4d8",
  lineHeight: 1.7,
  mb: 1.5,
};

const muted = {
  color: "#71717a",
  fontSize: "0.95rem",
  mt: 2,
};

const featureGrid = {
  display: "grid",
  gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
  gap: 3,
};

const stepBox = {
  display: "flex",
  gap: 3,
  alignItems: "flex-start",
};

const stepIndex = {
  fontSize: "1.5rem",
  fontWeight: 700,
  color: "#52525b",
};

const stepTitle = {
  fontWeight: 600,
  mb: 0.5,
};

const navItem = {
  color: "#a1a1aa",
  cursor: "pointer",
  "&:hover": { color: "#fff" },
};

const outlineBtn = {
  color: "#fff",
  borderColor: "#1a1a1a",
  "&:hover": { borderColor: "#fff" },
};

const PrimaryBtn = ({ children, ...props }) => (
  <Button
    {...props}
    variant="contained"
    sx={{
      px: 4,
      py: 1.4,
      backgroundColor: "#fff",
      color: "#000",
      fontWeight: 600,
      "&:hover": { backgroundColor: "#e5e7eb" },
    }}
  >
    {children}
  </Button>
);

const SecondaryBtn = ({ children, ...props }) => (
  <Button
    {...props}
    variant="outlined"
    sx={{
      px: 4,
      py: 1.4,
      color: "#fff",
      borderColor: "#1a1a1a",
      "&:hover": { borderColor: "#fff" },
    }}
  >
    {children}
  </Button>
);

const features = [
  {
    title: "HD Video & Audio Calling",
    desc: "Crystal-clear peer-to-peer video and audio powered by WebRTC with minimal latency.",
  },
  {
    title: "Screen Sharing",
    desc: "Present your screen instantly during meetings for collaboration and demos.",
  },
  {
    title: "In-Call Chat",
    desc: "Send messages without interrupting the conversation — real-time and reliable.",
  },
  {
    title: "Meeting History",
    desc: "Quickly revisit your recent meetings without remembering room links.",
  },
  {
    title: "Real-Time Connection Handling",
    desc: "Socket.IO ensures instant joins, leaves, and updates across participants.",
  },
  {
    title: "Clean Call Controls",
    desc: "Mute, unmute, stop video, and end calls with consistent behavior for everyone.",
  },
];

const steps = [
  {
    title: "Create or Join a Meeting",
    desc: "Start a new meeting or instantly join one using a unique meeting link.",
  },
  {
    title: "Establish Real-Time Connection",
    desc: "WebRTC handles peer-to-peer connections while Socket.IO manages signaling.",
  },
  {
    title: "Communicate Freely",
    desc: "Talk via video or audio, chat in real time, and collaborate seamlessly.",
  },
  {
    title: "Share Your Screen",
    desc: "Present your screen with a single click during active meetings.",
  },
  {
    title: "End & Save",
    desc: "End the call cleanly — your meeting is automatically saved in history.",
  },
];

const tech = [
  { label: "Frontend", value: "React, HTML, CSS, JavaScript" },
  { label: "Backend", value: "Node.js, Express" },
  {
    label: "Real-Time",
    value: "WebRTC, Socket.IO, WebSockets",
  },
  {
    label: "Architecture",
    value: "Peer-to-Peer with signaling server",
  },
];

const why = [
  "Minimal, distraction-free UI",
  "Fast peer-to-peer connections",
  "Developer-focused architecture",
  "Designed for real-time performance",
];

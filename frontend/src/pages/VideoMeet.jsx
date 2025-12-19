import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Badge, IconButton, TextField } from "@mui/material";
import { Button } from "@mui/material";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ChatIcon from "@mui/icons-material/Chat";

import { Box, Typography, Paper } from "@mui/material";

const server_url = process.env.REACT_APP_BACKEND_URL;

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeetComponent() {
  var socketRef = useRef();
  let socketIdRef = useRef();

  let localVideoref = useRef();

  let [videoAvailable, setVideoAvailable] = useState(true);

  let [audioAvailable, setAudioAvailable] = useState(true);

  let [video, setVideo] = useState(true);

  let [audio, setAudio] = useState();

  let [screen, setScreen] = useState();

  let [showModal, setModal] = useState(true);

  let [screenAvailable, setScreenAvailable] = useState();

  let [messages, setMessages] = useState([]);

  let [message, setMessage] = useState("");

  let [newMessages, setNewMessages] = useState(0);

  let [askForUsername, setAskForUsername] = useState(true);

  let [username, setUsername] = useState("");

  const videoRef = useRef([]);

  let [videos, setVideos] = useState([]);

  // TODO
  // if(isChrome() === false) {

  // }

  useEffect(() => {
    getPermissions();
  }, []);

  let getDislayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then(getDislayMediaSuccess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };

  const getPermissions = async () => {
    try {
      const videoPermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      if (videoPermission) {
        setVideoAvailable(true);
        console.log("Video permission granted");
      } else {
        setVideoAvailable(false);
        console.log("Video permission denied");
      }

      const audioPermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      if (audioPermission) {
        setAudioAvailable(true);
        console.log("Audio permission granted");
      } else {
        setAudioAvailable(false);
        console.log("Audio permission denied");
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAvailable || audioAvailable) {
        const userMediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAvailable,
          audio: audioAvailable,
        });
        if (userMediaStream) {
          window.localStream = userMediaStream;
          if (localVideoref.current) {
            localVideoref.current.srcObject = userMediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   useEffect(() => {
  //     if (video !== undefined && audio !== undefined) {
  //       getUserMedia();
  //       console.log("SET STATE HAS ", video, audio);
  //     }
  //   }, [video, audio]);

  useEffect(() => {
    if (localVideoref.current && window.localStream) {
      localVideoref.current.srcObject = window.localStream;
    }
  }, [askForUsername]);

  let getMedia = () => {
    setVideo(videoAvailable);
    setAudio(audioAvailable);
    connectToSocketServer();
  };

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }

    window.localStream = stream;
    localVideoref.current.srcObject = stream;
    for (let id in connections) {
      if (id === socketIdRef.current) continue;

      try {
        window.localStream.getTracks().forEach((track) => {
          connections[id].addTrack(track, window.localStream);
        });
      } catch (e) {
        try {
          connections[id].addStream(window.localStream);
        } catch (err) {}
      }

      connections[id].createOffer().then((description) => {
        console.log(description);
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketRef.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }

    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localVideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }

          let blackSilence = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackSilence();
          localVideoref.current.srcObject = window.localStream;

          for (let id in connections) {
            try {
              window.localStream.getTracks().forEach((t) => {
                connections[id].addTrack(t, window.localStream);
              });
            } catch (e) {
              try {
                connections[id].addStream(window.localStream);
              } catch (err) {}
            }

            connections[id].createOffer().then((description) => {
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let getUserMedia = () => {
    if ((video && videoAvailable) || (audio && audioAvailable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => console.log(e));
    } else {
      try {
        let tracks = localVideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {}
    }
  };

  let getDislayMediaSuccess = async (screenStream) => {
    try {
      window.localStream?.getTracks().forEach((track) => track.stop());
      const micStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];
      const micTrack = micStream.getAudioTracks()[0];
      const combinedStream = new MediaStream([screenTrack, micTrack]);

      window.localStream = combinedStream;
      localVideoref.current.srcObject = combinedStream;
      for (let id in connections) {
        if (id === socketIdRef.current) continue;

        try {
          combinedStream.getTracks().forEach((track) => {
            connections[id].addTrack(track, combinedStream);
          });
        } catch (e) {
          try {
            connections[id].addStream(combinedStream);
          } catch (err) {}
        }

        const offer = await connections[id].createOffer();
        await connections[id].setLocalDescription(offer);

        socketRef.current.emit(
          "signal",
          id,
          JSON.stringify({ sdp: connections[id].localDescription })
        );
      }
      screenTrack.onended = () => {
        setScreen(false);
        stopScreenSharing();
      };
    } catch (error) {
      console.error("Screen share error:", error);
    }
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdRef.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketRef.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log(e));
      }

      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };

  let connectToSocketServer = () => {
    socketRef.current = io.connect(server_url, { secure: false });

    socketRef.current.on("signal", gotMessageFromServer);

    socketRef.current.on("connect", () => {
      socketRef.current.emit("join-call", window.location.href);
      socketIdRef.current = socketRef.current.id;

      socketRef.current.on("chat-message", addMessage);

      socketRef.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });

      socketRef.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );
          connections[socketListId].onicecandidate = function (event) {
            if (event.candidate != null) {
              socketRef.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          // Use modern ontrack handler and addTrack; keep addStream fallback
          connections[socketListId].ontrack = (event) => {
            const remoteStream = event.streams && event.streams[0];
            console.log("RECEIVED TRACK FOR:", socketListId, remoteStream);

            let videoExists = videoRef.current.find(
              (video) => video.socketId === socketListId
            );

            if (videoExists) {
              setVideos((videos) => {
                const updatedVideos = videos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: remoteStream }
                    : video
                );
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            } else {
              let newVideo = {
                socketId: socketListId,
                stream: remoteStream,
                autoplay: true,
                playsinline: true,
              };

              setVideos((videos) => {
                const updatedVideos = [...videos, newVideo];
                videoRef.current = updatedVideos;
                return updatedVideos;
              });
            }
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            try {
              window.localStream.getTracks().forEach((track) => {
                connections[socketListId].addTrack(track, window.localStream);
              });
            } catch (e) {
              try {
                connections[socketListId].addStream(window.localStream);
              } catch (err) {}
            }
          } else {
            let blackSilence = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackSilence();
            try {
              window.localStream.getTracks().forEach((track) => {
                connections[socketListId].addTrack(track, window.localStream);
              });
            } catch (e) {
              try {
                connections[socketListId].addStream(window.localStream);
              } catch (err) {}
            }
          }
        });

        if (id === socketIdRef.current) {
            for (let id2 in connections) {
            if (id2 === socketIdRef.current) continue;

            try {
              window.localStream.getTracks().forEach((t) => {
                connections[id2].addTrack(t, window.localStream);
              });
            } catch (e) {
              try {
                connections[id2].addStream(window.localStream);
              } catch (err) {}
            }

            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketRef.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };

  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();
    let dst = oscillator.connect(ctx.createMediaStreamDestination());
    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
  };
  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enabled: false });
  };

  let handleVideo = () => {
    setVideo((prev) => {
      toggleVideoTrack(!prev);
      return !prev;
    });
  };

  let handleAudio = () => {
    setAudio((prev) => {
      toggleAudioTrack(!prev);
      return !prev;
    });
  };

  useEffect(() => {
    if (screen === true) {
      getDislayMedia();
    }
  }, [screen]);

  let handleScreen = () => {
    if (screen) {
      setScreen(false);
      stopScreenSharing();
    } else {
      setScreen(true);
    }
  };

  let handleEndCall = () => {
    try {
      let tracks = localVideoref.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    } catch (e) {}
    window.location.href = "/";
  };

  let openChat = () => {
    setModal(true);
    setNewMessages(0);
  };
  let closeChat = () => {
    setModal(false);
  };
  let handleMessage = (e) => {
    setMessage(e.target.value);
  };

  const addMessage = (data, sender, socketIdSender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: sender, data: data },
    ]);
    if (socketIdSender !== socketIdRef.current) {
      setNewMessages((prevNewMessages) => prevNewMessages + 1);
    }
  };

  let sendMessage = () => {
    console.log(socketRef.current);
    socketRef.current.emit("chat-message", message, username);
    setMessage("");
  };

  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };

  const stopScreenSharing = () => {
    if (!window.localStream) return;
    window.localStream.getTracks().forEach((track) => track.stop());
    navigator.mediaDevices
      .getUserMedia({ video: videoAvailable, audio: audioAvailable })
      .then((stream) => {
        window.localStream = stream;
        localVideoref.current.srcObject = stream;
        for (let id in connections) {
          if (id === socketIdRef.current) continue;

          try {
            stream.getTracks().forEach((track) => {
              connections[id].addTrack(track, stream);
            });
          } catch (e) {
            try {
              connections[id].addStream(stream);
            } catch (err) {}
          }

          connections[id].createOffer().then((description) => {
            connections[id].setLocalDescription(description).then(() => {
              socketRef.current.emit(
                "signal",
                id,
                JSON.stringify({ sdp: connections[id].localDescription })
              );
            });
          });
        }
      })
      .catch(console.error);
  };

  const toggleAudioTrack = (enabled) => {
    if (!window.localStream) return;

    window.localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  const toggleVideoTrack = (enabled) => {
    if (!window.localStream) return;

    window.localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
  };

  return (
    <div>
      {askForUsername === true ? (
        <Box
          sx={{
            minHeight: "100vh",
            backgroundColor: "#000000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ color: "#ffffff" }}>
            Enter into Lobby
          </Typography>

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={inputStyle}
          />

          <Button
            variant="contained"
            onClick={connect}
            sx={{
              backgroundColor: "#ffffff",
              color: "#000000",
              fontWeight: 600,
            }}
          >
            Connect
          </Button>

          <div>
            <video
              ref={localVideoref}
              autoPlay
              muted
              style={{ width: "300px", borderRadius: "10px" }}
            />
          </div>
        </Box>
      ) : (
        <Box
          sx={{
            position: "relative",
            height: "100vh",
            backgroundColor: "#000000",
          }}
        >
          {showModal ? (
            <Box
              sx={{
                position: "absolute",
                height: "90vh",
                right: 0,
                backgroundColor: "#ffffff",
                borderRadius: "10px",
                width: "30vw",
                paddingInline: "20px",
                zIndex: 10,
              }}
            >
              <Box sx={{ position: "relative", height: "100%" }}>
                <Typography variant="h5">Chat</Typography>

                <Box sx={{ overflowY: "auto", mt: 2 }}>
                  {messages.length !== 0 ? (
                    messages.map((item, index) => (
                      <div style={{ marginBottom: "20px" }} key={index}>
                        <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                        <p>{item.data}</p>
                      </div>
                    ))
                  ) : (
                    <p>No Messages Yet</p>
                  )}
                </Box>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    display: "flex",
                    gap: 1,
                  }}
                >
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    label="Enter Your chat"
                    fullWidth
                  />
                  <Button variant="contained" onClick={sendMessage}>
                    Send
                  </Button>
                </Box>
              </Box>
            </Box>
          ) : null}
          <Box
            sx={{
              position: "absolute",
              width: "100vw",
              bottom: 0,
              textAlign: "center",
            }}
          >
            <IconButton onClick={handleVideo} sx={{ color: "white" }}>
              {video ? (
                <VideocamIcon fontSize="large" />
              ) : (
                <VideocamOffIcon fontSize="large" />
              )}
            </IconButton>

            <IconButton onClick={handleEndCall} sx={{ color: "red" }}>
              <CallEndIcon fontSize="large" />
            </IconButton>

            <IconButton onClick={handleAudio} sx={{ color: "white" }}>
              {audio ? (
                <MicIcon fontSize="large" />
              ) : (
                <MicOffIcon fontSize="large" />
              )}
            </IconButton>

            {screenAvailable ? (
              <IconButton onClick={handleScreen} sx={{ color: "white" }}>
                {screen ? (
                  <ScreenShareIcon fontSize="large" />
                ) : (
                  <StopScreenShareIcon fontSize="large" />
                )}
              </IconButton>
            ) : null}

            <Badge badgeContent={newMessages} max={999} color="primary">
              <IconButton
                onClick={() => setModal(!showModal)}
                sx={{ color: "white" }}
              >
                <ChatIcon fontSize="large" />
              </IconButton>
            </Badge>
          </Box>

          <video
            ref={localVideoref}
            autoPlay
            muted
            style={{
              position: "absolute",
              bottom: "10vh",
              height: "20vh",
              left: 0,
              borderRadius: "20px",
            }}
          />
          <Box
            sx={{
              display: "flex",
              padding: "10px",
              gap: "10px",
            }}
          >
            {videos.map((video) => (
              <div key={video.socketId}>
                <video
                  data-socket={video.socketId}
                  ref={(ref) => {
                    if (ref && video.stream) {
                      ref.srcObject = video.stream;
                    }
                  }}
                  autoPlay
                  style={{
                    width: "40vw",
                    height: "20vh",
                    minWidth: "30vw",
                    borderRadius: "10px",
                  }}
                />
              </div>
            ))}
          </Box>
        </Box>
      )}
    </div>
  );
}

const inputStyle = {
  "& input": { color: "#ffffff" },
  "& label": { color: "#a1a1aa" },
  "& fieldset": { borderColor: "#1a1a1a" },
};

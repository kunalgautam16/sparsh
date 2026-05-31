const express = require("express");

const cors = require("cors");

require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes =
    require("./routes/authRoutes");

const testRoutes =
    require("./routes/testRoutes");

const app = express();

connectDB();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRoutes);

app.use("/api/test", testRoutes);

app.get("/", (req, res)=>{

    res.send("Sparsh Server Running");

});

const http = require("http");

const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "https://sparsh-cig6.onrender.com//api",
        methods: ["GET", "POST"]
    }
});

const roomUsers = {};

const roomHosts = {};

io.on("connection", (socket)=>{

    console.log(
        "User Connected:",
        socket.id
    );

    socket.on(
        "join-room",
        ({
            roomId,
            peerId,
            username
        })=>{

            socket.join(roomId);

            socket.roomId = roomId;

            socket.peerId = peerId;

            socket.username = username;

            if(!roomHosts[roomId]){

                roomHosts[roomId] =
                    socket.id;

            }

            const isHost =
                roomHosts[roomId] ===
                socket.id;

            if(!roomUsers[roomId]){

                roomUsers[roomId] = [];

            }

            const alreadyExists =
                roomUsers[roomId].find(
                    (user)=>
                        user.peerId === peerId
                );

            if(!alreadyExists){

                roomUsers[roomId].push({
                    socketId: socket.id,
                    peerId,
                    username,
                    isHost
                });

            }

            io.to(roomId).emit(
                "participants",
                roomUsers[roomId]
            );

            socket.to(roomId).emit(
                "user-joined",
                {
                    peerId,
                    username
                }
            );

            console.log(
                `${username} joined room ${roomId}`
            );

        }
    );

    socket.on(
        "send-message",
        ({
            roomId,
            message
        })=>{

            io.to(roomId).emit(
                "receive-message",
                {
                    sender:
                        socket.username ||
                        "Anonymous",

                    message
                }
            );

        }
    );

    socket.on(
        "gesture",
        ({
            roomId,
            gesture
        })=>{

            socket.to(roomId).emit(
                "gesture-received",
                {
                    gesture,
                    username:
                        socket.username
                }
            );

        }
    );

    socket.on(
        "subtitle",
        ({
            roomId,
            subtitle
        })=>{

            socket.to(roomId).emit(
                "receive-subtitle",
                subtitle
            );

        }
    );

    socket.on(
        "participant-media",
        ({
            roomId,
            type,
            value
        })=>{

            socket.to(roomId).emit(
                "participant-media-update",
                {
                    peerId:
                        socket.peerId,

                    type,
                    value
                }
            );

        }
    );

    socket.on(
        "screen-share",
        ({
            roomId,
            username
        })=>{

            socket.to(roomId).emit(
                "screen-share-started",
                username
            );

        }
    );

    socket.on(
        "screen-share-stop",
        ({
            roomId
        })=>{

            socket.to(roomId).emit(
                "screen-share-stopped"
            );

        }
    );

    socket.on(
        "typing",
        ({
            roomId,
            username
        })=>{

            socket.to(roomId).emit(
                "typing",
                username
            );

        }
    );

    socket.on(
        "emoji-reaction",
        ({
            roomId,
            emoji,
            username
        })=>{

            io.to(roomId).emit(
                "emoji-reaction",
                {
                    emoji,
                    username
                }
            );

        }
    );

    socket.on(
        "mute-user",
        ({
            roomId,
            targetPeerId
        })=>{

            const room =
                roomUsers[roomId];

            if(!room){
                return;
            }

            const hostSocketId =
                roomHosts[roomId];

            if(socket.id !== hostSocketId){
                return;
            }

            const targetUser =
                room.find(
                    (user)=>
                        user.peerId ===
                        targetPeerId
                );

            if(!targetUser){
                return;
            }

            io.to(
                targetUser.socketId
            ).emit(
                "force-mute"
            );

            console.log(
                `${socket.username} muted ${targetUser.username}`
            );

        }
    );

    socket.on(
        "kick-user",
        ({
            roomId,
            targetPeerId
        })=>{

            const room =
                roomUsers[roomId];

            if(!room){
                return;
            }

            const hostSocketId =
                roomHosts[roomId];

            if(socket.id !== hostSocketId){
                return;
            }

            const targetUser =
                room.find(
                    (user)=>
                        user.peerId ===
                        targetPeerId
                );

            if(!targetUser){
                return;
            }

            io.to(
                targetUser.socketId
            ).emit(
                "kicked"
            );

            io.sockets.sockets
                .get(
                    targetUser.socketId
                )
                ?.disconnect();

            console.log(
                `${socket.username} kicked ${targetUser.username}`
            );

        }
    );

    socket.on(
        "disconnect",
        ()=>{

            const roomId =
                socket.roomId;

            if(
                roomId &&
                roomUsers[roomId]
            ){

                roomUsers[roomId] =
                    roomUsers[roomId].filter(
                        (user)=>
                            user.socketId !==
                            socket.id
                    );

                io.to(roomId).emit(
                    "participants",
                    roomUsers[roomId]
                );

                socket.to(roomId).emit(
                    "user-left",
                    socket.peerId
                );

                if(
                    roomUsers[roomId]
                    .length === 0
                ){

                    delete roomUsers[roomId];

                    delete roomHosts[roomId];

                }

            }

            console.log(
                "User Disconnected:",
                socket.id
            );

        }
    );

});

const PORT =
    process.env.PORT || 5001;

server.listen(PORT, ()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});
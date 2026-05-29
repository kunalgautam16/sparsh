import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Peer from "peerjs";

import socket from "../socket/socket";

import GestureDetector from "../components/GestureDetector";
import MainVideo from "../components/MainVideo";
import ParticipantCard from "../components/ParticipantCard";
import ChatSidebar from "../components/ChatSidebar";
import BottomControls from "../components/BottomControls";
import GesturePopup from "../components/GesturePopup";
import { X } from "lucide-react";

function Room(){

    const { id } = useParams();

    const username =
        localStorage.getItem("sparsh-user") ||
        "Anonymous";

    const [stream, setStream] = useState(null);

    const [remoteStreams, setRemoteStreams] =
        useState([]);

    const [participants, setParticipants] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [messages, setMessages] =
        useState([]);

    const [subtitle, setSubtitle] =
        useState("");

    const [liveGesture, setLiveGesture] =
        useState(null);

    const [isMuted, setIsMuted] =
        useState(false);

    const [isVideoOff, setIsVideoOff] =
        useState(false);

    const [isSharing, setIsSharing] =
        useState(false);

    const [meetingTime, setMeetingTime] =
        useState(0);

    const [participantMedia, setParticipantMedia] =
        useState({});

    const [activeSpeaker, setActiveSpeaker] =
        useState("");

    const [focusedParticipant, setFocusedParticipant] =
        useState(null);

    const [showParticipants, setShowParticipants] =
        useState(false);

    const [participantPage, setParticipantPage] =
        useState(0);

    const [emojiReaction, setEmojiReaction] =
        useState(null);

    const [typingUser, setTypingUser] =
        useState("");

    const [isRecording, setIsRecording] =
        useState(false);

    const [isHost, setIsHost] =
        useState(false);

    const [isConnecting, setIsConnecting] =
        useState(true);

    const peersRef = useRef({});

    const peerRef = useRef(null);

    const localStreamRef = useRef(null);


    const videoRef = useRef(null);

    const joinAudio = useRef(
        new Audio("/join.mp3")
    );

    const [isSending, setIsSending] =
    useState(false);


    useEffect(()=>{

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: {
                noiseSuppression: true,
                echoCancellation: true,
                autoGainControl: true
            }
        })
        .then((currentStream)=>{
            setIsConnecting(false);

            setStream(currentStream);

            localStreamRef.current =
                currentStream;

            const peer = new Peer();

            peerRef.current = peer;

            peer.on("open", (peerId)=>{

                socket.emit("join-room", {
                    roomId: id,
                    peerId,
                    username
                });

            });

            socket.on(
                "user-joined",
                ({ peerId })=>{

                    joinAudio.current.play();

                    const call =
                        peer.call(
                            peerId,
                            currentStream
                        );

                    peersRef.current[peerId] =
                        call;

                    call.on(
                        "stream",
                        (remote)=>{

                            setRemoteStreams(
                                (prev)=>{

                                    const exists =
                                        prev.find(
                                            (user)=>
                                                user.peerId === peerId
                                        );

                                    if(exists){
                                        return prev;
                                    }

                                    return [
                                        ...prev,
                                        {
                                            peerId,
                                            stream: remote
                                        }
                                    ];

                                }
                            );

                        }
                    );

                }
            );

            peer.on(
                "call",
                (call)=>{

                    call.answer(currentStream);

                    peersRef.current[
                        call.peer
                    ] = call;

                    call.on(
                        "stream",
                        (remote)=>{

                            setRemoteStreams(
                                (prev)=>{

                                    const exists =
                                        prev.find(
                                            (user)=>
                                                user.peerId === call.peer
                                        );

                                    if(exists){
                                        return prev;
                                    }

                                    return [
                                        ...prev,
                                        {
                                            peerId: call.peer,
                                            stream: remote
                                        }
                                    ];

                                }
                            );

                        }
                    );

                }
            );

        });

        socket.on(
            "participants",
            (users)=>{

                setParticipants(users);

                const currentUser =
                    users.find(
                        (user)=>
                            user.username ===
                            username
                    );

                if(currentUser){

                    setIsHost(
                        currentUser.isHost
                    );

                }

            }
        );

        socket.on(
            "receive-message",
            (data)=>{

                setMessages(
                    (prev)=>[
                        ...prev,
                        data
                    ]
                );

            }
        );

        socket.on(
            "gesture-received",
            ({
                gesture,
                username
            })=>{

                setLiveGesture({
                    gesture,
                    username
                });

                setTimeout(()=>{

                    setLiveGesture(null);

                }, 3000);

            }
        );

        socket.on(
            "participant-media-update",
            ({
                peerId,
                type,
                value
            })=>{

                setParticipantMedia(
                    (prev)=>({

                        ...prev,

                        [peerId]: {
                            ...prev[peerId],
                            [type]: value
                        }

                    })
                );

            }
        );

        socket.on(
            "receive-subtitle",
            (text)=>{

                setSubtitle(text);

            }
        );

        socket.on(
            "typing",
            (user)=>{

                setTypingUser(user);

                setTimeout(()=>{

                    setTypingUser("");

                }, 2000);

            }
        );

        socket.on(
            "emoji-reaction",
            (data)=>{

                setEmojiReaction(data);

                setTimeout(()=>{

                    setEmojiReaction(null);

                }, 3000);

            }
        );

        return ()=>{

            socket.off("participants");
            socket.off("receive-message");
            socket.off("gesture-received");
            socket.off("participant-media-update");
            socket.off("receive-subtitle");
            socket.off("typing");
            socket.off("emoji-reaction");

            localStreamRef.current
            ?.getTracks()
            .forEach(
                (track)=>track.stop()
            );

            peerRef.current?.destroy();
        };

    }, []);

    useEffect(()=>{

        const interval = setInterval(()=>{

            setMeetingTime(
                (prev)=>prev + 1
            );

        }, 1000);

        return ()=>clearInterval(interval);

    }, []);

    useEffect(()=>{

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if(!SpeechRecognition){
            return;
        }

        const recognition =
            new SpeechRecognition();

        recognition.continuous = true;

        recognition.interimResults = false;

        recognition.lang = "en-US";

        recognition.onresult = (event)=>{

            const latestResult =
                event.results[
                    event.results.length - 1
                ];

            const transcript =
                latestResult[0].transcript;

            setSubtitle(transcript);

            socket.emit(
                "subtitle",
                {
                    roomId: id,
                    subtitle: transcript
                }
            );

        };

        recognition.start();

        return ()=>{

            recognition.stop();

        };

    }, []);

    const sendMessage = ()=>{

        if(message.trim() === ""){
            return;
        }

        setIsSending(true);

        socket.emit(
            "send-message",
            {
                roomId: id,
                message
            }
        );

        setTimeout(()=>{

            setIsSending(false);

        }, 300);

        setMessage("");

    };

    const handleTyping = ()=>{

        socket.emit(
            "typing",
            {
                roomId: id,
                username
            }
        );

    };

    const handleLocalGestureDetected = (gesture)=>{

        setLiveGesture({
            gesture,
            username
        });

        setTimeout(()=>{

            setLiveGesture(null);

        }, 3000);

    };

    const handleRaiseHand = ()=>{

        socket.emit(
            "gesture",
            {
                roomId: id,
                gesture: "✋"
            }
        );

        handleLocalGestureDetected("✋");

    };

    const sendReaction = (emoji)=>{

        socket.emit(
            "emoji-reaction",
            {
                roomId: id,
                emoji,
                username
            }
        );

    };

    const toggleRecording = ()=>{

        setIsRecording(
            (prev)=>!prev
        );

    };

    const toggleMic = ()=>{

        stream
        .getAudioTracks()
        .forEach((track)=>{

            track.enabled =
                !track.enabled;

        });

        const updatedMuted =
            !isMuted;

        setIsMuted(updatedMuted);

        socket.emit(
            "participant-media",
            {
                roomId: id,
                type: "mic",
                value: updatedMuted
            }
        );

    };

    const toggleVideo = ()=>{

        stream
        .getVideoTracks()
        .forEach((track)=>{

            track.enabled =
                !track.enabled;

        });

        const updatedVideo =
            !isVideoOff;

        setIsVideoOff(updatedVideo);

        socket.emit(
            "participant-media",
            {
                roomId: id,
                type: "camera",
                value: updatedVideo
            }
        );

    };

   const shareScreen = async()=>{

        try{

            setIsSharing(true);

            const screenStream =
                await navigator
                .mediaDevices
                .getDisplayMedia({
                    video: true
                });

            const screenTrack =
                screenStream
                .getVideoTracks()[0];

            const updatedStream =
                new MediaStream([
                    screenTrack,
                    ...stream.getAudioTracks()
                ]);

            setStream(updatedStream);

            if(videoRef.current){

                videoRef.current.srcObject =
                    updatedStream;

            }

            Object.values(
                peersRef.current
            ).forEach((call)=>{

                const sender =
                    call.peerConnection
                    ?.getSenders()
                    ?.find(
                        (s)=>
                            s.track.kind ===
                            "video"
                    );

                if(sender){

                    sender.replaceTrack(
                        screenTrack
                    );

                }

            });

            screenTrack.onended = ()=>{

                const cameraTrack =
                    localStreamRef.current
                    .getVideoTracks()[0];

                Object.values(
                    peersRef.current
                ).forEach((call)=>{

                    const sender =
                        call.peerConnection
                        ?.getSenders()
                        ?.find(
                            (s)=>
                                s.track.kind ===
                                "video"
                        );

                    if(sender){

                        sender.replaceTrack(
                            cameraTrack
                        );

                    }

                });

                const restoredStream =
                    new MediaStream([
                        cameraTrack,
                        ...localStreamRef.current
                        .getAudioTracks()
                    ]);

                setStream(restoredStream);

                if(videoRef.current){

                    videoRef.current.srcObject =
                        restoredStream;

                }

                setIsSharing(false);

            };

        }
        catch(error){

            setIsSharing(false);

            console.log(error);

        }

    };
    const copyMeetingLink = async()=>{

        await navigator.clipboard.writeText(
            window.location.href
        );

        alert("Meeting link copied!");

    };

    const leaveMeeting = ()=>{

        window.location.href =
            "/dashboard";

    };

    const formatTime = (seconds)=>{

        const hrs =
            String(
                Math.floor(
                    seconds / 3600
                )
            ).padStart(2, "0");

        const mins =
            String(
                Math.floor(
                    (
                        seconds % 3600
                    ) / 60
                )
            ).padStart(2, "0");

        const secs =
            String(
                seconds % 60
            ).padStart(2, "0");

        return `${hrs}:${mins}:${secs}`;

    };


    const participantsPerPage = 4;

    const startIndex =
        participantPage *
        participantsPerPage;

    const visibleParticipants =
        remoteStreams.slice(
            startIndex,
            startIndex +
            participantsPerPage
        );

    if(isConnecting){

        return(
            <div className="w-full h-screen flex items-center justify-center bg-[#EAF4FF]">
                <div className="flex flex-col items-center gap-5">
                    <div className="w-16 h-16 border-4 border-[#B8D4FF] border-t-[#5B8DEF] rounded-full animate-spin" />
                    <p className="text-[#1F2A44] text-2xl font-semibold">
                        Joining Meeting...
                    </p>
                </div>
            </div>
        );
    }

    return(
        <>
            
            {
                focusedParticipant &&
                <div
                    className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-10"
                    onClick={()=>
                        setFocusedParticipant(null)
                    }
                >

                    <video
                        ref={(video)=>{

                            if(
                                video &&
                                focusedParticipant.stream &&
                                video.srcObject !== focusedParticipant.stream
                            ){

                                video.srcObject =
                                    focusedParticipant.stream;

                            }

                        }}
                        autoPlay
                        playsInline
                        className="w-full h-full object-contain rounded-[30px]"
                    />

                </div>
            }

            {
                showParticipants &&
                <div className="fixed inset-0 bg-black/40 z-[120] flex items-center justify-center">

                    <div className="bg-[#CFE3FF] border border-[#B8D4FF] text-[#1F2A44] w-[95%] max-w-[400px] max-h-[500px] overflow-y-auto rounded-[30px] p-6">

                        <div className="flex items-center justify-between mb-5">

                            <h1 className="text-3xl font-bold">
                                Participants
                            </h1>

                            <button
                                onClick={()=>
                                    setShowParticipants(false)
                                }
                                className="w-10 h-10 rounded-xl bg-[#DCEEFF] border border-[#B8D4FF] flex items-center justify-center hover:bg-[#40476f] transition"
                            >

                                <X size={20} />

                            </button>

                        </div>

                        {
                            participants.map(
                                (
                                    user,
                                    index
                                )=>(

                                    <div
                                        key={index}
                                        className="flex justify-between items-center p-4 border-b border-[#B8D4FF]"
                                    >

                                        <div className="flex flex-col">

                                            <span className="text-lg font-semibold">
                                                {user.username}
                                            </span>

                                            {
                                                user.isHost &&
                                                <span className="text-sm text-[#A9BCFF]">
                                                    Host
                                                </span>
                                            }

                                        </div>

                                        {
                                            isHost &&
                                            user.peerId !==
                                                participants.find(
                                                    (p)=>
                                                        p.username === username
                                                )?.peerId
                                            &&
                                            <div className="flex gap-3">

                                                <button
                                                    onClick={()=>{

                                                        socket.emit(
                                                            "mute-user",
                                                            {
                                                                roomId: id,
                                                                targetPeerId:
                                                                    user.peerId
                                                            }
                                                        );

                                                    }}
                                                    className="bg-[#5B8DEF] text-[#2B3050] px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
                                                >

                                                    Mute

                                                </button>

                                                <button
                                                    onClick={()=>{

                                                        socket.emit(
                                                            "kick-user",
                                                            {
                                                                roomId: id,
                                                                targetPeerId:
                                                                    user.peerId
                                                            }
                                                        );

                                                    }}
                                                    className="bg-[#FF4D6D] text-[#1F2A44] px-4 py-2 rounded-xl font-semibold hover:scale-105 transition"
                                                >

                                                    Remove

                                                </button>

                                            </div>
                                        }

                                    </div>

                                )
                            )
                        }

                    </div>

                </div>
            }

            <div className="w-full h-screen bg-[#EAF4FF] p-3 lg:p-5 flex flex-col gap-5 overflow-hidden">

                <div className="flex flex-col lg:flex-row gap-5 flex-1 overflow-hidden">

                    <div className="w-full lg:w-[22%] h-[320px] lg:h-full">

                        <ChatSidebar
                            messages={messages}
                            message={message}
                            setMessage={setMessage}
                            sendMessage={sendMessage}
                            handleTyping={handleTyping}
                            typingUser={typingUser}
                            isSending={isSending}
                        />

                    </div>

                    <div className="flex-1 flex flex-col gap-5 relative overflow-hidden min-h-0">

                        <GesturePopup
                            gesture={
                                liveGesture?.gesture
                            }
                            user={
                                liveGesture?.username
                            }
                        />

                        {
                            emojiReaction &&
                            <div className="absolute top-24 right-10 bg-[#CFE3FF] border border-[#B8D4FF] text-[#1F2A44] px-6 py-4 rounded-xl z-50 text-3xl">

                                {
                                    emojiReaction.emoji
                                }

                                {" "}

                                {
                                    emojiReaction.username
                                }

                            </div>
                        }

                        {
                            stream &&
                            <GestureDetector
                                videoRef={videoRef}
                                roomId={id}
                                onGestureDetected={handleLocalGestureDetected}
                            />
                        }

                        <div className="flex-1 overflow-hidden">

                            <MainVideo
                                stream={stream}
                                subtitle={subtitle}
                                participantCount={
                                    remoteStreams.length + 1
                                }
                                videoRef={videoRef}
                                meetingTime={
                                    formatTime(meetingTime)
                                }
                            />

                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 overflow-y-auto pr-2 max-h-[200px]">
                            
                            {
                                remoteStreams.length === 0 &&
                                <div className="col-span-full flex items-center justify-center h-[180px] bg-white rounded-[30px] border border-[#B8D4FF]">

                                    <p className="text-[#5F6E8C] text-xl">

                                        Waiting for participants...

                                    </p>

                                </div>
                            }

                            {
                                
                                visibleParticipants
                                .filter(remote => remote.stream)
                                .map(
                                    (
                                        remote,
                                        index
                                    )=>(

                                        <ParticipantCard
                                            key={index}
                                            stream={
                                                remote.stream
                                            }
                                            name={
                                                participants.find(
                                                    (
                                                        p
                                                    )=>
                                                        p.peerId === remote.peerId
                                                )?.username ||
                                                "Participant"
                                            }
                                            muted={
                                                participantMedia[
                                                    remote.peerId
                                                ]?.mic
                                            }
                                            cameraOff={
                                                participantMedia[
                                                    remote.peerId
                                                ]?.camera
                                            }
                                            onFocus={()=>{

                                                setFocusedParticipant(
                                                    remote
                                                );

                                            }}
                                        />

                                    )
                                )
                            }

                        </div>

                    </div>

                </div>

                <div className="flex flex-wrap justify-center items-center gap-4 flex-wrap bg-[#DCEEFF] py-4 px-3 rounded-t-3xl w-full border border-[#B8D4FF]">

                    <BottomControls
                        shareScreen={shareScreen}
                        toggleMic={toggleMic}
                        toggleVideo={toggleVideo}
                        isMuted={isMuted}
                        isVideoOff={isVideoOff}
                        isSharing={isSharing}
                    />

                    <button
                        onClick={()=>
                            setShowParticipants(
                                (
                                    prev
                                )=>
                                    !prev
                            )
                        }
                        className="bg-[#CFE3FF] text-[#1F2A44] border border-[#B8D4FF] px-6 py-4 rounded-xl"
                    >

                        Participants

                    </button>

                    <button
                        onClick={
                            copyMeetingLink
                        }
                        className="bg-[#CFE3FF] text-[#1F2A44] border border-[#B8D4FF] px-6 py-4 rounded-xl"
                    >

                        Invite

                    </button>

                    <button
                        onClick={handleRaiseHand}
                        className="w-20 h-20 rounded-full bg-[#5B8DEF] text-[#1F2235] text-4xl flex items-center justify-center -mt-10 border-[6px] border-[#1F2235] hover:scale-110 transition"
                    >

                        ✋

                    </button>

                    <button
                        onClick={()=>
                            sendReaction("🔥")
                        }
                        className="bg-[#CFE3FF] text-[#1F2A44] border border-[#B8D4FF] px-6 py-4 rounded-full text-2xl"
                    >

                        🔥

                    </button>

                    <button
                        onClick={()=>
                            sendReaction("👏")
                        }
                        className="bg-[#CFE3FF] text-[#1F2A44] border border-[#B8D4FF] px-6 py-4 rounded-full text-2xl"
                    >

                        👏

                    </button>


                    <button
                        onClick={
                            toggleRecording
                        }
                        className="bg-[#FF4D6D] text-[#1F2A44] px-6 py-4 rounded-xl"
                    >

                        Record

                    </button>

                    <button
                        onClick={
                            leaveMeeting
                        }
                        className="bg-[#FF4D6D] text-[#1F2A44] px-6 py-4 rounded-xl"
                    >

                        Leave

                    </button>

                </div>

            </div>

        </>
    );
}

export default Room;
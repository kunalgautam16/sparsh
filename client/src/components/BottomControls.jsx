import {
    Mic,
    MicOff,
    Video,
    VideoOff,
    MonitorUp
} from "lucide-react";

function BottomControls({
    toggleMic,
    toggleVideo,
    shareScreen,
    isMuted,
    isVideoOff,
    onRaiseHand,
    isSharing
}){

    return(
        <div className="bg-[#CFE3FF] rounded-xl px-10 py-5 flex items-center justify-center gap-5 sm:gap-10 lg:gap-16 border border-[#B8D4FF]">

            <button
                onClick={toggleMic}
                className="flex items-center gap-3 text-[#1F2A44] text-lg hover:scale-105 transition"
            >
                {
                    isMuted ?
                    <MicOff />
                    :
                    <Mic />
                }

                {
                    isMuted ?
                    "Unmute"
                    :
                    "Mute"
                }

            </button>

            <button
                onClick={toggleVideo}
                className="flex items-center gap-3 text-[#1F2A44] text-lg hover:scale-105 transition"
            >
                {
                    isVideoOff ?
                    <VideoOff />
                    :
                    <Video />
                }

                {
                    isVideoOff ?
                    "Start Video"
                    :
                    "Stop Video"
                }

            </button>

            <button
                onClick={shareScreen}
                className="flex items-center gap-3 text-[#1F2A44] text-lg hover:scale-105 transition"
            >
                <MonitorUp />

                {
                    isSharing
                    ?
                    "Sharing..."
                    :
                    "Share Screen"
                }

            </button>

        </div>
    );
}

export default BottomControls;
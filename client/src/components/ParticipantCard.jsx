import {
    Mic,
    MicOff,
    VideoOff,
    Volume2
} from "lucide-react";

import { motion } from "framer-motion";

function ParticipantCard({
    stream,
    name,
    muted,
    cameraOff,
    isSpeaking,
    onFocus
}){

    return(
        <motion.div

            onDoubleClick={onFocus}

            initial={{
                opacity: 0,
                y: 40
            }}

            animate={{
                opacity: 1,
                y: 0
            }}

            transition={{
                duration: 0.4
            }}

            whileHover={{
                scale: 1.02
            }}

            className={`relative bg-[#CFE3FF] rounded-[28px] overflow-hidden h-[100px] w-[160px] shrink-0 lg:w-auto lg:h-[220px] border transition-all duration-300 cursor-pointer ${
                isSpeaking ?
                "border-[#A9BCFF]"
                :
                "border-[#B8D4FF]"
            }`}
        >

            {
                stream && !cameraOff ?

            <video
                ref={(video)=>{

                    if(
                        video &&
                        stream &&
                        video.srcObject !== stream
                    ){

                        video.srcObject = stream;

                    }

                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover scale-x-[-1]"
            />

                :

                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#31375B] to-[#2B3050] text-[#1F2A44]">

                    <div className={`w-12 h-12 lg:w-24 lg:h-24 rounded-xl bg-[#5B8DEF] text-[#2B3050] flex items-center justify-center text-5xl font-bold transition-all duration-300 ${
                        isSpeaking &&
                        "scale-110 ring-4 ring-[#D9DCEE]"
                    }`}>

                        {name[0]}

                    </div>

                    <p className="mt-5 text-xl font-semibold">
                        {name}
                    </p>

                    <div className="mt-3 flex items-center gap-2 text-[#5F6E8C]">

                        <VideoOff size={18} />

                        Camera Off

                    </div>

                </div>
            }

            <div className="absolute bottom-3 left-3 bg-black/50 text-[#1F2A44] px-4 py-2 rounded-2xl text-sm backdrop-blur-md flex items-center gap-2">

                {name}

                {
                    isSpeaking &&
                    <Volume2
                        size={16}
                        className="text-[#5F6E8C]"
                    />
                }

            </div>

            <div className="absolute top-3 right-3 bg-black/40 p-2 rounded-xl text-[#1F2A44] backdrop-blur-md">

                {
                    muted ?
                    <MicOff size={18} />
                    :
                    <Mic size={18} />
                }

            </div>

            {
                isSpeaking &&
                <div className="absolute inset-0 border-4 border-[#A9BCFF] rounded-[28px] pointer-events-none animate-pulse" />
            }

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        </motion.div>
    );
}

export default ParticipantCard;
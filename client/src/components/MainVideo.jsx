import {
    Users,
    Clock3,
    Volume2
} from "lucide-react";

function MainVideo({
    stream,
    subtitle,
    participantCount,
    videoRef,
    meetingTime,
    isSpeaking
}){

    return(
        <div className={`relative w-full h-full rounded-[35px] overflow-hidden bg-[#3b3b3b] border-4 transition-all duration-300 ${
            isSpeaking ?
            "border-yellow-300"
            :
            "border-transparent"
        }`}>

            <video
                ref={(video)=>{

                    if(video && stream){

                        if(video.srcObject !== stream){

                            video.srcObject = stream;

                        }

                        if(videoRef){

                            videoRef.current = video;

                        }

                    }

                }}
                autoPlay
                playsInline
                muted
                className="relative w-full h-[300px] lg:h-full object-cover scale-x-[-1]"
            />

            {
                isSpeaking &&
                <div className="absolute inset-0 border-4 border-yellow-300 rounded-[35px] animate-pulse pointer-events-none" />
            }

            <div className="absolute top-5 left-5 flex gap-3 flex-wrap">

                <div className="bg-black/70 text-white  px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-md">

                    <div className="w-3 h-3 rounded-full bg-yellow-400 animate-pulse" />

                    LIVE

                </div>

                <div className="bg-black/70 text-white px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-md">

                    <Users size={18} />

                    {participantCount}

                </div>

                <div className="bg-black/70 text-white px-4 py-2 rounded-2xl flex items-center gap-2 backdrop-blur-md">

                    <Clock3 size={18} />

                    {meetingTime}

                </div>

                {
                    isSpeaking &&
                    <div className="bg-yellow-300 text-white px-4 py-2 rounded-2xl flex items-center gap-2 font-semibold">

                        <Volume2 size={18} />

                        Speaking

                    </div>
                }

            </div>

            <div className="absolute top-5 right-5 bg-black/70 text-white px-5 py-3 rounded-2xl backdrop-blur-md">

                {new Date().toLocaleDateString()}

            </div>

            {
                subtitle &&
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/75 text-white px-8 py-4 rounded-xl max-w-[75%] text-center border border-white/10">

                    <p className="text-lg sm:text-2xl font-medium leading-relaxed">

                        {subtitle}

                    </p>

                </div>
            }

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        </div>
    );
}

export default MainVideo;
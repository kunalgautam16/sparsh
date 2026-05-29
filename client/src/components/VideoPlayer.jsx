import { useEffect, useRef } from "react";

function VideoPlayer(){

    const videoRef = useRef(null);

    useEffect(()=>{

        const startVideo = async()=>{

            try{


                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: {
                        noiseSuppression: true,
                        echoCancellation: true,
                        autoGainControl: true
                    }
                });

                videoRef.current.srcObject = stream;

            }
            catch(error){
                console.log(error);
            }
        };

        startVideo();

    }, []);

    return(
        <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-[500px] rounded"
        />
    );
}

export default VideoPlayer;
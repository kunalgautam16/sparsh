import { useEffect, useRef } from "react";

function PeerVideo({ stream, muted=false, videoRef }){

    const internalRef = useRef();

    const ref = videoRef || internalRef;

    useEffect(()=>{

        if(stream){
            ref.current.srcObject = stream;
        }

    }, [stream]);

    return(
        <video
            ref={ref}
            autoPlay
            playsInline
            muted={muted}
            className="w-[500px] rounded"
        />
    );
}

export default PeerVideo;
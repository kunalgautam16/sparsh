import { useEffect } from "react";

import socket from "../socket/socket";

import {
    FilesetResolver,
    HandLandmarker
} from "@mediapipe/tasks-vision";

function GestureDetector({
    videoRef,
    roomId,
    onGestureDetected
}){

    useEffect(()=>{

        let handLandmarker;

        let lastGesture = "";

        let lastEmit = 0;

        let animationFrameId;

        let isDestroyed = false;

        const loadModel = async()=>{

            try{

                const vision =
                    await FilesetResolver.forVisionTasks(
                        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/wasm"
                    );

                if(isDestroyed){
                    return;
                }

                handLandmarker =
                    await HandLandmarker.createFromOptions(
                        vision,
                        {
                            baseOptions: {
                                modelAssetPath:
                                "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
                            },

                            runningMode: "VIDEO",

                            numHands: 1
                        }
                    );

                

                detectHands();

            }catch(error){

                console.error(
                    "Error loading Hand Landmarker:",
                    error
                );

            }

        };

        const detectHands = ()=>{

            if(
                isDestroyed
            ){
                return;
            }

            if(
                !videoRef.current ||
                !handLandmarker ||
                videoRef.current.readyState < 2
            ){

                animationFrameId =
                    requestAnimationFrame(
                        detectHands
                    );

                return;

            }

            try{

                const now =
                    performance.now();

                if(
                    !detectHands.lastRun ||
                    now - detectHands.lastRun > 250
                ){

                    detectHands.lastRun =
                        now;

                    const results =
                        handLandmarker.detectForVideo(
                            videoRef.current,
                            now
                        );

                    if(
                        results.landmarks &&
                        results.landmarks.length > 0
                    ){

                        const landmarks =
                            results.landmarks[0];

                        const wrist =
                            landmarks[0];

                        const thumbTip =
                            landmarks[4];

                        const indexTip =
                            landmarks[8];

                        const middleTip =
                            landmarks[12];

                        const ringTip =
                            landmarks[16];

                        const pinkyTip =
                            landmarks[20];

                        const indexBase =
                            landmarks[5];

                        const middleBase =
                            landmarks[9];

                        const ringBase =
                            landmarks[13];

                        const pinkyBase =
                            landmarks[17];

                        const isIndexRaised =
                            indexTip.y <
                            indexBase.y - 0.08;

                        const isMiddleRaised =
                            middleTip.y <
                            middleBase.y - 0.08;

                        const isRingRaised =
                            ringTip.y <
                            ringBase.y - 0.08;

                        const isPinkyRaised =
                            pinkyTip.y <
                            pinkyBase.y - 0.08;

                        const isThumbRaised =
                            thumbTip.y <
                            wrist.y - 0.1;

                        const isHandRaised =
                            isIndexRaised &&
                            isMiddleRaised &&
                            isRingRaised &&
                            isPinkyRaised &&
                            isThumbRaised;

                        let detectedGesture = "";

                        if(isHandRaised){

                            detectedGesture = "✋";

                        }

                        if(
                            detectedGesture &&
                            detectedGesture !== lastGesture &&
                            Date.now() - lastEmit > 1500
                        ){

                            lastGesture =
                                detectedGesture;

                            lastEmit =
                                Date.now();

                            if(onGestureDetected){

                                onGestureDetected(
                                    detectedGesture
                                );

                            }

                            socket.emit(
                                "gesture",
                                {
                                    roomId,
                                    gesture:
                                        detectedGesture
                                }
                            );

                        }

                        if(!detectedGesture){

                            lastGesture = "";

                        }

                    }

                }

            }catch(error){

                console.error(
                    "Gesture Detection Error:",
                    error
                );

            }

            animationFrameId =
                requestAnimationFrame(
                    detectHands
                );

        };

        loadModel();

        return ()=>{

            isDestroyed = true;

            if(animationFrameId){

                cancelAnimationFrame(
                    animationFrameId
                );

            }

            if(handLandmarker){

                handLandmarker.close();

            }

        };

    }, []);

    return null;
}

export default GestureDetector;
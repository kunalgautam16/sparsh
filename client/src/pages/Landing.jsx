import { useNavigate } from "react-router-dom";

import logo from "../assets/sparsh-logo.jpeg";

import backgroundImage from "../assets/landing-bg.jpeg";

function Landing(){

    const navigate = useNavigate();

    return(

        <div
            className="relative min-h-screen bg-cover bg-center flex items-center"
            style={{
                backgroundImage: `url(${backgroundImage})`
            }}
        >

            <div className="absolute inset-0 bg-[#EAF4FF]/40 backdrop-blur-[2px]" />

            <div className="relative z-10 w-full lg:w-[70%] px-8 sm:px-16 -mt-60">

                <div className="flex items-center gap-5">

                    <div className="w-24 h-24 rounded-full bg-white/80 border border-[#B8D4FF] flex items-center justify-center overflow-hidden">

                        <img
                            src={logo}
                            alt="SPARSH"
                            className="w-24 h-24 object-contain"
                        />

                    </div>

                    <div>

                        <h1 className="text-7xl sm:text-8xl font-black text-[#1F2A44] shimmer-text">

                            SPARSH

                        </h1>

                        <p className="mt-2 text-2xl text-[#5F6E8C] font-medium">

                            Interactive Meetings

                        </p>

                    </div>

                </div>

                <p className="mt-12 text-2xl leading-relaxed text-[#4E5D78] max-w-[750px]">

                    Experience seamless realtime collaboration with
                    HD meetings, live chat, subtitles, gesture reactions
                    and screen sharing — all in one place.

                </p>

                <div className="mt-14 flex flex-wrap gap-5">

                    <button
                        onClick={()=>
                            navigate("/login")
                        }
                        className="px-10 py-5 rounded-xl bg-white/80 backdrop-blur-xl border border-[#B8D4FF] text-[#] text-xl font-semibold hover:bg-white transition"
                    >

                        Login

                    </button>

                    <button
                        onClick={()=>
                            navigate("/signup")
                        }
                        className="px-10 py-5 rounded-xl bg-[#A3F3F5] text-white text-xl font-bold hover:bg-[#74A9FF] transition"
                    >

                        Signup

                    </button>

                </div>

            </div>

        </div>

    );
}

export default Landing;
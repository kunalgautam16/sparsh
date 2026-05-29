import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
    Video,
    MessageSquare,
    Monitor,
    Hand,
    Sparkles,
    Users,
    LogOut
} from "lucide-react";

import logo from "../assets/sparsh-logo.jpeg";

function Dashboard(){

    const navigate = useNavigate();

    const [name, setName] =
        useState("");

    const [isCreating, setIsCreating] =
        useState(false);

    const token =
        localStorage.getItem("token");

    const createRoom = ()=>{

        if(!token){

            navigate("/login");

            return;

        }

        if(name.trim() === ""){
            return;
        }

        setIsCreating(true);

        localStorage.setItem(
            "sparsh-user",
            name
        );

        setTimeout(()=>{

            const roomId =
                crypto.randomUUID();

            navigate(`/room/${roomId}`);

        }, 1000);

    };

    const logout = ()=>{

        localStorage.removeItem(
            "token"
        );

        window.location.reload();

    };

    return(

        <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF4FF] via-[#DCEEFF] to-[#CFE3FF] flex items-center justify-center px-5 py-10">

            <div className="absolute top-[-120px] left-[-120px] w-[420px] h-[420px] bg-[#5B8DEF]/20 rounded-full blur-3xl animate-pulse" />

            <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-[#A9BCFF]/30 rounded-full blur-3xl animate-pulse" />

            <div className="absolute top-[40%] left-[45%] w-[250px] h-[250px] bg-white/30 rounded-full blur-3xl" />

            <div className="absolute top-[10%] right-[20%] w-[180px] h-[180px] bg-[#74A9FF]/20 rounded-full blur-3xl" />

            <div
                className="absolute inset-0 opacity-[0.05]"
                style={{
                    backgroundImage:
                        "linear-gradient(#5B8DEF 1px, transparent 1px), linear-gradient(to right, #5B8DEF 1px, transparent 1px)",
                    backgroundSize: "40px 40px"
                }}
            />

            {
                token &&
                <button
                    onClick={logout}
                    className="absolute top-6 right-6 bg-white/60 backdrop-blur-xl border border-[#B8D4FF] text-[#1F2A44] px-6 py-3 rounded-2xl hover:bg-white transition z-50 flex items-center gap-3"
                >

                    <LogOut size={18} />

                    Logout

                </button>
            }

            <div className="relative w-full max-w-[1400px] flex flex-col lg:flex-row items-center gap-12 z-10">

                <div className="flex-1 flex flex-col justify-center">

                    <div className="flex items-center gap-5">

                        <div className="w-24 h-24 rounded-full bg-white border border-[#B8D4FF] flex items-center justify-center overflow-hidden shrink-0">

                            <img
                                src={logo}
                                alt="SPARSH"
                                className="w-24 h-24 object-contain animate-pulse"
                            />

                        </div>

                        <div>

                            <h1 className="text-6xl sm:text-7xl font-black text-[#1F2A44] tracking-wide shimmer-text">

                                SPARSH

                            </h1>

                            <p className="text-[#5F6E8C] text-2xl mt-2">

                                Interactive Meetings

                            </p>

                        </div>

                    </div>

                    <h2 className="mt-14 text-5xl sm:text-6xl font-bold leading-tight text-[#1F2A44] max-w-[750px]">

                        Realtime collaboration built for modern interactive meetings

                    </h2>

                    <p className="mt-8 text-[#5F6E8C] text-xl leading-relaxed max-w-[650px]">

                        Experience realtime meetings with live subtitles,
                        gesture reactions, participant moderation,
                        screen sharing and seamless communication.

                    </p>

                    <div className="mt-12 flex flex-wrap gap-4">

                        <div className="px-5 py-3 bg-white/70 backdrop-blur-xl border border-[#B8D4FF] rounded-xl flex items-center gap-3">

                            <Video size={20} />

                            HD Meetings

                        </div>

                        <div className="px-5 py-3 bg-white/70 backdrop-blur-xl border border-[#B8D4FF] rounded-xl flex items-center gap-3">

                            <MessageSquare size={20} />

                            Live Chat

                        </div>

                        <div className="px-5 py-3 bg-white/70 backdrop-blur-xl border border-[#B8D4FF] rounded-xl flex items-center gap-3">

                            <Monitor size={20} />

                            Screen Sharing

                        </div>

                        <div className="px-5 py-3 bg-white/70 backdrop-blur-xl border border-[#B8D4FF] rounded-xl flex items-center gap-3">

                            <Hand size={20} />

                            Gesture Reactions

                        </div>

                    </div>

                    <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-5">

                        <div className="bg-white/50 backdrop-blur-2xl border border-[#B8D4FF] rounded-xl p-6">

                            <Users
                                size={32}
                                className="text-[#5B8DEF]"
                            />

                            <h3 className="mt-4 text-2xl font-bold text-[#1F2A44]">

                                Realtime

                            </h3>

                            <p className="mt-2 text-[#5F6E8C]">

                                Instant peer-to-peer communication.

                            </p>

                        </div>

                        <div className="bg-white/50 backdrop-blur-2xl border border-[#B8D4FF] rounded-xl p-6">

                            <Sparkles
                                size={32}
                                className="text-[#5B8DEF]"
                            />

                            <h3 className="mt-4 text-2xl font-bold text-[#1F2A44]">

                                Interactive

                            </h3>

                            <p className="mt-2 text-[#5F6E8C]">

                                Gesture-based engagement system.

                            </p>

                        </div>

                        <div className="bg-white/50 backdrop-blur-2xl border border-[#B8D4FF] rounded-xl p-6">

                            <Monitor
                                size={32}
                                className="text-[#5B8DEF]"
                            />

                            <h3 className="mt-4 text-2xl font-bold text-[#1F2A44]">

                                Collaborative

                            </h3>

                            <p className="mt-2 text-[#5F6E8C]">

                                Share screens and communicate seamlessly.

                            </p>

                        </div>

                    </div>

                </div>

                <div className="w-full max-w-[480px] bg-white/50 backdrop-blur-2xl border border-[#B8D4FF] rounded-[40px] p-8 shadow-[0_20px_60px_rgba(91,141,239,0.15)]">

                    <div className="flex items-center gap-4">

                        <div>

                            <h2 className="text-3xl font-bold text-[#1F2A44]">

                                Start Meeting

                            </h2>

                            <p className="text-[#5F6E8C] mt-1">

                                Connect instantly with your team

                            </p>

                        </div>

                    </div>

                    <div className="mt-10">

                        <label className="text-[#5F6E8C] text-lg">

                            Your Name

                        </label>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e)=>
                                setName(
                                    e.target.value
                                )
                            }
                            className="w-full mt-3 bg-[#EAF4FF] text-[#1F2A44] rounded-xl px-6 py-5 outline-none text-xl border border-[#B8D4FF] focus:border-[#5B8DEF] transition"
                        />

                    </div>

                    <button
                        onClick={createRoom}
                        disabled={
                            isCreating ||
                            name.trim()===""
                        }
                        className="w-full mt-10 bg-[#5B8DEF] text-white font-bold py-5 rounded-xl text-xl hover:scale-[1.02] hover:bg-[#74A9FF] transition disabled:opacity-60"
                    >

                        {
                            isCreating
                            ?
                            "Creating Meeting..."
                            :
                            token
                            ?
                            "Create Meeting"
                            :
                            "Login to Create"
                        }

                    </button>

                    {
                        !token &&
                        <div className="mt-6 flex gap-4">

                            <button
                                onClick={()=>
                                    navigate("/login")
                                }
                                className="flex-1 bg-white border border-[#B8D4FF] text-[#1F2A44] py-4 rounded-2xl font-semibold hover:bg-[#EAF4FF] transition"
                            >

                                Login

                            </button>

                            <button
                                onClick={()=>
                                    navigate("/signup")
                                }
                                className="flex-1 bg-[#A9BCFF] text-[#1F2A44] py-4 rounded-2xl font-semibold hover:bg-[#8FB2FF] transition"
                            >

                                Signup

                            </button>

                        </div>
                    }

                    <p className="mt-5 text-center text-[#7A8AA6] text-sm">

                        Join meetings instantly using invitation links

                    </p>

                    <div className="mt-10 border-t border-[#B8D4FF] pt-8">

                        <h3 className="text-[#1F2A44] text-xl font-bold">

                            Quick Features

                        </h3>

                        <div className="mt-5 flex flex-col gap-4">

                            <div className="flex items-center gap-4 text-[#5F6E8C]">

                                <div className="w-10 h-10 rounded-full bg-[#DCEEFF] flex items-center justify-center">

                                    <Video size={18} />

                                </div>

                                HD Video Meetings

                            </div>

                            <div className="flex items-center gap-4 text-[#5F6E8C]">

                                <div className="w-10 h-10 rounded-full bg-[#DCEEFF] flex items-center justify-center">

                                    <Hand size={18} />

                                </div>

                                Gesture Reactions

                            </div>

                            <div className="flex items-center gap-4 text-[#5F6E8C]">

                                <div className="w-10 h-10 rounded-full bg-[#DCEEFF] flex items-center justify-center">

                                    <MessageSquare size={18} />

                                </div>

                                Realtime Messaging

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}

export default Dashboard;
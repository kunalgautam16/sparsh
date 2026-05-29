import { useEffect, useState } from "react";

import {
    useNavigate,
    Link
} from "react-router-dom";

import {
    User,
    Mail,
    Lock
} from "lucide-react";

import API from "../services/api";

import logo from "../assets/sparsh-logo.jpeg";

function Signup(){

    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(false);

    const [formData, setFormData] =
        useState({
            name: "",
            email: "",
            password: ""
        });

    useEffect(()=>{

        const token =
            localStorage.getItem(
                "token"
            );

        if(token){

            navigate("/dashboard");

        }

    }, []);

    const handleChange = (e)=>{

        setFormData({
            ...formData,
            [e.target.name]:
            e.target.value
        });

    };

    const handleSubmit = async(e)=>{

        e.preventDefault();

        try{

            setLoading(true);

            const res =
                await API.post(
                    "/auth/signup",
                    formData
                );

            localStorage.setItem(
                "token",
                res.data.token
            );

            navigate("/dashboard");

        }
        catch(error){

            console.error(error);

            alert(
                "Signup failed"
            );

        }
        finally{

            setLoading(false);

        }

    };

    return(

        <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#EAF4FF] via-[#DCEEFF] to-[#CFE3FF] flex items-center justify-center px-5">

            <div className="absolute top-[-100px] left-[-100px] w-[350px] h-[350px] bg-[#5B8DEF]/20 rounded-full blur-3xl" />

            <div className="absolute bottom-[-100px] right-[-100px] w-[350px] h-[350px] bg-[#A9BCFF]/20 rounded-full blur-3xl" />

            <div className="w-full max-w-[450px] bg-white/50 backdrop-blur-2xl border border-[#B8D4FF] rounded-[40px] p-10 shadow-[0_20px_60px_rgba(91,141,239,0.15)]">

                <div className="flex flex-col items-center">

                    <div className="w-24 h-24 rounded-full bg-white border border-[#B8D4FF] flex items-center justify-center overflow-hidden">

                        <img
                            src={logo}
                            alt="SPARSH"
                            className="w-24 h-24 object-contain"
                        />

                    </div>

                    <h1 className="mt-5 text-5xl font-black text-[#1F2A44]">

                        Create Account

                    </h1>

                    <p className="mt-3 text-[#5F6E8C] text-lg text-center">

                        Start your collaborative journey

                    </p>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-10 flex flex-col gap-5"
                >

                    <div className="relative">

                        <User
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A8AA6]"
                        />

                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            className="w-full bg-[#EAF4FF] border border-[#B8D4FF] rounded-xl pl-14 pr-5 py-5 outline-none text-[#1F2A44]"
                        />

                    </div>

                    <div className="relative">

                        <Mail
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A8AA6]"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            className="w-full bg-[#EAF4FF] border border-[#B8D4FF] rounded-xl pl-14 pr-5 py-5 outline-none text-[#1F2A44]"
                        />

                    </div>

                    <div className="relative">

                        <Lock
                            size={20}
                            className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7A8AA6]"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            className="w-full bg-[#EAF4FF] border border-[#B8D4FF] rounded-xl pl-14 pr-5 py-5 outline-none text-[#1F2A44]"
                        />

                    </div>

                    <button
                        disabled={loading}
                        className="mt-4 bg-[#A3F3F5] text-white font-bold py-5 rounded-xl text-xl hover:bg-[#74A9FF] transition disabled:opacity-60"
                    >

                        {
                            loading
                            ?
                            "Creating Account..."
                            :
                            "Signup"
                        }

                    </button>

                </form>

                <p className="mt-8 text-center text-[#5F6E8C]">

                    Already have an account?

                    <Link
                        to="/login"
                        className="ml-2 text-[#5B8DEF] font-semibold"
                    >

                        Login

                    </Link>

                </p>

            </div>

        </div>

    );
}

export default Signup;
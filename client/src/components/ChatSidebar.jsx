import logo from "../assets/sparsh-logo.jpeg";

function ChatSidebar({
    messages,
    message,
    setMessage,
    sendMessage,
    handleTyping,
    typingUser,
    isSending,
    onClose
}){

    return(
        <div className="w-full h-full bg-[#CFE3FF] rounded-[35px] p-5 flex flex-col min-h-0 border border-[#B8D4FF] overflow-hidden">

            <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full shrink-0 bg-white flex items-center justify-center overflow-hidden border-2 border-[#A9BCFF]">

                    <img
                        src={logo}
                        alt="SPARSH"
                        className="w-24 h-24 object-contain"
                    />

                </div>

                <div>

                    <h1 className="text-4xl font-bold text-[#1F2A44] leading-none">

                        SPARSH

                    </h1>

                    <p className="text-[#5F6E8C] mt-1">

                        AI Powered Meetings

                    </p>

                </div>

            </div>

            <div className="mt-8 flex items-center justify-between">

                <h2 className="text-3xl font-semibold text-[#5F6E8C]">

                    Chat

                </h2>

                <div className="bg-[#DCEEFF] text-[#A9BCFF] px-4 py-2 rounded-xl text-sm border border-[#B8D4FF]">

                    {
                        messages.length
                    } Messages

                </div>

            </div>

            <div className="flex-1 min-w-0 overflow-y-auto mt-6 space-y-4 pr-2 custom-scrollbar">

                {
                    messages.map(
                        (msg, index)=>(

                            <div
                                key={index}
                                className="bg-[#DCEEFF] rounded-xl p-4 border border-[#B8D4FF] transition hover:scale-[1.01]"
                            >

                                <div className="flex items-center justify-between">

                                    <p className="font-semibold text-[#A9BCFF] text-lg">

                                        {msg.sender}

                                    </p>

                                    <span className="text-xs text-[#5F6E8C]">

                                        now

                                    </span>

                                </div>

                                <p className="mt-2 text-[#1F2A44] leading-relaxed">

                                    {msg.message}

                                </p>

                            </div>

                        )
                    )
                }

            </div>

            {
                typingUser &&
                <div className="mt-3 bg-[#DCEEFF] border border-[#B8D4FF] px-4 py-3 rounded-2xl">

                    <p className="text-sm text-[#5F6E8C] animate-pulse">

                        {typingUser} is typing...

                    </p>

                </div>
            }

            {
                onClose &&
                <button
                    onClick={onClose}
                    className="lg:hidden bg-[#5B8DEF] text-[#2B3050] px-4 py-2 rounded-xl font-semibold"
                >
                    Close
                </button>
            }

            <div className="flex gap-3 mt-4 shrink-0">

                <input
                    type="text"
                    value={message}
                    onChange={(e)=>{

                        setMessage(
                            e.target.value
                        );

                        handleTyping();

                    }}
                    onKeyDown={(e)=>{

                        if(e.key === "Enter"){

                            sendMessage();

                        }

                    }}
                    placeholder="Type message..."
                    className="flex-1 min-w-0 bg-[#EAF4FF] text-[#1F2A44] rounded-2xl px-5 py-4 outline-none border border-[#B8D4FF] placeholder:text-[#9ea4c7] focus:border-[#A9BCFF] transition"
                />

                <button
                    onClick={sendMessage}
                    className="bg-[#5B8DEF] shrink-0 text-[#2B3050] font-bold px-7 rounded-2xl hover:scale-105 hover:bg-[#74A9FF] transition"
                >

                    {
                        isSending
                        ?
                        "Sending..."
                        :
                        "Send"
                    }

                </button>

            </div>

        </div>
    );
}

export default ChatSidebar;
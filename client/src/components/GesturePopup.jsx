import { motion, AnimatePresence } from "framer-motion";

function GesturePopup({
    gesture,
    user
}){

    return(
        <AnimatePresence>

            {
                gesture &&
                <motion.div

                    initial={{
                        opacity: 0,
                        y: -50,
                        scale: 0.8
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: 1
                    }}

                    exit={{
                        opacity: 0,
                        y: -50,
                        scale: 0.8
                    }}

                    transition={{
                        duration: 0.4
                    }}

                    className="absolute top-10 right-10 bg-[#fffde8] px-8 py-5 rounded-[28px] border border-yellow-200 z-50 backdrop-blur-md"
                >

                    <div className="flex items-center gap-5">

                        <div className="text-5xl">
                            {gesture}
                        </div>

                        <div>

                            <h1 className="text-2xl font-bold text-[#0b2a78]">
                                {user}
                            </h1>

                            <p className="text-gray-600 mt-1">
                                reacted
                            </p>

                        </div>

                    </div>

                </motion.div>
            }

        </AnimatePresence>
    );
}

export default GesturePopup;
import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Room from "./pages/Room";
import Landing from "./pages/Landing";

import ProtectedRoute from "./components/ProtectedRoute";

function App(){

    return(
        <Routes>

            <Route path="/" element={<Landing />} />

            <Route path="/signup" element={<Signup />} />

            <Route path="/login" element={<Login />} />

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="/room/:id" element={<Room />} />

        </Routes>
    );
}

export default App;
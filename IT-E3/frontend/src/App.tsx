import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/loginPage";

import Navigation from "./components/navigation";
import SignupPage from "./components/signupPage";
import Dashboard from "./components/dashboard";

const App: React.FC = () => {
    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={< SignupPage/>} />
                <Route path="/dashboard" element={<Dashboard/>} />
            </Routes>
        </Router>
    );
};

export default App;

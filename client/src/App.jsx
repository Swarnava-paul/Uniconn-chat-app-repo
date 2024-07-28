import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Signup from "./pages/signup/SignUp";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuthStatus } from "./redux/userSlice";
import AllColleges from "./pages/allcolleges/AllColleges";
import AllMentors from "./pages/allmentors/AllMentors";
import { Toaster } from "react-hot-toast";
import CollegeUserPage from "./pages/specificmentorcollege/CollegeUserPage";

function App() {
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if this is a manual refresh
    if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch]);

  return (
    <div className="no-scrollbar">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
        <Route path="/colleges" element={<AllColleges />} />
        <Route path="/mentors" element={<AllMentors />} />
        <Route
          path="/user/search/:name"
          element={user ? <Navigate to="/" /> : <CollegeUserPage />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

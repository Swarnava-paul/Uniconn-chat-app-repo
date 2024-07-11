import "./App.css";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuthStatus } from "./redux/userSlice";
import Signup from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
function App() {
  let { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(checkAuthStatus());
  // }, [dispatch]);

  return (
    <div className="no-scrollbar">
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/login" />}
        />
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;

import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Home from "./pages/home/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;

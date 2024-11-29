import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import SocketInterface from "./components/SocketInterface";
import Home from "./components/Home";

function App() {

  return (
      <Routes>
        <Route path="https://chat-upp.onrender.com/" element={<Home/>} />
        <Route path="https://chat-upp.onrender.com/signup" element={<SignUp />} />
        <Route path="https://chat-upp.onrender.com/login" element={<SignIn />} />
        <Route path="https://chat-upp.onrender.com/chat" element={<SocketInterface />} />
      </Routes>
  );
}

export default App;


import { Routes, Route } from "react-router-dom";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import SocketInterface from "./components/SocketInterface";
import Home from "./components/Home";

function App() {

  return (
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/chat" element={<SocketInterface />} />
      </Routes>
  );
}

export default App;


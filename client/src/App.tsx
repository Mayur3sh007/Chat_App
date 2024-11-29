import { Routes, Route } from "react-router-dom";
// import { useState } from "react";
import SignUp from "./components/Signup";
import SignIn from "./components/Signin";
import SocketInterface from "./components/SocketInterface";
// import axiosInstance from "./config/axiosInstance";
// import { Home } from "lucide-react";
import Home from "./components/Home";

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       await axiosInstance.get("/getuser");
  //       setIsAuthenticated(true);
  //     } catch (error) {
  //       setIsAuthenticated(false);
  //     }
  //   };
  //   checkAuth();
  // }, []);

  // if (isAuthenticated === null) {
  //   return <div>Loading...</div>;
  // }

  return (
    // <Router>
      <Routes>
        <Route path="https://chat-upp.onrender.com" element={<Home/>} />
        <Route path="https://chat-upp.onrender.com/signup" element={<SignUp />} />
        <Route path="https://chat-upp.onrender.com/login" element={<SignIn />} />
        <Route path="https://chat-upp.onrender.com/chat" element={<SocketInterface />} />
      </Routes>
    // </Router>
  );
}

export default App;


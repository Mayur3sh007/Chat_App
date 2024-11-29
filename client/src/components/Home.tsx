import { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get("https://chat-app-backend-5es5.onrender.com/api/v1/user/getuser", { withCredentials: true });
      // const response = await axios.get("http://localhost:3000/api/v1/user/getuser",{withCredentials:true})
      setUser(response.data.data);
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const toLogin = () => {
    navigate("/login");
  };
  const toChat = () =>{
    navigate("/chat");
  }

  const logout = async () => {
    try {
      // Sending a POST request to logout, passing userId in the request body
      await axios.post("https://chat-app-backend-5es5.onrender.com/api/v1/user/logout", { userId: user._id }, { withCredentials: true });
      // Alternative DELETE request, passing userId in the request body
      // await axios.delete("http://localhost:3000/api/v1/user/logout", { data: { userId: user._id }, withCredentials: true });
  
      setUser(null); // Reset user state to null after successful logout
      navigate("/login"); // Redirect to login page after logging out
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };
  

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  return (
    <div className="home-page">
      <header>
        <nav>
          <h1>ChatApp</h1>
          {user ? (
            <div className="user-info">
              <span className="username">{user.username}</span>
              <button onClick={logout} className="logout-button">Logout</button>
            </div>
          ) : (
            <button className="login-button" onClick={toLogin}>Login</button>
          )}
        </nav>
      </header>

      <main>
        <div className="hero-content">
          <h1>Connect Instantly with <span className="highlight">ChatApp</span></h1>
          <p>Experience seamless communication with friends and colleagues. Start chatting now and stay connected wherever you go!</p>
          <button onClick={toChat}  className="cta-button">Start Chatting</button>
        </div>
      </main>

      <footer>
        <p>&copy; 2024 ChatApp. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;

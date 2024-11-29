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
      await axios.get("https://chat-app-backend-5es5.onrender.com/api/v1/user/logout", { withCredentials: true });
      setUser(null);
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
              <img src={user.avatar} alt={user.username} className="avatar" />
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

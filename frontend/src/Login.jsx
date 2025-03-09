import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

function Login() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5500/login", { email, password })
      .then((result) => {
        if (result.data.status === "Success") {
          // Save user info to localStorage
          localStorage.setItem("user", JSON.stringify(result.data.user));
          navigate("/");
          window.location.reload();
        } else {
          alert(result.data.message); 
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="container">
    <div className="form-card">
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                    type="email"
                    placeholder="Enter Email"
                    autoComplete="off"
                    name="email"
                    className="form-control"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                    type="password"
                    placeholder="Enter Password"
                    autoComplete="off"
                    name="password"
                    className="form-control"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <button type="submit" className="btn">Login</button>
        </form>
    </div>
</div>
  );
}

export default Login;
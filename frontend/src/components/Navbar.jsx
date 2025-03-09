import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    }

    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchIconClick = () => {
    setSearchOpen(!searchOpen);
    setQuery("");
  };

  const handleSearch = () => {
    if (query) {
      navigate(`/search?query=${query}`, { state: { query } });
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  const handleLog = () => {
    navigate("/login");
  };

  const handleSign = () => {
    navigate("/register");
  };

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>MovieZone</h1>
      </div>
      <ul className="nav-links">
        <NavLink className="liinks" to="/">
          Home
        </NavLink>
        <NavLink className="liinks" to="/trending">
          Trending
        </NavLink>
        <NavLink className="liinks" to="/recommendation">
          Recommendation
        </NavLink>
      </ul>
      <div className="search-container" ref={searchRef}>
        <span className="search-icon" onClick={handleSearchIconClick}>
          {searchOpen ? <FaTimes /> : <FaSearch />}
        </span>
        {searchOpen && (
          <div className="navbar-search-bar">
            <input
              type="text"
              placeholder="Search movies..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
        )}
      </div>

      <div className="user-auth">
        {user ? (
          <div>
            <span style={{ color: "orange", fontSize: "20px" }}>
              Welcome, {user.name}!
            </span>
            <button onClick={handleLogout} className="login-btn">
              Logout
            </button>
          </div>
        ) : (
          <>
            <button onClick={handleLog} className="login-btn">
              Login
            </button>
            <button onClick={handleSign} className="signup-btn">
              Sign Up
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
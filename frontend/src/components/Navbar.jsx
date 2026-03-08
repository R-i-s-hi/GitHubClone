import React from 'react'
import { Link } from "react-router-dom";
import "./navbar.css";

function Navbar() {
  return (
    <nav>
      <Link className="navbar-link" to="/">
        <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "0.8rem"}}>
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>GitHub</h3>
        </div>
      </Link>
      <div>
        <Link className="navbar-link" to="/create"> 
          <button className='create-repo-btn'>
            <span style={{display: "flex", justifyContent: "center", alignItems: "center", gap: "0.2rem"}}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                <path d="M12.0002 4.875C12.6216 4.875 13.1252 5.37868 13.1252 6V10.8752H18.0007C18.622 10.8752 19.1257 11.3789 19.1257 12.0002C19.1257 12.6216 18.622 13.1252 18.0007 13.1252H13.1252V18.0007C13.1252 18.622 12.6216 19.1257 12.0002 19.1257C11.3789 19.1257 10.8752 18.622 10.8752 18.0007V13.1252H6C5.37868 13.1252 4.875 12.6216 4.875 12.0002C4.875 11.3789 5.37868 10.8752 6 10.8752H10.8752V6C10.8752 5.37868 11.3789 4.875 12.0002 4.875Z" fill="#f1f6fd"/>
              </svg>
              <p className='nav-create-line'>create</p>
              <p>repo</p>
            </span>
          </button>
        </Link>
        <div className="navbar-link dropdown">
          
          <button className='profile-btn dropdown-toggle' type='button' data-bs-toggle="dropdown" aria-expanded="false">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
              <path d="M12.0672 2C9.6678 2 7.72266 3.94514 7.72266 6.34459C7.72266 8.74404 9.6678 10.6892 12.0672 10.6892C14.4667 10.6892 16.4118 8.74404 16.4118 6.34459C16.4118 3.94514 14.4667 2 12.0672 2Z" fill="#f1f6fd"/>
              <path d="M20.25 19.453C20.2421 19.8615 19.9087 20.1895 19.5001 20.1895H4.50013C4.09157 20.1895 3.75818 19.8624 3.75027 19.454L3.75023 19.452L3.75019 19.4493L3.7501 19.4423L3.75 19.4211C3.74999 19.404 3.75015 19.3807 3.75072 19.3516C3.75187 19.2937 3.75468 19.2127 3.76117 19.1119C3.77413 18.9107 3.80189 18.6292 3.86099 18.2937C3.97867 17.6258 4.22374 16.7262 4.73808 15.8194C5.79641 13.9537 7.92408 12.1895 12.0001 12.1895C16.0762 12.1895 18.2038 13.9537 19.2622 15.8194C19.7765 16.7262 20.0216 17.6258 20.1393 18.2937C20.1984 18.6292 20.2261 18.9107 20.2391 19.1119C20.2456 19.2127 20.2484 19.2937 20.2495 19.3516C20.2501 19.3807 20.2503 19.404 20.2503 19.4211L20.2502 19.4423L20.2501 19.4493L20.25 19.452L20.25 19.453Z" fill="#f1f6fd"/>
            </svg>
          </button>

          <ul class="dropdown-menu">
            <li>
              <Link class="dropdown-item" to="/profile">profile</Link>
            </li>
            <li>
              <button
                class="dropdown-item"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  setCurrentUser(null);

                  window.location.href = "/auth";
                }}
              >
                logout
              </button>
            </li>

          </ul>

        </div>
      </div>
    </nav>
  )
}

export default Navbar
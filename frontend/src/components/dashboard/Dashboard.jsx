import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar.jsx";
import {Link} from 'react-router-dom';

function Dashboard() {

  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/repo/get/${userId}`
        );
        if(!response) {
          console.error("No response from server");
          setRepositories([]);
          return;
        } else {
          const data = await response.json();
          setRepositories(data.repositories);
        }
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:5000/repo/allrepos`);
        const data = await response.json();
        setSuggestedRepositories(data);
        console.log(suggestedRepositories);
      } catch (err) {
        console.error("Error while fecthing repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery == "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);


  return (
    <>
      <Navbar />
      <section className="dashboard">
        <aside className={`custom-offcanvas ${isOpen ? "active" : ""}`}>
          <div className="suggest-heading">
            <h3>Suggestions</h3>
            <button onClick={() => setIsOpen(false)}>

              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
              <path d="M5.9545 5.95548C6.39384 5.51614 7.10616 5.51614 7.5455 5.95548L11.999 10.409L16.4524 5.95561C16.8918 5.51627 17.6041 5.51627 18.0434 5.95561C18.4827 6.39495 18.4827 7.10726 18.0434 7.5466L13.59 12L18.0434 16.4534C18.4827 16.8927 18.4827 17.605 18.0434 18.0444C17.6041 18.4837 16.8918 18.4837 16.4524 18.0444L11.999 13.591L7.5455 18.0445C7.10616 18.4839 6.39384 18.4839 5.9545 18.0445C5.51517 17.6052 5.51516 16.8929 5.9545 16.4535L10.408 12L5.9545 7.54647C5.51516 7.10713 5.51517 6.39482 5.9545 5.95548Z" fill="#f1fdf6"/>
              </svg>


            </button>
          </div>
          <div className="suggested-repo">
            {suggestedRepositories.length === 0 ? 
            (
              <p>No suggested repositories available.</p>
            ) : 
            (
              suggestedRepositories.map((repo) => {
                return (
                  <div className="repo-div" key={repo._id}>
                    <Link id='repo-name' to={`/repo/${repo._id}`}>
                      <h4>{repo.name}</h4>
                    </Link>
                    <p>{repo.description}</p>
                </div>
                )
              })
            )
            }
          </div>

          <hr className="suggested-events" />
          <div className="suggested-events">

            <h3 style={{ marginBottom: "0.5rem" }}>Upcoming Events</h3>
          <ul className="event-listing">
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>

          </div>
        </aside>
        <main className="d-flex flex-column">

          <div>

            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem"}}>
            <button onClick={() => setIsOpen(true)} className="open-offcanvas">
              <p>
                ☰ <span className="suggestion-btn-line">Suggestions</span>
              </p>
            </button>
            <h2>Your Repositories</h2>
          </div>

          <div id="search">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          </div>

          <div className="main-repos">

            {searchResults.map((repo) => {
            return (
                <div className="search-repo-div"  key={repo._id}>
                  <Link id="repo-name" to={`/repo/${repo._id}`}>
                    <h4>{repo.name}</h4>
                  </Link>
                  <p>{repo.description}</p>
                </div>
              );
            })}

          </div>

        </main>
        <aside>
          <h3 style={{ marginBottom: "0.5rem", marginTop: "0" }}>Upcoming Events</h3>
          <ul className="event-listing">
            <li>
              <p>Tech Conference - Dec 15</p>
            </li>
            <li>
              <p>Developer Meetup - Dec 25</p>
            </li>
            <li>
              <p>React Summit - Jan 5</p>
            </li>
          </ul>
        </aside>
      </section>
    </>
  )
}

export default Dashboard;
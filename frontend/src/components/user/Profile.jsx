import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

function Profile() {

  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const { setCurrentUser } = useAuth();
  const [repositories, setRepositories] = useState([]);

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

    fetchRepositories();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");

      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:5000/user/userProfile/${userId}`
          );
          setUserDetails(response.data);
        } catch (err) {
          console.error("Cannot fetch user details: ", err);
        }
      }
    };
    fetchUserDetails();
  }, []);


  return (
    <>
      <Navbar />
      <UnderlineNav className="underlineNavComponent" aria-label="Repository">
        <UnderlineNav.Item
          aria-current="page"
          icon={BookIcon}
          sx={{
            backgroundColor: "transparent",
            color: "white",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Overview
        </UnderlineNav.Item>

        <UnderlineNav.Item
          onClick={() => navigate("/repo")}
          icon={RepoIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Starred Repositories
        </UnderlineNav.Item>
      </UnderlineNav>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div className="profile-image">
          </div>

          <div className="name">
            <h3>{userDetails.username}</h3>
          </div>

          <button className="follow-btn">Follow</button>

          <div className="follower">
            <p>10 Follower</p>
            <p>3 Following</p>
          </div>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>
      </div>

      <div className="reposContainer">
        <hr style={{marginBlock: "0 1.5rem", opacity: "1"}} />
          <h2 className="repotag">Repositories</h2>

          <div className="repos row row-cols-1 row-cols-md-2 g-2">
            {repositories && repositories.length > 0 ? repositories.map((repo) => {
              return (
                <div className="col" key={repo._id}>
                  <Link to={`/repo/${repo._id}`}>
                    <span style={{display: "flex", alignItems: "center", gap: "6px"}}>

                    <h4>{repo.name}</h4>
                    {repo.visibility == true ? (
                      <span class="badge text-bg-secondary">public</span>
                    ) : (
                      <span class="badge text-bg-secondary">private</span>
                    )}

                  </span>
                  </Link>
                  <p>{repo.description}</p>
                </div>
              )
            }) : (
              <p className="norepo">
                no repos yet. create a repo
              </p>
            )
            }
          </div>
      </div>
    </>
  )
}

export default Profile;
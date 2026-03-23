import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./profile.css";
import Navbar from "../Navbar";
import { UnderlineNav } from "@primer/react";
import { IssueOpenedIcon, BookIcon, RepoIcon } from "@primer/octicons-react";
import HeatMapProfile from "./HeatMap";
import IssueModal from "./IssueModal";
import { CircleDot,CircleDotDashed } from 'lucide-react';
import toast from "react-hot-toast";
import { UploadButton } from "../utils/uploadthingClient.js";

function Profile() {

  const { id } = useParams();
  const [userDetails, setUserDetails] = useState({ username: "username" });
  const [repositories, setRepositories] = useState([]);
  const [starRepositories, setStarRepositories] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [isOverview, setIsOverview] = useState("overview");
  const [issues, setIssues] = useState([]);
  const currUser = localStorage.getItem("userId");
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [selectedModal, setSelectedModal] = useState("");
  const [userValues, setUserValues] = useState({
    username: "",
    image: null,
    password: ""
  });
  const [pendingImage, setPendingImage] = useState(null);
  const [modalPassword, setModalPassword] = useState("");

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/repo/get/${id}`
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
    }
    fetchRepositories();
  }, []);

  const fetchUserDetails = async () => {

    if (id) {
      try {
        const response = await axios.get(
          `http://localhost:5000/user/userProfile/${id}`
        );
        setUserDetails(response.data);
        setUserValues({
          username: response.data.username || "",
          password: "",
          image: response.data.image || null
        })
      } catch (err) {
        console.error("Cannot fetch user details: ", err);
      }
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const fetchStarRepos = async () => {
      const userId = id;
      try {
        const response = await fetch(`http://localhost:5000/user/${userId}/starRepos`);
        const data = await response.json();
        setStarRepositories(data);
      } catch (e) {
        console.log("error: ", e);
      }
    };

    fetchStarRepos();
  }, []);

  useEffect(() => {
    const getAllIssues = async () => {
      try {
        const allIssues = await Promise.all(
          repositories.map(async (repo) => {
            const result = await fetch(`http://localhost:5000/issue/allIssues/${repo._id}`);
            return result.json();
          })
        );

        const mergedIssues = allIssues
                                .flat()
                                .filter(issue => !issue.error);
        setIssues(mergedIssues);
      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    };

    if (repositories && repositories.length > 0) {
      getAllIssues();
    }
  }, [repositories, issues]);

  const handleStatus = async (issueStatus, id) => {
    const status = issueStatus === "open" ? "closed" : "open";
    
    try {
      const res = await fetch(`http://localhost:5000/issue/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({status}),
      });

      if (res.status == 200) {
            toast.success("Issue status is updated!");
            } else {
              toast.error("something went wrong!");
            }
    } catch (err) {
      console.error("saveChanges error: ", err);
      toast.error("Something went wrong!");
    }
    
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserValues(prev => ({ ...prev, [name]: value }));
  };

  const handleModalPasswordChange = (e) => {
    setModalPassword(e.target.value);
  };

  const handleConfirm = async (newImage) => {
    const payload = {
      ...userValues,
      newImage,
      confirmPassword: modalPassword,
    };

    const res = await fetch(`http://localhost:5000/user/updateProfile/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      fetchUserDetails();
      setPendingImage(null);
      toast.success("profile updated successfully!");
    } else {
      toast.error("Can't change profile. check your password!");
    }
  };

  return (
    <>
      <Navbar />
      <UnderlineNav className="underlineNavComponent" aria-label="Repository">
        <UnderlineNav.Item
          onClick={() => {
            setActiveTab("overview");
            setIsOverview("overview");
          }}
          aria-current={isOverview == "overview" ? 'page' : undefined}
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
          onClick={() => {
            setActiveTab("starred");
            setIsOverview("starred");
          }}
          aria-current={isOverview == "starred" ? 'page' : undefined}
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
        
        <UnderlineNav.Item
          onClick={() => {
            setActiveTab("issues");
            setIsOverview("issues");
          }}
          aria-current={isOverview == "issues" ? 'page' : undefined}
          icon={IssueOpenedIcon}
          sx={{
            backgroundColor: "transparent",
            color: "whitesmoke",
            "&:hover": {
              textDecoration: "underline",
              color: "white",
            },
          }}
        >
          Issues
        </UnderlineNav.Item>
      </UnderlineNav>

      <div className="profile-page-wrapper">
        <div className="user-profile-section">
          <div>
            <div className="profile-image">
              {userValues.image && (
                <img
                  src={userValues.image}
                  alt="Uploaded"
                  style={{ width: "inherit" }}
                />
              )}
              <button className="edit-btn" type="button" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3028 3.7801C18.4241 2.90142 16.9995 2.90142 16.1208 3.7801L14.3498 5.5511C14.3442 5.55633 14.3387 5.56166 14.3333 5.5671C14.3279 5.57253 14.3225 5.57803 14.3173 5.58359L5.83373 14.0672C5.57259 14.3283 5.37974 14.6497 5.27221 15.003L4.05205 19.0121C3.9714 19.2771 4.04336 19.565 4.23922 19.7608C4.43508 19.9567 4.72294 20.0287 4.98792 19.948L8.99703 18.7279C9.35035 18.6203 9.67176 18.4275 9.93291 18.1663L20.22 7.87928C21.0986 7.0006 21.0986 5.57598 20.22 4.6973L19.3028 3.7801ZM14.8639 7.15833L6.89439 15.1278C6.80735 15.2149 6.74306 15.322 6.70722 15.4398L5.8965 18.1036L8.56029 17.2928C8.67806 17.257 8.7852 17.1927 8.87225 17.1057L16.8417 9.13619L14.8639 7.15833ZM17.9024 8.07553L19.1593 6.81862C19.4522 6.52572 19.4522 6.05085 19.1593 5.75796L18.2421 4.84076C17.9492 4.54787 17.4743 4.54787 17.1814 4.84076L15.9245 6.09767L17.9024 8.07553Z" className='icon-path'/>
                </svg>
              </button>
              <div class="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered">
                      <div class="modal-content" style={{backgroundColor: "#0c1110", color: "whitesmoke", border: "0.8px solid #808080ac"}}>
                          <div class="modal-header py-3 px-4" style={{borderBottom: "0.8px solid #808080ac"}}>
                              <h1 class="modal-title fs-6 fw-bold" id="staticBackdropLabel">Edit Profile</h1>
                          </div>
                          <div class="modal-body px-4">  
                            <form className="edit-repo-form">
                              <div>
                                <label htmlFor="username">Username</label>
                                <input
                                  type="text"
                                  id="username"
                                  name="username"
                                  maxLength={20}
                                  required
                                  value={userValues.username}
                                  onChange={handleChange}
                                />
                                <i style={{
                                  color: "#808080",
                                  fontSize: "9.5px",
                                  textAlign: "right",
                                  display: "inline-block",
                                  width: "100%"
                                }}>
                                  *max 20 characters
                                </i>
                              </div>

                              <div>
                                <label htmlFor="password">New Password</label>
                                <input
                                  type="password"
                                  id="password"
                                  name="password"
                                  minLength={6}
                                  maxLength={10}
                                  required
                                  value={userValues.password}
                                  onChange={handleChange}
                                />
                                <i style={{
                                  color: "#808080",
                                  fontSize: "9.5px",
                                  textAlign: "right",
                                  display: "inline-block",
                                  width: "100%"
                                }}>
                                  *max 20 characters
                                </i>
                              </div>

                              <div className="mb-3 rounded p-4 text-center" style={{border: "1px dotted gray"}}>
                                {pendingImage && (
                                  <div className="mb-3 d-flex flex-column align-items-center">
                                    <img
                                      src={pendingImage}
                                      alt="Pending preview"
                                      className="img-thumbnail"
                                    />
                                    <small style={{color: "whitesmoke", fontSize: "11px"}}>Preview</small>
                                  </div>
                                )}
                                <UploadButton
                                  endpoint="imageUploader"
                                  appearance={{
                                    button: "btn btn-secondary",
                                    container: "d-flex flex-column align-items-center gap-2",
                                    allowedContent: "form-text text-muted"
                                  }}
                                  content={{
                                    allowedContent: <span style={{ color: "whitesmoke", fontSize: "11px" }}>Images size up to 4MB</span>
                                  }}
                                  onClientUploadComplete={(res) => {
                                    if (res && res[0]?.url) {
                                      setPendingImage(res[0].url);
                                      setUserDetails(res[0].url);
                                    }
                                  }}
                                  
                                  onUploadError={(error) => {
                                    alert(`Upload failed: ${error.message}`);
                                  }}
                                />
                              </div>

                              <span className="modal-footer px-0" style={{ borderTop: "0"}}>
                                <button
                                  type="button"
                                  className="btn btn-secondary fw-semibold px-4"
                                  data-bs-dismiss="modal"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  data-bs-toggle="modal"
                                  data-bs-target="#confirmationModal"
                                  className="btn fw-semibold px-4"
                                  style={{
                                    backgroundColor: "green",
                                    color: "whitesmoke",
                                    border: "1px solid green"
                                  }}
                                >
                                  Save
                                </button>
                              </span>
                            </form>
                          </div>
                      </div>
                  </div>
              </div>
              <div class="modal fade" id="confirmationModal" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog  modal-dialog-centered">
                  <div class="modal-content" style={{backgroundColor: "#0c1110", color: "whitesmoke", border: "0.8px solid #808080ac"}}>
                    
                    <div class="modal-header py-3 px-4" style={{borderBottom: "0.8px solid #808080ac"}}>
                        <h1 class="modal-title fs-6 fw-bold" id="staticBackdropLabel">Password Confirmation</h1>
                    </div>
                    
                    <div class="modal-body  px-4">
                      <div className="d-flex flex-column gap-2">
                        <label htmlFor="password">Password</label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          minLength={6}
                          maxLength={10}
                          required
                          value={modalPassword}
                          onChange={handleModalPasswordChange}
                          style={{backgroundColor: "black", border: "none", borderRadius: "8px", padding: "0.3rem 0.5rem", color: "whitesmoke"}}
                        />
                        <i style={{
                          color: "#808080",
                          fontSize: "9.5px",
                          textAlign: "right",
                          display: "inline-block",
                          width: "100%"
                        }}>
                        </i>
                      </div>
                      <div className="modal-footer px-0" style={{borderTop: "none"}}>
                        <button
                          type="button"
                          className="btn btn-secondary fw-semibold px-4"
                          data-bs-dismiss="modal"
                          style={{fontSize: "12px"}}
                        >
                          Cancel
                        </button>
                        <button 
                          type="button"
                          className="btn btn-success fw-semibold px-4"
                          style={{fontSize: "12px"}}
                          data-bs-dismiss="modal"
                          onClick={() => {
                            setModalPassword("");
                            handleConfirm(pendingImage);
                          }}
                        >
                          Confirm
                        </button>
                      </div>
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="name">
              <h3 className="text-center">{userDetails.username}</h3>
            </div>
          </div>

          <div className="right-element">

            {currUser !== id ? (
              <button className="follow-btn">Follow</button>
            ) : (<></>)}

            <div className="follower">
              <p>10 Follower</p>
              <p>3 Following</p>
            </div>
          </div>
        </div>

        <div className="heat-map-section">
          <HeatMapProfile />
        </div>
      </div>

      {activeTab === "overview" && (
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

                <div className="no-issue-container">
                  <img src="/no-data.svg" alt="no-data" />
                  <p className="norepo">
                    no repos yet. create a repo
                  </p>
                </div>

              )
              }
            </div>
        </div>
      )}

      {activeTab === "starred" && (
        <div className="reposContainer">
          <hr style={{ marginBlock: "0 1.5rem", opacity: "1" }} />
          <h2 className="repotag">Stared Repositories</h2>

          <div className="repos row row-cols-1 row-cols-md-2 g-2">
            {starRepositories.length > 0 ? (
              starRepositories.map((repo) => (
                <div className="col" key={repo._id}>
                  <Link to={`/repo/${repo._id}`}>
                    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <h4>{repo.name}</h4>
                      {repo.visibility === true ? (
                        <span className="badge text-bg-secondary">public</span>
                      ) : (
                        <span className="badge text-bg-secondary">private</span>
                      )}
                    </span>
                  </Link>
                  <p>{repo.description}</p>
                </div>
              ))
            ) : (
              <div className="no-issue-container">
                  <img src="/no-data.svg" alt="no-data" />
                  <p className="norepo">
                    no stared repositories yet.
                  </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "issues" && (
        <div className="reposContainer">
          <hr style={{marginBlock: "0 1.5rem", opacity: "1"}} />
          <h2 className="repotag">Issues</h2>

          <div className="repos row row-cols-1 row-cols-md-2 g-2">
            {issues.map((issue) => (

                <div className="col p-0" key={issue._id}>
                  
                  <div id="issue-header">
                    <div>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px"}}>
                        <h4 className="mb-0">{issue.title}</h4>

                        {issue.status === "open" ? (
                          <span className="badge text-bg-success mb-0">open</span>
                        ) : (
                          <span className="badge text-bg-warning mb-0">closed</span>
                        )}
                      </span>
                    </div>
                    
                    {currUser == issue.createdBy ? (
                      <div className="btns">
                        <button onClick={() => { setSelectedIssue(issue); setSelectedModal("edit");}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.3028 3.7801C18.4241 2.90142 16.9995 2.90142 16.1208 3.7801L14.3498 5.5511C14.3442 5.55633 14.3387 5.56166 14.3333 5.5671C14.3279 5.57253 14.3225 5.57803 14.3173 5.58359L5.83373 14.0672C5.57259 14.3283 5.37974 14.6497 5.27221 15.003L4.05205 19.0121C3.9714 19.2771 4.04336 19.565 4.23922 19.7608C4.43508 19.9567 4.72294 20.0287 4.98792 19.948L8.99703 18.7279C9.35035 18.6203 9.67176 18.4275 9.93291 18.1663L20.22 7.87928C21.0986 7.0006 21.0986 5.57598 20.22 4.6973L19.3028 3.7801ZM14.8639 7.15833L6.89439 15.1278C6.80735 15.2149 6.74306 15.322 6.70722 15.4398L5.8965 18.1036L8.56029 17.2928C8.67806 17.257 8.7852 17.1927 8.87225 17.1057L16.8417 9.13619L14.8639 7.15833ZM17.9024 8.07553L19.1593 6.81862C19.4522 6.52572 19.4522 6.05085 19.1593 5.75796L18.2421 4.84076C17.9492 4.54787 17.4743 4.54787 17.1814 4.84076L15.9245 6.09767L17.9024 8.07553Z" className='icon-path'/>
                          </svg>
                          <span className="issue-btn-text">&nbsp;edit</span>
                        </button>

                        <button onClick={() => {handleStatus(issue.status, issue._id)}}>
                          {issue.status === "open" ? (
                            <>
                              <CircleDotDashed style={{width: "12px", height: "12px"}}/>
                              <span className="issue-btn-text">&nbsp;close</span>
                            </>
                          ) : (
                            <>
                              <CircleDot style={{width: "12px", height: "12px"}} />
                              <span className="issue-btn-text">&nbsp;open</span>
                            </>
                          )}
                        </button>

                        <button onClick={() => { setSelectedIssue(issue); setSelectedModal("delete");}}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" transform="rotate(0 0 0)">
                            <path d="M14.7223 12.7585C14.7426 12.3448 14.4237 11.9929 14.01 11.9726C13.5963 11.9522 13.2444 12.2711 13.2241 12.6848L12.9999 17.2415C12.9796 17.6552 13.2985 18.0071 13.7122 18.0274C14.1259 18.0478 14.4778 17.7289 14.4981 17.3152L14.7223 12.7585Z" class="icon-path"/>
                            <path d="M9.98802 11.9726C9.5743 11.9929 9.25542 12.3448 9.27577 12.7585L9.49993 17.3152C9.52028 17.7289 9.87216 18.0478 10.2859 18.0274C10.6996 18.0071 11.0185 17.6552 10.9981 17.2415L10.774 12.6848C10.7536 12.2711 10.4017 11.9522 9.98802 11.9726Z" class="icon-path"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.249 2C9.00638 2 7.99902 3.00736 7.99902 4.25V5H5.5C4.25736 5 3.25 6.00736 3.25 7.25C3.25 8.28958 3.95503 9.16449 4.91303 9.42267L5.54076 19.8848C5.61205 21.0729 6.59642 22 7.78672 22H16.2113C17.4016 22 18.386 21.0729 18.4573 19.8848L19.085 9.42267C20.043 9.16449 20.748 8.28958 20.748 7.25C20.748 6.00736 19.7407 5 18.498 5H15.999V4.25C15.999 3.00736 14.9917 2 13.749 2H10.249ZM14.499 5V4.25C14.499 3.83579 14.1632 3.5 13.749 3.5H10.249C9.83481 3.5 9.49902 3.83579 9.49902 4.25V5H14.499ZM5.5 6.5C5.08579 6.5 4.75 6.83579 4.75 7.25C4.75 7.66421 5.08579 8 5.5 8H18.498C18.9123 8 19.248 7.66421 19.248 7.25C19.248 6.83579 18.9123 6.5 18.498 6.5H5.5ZM6.42037 9.5H17.5777L16.96 19.7949C16.9362 20.191 16.6081 20.5 16.2113 20.5H7.78672C7.38995 20.5 7.06183 20.191 7.03807 19.7949L6.42037 9.5Z" class="icon-path"/>
                          </svg>
                          <span className="issue-btn-text">&nbsp;delete</span>
                        </button>

                      </div>
                    ): (
                      <></>
                    )}


                  </div>

                  <div className="issue-content">
                    <div>
                      <span >
                        issue id:&nbsp;{issue._id}
                      </span> <br />
                      <span >
                        issued repo:
                        <Link className="ps-1" to={`/repo/${issue.repository}`}>
                            {issue.repository}
                        </Link>
                      </span>
                    </div>

                    <button
                      className="issue-view-btn"
                      onClick={() => { setSelectedIssue(issue); setSelectedModal("details");}}
                    >
                      details
                    </button>

                    <IssueModal issue={selectedIssue} type={selectedModal} onClose={() => setSelectedIssue(null)} />
                  </div>

                </div>
            ))}
          </div>


          {issues.length == 0 && (
            <div className="no-issue-container">
              <img src="/no-data.svg" alt="no-data" />
              <p>There is no issue for this repository yet.</p>
            </div>
          )}
          
        </div>
      )}
    </>
  )
}

export default Profile;
import React from "react";
import "./issuemodal.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function IssueModal({ issue, onClose, type }) {
  if (!issue) return null;
  const currUser = localStorage.getItem("userId");
  const navigate = useNavigate();

  const handleIssueChange = (e) => {
    const { name, value } = e.target;
    setIssueValues((prev) => ({ ...prev, [name]: value }));
  };

  const [issueValues, setIssueValues] = useState({
    title: "",
    description: "",
  });

  const saveChanges = async (e) => {
    e.preventDefault();
    try {
      const result = await fetch(`http://localhost:5000/issue/${issue._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issueValues),
      });

      if (result.status == 200) {
        toast.success("Issue updated successfully!");
        onClose();
      } else {
        toast.error("Update failed!");
      }
    } catch (err) {
      console.error("saveChanges error: ", err);
      toast.error("Something went wrong!");
    }
  };

  const deleteIssue = async (id) => {
    try {
        const result = await fetch(`http://localhost:5000/issue/${id}`, {method: "DELETE"});

        if(result.status == 200) {
            toast.success("repo deleted successfully");
            onClose();
            navigate(`/profile/${currUser}`);
        }
    } catch(e) {
        console.log(e);
        toast.error("something went wrong!");
    }
  }


  useEffect(() => {
    if (issue) {
      setIssueValues({
        title: issue.title || "",
        description: issue.description || "",
      });
    }
  }, [issue]);


  let modalContent;
  if(type === "details") {

    modalContent = (
        <div className="custom-modal-overlay" onClick={onClose}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()} >
            <div className="modal-header">
              <h2 className="modal-title">Issue Details</h2>
              <button className="btn btn-secondary" onClick={onClose}>
                ✖
              </button>
            </div>

            <div className="modal-body">
              <i>status:&nbsp;{issue.status}</i><br /><br />
              <h4>{issue.title}</h4>
              <p>{issue.description}</p><br />
              <p>ID: {issue._id}</p>
              <p>
                Created at: {new Date(issue.createdAt).toLocaleString()}
              </p><br />
              <p>Repo:&nbsp;
                <Link className="link" to={`/repo/${issue.repository}`}>
                  {issue.repository}
                </Link>
              </p>
              <p>Created by:&nbsp;
                <Link className="link" to={`/profile/${issue.createdBy}`}>
                  {issue.createdBy}
                </Link>
              </p>
            </div>
          </div>
        </div>
    )

  } else if (type === "delete") {
    modalContent = (
        <div className="custom-modal-overlay" onClick={onClose}>
          <div className="custom-modal" onClick={(e) => e.stopPropagation()} >
            <div className="modal-header">
              <h2 className="modal-title">Delete Issue</h2>
            </div>

            <div className="modal-body">
              <p>Do you really want to delete this issue?</p>
            </div>
            <div className="modal-footer">
              <button type="button" class="btn btn-secondary fw-semibold px-3 d-flex align-items-center justify-content-center" onClick={onClose}>Cancel</button>
              <button type="submit" class="btn fw-semibold px-3 d-flex align-items-center justify-content-center" style={{backgroundColor: "#ff0000", color: "whitesmoke", border: "none"}} onClick={() => deleteIssue(issue._id)}>Delete</button>
            </div>
          </div>
        </div>
    )
  } else {
    modalContent = (
      <div className="custom-modal-overlay" onClick={onClose}>
        <div className="custom-modal" onClick={(e) => e.stopPropagation()} >
          <div className="modal-header">
            <h2 className="modal-title">Issue Details</h2>
          </div>

          <div className="modal-body">
            <form className="edit-repo-form" onSubmit={saveChanges}>
              <div>
                  <label htmlFor="name">Issue Title</label>
                  <input
                  type="text"
                  id="name"
                  name="title"
                  maxLength={20}
                  value={issueValues.title}
                  onChange={handleIssueChange}
                  required
                  />
                  <i style={{color: "#808080", fontSize: "9.5px", textAlign: "right", display: "inline-block", width: "100%"}} >*max 20 characters</i>
              </div>

              <div>
                  <label htmlFor="description">Description</label>
                  <textarea
                  id="description"
                  name="description"
                  maxLength={100}
                  rows="5"
                  value={issueValues.description}
                  onChange={handleIssueChange}
                  />
                  <i style={{color: "#808080", fontSize: "9.5px", textAlign: "right", display: "inline-block", width: "100%"}} >*max 100 characters</i>
              </div>

              <span class="modal-footer p-0" style={{borderTop: "0"}}>
                  <button type="button" class="btn btn-secondary fw-semibold px-4 d-flex align-items-center justify-content-center" onClick={onClose}>Cancel</button>
                  <button type="submit" class="btn fw-semibold px-4 d-flex align-items-center justify-content-center" style={{backgroundColor: "green", color: "whitesmoke", border: "1px solid green"}}>Add</button>
              </span>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      {modalContent}
    </>
  );
}

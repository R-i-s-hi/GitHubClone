import { s3, S3_BUCKET } from "../config/aws-config.js";
import User from "../models/user.model.js";
import Repository from "../models/repo.model.js";

export const isVerified = async (username, repoName) => {
  try {
    const userExists = Boolean(await User.exists({ username }));
    const repoExists = Boolean(await Repository.exists({ name: repoName }));

    return userExists && repoExists;
  } catch (e) {
    console.error("Error while verifying:", e);
    return false;
  }
};

export const fetchRepoFiles = async (repoName) => {

  try {
    const params = {
      Bucket: S3_BUCKET,
      Prefix: `commits/${repoName}/`,
    };

    const data = await s3.listObjectsV2(params).promise();

    const files = data.Contents
      .filter(item => item.Key.split("/").pop() !== "commit.json")
      .map(item => ({
      key: item.Key,
      fileName: item.Key.split("/").pop(),
      size: item.Size,
      lastModified: item.LastModified,
      }));

    return files;
  } catch (err) {
    console.error("Error fetching repo files:", err);
    return err;
  }
};

export const fetchFileContent = async (req, res) => {

  const {key} = req.body;
  
  try {
    const params = {
      Bucket: S3_BUCKET,
      Key: key,
    };

    const data = await s3.getObject(params).promise();
    const content = data.Body.toString("utf-8");
    res.json({ content });

  } catch (err) {
    console.error("Error fetching file content:", err);
    res.status(500).json({ error: "Failed to fetch file content" });
  }
};

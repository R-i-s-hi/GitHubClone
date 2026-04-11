import {s3,S3_BUCKET} from "../config/aws-config.js";

export const fetchRepoFiles = async (repoName) => {

  try {
    const params = {
      Bucket: S3_BUCKET,
      Prefix: `${repoName}/`,
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

export const fetchRepoFileContent = async (req, res) => {

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

export const updateRepoFileContent = async (req, res) => {
  
  try {
    const {reponame, filename} = req.params;
    const {content} = req.body;

    const params = {
      Bucket: S3_BUCKET,
      Key: `${reponame}/${filename}`,
      Body: content,
      ContentType: "text/plain",
    };

    await s3.putObject(params).promise();
    res.json({ message: "File updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating file");
  }
}
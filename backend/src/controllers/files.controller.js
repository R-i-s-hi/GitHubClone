import { S3Client, ListObjectsV2Command } from "aws-sdk";

const s3 = new S3Client({ region: "ap-south-1" });

const getFiles = async() => {
    try {
    const data = await s3.send(new ListObjectsV2Command({
      Bucket: "repodoc-bucket"
    }));
    const files = data.Contents.map(obj => ({
      key: obj.Key,
      url: `https://${"repodoc-bucket"}.s3.amazonaws.com/${obj.Key}`
    }));
    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching files");
  }
}
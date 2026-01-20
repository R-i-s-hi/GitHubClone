import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../../config/aws-config.js";


const pullRepo = async () => {
    const repoPath = path.resolve(process.cwd(), ".repoGit");
    const commitPath = path.join(repoPath, "commits");

    try {
        
        // gives all dirs in the bucket inside the commits/ folder
        const data = await s3.listObjectsV2({
            Bucket: S3_BUCKET,
            Prefix: 'commits/'
        }).promise();

        // list of all objects inside commits/
        const objects = data.Contents || [];

        for (const obj of objects) {
            const key = obj.Key;

            // folder structure creation
            const commitdir = path.join(
                commitPath,
                path.dirname(key).split("/").pop()
            );

            await fs.mkdir(commitdir, { recursive: true });

            // downloading the file
            const params = {
                Bucket: S3_BUCKET,
                Key: key,
            }

            const fileContent = await s3.getObject(params).promise();
            await fs.writeFile(path.join(repoPath, key), fileContent.Body);

            console.log(`Pulled ${key} from S3.`);

        }

    } catch (e) {
        console.log("Error pulling from S3: ", e);
    }
}


export default pullRepo;
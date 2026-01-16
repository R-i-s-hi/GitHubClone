import fs from 'fs/promises';
import path from 'path';

const initRepo = async () => {
    const repoPath = path.resolve(process.cwd(), ".repoGit"); // create only absolute path
    const commitPath = path.join(repoPath, "commits"); // create both absolute or relative path

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitPath, { recursive: true });
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET})
        );
        console.log("Repository initialized successfully.");

    } catch(e) {
        console.error("Error initializing repository:", e);
    }

}

export default initRepo;
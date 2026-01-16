import fs from 'fs/promises'
import path from 'path'


const addRepo = async (filePath) => {
    const repoPath = path.resolve(process.cwd(), '.repoGit');
    const stagingPath = path.join(repoPath, 'staging');

    try {

        await fs.mkdir(stagingPath, { recursive: true });
        const fileName = path.basename(filePath);

        await fs.copyFile(filePath, path.join(stagingPath, fileName));
        console.log(`File ${fileName} added to staging area!`);


    } catch (e) {
        console.error("Error adding file:", e);
    }
}

export default addRepo;
import fs from 'fs';
import path from 'path';
import {promisify} from 'util';

// promisify() checks for existence before reading or copying
const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);


const revertRepo = async (commitID) => {
    
    const repoPath = path.resolve(process.cwd(), '.repoGit');
    const commitPath = path.join(repoPath, 'commits');
    
    try {
        
        const commitDirPath = path.join(commitPath, commitID);
        const files = await readdir(commitDirPath);
        const parDir = path.resolve(repoPath, '..');

        for(const file of files) {
            await copyFile(
                path.join(commitDirPath, file),
                path.join(parDir, file)
            );
            console.log(`Reverted ${file} to commit ${commitID}`);
        }

    } catch(e) {
        console.log(`Unable to reverting the ${commitID}: `, e);
    }

}

export default revertRepo;
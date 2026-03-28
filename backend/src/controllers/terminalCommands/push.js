import fs from 'fs/promises'
import path from 'path'
import {s3, S3_BUCKET} from '../../config/aws-config.js'
import { isVerified } from '../../utils/helper.js'

const pushRepo = async (username, repoName) => {

    const verified = await isVerified(username, repoName);
    if (!verified) {
      console.log('User or repo not verified.');
      console.log('Please make sure you have created an account as well as the repo.');
      return;
    }

    const repoPath = path.resolve(process.cwd(), '.repoGit');
    const commitPath = path.join(repoPath, 'commits');
    const prevCommitPath = path.join(repoPath, 'prevCommits');

    try {
        await fs.mkdir(prevCommitPath, { recursive: true });

        const dirs = await fs.readdir(commitPath);
        for (const dir of dirs) {
            const dirPath = path.join(commitPath, dir);
            const dirfiles = await fs.readdir(dirPath);

            const prevCommitDirPath = path.join(prevCommitPath, dir);
            await fs.mkdir(prevCommitDirPath, { recursive: true });

            for (const file of dirfiles) {
                const filePath = path.join(dirPath, file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${repoName}/${file}`,
                    Body: fileContent,
                };

                await s3.upload(params).promise();

                await fs.copyFile(filePath, path.join(prevCommitDirPath, file));
                await fs.unlink(filePath);
            }

            await fs.rmdir(dirPath);
            
        }
        console.log('All commits pushed to S3 successfully.');

    } catch(e) {
        console.log('Error pushing to S3: ', e);
    }
}

export default pushRepo;
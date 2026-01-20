import fs from 'fs/promises'
import path from 'path'
import {s3, S3_BUCKET} from '../../config/aws-config.js'

const pushRepo = async () => {
    const repoPath = path.resolve(process.cwd(), '.repoGit');
    const commitPath = path.join(repoPath, 'commits');

    try {
        
        const dirs = await fs.readdir(commitPath);
        for (const dir of dirs) {
            const dirPath = path.join(commitPath, dir);
            const dirfiles = await fs.readdir(dirPath);

            for (const file of dirfiles) {
                const filePath = path.join(dirPath, file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${dir}/${file}`,
                    Body: fileContent,
                };

                await s3.upload(params).promise();
            }
        }
        console.log('All commits pushed to S3 successfully.');

    } catch(e) {
        console.log('Error pushing to S3: ', e);
    }
}

export default pushRepo;
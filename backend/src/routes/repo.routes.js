import express from 'express';
import {
    createRepo,
    getAllRepos,
    fetchRepoById,
    fetchRepoByName,
    getRepo,
    updateRepoById,
    toggleVisById,
    deleteRepoById
} from '../controllers/repo.controller.js';
import { fetchFileContent } from '../utils/helper.js';

const repoRouter = express.Router();

repoRouter.post('/create', createRepo);
repoRouter.get('/allrepos', getAllRepos);
repoRouter.get('/get/:userId', getRepo);
repoRouter.get('/name/:name', fetchRepoByName);
repoRouter.get('/repoid/:id', fetchRepoById);
repoRouter.patch('/toggleVis/:id', toggleVisById);
repoRouter.put('/update/:id', updateRepoById);
repoRouter.delete('/delete/:id', deleteRepoById);

repoRouter.post('/:id/files', fetchFileContent);

export default repoRouter;
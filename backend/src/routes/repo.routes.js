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

const repoRouter = express.Router();

repoRouter.post('/createRepo', createRepo);
repoRouter.get('/allrepos', getAllRepos);
repoRouter.get('/name/:name', fetchRepoByName);
repoRouter.get('/id/:id', fetchRepoById);
repoRouter.get('/:repoId', getRepo);
repoRouter.put('/:id', updateRepoById);
repoRouter.patch('/toggleVis/:id', toggleVisById);
repoRouter.delete('/deleteRepo/:id', deleteRepoById);

export default repoRouter;
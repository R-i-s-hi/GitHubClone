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

repoRouter.post('/create', createRepo);
repoRouter.get('/allrepos', getAllRepos);
repoRouter.get('/:repoId', getRepo);
repoRouter.get('/:name', fetchRepoByName);
repoRouter.get('/:id', fetchRepoById);
repoRouter.patch('/toggleVis/:id', toggleVisById);
repoRouter.put('/update/:id', updateRepoById);
repoRouter.delete('/delete/:id', deleteRepoById);

export default repoRouter;
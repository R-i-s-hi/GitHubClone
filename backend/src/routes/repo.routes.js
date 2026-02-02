import express from 'express';

const repoRouter = express.Router();

repoRouter.get('/', (req, res) => {
    res.send('Welcome to the Repo Route');
});

export default repoRouter;
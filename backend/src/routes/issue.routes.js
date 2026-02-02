import express from 'express';

const issueRouter = express.Router();

issueRouter.get('/', (req, res) => {
    res.send('Welcome to the Issue Route');
});

export default issueRouter;
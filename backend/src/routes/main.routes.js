import express from 'express';

const mainRouter = express.Router();

mainRouter.get('/', (req, res) => {
    res.send('Welcome to the Main Route');
});

export default mainRouter;
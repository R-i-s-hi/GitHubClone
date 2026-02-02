import express from 'express';

const userRouter = express.Router();

userRouter.get('/', (req, res) => {
    res.send('Welcome to the User Route');
});

export default userRouter;
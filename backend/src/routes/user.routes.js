import express from 'express';
import { signup, login, getAllUsers, getUserProfile, updateUserProfile, deleteUserProfile } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter.get('/allUsers', getAllUsers);
userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.get('/userProfile/:id', getUserProfile);
userRouter.put('/updateProfile/:id', updateUserProfile);
userRouter.delete('/deleteProfile/:id', deleteUserProfile);

export default userRouter;
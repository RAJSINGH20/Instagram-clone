import express from 'express';
import {isAuth} from '../middlewares/isSuthmiddleware.js';
import { sendMessage, getMessages } from '../Controller/Msg.Controller.js';

const router = express.Router();

router.post('/send/:id', isAuth, sendMessage);
router.get('/get/:id', isAuth, getMessages);


export default router;
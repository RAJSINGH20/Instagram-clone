import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectdb from './util/db.js';
import UserRoute from './Routes/User.Routes.js';
import User from './model/user.model.js';
import postRoutes from './Routes/Post.Routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true,
    optionsSuccessStatus: 200
};

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

app.get('/', (_, res) => {
    return res.status(200).json({
        message: 'Hello World! Server is running.',
        success: true
    });
});

app.use("/api/v1/user", UserRoute);
app.use("/api/v1/post", postRoutes);
"http://localhost:8000/api/v1/user/signup"

app.listen(PORT, () => {
    connectdb();  
    console.log(`Server listening at http://localhost:${PORT}`);
});

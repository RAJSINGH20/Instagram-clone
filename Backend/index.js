import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectdb from './util/db.js';
import router from './Routes/User.Routes.js';

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

app.use("/api/auth", router);

app.listen(PORT, () => {
    connectdb();  
    console.log(`Server listening at http://localhost:${PORT}`);
});

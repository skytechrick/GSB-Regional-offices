import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import auth from './routes/authRoute.js';
import branchRoute from './routes/branchRoute.js';
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api/auth", auth);
app.use("/api/branch", branchRoute);

app.get('/', (req, res) => {
    return res.json({ message: 'Hello World!' });
});


app.listen(process.env.PORT, () => {
    console.log('Server is running on port 83');
});
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import connectDB from './db.js';
import 'dotenv/config';

const app = express();

app.use(cors({
    origin: 'http://localhost:4200',
    credentials: true
}));
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en purto ${PORT}`);
})
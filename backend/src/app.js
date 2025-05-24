const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const connectDB = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el purto ${PORT}`);
})
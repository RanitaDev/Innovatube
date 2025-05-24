const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('BD Connect');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); // Exit the process with failure
    }
}

mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

export default connectDB;
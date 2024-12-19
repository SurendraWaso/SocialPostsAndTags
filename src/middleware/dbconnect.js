const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_CONNECTION_URI, {
            useNewUrlParser: true
        });
        console.log('DB connected successfully');
    } catch (error) {
        console.error('DB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;

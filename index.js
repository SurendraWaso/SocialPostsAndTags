// server.js
const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./src/middleware/dbconnect');
const authRoutes = require('./src/routes/user');
const postsRoutes = require('./src/routes/posts');

const dotenv = require('dotenv');
dotenv.config();

connectDB();

const app = express();
app.use(bodyParser.json({ limit: '50mb' }));

// Routes
app.use('/auth', authRoutes);
app.use('/posts', postsRoutes);

app.listen(process.env.PORT, () => console.log(`Server is up and is running at ${process.env.PORT}`));
//cd into \image-classification\backend
//then type: nodemon server
//to start server

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fs = require('fs');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true}
);
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const scoresRouter = require('./routes/scores');
const usersRouter = require('./routes/users');
const datumsRouter = require('./routes/datums');
const reviewsRouter = require('./routes/reviews');

app.use('/scores', scoresRouter);
app.use('/users', usersRouter);
app.use('/datums', datumsRouter);
app.use('/reviews', reviewsRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

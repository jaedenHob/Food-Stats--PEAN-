const express = require('express');

const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(express.json());
app.use('/api', authRoutes);

const PORT = 5000;

// show what port we are on
app.listen(PORT, () => console.log(`Express Server listening on port ${PORT}`));
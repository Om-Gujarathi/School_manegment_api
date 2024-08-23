const express = require('express');
const app = express();
const schoolRoutes = require('./routes/school');

require('dotenv').config();

app.use(express.json());

// Define the root route (Optional)
app.get('/', (req, res) => {
    res.send('Welcome to the School Management API');
});

app.use('/api/schools', schoolRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


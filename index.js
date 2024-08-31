require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cryptoRoutes = require('./routes/cryptoRoutes');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

app.use(express.json());
app.use('/api', cryptoRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Assignment Link :- https://koinx.notion.site/Take-home-Assignment-Backend-Intern-3c4296a3e291463db461eaa776c56858',
    tasks: [
      {
        task: 'Task 1',
        description: 'Develop an API using Node.js to fetch the crypto transactions of a user.',
        route: {
          method: 'GET',
          path: '/api/transactions/:address',
          example: '/api/transactions/0xce94e5621a5f7068253c42558c147480f38b5e0d'
        }
      },
      {
        task: 'Task 2',
        description: 'Build a system to fetch the price of Ethereum every 10 minutes and store it in the database.',
      },
      {
        task: 'Task 3',
        description: 'Develop a GET API for a user to provide their Ethereum address and get their total expenses and the current price of Ethereum.',
        route: {
          method: 'GET',
          path: '/api/expenses/:address',
          example: '/api/expenses/0xce94e5621a5f7068253c42558c147480f38b5e0d'
        }
      }
    ]
  });
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

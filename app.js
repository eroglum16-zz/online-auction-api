const express = require('express');
const users = require('./routes/users');
const app = express();
const port = 3030;
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/users',(req, res) => users.getAll(req, res));

app.post('/authenticate',(req, res) => users.auth(req, res));

app.post('/user', (req, res) => users.store(req, res));

app.listen(port, () => console.log(`Auction API listening on port ${port}!`));
const express = require('express');
const users = require('./routes/users');
const locations = require('./routes/locations');
const files = require('./routes/files');
const sales = require('./routes/sales')
const fileUpload = require('express-fileupload');

const app = express();
const port = 3030;
const cors = require('cors');

app.use(fileUpload());

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* ---------- User Endpoints ---------- */

app.get('/users',(req, res) => users.getAll(req, res));

app.post('/user/authenticate',(req, res) => users.auth(req, res));

app.post('/user/get', (req, res) => users.getByToken(req, res));

app.post('/user/save', (req, res) => users.save(req, res));

/* ---------- Location Endpoints ---------- */

app.get('/locations',(req, res) => locations.getAll(req, res));

app.post('/locations',(req, res) => locations.save(req, res));

/* ---------- Sales Endpoints ---------- */

app.get('/sale/:id', (req, res) => sales.getSaleById(req, res));

app.post('/sale/new', (req, res) => sales.save(req, res));

app.get('/sales/active', (req, res) => sales.getActiveSales(req, res));

/* ---------- File Endpoints ---------- */

app.post('/file/product', (req, res) => files.processProductImage(req, res));

app.delete('/file/product', (req, res) => files.revertProductImage(req, res));

app.listen(port, () => console.log(`Auction API listening on port ${port}! Started at: ` + Date(Date.now()) ));
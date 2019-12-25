const express = require('express');
const users = require('./routes/users');
const locations = require('./routes/locations');
const files = require('./routes/files');
const sales = require('./routes/sales')
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const utils = require('./utils');


const app = express();
const port = 3030;
const cors = require('cors');
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));

var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(fileUpload());

app.use(express.json());
app.use(express.static('public'));

app.use(bodyParser.text({ type: 'text/plain' }));

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

var server = app.listen(port, () => console.log(`Auction API listening on port ${port}! Started at: ` + Date(Date.now()) ));
io.listen(server);

/* ---------- Socket Events ----------  */

io.on('connection', socket => {
    console.log('User connected');

    socket.on('new bid', (msg) => {
      console.log(msg);
      sales.updateBids(msg.saleId, msg.bid);
      socket.broadcast.emit('bid update on ' + msg.saleId);
    });

    socket.on('new sale', (msg) => {
        socket.broadcast.emit('update sales');
        let remaining = utils.toTimestamp(msg.endDate) - Date.now();
        setTimeout(() => {
            socket.broadcast.emit('sale ' + msg.saleId + ' expired');
        }, remaining);
    });

    socket.on('disconnect', () => {
      console.log('user disconnected')
    });
});

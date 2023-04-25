require('dotenv').config()
const express = require ('express');
const cors = require('cors');
const path = require ('path');
const https = require('https');
const fs = require('fs');

const app = express ()

app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static (path.join (__dirname, '/public')))

const apiRouter = require('./api/routes/apiRouter')
app.use ('/api', apiRouter)

const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/gpucserver.vps.webdock.cloud/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/gpucserver.vps.webdock.cloud/fullchain.pem')
};

https.createServer(options, app).listen(3000);
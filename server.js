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
const apiRouterAPIv2 = require('./api/routes/apiRouter-v2')
app.use ('/api', apiRouter)
app.use ('/api/series', apiRouterAPIv2)

const options = {
   key: fs.readFileSync('/etc/letsencrypt/live/gpucserver.vps.webdock.cloud/privkey.pem'),
   cert: fs.readFileSync('/etc/letsencrypt/live/gpucserver.vps.webdock.cloud/fullchain.pem')
};
// const port = process.env.PORT || 3000;

// app.listen(port);
https.createServer(options, app).listen(3000);

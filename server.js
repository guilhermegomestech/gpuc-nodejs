require('dotenv').config()

const express = require ('express');
const https = require('https');
const fs = require('fs');
const cors = require('cors');
const path = require ('path')
const app = express ()

app.use(cors())

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use('/app', express.static (path.join (__dirname, '/public')))

let port = process.env.PORT || 3000
// app.listen (port)

const apiRouter = require('./api/routes/apiRouter')
app.use ('/api', apiRouter)


const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/$DOMAIN/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/$DOMAIN/fullchain.pem')
};

https.createServer(options, app).listen(8000);
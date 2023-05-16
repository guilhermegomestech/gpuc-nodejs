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

const produtosRouter = require('./api/routes/produtos/produtos-router')
const seriesRouter = require('./api/routes/series/series-router')

app.use ('/api/v1/produtos', produtosRouter)
app.use ('/api/v1/series', seriesRouter)

const port = process.env.PORT || 3000;
if(process.env.NODE_ENV == 'DEV'){
   app.listen(port);
} else {
   const options = {
      key: fs.readFileSync('/etc/letsencrypt/live/gpucserver.vps.webdock.cloud/privkey.pem'),
      cert: fs.readFileSync('/etc/letsencrypt/live/gpucserver.vps.webdock.cloud/fullchain.pem')
   };
   https.createServer(options, app).listen(port);
}

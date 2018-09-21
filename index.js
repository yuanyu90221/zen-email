
/**
 * server: sindex.js
 */
const express = require('express');
const favicon = require('express-favicon');
const path = require('path');

const app = express();
const {PORT} = require('./config/config.json');

app.use('/static', express.static(path.join(__dirname,'static')));
app.use(favicon(path.join(__dirname,"static","images","favicon.ico")));
// app.use(express.static('static', path.join(__dirname,'static')));
// app.static('static', path.join(__dirname,'static'));
app.get("/", (req, res)=> {
  res.sendFile(path.join(__dirname,"static","index.html"));
});
app.listen(PORT, ()=>{
  console.log(`server listen on ${PORT}`);
});

app.on('error', (error)=> {
  console.log(`server error: ${error}`);
});

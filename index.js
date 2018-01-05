'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const {PORT, CLIENT_ORIGIN, DATABASE_URL} = require('./config');
const {dbConnect} = require('./db-mongoose');
const { MemeModel } = require('./models');

const app = express();

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

const quotesArr = require('./quotes.json');

app.get('/quotes', (req,res)=>{
  let length=quotesArr.length-1;
  res.json(
    quotesArr[Math.floor(Math.random()*length)]
  );
});

app.post('/memes', jsonParser, (req, res) => {
  MemeModel
    .create({
      'photographerName': req.body.photographerName,
      'photographerURL': req.body.photographerURL,
      'imageUrl': req.body.imageUrl,
      'quote': req.body.quote,
      'author': req.body.author,
      'rating': req.body.rating
    })
    .then(created => {
      res.status(201).json(created);
    });
});

app.get('/memes', (req, res) => {
  MemeModel
    .find()
    .then(memes => {
      res.status(200).json(memes);
    });
});

app.use('*', function (req, res) {
  res.status(404).json({
    message: 'Endpoint Not Found' 
  }); 
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}



module.exports = {app};
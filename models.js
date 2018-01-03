'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const MemeSchema = new mongoose.Schema({
  imageUrl: {type: String, required: true},
  photographer: {type: String, required: true},
  quote: {type: String, required: true},
  author: {type: String, required: true},
  rating: {type: Number}
});

const MemeModel = mongoose.model('Meme', MemeSchema);

module.exports = {MemeModel};
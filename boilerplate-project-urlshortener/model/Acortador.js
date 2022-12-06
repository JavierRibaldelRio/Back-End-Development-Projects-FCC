require('dotenv').config();

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);

var acortadorEsquema = new mongoose.Schema({

    original_url: String,
    short_url: String

});

mongoose.connect(process.env.URI);

module.exports = mongoose.model('Acortador', acortadorEsquema);
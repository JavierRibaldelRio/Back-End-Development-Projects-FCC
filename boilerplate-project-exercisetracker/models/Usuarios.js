require('dotenv').config();

const mongoose = require('mongoose');

mongoose.set('strictQuery', true);


var usuario = new mongoose.Schema({

    username: String,
    count: { type: Number, default: 0 },
    log: [{
        description: String,
        duration: Number,
        date: String
    }]
});

mongoose.connect(process.env.URI);

module.exports = mongoose.model('Usuario', usuario);
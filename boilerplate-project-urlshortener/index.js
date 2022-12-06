require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const app = express();

const esURLCorrecta = require('./ComprobadorURL');

const Acortador = require('./model/Acortador');

//Coge el shortid

const shortid = require('shortid');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {


  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {

  //Coge la url
  const url = req.body.url;


  if (!url.includes('https://') && !url.includes('http://')) {
    res.json({ "error": "invalid URL" });

  } else {

    dns.lookup(url, (err) => {

      const respuesta = { original_url: url, short_url: shortid.generate() };

      //Genera el nuevo acortador
      var nuevoAcortador = new Acortador(respuesta);

      //Lo guarda en la web
      nuevoAcortador.save((err, info) => {

        if (err) {
          console.log('err:>> ', err);
        }

      });

      res.json(respuesta);

    })
  }




});



app.get('/api/shorturl/:code', (req, res) => {

  //Coge el código de la url
  const code = req.params.code;

  //Busca a el que corresponde
  Acortador.findOne({ short_url: code }, (err, data) => {

    if (err) {

      console.log('err :>> ', err);
    } else {

      if (data) {
        res.redirect(data.original_url);
      }
    }
  });
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

// index.js
// where your node app starts

// init project

var PORT = process.env.PORT | 5000;

var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({ optionsSuccessStatus: 200 }));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

//Creación de la nueva ruta
app.get("/api/:date?", (req, res) => {

  //Coge la fecha
  var date = req.params.date;

  //Crea  una nueva fecha con valores del momento de crearla
  let fecha = new Date();

  //Almacena la respuesta
  var respuesta = {};


  //Mira si es undefined la fecha
  if (date !== undefined) {

    //Si la fecha es un número la transforma a número
    if (!isNaN(Number(date))) {

      date = Number(date);
    }

    //Crea la nueva fecha
    fecha = new Date(date);
  }

  // Si la fecha está mal transmite error
  if (isNaN(fecha)) {
    respuesta.error = "Invalid Date";
  }

  //Sino transmite que está bien
  else {
    respuesta.utc = fecha.toUTCString();
    respuesta.unix = fecha.getTime();
  }

  //Devuelve la respuesta
  res.json(respuesta)
})



// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

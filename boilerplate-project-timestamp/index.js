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
app.get("/api/:date", (req, res) => {


  if (req.params.date !== undefined) {
    const fecha = new Date(req.params.date);
  }
  else {

    fecha = new Date()
  }

  var respuesta = {};


  respuesta.utc = fecha.toUTCString();
  respuesta.unix = fecha.getTime();
  console.log('fecha :>> ', fecha);



  res.json(respuesta)
})



// listen for requests :)
var listener = app.listen(PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

var express = require('express');
var cors = require('cors');

var multer = require('multer')  //Instala multer


//Define el amalcenamiento de multer


require('dotenv').config()

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

//MIDEL WARE FUNCION que sube el archivo
app.post('/api/fileanalyse', multer().single('upfile'), (req, res, next) => {

  const file = req.file;

  const { originalname, mimetype, size } = file;

  if (!file) {

    console.log('ERR :>> ', 'No se ha surbido ningún archivo');

    res.send('No se ha introducido el archivo');
  }
  res.json({ name: originalname, type: mimetype, size });
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// Importa el usuario
const Usuario = require('./models/Usuarios');


app.use(express.urlencoded({ extended: true }));


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.post('/api/users', (req, res) => {

  //Coge el nombre del usuario
  const username = req.body.username;

  //Crea el nuevo usuario con solo con el nombre
  var nuevoUsuario = new Usuario({ username: username, count: 0 });

  //Guarda el usuario
  nuevoUsuario.save();

  //Devuelve el id y el nombre de usuario y pone el contador a cerop
  res.json({ username: nuevoUsuario.username, _id: nuevoUsuario._id });
});

//Muestra todos los usuarios
app.get('/api/users', (req, res) => {

  //Coge todos los usuarios
  Usuario.find({})
    .sort({ username: 1 })    //Los ordena
    .exec((err, data) => {

      //Si hay un error lo muesta
      if (err) {
        console.log('err :>> ', err);
        res.send(err)
      }

      //Almacena la respuesta
      var respuesta = []

      //Formatea la respuesta correctamente
      respuesta = data.map((x) => { return { username: x.username, _id: x._id } })

      res.json(respuesta);
    });

});

//Añade un ejercicio a un usuario
app.post('/api/users/:_id/exercises', (req, res) => {

  //Obtine id de URL
  const id = req.params._id;

  //Extrae formulario descripcion duracion fecha
  var { description, duration, date } = req.body;

  //Transforma la duration de String a Number

  duration = Number(duration);

  //Pasa el string a fecha
  if (date === '' || date === undefined) {

    date = new Date();

  }
  else {
    date = new Date(date);
  }

  //Convierte la fecha en el string de forma deseade
  date = date.toDateString();

  //Busca el usuario
  Usuario.findById(id, (err, data) => {

    //Si hay un error lo muestra
    if (err) {
      console.log('err :>> ', err);
      res.send(err);
    }

    else {

      //Añade al array el nuevog log
      data.log.push({ description: description, duration: duration, date: date });

      //Aumenta en uno el contador de ejercicios
      data.count++;

      //guarda los cambios
      data.save();

      //Define la respuesta
      const respuesta = { username: data.username, description: description, duration: duration, date: date, _id: data._id };

      //Envia la respuesta
      res.json(respuesta);
    }
  });
});

app.get('/api/users/:_id/logs', (req, res) => {
  // Obtiene la id
  const id = req.params._id;

  //Comprueba si hay query
  if (Object.keys(req.query).length === 0) {

    //Busca el usuario
    Usuario.findById(id, (err, data) => {

      //Si hay un error lo muestra
      if (err) {
        console.log('err :>> ', err);
        res.send(err);
      }

      //Sino manda los datos de respuesta
      else {
        res.send(data);
      }
    });
  }

  //Si hay query
  else {


    //Extrae los datos dela query
    var { from, to, limit } = req.query;

    //Busca usuarios por la id
    Usuario.findById(id, (err, data) => {

      //Crea una copia del log
      var log = [...data.log]

      //Si tiene inicio y final
      if (from != undefined && to != undefined) {

        //Transforma los strings en data
        from = new Date(from);
        to = new Date(to);

        //Elimina los que no estan en la franja de tiempo
        log = log.filter((x) => from <= new Date(x.date) && to >= new Date(x.date)
        );
      }

      //Comprueba si hay limite
      if (limit !== undefined) {
        log = [...log].slice(0, Number(limit));
      }

      // Inserta en data el nuevo log
      data.log = log;

      res.json(data);

    });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

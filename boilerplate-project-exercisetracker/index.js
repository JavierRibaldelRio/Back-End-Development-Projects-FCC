const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// Importa el usuario
const Usuario = require('./models/Usuarios');

//Importa el objeto LOG

var Log = require('./Log');

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

  //Pasa el string a fecha
  date = new Date(date);

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

      //Crea un nuevo log
      var logNuevo = new Log(description, duration, date);

      //Añade al array el nuevo log
      data.log.push(logNuevo);

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

  const id = req.params._id;

  Usuario.findById(id, (err, data) => {

    if (err) {
      console.log('err :>> ', err);
      res.send(err);
    }

    else {
      res.send(data);
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

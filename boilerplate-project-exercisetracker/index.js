const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

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

app.get('/api/users', (req, res) => {

  Usuario.find({})
    .sort({ username: 1 })
    .exec((err, data) => {

      if (err) {

        console.log('err :>> ', err);
      }

      var respuesta = []

      respuesta = data.map((x) => { return { username: x.username, _id: x._id } })

      res.json(respuesta);
    });

});


app.post('/api/users/:_id/exercises', (req, res) => {

  const id = req.params._id;

  console.log('bosy :>> ', req.body);

  var { description, duration, date } = req.body;

  console.log('description :>> ', description);
  console.log('duration :>> ', duration);
  console.log('data :>> ', date);

  Usuario.findById(id, (err, data) => {

    if (err) {
      console.log('err :>> ', err);
    }

    data.logs.push()


  })


});



const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

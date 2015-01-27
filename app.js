var Hapi = require('hapi');
var Store = require("jfs");
var db = new Store("data", {pretty:true});

var server = new Hapi.Server();

server.connection({
  host: '0.0.0.0',
  port: 8000
});


server.route({
  method: 'GET',
  path:'/',

  handler: function (request, reply) {
    var host = "http://" + request.headers.host;

    reply({
      mensaje: "Hola, bienvenido a la api de prueba...",
      alumnos_url: host + '/alumnos/',
    });
  }
});


server.route({
  method: 'GET',
  path: '/alumnos/',
  handler: function(req, reply) {

    db.all(function(err, objs){

      if (err) {
        reply({error: err});
        console.error(err);
        return;
      }

      cantidad = Object.keys(objs).length;

      reply({
        cantidad_total: cantidad,
        alumnos: objs,
      });

    });
  }
});


server.route({
  method: 'GET',
  path: '/alumnos/crear/',
  handler: function(req, reply) {
    var host = "http://" + req.headers.host;

    var data_alumno = {nombre: req.query.nombre,
                       apellido: req.query.apellido};

    console.log(req.query);

    /* Emite un error si el nombre o el apellido no están
       especificados...

       Una llamada correcta sería algo así:


       http://127.0.0.1:8000/alumnos/crear/?nombre="juan"&apellido="zapata"

    */
    if (!data_alumno.nombre || !data_alumno.apellido) {
      reply({error: "Falta especificar el nombre o apellido del alumno"});
      return;
    }

    db.save(data_alumno, function(err, id){

      if (err) {
        console.error(err);

        reply({error: err});
        return;
      }

      var mensaje = "Creado el alumno con id:" + id;
      console.log(mensaje);
      reply({mensaje: mensaje});

    });
  }
});

console.log("Running on http://0.0.0.0:8000"); // TODO: el puerto estaría bueno obtenerlo del objeto server...
server.start();

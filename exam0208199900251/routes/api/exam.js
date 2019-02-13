var uuidv4 = require('uuid/v4');
var express = require('express');
var router = express.Router();


var fileModel = require('./jsonmodel');
var data = null; 

var empresa = {
  '_id':'',
  'RTN':'',
  'empresa':'',
  'correo':'',
  'rubro':'',
  'dirección':'',
  'teléfono': '' 
};

router.get('/', function( req, res, next) {
  if(!data){
    fileModel.read(function(err, filedata){
      if(err){
        console.log(err);
        data = [];
        return res.status(500).json({'error':'Error al Obtener Data'});
      }
      data = JSON.parse(filedata);
      return res.status(200).json(data);
    });
  } else {
    return res.status(200).json(data);
  }
});

router.post('/new', function(req, res, next){
  var _empresaData = Object.assign({} , empresa, req.body);
  _empresaData._id = uuidv4();
  if(!data){
    data = [];
  }
  data.push(_empresaData);
  fileModel.write(data, function(err){
    if(err){
      console.log(err);
      return res.status(500).json({ 'error': 'Error al Obtener Data' });
    }
    return res.status(200).json(_empresaData);
  });
});

router.put('/done/:empresaId', function(req, res, next){
    var _empresaId= req.params.empresaId;
    var _empresaUpds = req.body;
    var _empresaUpdated = null;
    var newData = data.map(
      function(doc, i){
        if (doc._id == _empresaId){
          _empresaUpdated = Object.assign(
            {},
            doc,
            {"done":true},
            _empresaUpds
            );
          return _empresaUpdated;
        }
        return doc;
      }
    );// end map
    data = newData;
    fileModel.write(data, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ 'error': 'Error al Guardar Data' });
      }
      return res.status(200).json(_empresaUpdated);
    });
  });

router.delete('/delete/:empresaId', function(req, res, next){
    var _empresaId = req.params.empresaId;
    var newData = data.filter(
      function (doc, i) {
        if (doc._id == _empresaId) {
          return false;
        }
        return true;
      }
    );
    data = newData;
    fileModel.write(data, function (err) {
      if (err) {
        console.log(err);
        return res.status(500).json({ 'error': 'Error al Guardar Data' });
      }
      return res.status(200).json({"delete": _empresaId});
    });
  }); 


fileModel.read(function(err , filedata){
  if(err){
    console.log(err);
  } else{
    data = JSON.parse(filedata);
  }
});

module.exports = router;




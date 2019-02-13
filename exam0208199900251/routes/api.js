var express = require('express');
var router = express.Router();

var examapi = require('./api/exam');


router.use('/exam', examapi);

module.exports = router;
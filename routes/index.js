var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/graphql', function(req, res, next) {
  console.log('inside graphql', req.body);
  res.send(req.body);
});

module.exports = router;

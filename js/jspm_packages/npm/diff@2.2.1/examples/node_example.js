/* */ 
(function(process) {
  require('colors');
  var jsdiff = require('../lib/index');
  var one = 'beep boop';
  var other = 'beep boob blah';
  var diff = jsdiff.diffChars(one, other);
  diff.forEach(function(part) {
    var color = part.added ? 'green' : part.removed ? 'red' : 'grey';
    process.stderr.write(part.value[color]);
  });
  console.log();
})(require('process'));

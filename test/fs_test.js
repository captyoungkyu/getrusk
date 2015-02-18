var fs = require('fs');

fs.readFile('./test', function (err, data) {
  fs.writeFile('./results.txt', data, function(err) {
    if(err) throw err;
    fs.readFile('./results.txt','utf8',function(err,data){
      console.log(data);
    });
  });
});
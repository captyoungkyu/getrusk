var redis = require('redis');
var redis_client = redis.createClient();

redis_client.on('connect',function(err){
  if(err) console.log("error occured.");
  console.log("connected");
});

// aa = {}

// aa.a = 1;
// aa.b = 2;

// redis_client.rpush(['frameworks', JSON.stringify(aa)], function(err, reply) {
//     if(err) console.log("error occured.");
//     console.log(reply); //prints 2
// });

// redis_client.lrange('frameworks', 0, -1, function(err, reply) {
//     if(err) console.log("error occured.");
//     console.log(reply); // ['angularjs', 'backbone']
// });

// redis_client.lrem('frameworks',0,'',function(err,reply){

// });]

redis_client.hmset('bbb',{
  "b-b-b-b.12213|안녕하세여.png":"aaaaa",
  "bb.sdd122221|111.JPG":"vvvvv"  
}, function(err, reply){
  console.log(reply);
});


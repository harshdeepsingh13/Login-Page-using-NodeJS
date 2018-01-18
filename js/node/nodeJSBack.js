var http = require('http');
var mongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');
var url = require('url');
var fileServer = require('fs');

http.createServer(function(req,res){
    // var reqUrl = url.parse(req.url,true);
    var mongoUrl = 'mongodb://localhost:27017/';
        if(req.url=='/checkLogin'){
            var form = new formidable.IncomingForm();
            form.parse(req,function(err,fields,files){
               var username = fields.username;
               var password = fields.password;

               mongoClient.connect(mongoUrl,function(err,db){
                   if(err) throw err;
                   var dbo = db.db('clients');
                   var obj={username:username, password:password};
                   dbo.collection('myUsers').find(obj).toArray(function(mongoErr,result){
                       if(mongoErr)
                       {
                           throw mongoErr;
                       }
                       res.redirect(200,'/about');
                       db.close();
                   });
               });
            });
        }
        if(req.url == '/checkSignUp'){
            var form = new formidable.IncomingForm();
            form.parse(req,function(err,fields,files){
                var username = fields.username;

                mongoClient.connect(mongoUrl,function(err,db){
                    if(err) throw err;
                    var dbo = db.db('clients');
                    dbo.collection('myUsers').find({username:username}).toArray(function (mongoError, objects) {
                        if(mongoError) throw mongoError;
                        if(objects.length==0)
                        {
                            var name = fields.name;
                            var password=fields.password;
                            dbo.collection('myUsers').insertOne({name:name,username:username,password:password},function (err,objects) {
                                res.writeHead(200,{'Content-Type':'text/html'});
                                res.write('you can now log in!');
                                res.redirect(200,'login.html');
                                res.end();
                            })
                        }
                        else
                        {
                            db.close();
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.write('username already used. Retry');
                            fileServer.readFile('signUp.html',function(err,data){
                                res.write(data);
                                res.end();
                            });

                        }
                    })
                });
            })
        }
});
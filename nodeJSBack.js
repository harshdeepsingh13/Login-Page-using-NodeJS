var http = require('http');
var mongoClient = require('mongodb').MongoClient;
var formidable = require('formidable');
var url = require('url');
var fileServer = require('fs');
var util = require('util');
var obj;

http.createServer(function(req,res){
    // var reqUrl = url.parse(req.url,true);
    var mongoUrl = 'mongodb://localhost:27017/';
    var q = url.parse(req.url,true);
    // console.log(q);
    // console.log("pathname: " + q.pathname);
        if(q.pathname=='/checkLogin'){
            console.log('checkLogin');
            var form = new formidable.IncomingForm();
            form.parse(req,function(err,fields,files){
               var username = fields.username;
               var password = fields.password;

               mongoClient.connect(mongoUrl,function(err,db){
                   if(err) throw err;
                   var dbo = db.db('clients');
                   obj={username:username, password:password};
                   dbo.collection('myUsers').find(obj).toArray(function(mongoErr,result){
                       if(mongoErr)
                       {
                           throw mongoErr;
                       }
                       res.writeHead(301,{Location:'/about'});
                       res.end();
                       db.close();
                   });
               });
            });
        }
        else if(q.pathname == '/checkSignUp'){
            console.log('checkSignUp');
            var form = new formidable.IncomingForm();
            form.parse(req,function(err,fields,files){
                util.inspect({fields:fields, files:files});
                var username = fields.username;

                mongoClient.connect(mongoUrl,function(err,db){
                    if(err) throw err;
                    var dbo = db.db('clients');
                    dbo.collection('myUsers').find({username:username}).toArray(function (mongoError, objects) {

                        if(mongoError) throw mongoError;
                        console.log("username: " + username);
                        if(objects.length==0)
                        {
                            var name = fields.name;
                            var password=fields.password;
                            console.log("name: " + name + "username:" + username + "password: " + password);
                            dbo.collection('myUsers').insertOne({name:name,username:username,password:password},function (err,objects) {

                                /*res.writeHead(301,{Location:'login.html'});
                                res.end();*/
                                res.writeHead(200,{'Content-Type':'text/html'});
                                fileServer.readFile('login.html',function (err,data) {
                                    if(err) throw err;
                                    res.write(data);
                                    res.end();
                                })
                                db.close();
                            })
                        }
                        else
                        {
                            console.log('else');
                            db.close();
                            res.writeHead(200,{'Content-Type':'text/html'});
                            res.write("<script>if(confirm('hey')){document.location = 'http://localhost:8080/errorSignUp'}</script>");
                            res.end();


                            /*fileServer.readFile('signUp.html',function(err,data){
                                res.write(data);
                                res.end();
                            });*/

                        }
                    })
                });
            })
        }
        else if(q.pathname == '/about'){
            console.log('about');
            mongoClient.connect(mongoUrl,function (err,db) {
                if(err) throw err;
                var dbo = db.db('clients');
                dbo.collection('myUsers').find(obj).toArray(function (mongoError, objects) {
                    if(mongoError) throw mongoError;
                    util.inspect({objects:objects});
                    res.writeHead(200,{'Content-Type':'text/html'});
                    // objects.forEach(function (value) { console.log(value.valueOf()) });
                    var name = objects[0].name;

                    res.write('Hey, ' + name + '<br> How are you?');
                    res.end();
                });
            });
        }
        else if(q.pathname == '/errorSignUp'){
            console.log('errorSignUp');
            // res.writeHead(301,{Location:'signUp.html'});
            // res.end();
            res.writeHead(200,{'Content-Type':'text/html'});
            fileServer.readFile('signUp.html',function (err,data) {
                if(err) throw err;
                res.write(data);
                res.end();

            })
        }
        else {
            res.writeHead(404,{'Content-Type':'text/html'});
            res.end('page not found its me');
        }
}).listen(8080);
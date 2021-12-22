'use strict';

var path = require('path');
var http = require('http');
var fs = require("fs");
var passport = require('passport');
var { Validator, ValidationError } = require('express-json-validator-middleware');

var oas3Tools = require('oas3-tools');
var serverPort = 3001;

var taskController = require(path.join(__dirname, "controllers/Tasks"));
var userController = require(path.join(__dirname, "controllers/Users"));
var assignmentController = require(path.join(__dirname, "controllers/Assignments"));
var imageController = require(path.join(__dirname, "controllers/Images"));

var storage = require(path.join(__dirname, './components/storage'));

// swaggerRouter configuration
var options = {
    routing: {
        controllers: path.join(__dirname, './controllers')
    },
};

var expressAppConfig = oas3Tools.expressAppConfig(path.join(__dirname, 'api/openapi.yaml'), options);
expressAppConfig.addValidator();
var app = expressAppConfig.getApp();

// Set validator middleware
var taskSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas', 'taskSchema.json')).toString());
var userSchema = JSON.parse(fs.readFileSync(path.join('.', 'json_schemas', 'userSchema.json')).toString());
var validator = new Validator({ allErrors: true });
validator.ajv.addSchema([userSchema, taskSchema]);
var validate = validator.validate;

//Set authentication middleware
/**when a user requests an operation that requires authentication, an authentication middleware should check the JWT in the cookies of the request. 
 * To do so, first you should define a JwtStrategy (see below the corresponding piece of code). 
 * Second, you must use the authentication middle in the route methods that require it. 
 * The middleware is specified as: passport.authenticate('jwt', { session: false }). 
 * If you have used the pieces of code shown here, and if the verification is successful, then the field req.user of the request will contain the id of the user taken from the JWT. 
 * You can use this information for internal operations (e.g., if the user is trying to update a task, you check if she is the real owner). */
app.use(passport.initialize());

var cookieExtractor = function(req) {
    var token = null;
    if (req && req.cookies)
    {
        token = req.cookies['jwt'];
    }
    return token;
  };
  
var JwtStrategy = require('passport-jwt').Strategy;
var opts = {}
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = "6xvL4xkAAbG49hcXf5GIYSvkDICiUAR6EdR5dLdwW7hMzUjjMUe9t6M5kSAYxsvX"
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    //here viene settata la req.user
    return done(null, jwt_payload.user);
   })
);

//Route methods
app.post('/api/users/authenticator/:type', userController.authenticateUser);
app.get('/api/users', userController.getUsers);
app.get('/api/users/:userId', userController.getSingleUser);

app.get('/api/tasks/public', taskController.getPublicTasks);
app.post('/api/tasks', passport.authenticate('jwt', { session: false }), validate({ body: taskSchema }), taskController.addTask);
app.delete('/api/tasks/:taskId', passport.authenticate('jwt', { session: false }),taskController.deleteTask);
app.get('/api/tasks/:taskId', passport.authenticate('jwt', { session: false }), taskController.getTask);
app.put('/api/tasks/:taskId', passport.authenticate('jwt', { session: false }), validate({ body: taskSchema }), taskController.updateTask);
app.put('/api/tasks/:taskId/completion', passport.authenticate('jwt', { session: false }), taskController.completeTask)
app.get('/api/users/:userId/tasks/created', passport.authenticate('jwt', { session: false }), taskController.getUserTasks);
app.get('/api/users/:userId/tasks/assigned', taskController.getAssignedTasks);

app.get('/api/tasks/:taskId/assignees', assignmentController.getUsersAssigned)
app.post('/api/tasks/:taskId/assignees', assignmentController.assignTaskToUser)
app.delete('/api/tasks/:taskId/assignees/:userId', assignmentController.removeUser)

//lab2 -- rest Api image
app.post('/api/tasks/:taskId/images', passport.authenticate('jwt', { session: false }), storage.uploadImg, imageController.addImage);
//app.delete('/api/tasks/:taskId/images/:imageId', passport.authenticate('jwt', { session: false }), imageController.deleteImg);
app.get('/api/tasks/:taskId/images/:imageId', passport.authenticate('jwt', { session: false }), imageController.getImage);
app.get('/api/tasks/:taskId/images/:imageId/imageFile', passport.authenticate('jwt', { session: false }), imageController.getFileImage);


// Error handlers for validation and authentication errors
app.use(function(err, req, res, next) {
    if (err instanceof ValidationError) {
        res.status(400).send(err);
    } else next(err);
});

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        var authErrorObj = { errors: [{ 'param': 'Server', 'msg': 'Authorization error' }] };
        res.status(401).json(authErrorObj);
    } else next(err);
});

// Initialize the Swagger middleware
http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});


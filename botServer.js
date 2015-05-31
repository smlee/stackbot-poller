/**
 * Created by sangmin on 4/28/15.
 */
var express = require('express');
var path = require('path');
var logger = require('morgan');
var session = require('express-session');
var flash = require('connect-flash');
var swig = require('swig');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var sass = require('node-sass-middleware');
//var ejs = require('ejs');

var passport = require('passport');
var slackStrategy = require('passport-slack').Strategy;
var User = require('./models/').User;
var routes = require('./routes/');
var prepSlackUsers = require('./controllers/userListPrep');
/*
 * Need to refactor ASAP!
 */
var slack = require('./simple_reverse.js');

// Middleware
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/view');


var server = app.listen(3003);
console.log('Server listening on port 3003');
var io = require('socket.io').listen(server);

io.on('connection', function(socket) {
    console.log('Hello, socket connected');
});

//Always put session after STATIC!!! can cause client browser to request sessions before cookies are created!!!
app.use(session({secret: '2C44774A-D649-4D44-9535-46E296EF394F', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(methodOverride());
app.use(
    sass({
        src: path.join(__dirname, 'assets'),
        dest: path.join(__dirname, 'public'),
        debug: true
    })
);

console.log(__dirname)

app.use(express.static(path.join(__dirname, 'public')));
app.use('/vendors', express.static(path.join(__dirname, 'bower_components')));

app.use('/', routes(io, passport));
prepSlackUsers(User);

passport.serializeUser(function(user, done) {
    //console.log('sdsadlfkjas;dfkjs;dlkfj;sldkfladfkj;sajfasdfasdf', user);
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    //console.log('deserializing', id);
    User.findById(id, function(err, user) {
        //console.log(user);
        done(err, user);
    });
});

passport.use(new slackStrategy({
    clientID: '2151814398.4931391427',
    clientSecret: 'bd8ffb52ae024a6ad0c8194fa1d57207'
    },
    function(accessToken, refreshToken, profile, done) {
        console.log(profile._json.team);
        if (profile._json.team !== 'Fullstack Academy'){
            console.log(done, accessToken, profile._json.team);
            return done();
        }

        //console.log(profile);

        User.findOne({slack_id: profile.id}, function (err, user) {
            if (err) {
                return done(err);
            }

            if (!user){
                user = new User({slack_id: profile.id, slack_displayName: profile.displayName, slack_user: profile._json.user});
                user.save(function(err){
                    if (err) console.log(err);
                    return done(err, user);
                });
                console.log(profile);
            }else{
                console.log(done, accessToken, profile._json.team, user);
                return done(err, user);
            }
        })
    }
));
/*
 { provider: 'Slack',
 id: 'U04F6T232',
 displayName: 'sang',
 _raw: '{   "ok":true,"url":"https:\\/\\/fullstackacademy.slack.com\\/","team":"Fullstack Academy","user":"sang","team_id":"T024FPYBQ","user_id":"U04F6T232"}',
 _json:
 { ok: true,
 url: 'https://fullstackacademy.slack.com/',
 team: 'Fullstack Academy',
 user: 'sang',
 team_id: 'T024FPYBQ',
 user_id: 'U04F6T232' } }
 slack_id: String,
 slack_displayName: String,
 slack_user: String,
 */

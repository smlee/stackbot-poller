/**
 * Created by sangmin on 5/2/15.
 */
var express = require('express');
var router = express.Router();
var slack = require('../simple_reverse.js');
var User = require('../models').User;

module.exports = function (io, passport) {

    router.use(function(req, res, next){
        console.log('always checking session', req.session);
        next();
    })

    router.get("/", checkAuthenticated, function(request, response) {
//        var slackData = slack.sData;
//        //var img = slackData.getUserByName('sang').profile.image_24;
//        if (slackData.getUserByID('U042XMQM4') === undefined) {
//            request.logout();
//        }

        response.render('mainPage', {messages: req.flash('login'), auth: req.session.passport})//, {data: slackData.getUserByName('sang').profile});

        //console.log(slackData.users);
        io.sockets.emit('slack_data')//, { data: slackData.getUserByName('sang').profile});
    });

    //authentication
    router.get('/auth/slack', passport.authenticate('slack'));
    router.get('/auth/slack/cb', passport.authenticate('slack', {successRedirect: '/', failureRedirect: '/'}));
    router.get('/app', checkAuthenticated, function(req, res){

        res.render('mainPage');
    });
    router.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

    router.get('/updateSlack', function(req, res, next){
        var slackUsers = Object.getOwnPropertyNames(slack.sData.users);
        console.log(slackUsers);
        var done = 0;
        slackUsers.forEach(function(userId){

            var sUserInfo = slack.sData.getUserByID(userId);

            User.findOne({slack_id: userId}, function (err, user) {
                if (err) {
                    return next(err);
                }

                if (!user) {
                    user = new User({
                        first_name: sUserInfo.profile.first_name,
                        last_name: sUserInfo.profile.last_name,
                        email: sUserInfo.profile.email,
                        slack_id: sUserInfo.id,
                        slack_displayName: sUserInfo.name,
                        slack_user: sUserInfo.name,
                        slack_profile_pic: sUserInfo.profile.image_original
                    });
                    user.save(function (err) {
                        if (err) console.log(err);
                        done++;
                    });
                } else {
                    done++;
                    console.log(sUserInfo.name + " exists. Current on number: ", done);
                }

            });

        });
        console.log(done, slackUsers.length);
        res.render('mainPage')
    });

    return router;
};

function checkAuthenticated(req, res, next) {
    console.log(req.session);
    if (req.isAuthenticated()) return next();
    req.flash('login', 'Please log in again');
    console.log('flash', req.flash('login'));
    res.json({messages: req.flash('login'), auth: req.session.passport})
};
/**
 * Created by sangmin on 5/6/15.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/slackbottest');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'mongodb connection error:'));

/*
 * slack user object
 * .id
 * .name <= username
 * .profile.first_name
 * .profile.last_name
 * .profile.email
 * .image_original
 */

var UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    slack_id: String,
    slack_displayName: String,
    slack_user: String,
    slack_profile_pic: String,
    codewars_id: String,
    created: Date
});

UserSchema.virtual('name').get(function(){
    return this.first_name + " " + this.last_name
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User: User
};

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const User = new Schema(
    {
        admin: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

// this automatically store user and password. using hashing and salt methods. 
// and provide additional methods to user schema
User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
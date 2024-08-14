const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/paytm");


const userSchema = mongoose.Schema({
    username: {
        type: string,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLenght: 30
    },
    password: {
        type: string,
        required: true,
        minLength: 6
    },
    firstName: {
        type: string,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: string,
        required: true,
        trim: true,
        maxLength: 50
    }

});

const User = mongoose.model("User", userSchema);

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }


})

const Account = mongoose.model('Account', accountSchema);

module.export = {
    Account,
    User
}
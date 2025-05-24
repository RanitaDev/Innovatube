const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    favs: {
        type: [String],
        default: [],
    }
});

userSchema.pre('save', async function (next){
    if(!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

export default mongoose.model('User', userSchema);
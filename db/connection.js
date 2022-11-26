var mongoose = require('mongoose')
const connectDB = () => {

    mongoose.connect("mongodb+srv://ysp23232:ysp9879@senecaweb.5bcsffy.mongodb.net/?retryWrites=true&w=majority",
        { useNewUrlParser: true, useUnifiedTopology: true }, err => {
            console.log('connected')
        });
}

module.exports = connectDB




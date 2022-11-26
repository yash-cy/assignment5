const mongoose = require("mongoose")
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: new Date().toLocaleString('default', { day: "numeric", month: "long", year: "numeric" })
    },
    img: {
        data: Buffer,
        contentType: String
    }
})


const Blog = new mongoose.model('Blog', blogSchema)
module.exports = Blog
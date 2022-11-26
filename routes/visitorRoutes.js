const express = require("express");
const router = express.Router();
const blogModel = require("../models/blogModel.js")


// getting Home Page with index layout 
router.get("/", (req, res) => {
    res.render('index', { layout: 'index' })
})

// getting All blog Post page for visitor with same layout
router.get("/view-all-post", async (req, res) => {
    const blogs = await blogModel.find({}).lean()

    blogs.forEach(item => {
        imgUrl = item.img.data.toString('base64')
        item.img.data = imgUrl

        date = item.date.toLocaleString('default', { day: "numeric", month: "long", year: "numeric" })
        item.date = date

        item.content = item.content.substring(1, 100)
    });

    res.render("viewAllPost", {
        layout: 'index',
        blogs: blogs
    })
})

// getting full blog view page for visitor with same layout
router.get("/view-all-post/:id", async (req, res) => {

    const id = req.params.id
    const blog = await blogModel.findById(id).lean()
    blog.date = blog.date.toLocaleString('default', {
        day: "numeric",
        month: "long",
        year: "numeric"
    })
    blog.img.data = blog.img.data.toString('base64')

    res.render("viewFullPost", {
        layout: 'index',
        blog: blog
    })
})



module.exports = router
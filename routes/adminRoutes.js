const express = require("express")
const router = express.Router();
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
var fs = require('fs');
const upload = require("../middleware/imageMiddleware.js")
var path = require('path');

// admin auth middleware -
const checkAdminAuth = require("../middleware/adminAuth.js")

// importing Models -
const blogModel = require("../models/blogModel.js")
const adminModel = require("../models/adminModel.js");

// logging in route for admin -- 
router.get("/login", (req, res) => {
    res.render("admin/login", {
        layout: 'admin'
    })
})


router.post("/login", async (req, res) => {
    const { username, password } = req.body
    await adminModel.findOne({ username: username })
        .then(user => {
            if (!user) {
                console.log("Admin Not found.");
            } else {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (err) {
                        console.log("err");
                    }
                    if (isMatch) {
                        const token = jwt.sign({ adminID: user._id }, "thisIsMyJWTSecretKey", {
                            expiresIn: '10d'
                        })
                        res.cookie("JWT", token, {
                            httpOnly: true
                        })
                        res.redirect("/admin/dashboard/view-all-post")
                    }
                })
            }
        })
})

// getting dashboard page
router.get("/dashboard/view-all-post", checkAdminAuth, async (req, res) => {
    // getting all blogs -- 
    const blogs = await blogModel.find({}).lean()

    blogs.forEach(item => {
        imgUrl = item.img.data.toString('base64')
        item.img.data = imgUrl

        date = item.date.toLocaleString('default', { day: "numeric", month: "long", year: "numeric" })
        item.date = date

        item.content = item.content.substring(1, 100)
    });


    res.render("admin/admin", {
        layout: 'admin',
        blogs: blogs
    })
})

// getting full blog page -- 
router.get("/dashboard/view-full-blog/:id", async (req, res) => {
    const id = req.params.id
    const blog = await blogModel.findById(id).lean()
    console.log(id);
    blog.date = blog.date.toLocaleString('default', {
        day: "numeric",
        month: "long",
        year: "numeric"
    })

    blog.img.data = blog.img.data.toString('base64')
    res.render("admin/fullBlog", {
        layout: 'admin',
        blog: blog
    })
})

router.get("/dashboard/edit-blog/:id", async (req, res) => {
    const id = req.params.id
    const blog = await blogModel.findById(id).lean()

    res.render("admin/editBlog", {
        layout: 'admin',
        blog: blog
    })
})


router.post("/dashboard/edit-blog/:id", async (req, res) => {
    const id = req.params.id
    blogModel.findByIdAndUpdate(id, { title: req.body.blogTitle, content: req.body.blogContent },
        function (err, docs) {
            if (err) {
                console.log(err)
            }
            else {
                console.log("Updated Blog");
                res.redirect(`/admin/dashboard/view-full-blog/${id}`)
            }
        });

})

router.post("/dashboard/delete-blog/:id", (req, res) => {
    const id = req.params.id
    blogModel.findByIdAndRemove(id, (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Success");
            res.redirect("/admin/dashboard/view-all-post")
        }
    })
})

// Create a new blog -- 
router.get("/dashboard/create-new-blog", checkAdminAuth, (req, res) => {

    res.render("admin/createBlog", {
        layout: 'admin'
    })
})

router.post("/dashboard/create-new-blog", upload.single('blogImage'), checkAdminAuth, (req, res) => {

    const blog = new blogModel({
        title: req.body.blogTitle,
        content: req.body.blogContent,
        img: {
            data: fs.readFileSync(path.join(__dirname, "..", '/uploads', req.file.filename)),
            contentType: 'image/png'
        }
    })
    blog
        .save()
        .then(blog => {
            res.redirect("/admin/dashboard/view-all-post")
        })
        .catch(err => console.log(err))


})



// // Logout api --
router.post("/logout", checkAdminAuth, (req, res) => {
    res.clearCookie("JWT")
    res.redirect("/")
})

module.exports = router







// // const admin = new adminModel({
// //     role: "Admin",
// //     password: "123456789"
// // })

// // bcrypt.genSalt(10, (err, salt) => {
// //     bcrypt.hash(admin.password, salt, (err, hash) => {
// //         if (err) throw err;
// //         admin.password = hash

// //         admin
// //             .save()
// //             .then(admin => {
// //                 console.log(admin);
// //             })
// //             .catch(err => console.log(err))
// //     })
// // })

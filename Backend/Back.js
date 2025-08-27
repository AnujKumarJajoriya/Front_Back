const express = require("express")
const app = express()
const usermodel = require("./models/user")
const postmodel = require("./models/post")
const path = require("path")
const cookieparser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")
const multer = require("multer")
const crypto = require("crypto")


app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/images/uploads")
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fn = bytes.toString("hex") + path.extname(file.originalname)
            cb(null, fn)
        })

    }
})

const upload = multer({ storage: storage })


function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ message: "No token provided" });
    const token = authHeader.split(" ")[1]; // extract real token

    jwt.verify(token, "secret123", (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.userId = decoded.id; // save user id
        next();
    })
}

app.post("/signup", async function (req, res) {
    let { username, email, password } = req.body

    let exsistinguser = await usermodel.findOne({ email })
    if (exsistinguser) return res.status(400).json({ message: "User Already Exists" })
    else {
        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async (err, hash) => {

                const user = await usermodel.create({
                    username,
                    email,
                    password: hash
                })

                let token = jwt.sign({ id: user._id }, "secret123")

                res.status(201).json({
                    message: "User created successfully",
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                })

            })
        })
    }

})


app.post("/login", async function (req, res) {


    let { email, password } = req.body

    let user = await usermodel.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid email or password" })
    else {
        bcrypt.compare(password, user.password, (err, result) => {
            if (result) {
                const token = jwt.sign({ id: user._id }, "secret123")
                res.json({
                    message: "Login successful",
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email
                    }
                })
            }
        })
    }


})

app.post("/posts", verifyToken, upload.single("image"), async (req, res) => {

    const { caption } = req.body

    const post = await postmodel.create({
        user: req.userId,
        imageurl: `/images/uploads/${req.file.filename}`,
        caption,
    })

    res.status(201).json({ message: "Post created", post });
})


app.get("/posts", verifyToken, async (req, res) => {


    const posts = await postmodel.find()
        .sort({ _id: -1 })
        .populate("user", "username email") // populate user
        .populate("comments.user", "username"); // populate comment users

    res.json(posts);


})


app.post("/posts/:id/like", verifyToken, async (req, res) => {
    const post = await postmodel.findById(req.params.id)
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userid = req.userId
    if (post.likes.includes(userid)) {
        post.likes.pull(userid)
        await post.save();
        return res.json({ message: "Post unliked", likes: post.likes.length });

    } else {
        post.likes.push(userid)
        await post.save();
        res.json({ message: "Post liked", likes: post.likes.length });

    }

})


app.post("/posts/:id/comment", verifyToken, async (req, res) => {

    const { text } = req.body
    if (!text) return res.status(400).json({ message: "Comment text is required" });
    const post = await postmodel.findById(req.params.id)
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: req.userId, text: text }
    post.comments.push(comment)
    await post.save();


    const updatedpost = await postmodel.findById(req.params.id)
        .populate("user", "username email") // populate user
        .populate("comments.user", "username email"); // populate comment users


    res.status(201).json({
        message: "Comment added",
        post: updatedpost,
    });


})



app.get("/myposts", verifyToken, async (req, res) => {


    const posts = await postmodel.find({ user: req.userId })
        .sort({ _id: -1 })
        .populate("user", "username email") // populate user
        .populate("comments.user", "username"); // populate comment users

    res.json(posts);


})


app.get("/allusers", verifyToken, async (req, res) => {


    const allusers = await usermodel.find({} , "username email")
    res.json(allusers);


})


app.listen(5000, () => {
    console.log("Server running on http://localhost:5000")
})
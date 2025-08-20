const express = require("express")
const app = express()
const usermodel = require("./models/user")
const path = require("path")
const cookieparser = require("cookie-parser")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cors = require("cors")

app.use(cors())
app.use(express.json())

app.post("/signup", async function (req, res) {
    let { username, email, password } = req.body

    let exsistinguser = await usermodel.findOne({ email })
    if (exsistinguser)  return res.status(400).json({ message: "User Already Exists" })
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



app.listen(5000, () => {
    console.log("Server running on http://localhost:5000")
})
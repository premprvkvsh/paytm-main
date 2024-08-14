const express = require("express");
const zod = require("zod");
const {
    JWT_SECRET
} = require("./config");
const {
    User
} = require("../db");
const jwt = require("jsonwebtoken");
const router = express.Router();


const signupSchema = zod.object({
    username: zod.string(),
    password: zod.string(),
    firstName: zod.string(),
    lastName: zod.string()
})

router.post("/Signup", async function (req, res) {
    const body = req.body;
    const {
        success
    } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: body.username
    })


    if (user._id) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body);

    const token = jwt.sign({
        userId: dbUser._id

    }, JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    })

})

router.post("/Signin", async function (req, res) {
    const body = req.body;
    const {
        success
    } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }

    const user = await User.findOne({
        username: body.username,
        password: body.password
    })


    if (user._id) {
        return res.json({
            message: "Email already taken / Incorrect inputs"
        })
    }

    const dbUser = await User.create(body);

    if (user) {
        const token = jwt.sign({
            userId: dbUser._id

        }, JWT_SECRET);

        res.json({

            token: token
        })
        return;

    }

    res.status(411).json({
        message: "Error while logging in"
    })
})



module.exports = router;
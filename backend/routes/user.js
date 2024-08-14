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
const {
    authMiddleware
} = require("../middleware");

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

// other auth routes
// User routes
const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional(),
})

router.put("/", authMiddleware, async (req, res) => {
    const {
        success
    } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({
        _id: req.userId
    }, req.body);

    res.json({
        message: "Updated successfully"
    })
})

//Route to get users from the backend, filterable via firstName/lastName
router.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

module.exports = router;
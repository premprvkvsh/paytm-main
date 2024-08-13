const express = require("express");


app.post("/signup", async function (req, res) {
    const createPayload = req.body;
    const parsePayload = createTodo.safeParse(createPayload);
    if (!parsePayload.success) {
        return res.status(400).json({
            errors: createPayload.error.errors
        });
    }

    const {
        firstName,
        lastName,
        email,
        password
    } = createPayload.data;
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
        return res.status(400).json({
            error: 'User already exists'
        });
    }

    await todo.create({
        signup: createPayload.signup,
    })

    res.json({
        msg: "SignUp Successful"
    })
})

app.post("/signin", async function (req, res) {
    const createPayload = req.body;
    const parsePayload = createTodo.safeParse(createPayload);
    if (!parsePayload.success) {
        return res.status(400).json({
            errors: createPayload.error.errors
        });
    }


    const {
        email,
        password
    } = createPayload.data;
    const user = users.find(user => user.email === email && user.password === password);

    if (!user) {
        return res.status(401).json({
            error: 'Invalid email or password'
        });
    }

    res.json({
        msg: "Signin Successful"
    })
})

app.post("/update", async function (req, res) {
    const createPayload = req.body;
    const parsePayload = createTodo.safeParse(createPayload);
    if (!parsePayload.success) {
        return res.status(400).json({
            errors: createPayload.error.errors
        });
    }


    const {
        email
    } = req.body;
    const user = users.find(user => user.email === email);

    if (!user) {
        return res.status(404).json({
            error: 'User not found'
        });
    }

    if (createPayload.data.firstName) user.firstName = createPayload.data.firstName;
    if (createPayload.data.lastName) user.lastName = createPayload.data.lastName;
    if (createPayload.data.password) user.password = createPayload.data.password;

    res.json({
        msg: "Update Successful"
    })

})

app.listen(3000);
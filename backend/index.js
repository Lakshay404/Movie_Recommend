const express = require("express")
//import express from "express"
const mongoose = require('mongoose')
//import mongoose from "mongoose"
const cors = require('cors')
//import cors from 'cors';
const User = require('./models/Employee')
//import EmployeeModel from "./models/Employee.js";
require("dotenv").config();

const app = express()
app.use(express.json())
app.use(cors())

const mongo_uri = process.env.MONGO_URI;
console.log(mongo_uri);
const connect = mongoose.connect(mongo_uri, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  connect.then(
    (db) => {
      console.log("Database Connected Successfully");
    },
    (err) => {
      console.log("Error occur while connecting ", err);
    }
  );



app.post('/login', (req, res) => {
    const { email, password } = req.body;
    User.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.json({ status: "Success", user: { name: user.name, email: user.email } });
                } else {
                    res.json({ status: "Fail", message: "Incorrect Password" });
                }
            } else {
                res.json({ status: "Fail", message: "User Not Found" });
            }
        })
        .catch(err => res.json({ status: "Error", message: err.message }));
});


app.post('/register', (req, res) => {
    User.create(req.body)
        .then(employees => res.json(employees))
        .catch(err => res.json(err))
})



app.listen(5500, () => {
    console.log("server is running")
})
//Create Server Using Nodejs(1 to line no-10)
/*const http = require('http');
const server = http.createServer((req, res) => {
    console.log("server created");
    res.end("hello world"); // "server created " response send korar por ensure kore server k j response send completed.
})

server.listen(5000, () => {
    console.log("server is running on 5000")
})*/

// Creating Server Using ExpressJs: 
import express from "express"; // es6 use korar jonno pack.json a "type":"module" lorte hoy.
import mongoose from "mongoose";
import { mongoUrl } from './keys.js'// db url
import cors from 'cors';
import user from "./models/model.js";
import router from "./routes/auth.js";
import path from "path"; // for hosting purpose

const __dirname = path.resolve();// for hosting purpose

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors());

app.use(express.json()); // frontend theke data asar por express er sahajye data k json format a parse korte hoy r routes a jawar aage 
app.use('/', router)// app.use(router); // app.use(akhane middleware use hoy)
mongoose.connect(mongoUrl);// url ta alada file a save kore korlam

mongoose.connection.on("connected", () => {  // db connect hoiche ki na seta dekhar jonno "connected" is important
    console.log("database successfully connected");
})
mongoose.connection.on("error", () => { // db te error thake ata "error" imp 
    console.log("error while connecting database");
})
// for hosting purpose 
// serving the frontend
app.use(express.static(path.join(__dirname, "./frontend/build")))
app.get("*", (_, res) => {
    res.sendFile(
        path.join(__dirname, "./frontend/build/index.html"),
        function (err) {
            res.status(500).send(err)
        }
    )
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
})


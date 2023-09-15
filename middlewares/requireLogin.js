import jwt from "jsonwebtoken";
import { jwt_secret } from "../keys.js";
import mongoose from "mongoose";  // mongodb er id tao lagbe tai mongoose lagbe akhane
import USER from "../models/model.js";

export const requireLogin = (req, res, next) => {    // middleware er por porer callback function run korar jonno next
    // console.log("hello i am a middleware");
    // next();  // trpr next call korte hbe

    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ error: "You must have logged in first 1!" })
    }
    const token = authorization.replace("Bearer ",
        "")
    jwt.verify(token, jwt_secret, (err, payload) => { // token ta secrete key er stahe verify hbe 
        if (err) {
            return res.status(401).json({ error: "You must have logged in first 2!" })
        }
        const { _id } = payload;
        USER.findById(_id).then(userData => {
            // console.log(userData)
            req.user = userData;
            next();
        })
    })

}
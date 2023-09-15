// import express from 'express';
// import mongoose from 'mongoose';
// import USER from "../models/model.js"
// import POST from "../models/post.js";

// const router = express.Router();

// // router.get("/user/:id", (req, res) => {
// //     USER.findOne({ _id: req.params.id })
// //         .then(user => {
// //             res.json(user);
// //         })
// // })

// router.get('/user/:id', async (req, res) => {
//     const userId = req.params.id;

//     try {
//         const user = await USER.findById(userId);

//         if (!user) {
//             res.status(404).json({ message: 'User not found' });
//         } else {
//             res.json(user);
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// export default router;
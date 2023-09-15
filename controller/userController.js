
import USER from "../models/model.js"// model take USER name a anlam
import bcrypt from 'bcrypt'; // password k hash korar jonno jate db te amra password na dekhte pari.
import jwt from 'jsonwebtoken';
import { jwt_secret } from '../keys.js';
import POST from "../models/post.js";
export const saveSentDetails = async (req, res) => {
    try {
        const { name, userName, email, password } = req.body;

        if (!name || !userName || !email || !password) {
            return res.status(422).json({ error: "Please add all the feilds" });
        }
        const userExist = await USER.findOne({ $or: [{ email: email }, { userName: userName }] });// {$or:[{....}{...}]} kon kon condition er base a check korbo
        if (userExist) {
            console.log({ "existing user data": userExist })
            return res.status(422).json({ error: "user already exist with that email or username" });

        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 12); // (kon field ta change korbo,joto boro salt no toto difficult password hbe)

        const user = new USER({ name, userName, email, password: hashedPassword });
        // const user = new USER(req.body);



        user.save();
        res.status(200).json({ message: "Registered successfully" })
        console.log("data saved")

    } catch (error) {
        res.status(500).json(error.message);
    }
}


export const signInDetails = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "Please enter youe email or password" });
    }
    try {

        const response = await USER.findOne({ email: email });
        if (!response) { //same  email na thakle db te 
            return res.status(500).json({ error: "Inavlid email" })
        }

        const match = await bcrypt.compare(password, response.password); // 1st para = useremail,2nd inside the db email
        if (match) {
            // return res.status(200).json({ message: "Signed in successfully" });
            const token = jwt.sign({ _id: response.id }, jwt_secret);
            const { _id, name, email, userName } = response;

            res.json({ token, user: { _id, name, email, userName } });

            console.log({ token, user: { _id, name, email, userName } });

        }
        else {
            return res.status(500).json({ error: "Invalid password" });
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }


}

export const postAuthentication = (req, res) => {
    console.log("hello auth")
}



// creatpost Api
export const savePostDetails = async (req, res) => {
    try {
        const { body, pic } = req.body;
        if (!body || !pic) {
            return res.status(422).json({ error: "Please add all the fields" })
        }

        console.log(req.user);
        const post = new POST({
            body,
            photo: pic,
            postedBy: req.user
        })
        const result = await post.save();
        return res.json({ post: result });
    }
    catch (error) {
        console.log(error);
    }
}


export const seeAllPosts = async (req, res) => {
    // kon model theke data access korbo seta likhte hbe
    try {
        // const posts = await POST.find().populate("postedBy"); // .populate() er vitore j field ta dibo model er star detailed data return korbe
        const posts = await POST.find()
            .populate("postedBy", "_id name Photo")
            .populate("comments.postedBy", "_id name")// .populate() er vitore theke specific data bar korle _id r name agulor vitore coma lagbe na
            .sort("-createdAt"); //atar dara leatest post upore asbe

        res.json(posts);
    }
    catch (error) {
        console.log(error);
    }
}

export const profilePosts = (req, res) => { // ata user profile a nijer posts gulo dekhanor jonno

    POST.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name").populate("comments.postedBy", "_id name").sort("-createdAt") //atar dara leatest post upore asbe
        .then(myposts => {
            res.json(myposts)
        })

}
// this is not going to work beacause exec is not used anymore
// export const likeThePosts = (req, res) => {
//     POST.findByIdAndUpdate(req.body.postId, {
//         $push: {
//             likes: req.user._id
//         }
//     }, {
//         new: true
//     }).exec((err, result) => {
//         if (err) {
//             return res.status(422).json({ error: err })
//         } else {
//             res.json(result)
//         }
//     })             // exec is a callback function specially used for update 
// }

export const likeThePosts = async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $push: {
                likes: req.user._id
            }
        }, {
            new: true

        }).populate("postedBy", "_id name Photo")
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }

}

export const unlikeThePosts = async (req, res) => {
    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $pull: {
                likes: req.user._id
            }
        }, {
            new: true

        }).populate("postedBy", "_id name Photo");
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }

}

export const postComment = async (req, res) => {

    const comment = {
        comment: req.body.text,
        postedBy: req.user._id
    }

    try {
        const result = await POST.findByIdAndUpdate(req.body.postId, {
            $push: { comments: comment }
        },
            {
                new: true
            }).populate("comments.postedBy", "_id name").populate("postedBy", "_id name Photo")
        res.json(result);

    }
    catch (err) {
        console.log(err);
    }

}

// Api to delete post
export const deleteProfilesPost = async (req, res) => {
    try {
        const result = await POST.findOne({ _id: req.params.postId }).populate("postedBy", "_id");
        // console.log(result.postedBy._id.toString(), req.user._id.toString())// ata console e object print korbr r object  k compare kora jay na tai string a convert korte hbe

        if (result.postedBy._id.toString() == req.user._id.toString()) {// j post koreche == j delete korte chaiche
            // console.log("matched")
            result.deleteOne().then((response) => {
                return res.json({ Message: "Succefully deleted" })
            }).catch((err) => { console.log(err) })
        }


    } catch (err) {

        return res.status(422).json({ error: err });
    }
};

// to get user profile:
export const getUser = async (req, res) => {

    try {
        const user = await USER.findOne({ _id: req.params.id }).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const post = await POST.find({ postedBy: req.params.id })
            .populate('postedBy', '_id');

        res.status(200).json({ user, post });
    } catch (err) {

        return res.status(500).json({ error: err });
    }
}

//to follow user

export const toFollowUser = async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(req.body.followId, {
            $push: { followers: req.user._id }
        }, {
            new: true
        })

        if (result) {
            const result2 = await USER.findByIdAndUpdate(req.user._id, {
                $push: { following: req.body.followId }
            }, {
                new: true
            })
            res.json(result2);
        }

    }
    catch (err) {
        return res.status(422).json({ error: err })
    }
}

//to unfollow user

export const toUnFollowUser = async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(req.body.followId, {
            $pull: { followers: req.user._id }
        }, {
            new: true
        })

        if (result) {
            const result2 = await USER.findByIdAndUpdate(req.user._id, {
                $pull: { following: req.body.followId }
            }, {
                new: true
            })
            res.json(result2);
        }

    }
    catch (err) {
        return res.status(422).json({ error: err })
    }
}

export const followingPosts = async (req, res) => {
    try {
        const posts = await POST.find({ postedBy: { $in: req.user.following } }) // $in following array theke id r sathe opostbyid r id check korbe if matched hen return the post
            .populate("postedBy", "_id name")
            .populate("comments.postedBy", "_id name")
        res.json(posts);
    }
    catch (err) {
        console.log(err);
    }
}

export const updateProfilePic = async (req, res) => {
    try {
        const result = await USER.findByIdAndUpdate(req.user._id, {
            $set: { Photo: req.body.pic }//set er dara old url will removed and new will added but using push it will store all in an array
        }, {
            new: true
        })
        res.json(result)
    }
    catch (err) {
        res.status(422).json({ error: err });
    }
}
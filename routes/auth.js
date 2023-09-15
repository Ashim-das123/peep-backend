import express from 'express';
import {
    saveSentDetails, signInDetails, postAuthentication, savePostDetails, seeAllPosts, profilePosts, likeThePosts,
    unlikeThePosts, postComment, deleteProfilesPost, getUser, toFollowUser, toUnFollowUser, followingPosts, updateProfilePic
} from '../controller/userController.js';
import { requireLogin } from '../middlewares/requireLogin.js';
const router = express.Router();

router.get('/', (req, res) => {
    res.send("hello from server");
})

router.get("/allposts", requireLogin, seeAllPosts)

router.post('/createPost', requireLogin, savePostDetails)

router.post('/signup', saveSentDetails);

router.post('/signin', signInDetails);

router.get('/myposts', requireLogin, profilePosts);

router.put('/like', requireLogin, likeThePosts);// post details already in the databse now we are adding a likes data so wer upating something thats why put
router.put('/unlike', requireLogin, unlikeThePosts);//

router.put('/comment', requireLogin, postComment)

router.delete('/deletepost/:postId', requireLogin, deleteProfilesPost); // for delete the  profile's posts
// agulo user.js routes----------->

router.get('/user/:id', getUser); // home page a others account a click krle jate seta khule 

// folow route

router.put('/follow', requireLogin, toFollowUser);
router.put('/unfollow', requireLogin, toUnFollowUser);

// to show following posts
router.get('/myfollowingpost', requireLogin, followingPosts)

// to update user profile route
router.put('/uploadProfilePic', requireLogin, updateProfilePic)










export default router;
// module.exports = router;
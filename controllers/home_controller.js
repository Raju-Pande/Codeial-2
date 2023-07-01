const Post = require('../models/post');
const User = require("../models/user");
// module.exports.home = function (req, res) {
// console.log(req.cookies);
// res.cookie('user_id',25);


// post 
//  only here post showing 

// module.exports.home = function (req, res) {
// Post.find({})
//     .then((posts) => {
//         return res.render('home', {
//             title: "Codeail | Home",
//             posts: posts
//         })
//     })
// }

// when you want to every post fetch the user id email id time
// populate the user of each post

//     module.exports.home = function (req, res) {
//     Post.find({})
//         .populate('user')
//         // showing comment on home
//         .populate({
//             path: 'comments',
//             populate: {
//                 path: 'user'
//             }
//         })
//         .exec()
//         .then((posts) => {

//             User.find({})
//             .then((users) => {
//                 return res.render('home', {
//                     title: "Codeial | Home",
//                     posts: posts,
//                     all_users:users
//                 });
//             })

//         })

// }



// Async

module.exports.home = async function (req, res) {

    try {
        // populate the user of each post
        let posts = await Post.find({})
            // letest post first showing Ajax
            .sort('-createdAt')

            .populate('user')
            // showing comment on home
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                },
                 // change:: populate likes of each post and comment
                populate:{
                    path:'likes'
                }
            }).populate('likes');

        let users = await User.find({})
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });

    } catch (err) {
        console.log('Error', err);
        return;
    }
}
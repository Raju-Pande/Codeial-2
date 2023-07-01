//need postSchema to create post
//fetch the postSchema
const Post = require('../models/post');
//importing the comment for deleting
const Comment = require('../models/comment');
//import the like
const Like = require("../models/like");

// promises

// module.exports.create = function (req, res) {
//     Post.create({
//         content: req.body.content,
//         user: req.user._id
//     })
//         .then((post) => {
//             return res.redirect('back');
//         })
//         .catch((err) => {
//             console.log('Error in creating a post');
//             return;
//         })
// }



// async

// if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!


// By using async await
//we are just making views update by just putting the data information fetch by schemaPost
module.exports.create = async function (req, res) {
    try {
        let post = await Post.create({
            //taken the details form the post schema
            content: req.body.content,
            user: req.user._id
        });
//need to check the ajax request
		//set the data to..
        if (req.xhr) {
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await Post.findById(post._id).populate('user');
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post created"
            });
        }

        req.flash('success', 'Post created!');
    } catch (err) {
        console.log('Error:', err);
        req.flash('error', 'Error creating post');
    }

    if (req.xhr) {
        return res.status(500).json({
            error: 'Error creating post'
        });
    }

    return res.redirect('back');
};



// delete post 

// using promise
// module.exports.destroy = function (req, res) {
//     Post.findById(req.params.id)
//         .then((post) => {
//             // .id means converting the object id into string
//             if (post.user == req.user.id) {
//                 post.deleteOne();
//                 Comment.deleteMany({ post: req.params.id })
//                     .then(() => {
//                         return res.redirect('/');
//                     })
//                     .catch((err) => {
//                         return res.redirect('/');
//                     })
//             }
//         })
//         .catch((err) => {
//             return res.redirect('/');
//         });
// } 



// Async
//now need to delete the post and comment to which is associated with the post

module.exports.destroy = async function (req, res) {
    try {
        //before deleting we need to check is it present in dB or not
        const post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {

            // change :: delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            await Like.deleteMany({ _id: { $in: post.comments } })

            //    got to comments_controller.js


            await post.deleteOne();
            //delete the comment also
            const commentD = await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }
            if (commentD) {
                //if deleted
                // req.flash("success", `Post and associated comments deleted! `);
                return res.redirect("back");
            }
        } else {
            //if not match
            req.flash('error', 'You cannot delete this post!');
            return res.redirect("back");
        }
    } catch (err) {
        // console.log(err);
        req.flash("error", `check the error ${err} `);
        return res.redirect("back");
    }
};

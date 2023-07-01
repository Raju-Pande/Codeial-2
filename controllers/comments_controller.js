
const Comment = require('../models/comment');
const Post = require('../models/post');
const commentsMailer = require("../mailers/comments_mailer");
const commentEmailWorker = require('../workers/comment_email_worker');
const queue = require('../config/kue');
const Like = require('../models/like');
// module.exports.create = function (req, res) {
//     Post.findById(req.body.post).then((post) => {
//         Comment.create({
//             content: req.body.content,
//             post: req.body.post,
//             user: req.user._id,
//         }).then((comment) => {
//             post.comments.push(comment);
//             post.save();

//             res.redirect('/');
//         });
//     });
// };



// async

module.exports.create = async function (req, res) {
	try {
		//postSchema id store here
		let post = await Post.findById(req.body.post);
		if (!post) {
			throw new Error('Post not found');
		}
		//if post present the create comment related to it

		let comment = await Comment.create({
			content: req.body.content,
			post: req.body.post,
			user: req.user._id,
		});
		//storing the comment in the dB
		post.comments.push(comment);
		//after storing we need to save it
		await post.save();

		// mailers
		comment = await comment.populate('user', 'name email');

		//here with the help of comment the mail should be send
			// commentsMailer.newComment(comment);//this line need to go inside the queue
			//every task we put into the queue is job
		//3rd  kue
		let job = queue.create('emails', comment).save(function (err) {
			if (err) {
				console.log('Error in sending to the queue', err);
				return;
			}
			//this is available to the user...
			console.log('job enqueued', job.id);

		})
		//ajax call happen there for the dynamic comment done
		if (req.xhr) {
			// Similar for comments to fetch the user's id!
			// comment = await comment.populate('user', 'name')
			return res.status(200).json({
				data: {
					comment: comment,
				},
				message: 'Post created!',
			});
		}

		req.flash('success', 'Comment published!');
		res.redirect('/');
	} catch (err) {
		req.flash('error', err);
		return;
	}
};



// delete comment

// promise

// module.exports.destroy = function (req, res) {
//     Comment.findById(req.params.id).then((comment) => {
//         if (comment.user == req.user.id) {
//             let postId = comment.post;
//             comment.deleteOne();

//             Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } })
//                 .then((post) => {
//                     return res.redirect('/');
//                 })
//                 .catch((err) => {
//                     return res.redirect('/');
//                 })
//         }
//     })
//         .catch((err) => {
//             return res.redirect('/');
//         });
// }


// Async
module.exports.destroy = async function (req, res) {
	try {
		//find the comment which you want to delete
		const comment = await Comment.findById(req.params.id);
		if (!comment) {
			throw new Error('Comment not found');
		}
		//req.user.id is the main id when we signIn /signUP create..........
		if (comment.user.toString() !== req.user.id) {
			req.flash('error', 'Unauthorized');
			return res.redirect('back');
		}

		const postId = comment.post;
		//then we delete it
		await comment.deleteOne();
		await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } });

		// change :: destory the associated likes foe this comment
		await Like.deleteMany({ likeable: comment._id, onModel: 'Comment' })
		// got to the post.ejs


		// send the comment id which was deleted back to the views
		if (req.xhr) {
			return res.status(200).json({
				data: {
					comment_id: req.params.id,
				},
				message: 'Post deleted',
			});
		}

		req.flash('success', 'Comment deleted!');
		res.redirect('back');
	} catch (err) {
		req.flash('error', err.message);
		return;
	}
};

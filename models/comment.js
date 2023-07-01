const mongoose = require("mongoose");


const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        require: true
    },
    // comment belongs to a user through populating
		//user Schema
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
       
    },
    post: {
        			//fetching form the postSchema
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        
    },
    // like
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Like'
        }
    ]
    // got ot the inside controller likes_controller.js
}, {
    timestamps: true
})

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
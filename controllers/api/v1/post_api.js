const Post=require('../../../models/post')
const Comment=require('../../../models/comment')

module.exports.index= async function(req, res){

    let posts = await Post.find({})
            // letest post first showing Ajax
            .sort('-createdAt')

            .populate('user')
            // showing comment on home
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            });
    return res.json(200,{
        message:"List of posts",
        posts:posts
    })
}


module.exports.destroy = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (post.user == req.user.id) {
            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });

            return res.json(200,{
                message:"Post and Associated comments deleted Successfully !"
            });
        } else {
            return res.json(401,{
                message:"You cannot delete this post!"
            })
        }
    } catch (err) {
        console.log("****",err);
        return res.json(500, {
            message:"Internal Server Error"
        });
    }

    
};

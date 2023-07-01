const mongoose=require("mongoose");
const User = require("../models/user")
const fs = require('fs');
const path = require('path');
const ObjectId = mongoose.Types.ObjectId;

// module.exports.profile = function(req, res){
//     return res.render('user_profile', {
//         title: 'User Profile'
//     })
// }


// user profile link
// module.exports.profile = function (req, res) {
//     User.findById(req.params.id)
//         .then((user) => {
//             return res.render('user_profile', {
//                 title: 'User Profile',
//                 profile_user: user
//             });
//         })
// }


module.exports.profile = async function (req, res) {
    try {

        // const userId = ObjectId.isValid(req.params.id) ? req.params.id : undefined;
        console.log("params * ",req.params.id);
        const user = await User.findById(req.params.id);
        

        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    } catch (err) {
        console.log('Error:', err);
        return res.redirect('back');
    }
};

//  update profile name

// module.exports.update=function(req, res){
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id, req.body)
//         .then((user)=>{
//             req.flash('success','Profile Updated!');
//             return res.redirect('back');
//         });
//     }else{
//         return res.status(401).send('Unauthorized')
//     }
// }


// module.exports.update=function(req, res){
//     if(req.user.id == req.params.id){
//         User.findByIdAndUpdate(req.params.id, req.body)
//         .then((user)=>{
//             req.flash('success','Profile Updated!');
//             return res.redirect('back');
//         });
//     }else{
//         return res.status(401).send('Unauthorized')
//     }
// }


// module.exports.update = async function(req, res){


//     if(req.user.id == req.params.id){

//         try{

//             let user = await User.findById(req.params.id);
//             User.uploadedAvatar(req, res, function(err){
//                 if (err) {console.log('*****Multer Error: ', err)}

//                 user.name = req.body.name;
//                 user.email = req.body.email;

//                 if (req.file){

//                     if (user.avatar){
//                         fs.unlinkSync(path.join(__dirname, '..', user.avatar));
//                     }


//                     // this is saving the path of the uploaded file into the avatar field in the user
//                     user.avatar = User.avatarPath + '/' + req.file.filename;
//                 }
//                 user.save();
//                 return res.redirect('back');
//             });

//         }catch(err){
//             req.flash('error', err);
//             return res.redirect('back');
//         }


//     }else{
//         req.flash('error', 'Unauthorized!');
//         return res.status(401).send('Unauthorized');
//     }
// }




try {
    // for update the data
    //now we create a controller so that u can
//update you name and email of the sign in profile...
    module.exports.update = async function (req, res) {
        console.log("***************", req.body)
        //   if (req.user.id == req.params.id) {
        //     User.findByIdAndUpdate(req.params.id, req.body, function (err, user) {
        //       return res.redirect("back");
        //     });
        //   } else {
        //     return res.status(401).send("Unauthorized");
        //   }


        if (req.user.id == req.params.id) {

            let user = await User.findById(req.params.id);

            User.uploadedAvatar(req, res, function (err) {
                if (err) {
                    console.log("*******Multer Error", err);
                }
                console.log(req.file);
                user.name = req.body.name;
                user.email = req.body.email;

                if (req.file) {
//check if user already have the avatar with then or not
					//if present then i remove avatar and uploaded a new one
                    if (user.avatar) {
//true then delete the avatar
						//for deleting we need fs and path modules
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar))

                    }
                    user.avatar = User.avatarPath + "/" + req.file.filename;
                }

                user.save();
                return res.redirect("back");
            });
        }
        else {
            req.flash("error", "unauthorized");

            return res.status(401).send("Unauthorized");
        }
    }
}
catch (err) {
    console.log("error", err);
}





// async





//render the sign up page
//for the render from backend we fetching
//the data from the view file through the ejs
module.exports.signUp = function (req, res) {
// if they already signUP so go to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }


    return res.render('user_sign_up', {
        title: "Codeial | Sign Up"
    })
}


//render thr sign in page
module.exports.signIn = function (req, res) {
// if they already sign in so go to profile page
    if (req.isAuthenticated()) {
        return res.redirect('/user/profile');
    }

    return res.render('user_sign_in', {
        title: "Codeial | Sign In"
    })
}

//get the sign up data
module.exports.create = async function (req, res) {
    try {
        //sign up page
        // 1. Check if password and confirmPassword are equal
        if (req.body.password != req.body.confirm_password) {
            return res.redirect('back');
        }
// 2. Check if the user already exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            // 3. Create the user
            await User.create(req.body);
        }

        return res.redirect('/user/sign-in');
    } catch (err) {
        console.log('Error:', err);
        return res.redirect('back');
    }
};

// sign in and create a session for the user
//now we well deal with create-session playing with signUp data
//sign in and create a session for the user
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully')
    return res.redirect('/');

}

// signout

module.exports.destroySession = function (req, res) {
// before redirecting we need to signOut
    req.logout(req.user, err => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'You Have Logged Out!');
        res.redirect("/");
    });

}
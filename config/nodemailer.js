//import the nodemailer
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");

const env=require('./environment')

//define transporter
//this is then one who send the emails
//this is tha path who define how the communication going to happen
let transporter = nodemailer.createTransport(env.smtp);

let renderTemplate = (data, relativePath) => {
    let mailHTML;//this store what html where send
	//render and showing the result
    ejs.renderFile(
        //where i place the template
		//this relativePath from where mail is called
        path.join(__dirname, '../views/mailers', relativePath),
        data,
        function (err, template) {
            if (err) {
                console.log('error in rendering template', err);
                return;
            }
            mailHTML = template;
        }
    )
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}

// nodemailer
// config
// mailers
// templates
